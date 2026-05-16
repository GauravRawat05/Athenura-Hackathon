/**
  judging.controller.js
  HTTP controllers for judging routes.
 */

import judgingService from "./judging.service.js";
import ApiResponse from "../../libs/apiResponse.js";

class JudgingController {
  async getAllJudges(req, res) {
    const judges = await judgingService.getAllJudges();

    return res
      .status(200)
      .json(new ApiResponse(200, judges, "Judges fetched successfully"));
  }

  async assignJudges(req, res) {
    const { hackathonId } = req.params;
    const { judgeIds } = req.body;
    const adminId = req.user._id;

    const result = await judgingService.assignJudges(hackathonId, judgeIds, adminId);

    if (!result.assigned) {
      return res
        .status(409)
        .json(new ApiResponse(409, result, result.message || "All judges are already assigned to this hackathon"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Judges assigned successfully"));
  }

  async getAssignments(req, res) {
    const judgeId = req.user._id;
    const assignments = await judgingService.getJudgeAssignments(judgeId);

    return res
      .status(200)
      .json(new ApiResponse(200, assignments, "Assignments fetched successfully"));
  }

  async getSubmissionsForJudge(req, res) {
    const { hackathonId } = req.params;
    const judgeId = req.user._id;

    const submissions = await judgingService.getSubmissionsForJudge(hackathonId, judgeId);

    return res
      .status(200)
      .json(new ApiResponse(200, submissions, "Submissions fetched successfully"));
  }

  async submitScore(req, res) {
    const { submissionId } = req.params;
    // We assume the route is /judge/submissions/:submissionId/scores
    // We need hackathonId. Client can send it in query, or we can look it up in service, but we explicitly require it here per spec.
    // Let's take it from query parameters.
    const { hackathonId } = req.query;
    if (!hackathonId) {
      return res.status(400).json(new ApiResponse(400, null, "hackathonId query parameter is required"));
    }
    
    const judgeId = req.user._id;
    const scoreData = req.body;

    const newScore = await judgingService.submitScore(submissionId, judgeId, hackathonId, scoreData);

    return res
      .status(201)
      .json(new ApiResponse(201, newScore, "Score submitted successfully"));
  }

  async updateScore(req, res) {
    const { scoreId } = req.params;
    const judgeId = req.user._id;
    const updateData = req.body;

    const updatedScore = await judgingService.updateScore(scoreId, judgeId, updateData);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedScore, "Score updated successfully"));
  }
}

const judgingController = new JudgingController();
export default judgingController;
