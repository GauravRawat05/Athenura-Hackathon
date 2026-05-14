/**
  adminResult.routes.js
  Defines Express routes for admin result management.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminResultController from './adminResult.controller.js'
import { validate, resultIdValidation, createResultValidation, updateResultValidation, publishResultsValidation } from './adminResult.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminResultController.listResults))
router.get('/:resultId', verifyJWT, verifyAdmin, validate(resultIdValidation, 'params'), asyncHandler(adminResultController.getResultById))
router.post('/', verifyJWT, verifyAdmin, validate(createResultValidation), asyncHandler(adminResultController.createResult))
router.patch('/:resultId', verifyJWT, verifyAdmin, validate(resultIdValidation, 'params'), validate(updateResultValidation), asyncHandler(adminResultController.updateResult))
router.post('/publish/:hackathonId', verifyJWT, verifyAdmin, validate(publishResultsValidation), asyncHandler(adminResultController.publishResults))
router.get('/hackathon/:hackathonId', verifyJWT, verifyAdmin, asyncHandler(adminResultController.getHackathonResults))

export default router
