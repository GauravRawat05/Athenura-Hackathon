/**
  hackathon.routes.js
  Defines Express routes for the hackathon domain.
 */
import { Router } from 'express';
import asyncHandler from '../../libs/asyncHandler.js';
import hackathonController from './hackathon.controller.js';
import { verifyJWT } from '../../middleware/auth.middleware.js';

const router = Router();

//Get all hackathons
router.get('/', asyncHandler(hackathonController.getAllHackathons));

//Get hackathon by id
router.get('/:hackathonId',asyncHandler(hackathonController.getHackathonById));

// Get public winners cards
router.get('/:hackathonId/winners', asyncHandler(hackathonController.getWinners));

// Get authenticated result view
router.get('/:hackathonId/results', verifyJWT, asyncHandler(hackathonController.getResults));

export default router;