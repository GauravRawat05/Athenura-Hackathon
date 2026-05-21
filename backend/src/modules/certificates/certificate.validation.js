/**
 * certificate.validation.js
 * Declares request validation rules for certificate payloads, query strings, and route params.
 */
import Joi from 'joi';
import { GENERATION_STATUS } from './certificate.constants.js';
import {
  CERTIFICATE_TYPE_VALUES,
} from '../../utils/constants/certificateTypes.js';

/**
 * Schema for query parameters on the public verify endpoint.
 */
export const verifyCertificateValidation = Joi.object({
  certificateCode: Joi.string().required().messages({
    'any.required': 'certificateCode query parameter is required',
    'string.empty': 'certificateCode cannot be an empty string',
  }),
});

/**
 * Schema for query params on the admin/helpers list endpoint.
 */
export const listCertificatesValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'page must be a number',
    'number.integer': 'page must be an integer',
    'number.min': 'page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.base': 'limit must be a number',
    'number.integer': 'limit must be an integer',
    'number.min': 'limit must be at least 1',
    'number.max': 'limit must be at most 100',
  }),
  hackathonId: Joi.string().optional().messages({
    'string.base': 'hackathonId must be a string',
  }),
  status: Joi.string().valid(...Object.values(GENERATION_STATUS)).optional().messages({
    'any.only': 'status must be one of {VALUES}',
    'string.base': 'status must be a string',
  }),
});

/**
 * Schema for the body of the issue-certificate request.
 * userId and hackathonId are validated as valid hex Mongo ObjectId strings.
 */
export const issueCertificateValidation = Joi.object({
  userId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid userId format — must be a 24-character hex ObjectId');
    }
    return value;
  }).messages({
    'any.required': 'userId is required to issue a certificate',
    'any.custom': 'Invalid userId format — must be a 24-character hex ObjectId',
  }),
  hackathonId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid hackathonId format — must be a 24-character hex ObjectId');
    }
    return value;
  }).messages({
    'any.required': 'hackathonId is required to issue a certificate',
    'any.custom': 'Invalid hackathonId format — must be a 24-character hex ObjectId',
  }),
  certificateType: Joi.string().valid(...CERTIFICATE_TYPE_VALUES).required().messages({
    'any.required': 'certificateType is required',
    'any.only': `certificateType must be one of: ${CERTIFICATE_TYPE_VALUES.join(', ')}`,
  }),
  awardCategory: Joi.string().max(200).optional().allow('').messages({
    'string.max': 'awardCategory must not exceed 200 characters',
  }),
  submissionId: Joi.string().optional().custom((value, helpers) => {
    if (value && !value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid submissionId format — must be a 24-character hex ObjectId');
    }
    return value;
  }),
  rank: Joi.number().integer().min(1).optional().messages({
    'number.base': 'rank must be a number',
    'number.integer': 'rank must be an integer',
    'number.min': 'rank must be at least 1',
  }),
});

/**
 * Schema used when the client fetches a certificate by code (body-based route).
 */
export const verifyByBodyValidation = Joi.object({
  certificateCode: Joi.string().required(),
});

/**
 * Schema for the download endpoint — no body required, params validated inline
 * in the route, but this is included for reference and programmatic reuse.
 */
export const certificateParamsValidation = Joi.object({
  certificateId: Joi.string().required().custom((value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('Invalid certificateId format');
    }
    return value;
  }),
});

/**
 * Higher-order validate middleware factory kept here for convenience
 * so other modules can import it directly without reaching into admin certs.
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data;
    if (source === 'body') data = req.body;
    else if (source === 'params') data = req.params;
    else if (source === 'query') data = req.query;

    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    if (source === 'body') req.body = value;
    else if (source === 'params') req.params = value;
    else if (source === 'query') Object.assign(req.query, value);

    next();
  };
};
