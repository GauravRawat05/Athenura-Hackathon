/**
   registration.controller.js
   Handles HTTP request/response flow for registration, including parsing inputs and returning standardized API responses.
 */
import ApiResponse from "../../libs/apiResponse.js";
import registrationService from "./registration.service.js";

class RegistrationController {
  
   // Register for a hackathon (solo or team)
   //POST /hackathons/:hackathonId/register
  async register(req, res) {
    const { hackathonId } = req.params;
    const { mode, userId, teamId, notes } = req.body;
    const callerId = req.user._id;

    const result = await registrationService.registerForHackathon({
      hackathonId,
      mode,
      userId,
      teamId,
      notes
    }, callerId);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Registration successful"));
  }

  /**
   * Get current user's registrations
   * GET /registrations/me
   */
  async getMyRegistrations(req, res) {
    const userId = req.user._id;
    const { status, hackathonId } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (hackathonId) filters.hackathonId = hackathonId;

    const registrations = await registrationService.getMyRegistrations(userId, filters);

    return res
      .status(200)
      .json(new ApiResponse(200, registrations, "Registrations fetched successfully"));
  }

  /**
   * Cancel a registration
   * PATCH /registrations/:registrationId/cancel
   */
  async cancel(req, res) {
    const { registrationId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const registration = await registrationService.cancelRegistration(registrationId, userId, reason);

    return res
      .status(200)
      .json(new ApiResponse(200, registration, "Registration cancelled successfully"));
  }
}

const registrationController = new RegistrationController();
export default registrationController;
