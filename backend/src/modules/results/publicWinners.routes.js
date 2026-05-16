/**
 * publicWinners.routes.js
 * Public/non-admin winners endpoint (JWT required, non-admin access).
 */
import { Router } from "express";
import asyncHandler from "../../libs/asyncHandler.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import publicWinnersController from "./publicWinners.controller.js";
import { hackathonIdParamValidation } from "./publicWinners.validation.js";
import { validate } from "../registrations/registration.validation.js";

const router = Router();

// GET /api/winners/:hackathonId
router.get(
  "/:hackathonId",
  verifyJWT,
  validate(hackathonIdParamValidation, "params"),
  asyncHandler(publicWinnersController.getWinners)
);

export default router;
