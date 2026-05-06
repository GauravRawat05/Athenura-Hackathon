/**
  team.validation.js
  Declares request validation rules for team payloads.
 */
import Joi from "joi";

// Create team validation
export const createTeamValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .trim()
    .messages({
      "string.min": "Team name must be at least 3 characters",
      "string.max": "Team name cannot exceed 50 characters",
      "any.required": "Team name is required"
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .allow("")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 500 characters"
    })
});

// Update team validation
export const updateTeamValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .optional()
    .messages({
      "string.min": "Team name must be at least 3 characters",
      "string.max": "Team name cannot exceed 50 characters"
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .allow("")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 500 characters"
    }),
  leader: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.hex": "Leader ID must be a valid ObjectId",
      "string.length": "Leader ID must be 24 characters"
    })
}).min(1).messages({
  "object.min": "At least one field must be provided for update"
});

// Invite member validation
export const inviteMemberValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required"
    })
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessage
      });
    }

    req.body = value;
    next();
  };
};
