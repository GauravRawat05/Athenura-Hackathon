/**
  adminSetting.routes.js
  Defines Express routes for admin settings management.
*/

import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminSettingController from './adminSetting.controller.js'
import { validate, updatePaymentValidation } from './adminSetting.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminSettingController.getSettings))
router.patch('/payment', verifyJWT, verifyAdmin, validate(updatePaymentValidation), asyncHandler(adminSettingController.updatePayment))

export default router
