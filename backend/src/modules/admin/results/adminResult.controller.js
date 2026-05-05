/**
  adminResult.controller.js
  Handles HTTP request/response flow for adminResult.
 */
import mongoose from 'mongoose'
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminResultService from './adminResult.service.js'

class AdminResultController {
  async listResults(req, res) {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const hackathonId = req.query.hackathonId
    const status = req.query.status

    const result = await adminResultService.listResults({ page, limit, hackathonId, status })
    return res.status(200).json(new ApiResponse(200, result, 'Results fetched successfully'))
  }

  async getResultById(req, res) {
    const { resultId } = req.params
    if (!mongoose.isValidObjectId(resultId)) {
      throw new ApiError(400, 'Invalid resultId format')
    }

    const result = await adminResultService.getResultById(resultId)
    if (!result) {
      throw new ApiError(404, 'Result not found')
    }

    return res.status(200).json(new ApiResponse(200, result, 'Result details fetched successfully'))
  }

  async createResult(req, res) {
    const { submissionId, hackathonId, rank, score, awardCategory, remarks } = req.body

    const result = await adminResultService.createResult({
      submissionId,
      hackathonId,
      rank,
      score,
      awardCategory,
      remarks
    })

    return res.status(201).json(new ApiResponse(201, result, 'Result created successfully'))
  }

  async updateResult(req, res) {
    const { resultId } = req.params
    const updateData = req.body

    if (!mongoose.isValidObjectId(resultId)) {
      throw new ApiError(400, 'Invalid resultId format')
    }

    const result = await adminResultService.updateResult(resultId, updateData)
    if (!result) {
      throw new ApiError(404, 'Result not found')
    }

    return res.status(200).json(new ApiResponse(200, result, 'Result updated successfully'))
  }

  async publishResults(req, res) {
    const { hackathonId } = req.params
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format')
    }

    const result = await adminResultService.publishResults(hackathonId)
    if (!result) {
      throw new ApiError(400, 'Results could not be published')
    }

    return res.status(200).json(new ApiResponse(200, result, 'Results published successfully'))
  }

  async getHackathonResults(req, res) {
    const { hackathonId } = req.params
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format')
    }

    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)

    const results = await adminResultService.getHackathonResults(hackathonId, { page, limit })
    if (!results) {
      throw new ApiError(404, 'Hackathon not found')
    }

    return res.status(200).json(new ApiResponse(200, results, 'Hackathon results fetched successfully'))
  }
}

const adminResultController = new AdminResultController()
export default adminResultController
