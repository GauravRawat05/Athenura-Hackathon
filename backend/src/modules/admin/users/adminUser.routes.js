/**
  adminUser.routes.js
  Defines Express routes for admin user management.
*/

import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT } from '../../../middleware/auth.middleware.js'
import adminUserController from './adminUser.controller.js'
import { validate, resetPasswordValidation } from './adminUser.validation.js'
import { restrictTo } from '../../../middleware/role.middleware.js'


const router = Router()

router.get('/', verifyJWT, restrictTo('admin'), asyncHandler(adminUserController.listUsers))
router.get('/:userId', verifyJWT, restrictTo('admin'), asyncHandler(adminUserController.getUserById))
router.patch('/:userId/suspend', verifyJWT, restrictTo('admin'), asyncHandler(adminUserController.suspendUser))
router.patch('/:userId/restore', verifyJWT, restrictTo('admin'), asyncHandler(adminUserController.restoreUser))
router.post('/:userId/resetpassword', verifyJWT, restrictTo('admin'), validate(resetPasswordValidation), asyncHandler(adminUserController.resetPassword))

export default router
