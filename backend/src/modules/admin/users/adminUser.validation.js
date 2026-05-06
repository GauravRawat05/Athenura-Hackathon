/**
  adminUser.validation.js
  Declares request validation rules for adminUser payloads.
 */
import Joi from 'joi'

export const resetPasswordValidation = Joi.object({
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/)
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special symbol',
    })
    .optional(),
}).messages({
  'object.base': 'Request body must be an object',
})

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage,
      })
    }

    req.body = value
    next()
  }
}
