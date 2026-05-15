/**
  user.routes.js
  Defines Express routes for the user domain.
 */
import { Router } from "express"
import userController from './user.controller.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'
import asyncHandler from '../../libs/asyncHandler.js'
import { validate, updateProfileValidation } from './user.validation.js'

const router = Router()

router.route("/me").get(verifyJWT, asyncHandler(userController.getProfile))
.patch(verifyJWT, validate(updateProfileValidation), asyncHandler(userController.updateProfile))

router.route("/me/results").get(verifyJWT, asyncHandler(userController.getMyResults))

export default router