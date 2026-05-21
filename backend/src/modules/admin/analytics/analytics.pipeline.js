/**
  analytics.pipeline.js
  Reusable aggregation helpers and pipeline builders for Mongoose/MongoDB.
 */

import mongoose from "mongoose";
import { ANALYTICS_GROUP_BY } from "./analytics.constants.js";

/**
 * Builds the date grouping expression based on daily/weekly/monthly choice
 * @param {string} groupBy 
 * @returns {object} MongoDB group expression
 */
export const buildDateGroup = (groupBy) => {
  switch (groupBy) {
    case ANALYTICS_GROUP_BY.DAILY:
      return {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    case ANALYTICS_GROUP_BY.WEEKLY:
      // Group by ISO week and Year to avoid collisions across years
      return {
        $concat: [
          { $toString: { $isoWeekYear: "$createdAt" } },
          "-W",
          {
            $cond: {
              if: { $lt: [{ $isoWeek: "$createdAt" }, 10] },
              then: { $concat: ["0", { $toString: { $isoWeek: "$createdAt" } }] },
              else: { $toString: { $isoWeek: "$createdAt" } },
            },
          },
        ],
      };
    case ANALYTICS_GROUP_BY.MONTHLY:
    default:
      return {
        $dateToString: { format: "%Y-%m", date: "$createdAt" },
      };
  }
};

/**
 * Builds standard date match criteria based on 'from' and 'to' date parameters
 * @param {string|Date} from 
 * @param {string|Date} to 
 * @returns {object} match criteria
 */
export const buildDateMatch = (from, to) => {
  const match = {};

  if (from || to) {
    match.createdAt = {};

    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) {
        match.createdAt.$gte = fromDate;
      }
    }

    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) {
        match.createdAt.$lte = toDate;
      }
    }

    // Clean up if invalid dates were passed
    if (Object.keys(match.createdAt).length === 0) {
      delete match.createdAt;
    }
  }

  return match;
};

/**
 * Build registration counts aggregation pipeline
 * @param {object} params 
 * @returns {Array} MongoDB aggregation pipeline
 */
export const registrationAggregationPipeline = ({ hackathonId, from, to, groupBy }) => {
  const match = buildDateMatch(from, to);

  // Exclude cancelled registrations to get active registration statistics
  match.status = { $ne: "cancelled" };

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Build revenue analytics aggregation pipeline
 * @param {object} params 
 * @returns {Array} MongoDB aggregation pipeline
 */
export const revenueAggregationPipeline = ({ hackathonId, from, to, groupBy, currency }) => {
  const match = buildDateMatch(from, to);

  // Filter only completed/successful payments
  match.paymentStatus = "completed";

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  if (currency) {
    match.currency = currency;
  }

  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        totalRevenue: {
          $sum: {
            $convert: {
              input: "$totalAmount",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Build results counts aggregation pipeline
 * Results tracks contest scoring; this pipeline counts records over time.
 * Uses `createdAt` only — all results (published or not) count toward
 * creation trends since they all represent real contest outcomes.
 * @param {object} params
 * @returns {Array} MongoDB aggregation pipeline
 */
export const resultsAggregationPipeline = ({ hackathonId, from, to, groupBy }) => {
  const match = buildDateMatch(from, to);

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Build participation trends aggregation pipeline
 * Counts active (non-cancelled) registrations over time, grouped by date.
 * Filters status != 'cancelled' so only confirmed/paid participation is counted.
 * @param {object} params { hackathonId, from, to, groupBy }
 * @returns {Array} MongoDB aggregation pipeline
 */
export const participationTrendsAggregationPipeline = ({ hackathonId, from, to, groupBy }) => {
  const match = buildDateMatch(from, to);

  // Only count active participation — not cancelled or failed payments
  match.status = { $nin: ["cancelled", "payment_failed"] };

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: {
          $sum: {
            $cond: [{ $isArray: "$participantIds" }, { $size: "$participantIds" }, 1]
          }
        },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Build university analytics aggregation pipeline
 * Groups users by collegeOrUniversity and counts participants.
 * Defaults to role "User"; supports role filtering for Participant and Judge views.
 * @param {object} params { hackathonId, role }
 * @returns {Array} MongoDB aggregation pipeline
 */
export const universityAggregationPipeline = ({ hackathonId, role = "User" }) => {
  const match = {};

  if (role) {
    match.role = role;
  }

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  return [
    { $match: match },
    {
      $group: {
        _id: "$collegeOrUniversity",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
};

/**
 * Build judge analytics aggregation pipeline
 * Time-series of judge-role accounts created over time.
 * Filters role === "Judge"; optionally scoped to a single hackathon.
 * @param {object} params { hackathonId, from, to, groupBy }
 * @returns {Array} MongoDB aggregation pipeline
 */
export const judgeAggregationPipeline = ({ hackathonId, from, to, groupBy }) => {
  const match = buildDateMatch(from, to);

  // Only count judge accounts
  match.role = { $eq: "Judge" };

  // Users are not stored with hackathonId, so we demote the hackathonId filter
  // for the judges pipeline. The pipeline still accepts it to keep the signature
  // uniform; the filter is silently ignored here.
  // eslint-disable-next-line no-unused-vars
  void hackathonId;

  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Build certificate analytics aggregation pipeline
 * Returns a flat distribution of results grouped by certificateStatus.
 * Optionally filters by hackathonId. No date grouping — returns status buckets.
 * @param {object} params { hackathonId }
 * @returns {Array} MongoDB aggregation pipeline
 */
export const certificateAggregationPipeline = ({ hackathonId }) => {
  const match = {};

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  return [
    {
      $group: {
        _id: { $ifNull: ["$certificateStatus", "unknown"] },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Build submission counts aggregation pipeline
 * @param {object} params
 * @returns {Array} MongoDB aggregation pipeline
 */
export const submissionAggregationPipeline = ({ hackathonId, from, to, groupBy }) => {
  const match = buildDateMatch(from, to);

  // Exclude Draft submissions
  match.status = { $ne: "Draft" };

  if (hackathonId) {
    match.hackathonId = new mongoose.Types.ObjectId(hackathonId);
  }

  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

/**
 * Builds the hackathon stats aggregation pipeline
 */
export const hackathonStatsAggregationPipeline = ({ from, to }) => {
  const match = buildDateMatch(from, to);

  return [
    { $match: match },
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        byMode: [
          { $unwind: "$mode" },
          { $group: { _id: "$mode", count: { $sum: 1 } } }
        ],
        prizePool: [
          {
            $group: {
              _id: null,
              total: { $sum: "$prizePool" },
              average: { $avg: "$prizePool" },
              max: { $max: "$prizePool" }
            }
          }
        ],
        registrationFee: [
          {
            $group: {
              _id: null,
              average: { $avg: "$registrationFee" },
              max: { $max: "$registrationFee" },
              free: {
                $sum: { $cond: [{ $eq: ["$registrationFee", 0] }, 1, 0] }
              },
              paid: {
                $sum: { $cond: [{ $gt: ["$registrationFee", 0] }, 1, 0] }
              }
            }
          }
        ]
      }
    }
  ];
};

/**
 * Builds top technology domains aggregation pipeline
 */
export const hackathonDomainsAggregationPipeline = ({ from, to }) => {
  const match = buildDateMatch(from, to);
  return [
    { $match: match },
    { $unwind: "$technologyDomains" },
    { $group: { _id: "$technologyDomains", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];
};

/**
 * Builds hackathon trend aggregation pipeline
 */
export const hackathonTrendAggregationPipeline = ({ from, to, groupBy }) => {
  const match = buildDateMatch(from, to);
  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];
};

/**
 * Builds user stats aggregation pipeline
 */
export const userStatsAggregationPipeline = ({ from, to }) => {
  const match = buildDateMatch(from, to);
  return [
    { $match: match },
    {
      $facet: {
        total: [{ $count: "count" }],
        status: [
          {
            $group: {
              _id: null,
              active: {
                $sum: { $cond: [{ $eq: ["$isSuspended", false] }, 1, 0] }
              },
              suspended: {
                $sum: { $cond: [{ $eq: ["$isSuspended", true] }, 1, 0] }
              },
              verified: {
                $sum: { $cond: [{ $eq: ["$isEmailVerified", true] }, 1, 0] }
              },
              unverified: {
                $sum: { $cond: [{ $eq: ["$isEmailVerified", false] }, 1, 0] }
              }
            }
          }
        ],
        byRole: [
          { $group: { _id: "$role", count: { $sum: 1 } } }
        ],
        byGender: [
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];
};

/**
 * Builds top universities aggregation pipeline
 */
export const userUniversitiesAggregationPipeline = ({ from, to }) => {
  const match = buildDateMatch(from, to);
  return [
    { $match: match },
    { $group: { _id: "$collegeOrUniversity", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];
};

/**
 * Builds top skills aggregation pipeline
 */
export const userSkillsAggregationPipeline = ({ from, to }) => {
  const match = buildDateMatch(from, to);
  return [
    { $match: match },
    { $unwind: "$skills" },
    { $group: { _id: "$skills", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];
};

/**
 * Builds user trend aggregation pipeline
 */
export const userTrendAggregationPipeline = ({ from, to, groupBy }) => {
  const match = buildDateMatch(from, to);
  return [
    { $match: match },
    {
      $group: {
        _id: buildDateGroup(groupBy),
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];
};
