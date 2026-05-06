/**
  adminSetting.validation.js
  Declares request validation rules for adminSetting payloads.
 */
import Joi from 'joi'

export const updatePaymentValidation = Joi.object()
  .min(1)
  .unknown(true)
  .required()
  .messages({
    'object.base': 'Payment configuration must be an object',
    'object.min': 'Payment configuration cannot be empty',
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
