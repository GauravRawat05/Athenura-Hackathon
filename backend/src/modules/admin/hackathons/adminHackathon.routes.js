/**
  adminHackathon.routes.js
  Defines Express routes for adminHackathon domain.
 */
// routes/hackathonRoutes.js
import express, { Router } from 'express'
import { createHackathon, updateHackathon, deleteHackathon } from './adminHackathon.controller.js'


const router = Router();

// Apply admin middleware to routes that require admin access

router.route("/create-hackathon").post(createHackathon)
router.patch('/:hackathonId', updateHackathon);
router.delete('/delete-hackathon/:hackathonId', deleteHackathon);

export default router;
