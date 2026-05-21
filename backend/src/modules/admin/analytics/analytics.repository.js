/**
  analytics.repository.js
  Encapsulates MongoDB/Mongoose database queries for analytics.
 */

import Registration from "../../registrations/registration.model.js";
import { Payment } from "../../payments/payment.model.js";
import Submission from "../../submissions/submission.model.js";
import Result from "../../results/result.model.js";
import User from "../../users/user.model.js";
import Hackathon from "../hackathons/hackathon.model.js";
import { PAYMENT_STATUS } from "../../payments/payment.constants.js";
import {
  registrationAggregationPipeline,
  revenueAggregationPipeline,
  submissionAggregationPipeline,
  resultsAggregationPipeline,
  participationTrendsAggregationPipeline,
  universityAggregationPipeline,
  judgeAggregationPipeline,
  certificateAggregationPipeline,
  hackathonStatsAggregationPipeline,
  hackathonDomainsAggregationPipeline,
  hackathonTrendAggregationPipeline,
  userStatsAggregationPipeline,
  userUniversitiesAggregationPipeline,
  userSkillsAggregationPipeline,
  userTrendAggregationPipeline,
} from "./analytics.pipeline.js";

class AnalyticsRepository {
  /**
   * Fetches high-level system overview stats using parallel database queries
   * @returns {Promise<object>}
   */
  async getOverviewStats() {
    const [
      totalRegistrations,
      totalUsers,
      totalHackathons,
      revenueResult,
    ] = await Promise.all([
      Registration.countDocuments({ status: { $ne: "cancelled" } }),
      User.countDocuments({ role: "USER" }),
      Hackathon.countDocuments(),
      Payment.aggregate([
        { $match: { status: PAYMENT_STATUS.SUCCESS } },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $convert: {
                  input: "$amount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return {
      totalRegistrations,
      totalUsers,
      totalHackathons,
      totalRevenue,
    };
  }

  /**
   * Performs aggregated count query for registrations
   * @param {object} params 
   * @returns {Promise<Array>}
   */
  async getRegistrationAnalytics(params) {
    const pipeline = registrationAggregationPipeline(params);
    return await Registration.aggregate(pipeline);
  }

  /**
   * Performs aggregated sum query for revenue
   * @param {object} params 
   * @returns {Promise<Array>}
   */
  async getRevenueAnalytics(params) {
    const pipeline = revenueAggregationPipeline(params);
    return await Registration.aggregate(pipeline);
  }

  /**
   * Performs aggregated count query for submissions
   * @param {object} params
   * @returns {Promise<Array>}
   */
  async getSubmissionAnalytics(params) {
    const pipeline = submissionAggregationPipeline(params);
    return await Submission.aggregate(pipeline);
  }

  /**
   * Performs aggregated count query for results created over time
   * @param {object} params
   * @returns {Promise<Array>}
   */
  async getResultsAnalytics(params) {
    const pipeline = resultsAggregationPipeline(params);
    return await Result.aggregate(pipeline);
  }

  /**
   * Active non-cancelled registrations over time — participation trend chart.
   * @param {object} params { hackathonId, from, to, groupBy }
   * @returns {Promise<Array>}
   */
  async getParticipationTrendsAnalytics(params) {
    const pipeline = participationTrendsAggregationPipeline(params);
    return await Registration.aggregate(pipeline);
  }

  /**
   * Group users by collegeOrUniversity — university participation chart.
   * @param {object} params { hackathonId, role }
   * @returns {Promise<Array>}
   */
  async getUniversityAnalytics(params) {
    const pipeline = universityAggregationPipeline(params);
    return await User.aggregate(pipeline);
  }

  /**
   * Time-series count of judge accounts created — judge trend chart.
   * Note: User model has no hackathonId, so hackathonId is ignored for this query.
   * @param {object} params { hackathonId, from, to, groupBy }
   * @returns {Promise<Array>}
   */
  async getJudgeAnalytics(params) {
    const pipeline = judgeAggregationPipeline(params);
    return await User.aggregate(pipeline);
  }

  /**
   * Flat distribution of certificateStatus values across all results
   * (optionally scoped to a hackathon) — certificate completion chart.
   * @param {object} params { hackathonId }
   * @returns {Promise<Array>}
   */
  async getCertificateAnalytics(params) {
    const pipeline = certificateAggregationPipeline(params);
    return await Result.aggregate(pipeline);
  }

  /**
   * Fetches comprehensive hackathon statistics in parallel
   * @param {object} params { from, to, groupBy }
   * @returns {Promise<object>}
   */
  async getHackathonStats(params) {
    const { from, to, groupBy } = params;

    const [overviewStats, topDomains, popularHackathons, trendData] = await Promise.all([
      Hackathon.aggregate(hackathonStatsAggregationPipeline({ from, to })),
      Hackathon.aggregate(hackathonDomainsAggregationPipeline({ from, to })),
      Registration.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: "$hackathonId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "hackathons",
            localField: "_id",
            foreignField: "_id",
            as: "hackathon"
          }
        },
        { $unwind: "$hackathon" },
        {
          $project: {
            _id: 1,
            title: "$hackathon.title",
            count: 1
          }
        }
      ]),
      Hackathon.aggregate(hackathonTrendAggregationPipeline({ from, to, groupBy }))
    ]);

    return {
      overviewStats,
      topDomains,
      popularHackathons,
      trendData
    };
  }

  /**
   * Fetches comprehensive user statistics in parallel
   * @param {object} params { from, to, groupBy }
   * @returns {Promise<object>}
   */
  async getUserStats(params) {
    const { from, to, groupBy } = params;

    const [overviewStats, topUniversities, topSkills, trendData] = await Promise.all([
      User.aggregate(userStatsAggregationPipeline({ from, to })),
      User.aggregate(userUniversitiesAggregationPipeline({ from, to })),
      User.aggregate(userSkillsAggregationPipeline({ from, to })),
      User.aggregate(userTrendAggregationPipeline({ from, to, groupBy }))
    ]);

    return {
      overviewStats,
      topUniversities,
      topSkills,
      trendData
    };
  }
}

export default new AnalyticsRepository();
