import mongoose from 'mongoose';
import Score from '../judging/score.model.js';
import JudgeAssignment from '../judging/judgeAssignment.model.js';
import Submission from '../submissions/submission.model.js';

export const aggregateScoresForHackathon = async (hackathonId) => {
  const totalJudges = await JudgeAssignment.countDocuments({ hackathonId });

  // Get all submissions for the hackathon
  const submissions = await Submission.find({ hackathonId, status: "Submitted" }).lean();
  
  // Aggregate scores
  const results = await Score.aggregate([
    { $match: { hackathonId: new mongoose.Types.ObjectId(hackathonId), status: { $in: ["Submitted", "Updated"] } } },
    {
      $group: {
        _id: "$submissionId",
        totalScoresSum: { $sum: "$totalScore" },
        scoresCount: { $sum: 1 },
        scores: { $push: "$$ROOT" }
      }
    }
  ]);

  const aggregatedResults = submissions.map(sub => {
    const subScores = results.find(r => r._id.toString() === sub._id.toString());
    const scoresCount = subScores ? subScores.scoresCount : 0;
    const totalScoresSum = subScores ? subScores.totalScoresSum : 0;
    
    return {
      submissionId: sub._id,
      title: sub.title,
      teamId: sub.teamId,
      userId: sub.userId,
      aggregatedScore: scoresCount > 0 ? totalScoresSum / scoresCount : 0,
      scoresCount,
      isComplete: scoresCount === totalJudges && totalJudges > 0,
      rawScores: subScores ? subScores.scores : [],
      totalJudges
    };
  });

  return aggregatedResults;
};

export const aggregateScoresForSubmission = async (submissionId, hackathonId) => {
  const totalJudges = await JudgeAssignment.countDocuments({ hackathonId });

  const result = await Score.aggregate([
    { $match: { submissionId: new mongoose.Types.ObjectId(submissionId), status: { $in: ["Submitted", "Updated"] } } },
    {
      $group: {
        _id: "$submissionId",
        totalScoresSum: { $sum: "$totalScore" },
        scoresCount: { $sum: 1 },
        scores: { $push: "$$ROOT" }
      }
    }
  ]);

  if (result.length === 0) return null;

  const subScores = result[0];
  return {
    submissionId,
    aggregatedScore: subScores.totalScoresSum / subScores.scoresCount,
    scoresCount: subScores.scoresCount,
    isComplete: subScores.scoresCount === totalJudges && totalJudges > 0,
    rawScores: subScores.scores,
    totalJudges
  };
};
