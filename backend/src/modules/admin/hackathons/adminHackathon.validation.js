import Joi from 'joi';

const createHackathonValidation = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  mode: Joi.array().items(Joi.string().valid('Solo', 'Both')),
  allowedModes: Joi.array().items(Joi.string()),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  registrationDeadline: Joi.date().required().less(Joi.ref('startDate')),
  submissionDeadline: Joi.date().required().greater(Joi.ref('startDate')).less(Joi.ref('endDate')),
  prizePool: Joi.number().required(),
  registrationFee: Joi.number().required(),
  currency: Joi.string().valid('INR', 'DOLLAR').required(),
  minTeamSize: Joi.number().required(),
  maxTeamSize: Joi.number().optional().greater(Joi.ref('minTeamSize')),
  technologyDomains: Joi.array().items(Joi.string()).required(),
  rules: Joi.array().items(Joi.string()).required(),
  judgingCriteria: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      weight: Joi.number().required(),
    })
  ).optional(),
  eligibility: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.object({
      studentOnly: Joi.boolean(),
      allowedGraduationYears: Joi.array().items(Joi.number())
    })
  ).required(),
  sponsors: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      logoUrl: Joi.string().uri().optional()
    })
  ).optional(),
});

const updateHackathonValidation = Joi.object({
  title: Joi.string(),
  slug: Joi.string(),
  description: Joi.string(),
  mode: Joi.array().items(Joi.string().valid('Solo', 'Both')),
  allowedModes: Joi.array().items(Joi.string()),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  registrationDeadline: Joi.date().less(Joi.ref('startDate')),
  submissionDeadline: Joi.date().greater(Joi.ref('startDate')).less(Joi.ref('endDate')),
  prizePool: Joi.number(),
  registrationFee: Joi.number(),
  currency: Joi.string().valid('INR', 'DOLLAR'),
  minTeamSize: Joi.number(),
  maxTeamSize: Joi.number().greater(Joi.ref('minTeamSize')),
  technologyDomains: Joi.array().items(Joi.string()),
  rules: Joi.array().items(Joi.string()),
  judgingCriteria: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      weight: Joi.number().required(),
    })
  ),
  eligibility: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.object({
      studentOnly: Joi.boolean(),
      allowedGraduationYears: Joi.array().items(Joi.number())
    })
  ),
  sponsors: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      logoUrl: Joi.string().uri().optional()
    })
  ),
});

/**
 * Validation schema for listing hackathon registrations.
 * Supports filtering by status, paymentStatus, mode, and search functionality.
 */
const listRegistrationsValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'payment_failed'),
  paymentStatus: Joi.string().valid('pending', 'completed', 'failed', 'refunded'),
  mode: Joi.string().valid('solo', 'team'),
  search: Joi.string().allow('').optional()
});

export {
  createHackathonValidation,
  updateHackathonValidation,
  listRegistrationsValidation
};
