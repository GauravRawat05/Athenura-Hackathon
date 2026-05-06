/**
  adminUniversity.routes.js
  Defines Express routes for admin university management.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminUniversityController from './adminUniversity.controller.js'
import { validate, universityIdValidation, createUniversityValidation, updateUniversityValidation } from './adminUniversity.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminUniversityController.listUniversities))
router.get('/:universityId', verifyJWT, verifyAdmin, validate(universityIdValidation, 'params'), asyncHandler(adminUniversityController.getUniversityById))
router.post('/', verifyJWT, verifyAdmin, validate(createUniversityValidation), asyncHandler(adminUniversityController.createUniversity))
router.patch('/:universityId', verifyJWT, verifyAdmin, validate(updateUniversityValidation), asyncHandler(adminUniversityController.updateUniversity))
router.delete('/:universityId', verifyJWT, verifyAdmin, validate(universityIdValidation, 'params'), asyncHandler(adminUniversityController.deleteUniversity))
router.get('/:universityId/stats', verifyJWT, verifyAdmin, validate(universityIdValidation, 'params'), asyncHandler(adminUniversityController.getUniversityStats))

export default router
