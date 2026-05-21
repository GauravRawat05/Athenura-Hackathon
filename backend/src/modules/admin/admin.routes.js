/**
  admin.routes.js
  Defines Express routes for the admin domain.
 */

import { Router } from 'express';
import adminUserRouter from './users/adminUser.routes.js';
import adminHackathonRouter from './hackathons/adminHackathon.routes.js';
import adminPaymentRouter from './payments/adminPayment.routes.js';
import adminResultRouter from './results/adminResult.routes.js';
import adminCertificateRouter from './certificates/adminCertificate.routes.js';
import adminUniversityRouter from './universities/adminUniversity.routes.js';
import adminAnalyticsRouter from './analytics/analytics.routes.js';
import adminReportRouter from './reports/adminReport.routes.js';
import adminSettingRouter from './settings/adminSetting.routes.js';
import adminAuthRouter from './auth/adminAuth.routes.js';

const router = Router();

// Mount all admin sub-routers under /admin
router.use('/auth', adminAuthRouter);
router.use('/users', adminUserRouter);
router.use('/hackathons', adminHackathonRouter);
router.use('/payments', adminPaymentRouter);
router.use('/results', adminResultRouter);
router.use('/certificates', adminCertificateRouter);
router.use('/universities', adminUniversityRouter);
router.use('/analytics', adminAnalyticsRouter);
router.use('/reports', adminReportRouter);
router.use('/settings', adminSettingRouter);

export default router;