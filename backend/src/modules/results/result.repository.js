import Result from './result.model.js';

class ResultRepository {
  async bulkCreate(resultsData) {
    return Result.insertMany(resultsData);
  }

  async findByHackathonId(hackathonId) {
    return Result.find({ hackathonId }).lean();
  }
  
  async findByUserId(userId) {
    return Result.find({ userId, isPublished: true }).populate('hackathonId', 'title slug').lean();
  }

  async deleteByHackathonId(hackathonId) {
    return Result.deleteMany({ hackathonId });
  }
}

export default new ResultRepository();
