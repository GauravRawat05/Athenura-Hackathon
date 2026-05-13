import Hackathon from './hackathon.model.js'; // Corrected filename
import Registration from '../../registrations/registration.model.js';
import Team from '../../teams/team.model.js';
import User from '../../users/user.model.js';

// Helper function to validate date types
const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

// Helper function to validate allowed modes
const validateAllowedModes = (modes) => {
  const validModes = ['solo', 'team'];
  return modes.every(mode => validModes.includes(mode));
};

const createHackathon = async (hackathonData) => {
  // Check if a hackathon with the same slug already exists
  const existingHackathon = await Hackathon.findOne({ slug: hackathonData.slug });
  if (existingHackathon) {
    throw new Error('Hackathon with this slug already exists.');
  }

  // Validate date consistency and type
  if (!isValidDate(hackathonData.startDate) || !isValidDate(hackathonData.endDate)) {
    throw new Error('Start date and end date must be valid date strings.');
  }

  if (new Date(hackathonData.endDate) <= new Date(hackathonData.startDate)) {
    throw new Error('End date must be greater than start date.');
  }

  // Validate allowed modes
  if (!validateAllowedModes(hackathonData.allowedModes)) {
    throw new Error('Allowed modes must be either "solo" or "team".');
  }

  const hackathon = new Hackathon(hackathonData);
  await hackathon.save();
  return hackathon;
};

const updateHackathon = async (hackathonId, updateData) => {
  // Check if the hackathon exists
  const existingHackathon = await Hackathon.findById(hackathonId);
  if (!existingHackathon) {
    throw new Error('Hackathon not found.');
  }

  // Validate date consistency and type if dates are being updated
  if (updateData.startDate || updateData.endDate) {
    const newStartDate = updateData.startDate || existingHackathon.startDate;
    const newEndDate = updateData.endDate || existingHackathon.endDate;

    if (!isValidDate(newStartDate) || !isValidDate(newEndDate)) {
      throw new Error('Start date and end date must be valid date strings.');
    }

    if (new Date(newEndDate) <= new Date(newStartDate)) {
      throw new Error('End date must be greater than start date.');
    }
  }

  // Validate allowed modes if provided
  if (updateData.allowedModes && !validateAllowedModes(updateData.allowedModes)) {
    throw new Error('Allowed modes must be either "solo" or "team".');
  }

  const hackathon = await Hackathon.findByIdAndUpdate(hackathonId, updateData, { new: true });
  return hackathon;
};


const updateHackathonRuleService = async (hackathonId, rules) => {
  const updateRules = {}
  if (rules && typeof rules === "string") {
    updateRules.rules = String(rules).trim().split(",");
  } else {
    updateRules.rule = []
  }

  if (updateRules.rules.length < 0) {
    throw new Error('Rules has been not Empty !');
  }
  const updateHackathonRules = await Hackathon.findByIdAndUpdate(hackathonId, updateRules, { new: true });
  return updateHackathonRules
}

const deleteHackathon = async (hackathonId) => {
  const result = await Hackathon.findByIdAndDelete(hackathonId);
  if (!result) {
    throw new Error('Hackathon not found.');
  }
};

const findHackathonById = async (hackathonId) => {
  return await Hackathon.findById(hackathonId);
};

/**
 * List all registrations for a specific hackathon with filtering and pagination.
 * @param {string} hackathonId - The MongoDB ObjectId of the hackathon
 * @param {Object} filters - Filter options (page, limit, status, paymentStatus, mode, search)
 * @returns {Object} Object containing registrations array and pagination metadata
 */
const listRegistrations = async (hackathonId, filters = {}) => {
  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 20));
  const skip = (page - 1) * limit;

  // Build the query object
  const query = { hackathonId };

  // Add status filter if provided
  if (filters.status) {
    query.status = filters.status;
  }

  // Add paymentStatus filter if provided
  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  // Add mode filter if provided
  if (filters.mode) {
    query.mode = filters.mode;
  }

  // Add search filter if provided - search by user email/fullName or team name
  if (filters.search && filters.search.trim() !== '') {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    
    // Find users matching the search term
    const matchingUsers = await User.find({
      $or: [
        { email: searchRegex },
        { fullName: searchRegex }
      ]
    }).select('_id');
    
    const userIds = matchingUsers.map(u => u._id);
    
    // Find teams matching the search term
    const matchingTeams = await Team.find({
      teamName: searchRegex
    }).select('_id');
    
    const teamIds = matchingTeams.map(t => t._id);
    
    // Add OR condition for both userIds and teamIds
    query.$or = [
      { userId: { $in: userIds } },
      { teamId: { $in: teamIds } }
    ];
  }

  // Execute query with pagination and populate related fields
  const [registrations, total] = await Promise.all([
    Registration.find(query)
      .populate('userId', 'fullName email collegeOrUniversity graduationYear skills')
      .populate('teamId', 'teamName description leader members')
      .populate('participantIds', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Registration.countDocuments(query)
  ]);

  return {
    registrations,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export {
  createHackathon,
  updateHackathon,
  deleteHackathon,
  findHackathonById,
  updateHackathonRuleService,
  listRegistrations
};
