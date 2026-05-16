import Joi from "joi";

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { 
    abortEarly: true, 
    errors: { wrap: { label: false } } 
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message.replace(/\[\d+\]/g, "")).join(", ");
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors
    });
  }
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { 
    abortEarly: true, 
    errors: { wrap: { label: false } } 
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message.replace(/\[\d+\]/g, "")).join(", ");
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors
    });
  }
  next();
};

const objectIdHex24 = Joi.string().hex().length(24).messages({
  "string.hex": "must be a valid hexadecimal string",
  "string.length": "must be exactly 24 characters long"
});

export const assignJudgesValidation = Joi.object({
  judgeIds: Joi.array().items(objectIdHex24.label("Judge ID")).min(1).required().messages({
    "array.min": "At least one judge must be selected",
    "any.required": "Judge IDs are required",
    "string.hex": "Invalid format for one or more Judge IDs"
  })
});

const criterionScoreValidation = Joi.object({
  criterionName: Joi.string().required(),
  score: Joi.number().min(0).max(10).required()
});

export const submitScoreValidation = Joi.object({
  criterionScores: Joi.array().items(criterionScoreValidation).min(1).required(),
  feedback: Joi.string().max(2000).optional()
});

export const updateScoreValidation = Joi.object({
  criterionScores: Joi.array().items(criterionScoreValidation).min(1).optional(),
  feedback: Joi.string().max(2000).optional()
}).or("criterionScores", "feedback");

export const hackathonIdParamValidation = Joi.object({
  hackathonId: objectIdHex24.label("Hackathon ID").required().messages({
    "string.length": "Hackathon ID must be 24 characters",
    "any.required": "Hackathon ID is required"
  })
});

export const submissionIdParamValidation = Joi.object({
  submissionId: objectIdHex24.label("Submission ID").required().messages({
    "string.length": "Submission ID must be 24 characters",
    "any.required": "Submission ID is required"
  })
});

export const scoreIdParamValidation = Joi.object({
  scoreId: objectIdHex24.label("Score ID").required().messages({
    "string.length": "Score ID must be 24 characters",
    "any.required": "Score ID is required"
  })
});

export { validate, validateParams };
