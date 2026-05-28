import { Router } from 'express';
import { initiateRegistration, getMyRegistrations } from './registration.controller.js';
import { initiateRegistrationSchema } from './registration.validation.js';
import { validate } from '../../middleware/validate.middleware.js'; // Assuming a validation middleware
import {verifyJWT}  from '../../middleware/auth.middleware.js'; // Assuming auth middleware


const router = Router();

// Route to get current user's registrations
router.get('/me', verifyJWT, getMyRegistrations);

// Route for initiating registration
// This route is designed to be mounted under '/hackathons'
router.post(
    '/:hackathonId/initiate-registration', // Path is now relative to where the router is mounted (e.g., /hackathons)
    verifyJWT, // Ensure user is logged in
    validate(initiateRegistrationSchema), // Validate request body
    initiateRegistration
);

export default router;
