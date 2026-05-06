/**
  adminUniversity.controller.js
  Handles HTTP request/response flow for adminUniversity.
 */
import mongoose from 'mongoose'
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminUniversityService from './adminUniversity.service.js'

class AdminUniversityController {
  async listUniversities(req, res) {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const search = req.query.search
    const status = req.query.status

    const result = await adminUniversityService.listUniversities({ page, limit, search, status })
    return res.status(200).json(new ApiResponse(200, result, 'Universities fetched successfully'))
  }

  async getUniversityById(req, res) {
    const { universityId } = req.params
    if (!mongoose.isValidObjectId(universityId)) {
      throw new ApiError(400, 'Invalid universityId format')
    }

    const university = await adminUniversityService.getUniversityById(universityId)
    if (!university) {
      throw new ApiError(404, 'University not found')
    }

    return res.status(200).json(new ApiResponse(200, university, 'University details fetched successfully'))
  }

  async createUniversity(req, res) {
    const { name, code, email, phone, location, state, country, website } = req.body

    const university = await adminUniversityService.createUniversity({
      name,
      code,
      email,
      phone,
      location,
      state,
      country,
      website
    })

    return res.status(201).json(new ApiResponse(201, university, 'University created successfully'))
  }

  async updateUniversity(req, res) {
    const { universityId } = req.params
    const updateData = req.body

    if (!mongoose.isValidObjectId(universityId)) {
      throw new ApiError(400, 'Invalid universityId format')
    }

    const university = await adminUniversityService.updateUniversity(universityId, updateData)
    if (!university) {
      throw new ApiError(404, 'University not found')
    }

    return res.status(200).json(new ApiResponse(200, university, 'University updated successfully'))
  }

  async deleteUniversity(req, res) {
    const { universityId } = req.params
    if (!mongoose.isValidObjectId(universityId)) {
      throw new ApiError(400, 'Invalid universityId format')
    }

    const result = await adminUniversityService.deleteUniversity(universityId)
    if (!result) {
      throw new ApiError(404, 'University not found')
    }

    return res.status(200).json(new ApiResponse(200, { success: true }, 'University deleted successfully'))
  }

  async getUniversityStats(req, res) {
    const { universityId } = req.params
    if (!mongoose.isValidObjectId(universityId)) {
      throw new ApiError(400, 'Invalid universityId format')
    }

    const stats = await adminUniversityService.getUniversityStats(universityId)
    if (!stats) {
      throw new ApiError(404, 'University not found')
    }

    return res.status(200).json(new ApiResponse(200, stats, 'University statistics fetched successfully'))
  }
}

const adminUniversityController = new AdminUniversityController()
export default adminUniversityController
