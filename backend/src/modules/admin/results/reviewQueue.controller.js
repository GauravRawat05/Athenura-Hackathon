/**
  reviewQueue.controller.js
  Handles HTTP request/response flow for the Admin Review Queue:
  - GET  /admin/review-queue           → list items
  - POST /admin/review-queue/:queueId/resolve  → resolve pending item
  Also exposes the progress endpoint indirectly through the service.
 */
import mongoose from 'mongoose';
import ApiResponse from '../../../libs/apiResponse.js';
import ApiError from '../../../libs/apiError.js';
import reviewQueueService from './reviewQueue.service.js';
import ResultDraft from './resultDraft.model.js';

class ReviewQueueController {

  /**
   * GET /admin/review-queue
   * Lists review queue items with optional filters.
   * Query params:
   *   hackathonId  (required) — ObjectId of the hackathon
   *   status        (optional) — "pending" | "approved" | "rejected"
   *   page          (optional, default 1)
   *   limit         (optional, default 20)
   */
  async listQueueItems(req, res) {
    const { hackathonId, status, page, limit } = req.query;

    const result = await reviewQueueService.getQueueItems({
      hackathonId,
      status,
      page: Number(page || 1),
      limit: Number(limit || 20)
    });

    return res.status(200).json(
      new ApiResponse(200, result, 'Review queue items fetched successfully')
    );
  }

  /**
   * POST /admin/review-queue/:queueId/resolve
   * Resolves a pending queue item to 'approved' or 'rejected'.
   * Body: { status: 'approved' | 'rejected', adminComment?: string }
   */
  async resolveItem(req, res) {
    const { queueId } = req.params;
    const { status, adminComment, expectedResolvedQueueVersion } = req.body;
    const actorId = req.user?._id;


    if (!['approved', 'rejected'].includes(status)) {
      throw new ApiError(400, "status must be 'approved' or 'rejected'");
    }

    const result = await reviewQueueService.resolveQueueItem(
      queueId,
      { status, adminComment, expectedResolvedQueueVersion, adminId: actorId }
    );

    return res.status(200).json(
      new ApiResponse(200, result, `Queue item resolved to ${result.status}`)
    );
  }

  /**
   * GET /admin/results/progress/:hackathonId
   * Returns real-time progress metrics (delegated to reviewQueueService).
   */
  async getProgress(req, res) {
    const { hackathonId } = req.params;

    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const result = await reviewQueueService.getProgressService(hackathonId);

    return res.status(200).json(
      new ApiResponse(200, result, 'Progress metrics fetched successfully')
    );
  }
}

const reviewQueueController = new ReviewQueueController();
export default reviewQueueController;
