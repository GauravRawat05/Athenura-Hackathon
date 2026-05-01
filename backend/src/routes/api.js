/**
  api.js
  Main API router that aggregates all module routers.
  Each module exports an Express router from its [module].routes.js file.
 */

import { Router } from 'express';

// Import module routers - add new modules here
import authRoute from '../modules/auth/auth.routes.js';
// import adminRoute from '../modules/admin/admin.routes.js';
// import universityRoute from '../modules/universities/university.routes.js';
// import notificationRoute from '../modules/notifications/notification.routes.js';
// import certificateRoute from '../modules/certificates/certificate.routes.js';
// import teamRoute from '../modules/teams/team.routes.js';
// import hackathonRoute from '../modules/hackathons/hackathon.routes.js';
// import registrationRoute from '../modules/registrations/registration.routes.js';
// import submissionRoute from '../modules/submissions/submission.routes.js';
// import resultRoute from '../modules/results/result.routes.js';

const router = Router();

// Mount all module routers under /api
// Example: /api/universities, /api/teams, etc.
router.use('/auth', authRoute);
// router.use('/admin', adminRoute);
// router.use('/universities', universityRoute);
// router.use('/notifications', notificationRoute);
// router.use('/certificates', certificateRoute);
// router.use('/teams', teamRoute);
// router.use('/hackathons', hackathonRoute);
// router.use('/registrations', registrationRoute);
// router.use('/submissions', submissionRoute);
// router.use('/results', resultRoute);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
