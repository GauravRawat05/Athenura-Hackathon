/**
  submission.routes.js
  Defines Express routes for the submission domain and maps each endpoint to a controller.
 */
import { Router } from "express"
import submissionController from "./submission.controller.js"
import { verifyJWT } from "../../middleware/auth.middleware.js"
import asyncHandler from "../../libs/asyncHandler.js"
import {
  validate,
  validateParams,
  createSubmissionValidation,
  updateSubmissionValidation,
  hackathonIdParamValidation,
  submissionIdParamValidation
} from "./submission.validation.js"

const router = Router()

// POST /api/v1/submissions/hackathons/:hackathonId/submissions — Create submission
router.route("/hackathons/:hackathonId/submissions")
  .post(
    verifyJWT,
    validateParams(hackathonIdParamValidation),
    validate(createSubmissionValidation),
    asyncHandler(submissionController.createSubmission)
  )

// GET /api/v1/submissions/hackathons/:hackathonId/submissions/me — Get my submission
router.route("/hackathons/:hackathonId/submissions/me")
  .get(
    verifyJWT,
    validateParams(hackathonIdParamValidation),
    asyncHandler(submissionController.getMySubmission)
  )

// PATCH /api/v1/submissions/:submissionId — Update submission
router.route("/:submissionId")
  .patch(
    verifyJWT,
    validateParams(submissionIdParamValidation),
    validate(updateSubmissionValidation),
    asyncHandler(submissionController.updateSubmission)
  )

// GET /api/v1/submissions/:submissionId/versions — Get version history
router.route("/:submissionId/versions")
  .get(
    verifyJWT,
    validateParams(submissionIdParamValidation),
    asyncHandler(submissionController.getVersions)
  )

export default router
