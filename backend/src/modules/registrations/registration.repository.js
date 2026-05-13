/**
   registration.repository.js
   Encapsulates database reads/writes for registration.
 */
import Registration from "./registration.model.js";

class RegistrationRepository {
  /**
   * Create a new registration
   */
  async create(registrationData) {
    return await Registration.create(registrationData);
  }

  /**
   * Find registration by ID
   */
  async findById(registrationId, populateFields = []) {
    let query = Registration.findById(registrationId);
    populateFields.forEach(field => {
      query = query.populate(field);
    });
    return await query;
  }

  /**
   * Find registration by hackathon ID and user ID (solo)
   */
  async findByHackathonAndUser(hackathonId, userId) {
    return await Registration.findOne({
      hackathonId,
      userId,
      mode: "solo"
    });
  }

  /**
   * Find registration by hackathon ID and team ID (team)
   */
  async findByHackathonAndTeam(hackathonId, teamId) {
    return await Registration.findOne({
      hackathonId,
      teamId,
      mode: "team"
    });
  }

   /**
    * Check if user has any registration (solo or team) for a hackathon
    * Excludes cancelled registrations to allow re-registration after cancellation.
    */
   async hasUserRegisteredForHackathon(hackathonId, userId) {
     const teamIds = await this.getTeamIdsByUser(userId);
     return await Registration.findOne({
       hackathonId,
       status: { $ne: "cancelled" },
       $or: [{ userId }, { teamId: { $in: teamIds } }]
     });
   }

  /**
   * Get all team IDs where user is an accepted member
   * Helper for checking if user is part of any team registration
   */
  async getTeamIdsByUser(userId) {
    // Import Team model dynamically to avoid circular dependency
    const { default: Team } = await import("../teams/team.model.js");
    const teams = await Team.find({
      "members.userId": userId,
      "members.invitationStatus": "accepted"
    });
    return teams.map(t => t._id);
  }

  /**
   * Find all registrations for a hackathon
   */
  async findByHackathon(hackathonId, filters = {}) {
    const query = Registration.find({ hackathonId, ...filters });
    return await query;
  }

  /**
   * Find all registrations for a user
   */
  async findByUser(userId) {
    return await Registration.find({ userId });
  }

  /**
   * Update registration status and related fields
   */
  async update(registrationId, updateData) {
    return await Registration.findByIdAndUpdate(
      registrationId,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * Update status to cancelled
   */
  async cancel(registrationId, reason) {
    return await Registration.findByIdAndUpdate(
      registrationId,
      {
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date()
      },
      { new: true }
    );
  }

  /**
   * Confirm registration after payment
   */
  async confirm(registrationId) {
    return await Registration.findByIdAndUpdate(
      registrationId,
      {
        status: "confirmed",
        paymentStatus: "completed",
        paymentCompletedAt: new Date(),
        confirmedAt: new Date()
      },
      { new: true }
    );
  }

  /**
   * Mark payment as failed
   */
  async markPaymentFailed(registrationId) {
    return await Registration.findByIdAndUpdate(
      registrationId,
      {
        status: "payment_failed",
        paymentStatus: "failed"
      },
      { new: true }
    );
  }
}

const registrationRepository = new RegistrationRepository();
export default registrationRepository;
