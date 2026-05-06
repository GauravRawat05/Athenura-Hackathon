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

router.get('/dashboard', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getDashboard))
router.get('/hackathons/stats', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getHackathonStats))
router.get('/users/stats', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getUserStats))
router.get('/registrations/stats', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getRegistrationStats))
router.get('/submissions/stats', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getSubmissionStats))
router.get('/results/stats', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getResultStats))
router.get('/payments/stats', verifyJWT, restrictTo('admin'), asyncHandler(adminAnalyticsController.getPaymentStats))

export default router

