/**
  hackathon.controller.js
  Handles HTTP request/response flow for hackathon.
 */
import hackathonService from './hackathon.service.js';
import ApiResponse from '../../libs/apiResponse.js';
import ApiError from '../../libs/apiError.js';
import publicWinnersService from '../results/publicWinners.service.js';
import resultService from '../results/result.service.js';

class Hackathoncontroller {
  // Get all hackathons
  async getAllHackathons(req, res) {
    const hackathons = await hackathonService.getAllHackathons();
    if (!hackathons) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'No hackathons found');
    }
    res.json(new ApiResponse(200, hackathons, 'Hackathons fetched successfully'));
  }

  // Get hackathon by ID
  async getHackathonById(req, res) {
    const { hackathonId } = req.params;
    const hackathon = await hackathonService.getHackathonById(hackathonId);
    if (!hackathon) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Hackathon not found');
    }
    res.json(new ApiResponse(200, hackathon, 'Hackathon fetched successfully'));
  }

  // Get public winners cards
  async getWinners(req, res) {
    const { hackathonId } = req.params;
    const winnersData = await publicWinnersService.getWinners(hackathonId);
    res.json(new ApiResponse(200, winnersData, 'Winners fetched successfully'));
  }

  // Get authenticated result view
  async getResults(req, res) {
    const { hackathonId } = req.params;
    const resultsData = await resultService.getPublishedResults(hackathonId);
    res.json(new ApiResponse(200, resultsData, 'Results fetched successfully'));
  }
};

const hackathonController = new Hackathoncontroller();
export default hackathonController;