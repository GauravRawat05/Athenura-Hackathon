/**
 * publicWinners.controller.js
 * Controller for public/non-admin winners endpoint.
 */
import ApiResponse from "../../libs/apiResponse.js";
import publicWinnersService from "./publicWinners.service.js";

class PublicWinnersController {
  async getWinners(req, res) {
    const { hackathonId } = req.params;

    const winnersPayload = await publicWinnersService.getWinners(hackathonId);

    return res
      .status(200)
      .json(new ApiResponse(200, winnersPayload, "Winners fetched successfully"));
  }
}

const publicWinnersController = new PublicWinnersController();
export default publicWinnersController;
