/**
  result.service.js
  Contains the core business rules for result; this is where workflow decisions and validations that depend on data live.
 */
import Result from './result.model.js';

class ResultService {
  async getPublishedResults(hackathonId) {
    const results = await Result.find({ hackathonId, isPublished: true })
      .populate('userId', 'fullName email')
      .populate('teamId', 'teamName')
      .populate('submissionId', 'title')
      .sort({ rank: 1 })
      .lean();
      
    return results;
  }
}

export default new ResultService();
