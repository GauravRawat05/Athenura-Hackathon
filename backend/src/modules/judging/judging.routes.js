import { Router } from "express";
import { verifyJWT, verifyJudge } from "../../middleware/auth.middleware.js";
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

router.route("/admin/hackathons/:hackathonId/assign").post(
  verifyJWT,
  restrictTo("Admin", "SuperAdmin"),
  validateParams(hackathonIdParamValidation),
  validate(assignJudgesValidation),
  asyncHandler(judgingController.assignJudges)
);

router.route("/admin/hackathons/:hackathonId/judges").get(
  verifyJWT,
  restrictTo("Admin", "SuperAdmin"),
  validateParams(hackathonIdParamValidation),
  asyncHandler(judgingController.getHackathonJudges)
);

// Judge Routes
router.route("/assignments").get(
  verifyJWT,
  verifyJudge,
  asyncHandler(judgingController.getAssignments)
);

router.route("/hackathons/:hackathonId/submissions").get(
  verifyJWT,
  verifyJudge,
  validateParams(hackathonIdParamValidation),
  asyncHandler(judgingController.getSubmissionsForJudge)
);

router.route("/submissions/:submissionId/scores").post(
  verifyJWT,
  verifyJudge,
  validateParams(submissionIdParamValidation),
  validate(submitScoreValidation),
  asyncHandler(judgingController.submitScore)
);

router.route("/scores/:scoreId").patch(
  verifyJWT,
  verifyJudge,
  validateParams(scoreIdParamValidation),
  validate(updateScoreValidation),
  asyncHandler(judgingController.updateScore)
);

export default router;
