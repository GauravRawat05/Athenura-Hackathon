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

// Get all teams for current user
router.get(
  "/me",
  verifyJWT,
  asyncHandler(teamController.getMyTeams)
);

// Get all invitations for current user
router.get(
  "/invitations",
  verifyJWT,
  asyncHandler(teamController.getMyInvitations)
);

// Get team details
router.get("/:teamId",
  verifyJWT,
  asyncHandler(teamController.getTeam)
);

// Update team metadata (leader only)
router.patch(
  "/:teamId",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  validate(updateTeamValidation),
  asyncHandler(teamController.updateTeam)
);

// Invite member to team (leader only)
router.post(
  "/:teamId/invitations",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  validate(inviteMemberValidation),
  asyncHandler(teamController.inviteMember)
);

// Accept team invitation
router.post(
  "/invitations/:invitationId/accept",
  verifyJWT,
  asyncHandler(teamController.acceptInvitation)
);

// Decline team invitation
router.post(
  "/invitations/:invitationId/decline",
  verifyJWT,
  asyncHandler(teamController.declineInvitation)
);

// Remove member from team (leader only)
router.delete(
  "/:teamId/members/:userId",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  asyncHandler(teamController.removeMember)
);

// Delete team (leader only)
router.delete(
  "/:teamId",
  verifyJWT,
  asyncHandler(teamPolicy.isTeamLeader),
  asyncHandler(teamController.deleteTeam)
);

export default router;
