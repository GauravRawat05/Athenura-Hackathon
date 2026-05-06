/**
  adminUser.routes.js
  Defines Express routes for admin user management.
*/

import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminUserController from './adminUser.controller.js'
import { validate, resetPasswordValidation } from './adminUser.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminUserController.listUsers))
router.get('/:userId', verifyJWT, verifyAdmin, asyncHandler(adminUserController.getUserById))
router.patch('/:userId/suspend', verifyJWT, verifyAdmin, asyncHandler(adminUserController.suspendUser))
router.patch('/:userId/restore', verifyJWT, verifyAdmin, asyncHandler(adminUserController.restoreUser))
router.post('/:userId/resetpassword', verifyJWT, verifyAdmin, validate(resetPasswordValidation), asyncHandler(adminUserController.resetPassword))

export default router
