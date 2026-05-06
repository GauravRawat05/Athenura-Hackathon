/**
  team.controller.js
  Handles HTTP request/response flow for team.
 */
import ApiResponse from "../../libs/apiResponse.js";
import teamService from "./team.service.js";
import invitationService from "./invitation.service.js";

class TeamController {
  /**
   * Create a new team
   */
  async createTeam(req, res) {
    const { hackathonId } = req.params;
    const { name, description } = req.body;
    const leaderId = req.user._id;

    const team = await teamService.createTeam({
      hackathonId,
      name,
      description,
      leaderId
    });

    return res
      .status(201)
      .json(new ApiResponse(201, team, "Team created successfully"));
  }

  /**
   * Get team details by ID
   */
  async getTeam(req, res) {
    const { teamId } = req.params;

    const team = await teamService.getTeamById(teamId);

    return res
      .status(200)
      .json(new ApiResponse(200, team, "Team fetched successfully"));
  }

  /**
   * Update team metadata
   */
  async updateTeam(req, res) {
    const { teamId } = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    const team = await teamService.updateTeam(teamId, updateData, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, team, "Team updated successfully"));
  }

  /**
   * Remove member from team
   */
  async removeMember(req, res) {
    const { teamId, userId: memberIdToRemove } = req.params;
    const userId = req.user._id;

    const team = await teamService.removeMember(teamId, memberIdToRemove, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, team, "Member removed successfully"));
  }

  /**
   * Invite member to team
   */
  async inviteMember(req, res) {
    const { teamId } = req.params;
    const { email } = req.body;
    const invitedById = req.user._id;

    const result = await invitationService.createInvitation({
      teamId,
      email,
      invitedById
    });

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Invitation sent successfully"));
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(req, res) {
    const { token } = req.params;
    const userId = req.user._id;

    const result = await invitationService.acceptInvitation(token, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Invitation accepted successfully. You are now a team member."));
  }

  /**
   * Decline team invitation
   */
  async declineInvitation(req, res) {
    const { token } = req.params;
    const userId = req.user._id;

    const result = await invitationService.declineInvitation(token, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Invitation declined successfully"));
  }
}

const teamController = new TeamController();
export default teamController;
