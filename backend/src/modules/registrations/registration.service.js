/**
    registration.service.js
    Contains the core business rules for registration.
    */
    import Registration from "./registration.model.js";
import mongoose from "mongoose";
import registrationRepository from "./registration.repository.js";
    import teamRepository from "../teams/team.repository.js";

    import User from "../users/user.model.js";
    import Hackathon from "../admin/hackathons/hackathon.model.js";
    import ApiError from "../../libs/apiError.js";
    import { sendEmail, EMAIL_TYPES } from "../notifications/notification.mailer.js";

class RegistrationService {

  /**
   * Register a user or team for a hackathon
   * @param {Object} params - { hackathonId, mode, userId, teamId, notes }
   * @param {String} callerId - UUID of the authenticated user making request
   * @returns {Promise<Object>} Registration summary object
   */
  async registerForHackathon({ hackathonId, mode, userId, teamId, notes }, callerId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
    // Validate caller exists and is verified
    const caller = await User.findById(callerId).select("isEmailVerified fullName email");
    if (!caller) {
      throw new ApiError(404, "Caller user not found");
    }
    if (!caller.isEmailVerified) {
      throw new ApiError(403, "Email verification required. Please verify your email before registering.");
    }

    // Fetch hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      throw new ApiError(404, "Hackathon not found");
    }

    // Registration deadline check - users can register before hackathon starts
    // only the registration deadline matters
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      throw new ApiError(422, "Registration deadline has passed. Cannot register for this hackathon.");
    }

    // Mode allowed? (handles "both" as wildcard)
    const allowed = [].concat(hackathon.allowedModes || hackathon.mode || []);
    const allowedLower = allowed.map(m => (typeof m === 'string' ? m.toLowerCase() : m));
    const modeLower = mode?.toLowerCase();
    const isAllowed = allowedLower.includes(modeLower) || allowedLower.includes('both');
    if (!isAllowed) {
      throw new ApiError(400, `This hackathon does not allow ${mode} registrations`);
    }

    // Dispatch to mode-specific flow
    if (modeLower === "solo") {
      const result = await this.registerSolo({ hackathon, userId: userId || callerId, notes, caller: caller }, { session });
      await session.commitTransaction();
      return result;
    } else if (modeLower === "team") {
      const result = await this.registerTeam({ hackathon, teamId, callerId, notes }, { session });
      await session.commitTransaction();
      return result;
    } else {
      throw new ApiError(400, "Invalid registration mode. Use 'solo' or 'team'");
    }
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Solo registration flow
   * @private
   */
  async registerSolo({ hackathon, userId, notes, caller }, options = {}) {
    // Only self-registration
    if (userId.toString() !== caller._id.toString()) {
      throw new ApiError(403, "You can only register yourself for solo mode");
    }

    // Build registration data
    const regData = {
      hackathonId: hackathon._id,
      userId,
      teamId: null,
      mode: "solo",
      participantIds: [userId],
      totalAmount: hackathon.registrationFee,
      currency: hackathon.currency,
      notes,
      status: hackathon.registrationFee > 0 ? "pending" : "confirmed",
      paymentStatus: hackathon.registrationFee > 0 ? "pending" : "completed"
    };

    if (hackathon.registrationFee === 0) {
      regData.confirmedAt = new Date();
      regData.paymentCompletedAt = new Date();
    }

    // Create with duplicate protection
    let registration;
    try {
      registration = await this.registrationRepo.create(regData, options);
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(409, "You are already registered for this hackathon");
      }
      throw error;
    }

    // Send confirmation email if registration is confirmed (free hackathon)
    if (registration.status === "confirmed") {
      try {
        await sendEmail(caller.email, EMAIL_TYPES.REGISTRATION_CONFIRMATION, {
          hackathonTitle: hackathon.title,
          startDate: hackathon.startDate,
          endDate: hackathon.endDate,
          fullName: caller.fullName
        });
      } catch (emailError) {
        console.error("Failed to send registration confirmation email:", emailError.message);
      }
    }

    return {
      registrationId: registration._id,
      hackathonId: registration.hackathonId,
      mode: registration.mode,
      teamId: registration.teamId,
      status: registration.status,
      paymentStatus: registration.paymentStatus,
      requiresPayment: hackathon.registrationFee > 0,
      message: hackathon.registrationFee > 0
        ? "Registration successful. Please complete payment to confirm."
        : "Registration successful. You are confirmed!"
    };
  }

  /**
   * Team registration flow (existing team only)
   * @private
   */
  async registerTeam({ hackathon, teamId, callerId, notes }, options = {}) {
    if (!teamId) {
      throw new ApiError(400, "teamId is required for team registration");
    }

    // Fetch team with members
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    // Verify team belongs to this hackathon
    if (team.hackathonId.toString() !== hackathon._id.toString()) {
      throw new ApiError(400, "This team is not registered for this hackathon");
    }

    // Only team leader can register
    if (team.leader.toString() !== callerId.toString()) {
      throw new ApiError(403, "Only team leader can register the team");
    }

    // Check team size (accepted members only)
    const acceptedCount = teamRepository.getAcceptedMemberCount(team);
    if (acceptedCount < hackathon.minTeamSize) {
      throw new ApiError(
        400,
        `Team size (${acceptedCount}) is below minimum requirement of ${hackathon.minTeamSize}. Please wait for more members to accept invitations or add more members.`
      );
    }
    if (acceptedCount > hackathon.maxTeamSize) {
      throw new ApiError(
        400,
        `Team size (${acceptedCount}) exceeds maximum limit of ${hackathon.maxTeamSize}. Team size cannot exceed ${hackathon.maxTeamSize}.`
      );
    }

    // Get accepted member IDs
    const acceptedMemberIds = teamRepository.getAcceptedMemberIds(team);

     // Verify all accepted members are verified
     const unverifiedUsers = await User.find({
       _id: { $in: acceptedMemberIds },
       isEmailVerified: false
     }).select("email");
     if (unverifiedUsers.length > 0) {
       const unverifiedEmails = unverifiedUsers.map(u => u.email).join(", ");
       throw new ApiError(403, `Following members need to verify their email: ${unverifiedEmails}`);
     }

     // Duplicate checks are now handled atomically by database unique indexes.
     // The registration creation will throw a duplicate key error if any participant
     // already has an active registration for this hackathon.

     // Build registration data
     const regData = {
       hackathonId: hackathon._id,
       teamId,
       mode: "team",
       userId: null,
       participantIds: acceptedMemberIds,
       totalAmount: hackathon.registrationFee,
       currency: hackathon.currency,
       notes,
       status: hackathon.registrationFee > 0 ? "pending" : "confirmed",
       paymentStatus: hackathon.registrationFee > 0 ? "pending" : "completed"
     };

    if (hackathon.registrationFee === 0) {
      regData.confirmedAt = new Date();
      regData.paymentCompletedAt = new Date();
    }

    // Create with duplicate key protection (atomic via unique indexes)
    let registration;
    try {
      registration = await this.registrationRepo.create(regData, options);
    } catch (error) {
      if (error.code === 11000) {
        const keyPattern = error.keyPattern || {};
        if (keyPattern.teamId) {
          throw new ApiError(409, "This team is already registered for this hackathon");
        } else if (keyPattern.participantIds) {
          throw new ApiError(409, "A team member is already registered in another team or as a solo participant for this hackathon");
        } else {
          throw new ApiError(409, "Duplicate registration");
        }
      }
      throw error;
    }

    // Send confirmation emails if registration is confirmed (free hackathon)
    if (registration.status === "confirmed") {
      try {
        // Get all participant emails
        const participants = await User.find({ _id: { $in: acceptedMemberIds } }).select("email fullName");
        for (const participant of participants) {
          await sendEmail(participant.email, EMAIL_TYPES.REGISTRATION_CONFIRMATION, {
            hackathonTitle: hackathon.title,
            startDate: hackathon.startDate,
            endDate: hackathon.endDate,
            fullName: participant.fullName
          });
        }
      } catch (emailError) {
        console.error("Failed to send team registration confirmation emails:", emailError.message);
      }
    }

    return {
      registrationId: registration._id,
      hackathonId: registration.hackathonId,
      mode: registration.mode,
      teamId: registration.teamId,
      status: registration.status,
      paymentStatus: registration.paymentStatus,
      requiresPayment: hackathon.registrationFee > 0,
      message: hackathon.registrationFee > 0
        ? "Team registration successful. Please complete payment to confirm."
        : "Team registration successful. Your team is confirmed!"
    };
  }

  /**
   * Cancel a registration
   * Only allowed if status is 'pending' or 'confirmed'
   */
  async cancelRegistration(registrationId, userId, reason) {
    const registration = await this.registrationRepo.findById(registrationId);
    if (!registration) {
      throw new ApiError(404, "Registration not found");
    }

    // Authorization: user must be either the registered user (solo) or team leader (team)
    let isAuthorized = false;
    if (registration.mode === "solo" && registration.userId?.toString() === userId.toString()) {
      isAuthorized = true;
    } else if (registration.mode === "team") {
      const team = await teamRepository.findById(registration.teamId);
      if (team && team.leader.toString() === userId.toString()) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ApiError(403, "You are not authorized to cancel this registration");
    }

    // Business rules
    if (registration.status === "cancelled") {
      throw new ApiError(400, "Registration is already cancelled");
    }

    // If payment already completed, require reason
    if (registration.paymentStatus === "completed" && !reason) {
      throw new ApiError(400, "Cancellation reason is required when payment is completed");
    }

    return await this.registrationRepo.cancel(registrationId, reason);
  }

  /**
   * Get user's own registrations (including cancelled)
   */
  async getMyRegistrations(userId, filters = {}) {
    // Get all team IDs where user is an accepted member
    const teamIds = await this.registrationRepo.getTeamIdsByUser(userId);

    const query = Registration.find({
      $or: [
        { userId },
        { teamId: { $in: teamIds } }
      ],
      ...filters
    })
      .populate('hackathonId')
      .populate('teamId')
      .populate({
        path: 'userId',
        select: '-password -refreshToken -emailOTP -emailVerificationToken'
      });

    return await query;
  }
}

const registrationService = new RegistrationService();
// NOTE: wire repository correctly (prevents runtime crash)
// Keeping controller/service layering intact.
RegistrationService.prototype.registrationRepo = registrationRepository;

export default registrationService;
