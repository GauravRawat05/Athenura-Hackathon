/**
  analytics.controller.js
  Handles HTTP requests, maps queries, calls service logic, and formats success/error responses.
 */

import ApiResponse from "../../../libs/apiResponse.js";
import ApiError from "../../../libs/apiError.js";
import analyticsService from "./analytics.service.js";

class AnalyticsController {
  /**
   * GET /admin/analytics/overview
   * Fetches high-level metrics for dashboard
   */
  async getOverview(req, res) {
    const data = await analyticsService.getOverview(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Overview analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/registrations
   * Fetches registration trend analytics
   */
  async getRegistrations(req, res) {
    const data = await analyticsService.getRegistrations(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Registration analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/revenue
   * Fetches revenue trend analytics
   */
  async getRevenue(req, res) {
    const data = await analyticsService.getRevenue(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Revenue analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/submissions
   * Fetches submission trend analytics
   */
  async getSubmissions(req, res) {
    const data = await analyticsService.getSubmissions(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Submission analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/results
   * Fetches results trend analytics
   */
  async getResults(req, res) {
    const data = await analyticsService.getResults(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Results analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/participation-trends
   * Fetches active confirmed registration counts over time
   */
  async getParticipationTrends(req, res) {
    const data = await analyticsService.getParticipationTrends(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Participation trend analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/universities
   * Fetches university-level participation counts
   */
  async getUniversities(req, res) {
    const data = await analyticsService.getUniversities(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "University analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/judges
   * Fetches judge creation trend over time
   */
  async getJudges(req, res) {
    const data = await analyticsService.getJudges(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Judge trend analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/certificates
   * Fetches certificate generation status distribution
   * Returns a fixed `[pending, completed, failed]` data array so charts display
   * a consistent slot order regardless of insertion sort order from Mongo.
   */
  async getCertificates(req, res) {
    const data = await analyticsService.getCertificates(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Certificate analytics fetched successfully"));
  }

  /**
   * GET /admin/analytics/hackathons/stats
   * Fetches comprehensive hackathon statistics
   */
  async getHackathonStats(req, res) {
    const data = await analyticsService.getHackathonStats(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Hackathon stats fetched successfully"));
  }

  /**
   * GET /admin/analytics/users/stats
   * Fetches comprehensive user statistics
   */
  async getUserStats(req, res) {
    const data = await analyticsService.getUserStats(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "User stats fetched successfully"));
  }
}

export default new AnalyticsController();
