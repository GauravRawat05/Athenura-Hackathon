/**
  adminUniversity.validation.js
  Declares request validation rules for adminUniversity payloads.
 */
import Joi from 'joi'

export const universityIdValidation = Joi.object({
  universityId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid university ID format')
    }
    return value
  })
})

export const createUniversityValidation = Joi.object({
  name: Joi.string().required().min(3).max(200),
  code: Joi.string().required().min(2).max(10).uppercase(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().min(10).max(15),
  location: Joi.string().optional().max(200),
  state: Joi.string().optional().max(100),
  country: Joi.string().optional().max(100),
  website: Joi.string().uri().optional()
})

export const updateUniversityValidation = Joi.object({
  universityId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid university ID format')
    }
    return value
  }),
  name: Joi.string().optional().min(3).max(200),
  code: Joi.string().optional().min(2).max(10).uppercase(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().min(10).max(15),
  location: Joi.string().optional().max(200),
  state: Joi.string().optional().max(100),
  country: Joi.string().optional().max(100),
  website: Joi.string().uri().optional(),
  status: Joi.string().valid('active', 'inactive').optional()
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
