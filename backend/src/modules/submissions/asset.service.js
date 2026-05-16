/**
  asset.service.js
  Handles attaching and detaching assets to/from submissions.
 */

import mongoose from "mongoose";
import submissionRepository from "./submission.repository.js";
import submissionPolicy from "./submission.policy.js";
import uploadService from "./upload.service.js";
import Team from "../teams/team.model.js";
import Hackathon from "../admin/hackathons/hackathon.model.js";
import Registration from "../registrations/registration.model.js";
import ApiError from "../../libs/apiError.js";
import { MAX_ASSETS_PER_SUBMISSION } from "./submission.constants.js";

class AssetService {
  async addAssets(submissionId, userId, req) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
    // 1. Find submission
    const submission = await submissionRepository.findSubmissionById(submissionId, { session });
    if (!submission) {
      throw new ApiError(404, "Submission not found");
    }

    // 2. Check ownership
    if (submission.teamId) {
      const team = await Team.findById(submission.teamId).session(session);
      if (!team || team.leader.toString() !== userId.toString()) {
        throw new ApiError(403, "Only the team leader can add assets to this submission");
      }
    } else if (!submissionPolicy.isOwner(submission, userId)) {
      throw new ApiError(403, "You are not authorized to add assets to this submission");
    }

    // 3. Check registration status
    const registration = await Registration.findOne({
      hackathonId: submission.hackathonId,
      participantIds: userId,
      status: "confirmed"
    }).session(session);
    if (!registration) {
      throw new ApiError(403, "You must have a confirmed registration to add assets");
    }

    // 4. Check submission deadline
    const hackathon = await Hackathon.findById(submission.hackathonId).session(session);
    if (hackathon && hackathon.submissionDeadline && new Date(hackathon.submissionDeadline) < Date.now()) {
      throw new ApiError(400, "Submission deadline has passed, cannot add assets");
    }

    // 3. Upload assets
    const newAssets = await uploadService.parseAndUpload(req);

    // 4. Enforce max assets limit
    if (submission.assets.length + newAssets.length > MAX_ASSETS_PER_SUBMISSION) {
      throw new ApiError(400, `Cannot exceed maximum of ${MAX_ASSETS_PER_SUBMISSION} assets per submission`);
    }

    // 5. We update version when assets are added as this is a modification to the submission
    // Create snapshot BEFORE mutating
    const versionPromise = submissionRepository.createVersion({
      submissionId: submission._id,
      version: submission.version,
      title: submission.title,
      description: submission.description,
      techStack: submission.techStack,
      repoUrl: submission.repoUrl,
      demoUrl: submission.demoUrl,
      assets: submission.assets
    }, { session });

    // 6. Append assets and save
    submission.assets.push(...newAssets);

    submission.version = (submission.__v || 0) + 1;
    submission.status = "Submitted";
    submission.submittedAt = new Date();

    await Promise.all([
      versionPromise,
      submissionRepository.saveSubmission(submission, { validateBeforeSave: true, session })
    ]);

    await session.commitTransaction();
    return submission;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

const assetService = new AssetService();
export default assetService;
