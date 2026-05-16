import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/role.middleware.js";
import asyncHandler from "../../libs/asyncHandler.js";
import judgingController from "./judging.controller.js";
import {
  assignJudgesValidation,
  submitScoreValidation,
  updateScoreValidation,
  hackathonIdParamValidation,
  submissionIdParamValidation,
  scoreIdParamValidation,
  validate,
  validateParams
} from "./judging.validation.js";

const router = Router();

// Admin Routes
router.route("/admin/judges").get(
  verifyJWT,
  restrictTo("Admin", "SuperAdmin"),
  asyncHandler(judgingController.getAllJudges)
);

router.route("/admin/hackathons/:hackathonId/judges/assign").post(
  verifyJWT,
  restrictTo("Admin", "SuperAdmin"),
  validateParams(hackathonIdParamValidation),
  validate(assignJudgesValidation),
  asyncHandler(judgingController.assignJudges)
);

// Judge Routes
router.route("/judge/assignments").get(
  verifyJWT,
  restrictTo("Judge"),
  asyncHandler(judgingController.getAssignments)
);

router.route("/judge/hackathons/:hackathonId/submissions").get(
  verifyJWT,
  restrictTo("Judge"),
  validateParams(hackathonIdParamValidation),
  asyncHandler(judgingController.getSubmissionsForJudge)
);

router.route("/judge/submissions/:submissionId/scores").post(
  verifyJWT,
  restrictTo("Judge"),
  validateParams(submissionIdParamValidation),
  validate(submitScoreValidation),
  asyncHandler(judgingController.submitScore)
);

router.route("/judge/scores/:scoreId").patch(
  verifyJWT,
  restrictTo("Judge"),
  validateParams(scoreIdParamValidation),
  validate(updateScoreValidation),
  asyncHandler(judgingController.updateScore)
);

export default router;
