// validate.middleware.js
import Joi from 'joi';
import ApiError from '../libs/apiError.js'; // Assuming ApiError class exists

/**
 * Middleware for validating request data against a Joi schema.
 *
 * @param {Joi.ObjectSchema} schema - The Joi validation schema.
 * @param {string} [target='body'] - The part of the request to validate ('body', 'query', 'params').
 * @returns {function} - Express middleware function.
 */
const validate = (schema, target = 'body') => (req, res, next) => {
    // Validate the specified part of the request
    const { error, value } = schema.validate(req[target], {
        abortEarly: false, // Return all errors, not just the first one
        allowUnknown: true, // Allow unknown keys (can be configured based on strictness)
        stripUnknown: true, // Remove unknown keys from the validated object
    });

    if (error) {
        // Map Joi errors to a more user-friendly format
        const errors = error.details.map((err) => ({
            field: err.path.join('.'),
            message: err.message.replace(/['"]/g, ''), // Remove quotes around field names
        }));
        throw new ApiError(400, 'Validation failed.', errors, 'VALIDATION_ERROR');
    }

    // Replace the original request part with the validated and stripped value
    // Special handling for 'query' since req.query is a getter and can't be directly assigned
    if (target === 'query') {
        Object.keys(req.query).forEach(key => {
            delete req.query[key];
        });
        Object.assign(req.query, value);
    } else {
        req[target] = value;
    }
    next();
};

export { validate };
