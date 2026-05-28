/**
   adminResult.validation.js
   Joi schemas for the Admin Result endpoints.
   */
import Joi from 'joi';

const objectIdHex24 = Joi.string().hex().length(24).messages({
  'string.hex': 'must be a valid hexadecimal string',
  'string.length': 'must be exactly 24 characters long'
});

export const resultIdValidation = Joi.object({
  resultId: objectIdHex24.label('Result ID').required()
});

export const hackathonIdParamValidation = Joi.object({
  hackathonId: objectIdHex24.label('Hackathon ID').required()
});

export const publishResultsValidation = Joi.object({
  hackathonId: objectIdHex24.label('Hackathon ID').required()
});

export const progressParamValidation = Joi.object({
  hackathonId: objectIdHex24.label('Hackathon ID').required()
});

// draft param validation (same shape as publishResultsValidation — just a hackathonId)
export const draftParamValidation = Joi.object({
  hackathonId: objectIdHex24.label('Hackathon ID').required()
});

// Body schema for PATCH /admin/results/draft/:hackathonId (legacy format)
// Accept either { draftId, rankOverride } for a single record update,
// or { manualOrder: [submissionId, ...] } for a bulk reorder.
export const updateDraftBodyValidation = Joi.object({
  draftId: objectIdHex24.label('Draft ID').optional(),
  rankOverride: Joi.number().integer().min(1).optional(),
  manualOrder: Joi.array().items(objectIdHex24.label('Submission ID')).optional()
}).or('draftId', 'manualOrder');

// Body schema for PATCH /admin/hackathons/:hackathonId/results/override (frontend format)
// Accepts { overrides: [{ submissionId, rank, awardCategory?, notes? }] }
export const overrideResultsBodyValidation = Joi.object({
  overrides: Joi.array().items(
    Joi.object({
      submissionId: objectIdHex24.label('Submission ID').required(),
      rank: Joi.number().integer().min(1).required(),
      awardCategory: Joi.string().valid('First Prize', 'Second Prize', 'Third Prize', 'Participant', '').optional(),
      notes: Joi.string().allow('').optional()
    })
  ).min(1).required()
});

// Pagination query validation
export const listQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  hackathonId: objectIdHex24.label('Hackathon ID').optional(),
  status: Joi.string().valid('published', 'draft').optional()
});

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    if (source === 'body') req.body = value;
    else if (source === 'params') req.params = value;
    else Object.assign(req.query, value);
    next();
  };
};
