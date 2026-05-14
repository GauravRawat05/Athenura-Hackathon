/**
  adminReport.validation.js
  Declares request validation rules for adminReport payloads.
 */
import Joi from 'joi'

export const reportIdValidation = Joi.object({
  reportId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid report ID format')
    }
    return value
  })
})

export const createReportValidation = Joi.object({
  name: Joi.string().required().min(3).max(200),
  type: Joi.string().required().valid('summary', 'activity', 'financial', 'participant'),
  description: Joi.string().optional().max(1000),
  schedule: Joi.object({
    cron: Joi.string().optional(),
    timezone: Joi.string().optional()
  }).optional(),
  filters: Joi.object().optional()
})

export const updateReportValidation = Joi.object({
  reportId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid report ID format')
    }
    return value
  }),
  name: Joi.string().optional().min(3).max(200),
  description: Joi.string().optional().max(1000),
  status: Joi.string().optional().valid('draft', 'scheduled', 'active', 'archived'),
  schedule: Joi.object({
    cron: Joi.string().optional(),
    timezone: Joi.string().optional()
  }).optional(),
  filters: Joi.object().optional()
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
