/**
  auth.validation.js
  Declares request validation rules for auth payloads.
 */
import Joi from "joi"

// Common field definitions
const emailSchema = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required"
})

const passwordSchema = Joi.string()
  .min(6)
  .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
  .required()
  .messages({
    "string.min": "Password must be at least 6 characters long",
    "string.pattern.base": "Password must contain at least one uppercase letter and one special symbol",
    "any.required": "Password is required"
  })

const phoneSchema = Joi.number().integer().positive().messages({
  "number.base": "Phone number must be a valid number",
  "number.positive": "Phone number must be positive"
})

// User registration validation
export const registerUserValidation = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name cannot exceed 100 characters",
    "any.required": "Full name is required"
  }),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
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
  resumeLink: Joi.string().uri().messages({
    "string.uri": "Please provide a valid URL for resume"
  }),
  skills: Joi.array().items(Joi.string().trim().min(1)).messages({
    "array.base": "Skills must be an array of strings"
  }),

  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Gender must be Male, Female, or Other"
  })
})

// Login validation
export const loginUserValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required"
  }),
  phone: phoneSchema,
  password: passwordSchema
}).or("email", "phone").messages({
  "object.missing": "Either email or phone is required"
})

// Account verification validation (OTP only)
export const verifyAccountValidation = Joi.object({
  email: emailSchema,
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
    "any.required": "OTP is required"
  })
})

// Resend verification validation
export const resendVerificationValidation = Joi.object({
  email: emailSchema
})

// Forgot password validation
export const forgotPasswordValidation = Joi.object({
  email: emailSchema,
  phone: phoneSchema
}).or("email", "phone").messages({
  "object.missing": "Either email or phone is required"
})

// Reset password validation
export const resetPasswordValidation = Joi.object({
  email: emailSchema,
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
    "any.required": "OTP is required"
  }),
  newPassword: passwordSchema
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
