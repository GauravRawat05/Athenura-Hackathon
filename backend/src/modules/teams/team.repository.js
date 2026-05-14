/**
  team.repository.js
  Encapsulates database reads/writes for team.
 */
import Team from "./team.model.js";

class TeamRepository {
   /**
    * Get team size (count of accepted members only)
    * Handles backward compatibility: members without invitationStatus are treated as accepted
    */
   getAcceptedMemberCount(team) {
     return team.members.filter(m => {
       const status = m.invitationStatus || 'accepted';
       return status === 'accepted';
     }).length;
   }

   /**
    * Get all accepted member user IDs
    * Handles backward compatibility: members without invitationStatus are treated as accepted
    */
   getAcceptedMemberIds(team) {
     return team.members
       .filter(m => {
         const status = m.invitationStatus || 'accepted';
         return status === 'accepted';
       })
       .map(m => m.userId);
   }

  /**
   * Find team by ID
   */
  async findById(teamId, populateFields = []) {
    let query = Team.findById(teamId);
    populateFields.forEach(field => {
      query = query.populate(field);
    });
    return await query;
  }

  /**
   * Find teams by hackathon ID
   */
  async findByHackathon(hackathonId) {
    return await Team.find({ hackathonId, isActive: true });
  }

  /**
   * Find team by hackathon and member user ID
   */
  async findByHackathonAndMember(hackathonId, userId) {
    return await Team.findOne({
      hackathonId,
      isActive: true,
      "members.userId": userId
    });
  }

  /**
   * Update team
   */
  async update(teamId, updateData) {
    return await Team.findByIdAndUpdate(
      teamId,
      updateData,
      { new: true, runValidators: true }
    );
  }

   /**
    * Add member to team
    */
   async addMember(teamId, memberData) {
     return await Team.findByIdAndUpdate(
       teamId,
       { $push: { members: { ...memberData, invitationStatus: "accepted" } } },
       { new: true }
     );
   }

  /**
   * Remove member from team
   */
  async removeMember(teamId, userId) {
    return await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: { userId } } },
      { new: true }
    );
  }

  /**
   * Create a new team
   */
  async create(data) {
    return await Team.create(data);
  }

  /**
   * Delete team (soft delete by setting isActive to false)
   */
  async softDelete(teamId) {
    return await Team.findByIdAndUpdate(
      teamId,
      { isActive: false },
      { new: true }
    );
  }
}

const teamRepository = new TeamRepository();
export default teamRepository;
