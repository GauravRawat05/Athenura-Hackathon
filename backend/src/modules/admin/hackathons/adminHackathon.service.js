import Hackathon from './hackathon.model.js'; // Corrected filename

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

export {
  createHackathon,
  updateHackathon,
  deleteHackathon,
  findHackathonById,
  updateHackathonRuleService,
};
