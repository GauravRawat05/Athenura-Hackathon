/**
 * university.routes.js
 * Routes for university authenticated endpoints.
 */
import { Router } from 'express'
import asyncHandler from '../../libs/asyncHandler.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'
import { userRoles } from '../users/user.constants.js'
import universityController from './university.controller.js'

const router = Router()

// University-only guard (role check)
const verifyUniversity = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' })
  if (req.user.role !== userRoles.UNIVERSITY) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
  next()
}

router.get('/me', verifyJWT, verifyUniversity, asyncHandler(universityController.getMe))
router.get('/me/students', verifyJWT, verifyUniversity, asyncHandler(universityController.getMyStudents))

export default router
