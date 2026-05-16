/**
  team.service.js
  Contains the core business rules for team.
 */
import teamRepository from "./team.repository.js";
import mongoose from "mongoose";
import { teamRoles } from "./team.constants.js";
import ApiError from "../../libs/apiError.js";

class TeamService {
  /**
   * Create a new team for a hackathon
   */
  async createTeam({ hackathonId, teamName, description, leaderId }) {
    // Check if user is already in a team for this hackathon
    const existingTeam = await teamRepository.findByHackathonAndMember(
      hackathonId,
      leaderId
    );

    if (existingTeam) {
      throw new ApiError(
        400,
        "You are already a member of a team for this hackathon"
      );
    }

    // Create team with leader as first member
    const teamData = {
      hackathonId,
      teamName,
      description,
      leader: leaderId,
      members: [
        {
          userId: leaderId,
          role: teamRoles.LEADER,
          joinedAt: new Date(),
          invitationStatus: "accepted"  // leader is automatically accepted
        }
      ]
    };

    const team = await teamRepository.create(teamData);
    return await teamRepository.findById(team._id, ["leader", "members.userId"]);
  }

  /**
   * Get team by ID
   */
  async getTeamById(teamId) {
    const team = await teamRepository.findById(teamId, [
      "leader",
      "members.userId",
      "hackathonId"
    ]);

    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    return team;
  }

  /**
   * Update team metadata
   */
  async updateTeam(teamId, updateData, userId) {
    const team = await this.getTeamById(teamId);

    // Only leader can update team
    if (team.leader._id.toString() !== userId.toString()) {
      throw new ApiError(403, "Only team leader can update team details");
    }

    const updateObj = { $set: updateData };
    const options = { new: true, runValidators: true };

    // If updating leader, validate new leader is a team member
    if (updateData.leader) {
      const newLeaderId = updateData.leader.toString();
      const isMember = team.members.some(
        (m) => m.userId._id.toString() === newLeaderId
      );
      if (!isMember) {
        throw new ApiError(400, "New leader must be an existing team member");
      }

      // Update roles in the members array only if the leader is actually changing
      if (team.leader._id.toString() !== newLeaderId) {
        updateObj.$set["members.$[oldLeader].role"] = teamRoles.MEMBER;
        updateObj.$set["members.$[newLeader].role"] = teamRoles.LEADER;
        options.arrayFilters = [
          { "oldLeader.userId": team.leader._id },
          { "newLeader.userId": new mongoose.Types.ObjectId(newLeaderId) }
        ];
      }
    }

    // Perform the metadata and role update in one atomic call
    await teamRepository.update(teamId, updateObj, options);

    // Return the fresh, fully populated team object to maintain consistency
    return await this.getTeamById(teamId);
  }

  /**
   * Remove member from team
   */
  async removeMember(teamId, memberIdToRemove, userId) {
    const team = await this.getTeamById(teamId);

    // Only leader can remove members
    if (team.leader._id.toString() !== userId.toString()) {
      throw new ApiError(403, "Only team leader can remove members");
    }

    // Cannot remove leader
    if (memberIdToRemove.toString() === team.leader._id.toString()) {
      throw new ApiError(
        400,
        "Cannot remove team leader. To leave the team, you must first transfer leadership to another member."
      );
    }

    // Check if hackathon has already started
    if (team.hackathonId && team.hackathonId.startDate && new Date(team.hackathonId.startDate) <= new Date()) {
      throw new ApiError(400, "Cannot remove members after the hackathon has started.");
    }

    // Check if user is actually a member
    const isMember = team.members.some(
      (m) => m.userId._id.toString() === memberIdToRemove.toString()
    );

    if (!isMember) {
      throw new ApiError(400, "User is not a member of this team");
    }

    const updatedTeam = await teamRepository.removeMember(
      teamId,
      memberIdToRemove
    );
    return updatedTeam;
  }

  /**
   * Check if user is team leader
   */
  async isTeamLeader(teamId, userId) {
    const team = await teamRepository.findById(teamId);
    if (!team) return false;
    return team.leader.toString() === userId.toString();
  }

  /**
   * Get team size
   */
  getTeamSize(team) {
    return team.members.length;
  }
}

const teamService = new TeamService();
export default teamService;
