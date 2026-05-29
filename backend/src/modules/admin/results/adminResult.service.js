/**
  adminResult.service.js
  Business logic for Admin Result management:
    Progress view, draft operations, publish, CRUD.
  */
import mongoose from 'mongoose';
import ApiError from '../../../libs/apiError.js';
import reviewQueueService from './reviewQueue.service.js';
import reviewQueueRepository from './reviewQueue.repository.js';
import ResultDraft from './resultDraft.model.js';
import Hackathon from '../../admin/hackathons/hackathon.model.js';
import Result from '../../results/result.model.js';
import { publishFinalResults } from '../../results/publish.service.js';
import { scoreStatus } from '../../judging/judging.constants.js';
import {
  emitRankingUpdated,
  emitDraftReady,
  emitResultsPublished,
  emitProgressUpdate
} from '../../../sockets/publisher/socket.publisher.js';

// Helper to derive award category from rank
const getAwardCategoryFromRank = (rank) => {
  if (rank === 1) return 'First Prize';
  if (rank === 2) return 'Second Prize';
  if (rank === 3) return 'Third Prize';
  return 'Participant';
};

class AdminResultService {

  // ─────────────────────────────────────────────────────────────────
  // Progress
  // ─────────────────────────────────────────────────────────────────

  async getProgress(hackathonId) {
    return reviewQueueService.getProgressService(hackathonId);
  }

  // ─────────────────────────────────────────────────────────────────
  // Draft
  // ─────────────────────────────────────────────────────────────────

  async generateDraft(hackathonId) {
    return reviewQueueService.generateDraft(hackathonId);
  }

  // Alias maintained for backward compatibility with existing controller calls
  async computeAndSaveDraftResults(hackathonId) {
    return this.generateDraft(hackathonId);
  }

  async updateDraft(hackathonId, { draftId, manualOrder, rankOverride } = {}) {
    const oHId = new mongoose.Types.ObjectId(hackathonId);

    if (draftId !== undefined) {
      if (!mongoose.isValidObjectId(draftId)) throw new ApiError(400, 'Invalid draftId format');
      const draft = await ResultDraft.findOne({ hackathonId: oHId, _id: draftId });
      if (!draft) throw new ApiError(404, 'Draft record not found');
      if (draft.isLocked) throw new ApiError(400, 'Draft is locked and cannot be modified');

      if (rankOverride !== undefined) {
        draft.rank = rankOverride;
        draft.isWinner = rankOverride <= 3;
        draft.awardCategory = rankOverride === 1 ? 'First Prize'
          : rankOverride === 2 ? 'Second Prize'
          : rankOverride === 3 ? 'Third Prize'
          : 'Participant';
        draft.award = rankOverride <= 3 ? 'Winner' : 'Participant';

        await draft.save();

        // ── Real-time socket push (single record override) ───────────────────
        emitRankingUpdated(hackathonId, {
          hackathonId:   hackathonId.toString(),
          source:        'draft_updated',
          updated:       [draft.submissionId.toString()],
          rankOverride
        });
        emitDraftReady(hackathonId, {
          hackathonId:   hackathonId.toString(),
          draftId:       draft._id.toString(),
          updatedRank:   draft.rank
        });

        return draft;
      }

      return draft;
    }

    // Full manual reorder — first submissionId = rank 1
    if (Array.isArray(manualOrder) && manualOrder.length > 0) {
      const lockedDraft = await ResultDraft.findOne({
        hackathonId: oHId,
        isLocked: true
      });
      if (lockedDraft) throw new ApiError(400, 'Draft is locked and cannot be reordered');

      for (let idx = 0; idx < manualOrder.length; idx++) {
        const submissionId = new mongoose.Types.ObjectId(manualOrder[idx]);
        const cat = idx === 0 ? 'First Prize'
          : idx === 1 ? 'Second Prize'
          : idx === 2 ? 'Third Prize'
          : 'Participant';
        await ResultDraft.findOneAndUpdate(
          {
            hackathonId: oHId,
            submissionId: submissionId,
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

      // ── Real-time socket push (bulk reorder) ────────────────────────────────────
      emitRankingUpdated(hackathonId, {
        hackathonId:    hackathonId.toString(),
        source:         'draft_reordered',
        totalEntries:   manualOrder.length
      });
      emitDraftReady(hackathonId, {
        hackathonId:    hackathonId.toString(),
        reorderedCount: manualOrder.length
      });

      return { success: true, hackathonId, reorderedCount: manualOrder.length };
    }

    throw new ApiError(400, 'Provide either draftId + rankOverride or manualOrder (array of submissionIds)');
  }

  // ─────────────────────────────────────────────────────────────────
  // CRUD stubs — now real queries into Result model
  // ─────────────────────────────────────────────────────────────────

  async listResults({ page = 1, limit = 20, hackathonId, status }) {
    const query = {};
    if (hackathonId) query.hackathonId = new mongoose.Types.ObjectId(hackathonId);
    if (status) query.isPublished = status === 'published';

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Result.find(query)
        .populate('userId', 'fullName email')
        .populate('teamId', 'teamName')
        .populate('hackathonId', 'title')
        .sort({ rank: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Result.countDocuments(query)
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getResultById(resultId) {
    if (!mongoose.isValidObjectId(resultId)) throw new ApiError(400, 'Invalid resultId format');
    return Result.findById(resultId)
      .populate('userId', 'fullName email')
      .populate('teamId', 'teamName')
      .lean();
  }

  async createResult(data) {
    const { submissionId, hackathonId, rank, score, awardCategory } = data;
    const created = await Result.create({
      submissionId,
      hackathonId,
      rank: rank || 0,
      score: score || 0,
      awardCategory: awardCategory || 'Participant',
      award: rank && rank <= 3 ? 'Winner' : 'Participant',
      isWinner: !!(rank && rank <= 3),
      isPublished: false
    });
    return created.toObject();
  }

  async updateResult(resultId, updateData) {
    if (!mongoose.isValidObjectId(resultId)) throw new ApiError(400, 'Invalid resultId format');

    const allowed = {};
    if (updateData.rank !== undefined) allowed.rank = updateData.rank;
    if (updateData.score !== undefined) allowed.score = updateData.score;
    if (updateData.awardCategory !== undefined) {
      allowed.awardCategory = updateData.awardCategory;
      allowed.award = ['First Prize', 'Second Prize', 'Third Prize'].includes(updateData.awardCategory) ? 'Winner' : 'Participant';
      allowed.isWinner = updateData.awardCategory !== 'Participant';
    }

    const updated = await Result.findByIdAndUpdate(resultId, allowed, { new: true, lean: true });
    return updated;
  }

  // ─────────────────────────────────────────────────────────────────
  // Publish — now wrapped in a MongoDB session/transaction
  // ─────────────────────────────────────────────────────────────────

  /**
   * POST /admin/results/publish/:hackathonId
   * Atomically:
   *   1. Marks hackathon as locked  (prevents concurrent draft edits)
   *   2. Copies every ResultDraft into the immutable Result table
   *   3. Sets isPublished=true on all new Result records
   *   4. Sets hackathon.resultsPublished = true
   *   5. Clears all ResultDraft records for this hackathon
   * All steps succeed or the entire transaction rolls back.
   */
  async publishResults(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');
    if (hackathon.resultsPublished) {
      throw new ApiError(400, 'Results already published');
    }

    if (hackathon.endDate && new Date(hackathon.endDate) > new Date()) {
      throw new ApiError(400, 'Cannot publish results before the hackathon has ended');
    }

    // Load the draft records
    const existingDrafts = await ResultDraft.find({ hackathonId }).lean();

    if (existingDrafts.length === 0) {
      throw new ApiError(400, 'No computed results found. Please generate a draft first.');
    }

    // Detect ties in top-3 ranks (same rank >1 entries)
    const rankCounts = {};
    let hasTies = false;
    existingDrafts.forEach(draft => {
      if (draft.rank <= 3) {
        rankCounts[draft.rank] = (rankCounts[draft.rank] || 0) + 1;
        if (rankCounts[draft.rank] > 1) hasTies = true;
      }
    });
    if (hasTies) {
      throw new ApiError(400, 'Cannot publish: Unresolved ties exist in top ranks. Please override ranks to resolve ties.');
    }

    // ── MongoDB Transaction ────────────────────────────────────────
    // All writes below run inside a single atomic session:
    //   • hackathon.resultsPublished = true   (gate — no more publishes after)
    //   • Result records created (immutable snapshots)
    //   • ResultDraft records deleted
    //   • publishFinalResults side-effect (cert jobs, emails)
    //
    // If any step fails the session is aborted and NO state is partially written.
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // 1. Lock the hackathon — further draft edits will be blocked by isLocked checks
      await Hackathon.findByIdAndUpdate(
        hackathonId,
        { resultsPublished: true, isLocked: true },
        { session }
      );

      // 2. Write immutable Result snapshots
      const resultRecords = existingDrafts.map(draft => ({
        userId: draft.userId,
        hackathonId: new mongoose.Types.ObjectId(hackathonId),
        teamId: draft.teamId,
        submissionId: draft.submissionId,
        rank: draft.rank,
        score: draft.score,
        awardCategory: draft.awardCategory,
        award: draft.award,
        isWinner: draft.isWinner,
        isPublished: true,
        date: new Date(),
        certificateStatus: 'pending',
        notificationStatus: 'pending'
      }));

      const insertedResults = await Result.insertMany(resultRecords, { session });

      // 3. Clear ResultDraft — it is a transient drafting layer
      await ResultDraft.deleteMany({ hackathonId }, { session });

      // 4. Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Side-effect progress gate
      await Hackathon.findByIdAndUpdate(hackathonId, { publishStatus: 'db_committed' });

      // 5. Publish side-effects (certificates, emails) — OUTSIDE the transaction
      // so that a long-running side-effect does not hold the DB lock.
      // Side-effects are handled asynchronously by jobs (certificates + emails).
      // If jobs crash mid-way, the next admin/public attempt can re-trigger.
      await publishFinalResults(hackathonId, insertedResults.map((r, i) => ({
        ...existingDrafts[i],
        ...r
      })));

      // NOTE: publishFinalResults currently triggers certificate/email jobs fire-and-forget.
      // We do NOT mark side_effects_complete here to avoid UI/state divergence.
      // publishStatus will remain at 'db_committed' until we add/implement a strict side-effect completion signal.
      // await Hackathon.findByIdAndUpdate(hackathonId, { publishStatus: 'side_effects_complete' });


      // ── Real-time socket push ────────────────────────────────────────
      emitResultsPublished(hackathonId, {
        hackathonId:              hackathonId.toString(),
        totalResultsPublished:    insertedResults.length,
        publishedAt:              new Date()
      });
      emitProgressUpdate(hackathonId, {
        hackathonId:              hackathonId.toString(),
        resultsPublished:         true
      });

      return {
        hackathonId,
        totalResultsPublished: insertedResults.length,
        publishedAt: new Date(),
        success: true
      };
    } catch (err) {
      // Abort the transaction on any failure, leaving the DB in the pre-publish state
      await session.abortTransaction();
      session.endSession();

      if (err instanceof ApiError) throw err;
      console.error('Publish error:', err);
      throw new ApiError(500, 'Failed to publish results: ' + err.message);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Override — bulk rank/award override for drafted results
  // ─────────────────────────────────────────────────────────────────

  /**
   * Override ranks and awards for all drafted results of a hackathon.
   *
   * Request body shape:
   *   { overrides: [{ submissionId: ObjectId, rank: number, awardCategory: string, notes?: string }] }
   *
   * Behaviour:
   *   1. Validates every submissionId and rank before touching the DB.
   *   2. Updates ResultDraft (isLocked=false) records with the new manual overrides.
   *   3. Deduplicates submissionIds so the caller cannot accidentally win twice.
   *   4. Derives awardCategory from rank if not provided or empty.
   * All failures abort before any DB write to avoid partial overrides.
   */
  async overrideResult(hackathonId, { overrides = [] }) {
    const oHId = new mongoose.Types.ObjectId(hackathonId);

    // ── 0. Guard: hackathon must exist ──────────────────────────────
    const hackathon = await Hackathon.findById(oHId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');

    // ── 1. Input validation ─────────────────────────────────────────
    if (!Array.isArray(overrides) || overrides.length === 0) {
      throw new ApiError(400, '"overrides" must be a non-empty array');
    }

    for (let i = 0; i < overrides.length; i++) {
      const entry = overrides[i];

      if (!mongoose.isValidObjectId(entry.submissionId)) {
        throw new ApiError(400, `Entry ${i}: submissionId is not a valid ObjectId`);
      }
      if (typeof entry.rank !== 'number' || entry.rank < 1) {
        throw new ApiError(400, `Entry ${i}: rank must be a positive number`);
      }
    }

    // ── 2. Deduplicate submissionIds within the same payload ─────────
    const seen = new Set();
    const cleanOverrides = [];
    for (const entry of overrides) {
      const key = entry.submissionId.toString();
      if (seen.has(key)) {
        throw new ApiError(400, `Duplicate submissionId "${key}" in overrides — each submission can only appear once`);
      }
      seen.add(key);

      // Normalize awardCategory: derive from rank if empty or not provided
      const normalizedAwardCategory = (entry.awardCategory && entry.awardCategory.trim() !== '')
        ? entry.awardCategory
        : getAwardCategoryFromRank(entry.rank);

      cleanOverrides.push({
        ...entry,
        awardCategory: normalizedAwardCategory
      });
    }

    // ── 3. Verify all target drafts exist before writing ────────────
    const targetSubmissionIds = cleanOverrides.map(o => new mongoose.Types.ObjectId(o.submissionId));

    const existingDrafts = await ResultDraft.find({
      hackathonId: oHId,
      submissionId: { $in: targetSubmissionIds },
      isLocked: false
    }).select('submissionId').lean();

    const foundIds = new Set(existingDrafts.map(d => d.submissionId.toString()));
    for (const sId of targetSubmissionIds) {
      if (!foundIds.has(sId.toString())) {
        throw new ApiError(
          400,
          `No editable draft found for submission "${sId}". The draft may not have been generated or is locked.`
        );
      }
    }

    // ── 4. Apply overrides to ResultDraft ───────────────────────────
    const draftWrites = cleanOverrides.map(({ submissionId, rank, awardCategory, notes }) => ({
      updateOne: {
        filter: { hackathonId: oHId, submissionId: new mongoose.Types.ObjectId(submissionId) },
        update: {
          rank,
          isWinner: rank <= 3,
          awardCategory,
          award: rank <= 3 ? 'Winner' : 'Participant',
          manualRankOverride: rank,
          ...(notes ? { notes: notes.trim() } : {}),
          updatedAt: new Date()
        }
      }
    }));
    await ResultDraft.bulkWrite(draftWrites);

    // ── 5. Re-derive a clean top-3 from the updated rankings ─────────
    //    This prevents ties or gaps in positions caused by manual overrides.
    //    We skip over self-referencing self-loops — new rank must differ from any sibling.
    const allUpdatedDrafts = await ResultDraft.find({
      hackathonId: oHId,
      isLocked: false
    }).sort({ manualRankOverride: 1, rank: 1, score: -1 }).lean();

    const usedRanks = new Set();
    const rankFixWrites = [];
    let nextAutoRank = 1;

    for (const draft of allUpdatedDrafts) {
      if (draft.manualRankOverride) {
        // This record was manually overridden — mark its rank as fixed
        if (!usedRanks.has(draft.manualRankOverride)) {
          usedRanks.add(draft.manualRankOverride);
        }
      }
    }

    for (const draft of allUpdatedDrafts) {
      if (draft.manualRankOverride) {
        // Override already applies directly; move to next auto candidate
        let candidate = nextAutoRank;
        while (usedRanks.has(candidate) && candidate <= 3) candidate++;
        nextAutoRank = candidate;
        continue;
      }

      // Auto-rank: find the next free slot
      while (usedRanks.has(nextAutoRank) && nextAutoRank <= 3) {
        nextAutoRank++;
      }

      if (nextAutoRank > 3 && draft.rank <= 3) {
        // This record was originally in top-3 but is now displaced by an override
        rankFixWrites.push({
          updateOne: {
            filter: { _id: draft._id },
            update: {
              rank: nextAutoRank,
              isWinner: false,
              awardCategory: 'Participant',
              award: 'Participant',
              manualRankOverride: null,
              updatedAt: new Date()
            }
          }
        });
        nextAutoRank++;
      }
    }

    if (rankFixWrites.length > 0) {
      await ResultDraft.bulkWrite(rankFixWrites);
    }

    // ── 6. Return a summary ─────────────────────────────────────────
    return {
      hackathonId,
      draftsUpdated: cleanOverrides.length,
      overridesApplied: cleanOverrides.map(({ submissionId }) => submissionId.toString()),
      totalOverrides: cleanOverrides.length,
      ranksRebalanced: rankFixWrites.length
    };
  }

// ─────────────────────────────────────────────────────────────────
// Hackathon rankings (live — not yet published)
// Returns drafted results with team/user details populated for admin UI
// ─────────────────────────────────────────────────────────────────

async getHackathonResults(hackathonId, { page = 1, limit = 20 }) {
  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) throw new ApiError(404, 'Hackathon not found');

  // Check if draft exists
  const drafts = await ResultDraft.find({ hackathonId })
    .populate('userId', 'fullName email collegeOrUniversity')
    .populate('teamId', 'teamName')
    .populate('submissionId', 'title description githubLink videoLink')
    .sort({ rank: 1 })
    .lean();

  // If no drafts exist, return empty results but still indicate hackathon status
  if (drafts.length === 0) {
    return {
      hackathonId,
      hackathonTitle: hackathon.title,
      hackathon: {
        _id: hackathon._id,
        title: hackathon.title
      },
      resultsPublished: hackathon.resultsPublished || false,
      unresolvedTies: false,
      results: [],
      summary: {
        totalSubmissions: 0,
        totalScored: 0,
      },
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    };
  }

  // Transform draft records to include team/user info for frontend consumption
  const results = await Promise.all(
    drafts.map(async (draft) => {
      // Get participants (team members or solo participant)
      let participantNames = [];
      let teamName = '';

      if (draft.participantSnapshot) {
        // Use snapshot if available (captured at draft time)
        participantNames = [draft.participantSnapshot.fullName].filter(Boolean);
        teamName = draft.participantSnapshot.teamName || '';
      } else if (draft.userId && typeof draft.userId === 'object') {
        // Fallback to populated userId
        participantNames = [draft.userId.fullName].filter(Boolean);
        teamName = draft.teamId && typeof draft.teamId === 'object' ? draft.teamId.teamName || '' : '';
      } else if (draft.teamId && typeof draft.teamId === 'object') {
        // Team exists
        teamName = draft.teamId.teamName || '';
        // Fetch team members
        const Team = (await import('../../teams/team.model.js')).default;
        const team = await Team.findById(draft.teamId._id).select('members').lean();
        if (team && Array.isArray(team.members)) {
          participantNames = team.members.map(m => String(m));
        }
      }

      return {
        submissionId: draft.submissionId && typeof draft.submissionId === 'object' ? draft.submissionId._id : draft.submissionId,
        rank: draft.rank,
        score: draft.score,
        awardCategory: draft.awardCategory,
        award: draft.award,
        isWinner: draft.isWinner,
        isOverride: !!draft.manualRankOverride,
        team: teamName,
        participantNames,
        members: participantNames,
        projectTitle: draft.submissionId && typeof draft.submissionId === 'object' ? draft.submissionId.title : '',
        description: draft.submissionId && typeof draft.submissionId === 'object' ? draft.submissionId.description : '',
        githubLink: draft.submissionId && typeof draft.submissionId === 'object' ? draft.submissionId.githubLink : '',
        videoLink: draft.submissionId && typeof draft.submissionId === 'object' ? draft.submissionId.videoLink : '',
        notes: draft.notes || '',
        scoresCount: draft.scoresCount || 0
      };
    })
  );

  return {
    hackathonId,
    hackathonTitle: hackathon.title,
    hackathon: {
      _id: hackathon._id,
      title: hackathon.title
    },
    resultsPublished: hackathon.resultsPublished || false,
    unresolvedTies: results.filter(r => r.rank <= 3).some((r, i, arr) => 
      arr.findIndex(x => x.rank === r.rank && x.score === r.score) !== i
    ),
    results,
    summary: {
      totalSubmissions: results.length,
      totalScored: results.filter(r => r.scoresCount > 0).length,
    },
    pagination: {
      page,
      limit,
      total: results.length,
      pages: 1
    }
  };
}
}

const adminResultService = new AdminResultService();
export default adminResultService;