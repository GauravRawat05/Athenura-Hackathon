/**
  team.repository.js
  Encapsulates database reads/writes for team.
 */
import Team from "./team.model.js";

class TeamRepository {
  /**
   * Create a new team
   */
  async create(teamData) {
    return await Team.create(teamData);
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
      { $push: { members: memberData } },
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
