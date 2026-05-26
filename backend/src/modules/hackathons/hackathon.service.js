/**
  hackathon.service.js
  Contains the core business rules for hackathon.
 */
import Hackathon from '../admin/hackathons/hackathon.model.js';
import Registration from '../registrations/registration.model.js';
import Team from '../teams/team.model.js';

// Statuses where the problem statement must be hidden from non-admin callers
const HIDE_PROBLEM_STATEMENT_FOR = ['upcoming'];

/**
 * Remove problemStatement from the plain object when the hackathon status
 * is one that should keep it private (e.g. "upcoming").
 *
 * Accepts a plain JS object (already lean / toObject-ed) and returns it
 * (mutated in place for efficiency, the caller owns the reference).
 */
function sanitizeHackathon(hackathon) {
  // Handle null / undefined / non-object gracefully
  if (!hackathon || typeof hackathon !== 'object') return hackathon;

  if (HIDE_PROBLEM_STATEMENT_FOR.includes(hackathon.status)) {
    delete hackathon.problemStatement;
  }
  return hackathon;
}

class Hackathonservice {
  // Get all hackathons
  async getAllHackathons() {
    const hackathons = await Hackathon.find().lean();
    
    // Add participant and team counts for each hackathon
    return await Promise.all(hackathons.map(async (hackathon) => {
      const sanitized = sanitizeHackathon(hackathon);
      
      // Count registrations
      const registrations = await Registration.find({ 
        hackathonId: hackathon._id, 
        status: { $ne: 'cancelled' } 
      }).lean();
      
      const uniqueParticipants = new Set();
      let teamsCount = 0;
      
      registrations.forEach(reg => {
        if (reg.mode === 'team') teamsCount++;
        reg.participantIds?.forEach(id => uniqueParticipants.add(id.toString()));
      });
      
      return {
        ...sanitized,
        participantsCount: uniqueParticipants.size,
        teamsCount: teamsCount
      };
    }));
  }

  // Get hackathon by ID
  async getHackathonById(hackathonId) {
    const hackathon = await Hackathon.findById(hackathonId).lean();
    if (!hackathon) return null;
    
    const sanitized = sanitizeHackathon(hackathon);
    
    // Count registrations
    const registrations = await Registration.find({ 
      hackathonId: hackathon._id, 
      status: { $ne: 'cancelled' } 
    }).lean();
    
    const uniqueParticipants = new Set();
    let teamsCount = 0;
    
    registrations.forEach(reg => {
      if (reg.mode === 'team') teamsCount++;
      reg.participantIds?.forEach(id => uniqueParticipants.add(id.toString()));
    });
    
    return {
      ...sanitized,
      participantsCount: uniqueParticipants.size,
      teamsCount: teamsCount
    };
  }
};

const hackathonService = new Hackathonservice();
export default hackathonService;