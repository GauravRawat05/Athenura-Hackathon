// hackathon.repository.js
import Hackathon  from '../admin/hackathons/hackathon.model.js';

class HackathonRepository {
    async findById(id) {
        return await Hackathon.findById(id);
    }

    // Add other hackathon-related repository methods as needed
}

const hackathonRepository = new HackathonRepository();

export default hackathonRepository;
