/**
   registration.routes.js
   Defines registration management routes: get my registrations, cancel registration.
   Note: The actual registration creation endpoint (POST /hackathons/:hackathonId/register)
   is defined directly in api.js under the hackathons prefix.
 */
import { Router } from "express";
import registrationController from "./registration.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../libs/asyncHandler.js";
import { validate, cancelRegistrationValidation } from "./registration.validation.js";

const router = Router();

// Get current user's registrations
router.get(
  "/me",
  verifyJWT,
  asyncHandler(registrationController.getMyRegistrations)
);

// Cancel a registration
router.patch(
  "/:registrationId/cancel",
  verifyJWT,
  validate(cancelRegistrationValidation),
  asyncHandler(registrationController.cancel)
);

export default router;
