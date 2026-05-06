/**
  team.routes.js
  Defines Express routes for the team domain.
 */
import { Router } from "express";
import teamController from "./team.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../libs/asyncHandler.js";
import {
  validate,
  createTeamValidation,
  updateTeamValidation,
  inviteMemberValidation
} from "./team.validation.js";
import teamPolicy from "./team.policy.js";

const router = Router();

// Create team for a hackathon
router.post(
  "/hackathons/:hackathonId/teams",
  verifyJWT,
  validate(createTeamValidation),
  asyncHandler(teamController.createTeam)
);

// Get team details
router.get(
  "/teams/:teamId",
  verifyJWT,
  asyncHandler(teamController.getTeam)
);

// Update team metadata (leader only)
router.patch(
  "/teams/:teamId",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  validate(updateTeamValidation),
  asyncHandler(teamController.updateTeam)
);

// Invite member to team (leader only)
router.post(
  "/teams/:teamId/invitations",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  validate(inviteMemberValidation),
  asyncHandler(teamController.inviteMember)
);

// Accept team invitation
router.post(
  "/team-invitations/:token/accept",
  verifyJWT,
  asyncHandler(teamController.acceptInvitation)
);

// Decline team invitation
router.post(
  "/team-invitations/:token/decline",
  verifyJWT,
  asyncHandler(teamController.declineInvitation)
);

// Remove member from team (leader only)
router.delete(
  "/teams/:teamId/members/:userId",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  asyncHandler(teamController.removeMember)
);

export default router;
