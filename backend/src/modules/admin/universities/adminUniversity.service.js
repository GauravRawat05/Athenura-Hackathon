/**
  adminUniversity.service.js
  Contains the core business rules for adminUniversity.
 */
import ApiError from '../../../libs/apiError.js'

class AdminUniversityService {
  async listUniversities({ page = 1, limit = 20, search, status }) {
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

  async getUniversityById(universityId) {
    return {
      _id: universityId,
      name: null,
      code: null,
      email: null,
      phone: null,
      location: null,
      state: null,
      country: null,
      website: null,
      status: 'active',
      createdAt: null,
      updatedAt: null
    }
  }

  async createUniversity({ name, code, email, phone, location, state, country, website }) {
    return {
      _id: null,
      name,
      code,
      email,
      phone,
      location,
      state,
      country,
      website,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateUniversity(universityId, updateData) {
    return {
      _id: universityId,
      ...updateData,
      updatedAt: new Date()
    }
  }

  async deleteUniversity(universityId) {
    return true
  }

  async getUniversityStats(universityId) {
    return {
      universityId,
      totalStudents: 0,
      totalRegistrations: 0,
      totalSubmissions: 0,
      winnerCount: 0,
      topStudents: [],
      participationByHackathon: []
    }
  }
}

const adminUniversityService = new AdminUniversityService()
export default adminUniversityService
