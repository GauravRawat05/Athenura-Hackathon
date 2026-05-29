/**
  reviewQueue.routes.js
  Routes for managing the Admin Review Queue.
  */
import { Router } from 'express';
import asyncHandler from '../../../libs/asyncHandler.js';
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js';
import reviewQueueController from './reviewQueue.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { publishResultsValidation } from './adminResult.validation.js';

const router = Router();

// GET /admin/review-queue
router.get('/', verifyJWT, verifyAdmin, asyncHandler(reviewQueueController.listQueueItems));

// POST /admin/review-queue/:queueId/resolve
router.post('/:queueId/resolve', verifyJWT, verifyAdmin, asyncHandler(reviewQueueController.resolveItem));

// GET /admin/results/progress/:hackathonId
router.get('/progress/:hackathonId', verifyJWT, verifyAdmin, asyncHandler(reviewQueueController.getProgress));

// GET /admin/results/all-scores/:hackathonId - Get all judge scores for a hackathon
router.get('/all-scores/:hackathonId', verifyJWT, verifyAdmin, validate(publishResultsValidation, 'params'), asyncHandler(reviewQueueController.getAllJudgeScores));

export default router;
