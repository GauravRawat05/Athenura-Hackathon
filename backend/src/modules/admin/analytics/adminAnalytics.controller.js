/**
  adminAnalytics.controller.js
  Handles HTTP request/response flow for adminAnalytics.
 */
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminAnalyticsService from './adminAnalytics.service.js'

class AdminAnalyticsController {
  async getDashboard(req, res) {
    const dashboard = await adminAnalyticsService.getDashboard()
    return res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard data fetched successfully'))
  }

  async getHackathonStats(req, res) {
    const stats = await adminAnalyticsService.getHackathonStats()
    return res.status(200).json(new ApiResponse(200, stats, 'Hackathon statistics fetched successfully'))
  }

  async getUserStats(req, res) {
    const stats = await adminAnalyticsService.getUserStats()
    return res.status(200).json(new ApiResponse(200, stats, 'User statistics fetched successfully'))
  }

  async getRegistrationStats(req, res) {
    const stats = await adminAnalyticsService.getRegistrationStats()
    return res.status(200).json(new ApiResponse(200, stats, 'Registration statistics fetched successfully'))
  }

  async getSubmissionStats(req, res) {
    const stats = await adminAnalyticsService.getSubmissionStats()
    return res.status(200).json(new ApiResponse(200, stats, 'Submission statistics fetched successfully'))
  }

  async getResultStats(req, res) {
    const stats = await adminAnalyticsService.getResultStats()
    return res.status(200).json(new ApiResponse(200, stats, 'Result statistics fetched successfully'))
  }

  async getPaymentStats(req, res) {
    const stats = await adminAnalyticsService.getPaymentStats()
    return res.status(200).json(new ApiResponse(200, stats, 'Payment statistics fetched successfully'))
  }
}

const adminAnalyticsController = new AdminAnalyticsController()
export default adminAnalyticsController

