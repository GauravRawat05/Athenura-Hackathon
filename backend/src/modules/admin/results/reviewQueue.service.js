/**
  reviewQueue.service.js
  Business logic for the Admin Review Queue — progress, queue listing,
  draft generation, and queue item resolution.
 */
import mongoose from 'mongoose';
import ApiError from '../../../libs/apiError.js';
import Score from '../../judging/score.model.js';
import JudgeAssignment from '../../judging/judgeAssignment.model.js';
import AdminReviewQueue from './reviewQueue.model.js';
import ResultDraft from './resultDraft.model.js';
import Hackathon from '../../admin/hackathons/hackathon.model.js';
import Submission from '../../submissions/submission.model.js';
import User from '../../users/user.model.js';
import Team from '../../teams/team.model.js';
import { scoreStatus } from '../../judging/judging.constants.js';
import { computeRankings } from '../../results/ranking.service.js';

class ReviewQueueService {

  // ─────────────────────────────────────────────────────────────────
  // GET /admin/results/progress/:hackathonId
  // Returns real-time judging progress metrics.
  // ─────────────────────────────────────────────────────────────────
  async getProgress(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');

    // All unique submission IDs that have at least one score entry
    const scoredSubmissionIds = await Score.distinct('submissionId', {
      hackathonId: new mongoose.Types.ObjectId(hackathonId)
    });

    // Total judge assignments
    const totalJudges = await JudgeAssignment.countDocuments({
      hackathonId: new mongoose.Types.ObjectId(hackathonId)
    });

    // All submissions for this hackathon
    const totalSubmissions = await Submission.countDocuments({
      hackathonId: new mongoose.Types.ObjectId(hackathonId)
    });

    const scoredCount = scoredSubmissionIds.length;

    // Review queue counts by status
    const [pendingQ, approvedQ, rejectedQ] = await Promise.all([
      AdminReviewQueue.countDocuments({ hackathonId, status: 'pending' }),
      AdminReviewQueue.countDocuments({ hackathonId, status: 'approved' }),
      AdminReviewQueue.countDocuments({ hackathonId, status: 'rejected' })
    ]);
    const totalInQueue = pendingQ + approvedQ + rejectedQ;

    // Whether a result draft exists (and its locked state)
    const draftRecord = await ResultDraft.findOne({ hackathonId });
    const hasDraft = !!draftRecord;
    const draftLocked = draftRecord?.isLocked || false;

    // Completion percentage
    const completionPercent = totalSubmissions > 0
      ? Math.round((scoredCount / totalSubmissions) * 100)
      : 0;

    return {
      hackathonId,
      hackathonTitle: hackathon.title,
      hackathonStatus: hackathon.status,
      resultsPublished: hackathon.resultsPublished || false,
      scoring: {
        totalSubmissions,
        scoredCount,
        completionPercent
      },
      reviewQueue: {
        total: totalInQueue,
        pending: pendingQ,
        approved: approvedQ,
        rejected: rejectedQ
      },
      draft: {
        hasDraft,
        isLocked: draftLocked
      },
      scoringComplete: totalJudges > 0 && scoredCount >= totalJudges
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // GET /admin/review-queue
  // ────────────────────────────────────────────────────────────────
  async getQueueItems({ hackathonId, status, page = 1, limit = 20 }) {
    if (!hackathonId) throw new ApiError(400, 'hackathonId is required');

    const skip = (page - 1) * limit;
    const query = { hackathonId: new mongoose.Types.ObjectId(hackathonId) };
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      AdminReviewQueue
        .find(query)
        .populate('judgeId', 'fullName email')
        .populate('submissionId', 'title teamId')
        .populate('hackathonId', 'title status resultsPublished')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AdminReviewQueue.countDocuments(query)
    ]);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /admin/results/draft/:hackathonId
  // Generates ResultDraft records from all approved queue items,
  // using the central ranking engine and capturing participant snapshots.
  // ─────────────────────────────────────────────────────────────────
  async generateDraft(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');
    if (hackathon.resultsPublished) {
      throw new ApiError(400, 'Results already published');
    }

    const approvedIds = await AdminReviewQueue.distinct('submissionId', {
      hackathonId: new mongoose.Types.ObjectId(hackathonId),
      status: 'approved'
    });

    if (approvedIds.length === 0) {
      throw new ApiError(400, 'No approved scores available. Please resolve and approve scores in the review queue first.');
    }

    // Fetch full submissions for approved IDs — includes user + team for snapshots
    const submissions = await Submission.find({
      _id: { $in: approvedIds }
    })
      .populate({ path: 'userId', select: 'fullName email collegeOrUniversity' })
      .populate({ path: 'teamId', select: 'teamName' })
      .lean();

    // Compute per-submission average from APPROVED scores only
    const aggResult = await Score.aggregate([
      {
        $match: {
          submissionId: { $in: approvedIds.map(id => new mongoose.Types.ObjectId(id)) },
          status: scoreStatus.APPROVED
        }
      },
      {
        $group: {
          _id: '$submissionId',
          totalScoresSum: { $sum: '$totalScore' },
          scoresCount: { $sum: 1 }
        }
      }
    ]);

    const scoreMap = new Map();
    aggResult.forEach(ag => {
      scoreMap.set(ag._id.toString(), {
        aggregatedScore: ag.scoresCount > 0 ? ag.totalScoresSum / ag.scoresCount : 0
      });
    });

    // Remove old drafts before writing fresh ones
    await ResultDraft.deleteMany({
      hackathonId: new mongoose.Types.ObjectId(hackathonId)
    });

    // Build draft records with participant snapshots
    const draftRecords = submissions.map(sub => {
      const userData = sub.userId;
      const teamData = sub.teamId;
      const scoreData = scoreMap.get(sub._id.toString());

      return {
        hackathonId,
        submissionId: sub._id,
        userId: typeof userData === 'object' && userData ? userData._id : sub.userId,
        teamId: typeof teamData === 'object' && teamData ? teamData._id : sub.teamId,
        score: scoreData ? scoreData.aggregatedScore : 0,
        rank: 0,
        awardCategory: 'Participant',
        award: 'Participant',
        isWinner: false,
        manualRankOverride: undefined,
        isLocked: false,
        notes: '',
        participantSnapshot: {
          fullName: typeof userData === 'object' && userData ? (userData.fullName || 'Unknown') : 'Unknown',
          email: typeof userData === 'object' && userData ? (userData.email || '') : '',
          collegeOrUniversity: typeof userData === 'object' && userData ? (userData.collegeOrUniversity || '') : '',
          teamName: typeof teamData === 'object' && teamData ? (teamData.teamName || '') : '',
          photoUrl: '',
          mode: teamData ? 'team' : 'solo'
        }
      };
    });

    // Rank via central ranking engine
    const rankInput = draftRecords.map(d => ({
      submissionId: d.submissionId,
      aggregatedScore: d.score,
      userId: d.userId,
      teamId: d.teamId
    }));
    const { rankedResults, unresolvedTies } = computeRankings(rankInput);

    const rankedMap = new Map();
    rankedResults.forEach(r => rankedMap.set(r.submissionId.toString(), r));

    const finalDrafts = draftRecords.map(d => {
      const ranked = rankedMap.get(d.submissionId.toString());
      const r = ranked?.rank || 0;
      return {
        ...d,
        rank: r,
        awardCategory: r === 1 ? 'First Prize'
          : r === 2 ? 'Second Prize'
          : r === 3 ? 'Third Prize'
          : 'Participant',
        award: r <= 3 ? 'Winner' : 'Participant',
        isWinner: r <= 3
      };
    });

    await ResultDraft.insertMany(finalDrafts);

    return {
      success: true,
      computedCount: finalDrafts.length,
      unresolvedTies,
      hackathonId
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // PATCH /admin/results/draft/:hackathonId
  // Applies manual rank overrides to an existing draft.
  // ─────────────────────────────────────────────────────────────────
  async updateDraft(hackathonId, { draftId, manualOrder, rankOverride } = {}) {
    if (draftId) {
      // Single record override
      const draft = await ResultDraft.findOne({ hackathonId, _id: draftId });
      if (!draft) throw new ApiError(404, 'Draft record not found');
      if (draft.isLocked) throw new ApiError(400, 'Draft is locked and cannot be modified');

      const updatedFields = { updatedAt: new Date() };
      if (rankOverride !== undefined) {
        updatedFields.rank = rankOverride;
        updatedFields.isWinner = rankOverride <= 3;
        if (rankOverride === 1) updatedFields.awardCategory = 'First Prize';
        else if (rankOverride === 2) updatedFields.awardCategory = 'Second Prize';
        else if (rankOverride === 3) updatedFields.awardCategory = 'Third Prize';
        else updatedFields.awardCategory = 'Participant';
        updatedFields.award = rankOverride <= 3 ? 'Winner' : 'Participant';
      }

      await ResultDraft.findByIdAndUpdate(draftId, updatedFields);
      return { success: true, hackathonId, draftId };
    }

    // Full manual reorder — first item = rank 1
    if (Array.isArray(manualOrder) && manualOrder.length > 0) {
      const isLockedRecord = await ResultDraft.findOne({
        hackathonId: new mongoose.Types.ObjectId(hackathonId),
        isLocked: true
      });
      if (isLockedRecord) throw new ApiError(400, 'Draft is locked and cannot be reordered');

      for (let idx = 0; idx < manualOrder.length; idx++) {
        const submissionId = manualOrder[idx];
        const cat = idx === 0 ? 'First Prize'
          : idx === 1 ? 'Second Prize'
          : idx === 2 ? 'Third Prize'
          : 'Participant';
        await ResultDraft.findOneAndUpdate(
          {
            hackathonId: new mongoose.Types.ObjectId(hackathonId),
            submissionId: new mongoose.Types.ObjectId(submissionId),
            isLocked: false
          },
          {
            rank: idx + 1,
            isWinner: idx < 3,
            awardCategory: cat,
            award: idx < 3 ? 'Winner' : 'Participant',
            updatedAt: new Date()
          }
        );
      }

      return { success: true, hackathonId, reorderedCount: manualOrder.length };
    }

    throw new ApiError(400, 'Provide either draftId + rankOverride or manualOrder (array of submissionIds)');
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /admin/review-queue/:queueId/resolve
  // Resolves a pending queue item to 'approved' or 'rejected'.
  // Sets the underlying Score status at the same time.
  // ─────────────────────────────────────────────────────────────────
  async resolveQueueItem(queueId, { status, adminComment, adminId, expectedResolvedQueueVersion }, actorId) {
    const item = await AdminReviewQueue.findById(queueId);
    if (!item) throw new ApiError(404, 'Review queue item not found');

    if (item.status !== 'pending') {
      throw new ApiError(400, `Item is already ${item.status}`);
    }

    if (!['approved', 'rejected'].includes(status)) {
      throw new ApiError(400, "status must be 'approved' or 'rejected'");
    }

    const resolvedById = actorId || adminId;
    if (!resolvedById) {
      throw new ApiError(400, 'actorId is required');
    }

    // Prevent self-approval: actor (admin) must not be the judge for this queue item
    if (item.judgeId && item.judgeId.toString() === resolvedById.toString()) {
      throw new ApiError(403, 'Self-approval is not allowed');
    }

    // Stale-UI protection (optimistic check)
    // If client provides expectedResolvedQueueVersion, ensure it matches current item version.
    const currentQueueVersion = item.resolvedQueueVersion ?? 0;
    if (expectedResolvedQueueVersion !== undefined && Number(expectedResolvedQueueVersion) !== Number(currentQueueVersion)) {
      throw new ApiError(409, 'Queue item has changed. Refresh and try again.');
    }

    const nextQueueVersion = currentQueueVersion + 1;

    await Score.findByIdAndUpdate(
      item.scoreId,
      { status: status === 'approved' ? scoreStatus.APPROVED : scoreStatus.REJECTED }
    );

    const updated = await AdminReviewQueue.findOneAndUpdate(
      { _id: queueId, status: 'pending', resolvedQueueVersion: currentQueueVersion },
      {
        $set: {
          status,
          adminComment: adminComment || '',
          resolvedBy: resolvedById,
          resolvedAt: new Date()
        },
        $inc: { resolvedQueueVersion: 1 },
        $setOnInsert: { resolutionVersion: 0 }
      },
      { new: true }
    );

    if (!updated) {
      throw new ApiError(409, 'Queue item could not be resolved due to concurrent update.');
    }

    return updated;
  }

  // Alias kept for backward compat
  async getProgressService(hackathonId) {
    return this.getProgress(hackathonId);
  }
}

const reviewQueueService = new ReviewQueueService();
export default reviewQueueService;
