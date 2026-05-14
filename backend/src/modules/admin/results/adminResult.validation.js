/**
  adminResult.validation.js
  Declares request validation rules for adminResult payloads.
 */
import Joi from 'joi'

export const resultIdValidation = Joi.object({
  resultId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid result ID format')
    }
    return value
  })
})

export const createResultValidation = Joi.object({
  submissionId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid submission ID format')
    }
    return value
  }),
  hackathonId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid hackathon ID format')
    }
    return value
  }),
  rank: Joi.number().integer().min(1).required(),
  score: Joi.number().min(0).max(100).required(),
  awardCategory: Joi.string().valid('winner', 'finalist', 'participant').optional(),
  remarks: Joi.string().max(500).optional()
})

export const updateResultValidation = Joi.object({
  rank: Joi.number().integer().min(1).optional(),
  score: Joi.number().min(0).max(100).optional(),
  awardCategory: Joi.string().valid('winner', 'finalist', 'participant').optional(),
  remarks: Joi.string().max(500).optional()
})

export const publishResultsValidation = Joi.object({
  hackathonId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid hackathon ID format')
    }
    return value
  })
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
