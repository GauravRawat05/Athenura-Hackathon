/**
  hackathon.routes.js
  Defines Express routes for the hackathon domain.
 */
import { Router } from 'express';
import asyncHandler from '../../libs/asyncHandler.js';
import hackathonController from './hackathon.controller.js';

const router = Router();

//Get all hackathons
router.get('/', asyncHandler(hackathonController.getAllHackathons));

//Get hackathon by id
router.get('/:hackathonId',asyncHandler(hackathonController.getHackathonById));

export default router;