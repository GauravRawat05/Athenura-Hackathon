/**
  invitation.repository.js
  Encapsulates database reads/writes for team invitations.
 */
import TeamInvitation from "./invitation.model.js";

/**
 * Safe fields to expose for user objects in invitation contexts
 */
const USER_SAFE_FIELDS = "fullName email role";

class InvitationRepository {
  async create(invitationData) {
    return await TeamInvitation.create(invitationData);
  }

  async findByToken(token) {
    return await TeamInvitation.findOne({ token }).populate([
      { path: "teamId" },
      { path: "invitedUserId", select: USER_SAFE_FIELDS },
      { path: "invitedBy", select: USER_SAFE_FIELDS }
    ]);
  }

  async findPendingByTeamAndUser(teamId, userId) {
    return await TeamInvitation.findOne({
      teamId,
      invitedUserId: userId,
      status: "pending"
    });
  }

  async findPendingByTeamAndEmail(teamId, email) {
    return await TeamInvitation.findOne({
      teamId,
      invitedEmail: email.toLowerCase(),
      status: "pending"
    });
  }

  async updateStatus(invitationId, status) {
    return await TeamInvitation.findByIdAndUpdate(
      invitationId,
      { status },
      { new: true }
    );
  }

  async findByTeam(teamId) {
    return await TeamInvitation.find({ teamId }).populate([
      { path: "invitedUserId", select: "fullName email" },
      { path: "invitedBy", select: "fullName email" }
    ]);
  }
}

const invitationRepository = new InvitationRepository();
export default invitationRepository;
