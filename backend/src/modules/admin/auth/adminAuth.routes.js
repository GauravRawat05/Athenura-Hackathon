/**
  adminAuth.routes.js
  Defines Express routes for admin authentication.
 */
import { Router } from "express"
import adminAuthController from "./adminAuth.controller.js"
import asyncHandler from "../../../libs/asyncHandler.js"
import {
  validate,
  adminRegisterValidation,
  adminLoginValidation
} from "./adminAuth.validation.js"

const router = Router()

router.route("/register").post(
  validate(adminRegisterValidation),
  asyncHandler(adminAuthController.registerAdmin)
)

router.route("/login").post(
  validate(adminLoginValidation),
  asyncHandler(adminAuthController.loginAdmin)
)

export default router
