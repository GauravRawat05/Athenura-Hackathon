/**
   user.routes.js
   Defines Express routes for the user domain.
  */
import { Router } from "express"
import formidable from "formidable"
import ApiError from "../../libs/apiError.js"
import userController from './user.controller.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'
import asyncHandler from '../../libs/asyncHandler.js'
import { validate, updateProfileValidation } from './user.validation.js'
import { PROFILE_PHOTO_MAX_FILE_SIZE, ALLOWED_PROFILE_PHOTO_MIMETYPES } from '../../constants/user.constants.js'

const router = Router()

// Fields that are legitimately always a single scalar value.
// Any field not listed here is kept as an array when the browser
// sends multiple entries for the same key (e.g. skills=react&skills=node).
const SCALAR_FIELDS = {
  fullName: true,
  phone: true,
  dateOfBirth: true,
  collegeOrUniversity: true,
  graduationYear: true,
  resumeLink: true,
}

// Parses multipart form-data when present. Formidable v3 returns every
// field as an array; for multi-value fields like "skills" we preserve the
// full array so downstream Joi validation sees [ 'react', 'node', … ].
// Scalar fields are unwrapped to their first element so Joi still sees a
// plain value for those.
const parseMultipart = (req) => {
  return new Promise((resolve, reject) => {
    const isMultipart =
      req.is("multipart/form-data") ||
      req.headers["content-type"]?.startsWith("multipart/")

    if (!isMultipart) return resolve()

    const form = formidable({
      maxFileSize: PROFILE_PHOTO_MAX_FILE_SIZE,
      maxFiles: 1,
      keepExtensions: true,
      filter: ({ mimetype }) => {
        return !!mimetype && ALLOWED_PROFILE_PHOTO_MIMETYPES.includes(mimetype)
      }
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(new ApiError(400, err.message || "Invalid profile photo"))
      }

      // Formidable v3: scalar fields come as single-element arrays — unwrap them.
      // Multi-value fields (e.g. skills) are kept as-is so the full array is
      // passed through to Joi validation and eventually to the service layer.
      // Files always come keyed by field name — unwrap single-file arrays.
      // e.g. { profilePhoto: [fileObj] } → { profilePhoto: fileObj }
      const normalisedFields = {}
      const normalisedFiles = {}

      for (const [key, value] of Object.entries(fields)) {
        // Non-scalar fields (e.g. skills) keep their full array so the array
        // form passes Joi validation. Fields explicitly listed in SCALAR_FIELDS
        // are unwrapped to their first element for plain-string validation.
        if (SCALAR_FIELDS[key]) {
          normalisedFields[key] = Array.isArray(value) ? value[0] : value
        } else {
          normalisedFields[key] = value
        }
      }
      for (const [key, value] of Object.entries(files)) {
        normalisedFiles[key] = Array.isArray(value) ? value[0] : value
      }

      req.files = normalisedFiles
      req.body = normalisedFields
      resolve()
    })
  })
}

router.route("/me").get(verifyJWT, asyncHandler(userController.getProfile))
.patch(
  verifyJWT,
  asyncHandler(async (req, res, next) => {
    try {
      await parseMultipart(req)
    } catch (parseErr) {
      return next(parseErr)
    }
    next()
  }),
  validate(updateProfileValidation),
  asyncHandler(userController.updateProfile)
)

router.route("/me/results").get(verifyJWT, asyncHandler(userController.getMyResults))

export default router
