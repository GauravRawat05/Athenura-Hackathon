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
  eligibility: Joi.array().items(Joi.string()).required(),
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
  eligibility: Joi.array().items(Joi.string()),
});

export {
  createHackathonValidation,
  updateHackathonValidation
};
