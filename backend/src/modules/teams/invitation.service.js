/**
   invitation.service.js
   Handles logic for sending, tracking, and consuming team invitations.
   */
   import invitationRepository from "./invitation.repository.js";
   import teamRepository from "./team.repository.js";
   import User from "../users/user.model.js";
   import ApiError from "../../libs/apiError.js";
   import invitationToken from "./invitation.token.js";
   //import registrationRepository from "../registrations/registration.repository.js";
   import { INVITATION_EXPIRY_MS, invitationStatus, teamRoles } from "./team.constants.js";
   import { sendEmail, EMAIL_TYPES } from "../notifications/notification.mailer.js";
   import notificationService from "../notifications/notification.service.js";
   import mongoose from "mongoose";
   const ObjectId = mongoose.Types.ObjectId;

class InvitationService {
  /**
   * Create a new team invitation
   */
  async createInvitation({ teamId, email, invitedById }) {
    // Verify team exists
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    // Verify inviter is team leader
    if (team.leader.toString() !== invitedById.toString()) {
      throw new ApiError(403, "Only team leader can invite members");
    }

    // Find invited user by email
    const invitedUser = await User.findOne({ email: email.toLowerCase() });
    if (!invitedUser) {
      throw new ApiError(404, "User with this email is not registered");
    }

    // Verify user role - only standard Users can be invited to teams
    if (invitedUser.role !== "User") {
      throw new ApiError(400, "Cannot send invitation to this user");
    }

    // Check if user is already in the team
    const isAlreadyMember = team.members.some(
      (m) => m.userId.toString() === invitedUser._id.toString()
    );
    if (isAlreadyMember) {
      throw new ApiError(400, "User is already a member of this team");
    }

    // Check for existing pending invitation
    const existingInvitation = await invitationRepository.findPendingByTeamAndUser(
      teamId,
      invitedUser._id
    );
    if (existingInvitation) {
      throw new ApiError(400, "An invitation is already pending for this user");
    }

    // Generate secure token
    const { unhashedToken, hashedToken } = invitationToken.generateToken();

    // Calculate expiry (12 hours from now)
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_MS);

    // Create invitation
    const invitation = await invitationRepository.create({
      teamId,
      invitedBy: invitedById,
      invitedUserId: invitedUser._id,
      invitedEmail: email.toLowerCase(),
      token: hashedToken,
      status: invitationStatus.PENDING,
      expiresAt
    });
    console.log(unhashedToken);
    

    // Get team leader info for email
    const leader = await User.findById(invitedById).select("fullName");

    // Get hackathon title if needed
    let hackathonTitle = "Hackathon";
    const hackathonDetails = await this.getHackathonDetails(team.hackathonId, "title");
    hackathonTitle = hackathonDetails?.title || "Hackathon";

    // Send invitation email and in-app notification
    try {
      // 1. In-app notification
      await notificationService.notify(invitedUser._id, {
        title: "Team Invitation",
        message: `You have been invited to join ${team.teamName} for ${hackathonTitle} by ${leader?.fullName || 'a team leader'}`,
        type: "team_invitation",
        data: {
          teamId: team._id,
          invitationId: invitation._id
        }
      });

      // 2. Email notification
      await sendEmail(invitedUser.email, EMAIL_TYPES.TEAM_INVITATION, {
        teamName: team.teamName,
        hackathonTitle: hackathonTitle,
        invitedBy: leader?.fullName,
        inviteLink: `/team/invite/${unhashedToken}`,
        fullName: invitedUser.fullName
      });
    } catch (error) {
      console.error("Failed to send team invitation notifications:", error.message);
    }

    // Remove sensitive hashed token from response
    const invitationData = invitation.toObject();
    delete invitationData.token;

    return {
      invitation: invitationData,
      inviteLink: `/team/invite/${unhashedToken}`
    };
  }

  /**
   * Accept a team invitation
   */
  async acceptInvitation(invitationId, userId) {
    const invitation = await invitationRepository.findById(invitationId);

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    if (!invitation.teamId) {
      throw new ApiError(404, "The team associated with this invitation no longer exists");
    }

    if (invitation.status !== invitationStatus.PENDING) {
      throw new ApiError(400, `Invitation has already been ${invitation.status}`);
    }

    if (invitation.expiresAt < new Date()) {
      await invitationRepository.updateStatus(invitation._id, invitationStatus.EXPIRED);
      throw new ApiError(400, "Invitation has expired");
    }

    // Verify accepting user matches invited user
    if (!invitation.invitedUserId || invitation.invitedUserId._id.toString() !== userId.toString()) {
      throw new ApiError(403, "This invitation is for a different user");
    }

    const team = invitation.teamId;

    // Check if user is already in a team for this hackathon
    const existingTeam = await teamRepository.findByHackathonAndMember(
      team.hackathonId,
      userId
    );
    if (existingTeam) {
      throw new ApiError(400, "You are already a member of a team for this hackathon");
    }

    // Check team size limit
    const hackathon = await this.getHackathonDetails(team.hackathonId, "maxTeamSize");
    const acceptedMemberCount = teamRepository.getAcceptedMemberCount(team);
    if (hackathon && acceptedMemberCount >= hackathon.maxTeamSize) {
      throw new ApiError(400, "Team has reached maximum member limit");
    }

    // Add user to team
    await teamRepository.addMember(team._id, {
      userId,
      role: teamRoles.MEMBER,
      joinedAt: new Date()
    });

    // Update invitation status
    await invitationRepository.updateStatus(invitation._id, invitationStatus.ACCEPTED);

    // Notify team leader about acceptance
    try {
      const leader = invitation.invitedBy;
      const newMember = invitation.invitedUserId;

      if (leader) {
        await notificationService.notify(leader._id, {
          title: "Invitation Accepted",
          message: `${newMember?.fullName || 'A participant'} has joined your team ${team.teamName}`,
          type: "invitation_accepted",
          data: { teamId: team._id, memberId: newMember?._id }
        });
      }

      if (leader?.email) {
        await sendEmail(leader.email, EMAIL_TYPES.INVITATION_ACCEPTED, {
          teamName: team.teamName,
          memberName: newMember?.fullName || "A participant"
        });
      }
    } catch (error) {
      console.error("Failed to send invitation accepted notification:", error.message);
    }

    return { teamId: invitation.teamId._id };
  }

  /**
   * Decline a team invitation
   */
  async declineInvitation(invitationId, userId) {
    const invitation = await invitationRepository.findById(invitationId);

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    if (invitation.status !== invitationStatus.PENDING) {
      throw new ApiError(400, `Invitation has already been ${invitation.status}`);
    }

    // Verify declining user matches invited user
    if (invitation.invitedUserId._id.toString() !== userId.toString()) {
      throw new ApiError(403, "This invitation is for a different user");
    }

    await invitationRepository.updateStatus(invitation._id, invitationStatus.DECLINED);

    // Get team info for the notification
    const team = invitation.teamId;

    // Notify team leader about decline
    try {
      const leader = invitation.invitedBy;
      const decliner = invitation.invitedUserId;
      
      if (leader) {
        await notificationService.notify(leader._id, {
          title: "Invitation Declined",
          message: `${decliner?.fullName || 'A participant'} has declined your invitation to join ${team?.teamName}`,
          type: "invitation_declined",
          data: { teamId: team?._id }
        });
      }

      if (leader?.email) {
        await sendEmail(leader.email, EMAIL_TYPES.INVITATION_DECLINED, {
          teamName: team?.teamName,
          memberName: decliner?.fullName || "A participant"
        });
      }
    } catch (error) {
      console.error("Failed to send invitation declined notification:", error.message);
    }

    return { message: "Invitation declined successfully" };
  }

  async getMyInvitations(userId) {
    return await invitationRepository.findByInvitedUser(userId);
  }

  /**
   * Helper to get hackathon details dynamically
   */
  async getHackathonDetails(hackathonId, selectFields = "") {
    // Import dynamically to avoid circular dependency
    const { default: Hackathon } = await import("../admin/hackathons/hackathon.model.js");
    return await Hackathon.findById(hackathonId).select(selectFields);
  }
}

const invitationService = new InvitationService();
export default invitationService;
