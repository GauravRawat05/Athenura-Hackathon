/**
  adminResult.controller.js
  Handles HTTP request/response flow for Admin Result management.
  Endpoints:
    GET  /admin/results/               → listResults
    GET  /admin/results/:resultId      → getResultById
    POST /admin/results/               → createResult (draft)
    PATCH /admin/results/:resultId     → updateResult
    POST /admin/results/draft/:hackathonId    → generateDraft
    PATCH /admin/results/draft/:hackathonId   → updateDraft
    GET  /admin/results/progress/:hackathonId → getProgress
    POST /admin/results/publish/:hackathonId  → publishResults
    GET  /admin/results/hackathon/:hackathonId → getHackathonResults
 */
import mongoose from 'mongoose';
import ApiResponse from '../../../libs/apiResponse.js';
import ApiError from '../../../libs/apiError.js';
import reviewQueueService from './reviewQueue.service.js';
import ResultDraft from './resultDraft.model.js';
import adminResultService from './adminResult.service.js';

class AdminResultController {

  // ── CRUD stub endpoints ────────────────────────────────────────────

  async listResults(req, res) {
    const { page = 1, limit = 20, hackathonId, status } = req.query;

    // Delegate to service — used for listing individual result records
    const result = await adminResultService.listResults({
      page: Number(page),
      limit: Number(limit),
      hackathonId,
      status
    });
    return res.status(200).json(new ApiResponse(200, result, 'Results fetched successfully'));
  }

  async getResultById(req, res) {
    const { resultId } = req.params;
    if (!mongoose.isValidObjectId(resultId)) throw new ApiError(400, 'Invalid resultId format');

    const serviceResult = await adminResultService.getResultById(resultId);
    if (!serviceResult) throw new ApiError(404, 'Result not found');

    return res.status(200).json(new ApiResponse(200, serviceResult, 'Result details fetched successfully'));
  }

  async createResult(req, res) {
    const { submissionId, hackathonId, rank, score, awardCategory, remarks } = req.body;

    const result = await adminResultService.createResult({
      submissionId,
      hackathonId,
      rank,
      score,
      awardCategory,
      remarks
    });
    return res.status(201).json(new ApiResponse(201, result, 'Result created successfully'));
  }

  async updateResult(req, res) {
    const { resultId } = req.params;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(resultId)) throw new ApiError(400, 'Invalid resultId format');

    const result = await adminResultService.updateResult(resultId, updateData);
    if (!result) throw new ApiError(404, 'Result not found');

    return res.status(200).json(new ApiResponse(200, result, 'Result updated successfully'));
  }

  // ── Progress endpoint ──────────────────────────────────────────────

  /**
   * GET /admin/results/progress/:hackathonId
   * Real-time progress metrics pulled from AdminReviewQueue and Score counts.
   * Delegated to reviewQueueService which handles the aggregation logic.
   */
  async getProgress(req, res) {
    const { hackathonId } = req.params;
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const data = await reviewQueueService.getProgressService(hackathonId);
    return res.status(200).json(new ApiResponse(200, data, 'Progress fetched successfully'));
  }

  // ── Draft endpoints ─────────────────────────────────────────────────

  /**
   * POST /admin/results/draft/:hackathonId
   * Generates a ResultDraft from all approved review-queue items.
   * Body: {} (no body required — reads from approved queue items)
   */
  async generateDraft(req, res) {
    const { hackathonId } = req.params;
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const result = await adminResultService.generateDraft(hackathonId);
    return res.status(200).json(new ApiResponse(200, result, 'Draft generated successfully'));
  }

  /**
   * PATCH /admin/results/draft/:hackathonId
   * Applies manual rank overrides to an existing draft.
   * Body: { manualOrder?: [submissionId, ...] }  or
   *       { draftId?, rankOverride?: number }
   */
  async updateDraft(req, res) {
    const { hackathonId } = req.params;
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const { draftId, manualOrder, rankOverride } = req.body;
    const result = await adminResultService.updateDraft(hackathonId, {
      draftId,
      manualOrder,
      rankOverride
    });
    return res.status(200).json(new ApiResponse(200, result, 'Draft updated successfully'));
  }

  // ── Publish ─────────────────────────────────────────────────────────

  async publishResults(req, res) {
    const { hackathonId } = req.params;
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const result = await adminResultService.publishResults(hackathonId);
    if (!result) throw new ApiError(400, 'Results could not be published');

    return res.status(200).json(new ApiResponse(200, result, 'Results published successfully'));
  }

  // ── Hackathon rankings ─────────────────────────────────────────────

  async getHackathonResults(req, res) {
    const { hackathonId } = req.params;
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const { page = 1, limit = 20 } = req.query;
    const results = await adminResultService.getHackathonResults(hackathonId, {
      page: Number(page),
      limit: Number(limit)
    });

    if (!results) throw new ApiError(404, 'Hackathon not found');

    return res.status(200).json(new ApiResponse(200, results, 'Hackathon results fetched successfully'));
  }
}

const adminResultController = new AdminResultController();
export default adminResultController;
