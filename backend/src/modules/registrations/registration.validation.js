// registration.validation.js
import Joi from 'joi';

const initiateRegistrationSchema = Joi.object({
    hackathonId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
        .required()
        .messages({
            'string.pattern.base': 'Hackathon ID must be a valid MongoDB ObjectId.',
            'any.required': 'Hackathon ID is required.',
        }),
    registrationType: Joi.string()
        .valid('solo', 'intern', 'team')
        .required()
        .messages({
            'any.only': 'Registration type must be either "solo", "intern", or "team".',
            'any.required': 'Registration type is required.',
        }),
    teamId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .allow(null) // Optional for solo/intern
        .messages({
            'string.pattern.base': 'Team ID must be a valid MongoDB ObjectId.',
        }),
    // For intern type, additional proof might be required (e.g., document upload, university email)
    // This part might be handled by service logic after basic validation
    // or through specific fields in the form that are then validated.
    // Example for a flag:
    isIntern: Joi.boolean().optional(),
    internProofUrl: Joi.string().uri().optional(), // If proof is an uploaded document
    universityEmail: Joi.string().email().optional(), // If verification is via email
}).custom((value, helpers) => {
    // Conditional validation for teamId
    if (value.registrationType === 'team' && !value.teamId) {
        return helpers.error('any.required', { message: 'Team ID is required for team registrations.' });
    }
    if (value.registrationType !== 'team' && value.teamId) {
        return helpers.error('any.forbidden', { message: 'Team ID is not allowed for solo or intern registrations.' });
    }

    // Conditional validation for intern
    if (value.registrationType === 'intern' && !value.isIntern && (!value.internProofUrl && !value.universityEmail)) {
        return helpers.error('any.required', { message: 'For intern registrations, either confirm intern status or provide intern proof/university email.' });
    }
    return value;
});

export { initiateRegistrationSchema };
