/**
  adminReport.controller.js
  Handles HTTP request/response flow for adminReport.
 */
import mongoose from 'mongoose'
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminReportService from './adminReport.service.js'

class AdminReportController {
  async listReports(req, res) {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const type = req.query.type
    const status = req.query.status

    const result = await adminReportService.listReports({ page, limit, type, status })
    return res.status(200).json(new ApiResponse(200, result, 'Reports fetched successfully'))
  }

  async getReportById(req, res) {
    const { reportId } = req.params
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError(400, 'Invalid reportId format')
    }

    const report = await adminReportService.getReportById(reportId)
    if (!report) {
      throw new ApiError(404, 'Report not found')
    }

    return res.status(200).json(new ApiResponse(200, report, 'Report details fetched successfully'))
  }

  async createReport(req, res) {
    const payload = req.body
    const report = await adminReportService.createReport(payload)
    return res.status(201).json(new ApiResponse(201, report, 'Report created successfully'))
  }

  async updateReport(req, res) {
    const { reportId } = req.params
    const updateData = req.body
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError(400, 'Invalid reportId format')
    }

    const report = await adminReportService.updateReport(reportId, updateData)
    if (!report) {
      throw new ApiError(404, 'Report not found')
    }

    return res.status(200).json(new ApiResponse(200, report, 'Report updated successfully'))
  }

  async runReport(req, res) {
    const { reportId } = req.params
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError(400, 'Invalid reportId format')
    }

    const output = await adminReportService.runReport(reportId)
    if (!output) {
      throw new ApiError(404, 'Report not found or run failed')
    }

    return res.status(200).json(new ApiResponse(200, output, 'Report executed successfully'))
  }

  async deleteReport(req, res) {
    const { reportId } = req.params
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError(400, 'Invalid reportId format')
    }

    const deleted = await adminReportService.deleteReport(reportId)
    if (!deleted) {
      throw new ApiError(404, 'Report not found')
    }

    return res.status(200).json(new ApiResponse(200, { success: true }, 'Report deleted successfully'))
  }
}

const adminReportController = new AdminReportController()
export default adminReportController
