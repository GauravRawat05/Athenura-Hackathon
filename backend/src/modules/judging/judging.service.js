/**
  judging.service.js
  Business logic for judge assignment and scoring.
 */

import judgingRepository from "./judging.repository.js";
import judgingPolicy from "./judging.policy.js";
import Hackathon from "../admin/hackathons/hackathon.model.js";
import JudgeAssignment from "./judgeAssignment.model.js";
import User from "../users/user.model.js";
import Submission from "../submissions/submission.model.js";
import ApiError from "../../libs/apiError.js";
import { aggregateScoresForSubmission } from '../results/aggregation.service.js';

class JudgingService {
  async getAllJudges() {
    return await User.find({ role: "Judge" }).select("fullName email _id");
  }

  async assignJudges(hackathonId, judgeIds, adminId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      throw new ApiError(404, "Hackathon not found");
    }

    const judges = await User.find({ _id: { $in: judgeIds }, role: "Judge" });
    if (judges.length !== judgeIds.length) {
      throw new ApiError(400, "One or more invalid judge IDs, or user is not a Judge");
    }

    // Build the assignment documents for all provided judge IDs
    const assignments = judgeIds.map((id) => ({
      judgeId: id,
      hackathonId,
      assignedBy: adminId
    }));

    // Pre-check: find any that already exist before inserting so we can give a stable,
    // reliable count of previously-assigned judges regardless of the Mongoose version
    // or the internal shape of the raw 11000 error object.
    const existingPairs = await JudgeAssignment.find({
      judgeId: { $in: judgeIds },
      hackathonId
    }).select("judgeId");
    const alreadyAssignedSet = new Set(existingPairs.map(a => a.judgeId.toString()));

    // Only attempt to insert genuinely-new ones — no duplicates ever make it to
    // insertMany, so there is nothing left for the catch-block to guess about.
    const newAssignments = assignments.filter(a => !alreadyAssignedSet.has(a.judgeId.toString()));

    if (newAssignments.length === 0) {
      // Every judge was already assigned — return a clear 409 instead of
      // silently counting on an implementation detail of Mongoose error objects.
      throw new ApiError(409, "All provided judges are already assigned to this hackathon");
    }

    await JudgeAssignment.insertMany(newAssignments, { ordered: false });

    return {
      assigned: newAssignments.length,
      alreadyAssigned: alreadyAssignedSet.size,
      hackathonId
    };
  }

  async getJudgeAssignments(judgeId) {
    return await judgingRepository.findAssignmentsByJudge(judgeId);
  }

  async getSubmissionsForJudge(hackathonId, judgeId) {
    const assignment = await judgingRepository.findAssignment(judgeId, hackathonId);
    if (!judgingPolicy.isAssignedJudge(assignment)) {
      throw new ApiError(403, "You are not assigned to this hackathon");
    }

    const submissions = await Submission.find({ hackathonId })
      .populate("userId", "fullName email")
      .populate("teamId", "teamName");

    // Optimize: Fetch all scores for this judge and hackathon in one go
    const judgeScores = await judgingRepository.findScoresByJudgeAndHackathon(judgeId, hackathonId);
    const scoredSubmissionMap = new Map();
    judgeScores.forEach(score => {
      scoredSubmissionMap.set(score.submissionId.toString(), score);
    });

    // Map submissions and mark if scored
    const scoredSubmissions = [];
    for (const sub of submissions) {
      const score = scoredSubmissionMap.get(sub._id.toString());
      scoredSubmissions.push({
        ...sub.toObject(),
        scored: !!score,
        scoreId: score ? score._id : null
      });
    }
    return scoredSubmissions;
  }

  async submitScore(submissionId, judgeId, hackathonId, scoreData) {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new ApiError(404, "Submission not found");
    }

    if (submission.hackathonId.toString() !== hackathonId.toString()) {
      throw new ApiError(400, "Submission does not belong to this hackathon");
    }

    const assignment = await judgingRepository.findAssignment(judgeId, hackathonId);
    if (!judgingPolicy.isAssignedJudge(assignment)) {
      throw new ApiError(403, "You are not assigned to this hackathon");
    }

    const existingScore = await judgingRepository.findScoreByJudgeAndSubmission(judgeId, submissionId);
    if (existingScore) {
      throw new ApiError(409, "You have already scored this submission");
    }

    const hackathon = await Hackathon.findById(hackathonId);
    const judgingCriteria = hackathon.judgingCriteria || [];

    // Validate and map scores to criteria weights
    const criterionScores = [];
    for (const criterion of judgingCriteria) {
      const submittedScore = scoreData.criterionScores.find(
        (cs) => cs.criterionName === criterion.name
      );

      if (!submittedScore) {
        throw new ApiError(400, `Missing score for criterion: ${criterion.name}`);
      }

      criterionScores.push({
        criterionName: criterion.name,
        score: submittedScore.score,
        weight: criterion.weight
      });
    }

    const newScore = await judgingRepository.createScore({
      judgeId,
      submissionId,
      hackathonId,
      criterionScores,
      feedback: scoreData.feedback,
      status: "Submitted"
    });

    // Wire Automatic Updates
    await aggregateScoresForSubmission(submissionId, hackathonId);

    return newScore;
  }

  async updateScore(scoreId, judgeId, updateData) {
    const score = await judgingRepository.findScoreById(scoreId);
    if (!score) {
      throw new ApiError(404, "Score not found");
    }

    if (!judgingPolicy.isScoreOwner(score, judgeId)) {
      throw new ApiError(403, "You are not authorized to update this score");
    }

    if (updateData.criterionScores) {
      const hackathon = await Hackathon.findById(score.hackathonId);
      const judgingCriteria = hackathon.judgingCriteria || [];

      const newCriterionScores = [];
      for (const criterion of judgingCriteria) {
        // If not provided in update, keep the old one
        const submittedScore = updateData.criterionScores.find(
          (cs) => cs.criterionName === criterion.name
        );

        if (submittedScore) {
          newCriterionScores.push({
            criterionName: criterion.name,
            score: submittedScore.score,
            weight: criterion.weight
          });
        } else {
          // Keep existing
          const existing = score.criterionScores.find((cs) => cs.criterionName === criterion.name);
          if (existing) {
             newCriterionScores.push(existing);
          } else {
             throw new ApiError(400, `Missing score for criterion: ${criterion.name}`);
          }
        }
      }
      score.criterionScores = newCriterionScores;
    }

    if (updateData.feedback !== undefined) {
      score.feedback = updateData.feedback;
    }

    score.status = "Updated";
    
    const savedScore = await judgingRepository.saveScore(score);

    // Wire Automatic Updates
    await aggregateScoresForSubmission(score.submissionId, score.hackathonId);

    return savedScore;
  }
}

const judgingService = new JudgingService();
export default judgingService;
