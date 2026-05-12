/**
  submission.repository.js
  Encapsulates database reads/writes for submission so query logic stays out of controllers and services.
 */
import Submission from "./submission.model.js"
import SubmissionVersion from "./submissionVersion.model.js"

class SubmissionRepository {

  async createSubmission(data) {
    return await Submission.create(data)
  }

  async findSubmissionById(id) {
    return await Submission.findById(id)
  }

  async findSubmissionByHackathonAndUser(hackathonId, userId) {
    return await Submission.findOne({ hackathonId, userId })
  }

  async findSubmissionsByHackathon(hackathonId) {
    return await Submission.find({ hackathonId })
      .populate("userId", "fullName email")
      .populate("teamId", "teamName")
  }

  async updateSubmission(id, data) {
    return await Submission.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })
  }

  async saveSubmission(submission, options = {}) {
    return await submission.save(options)
  }

  async createVersion(data) {
    return await SubmissionVersion.create(data)
  }

  async findVersionsBySubmission(submissionId) {
    return await SubmissionVersion.find({ submissionId }).sort({ version: -1 })
  }
}

const submissionRepository = new SubmissionRepository()
export default submissionRepository
