import Joi from "joi";
import { ANALYTICS_GROUP_BY } from "./analytics.constants.js";

// Reusable ObjectId schema
const objectIdSchema = Joi.string().hex().length(24).messages({
  "string.hex": "ID must be a valid 24-character hex string",
  "string.length": "ID must be exactly 24 characters",
});

// Reusable Date schema
const dateSchema = Joi.date().iso().messages({
  "date.format": "Date must be a valid ISO 8601 date string",
});

export const overviewAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
});

export const registrationAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

export const revenueAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
  currency: Joi.string().trim().optional(),
});

export const resultsAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

// ── Participation Trends ─────────────────────────────────────────────────────
// Counts active registrations over time, same shape as the registrations chart
export const participationTrendsAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

// ── Universities ──────────────────────────────────────────────────────────────
// Filters by hackathonId and optionally by role (defaults to USER)
export const universityAnalyticsSchema = Joi.object({
  hackathonId: objectIdSchema.optional(),
  role: Joi.string()
    .valid("User", "Participant", "Judge")
    .default("User")
    .messages({
      "any.only": "role must be one of: User, Participant, Judge",
    }),
});

// ── Judges ───────────────────────────────────────────────────────────────────
// Time-series of judge creation over time, per hackathon
export const judgeAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

// ── Certificates ─────────────────────────────────────────────────────────────
// Distribution of certificate generation status. groupBy is not applicable here
// because the chart shows status categories, not dates.
export const certificateAnalyticsSchema = Joi.object({
  hackathonId: objectIdSchema.optional(),
});

export const submissionAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  hackathonId: objectIdSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

export const hackathonStatsAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

export const userStatsAnalyticsSchema = Joi.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  groupBy: Joi.string()
    .valid(...Object.values(ANALYTICS_GROUP_BY))
    .default(ANALYTICS_GROUP_BY.MONTHLY)
    .messages({
      "any.only": "groupBy must be one of: daily, weekly, monthly",
    }),
});

// Validation middleware factory
export const validate = (schema, source = "query") => {
  return (req, res, next) => {
    let data;
    if (source === "query") {
      data = req.query;
    } else if (source === "params") {
      data = req.params;
    } else {
      data = req.body;
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Assign sanitized data back to request
    if (source === "query") {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, value);
    } else if (source === "params") {
      req.params = value;
    } else {
      req.body = value;
    }

    next();
  };
};
