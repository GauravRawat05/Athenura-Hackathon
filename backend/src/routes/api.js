/**
  api.js
  Main API router that aggregates all module routers.
  Each module exports an Express router from its [module].routes.js file.
 */

import { Router } from 'express';

// Import module routers - add new modules here
import authRouter from '../modules/auth/auth.routes.js';
// import adminRouter from '../modules/admin/admin.routes.js';
// import universityRouter from '../modules/universities/university.routes.js';
// import notificationRouter from '../modules/notifications/notification.routes.js';
// import certificateRouter from '../modules/certificates/certificate.routes.js';
// import teamRouter from '../modules/teams/team.routes.js';
// import hackathonRouter from '../modules/hackathons/hackathon.routes.js';
// import registrationRouter from '../modules/registrations/registration.routes.js';
// import submissionRouter from '../modules/submissions/submission.routes.js';
// import resultRouter from '../modules/results/result.routes.js';

const router = Router();

// Mount all module routers under /api
// Example: /api/universities, /api/teams, etc.
router.use('/auth', authRouter);
// router.use('/admin', adminRouter);
// router.use('/universities', universityRouter);
// router.use('/notifications', notificationRouter);
// router.use('/certificates', certificateRouter);
// router.use('/teams', teamRouter);
// router.use('/hackathons', hackathonRouter);
// router.use('/registrations', registrationRouter);
// router.use('/submissions', submissionRouter);
// router.use('/results', resultRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
