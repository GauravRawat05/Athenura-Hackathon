/**
 * adminHackathon.controller.js
 * Handles HTTP request/response flow for admin hackathon operations.
 */
import mongoose from 'mongoose';
import ApiResponse from '../../../libs/apiResponse.js';
import ApiError from '../../../libs/apiError.js';
import {
  createHackathon as createHackathonService,
  updateHackathon as updateHackathonService,
  deleteHackathon as deleteHackathonService,
  findHackathonById,
  updateHackathonRuleService,
  listRegistrations as listRegistrationsService
} from './adminHackathon.service.js';
import Hackathon from './hackathon.model.js';
import adminResultService from '../results/adminResult.service.js';

class AdminHackathonController {
  /**
   * Create a new hackathon
   */
  async createHackathon(req, res) {
    try {
      const hackathon = await createHackathonService(req.body);
      return res.status(201).json(new ApiResponse(201, hackathon, 'Hackathon created successfully'));
    } catch (error) {
      if (error.message.includes('slug already exists')) {
        throw new ApiError(409, error.message);
      }
      throw new ApiError(400, error.message);
    }
  }

  /**
   * Update an existing hackathon
   */
  async updateHackathon(req, res) {
    const { hackathonId } = req.params;
    
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    try {
      const hackathon = await updateHackathonService(hackathonId, req.body);
      if (!hackathon) {
        throw new ApiError(404, 'Hackathon not found');
      }
      return res.json(new ApiResponse(200, hackathon, 'Hackathon updated successfully'));
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, error.message);
    }
  }

  /**
   * Update hackathon rules
   */
  async updateHackathonRules(req, res) {
    const { hackathonId } = req.params;
    
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    try {
      const { rules } = req.body;

      if (rules === undefined) {
        throw new ApiError(400, 'Rules field is required in request body.');
      }

      const hackathon = await updateHackathonRuleService(hackathonId, rules);
      if (!hackathon) {
        throw new ApiError(404, 'Hackathon not found');
      }
      return res.json(new ApiResponse(200, hackathon, 'Hackathon rules updated successfully'));
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, error.message);
    }
  }

  /**
   * Delete a hackathon
   */
  async deleteHackathon(req, res) {
    const { hackathonId } = req.params;
    
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    try {
      await deleteHackathonService(hackathonId);
      return res.json(new ApiResponse(200, null, 'Hackathon deleted successfully'));
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, error.message);
    }
  }

  /**
   * Get all hackathons
   */
  async getAllHackathons(req, res) {
    const hackathons = await Hackathon.find();
    if (!hackathons) {
      throw new ApiError(404, 'Hackathons not found');
    }
    return res.json(new ApiResponse(200, hackathons, 'Hackathons fetched successfully'));
  }
  /**
   * Get a single hackathon by ID
   */
  async getHackathon(req, res) {
    const { hackathonId } = req.params;
    
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const hackathon = await findHackathonById(hackathonId);
    if (!hackathon) {
      throw new ApiError(404, 'Hackathon not found');
    }
    return res.json(new ApiResponse(200, hackathon, 'Hackathon fetched successfully'));
  }

  /**
   * List all registrations for a specific hackathon with filtering and pagination
   */
  async listRegistrations(req, res) {
    const { hackathonId } = req.params;
    
    // Validate hackathonId format
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    // Verify hackathon exists
    const hackathon = await Hackathon.findById(hackathonId).select('_id title');
    if (!hackathon) {
      throw new ApiError(404, 'Hackathon not found');
    }

    // Extract filter parameters from query
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      mode: req.query.mode,
      search: req.query.search
    };

    // Fetch registrations using service
    const result = await listRegistrationsService(hackathonId, filters);

    return res.json(
      new ApiResponse(200, result, 'Registrations fetched successfully')
    );
  }

  /**
   * Compute scores and ranks
   */
  async computeResults(req, res) {
    const { hackathonId } = req.params;
    
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const result = await adminResultService.computeAndSaveDraftResults(hackathonId);
    
    return res.json(
      new ApiResponse(200, result, 'Scores and ranks computed successfully')
    );
  }

  /**
   * Override ranks/awards
   */
  async overrideResults(req, res) {
    const { hackathonId } = req.params;
    
    if (!mongoose.isValidObjectId(hackathonId)) {
      throw new ApiError(400, 'Invalid hackathonId format');
    }

    const result = await adminResultService.overrideResult(hackathonId, req.body);
    
    return res.json(
      new ApiResponse(200, result, 'Ranks and awards overridden successfully')
    );
  }
}

const adminHackathonController = new AdminHackathonController();
export default adminHackathonController;