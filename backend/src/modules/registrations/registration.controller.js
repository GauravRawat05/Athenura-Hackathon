// registration.controller.js
import asyncHandler from '../../libs/asyncHandler.js';
import ApiResponse  from '../../libs/apiResponse.js';
import { registrationService } from './registration.service.js';
import { initiateRegistrationSchema } from './registration.validation.js';
import { validate } from '../../middleware/validate.middleware.js';

// Endpoint: POST /hackathons/:hackathonId/initiate-registration
const initiateRegistration = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;
    const { registrationType, teamId, isIntern, internProofUrl, universityEmail } = req.body;

    const result = await registrationService.initiateHackathonRegistration(
        req.user._id, 
        hackathonId,
        registrationType,
        teamId,
        { isIntern, internProofUrl, universityEmail }
    );

    return res.status(200).json(
        new ApiResponse(200, result, 'Registration initiation successful. Proceed to payment.')
    );
});

// Endpoint: GET /registrations/me
const getMyRegistrations = asyncHandler(async (req, res) => {
    const registrations = await registrationService.getUserRegistrations(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, registrations, 'Registrations fetched successfully.')
    );
});

export { initiateRegistration, getMyRegistrations };
