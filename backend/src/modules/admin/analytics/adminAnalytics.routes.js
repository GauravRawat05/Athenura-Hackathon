/**
  adminAnalytics.routes.js
  Defines Express routes for admin analytics domain.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminAnalyticsController from './adminAnalytics.controller.js'

const router = Router()

router.get('/dashboard', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getDashboard))
router.get('/hackathons/stats', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getHackathonStats))
router.get('/users/stats', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getUserStats))
router.get('/registrations/stats', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getRegistrationStats))
router.get('/submissions/stats', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getSubmissionStats))
router.get('/results/stats', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getResultStats))
router.get('/payments/stats', verifyJWT, verifyAdmin, asyncHandler(adminAnalyticsController.getPaymentStats))

export default router

