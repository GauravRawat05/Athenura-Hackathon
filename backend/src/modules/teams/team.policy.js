/**
  team.policy.js
  Checks authorization and access rules for team management.
 */
import teamRepository from "./team.repository.js";
import ApiError from "../../libs/apiError.js";

class TeamPolicy {
  /**
   * Middleware to check if user is team leader
   */
  async isTeamLeader(req, res, next) {
    try {
      const { teamId } = req.params;
      const userId = req.user._id;

      const team = await teamRepository.findById(teamId);

      if (!team) {
        throw new ApiError(404, "Team not found");
      }

      if (team.leader.toString() !== userId.toString()) {
        throw new ApiError(403, "Only team leader can perform this action");
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Middleware to check if user is team member
   */
  async isTeamMember(req, res, next) {
    try {
      const { teamId } = req.params;
      const userId = req.user._id;

      const team = await teamRepository.findById(teamId);

      if (!team) {
        throw new ApiError(404, "Team not found");
      }

      const isMember = team.members.some(
        (m) => m.userId.toString() === userId.toString()
      );

      if (!isMember) {
        throw new ApiError(403, "You are not a member of this team");
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}

const teamPolicy = new TeamPolicy();
export default teamPolicy;
