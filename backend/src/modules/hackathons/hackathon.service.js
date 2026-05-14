/**
  hackathon.service.js
  Contains the core business rules for hackathon.
 */
import Hackathon from '../admin/hackathons/hackathon.model.js';

class Hackathonservice {
  // Get all hackathons
  async getAllHackathons() {
    return await Hackathon.find();
  }

  // Get hackathon by ID
  async getHackathonById(hackathonId) {
    return await Hackathon.findById(hackathonId);
  }
};

const hackathonService = new Hackathonservice();
export default hackathonService;