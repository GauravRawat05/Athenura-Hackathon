/**
  submission.validation.js
  Declares request validation rules for submission payloads, query strings, and route params.
 */
import Joi from "joi"

// Create submission validation
export const createSubmissionValidation = Joi.object({
  title: Joi.string().min(3).max(200).trim().required().messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Project title is required"
  }),
  description: Joi.string().max(5000).trim().required().messages({
    "string.max": "Description cannot exceed 5000 characters",
    "any.required": "Project description is required"
  }),
  techStack: Joi.array().items(Joi.string().trim().min(1)).optional().messages({
    "array.base": "Tech stack must be an array of strings"
  }),
  repoUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid repository URL"
  }),
  demoUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid demo URL"
  })
})

// Update submission validation
export const updateSubmissionValidation = Joi.object({
  title: Joi.string().min(3).max(200).trim().optional().messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 200 characters"
  }),
  description: Joi.string().max(5000).trim().optional().messages({
    "string.max": "Description cannot exceed 5000 characters"
  }),
  techStack: Joi.array().items(Joi.string().trim().min(1)).optional().messages({
    "array.base": "Tech stack must be an array of strings"
  }),
  repoUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid repository URL"
  }),
  demoUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid demo URL"
  })
}).or("title", "description", "techStack", "repoUrl", "demoUrl").messages({
  "object.missing": "At least one field is required to update"
})

// Param validation for hackathonId
export const hackathonIdParamValidation = Joi.object({
  hackathonId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid hackathon ID format",
    "string.length": "Hackathon ID must be 24 characters",
    "any.required": "Hackathon ID is required"
  })
})

// Param validation for submissionId
export const submissionIdParamValidation = Joi.object({
  submissionId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid submission ID format",
    "string.length": "Submission ID must be 24 characters",
    "any.required": "Submission ID is required"
  })
})

// Validation middleware factory
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

    req.body = value
    next()
  }
}

// Param validation middleware factory
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: false
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

    next()
  }
}
