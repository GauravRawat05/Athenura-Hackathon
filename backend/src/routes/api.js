/**
   api.js
   Main API router that aggregates all module routers.
   Each module exports an Express router from its [module].routes.js file.
   */

import { Router } from 'express';
import asyncHandler from '../libs/asyncHandler.js';

// Import module routers - add new modules here
import authRoute from '../modules/auth/auth.routes.js';
import adminRoute from '../modules/admin/admin.routes.js';
import userRoute from '../modules/users/user.routes.js';
import universityRoute from '../modules/universities/university.routes.js';
// import notificationRoute from '../modules/notifications/notification.routes.js';
// import certificateRoute from '../modules/certificates/certificate.routes.js';
import teamRoute from '../modules/teams/team.routes.js';
import adminHackathonRoute from '../modules/admin/hackathons/adminHackathon.routes.js';
import registrationRoute from '../modules/registrations/registration.routes.js';
import submissionRoute from '../modules/submissions/submission.routes.js';
import judgingRoute from '../modules/judging/judging.routes.js';
import publicWinnersRoute from '../modules/results/publicWinners.routes.js';
import hackathonRoute from '../modules/hackathons/hackathon.routes.js';
// import resultRoute from '../modules/results/result.routes.js';

// Import controllers/validations for inline routes
import registrationController from '../modules/registrations/registration.controller.js';
import { validate, registerValidation, hackathonIdParamValidation } from '../modules/registrations/registration.validation.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Unified registration endpoint for both solo and team registration
// Placed BEFORE the generic hackathonRoute mount to ensure it matches first
router.post(
  '/hackathons/:hackathonId/register',
  verifyJWT,
  validate(hackathonIdParamValidation, 'params'),
  validate(registerValidation),
  asyncHandler(registrationController.register)
);

// Mount all module routers under /api
router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/users', userRoute);
router.use('/university', universityRoute);
// router.use('/notifications', notificationRoute);
// router.use('/certificates', certificateRoute);
router.use('/teams', teamRoute);
// Public winners endpoint (JWT required, non-admin)
router.use('/winners', publicWinnersRoute);

router.use('/hackathons', hackathonRoute);
router.use('/registrations', registrationRoute);
router.use('/submissions', submissionRoute);

// router.use('/results', resultRoute);
router.use('/', judgingRoute);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
