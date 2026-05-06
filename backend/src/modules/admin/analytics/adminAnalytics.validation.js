/**
  adminAnalytics.validation.js
  Declares request validation rules for adminAnalytics payloads.
 */
import Joi from 'joi'

// Query validation for analytics endpoints
export const analyticsQueryValidation = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  hackathonId: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(500).optional(),
  offset: Joi.number().integer().min(0).optional()
}).unknown(true)

// No specific body validations needed for analytics endpoints as they are GET requests
// These schemas are available for future POST/PATCH analytics endpoints if needed
