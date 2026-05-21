import mongoose from 'mongoose';
import Score from '../judging/score.model.js';
import JudgeAssignment from '../judging/judgeAssignment.model.js';
import Submission from '../submissions/submission.model.js';
import { scoreStatusEnums } from '../judging/judging.constants.js';

const AGGREGABLE_STATUSES = [scoreStatusEnums[2]]; // ["approved"]

/**
 * Computes per-submission average scores across all approvable judge submissions.
 * Each returned entry serves as the input to the Ranking Engine.
 */
export const aggregateScoresForHackathon = async (hackathonId) => {
  const totalJudges = await JudgeAssignment.countDocuments({ hackathonId });

  const submissions = await Submission.find({ hackathonId }).lean();

  const scoreGroups = await Score.aggregate([
    {
      $match: {
        hackathonId: new mongoose.Types.ObjectId(hackathonId),
        status: { $in: AGGREGABLE_STATUSES }
      }
    },
    {
      $group: {
        _id: '$submissionId',
        totalScoresSum: { $sum: '$totalScore' },
        scoresCount: { $sum: 1 },
        rawScores: { $push: '$$ROOT' }
      }
    }
  ]);

  const scoreMap = new Map(
    scoreGroups.map(g => [g._id.toString(), g])
  );

  return submissions.map(sub => {
    const ag = scoreMap.get(sub._id.toString());
    const scoresCount = ag ? ag.scoresCount : 0;
    const totalScoresSum = ag ? ag.totalScoresSum : 0;

    return {
      submissionId: sub._id,
      title: sub.title,
      teamId: sub.teamId,
      userId: sub.userId,
      aggregatedScore: scoresCount > 0 ? totalScoresSum / scoresCount : 0,
      scoresCount,
      isComplete: scoresCount === totalJudges && totalJudges > 0,
      rawScores: ag ? ag.rawScores : [],
      totalJudges
    };
  });
};

/**
 * Re-aggregates a single submission after a score is submitted or updated.
 */
export const aggregateScoresForSubmission = async (submissionId, hackathonId) => {
  const totalJudges = await JudgeAssignment.countDocuments({ hackathonId });

  const submission = await Submission.findById(submissionId).lean();
  if (!submission) return null;

  const result = await Score.aggregate([
    {
      $match: {
        submissionId: new mongoose.Types.ObjectId(submissionId),
        status: { $in: AGGREGABLE_STATUSES }
      }
    },
    {
      $group: {
        _id: '$submissionId',
        totalScoresSum: { $sum: '$totalScore' },
        scoresCount: { $sum: 1 },
        rawScores: { $push: '$$ROOT' }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      submissionId,
      title: submission.title,
      userId: submission.userId,
      teamId: submission.teamId,
      aggregatedScore: 0,
      scoresCount: 0,
      isComplete: false,
      totalJudges,
      rawScores: []
    };
  }

  const ag = result[0];
  return {
    submissionId,
    title: submission.title,
    userId: submission.userId,
    teamId: submission.teamId,
    aggregatedScore: ag.totalScoresSum / ag.scoresCount,
    scoresCount: ag.scoresCount,
    isComplete: ag.scoresCount === totalJudges && totalJudges > 0,
    totalJudges,
    rawScores: ag.rawScores
  };
};
