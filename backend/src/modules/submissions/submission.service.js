/**
  submission.service.js
  Contains the core business rules for submission; this is where workflow decisions and validations that depend on data live.
 */
import mongoose from "mongoose"
import submissionRepository from "./submission.repository.js"
import submissionPolicy from "./submission.policy.js"
import ApiError from "../../libs/apiError.js"
import Hackathon from "../admin/hackathons/hackathon.model.js"
import Team from "../teams/team.model.js"
import Registration from "../registrations/registration.model.js"

class SubmissionService {

  /**
   * Create a new submission for a hackathon
   */
  async createSubmission(hackathonId, userId, data) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // 1. Find hackathon
      const hackathon = await Hackathon.findById(hackathonId).session(session)
      if (!hackathon) {
        throw new ApiError(404, "Hackathon not found")
      }

      // 2. Check submission deadline
      if (hackathon.submissionDeadline && new Date(hackathon.submissionDeadline) < Date.now()) {
        throw new ApiError(400, "Submission deadline has passed")
      }

      // 3. Check for existing submission
      const existingSubmission = await submissionRepository.findSubmissionByHackathonAndUser(hackathonId, userId)
      if (existingSubmission) {
        throw new ApiError(409, "You already have a submission for this hackathon")
      }

      // 3.5 Check if user/team is registered and confirmed
      const registration = await Registration.findOne({
        hackathonId,
        participantIds: userId,
        status: "confirmed"
      }).session(session)
      if (!registration) {
        throw new ApiError(403, "You must have a confirmed registration to submit a project")
      }

      // 4. Check if user is in a team for this hackathon
      let teamId = null
      const team = await Team.findOne({
        hackathonId,
        "members.userId": userId
      }).session(session)

      if (team) {
        // Enforce: Only team leader can make the submission
        if (team.leader.toString() !== userId.toString()) {
          throw new ApiError(403, "Only the team leader can create the submission")
        }
        teamId = team._id
      }

      // 5. Create submission
      const submission = await submissionRepository.createSubmission([{
        hackathonId,
        userId,
        teamId,
        ...data,
        status: "Draft"
      }], { session })

      await session.commitTransaction()
      return Array.isArray(submission) ? submission[0] : submission
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  /**
   * Update an existing submission (creates a version snapshot first)
   */
  async updateSubmission(submissionId, userId, data) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
    // 1. Find submission
    const submission = await submissionRepository.findSubmissionById(submissionId, { session })
    if (!submission) {
      throw new ApiError(404, "Submission not found")
    }

    // 2. Check ownership
    // If team submission, only leader can update. If solo, owner checks.
    if (submission.teamId) {
      const team = await Team.findById(submission.teamId).session(session)
      if (!team || team.leader.toString() !== userId.toString()) {
        throw new ApiError(403, "Only the team leader can update this submission")
      }
    } else if (!submissionPolicy.isOwner(submission, userId)) {
      throw new ApiError(403, "You are not authorized to update this submission")
    }

    // 3. Check if user/team is still registered and confirmed
    const registration = await Registration.findOne({
      hackathonId: submission.hackathonId,
      participantIds: userId,
      status: "confirmed"
    }).session(session)

    if (!registration) {
      throw new ApiError(403, "You must have a confirmed registration to update this project")
    }

    const hackathon = await Hackathon.findById(submission.hackathonId).session(session)
    if (hackathon && hackathon.submissionDeadline && new Date(hackathon.submissionDeadline) < Date.now()) {
      throw new ApiError(400, "Submission deadline has passed, cannot update")
    }

    // 4. Create version snapshot BEFORE updating
    await submissionRepository.createVersion({
      submissionId: submission._id,
      version: submission.version,
      title: submission.title,
      description: submission.description,
      techStack: submission.techStack,
      repoUrl: submission.repoUrl,
      demoUrl: submission.demoUrl,
      assets: submission.assets
    }, { session })

    // 5. Apply updates
    if (data.title) submission.title = data.title
    if (data.description) submission.description = data.description
    if (data.techStack) submission.techStack = data.techStack
    if (data.repoUrl !== undefined) submission.repoUrl = data.repoUrl
    if (data.demoUrl !== undefined) submission.demoUrl = data.demoUrl

    // Maintain application-level version but sync with Mongoose __v for OCC
    submission.version = (submission.__v || 0) + 1
    submission.status = "Submitted"
    submission.submittedAt = new Date()

    // 6. Save
    await submissionRepository.saveSubmission(submission, { validateBeforeSave: true, session })

    await session.commitTransaction()
    return submission
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  /**
   * Get current user's submission for a hackathon
   */
  async getMySubmission(hackathonId, userId) {
    const submission = await submissionRepository.findSubmissionByHackathonAndUser(hackathonId, userId)
    if (!submission) {
      throw new ApiError(404, "No submission found for this hackathon")
    }
    return submission
  }

  /**
   * Get version history for a submission
   */
  async getVersions(submissionId, user) {
    // 1. Find submission
    const submission = await submissionRepository.findSubmissionById(submissionId)
    if (!submission) {
      throw new ApiError(404, "Submission not found")
    }

    // 2. Check access
    if (!submissionPolicy.canAccessVersions(submission, user)) {
      throw new ApiError(403, "You are not authorized to view version history")
    }

    // 3. Get versions
    const versions = await submissionRepository.findVersionsBySubmission(submissionId)
    return versions
  }
}

const submissionService = new SubmissionService()
export default submissionService
