/**
  adminReport.routes.js
  Defines Express routes for admin report management.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminReportController from './adminReport.controller.js'
import { validate, reportIdValidation, createReportValidation, updateReportValidation } from './adminReport.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminReportController.listReports))
router.get('/:reportId', verifyJWT, verifyAdmin, validate(reportIdValidation, 'params'), asyncHandler(adminReportController.getReportById))
router.post('/', verifyJWT, verifyAdmin, validate(createReportValidation), asyncHandler(adminReportController.createReport))
router.patch('/:reportId', verifyJWT, verifyAdmin, validate(updateReportValidation), asyncHandler(adminReportController.updateReport))
router.post('/:reportId/run', verifyJWT, verifyAdmin, validate(reportIdValidation, 'params'), asyncHandler(adminReportController.runReport))
router.delete('/:reportId', verifyJWT, verifyAdmin, validate(reportIdValidation, 'params'), asyncHandler(adminReportController.deleteReport))

export default router
