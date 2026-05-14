/**
  adminCertificate.validation.js
  Declares request validation rules for adminCertificate payloads.
 */
import Joi from 'joi'

export const certificateIdValidation = Joi.object({
  certificateId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid certificate ID format')
    }
    return value
  })
})

export const issueCertificateValidation = Joi.object({
  userId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid user ID format')
    }
    return value
  }),
  hackathonId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid hackathon ID format')
    }
    return value
  }),
  certificateType: Joi.string().valid('participation', 'winner', 'finalist', 'judge').required(),
  awardCategory: Joi.string().optional()
})

export const updateCertificateValidation = Joi.object({
  awardCategory: Joi.string().optional(),
  remarks: Joi.string().max(500).optional()
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

