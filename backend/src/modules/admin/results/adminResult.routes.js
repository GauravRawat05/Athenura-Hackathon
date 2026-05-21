/**
  adminResult.routes.js
  Admin Result management routes.
  All routes require verifyJWT + verifyAdmin.
 */
import { Router } from 'express';
import asyncHandler from '../../../libs/asyncHandler.js';
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js';
import { validate, resultIdValidation, publishResultsValidation, progressParamValidation } from './adminResult.validation.js';
import adminResultController from './adminResult.controller.js';

const router = Router();

// ── CRUD ───────────────────────────────────────────────────────────
router.get('/', verifyJWT, verifyAdmin,
  asyncHandler(adminResultController.listResults));

router.get('/:resultId', verifyJWT, verifyAdmin,
  validate(resultIdValidation, 'params'),
  asyncHandler(adminResultController.getResultById));

router.post('/', verifyJWT, verifyAdmin,
  asyncHandler(adminResultController.createResult));

router.patch('/:resultId', verifyJWT, verifyAdmin,
  validate(resultIdValidation, 'params'),
  asyncHandler(adminResultController.updateResult));

// ── Progress ───────────────────────────────────────────────────────
router.get('/progress/:hackathonId', verifyJWT, verifyAdmin,
  validate(progressParamValidation, 'params'),
  asyncHandler(adminResultController.getProgress));

// ── Draft ──────────────────────────────────────────────────────────
router.post('/draft/:hackathonId', verifyJWT, verifyAdmin,
  validate(publishResultsValidation, 'params'),
  asyncHandler(adminResultController.generateDraft));

router.patch('/draft/:hackathonId', verifyJWT, verifyAdmin,
  validate(publishResultsValidation, 'params'),
  asyncHandler(adminResultController.updateDraft));

// ── Publish ────────────────────────────────────────────────────────
router.post('/publish/:hackathonId', verifyJWT, verifyAdmin,
  validate(publishResultsValidation, 'params'),
  asyncHandler(adminResultController.publishResults));

// ── Hackathon rankings ─────────────────────────────────────────────
router.get('/hackathon/:hackathonId', verifyJWT, verifyAdmin,
  validate(publishResultsValidation, 'params'),
  asyncHandler(adminResultController.getHackathonResults));

export default router;
