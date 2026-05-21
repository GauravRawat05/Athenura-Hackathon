/**
  analytics.service.js
  Owns workflows, business logic, normalization, and cache orchestration for analytics.
 */

import analyticsRepository from "./analytics.repository.js";
import analyticsCache from "./analytics.cache.js";
import { CACHE_TTL_MS } from "./analytics.constants.js";

class AnalyticsService {
  /**
   * Get systems dashboard overview with caching
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>}
   */
  async getOverview(query) {
    const cacheKey = analyticsCache.generateKey("overview", query);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const stats = await analyticsRepository.getOverviewStats();

    const normalizedStats = {
      totalUsers: stats?.totalUsers ?? 0,
      totalHackathons: stats?.totalHackathons ?? 0,
      totalRegistrations: stats?.totalRegistrations ?? 0,
      totalRevenue: stats?.totalRevenue ?? 0,
    };

    analyticsCache.set(cacheKey, normalizedStats, CACHE_TTL_MS);
    return normalizedStats;
  }

  /**
   * Get registration count metrics formatted for frontend charts
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>} response in { labels, data } structure
   */
  async getRegistrations(query) {
    const cacheKey = analyticsCache.generateKey("registrations", query);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getRegistrationAnalytics(query);

    const labels = [];
    const data = [];

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          labels.push(String(item._id));
          data.push(Number(item.count) || 0);
        }
      });
    }

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get revenue metrics formatted for frontend charts
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>} response in { labels, data } structure
   */
  async getRevenue(query) {
    const cacheKey = analyticsCache.generateKey("revenue", query);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getRevenueAnalytics(query);

    const labels = [];
    const data = [];

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          labels.push(String(item._id));
          data.push(Number(item.totalRevenue) || 0);
        }
      });
    }

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get submission count metrics formatted for frontend charts
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>} response in { labels, data } structure
   */
  async getSubmissions(query) {
    const cacheKey = analyticsCache.generateKey("submissions", query);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getSubmissionAnalytics(query);

    const labels = [];
    const data = [];

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          labels.push(String(item._id));
          data.push(Number(item.count) || 0);
        }
      });
    }

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get results count metrics formatted for frontend charts
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>} response in { labels, data } structure
   */
  async getResults(query) {
    const cacheKey = analyticsCache.generateKey("results", query);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getResultsAnalytics(query);

    const labels = [];
    const data = [];

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          labels.push(String(item._id));
          data.push(Number(item.count) || 0);
        }
      });
    }

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get participation trends chart data.
   * Packages query params for valid schema keys only — hackathonId + date range
   * may not be set by the caller, so this method always sanitises before caching.
   * @param {object} query Sanitised query parameters from the validation middleware.
   * @returns {Promise<object>} { labels: [], data: [] }
   */
  async getParticipationTrends(query) {
    const allowedKeys = ["from", "to", "hackathonId", "groupBy"];
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([k]) => allowedKeys.includes(k))
    );
    const cacheKey = analyticsCache.generateKey("participation-trends", filteredQuery);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getParticipationTrendsAnalytics(filteredQuery);

    const result = zeroFillTimeSeries(
      rawData,
      filteredQuery.groupBy || "monthly",
      filteredQuery.from,
      filteredQuery.to
    );

    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get university participation uptime chart.
   * Filters by hackathonId (optional) and user role (defaults to USER).
   * @param {object} query Sanitised query parameters from the validation middleware.
   * @returns {Promise<object>} { labels: [], data: [] }
   */
  async getUniversities(query) {
    const allowedKeys = ["hackathonId", "role"];
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([k]) => allowedKeys.includes(k))
    );
    const cacheKey = analyticsCache.generateKey("universities", filteredQuery);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getUniversityAnalytics(filteredQuery);

    const labels = [];
    const data = [];

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          labels.push(String(item._id));
          data.push(Number(item.count) || 0);
        }
      });
    }

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get judge creation trend chart data.
   * Filters by role == "Judge" plus optional hackathonId + date range.
   * hackathonId is ignored in the pipeline (Users have no hackathon foreign key).
   * @param {object} query Sanitised query parameters from the validation middleware.
   * @returns {Promise<object>} { labels: [], data: [] }
   */
  async getJudges(query) {
    const allowedKeys = ["from", "to", "hackathonId", "groupBy"];
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([k]) => allowedKeys.includes(k))
    );
    const cacheKey = analyticsCache.generateKey("judges", filteredQuery);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getJudgeAnalytics(filteredQuery);

    const labels = [];
    const data = [];

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          labels.push(String(item._id));
          data.push(Number(item.count) || 0);
        }
      });
    }

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get certificate generation distribution chart data.
   * The raw aggregation returns `{ _id: "pending|completed|failed", count }` entries.
   * We normalise to a fixed order [pending, completed, failed] so the frontend
   * chart can always use the same series order instead of matching on labels.
   * @param {object} query Sanitised query parameters from the validation middleware.
   * @returns {Promise<object>} { labels: [], data: [] } or { labels: [], datasets: [] }
   */
  async getCertificates(query) {
    const allowedKeys = ["hackathonId"];
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([k]) => allowedKeys.includes(k))
    );
    const cacheKey = analyticsCache.generateKey("certificates", filteredQuery);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const rawData = await analyticsRepository.getCertificateAnalytics(filteredQuery);

    // Status buckets in a stable order — frontend charts work best with a consistent key order
    const STATUS_ORDER = ["pending", "completed", "failed"];
    const bucketMap = new Map(STATUS_ORDER.map((s) => [s, 0]));

    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item && item._id !== undefined) {
          const status = String(item._id);
          bucketMap.set(status, (bucketMap.get(status) || 0) + Number(item.count) || 0);
        }
      });
    }

    const labels = STATUS_ORDER;
    const data = STATUS_ORDER.map((s) => bucketMap.get(s));

    const result = { labels, data };
    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get comprehensive hackathon stats with caching and normalization
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>} response formatted for dashboard charts
   */
  async getHackathonStats(query) {
    const allowedKeys = ["from", "to", "groupBy"];
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([k]) => allowedKeys.includes(k))
    );
    const cacheKey = analyticsCache.generateKey("hackathons-stats", filteredQuery);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const raw = await analyticsRepository.getHackathonStats(filteredQuery);

    const total = raw.overviewStats[0]?.total[0]?.count || 0;

    const byStatus = {
      draft: 0,
      upcoming: 0,
      ongoing: 0,
      judging: 0,
      past: 0
    };
    if (Array.isArray(raw.overviewStats[0]?.byStatus)) {
      raw.overviewStats[0].byStatus.forEach((item) => {
        if (item._id) {
          byStatus[item._id] = item.count || 0;
        }
      });
    }

    const byMode = {
      Solo: 0,
      Team: 0
    };
    if (Array.isArray(raw.overviewStats[0]?.byMode)) {
      raw.overviewStats[0].byMode.forEach((item) => {
        if (item._id) {
          byMode[item._id] = item.count || 0;
        }
      });
    }

    const prizePool = {
      total: raw.overviewStats[0]?.prizePool[0]?.total || 0,
      average: Math.round((raw.overviewStats[0]?.prizePool[0]?.average || 0) * 100) / 100,
      max: raw.overviewStats[0]?.prizePool[0]?.max || 0
    };

    const registrationFee = {
      average: Math.round((raw.overviewStats[0]?.registrationFee[0]?.average || 0) * 100) / 100,
      max: raw.overviewStats[0]?.registrationFee[0]?.max || 0,
      free: raw.overviewStats[0]?.registrationFee[0]?.free || 0,
      paid: raw.overviewStats[0]?.registrationFee[0]?.paid || 0
    };

    const domainLabels = [];
    const domainData = [];
    if (Array.isArray(raw.topDomains)) {
      raw.topDomains.forEach((item) => {
        if (item._id !== null && item._id !== undefined) {
          domainLabels.push(String(item._id));
          domainData.push(item.count || 0);
        }
      });
    }

    const popularHackathonsFormatted = [];
    if (Array.isArray(raw.popularHackathons)) {
      raw.popularHackathons.forEach((item) => {
        popularHackathonsFormatted.push({
          id: item._id,
          title: item.title,
          count: item.count
        });
      });
    }

    const trendLabels = [];
    const trendDataFormatted = [];
    if (Array.isArray(raw.trendData)) {
      raw.trendData.forEach((item) => {
        if (item._id !== null && item._id !== undefined) {
          trendLabels.push(String(item._id));
          trendDataFormatted.push(item.count || 0);
        }
      });
    }

    const result = {
      total,
      byStatus,
      byMode,
      prizePool,
      registrationFee,
      topDomains: { labels: domainLabels, data: domainData },
      popularHackathons: popularHackathonsFormatted,
      trend: { labels: trendLabels, data: trendDataFormatted }
    };

    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }

  /**
   * Get comprehensive user stats with caching and normalization
   * @param {object} query Sanitized query parameters
   * @returns {Promise<object>} response formatted for dashboard charts
   */
  async getUserStats(query) {
    const allowedKeys = ["from", "to", "groupBy"];
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([k]) => allowedKeys.includes(k))
    );
    const cacheKey = analyticsCache.generateKey("users-stats", filteredQuery);
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const raw = await analyticsRepository.getUserStats(filteredQuery);

    const total = raw.overviewStats[0]?.total[0]?.count || 0;

    const status = {
      active: raw.overviewStats[0]?.status[0]?.active || 0,
      suspended: raw.overviewStats[0]?.status[0]?.suspended || 0,
      verified: raw.overviewStats[0]?.status[0]?.verified || 0,
      unverified: raw.overviewStats[0]?.status[0]?.unverified || 0
    };

    const byRole = {
      Admin: 0,
      User: 0,
      Judge: 0,
      Participant: 0,
      University: 0
    };
    if (Array.isArray(raw.overviewStats[0]?.byRole)) {
      raw.overviewStats[0].byRole.forEach((item) => {
        if (item._id) {
          byRole[item._id] = item.count || 0;
        }
      });
    }

    const byGender = {
      Male: 0,
      Female: 0,
      Other: 0
    };
    if (Array.isArray(raw.overviewStats[0]?.byGender)) {
      raw.overviewStats[0].byGender.forEach((item) => {
        if (item._id) {
          byGender[item._id] = item.count || 0;
        }
      });
    }

    const universityLabels = [];
    const universityData = [];
    if (Array.isArray(raw.topUniversities)) {
      raw.topUniversities.forEach((item) => {
        if (item._id !== null && item._id !== undefined) {
          universityLabels.push(String(item._id));
          universityData.push(item.count || 0);
        }
      });
    }

    const skillLabels = [];
    const skillData = [];
    if (Array.isArray(raw.topSkills)) {
      raw.topSkills.forEach((item) => {
        if (item._id !== null && item._id !== undefined) {
          skillLabels.push(String(item._id));
          skillData.push(item.count || 0);
        }
      });
    }

    const trendLabels = [];
    const trendDataFormatted = [];
    if (Array.isArray(raw.trendData)) {
      raw.trendData.forEach((item) => {
        if (item._id !== null && item._id !== undefined) {
          trendLabels.push(String(item._id));
          trendDataFormatted.push(item.count || 0);
        }
      });
    }

    const result = {
      total,
      status,
      byRole,
      byGender,
      topUniversities: { labels: universityLabels, data: universityData },
      topSkills: { labels: skillLabels, data: skillData },
      trend: { labels: trendLabels, data: trendDataFormatted }
    };

    analyticsCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }
}

/**
 * Zero-fills a time-series dataset to ensure consecutive intervals for charts.
 */
function zeroFillTimeSeries(rawData, groupBy, from, to) {
  const dataMap = new Map();
  if (Array.isArray(rawData)) {
    rawData.forEach(item => {
      if (item && item._id !== undefined && item._id !== null) {
        dataMap.set(String(item._id), Number(item.count) || 0);
      }
    });
  }

  let startDate = null;
  let endDate = null;

  if (from) {
    startDate = new Date(from);
  }
  if (to) {
    endDate = new Date(to);
  }

  // If boundaries are not provided, infer from data keys
  if (dataMap.size > 0) {
    const keys = Array.from(dataMap.keys()).sort();
    if (!startDate) {
      startDate = parseKeyToDate(keys[0], groupBy);
    }
    if (!endDate) {
      endDate = parseKeyToDate(keys[keys.length - 1], groupBy);
    }
  }

  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { labels: [], data: [] };
  }

  const labels = [];
  const data = [];

  let current = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

  if (groupBy === "daily") {
    while (current <= end) {
      const key = current.toISOString().split("T")[0];
      labels.push(key);
      data.push(dataMap.get(key) || 0);
      current.setUTCDate(current.getUTCDate() + 1);
    }
  } else if (groupBy === "weekly") {
    let currentWeekYear = getISOWeekAndYear(current);
    const endWeekYear = getISOWeekAndYear(end);

    const formatWeekKey = ({ year, week }) => `${year}-W${String(week).padStart(2, "0")}`;

    let currKey = formatWeekKey(currentWeekYear);
    const targetEndKey = formatWeekKey(endWeekYear);

    const visitedKeys = new Set();
    while (currKey <= targetEndKey || Array.from(visitedKeys).pop() < targetEndKey) {
      if (visitedKeys.has(currKey)) {
        break;
      }
      visitedKeys.add(currKey);
      labels.push(currKey);
      data.push(dataMap.get(currKey) || 0);

      current.setUTCDate(current.getUTCDate() + 7);
      currentWeekYear = getISOWeekAndYear(current);
      currKey = formatWeekKey(currentWeekYear);
    }
  } else {
    // Monthly (groupBy === "monthly" or default)
    let currYear = current.getUTCFullYear();
    let currMonth = current.getUTCMonth();

    const endYear = end.getUTCFullYear();
    const endMonth = end.getUTCMonth();

    while (currYear < endYear || (currYear === endYear && currMonth <= endMonth)) {
      const key = `${currYear}-${String(currMonth + 1).padStart(2, "0")}`;
      labels.push(key);
      data.push(dataMap.get(key) || 0);

      currMonth++;
      if (currMonth > 11) {
        currMonth = 0;
        currYear++;
      }
    }
  }

  return { labels, data };
}

function parseKeyToDate(key, groupBy) {
  if (groupBy === "daily") {
    return new Date(key + "T00:00:00.000Z");
  } else if (groupBy === "weekly") {
    const parts = key.split("-W");
    if (parts.length === 2) {
      const year = Number(parts[0]);
      const weekNum = Number(parts[1]);
      const simple = new Date(Date.UTC(year, 0, 4));
      const day = (simple.getUTCDay() + 6) % 7;
      simple.setUTCDate(simple.getUTCDate() - day);
      simple.setUTCDate(simple.getUTCDate() + (weekNum - 1) * 7);
      return simple;
    }
  } else {
    // Monthly (YYYY-MM)
    return new Date(key + "-01T00:00:00.000Z");
  }
  return new Date(key);
}

function getISOWeekAndYear(date) {
  const tempDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = (tempDate.getUTCDay() + 6) % 7;
  tempDate.setUTCDate(tempDate.getUTCDate() - day + 3);
  const firstThursday = tempDate.getTime();
  tempDate.setUTCMonth(0, 1);
  if (tempDate.getUTCDay() !== 4) {
    tempDate.setUTCMonth(0, 1 + ((4 - tempDate.getUTCDay() + 7) % 7));
  }
  const weekNum = 1 + Math.ceil((firstThursday - tempDate.getTime()) / 604800000);
  const year = new Date(firstThursday).getUTCFullYear();
  return { year, week: weekNum };
}

export default new AnalyticsService();
