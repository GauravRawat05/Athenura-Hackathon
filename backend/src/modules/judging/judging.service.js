/**
  judging.service.js
  Business logic for judge assignment and scoring.
  After the blueprint refactor: submitted scores are placed in the AdminReviewQueue
  with status 'under_review' instead of being auto-approved.
 */
import mongoose from 'mongoose';
import judgingRepository from "./judging.repository.js";
import judgingPolicy from "./judging.policy.js";
import Hackathon from "../admin/hackathons/hackathon.model.js";
import JudgeAssignment from "./judgeAssignment.model.js";
import User from "../users/user.model.js";
import Submission from "../submissions/submission.model.js";
import AdminReviewQueue from "../admin/results/reviewQueue.model.js";
import ApiError from "../../libs/apiError.js";
import { aggregateScoresForSubmission, aggregateScoresForHackathon } from '../results/aggregation.service.js';
import { userRoles } from "../users/user.constants.js";
import { scoreStatus } from "./judging.constants.js";

class JudgingService {
  async getAllJudges() {
    return await User.find({ role: userRoles.JUDGE }).select("fullName email _id");
  }

  async assignJudges(hackathonId, judgeIds, adminId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      throw new ApiError(404, "Hackathon not found");
    }

    const judges = await User.find({ _id: { $in: judgeIds }, role: userRoles.JUDGE });
    if (judges.length !== judgeIds.length) {
      throw new ApiError(400, "One or more invalid judge IDs, or user is not a Judge");
    }

    const assignments = judgeIds.map((id) => ({
      judgeId: id,
      hackathonId,
      assignedBy: adminId
    }));

    const existingPairs = await JudgeAssignment.find({
      judgeId: { $in: judgeIds },
      hackathonId
    }).select("judgeId");
    const alreadyAssignedSet = new Set(existingPairs.map(a => a.judgeId.toString()));

    const newAssignments = assignments.filter(a => !alreadyAssignedSet.has(a.judgeId.toString()));

    if (newAssignments.length === 0) {
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
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      throw new ApiError(404, "Hackathon not found");
    }

    if (hackathon.submissionDeadline && new Date(hackathon.submissionDeadline) > Date.now()) {
      throw new ApiError(403, "Judging period has not started yet. Please wait until the submission deadline has passed.");
    }

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
    if (!submission) throw new ApiError(404, "Submission not found");

    if (submission.hackathonId.toString() !== hackathonId.toString()) {
      throw new ApiError(400, "Submission does not belong to this hackathon");
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, "Hackathon not found");

    if (hackathon.submissionDeadline && new Date(hackathon.submissionDeadline) > Date.now()) {
      throw new ApiError(400, "Cannot submit scores before the submission deadline has passed");
    }

    const assignment = await judgingRepository.findAssignment(judgeId, hackathonId);
    if (!judgingPolicy.isAssignedJudge(assignment)) {
      throw new ApiError(403, "You are not assigned to this hackathon");
    }

    const existingScore = await judgingRepository.findScoreByJudgeAndSubmission(judgeId, submissionId);
    if (existingScore) {
      throw new ApiError(409, "You have already scored this submission");
    }

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

    // Create the score record — it starts as 'submitted' (under admin review)
    const newScore = await judgingRepository.createScore({
      judgeId,
      submissionId,
      hackathonId,
      criterionScores,
      feedback: scoreData.feedback,
      status: scoreStatus.SUBMITTED   // goes to AdminReviewQueue, NOT auto-approved
    });

    // Add to AdminReviewQueue — requires admin approval before the score
    // can be used in aggregation/rankings
    await AdminReviewQueue.create({
      hackathonId: new mongoose.Types.ObjectId(hackathonId),
      submissionId: new mongoose.Types.ObjectId(submissionId),
      judgeId: new mongoose.Types.ObjectId(judgeId),
      scoreId: newScore._id,
      scoreRecommendation: {
        criterionScores,
        totalScore: newScore.totalScore,
        feedback: scoreData.feedback || ''
      },
      status: 'pending'
    });

    return newScore;
  }

  async updateScore(scoreId, judgeId, updateData) {
    const score = await judgingRepository.findScoreById(scoreId);
    if (!score) throw new ApiError(404, "Score not found");

    if (!judgingPolicy.isScoreOwner(score, judgeId)) {
      throw new ApiError(403, "You are not authorized to update this score");
    }

    if (updateData.criterionScores) {
      const hackathon = await Hackathon.findById(score.hackathonId);
      const judgingCriteria = hackathon.judgingCriteria || [];

      const newCriterionScores = [];
      for (const criterion of judgingCriteria) {
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

    if (updateData.feedback !== undefined) score.feedback = updateData.feedback;

    // Revert to 'submitted' — an update requires another round of admin review
    score.status = scoreStatus.SUBMITTED;

    // Revert queue item back to pending so admin can re-review
    await AdminReviewQueue.findOneAndUpdate(
      { scoreId: score._id },
      {
        status: 'pending',
        adminComment: 'Score updated by judge — re-queued for review',
        resolvedBy: null,
        resolvedAt: null
      }
    );

    const savedScore = await judgingRepository.saveScore(score);

    // Refresh submission aggregate with the (still non-approved) score
    await aggregateScoresForSubmission(savedScore.submissionId, savedScore.hackathonId);

    return savedScore;
  }
}

const judgingService = new JudgingService();
export default judgingService;
