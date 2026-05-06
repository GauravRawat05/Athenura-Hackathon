/**
  team.constants.js
  Specific constants and enums for the teams module.
 */

// Team member roles
export const teamRoles = {
  LEADER: "leader",
  MEMBER: "member"
};

export const teamRolesEnums = [teamRoles.LEADER, teamRoles.MEMBER];

// Invitation statuses
export const invitationStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  EXPIRED: "expired"
};

export const invitationStatusEnums = [
  invitationStatus.PENDING,
  invitationStatus.ACCEPTED,
  invitationStatus.DECLINED,
  invitationStatus.EXPIRED
];

// Invitation expiration time (12 hours in milliseconds)
export const INVITATION_EXPIRY_MS = 12 * 60 * 60 * 1000;
