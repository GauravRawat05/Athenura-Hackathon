/**
 * adminHackathon.routes.js
 * Defines Express routes for admin hackathon operations.
 */
import { Router } from "express";
import asyncHandler from "../../../libs/asyncHandler.js";
import adminHackathonController from "./adminHackathon.controller.js";
import { verifyAdmin, verifyJWT } from "../../../middleware/auth.middleware.js";
import { validate } from "../../registrations/registration.validation.js";
import { listRegistrationsValidation } from "./adminHackathon.validation.js";

const router = Router();

// Apply admin middleware to routes that require admin access

// Create a new hackathon
router.post(
  "/create-hackathon",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.createHackathon)
);

// Get a single hackathon by ID
router.get(
  "/:hackathonId",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.getHackathon)
);

// Update hackathon details
router.patch(
  "/:hackathonId",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.updateHackathon)
);

// Update hackathon rules
router.patch(
  "/:hackathonId/rules",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.updateHackathonRules)
);

// Delete a hackathon
router.delete(
  "/:hackathonId",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.deleteHackathon)
);

// List registrations for a specific hackathon
router.get(
  "/:hackathonId/registrations",
  verifyJWT,
  verifyAdmin,
  validate(listRegistrationsValidation, "query"),
  asyncHandler(adminHackathonController.listRegistrations)
);

export default router;