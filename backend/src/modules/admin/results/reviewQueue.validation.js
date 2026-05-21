/**
  reviewQueue.validation.js
  Request validation for Admin Review Queue routes using Joi.
 */
import Joi from 'joi';

// 24-character hex ObjectId validator
const objectIdHex24 = (label) =>
  Joi.string()
    .length(24)
    .hex()
    .label(label)
    .messages({
      'string.hex': `${label} must be a valid 24-character hex ObjectId`,
      'string.length': `${label} must be exactly 24 characters long`
    });

export const hackathonIdParamValidation = Joi.object({
  hackathonId: objectIdHex24('Hackathon ID')
});

export const queueIdParamValidation = Joi.object({
  queueId: objectIdHex24('Queue ID')
});

export const resolveItemValidation = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required()
    .messages({ 'any.only': "status must be 'approved' or 'rejected'" }),
  adminComment: Joi.string().max(2000).allow('').optional(),
  expectedResolvedQueueVersion: Joi.number().integer().min(0).optional()
});

// Used for the progress endpoint's param validation
export const progressParamValidation = Joi.object({
  hackathonId: objectIdHex24('Hackathon ID')
});
