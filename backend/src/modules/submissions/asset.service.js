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
import { deleteFromCloudinary } from "../../config/cloudinary.js";

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

    // 5. Upload assets — done BEFORE committing the DB transaction so we can
    //    clean them up safely here without leaving orphaned Cloudinary files.
    const newAssets = await uploadService.parseAndUpload(req);

    // 6. Enforce max assets limit
    if (submission.assets.length + newAssets.length > MAX_ASSETS_PER_SUBMISSION) {
      // Uploads succeeded but DB write will fail — clean up the orphaned files now
      const uploadedPublicIds = newAssets
        .filter(a => a?.publicId)
        .map(a => a.publicId);

      await Promise.all(
        uploadedPublicIds.map(publicId =>
          deleteFromCloudinary(publicId).catch(err =>
            console.error(
              "Failed to clean up orphaned asset from Cloudinary after limit breach:",
              err
            )
          )
        )
      );

      throw new ApiError(400, `Cannot exceed maximum of ${MAX_ASSETS_PER_SUBMISSION} assets per submission`);
    }

    // 7. Append assets
    submission.assets.push(...newAssets);

    submission.status = "Submitted";
    submission.submittedAt = new Date();

    // 8. Save updates
    await submissionRepository.saveSubmission(submission, { validateBeforeSave: true, session });

    await session.commitTransaction();
    return submission;
    } catch (error) {
      // If the error occurred AFTER the Cloudinary upload but BEFORE (or during)
      // commitTransaction, the new assets are in Cloudinary with no DB reference.
      // Attempt to delete every uploaded file to prevent orphan buildup.
      if (newAssets?.length) {
        const uploadedPublicIds = newAssets
          .filter(a => a?.publicId)
          .map(a => a.publicId);

        await Promise.all(
          uploadedPublicIds.map(publicId =>
            deleteFromCloudinary(publicId).catch(cleanupErr =>
              console.error(
                "Failed to clean up orphaned asset from Cloudinary after DB error:",
                cleanupErr
              )
            )
          )
        )
      }

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

const assetService = new AssetService();
export default assetService;
