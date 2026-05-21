/**
  analytics.routes.js
  Maps HTTP routes to controllers, applies global admin auth and query validation middleware.
 */

import { Router } from "express";
import asyncHandler from "../../../libs/asyncHandler.js";
import analyticsController from "./analytics.controller.js";
import { verifyJWT, verifyAdmin } from "../../../middleware/auth.middleware.js";
import {
  validate,
  overviewAnalyticsSchema,
  registrationAnalyticsSchema,
  revenueAnalyticsSchema,
  submissionAnalyticsSchema,
  resultsAnalyticsSchema,
  participationTrendsAnalyticsSchema,
  universityAnalyticsSchema,
  judgeAnalyticsSchema,
  certificateAnalyticsSchema,
  hackathonStatsAnalyticsSchema,
  userStatsAnalyticsSchema,
} from "./analytics.validation.js";

const router = Router();

// Apply auth and admin check globally to all analytics routes
router.use(verifyJWT);
router.use(verifyAdmin);

// GET /admin/analytics/overview
router.get(
  "/overview",
  validate(overviewAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getOverview)
);

// GET /admin/analytics/registrations
router.get(
  "/registrations",
  validate(registrationAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getRegistrations)
);

// GET /admin/analytics/revenue
router.get(
  "/revenue",
  validate(revenueAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getRevenue)
);

// GET /admin/analytics/submissions
router.get(
  "/submissions",
  validate(submissionAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getSubmissions)
);

// GET /admin/analytics/results
router.get(
  "/results",
  validate(resultsAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getResults)
);

// GET /admin/analytics/participation-trends
router.get(
  "/participation-trends",
  validate(participationTrendsAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getParticipationTrends)
);

// GET /admin/analytics/universities
router.get(
  "/universities",
  validate(universityAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getUniversities)
);

// GET /admin/analytics/judges
router.get(
  "/judges",
  validate(judgeAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getJudges)
);

// GET /admin/analytics/certificates
router.get(
  "/certificates",
  validate(certificateAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getCertificates)
);

// GET /admin/analytics/hackathons/stats
router.get(
  "/hackathons",
  validate(hackathonStatsAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getHackathonStats)
);

// GET /admin/analytics/users/stats
router.get(
  "/users",
  validate(userStatsAnalyticsSchema, "query"),
  asyncHandler(analyticsController.getUserStats)
);

export default router;
