/**
  auth.routes.js
  Defines Express routes for the auth domain.
 */
import { Router } from "express"
import authController from './auth.controller.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'
import asyncHandler from '../../libs/asyncHandler.js'
import {
  validate,
  registerUserValidation,
  loginUserValidation,
  verifyAccountValidation,
  resendVerificationValidation
} from './auth.validation.js'

const router = Router()

router.route("/register").post(validate(registerUserValidation), asyncHandler(authController.registerUser))
router.route("/verify-account").post(validate(verifyAccountValidation), asyncHandler(authController.verifyAccount))
router.route("/login").post(validate(loginUserValidation), asyncHandler(authController.loginUser))
router.route("/reverify").post(validate(resendVerificationValidation), asyncHandler(authController.reverifyUser))
router.route("/me").get(verifyJWT, asyncHandler(authController.getMe))
router.route("/logout").post(verifyJWT, asyncHandler(authController.logoutUser))
router.route("/refresh").post(asyncHandler(authController.refreshAccessToken))

export default router;