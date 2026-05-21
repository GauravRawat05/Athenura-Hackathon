/**
  user.validation.js
  Declares request validation rules for user payloads.
 */
import Joi from "joi"

// Update profile validation
export const updateProfileValidation = Joi.object({
  fullName: Joi.string().min(2).max(100).messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name cannot exceed 100 characters"
  }),
  phone: Joi.number().integer().positive().messages({
    "number.base": "Phone number must be a valid number",
    "number.positive": "Phone number must be positive"
  }),
  dateOfBirth: Joi.date().less("now").messages({
    "date.less": "Date of birth must be in the past"
  }),
  collegeOrUniversity: Joi.string().max(200).messages({
    "string.max": "College/University name cannot exceed 200 characters"
  }),
  graduationYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 10)
    .messages({
      "number.min": "Graduation year must be after 1900",
      "number.max": "Graduation year seems too far in the future"
    }),
  skills: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim().min(1)).messages({
      "array.base": "Skills must be an array of strings"
    }),
    Joi.string().messages({
      "string.base": "Skills can be a comma-separated string"
    })
  ),
  resumeLink: Joi.string().uri().messages({
    "string.uri": "Please provide a valid URL for resume"
  })
})

// Custom validation middleware factory
// Accepts req.files (from formidable multipart parsing) so that a photo-only
// upload — which has an empty req.body but a populated req.files.profilePhoto —
// passes validation instead of failing on .min(1).
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ")
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessage
      })
    }

    // Guard: at least one body field OR a profile photo file must be present
    const hasBodyFields = Object.keys(value).length > 0
    const hasProfilePhoto = !!(req.files && req.files.profilePhoto)

    if (!hasBodyFields && !hasProfilePhoto) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: "At least one field or a profile photo must be provided for update"
      })
    }

    req.body = value
    next()
  }
}
