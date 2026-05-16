/**
  adminAuth.validation.js
  Joi validation schemas for admin and judge authentication.
*/
import Joi from "joi"

const passwordSchema = Joi.string().min(8).max(128).required().messages({
  "string.min": "Password must be at least 8 characters",
  "string.max": "Password cannot exceed 128 characters",
  "any.required": "Password is required"
})

const phoneSchema = Joi.number().integer().positive().required().messages({
  "number.base": "Phone number must be a valid number",
  "number.integer": "Phone number must be an integer",
  "number.positive": "Phone number must be a positive number",
  "any.required": "Phone number is required"
})

const confirmPasswordSchema = Joi.string().valid(Joi.ref("password")).required().messages({
  "any.only": "Passwords do not match",
  "any.required": "Confirm password is required"
})

// ── Register validation — role decides which secret key is required ──────────
export const registerAdminValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required"
  }),
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  phone: phoneSchema,
  role: Joi.string().valid("Admin", "Judge").required().messages({
    "any.only": "Role must be either 'Admin' or 'Judge'",
    "any.required": "Role is required"
  }),
  adminSecretKey: Joi.string().when("role", { is: "Admin", then: Joi.required(), otherwise: Joi.optional() }),
  judgeSecretKey: Joi.string().when("role", { is: "Judge", then: Joi.required(), otherwise: Joi.optional() }),
  judgeId: Joi.string().min(3).max(50).when("role", { is: "Judge", then: Joi.required(), otherwise: Joi.optional() })
}).with("adminSecretKey", "role").with("judgeSecretKey", "judgeId").messages({
  "any.only": "Role must be 'Admin' or 'Judge'"
})

// ── Login validation — no role or secret key in the body ────────────────────
export const loginAdminValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required"
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required"
  })
})

// Validate middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    })

    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join(", ")

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessages
      })
    }

    req.body = value
    next()
  }
}
