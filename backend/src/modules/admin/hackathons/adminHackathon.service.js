import Hackathon from './hackathon.model.js'; // Corrected filename
import Registration from '../../registrations/registration.model.js';
import Team from '../../teams/team.model.js';
import User from '../../users/user.model.js';
import mongoose from 'mongoose';
import { sendEmail, EMAIL_TYPES } from '../../notifications/notification.mailer.js';

// Helper function to validate date types with timezone handling
const isValidDate = (date) => {
  if (!date) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

// Helper function to validate allowed modes
const validateAllowedModes = (modes) => {
  const validModes = ['solo', 'team'];
  if (!Array.isArray(modes) ) {
    return false;
  }
  return modes.every(mode => validModes.includes(mode));
};

// Helper function to validate ObjectId format
const isValidObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch {
    return false;
  }
};

// Helper function to sanitize search regex input
const sanitizeSearchInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  // Escape special regex characters
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createHackathon = async (hackathonData) => {
  // Validate required fields
  if (!hackathonData || typeof hackathonData !== 'object') {
    throw new Error('Hackathon data must be a valid object.');
  }

  // Handle "free" registration fee by converting it to 0
  if (hackathonData.registrationFee === 'free') {
    hackathonData.registrationFee = 0;
  }

  // Normalize allowedModes if provided directly to handle case-sensitivity
  if (hackathonData.allowedModes && Array.isArray(hackathonData.allowedModes)) {
    hackathonData.allowedModes = hackathonData.allowedModes.map(m => typeof m === 'string' ? m.toLowerCase().trim() : m);
  }

  // Map mode array to allowedModes if allowedModes not provided
  // mode contains capitalized values like ['Solo', 'Both']
  // allowedModes should contain lowercase values like ['solo', 'team']
  if (hackathonData.mode && !hackathonData.allowedModes) {
    const mappedModes = hackathonData.mode.map(m => {
      const modeLower = m.toLowerCase().trim();
      // Map 'both' to ['solo', 'team'] based on business logic
      if (modeLower === 'both') {
        return ['solo', 'team'];
      }
      // Validate individual mode
      if (!['solo', 'team'].includes(modeLower)) {
        throw new Error(`Invalid mode: "${m}". Must be "Solo", "Team", or "Both".`);
      }
      return modeLower; // 'solo' -> 'solo'
    }).flat();

    // Deduplicate allowedModes to prevent duplicates
    hackathonData.allowedModes = [...new Set(mappedModes)];
  }

  // Set default allowedModes if null or empty
  if (!hackathonData.allowedModes || (Array.isArray(hackathonData.allowedModes) && hackathonData.allowedModes.length === 0)) {
    hackathonData.allowedModes = ['solo'];
  }

  // Validate allowed modes
  if (!validateAllowedModes(hackathonData.allowedModes)) {
    throw new Error('Allowed modes must be "solo", "team", or both.');
  }

  // Check if a hackathon with the same slug already exists (with optimistic locking for concurrency)
  const existingHackathon = await Hackathon.findOne({ slug: hackathonData.slug });
  if (existingHackathon) {
    throw new Error('Hackathon with this slug already exists.');
  }

  // Validate date consistency and type
  if (!isValidDate(hackathonData.startDate)) {
    throw new Error('Start date must be a valid date string.');
  }
  if (!isValidDate(hackathonData.endDate)) {
    throw new Error('End date must be a valid date string.');
  }

  // Compare dates including time
  if (new Date(hackathonData.endDate) < new Date(hackathonData.startDate)) {
    throw new Error('End date must be greater than or equal to start date.');
  }

  // Validate registrationDeadline if provided
  if (hackathonData.registrationDeadline) {
    if (!isValidDate(hackathonData.registrationDeadline)) {
      throw new Error('Registration deadline must be a valid date string.');
    }

    // Registration deadline must be before or equal to start date (including time)
    if (new Date(hackathonData.registrationDeadline) > new Date(hackathonData.startDate)) {
      throw new Error('Registration deadline must be before or equal to hackathon start date. Users cannot register after the hackathon has started.');
    }
  }

  // Validate submissionDeadline if provided
  if (hackathonData.submissionDeadline) {
    if (!isValidDate(hackathonData.submissionDeadline)) {
      throw new Error('Submission deadline must be a valid date string.');
    }

    const subDeadline = new Date(hackathonData.submissionDeadline);
    const start = new Date(hackathonData.startDate);
    const end = new Date(hackathonData.endDate);

    if (subDeadline < start || subDeadline > end) {
      throw new Error('Submission deadline must be between the hackathon start and end dates.');
    }
  }

  // Validate initial status - only draft or upcoming allowed on creation
  if (hackathonData.status && !['draft', 'upcoming'].includes(hackathonData.status)) {
    throw new Error('Initial status must be either "draft" or "upcoming".');
  }

  const hackathon = new Hackathon(hackathonData);
  await hackathon.save();
  return hackathon;
};

const updateHackathon = async (hackathonId, updateData) => {
  // Validate ObjectId format
  if (!isValidObjectId(hackathonId)) {
    throw new Error('Invalid hackathon ID format.');
  }

  // Validate input
  if (!updateData || typeof updateData !== 'object') {
    throw new Error('Update data must be a valid object.');
  }

  // Handle "free" registration fee by converting it to 0
  if (updateData.registrationFee === 'free') {
    updateData.registrationFee = 0;
  }

  // Check if the hackathon exists
  const existingHackathon = await Hackathon.findById(hackathonId);
  if (!existingHackathon) {
    throw new Error('Hackathon not found.');
  }

  // Validate date consistency and type if dates are being updated
  if (updateData.startDate || updateData.endDate) {
    const newStartDate = updateData.startDate || existingHackathon.startDate;
    const newEndDate = updateData.endDate || existingHackathon.endDate;

    if (!isValidDate(newStartDate)) {
      throw new Error('Start date must be a valid date string.');
    }
    if (!isValidDate(newEndDate)) {
      throw new Error('End date must be a valid date string.');
    }

    // Compare dates including time
    if (new Date(newEndDate) < new Date(newStartDate)) {
      throw new Error('End date must be greater than or equal to start date.');
    }
  }

  // Validate registrationDeadline if being updated
  if (updateData.registrationDeadline) {
    if (!isValidDate(updateData.registrationDeadline)) {
      throw new Error('Registration deadline must be a valid date string.');
    }

    // Get the start date to validate against
    const startDateToCheck = updateData.startDate || existingHackathon.startDate;

    // Registration deadline must be before or equal to start date (including time)
    if (new Date(updateData.registrationDeadline) > new Date(startDateToCheck)) {
      throw new Error('Registration deadline must be before or equal to hackathon start date. Users cannot register after the hackathon has started.');
    }
  }

  // Validate submissionDeadline if being updated
  if (updateData.submissionDeadline) {
    if (!isValidDate(updateData.submissionDeadline)) {
      throw new Error('Submission deadline must be a valid date string.');
    }

    const subDeadline = new Date(updateData.submissionDeadline);
    const start = new Date(updateData.startDate || existingHackathon.startDate);
    const end = new Date(updateData.endDate || existingHackathon.endDate);

    if (subDeadline < start || subDeadline > end) {
      throw new Error('Submission deadline must be between the hackathon start and end dates.');
    }
  }

  // Normalize and validate allowed modes if provided
  if (updateData.allowedModes && Array.isArray(updateData.allowedModes)) {
    updateData.allowedModes = updateData.allowedModes.map(m => typeof m === 'string' ? m.toLowerCase().trim() : m);
    if (!validateAllowedModes(updateData.allowedModes)) {
      throw new Error('Allowed modes must be "solo", "team", or both.');
    }
  }

  // Prevent manual update to ongoing/past if the requirement is strict
  if (updateData.status && !['draft', 'upcoming'].includes(updateData.status)) {
    throw new Error('Status can only be manually set to "draft" or "upcoming".');
  }

  // Update and check if result is null
  const hackathon = await Hackathon.findByIdAndUpdate(hackathonId, updateData, { new: true });
  if (!hackathon) {
    throw new Error('Failed to update hackathon.');
  }
  return hackathon;
};


const updateHackathonRuleService = async (hackathonId, rules) => {
  // Validate ObjectId format
  if (!isValidObjectId(hackathonId)) {
    throw new Error('Invalid hackathon ID format.');
  }

  // Check if hackathon exists
  const existingHackathon = await Hackathon.findById(hackathonId);
  if (!existingHackathon) {
    throw new Error('Hackathon not found.');
  }

  const updateRules = {};

  if (rules && typeof rules === "string") {
    // Split by comma, trim whitespace, and filter out empty strings
    updateRules.rules = rules
      .split(",")
      .map(rule => rule.trim())
      .filter(rule => rule.length > 0);
  } else if (rules && Array.isArray(rules)) {
    // Filter out empty strings and null/undefined values from array
    updateRules.rules = rules
      .map(rule => typeof rule === 'string' ? rule.trim() : rule)
      .filter(rule => rule && rule.length > 0);
  } else if (rules === null || rules === undefined) {
    // Set empty array if rules is null/undefined
    updateRules.rules = [];
  } else {
    throw new Error('Rules must be a string, array, or null.');
  }

  // Validate that rules is not empty (as per business logic)
  if (!Array.isArray(updateRules.rules) || updateRules.rules.length === 0) {
    throw new Error('Rules cannot be empty!');
  }

  // Update hackathon rules
  const updatedHackathon = await Hackathon.findByIdAndUpdate(
    hackathonId,
    updateRules,
    { new: true }
  );

  if (!updatedHackathon) {
    throw new Error('Failed to update hackathon rules.');
  }

  return updatedHackathon;
};


const deleteHackathon = async (hackathonId) => {
  // Validate ObjectId format
  if (!isValidObjectId(hackathonId)) {
    throw new Error('Invalid hackathon ID format.');
  }

  // Note: If cascading deletes are needed (registrations, teams, etc.),
  // implement in pre-delete middleware or handle separately
  const result = await Hackathon.findByIdAndDelete(hackathonId);
  if (!result) {
    throw new Error('Hackathon not found.');
  }
  return result;
};

const findHackathonById = async (hackathonId) => {
  // Add null/undefined input validation
  if (!hackathonId) {
    throw new Error('Hackathon ID is required.');
  }

  // Validate ObjectId format
  if (!isValidObjectId(hackathonId)) {
    throw new Error('Invalid hackathon ID format.');
  }

  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) {
    throw new Error('Hackathon not found.');
  }
  return hackathon;
};

const listRegistrations = async (hackathonId, filters = {}) => {
  // Validate hackathonId
  if (!isValidObjectId(hackathonId)) {
    throw new Error('Invalid hackathon ID format.');
  }

  // Stricter pagination validation
  let page = parseInt(filters.page) || 1;
  let limit = parseInt(filters.limit) || 20;

  // Check for NaN and ensure valid ranges
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 20;

  // Enforce maximum limit to prevent memory exhaustion
  const MAX_LIMIT = 100;
  limit = Math.min(limit, MAX_LIMIT);

  const skip = (page - 1) * limit;

  // Build the query object
  const query = { hackathonId };

  // Add status filter if provided
  if (filters.status && typeof filters.status === 'string') {
    query.status = filters.status.trim();
  }

  // Add paymentStatus filter if provided
  if (filters.paymentStatus && typeof filters.paymentStatus === 'string') {
    query.paymentStatus = filters.paymentStatus.trim();
  }

  // Add mode filter if provided
  if (filters.mode && typeof filters.mode === 'string') {
    query.mode = filters.mode.trim();
  }

  // Add search filter if provided - with regex injection prevention
  if (filters.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
    // Sanitize the search input to prevent regex injection
    const sanitizedSearch = sanitizeSearchInput(filters.search.trim());
    const searchRegex = new RegExp(sanitizedSearch, 'i');

    try {
      // Find users matching the search term
      const matchingUsers = await User.find({
        $or: [
          { email: searchRegex },
          { fullName: searchRegex }
        ]
      }).select('_id').lean();

      const userIds = matchingUsers.map(u => u._id);

      // Find teams matching the search term
      const matchingTeams = await Team.find({
        teamName: searchRegex
      }).select('_id').lean();

      const teamIds = matchingTeams.map(t => t._id);

      // Add OR condition for both userIds and teamIds
      if (userIds.length > 0 || teamIds.length > 0) {
        query.$or = [
          { userId: { $in: userIds } },
          { teamId: { $in: teamIds } }
        ];
      }
    } catch (error) {
      throw new Error(`Search operation failed: ${error.message}`);
    }
  }

  try {
    // Execute query with pagination and populate related fields
    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .populate({
          path: 'userId',
          select: 'fullName email collegeOrUniversity graduationYear skills',
          options: { strictPopulate: false } // Handle missing references gracefully
        })
        .populate({
          path: 'teamId',
          select: 'teamName description leader members',
          options: { strictPopulate: false }
        })
        .populate({
          path: 'participantIds',
          select: 'fullName email',
          options: { strictPopulate: false }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Registration.countDocuments(query)
    ]);

    // Filter out registrations with null references (deleted user/team)
    const validRegistrations = registrations.filter(reg => {
      // If registration requires userId or teamId, ensure they're populated
      // You can adjust this logic based on business requirements
      return reg.userId !== null || reg.teamId !== null;
    });

    return {
      registrations: validRegistrations,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Failed to list registrations: ${error.message}`);
  }
};

/**
 * Automatically transitions hackathon statuses based on the current date.
 * This handles the transitions to 'ongoing' and 'past' that admins are restricted from doing manually.
 */
const syncHackathonStatuses = async () => {
  const now = new Date();

  // 1. upcoming -> ongoing: Find hackathons starting now.
  // Removed $type: 'date' to ensure compatibility with standard Mongoose date casting.
  const hackathonsToStart = await Hackathon.find({
    status: 'upcoming',
    startDate: { $lte: now },
    endDate: { $gt: now }
  });

  // 1b. ongoing -> judging: When the submission deadline has passed but the endDate
  //     has not, the hackathon moves into the judging phase.
  const toJudging = await Hackathon.updateMany(
    {
      status: 'ongoing',
      submissionDeadline: { $lte: now },
      endDate: { $gt: now },
      resultsPublished: false
    },
    { $set: { status: 'judging' } }
  );

  let transitionedToOngoing = 0;

  for (const hackathon of hackathonsToStart) {
    hackathon.status = 'ongoing';
    await hackathon.save();
    transitionedToOngoing++;

    // Fetch all confirmed registrations and all active teams for this hackathon in one shot.
    // We collect team member emails from the Team model itself — not from participantIds —
    // so that every accepted member (including co-founders added after registration) is included.
    const [registrations, teams] = await Promise.all([
      Registration.find({
        hackathonId: hackathon._id,
        status: 'confirmed'
      }).populate('participantIds', 'fullName email').lean(),

      Team.find({
        hackathonId: hackathon._id,
        isActive: true
      })
        .populate('members.userId', 'fullName email')
        .populate('leader', 'fullName email')
        .lean()
    ]);

    // Quick lookup: teamId -> all accepted-member emails (includes the leader)
    const teamMemberEmails = new Map();
    for (const team of teams) {
      const emails = [];
      if (team.leader?.email) emails.push(team.leader.email);
      if (Array.isArray(team.members)) {
        for (const member of team.members) {
          if (member.invitationStatus === 'accepted' && member.userId?.email) {
            emails.push(member.userId.email);
          }
        }
      }
      teamMemberEmails.set(team._id.toString(), emails);
    }

    const notifiedEmails = new Set();

    for (const reg of registrations) {
      const isTeamReg = !!reg.teamId;
      const teamKey = isTeamReg ? reg.teamId.toString() : null;

      // Preferred source: Team model (covers leader + all accepted members, even those
      // added after the registration was created).
      const teamEmails = teamKey ? teamMemberEmails.get(teamKey) || [] : [];

      // Fallback: participantIds still there as a safety net.
      const participantUserIds = reg.participantIds || [];

      for (const participant of participantUserIds) {
        if (participant?.email && !notifiedEmails.has(participant.email)) {
          try {
            await sendEmail(participant.email, 'HACKATHON_DETAILS', {
              fullName: participant.fullName || 'Participant',
              hackathonTitle: hackathon.title,
              problemStatement: hackathon.problemStatement,
              startDate: hackathon.startDate,
              endDate: hackathon.endDate,
              submissionDeadline: hackathon.submissionDeadline,
              rules: hackathon.rules || [],
              judgingCriteria: hackathon.judgingCriteria || [],
              hackathonLink: `/hackathons/${hackathon.slug}`
            });
            notifiedEmails.add(participant.email);
          } catch (emailError) {
            console.error(`[Sync] Failed to notify participant ${participant.email}:`, emailError.message);
          }
        }
      }

      // For team registrations, notify every team member from the Team model
      // so no one is left out just because they were added as a member later.
      if (teamKey && teamEmails.length > 0) {
        for (const email of teamEmails) {
          if (!notifiedEmails.has(email)) {
            // We use the leader's name or a generic fallback since individual
            // member names aren't stored in the Team model's members array here.
            const memberEmail = email;
            try {
              await sendEmail(memberEmail, 'HACKATHON_DETAILS', {
                fullName: 'Participant',
                hackathonTitle: hackathon.title,
                problemStatement: hackathon.problemStatement,
                startDate: hackathon.startDate,
                endDate: hackathon.endDate,
                submissionDeadline: hackathon.submissionDeadline,
                rules: hackathon.rules || [],
                judgingCriteria: hackathon.judgingCriteria || [],
                hackathonLink: `/hackathons/${hackathon.slug}`
              });
              notifiedEmails.add(memberEmail);
            } catch (emailError) {
              console.error(`Failed to notify ${memberEmail} for ${hackathon.title}:`, emailError.message);
            }
          }
        }
      }
    }
    console.log(`[Sync] Hackathon "${hackathon.title}" started. ${notifiedEmails.size} participants notified.`);
  }

  // 2. upcoming/ongoing -> past: Bulk transition when end date has passed.
  const endedResult = await Hackathon.updateMany(
    {
      status: { $in: ['upcoming', 'ongoing', 'judging'] },
      endDate: { $lte: now }
    },
    { $set: { status: 'past' } }
  );

  return {
    transitionedToOngoing,
    transitionedToPast: endedResult.modifiedCount
  };
};

export {
  createHackathon,
  updateHackathon,
  deleteHackathon,
  findHackathonById,
  updateHackathonRuleService,
  listRegistrations,
  syncHackathonStatuses
};
