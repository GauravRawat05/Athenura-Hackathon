/**
  hackathon.controller.js
  Handles HTTP request/response flow for hackathon.
 */
  import hackathonService from './hackathon.service.js';
import ApiResponse from '../../libs/apiResponse.js';
import ApiError from '../../libs/apiError.js';
class Hackathoncontroller {
  // Get all hackathons
  async getAllHackathons(req, res) {
    const hackathons = await hackathonService.getAllHackathons();
    if (!hackathons) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'No hackathons found');
    }
    ApiResponse.sendSuccess(200, res, hackathons);
  }

  // Get hackathon by ID
  async getHackathonById(req, res) {
    const { hackathonId } = req.params;
    const hackathon = await hackathonService.getHackathonById(hackathonId);
    if (!hackathon) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Hackathon not found');
    }
    ApiResponse.sendSuccess(200, res, hackathon);
  }
};

const hackathonController = new Hackathoncontroller();
export default hackathonController;