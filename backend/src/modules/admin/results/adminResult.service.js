import ApiError from '../../../libs/apiError.js'
import { aggregateScoresForHackathon } from '../../results/aggregation.service.js';
import { computeRankings } from '../../results/ranking.service.js';
import { publishFinalResults } from '../../results/publish.service.js';
import Hackathon from '../hackathons/hackathon.model.js';

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

  async publishResults(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) throw new ApiError(404, 'Hackathon not found');
    if (hackathon.resultsPublished) throw new ApiError(400, 'Results already published');
    
    if (hackathon.endDate && new Date(hackathon.endDate) > new Date()) {
      throw new ApiError(400, 'Cannot publish results before the hackathon has ended');
    }

    const aggregatedScores = await aggregateScoresForHackathon(hackathonId);
    
    const incompleteSubmissions = aggregatedScores.filter(res => !res.isComplete);
    if (incompleteSubmissions.length > 0 && aggregatedScores.length > 0) {
      throw new ApiError(400, 'Cannot publish: Not all submissions have been fully scored by all assigned judges.');
    }

    const { rankedResults, unresolvedTies } = computeRankings(aggregatedScores);
    if (unresolvedTies) {
      throw new ApiError(400, 'Cannot publish: Unresolved ties exist. Admin must resolve ties manually.');
    }

    const publishedResults = await publishFinalResults(hackathonId, rankedResults);

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
