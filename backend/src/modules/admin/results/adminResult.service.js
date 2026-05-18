import ApiError from '../../../libs/apiError.js'
import { aggregateScoresForHackathon } from '../../results/aggregation.service.js';
import { computeRankings } from '../../results/ranking.service.js';
import { publishFinalResults } from '../../results/publish.service.js';
import Hackathon from '../hackathons/hackathon.model.js';
import resultRepository from '../../results/result.repository.js';
import Result from '../../results/result.model.js';

class AdminResultService {
  async listResults({ page = 1, limit = 20, hackathonId, status }) {
    const skip = (page - 1) * limit
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    }
  }

  async getResultById(resultId) {
    return {
      _id: resultId,
      status: 'draft',
    }
  }

  async createResult(data) {
    return { ...data, status: 'draft', _id: 'dummy' }
  }

  async updateResult(resultId, updateData) {
    return { _id: resultId, ...updateData }
  }

  async computeAndSaveDraftResults(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');
    if (hackathon.resultsPublished) throw new ApiError(400, 'Results already published');

    const aggregatedScores = await aggregateScoresForHackathon(hackathonId);
    const { rankedResults, unresolvedTies } = computeRankings(aggregatedScores);

    const resultsData = rankedResults.map(res => ({
      userId: res.userId,
      hackathonId,
      teamId: res.teamId,
      submissionId: res.submissionId,
      rank: res.rank,
      score: res.aggregatedScore,
      awardCategory: res.rank === 1 ? 'First Prize' : res.rank === 2 ? 'Second Prize' : res.rank === 3 ? 'Third Prize' : 'Participant',
      award: res.rank <= 3 ? 'Winner' : 'Participant',
      isWinner: res.rank <= 3,
      isPublished: false
    }));

    // Clear existing drafts
    await Result.deleteMany({ hackathonId, isPublished: false });
    await resultRepository.bulkCreate(resultsData);

    return {
      success: true,
      unresolvedTies,
      computedCount: resultsData.length
    };
  }

  async overrideResult(hackathonId, overrideData) {
    const { submissionId, newRank, award, awardCategory } = overrideData;
    
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');
    if (hackathon.resultsPublished) throw new ApiError(400, 'Cannot override published results');

    const result = await Result.findOne({ hackathonId, submissionId, isPublished: false });
    if (!result) throw new ApiError(404, 'Result draft not found for this submission');

    if (newRank !== undefined) {
      result.rank = newRank;
      result.isWinner = newRank <= 3;
    }
    if (award !== undefined) result.award = award;
    if (awardCategory !== undefined) result.awardCategory = awardCategory;

    await result.save();
    return result;
  }

  async publishResults(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');
    if (hackathon.resultsPublished) throw new ApiError(400, 'Results already published');
    
    if (hackathon.endDate && new Date(hackathon.endDate) > new Date()) {
      throw new ApiError(400, 'Cannot publish results before the hackathon has ended');
    }

    const existingDrafts = await Result.find({ hackathonId, isPublished: false });
    
    if (existingDrafts.length === 0) {
      throw new ApiError(400, 'No computed results found. Please compute results first.');
    }

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

    const publishedResults = await publishFinalResults(hackathonId, existingDrafts);

    return {
      hackathonId,
      totalResultsPublished: publishedResults.length,
      publishedAt: new Date(),
      success: true
    };
  }

  async getHackathonResults(hackathonId, { page = 1, limit = 20 }) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');

    const aggregatedScores = await aggregateScoresForHackathon(hackathonId);
    const { rankedResults, unresolvedTies } = computeRankings(aggregatedScores);

    return {
      hackathonId,
      resultsPublished: hackathon.resultsPublished,
      unresolvedTies,
      results: rankedResults,
      summary: {
        totalSubmissions: rankedResults.length,
        totalScored: rankedResults.filter(r => r.scoresCount > 0).length,
      },
      pagination: {
        page,
        limit,
        total: rankedResults.length,
        pages: 1
      }
    }
  }
}

const adminResultService = new AdminResultService()
export default adminResultService
