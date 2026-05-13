/**
  adminAuth.validation.js
  Joi validation schemas for admin authentication.
 */
import Joi from "joi"

const emailSchema = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required"
})

const passwordSchema = Joi.string().min(8).max(128).required().messages({
  "string.min": "Password must be at least 8 characters",
  "string.max": "Password cannot exceed 128 characters",
  "any.required": "Password is required"
})

// Admin registration validation
export const adminRegisterValidation = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  phone: Joi.number().integer().positive().required().messages({
    "number.base": "Phone number must be a valid number",
    "number.integer": "Phone number must be an integer",
    "number.positive": "Phone number must be a positive number",
    "any.required": "Phone number is required"
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required"
  }),
  adminSecretKey: Joi.string().required().messages({
    "any.required": "Admin secret key is required"
  })
})

// Admin login validation
export const adminLoginValidation = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    "any.required": "Password is required"
  })
})

// Validate middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message)
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Validation failed",
        errors: errorMessages
      })
    }
    
    next()
  }
}
