/**
   registration.validation.js
   Declares request validation rules for registration payloads.
 */
import Joi from "joi";

// Param validation for hackathonId
export const hackathonIdParamValidation = Joi.object({
  hackathonId: Joi.string().hex().length(24).required()
    .messages({
      'string.hex': 'Invalid hackathon ID format',
      'string.length': 'Hackathon ID must be 24 characters',
      'any.required': 'Hackathon ID is required'
    })
});

// Register validation: one of solo or team schema based on mode
export const registerValidation = Joi.object({
  mode: Joi.string().valid("solo", "team").required(),
  notes: Joi.string().max(500).optional().allow(""),
  paymentMethod: Joi.string().valid("razorpay", "stripe").optional(),
  
  // Conditional fields: when mode='solo' userId allowed (optional, defaults to caller), teamId forbidden
  userId: Joi.when("mode", {
    is: "solo",
    then: Joi.string().hex().length(24).optional()
      .messages({
        "string.hex": "User ID must be a valid 24-character hex string"
      }),
    otherwise: Joi.forbidden()
      .messages({ "any.unknown": "userId is not allowed for team registration" })
  }),
  
  // When mode='team' teamId required, userId forbidden
  teamId: Joi.when("mode", {
    is: "team",
    then: Joi.string().hex().length(24).required()
      .messages({
        "string.hex": "Team ID must be a valid 24-character hex string",
        "any.required": "Team ID is required for team registration"
      }),
    otherwise: Joi.forbidden()
      .messages({ "any.unknown": "teamId is not allowed for solo registration" })
  })
}).messages({
  "object.unknown": "Unknown field",
  "any.only": "{{#label}} must be either 'solo' or 'team'"
});

// Cancel registration validation
export const cancelRegistrationValidation = Joi.object({
  reason: Joi.string().max(500).optional().allow("")
}).messages({
  "string.max": "Cancellation reason cannot exceed 500 characters"
});

// Validation middleware factory (supports body, params, query)
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data;
    if (source === 'body') {
      data = req.body;
    } else if (source === 'params') {
      data = req.params;
    } else if (source === 'query') {
      data = req.query;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [`Unsupported validation source: ${source}`]
      });
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Assign sanitized data back to request
    if (source === 'body') {
      req.body = value;
    } else if (source === 'params') {
      req.params = value;
    } else if (source === 'query') {
      // Use Object.assign to avoid issues with read-only properties
      Object.assign(req.query, value);
    }

    next();
  };
};
