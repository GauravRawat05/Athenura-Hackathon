/**
  adminPayment.validation.js
  Declares request validation rules for adminPayment payloads.
 */
import Joi from 'joi'

export const paymentIdValidation = Joi.object({
  paymentId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid payment ID format')
    }
    return value
  })
})

export const updatePaymentValidation = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').optional(),
  method: Joi.string().optional().max(50),
  transactionId: Joi.string().optional().max(100),
  amount: Joi.number().min(0).optional(),
  currency: Joi.string().optional().length(3)
})

export const refundPaymentValidation = Joi.object({
  paymentId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid payment ID format')
    }
    return value
  }),
  amount: Joi.number().min(0).optional(),
  reason: Joi.string().max(500).optional()
})

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data
    if (source === 'body') {
      data = req.body
    } else if (source === 'params') {
      data = req.params
    } else if (source === 'query') {
      data = req.query
    }

    const { error, value } = schema.validate(data, { abortEarly: false })
    if (error) {
      const messages = error.details.map(detail => detail.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      })
    }

     if (source === 'body') {
       req.body = value
     } else if (source === 'params') {
       req.params = value
     } else if (source === 'query') {
       Object.assign(req.query, value)
     }

     next()
  }
}
