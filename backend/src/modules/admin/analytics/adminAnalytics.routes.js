/**
  adminAnalytics.routes.js
  Defines Express routes for admin analytics domain.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT } from '../../../middleware/auth.middleware.js'
import adminAnalyticsController from './adminAnalytics.controller.js'
import { restrictTo } from '../../../middleware/role.middleware.js'

const router = Router()

router.get('/dashboard', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getDashboard))
router.get('/hackathons/stats', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getHackathonStats))
router.get('/users/stats', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getUserStats))
router.get('/registrations/stats', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getRegistrationStats))
router.get('/submissions/stats', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getSubmissionStats))
router.get('/results/stats', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getResultStats))
router.get('/payments/stats', verifyJWT, restrictTo('Admin'), asyncHandler(adminAnalyticsController.getPaymentStats))

export default router

