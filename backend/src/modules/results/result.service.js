/**
  result.service.js
  Core read operations for the Result snapshot model.
  All writes go through adminResult.service.js (publish) or resultDraft.
 */
import mongoose from 'mongoose';
import Result from './result.model.js';

// Safely normalise a string or ObjectId to mongoose.Types.ObjectId.
const oid = (value) =>
  value instanceof mongoose.Types.ObjectId ? value : new mongoose.Types.ObjectId(value);

class ResultService {
  /**
   * Returns all published results for a hackathon, sorted by rank.
   * Supports optional skip/limit for pagination.
   */
  async getPublishedResults(hackathonId, { skip = 0, limit } = {}) {
    const matchStage = {
      hackathonId: oid(hackathonId),
      isPublished: true
    };

    const aggregationPipeline = [
      { $match: matchStage },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'teams', localField: 'teamId', foreignField: '_id', as: 'team' } },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'submissions', localField: 'submissionId', foreignField: '_id', as: 'submission' } },
      { $unwind: { path: '$submission', preserveNullAndEmptyArrays: true } },
      { $sort: { rank: 1 } },
      {
        $project: {
          _id: 1,
          awardCategory: 1,
          award: 1,
          rank: 1,
          score: 1,
          date: 1,
          certificateUrl: 1,
          "user.fullName": 1,
          "team.teamName": 1,
          "submission.title": 1,
          "submission.description": 1,
          "submission.githubLink": 1,
          "submission.videoLink": 1,
        }
      }
    ];

    if (typeof limit === 'number' && limit > 0) {
      aggregationPipeline.push({ $skip: skip }, { $limit: limit });
    }

    return Result.aggregate(aggregationPipeline);
  }

  /**
   * Returns a single published result snapshot by its own ID.
   */
  async getResultById(resultId) {
    return Result.findById(resultId)
      .populate('userId', 'fullName email')
      .populate('teamId', 'teamName')
      .populate('hackathonId', 'title slug')
      .lean();
  }

  /**
   * Returns the count of published results for a hackathon.
   * Useful for pagination when the total is needed without fetching every document.
   */
  async countPublished(hackathonId) {
    return Result.countDocuments({
      hackathonId: oid(hackathonId),
      isPublished: true
    });
  }
}

const resultService = new ResultService();
export default resultService;
