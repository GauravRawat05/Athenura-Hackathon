/**
  adminResult.service.js
  Contains the core business rules for adminResult.
 */
import ApiError from '../../../libs/apiError.js'

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
      submissionId: null,
      hackathonId: null,
      rank: null,
      score: null,
      awardCategory: null,
      remarks: null,
      status: 'draft',
      publishedAt: null,
      createdAt: null,
      updatedAt: null
    }
  }

  async createResult({ submissionId, hackathonId, rank, score, awardCategory, remarks }) {
    return {
      _id: null,
      submissionId,
      hackathonId,
      rank,
      score,
      awardCategory,
      remarks,
      status: 'draft',
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateResult(resultId, updateData) {
    return {
      _id: resultId,
      ...updateData,
      updatedAt: new Date()
    }
  }

  async publishResults(hackathonId) {
    return {
      hackathonId,
      totalResultsPublished: 0,
      publishedAt: new Date(),
      success: true
    }
  }

  async getHackathonResults(hackathonId, { page = 1, limit = 20 }) {
    return {
      hackathonId,
      results: [],
      summary: {
        totalSubmissions: 0,
        totalScored: 0,
        winners: [],
        finalists: [],
        participants: []
      },
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    }
  }
}

const adminResultService = new AdminResultService()
export default adminResultService
