/**
  * adminHackathon.routes.js
  * Defines Express routes for admin hackathon operations.
  */
import { Router } from "express";
import formidable from "formidable";
import ApiError from "../../../libs/apiError.js";
import asyncHandler from "../../../libs/asyncHandler.js";
import adminHackathonController from "./adminHackathon.controller.js";
import { verifyAdmin, verifyJWT } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { 
  createHackathonValidation, 
  updateHackathonValidation, 
  listRegistrationsValidation 
} from "./adminHackathon.validation.js";
import { overrideResultsBodyValidation } from "../results/adminResult.validation.js";

const router = Router();

const HACKATHON_SCALAR_FIELDS = {
  title: true,
  problemStatement: true,
  slug: true,
  description: true,
  startDate: true,
  endDate: true,
  registrationDeadline: true,
  submissionDeadline: true,
  prizePool: true,
  registrationFee: true,
  currency: true,
  minTeamSize: true,
  maxTeamSize: true,
  status: true,
  detailsPdfUrl: true
};

const multipartMiddleware = (req, res, next) => {
  const isMultipart =
    req.is("multipart/form-data") ||
    req.headers["content-type"]?.startsWith("multipart/");

  if (!isMultipart) {
    return next();
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
    keepExtensions: true,
    filter: ({ mimetype }) => {
      return !!mimetype && mimetype === "application/pdf";
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(new ApiError(400, err.message || "Invalid PDF upload file"));
    }

    const normalisedFields = {};
    const normalisedFiles = {};

    for (const [key, value] of Object.entries(fields)) {
      const rawArray = Array.isArray(value) ? value : [value];
      
      // Check if the value is JSON-encoded
      if (rawArray[0] && typeof rawArray[0] === 'string' && (rawArray[0].startsWith('[') || rawArray[0].startsWith('{'))) {
        try {
          normalisedFields[key] = JSON.parse(rawArray[0]);
          continue;
        } catch (e) {
          // If it fails parsing, fall through
        }
      }

      if (HACKATHON_SCALAR_FIELDS[key]) {
        normalisedFields[key] = rawArray[0];
      } else {
        // Keep array fields as array of strings
        normalisedFields[key] = rawArray;
      }
    }

    for (const [key, value] of Object.entries(files)) {
      normalisedFiles[key] = Array.isArray(value) ? value[0] : value;
    }

    req.files = normalisedFiles;
    req.body = normalisedFields;
    next();
  });
};

// Apply admin middleware to routes that require admin access

// Create a new hackathon
router.post(
  "/create-hackathon",
  verifyJWT,
  verifyAdmin,
  multipartMiddleware,
  validate(createHackathonValidation),
  asyncHandler(adminHackathonController.createHackathon)
);

// Get all hackathons
router.get(
  "/hackathons",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.getAllHackathons)
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
  multipartMiddleware,
  validate(updateHackathonValidation),
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

// Compute scores & ranks
router.post(
  "/:hackathonId/results/compute",
  verifyJWT,
  verifyAdmin,
  asyncHandler(adminHackathonController.computeResults)
);

// Override ranks/awards - accepts frontend format { overrides: [{ submissionId, rank, awardCategory, notes }] }
router.patch(
  "/:hackathonId/results/override",
  verifyJWT,
  verifyAdmin,
  (req, res, next) => {
    const { error, value } = overrideResultsBodyValidation.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });
    if (error) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message.replace(/['"]/g, '')
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    req.body = value;
    next();
  },
  asyncHandler(adminHackathonController.overrideResults)
);

export default router;