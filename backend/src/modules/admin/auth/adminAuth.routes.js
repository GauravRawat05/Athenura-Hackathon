/**
  adminAuth.routes.js
  Defines Express routes for admin authentication.
 */
import { Router } from "express"
import adminAuthController from "./adminAuth.controller.js"
import asyncHandler from "../../../libs/asyncHandler.js"
import {
  validate,
  registerAdminValidation,
  loginAdminValidation,
  forgotPasswordValidation
} from "./adminAuth.validation.js"

const router = Router()

router.route("/registerAdminOrJudge").post(
  validate(registerAdminValidation),
  asyncHandler(adminAuthController.registerAdmin)
)

router.route("/loginAdminOrJudge").post(
  validate(loginAdminValidation),
  asyncHandler(adminAuthController.loginAdmin)
)

router.route("/forgotPassword").post(
  validate(forgotPasswordValidation),
  asyncHandler(adminAuthController.forgotPassword)
)

export default router
