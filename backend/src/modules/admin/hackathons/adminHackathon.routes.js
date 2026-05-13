/**
  adminHackathon.routes.js
  Defines Express routes for adminHackathon domain.
 */
// routes/hackathonRoutes.js
import express, { Router } from "express";
import {
  createHackathon,
  updateHackathon,
  deleteHackathon,
  updateHackathonsRules,
} from "./adminHackathon.controller.js";
import { verifyAdmin, verifyJWT } from "../../../middleware/auth.middleware.js";

const router = Router();

// Apply admin middleware to routes that require admin access

router.route("/create-hackathon").post(verifyJWT, verifyAdmin, createHackathon);


router.patch("/:hackathonId", verifyJWT, verifyAdmin, updateHackathon);
router.patch("/:hackathonId", verifyJWT, verifyAdmin, updateHackathonsRules)


router.delete(
  "/delete-hackathon/:hackathonId",
  verifyJWT,
  verifyAdmin,
  deleteHackathon,
);

export default router;
