/**
  reviewQueue.repository.js
  Data-access layer for the AdminReviewQueue collection.
 */
import AdminReviewQueue from './reviewQueue.model.js';

class ReviewQueueRepository {
  async create(data) {
    return AdminReviewQueue.create(data);
  }

  async findById(queueId) {
    return AdminReviewQueue.findById(queueId);
  }

  async findByHackathon(hackathonId, filters = {}) {
    const { status, issueType, page = 1, limit = 20, submissionId } = filters;
    const query = { hackathonId };

    if (status) query.status = status;
    if (submissionId) query.submissionId = submissionId;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      AdminReviewQueue.find(query)
        .populate('judgeId', 'fullName email')
        .populate('submissionId', 'title teamId')
        .populate('hackathonId', 'title status')
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

  async findBySubmission(submissionId) {
    return AdminReviewQueue.find({ submissionId });
  }

  async findPendingBySubmission(submissionId) {
    return AdminReviewQueue.findOne({ submissionId, status: 'pending' });
  }

  async update(queueId, updateData) {
    return AdminReviewQueue.findByIdAndUpdate(queueId, updateData, { new: true });
  }

  async deleteById(queueId) {
    return AdminReviewQueue.findByIdAndDelete(queueId);
  }

  async countByHackathonAndStatus(hackathonId, status) {
    return AdminReviewQueue.countDocuments({ hackathonId, status });
  }
}

const reviewQueueRepository = new ReviewQueueRepository();
export default reviewQueueRepository;
