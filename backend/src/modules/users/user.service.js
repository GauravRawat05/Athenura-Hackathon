/**
   user.service.js
   Contains the core business rules for user.
 */
import fs from "fs"
import UserRepository from "./user.repository.js"
import UserUtils from "./user.utils.js"
import resultRepository from "../results/result.repository.js"
import registrationRepository from "../registrations/registration.repository.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js"
import ApiError from "../../libs/apiError.js"
import { PROFILE_PHOTO_MAX_FILE_SIZE, PROFILE_PHOTO_UPLOAD_FOLDER, REGISTRATION_STATUSES } from "../../constants/user.constants.js"

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
    this.userUtils = new UserUtils()
  }

  async getProfileService(userId) {
    const excludeFields = this.userUtils.getSensitiveFieldsToExclude()
    const user = await this.userRepository.findUserById(userId, excludeFields)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  async updateProfileService(userId, updateData, profilePhotoFile) {
    const allowedFields = [
      'fullName',
      'phone',
      'dateOfBirth',
      'collegeOrUniversity',
      'graduationYear',
      'skills',
      'resumeLink',
      'gender'
    ]

    const filteredData = {}
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    }

    // Normalize skills if provided
    if (filteredData.skills) {
      if (typeof filteredData.skills === 'string') {
        filteredData.skills = filteredData.skills.split(',').map(skill => skill.trim())
      }
    }

    // Handle profile photo upload if a file was provided
    if (profilePhotoFile) {
      // Step 1 — Load the current user so we can check for an existing photo
      const currentUser = await this.userRepository.findUserById(userId, "profilePhoto")

      let uploadedPhoto

      // Step 2 — Upload the new photo first
      try {
        uploadedPhoto = await this._uploadProfilePhoto(profilePhotoFile)
      } catch (uploadErr) {
        // Same error handling as the original _uploadProfilePhoto
        throw new ApiError(
          500,
          "Failed to upload profile photo. Please try again later."
        )
      }

      // Step 3 — Merge photo fields into the update doc
      filteredData["profilePhoto.url"] = uploadedPhoto.url
      filteredData["profilePhoto.publicId"] = uploadedPhoto.publicId

      // Step 4 — Update the user in the database
      // This whole block has rollback safety: if the DB write fails the
      // newly uploaded Cloudinary photo is deleted so it doesn't become orphaned.
      let user
      try {
        user = await this.userRepository.updateUserById(userId, filteredData)

        if (!user) {
          throw new Error("User not found")
        }

        // Step 5 — Only now delete the old photo from Cloudinary if it exists.
        // Wrapped in try-catch so a transient Cloudinary failure doesn't bubble up
        // and break the whole API response — the profile was already saved in the DB.
        if (currentUser?.profilePhoto?.publicId) {
          try {
            await deleteFromCloudinary(currentUser.profilePhoto.publicId)
          } catch (cleanupErr) {
            console.error(
              "Failed to delete old profile photo from Cloudinary after successful update:",
              cleanupErr
            )
          }
        }

        // Step 6 — Return the updated user
        const excludeFields = this.userUtils.getSensitiveFieldsToExclude()
        return await this.userRepository.findUserById(userId, excludeFields)

      } catch (dbErr) {
        // The new photo was uploaded to Cloudinary but the DB write failed.
        // Delete it so there is no orphan sitting in Cloudinary with no DB reference.
        if (uploadedPhoto?.publicId) {
          try {
            await deleteFromCloudinary(uploadedPhoto.publicId)
          } catch (cleanupErr) {
            console.error(
              "Failed to clean up orphaned profile photo from Cloudinary after DB error:",
              cleanupErr
            )
          }
        }
        throw dbErr
      }
    }

    // If no photo file was provided, proceed with normal update
    const user = await this.userRepository.updateUserById(userId, filteredData)

    if (!user) {
      throw new Error("User not found")
    }

    const excludeFields = this.userUtils.getSensitiveFieldsToExclude()
    return await this.userRepository.findUserById(userId, excludeFields)
  }

  async getMyResultsService(userId) {
    const results = await resultRepository.findByUserId(userId);
    return results;
  }

  /**
   * Get dashboard statistics for the authenticated user.
   * Returns aggregated stats: hackathons joined, submissions made,
   * best rank, and total certificates earned.
   */
  async getDashboardStatsService(userId) {
    // Get confirmed registrations count (hackathons joined)
    const registrations = await registrationRepository.findUserRegistrationsWithDetails(
      userId,
      [],
      { registrationStatus: REGISTRATION_STATUSES.CONFIRMED }
    );
    const hackathonsJoined = registrations.length;

    // Get submissions count
    const Submission = (await import("../submissions/submission.model.js")).default;
    const submissionsCount = await Submission.countDocuments({ userId });

    // Get best rank from published results
    const bestRankResult = await resultRepository.findBestRankByUserId(userId);
    const bestRank = bestRankResult?.rank || null;

    // Get certificates count (completed only)
    const Certificate = (await import("../certificates/certificate.model.js")).default;
    const certificatesCount = await Certificate.countDocuments({
      userId,
      generationStatus: "COMPLETED",
      isDeleted: { $ne: true },
      isRevoked: { $ne: true }
    });

    return {
      hackathonsJoined,
      submissionsMade: submissionsCount,
      bestRank,
      certificates: certificatesCount
    };
  }

  /**
   * Get recent activity for the authenticated user.
   * Returns a timeline of user actions including registrations,
   * submissions, results, and certificates.
   */
  async getUserActivityService(userId, limit = 10) {
    const activities = [];

    // Import models
    const Submission = (await import("../submissions/submission.model.js")).default;
    const Certificate = (await import("../certificates/certificate.model.js")).default;
    const Notification = (await import("../notifications/notification.model.js")).default;

    // Get recent registrations
    const recentRegistrations = await registrationRepository.findUserRegistrationsWithDetails(
      userId,
      [],
      { registrationStatus: REGISTRATION_STATUSES.CONFIRMED }
    );
    for (const reg of recentRegistrations.slice(0, 5)) {
      const hackathon = reg.hackathonId;
      if (hackathon) {
        activities.push({
          id: `reg-${reg._id}`,
          type: "register",
          text: `Registered for ${hackathon.title}`,
          time: reg.confirmedAt || reg.createdAt,
          createdAt: reg.confirmedAt || reg.createdAt
        });
      }
    }

    // Get submission activities
    const submissions = await Submission.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate("hackathonId", "title");
    for (const sub of submissions) {
      if (sub.hackathonId) {
        activities.push({
          id: `sub-${sub._id}`,
          type: "submit",
          text: `Project submitted for ${sub.hackathonId.title}`,
          time: sub.submittedAt || sub.createdAt,
          createdAt: sub.submittedAt || sub.createdAt
        });
      }
    }

    // Get certificates earned
    const certificates = await Certificate.find({
      userId,
      generationStatus: "COMPLETED",
      isDeleted: { $ne: true },
      isRevoked: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("hackathonId", "title");
    for (const cert of certificates) {
      if (cert.hackathonId) {
        activities.push({
          id: `cert-${cert._id}`,
          type: "cert",
          text: `Certificate downloaded — ${cert.hackathonId.title}`,
          time: cert.updatedAt || cert.createdAt,
          createdAt: cert.updatedAt || cert.createdAt
        });
      }
    }

    // Get results achieved
    const results = await resultRepository.findByUserId(userId);
    for (const res of results.slice(0, 5)) {
      if (res.hackathonId) {
        activities.push({
          id: `res-${res._id}`,
          type: "rank",
          text: `Rank #${res.rank} achieved in ${res.hackathonId.title}`,
          time: res.date || res.createdAt,
          createdAt: res.date || res.createdAt
        });
      }
    }

    // Sort by createdAt descending and limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return activities.slice(0, limit);
  }

  /**
   * Get active/upcoming hackathons the user is registered for.
   * Returns hackathon details enriched with submission status.
   */
  async getActiveHackathonsService(userId, limit = 6) {
    const Submission = (await import("../submissions/submission.model.js")).default;

    // Get user's team IDs
    const teamIds = await registrationRepository.getTeamIdsByUser(userId);

    // Get confirmed registrations for active/upcoming hackathons
    const registrations = await registrationRepository.findUserRegistrationsWithDetails(
      userId,
      teamIds,
      { registrationStatus: REGISTRATION_STATUSES.CONFIRMED }
    );

    // Filter to only ongoing/upcoming hackathons and enrich with submission status
    const activeHackathons = [];
    for (const reg of registrations) {
      const hackathon = reg.hackathonId;
      if (!hackathon) continue;

      // Only include ongoing and upcoming hackathons
      if (!['ongoing', 'upcoming'].includes(hackathon.status)) continue;

      // Check if user has submitted
      const submission = await Submission.findOne({
        hackathonId: hackathon._id,
        userId
      }).select('status submittedAt').lean();

      const hasSubmitted = submission?.status === 'Submitted';

      activeHackathons.push({
        _id: hackathon._id,
        name: hackathon.title,
        slug: hackathon.slug,
        status: hackathon.status,
        deadline: hackathon.submissionDeadline,
        domain: hackathon.technologyDomains?.[0] || 'General',
        prize: `${hackathon.currency === 'INR' ? '₹' : '$'}${hackathon.prizePool?.toLocaleString() || '0'}`,
        submitted: hasSubmitted,
        registrationId: reg._id,
        startDate: hackathon.startDate,
        endDate: hackathon.endDate
      });
    }

    // Sort: ongoing first, then by deadline ascending
    activeHackathons.sort((a, b) => {
      if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
      if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
      return new Date(a.deadline) - new Date(b.deadline);
    });

    return activeHackathons.slice(0, limit);
  }

  /**
   * Get user's recent certificates for the dashboard.
   */
  async getUserCertificatesService(userId, limit = 6) {
    const Certificate = (await import("../certificates/certificate.model.js")).default;

    const certificates = await Certificate.find({
      userId,
      generationStatus: "COMPLETED",
      isDeleted: { $ne: true },
      isRevoked: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('hackathonId', 'title')
      .lean();

    return certificates.map(cert => ({
      _id: cert._id,
      hackathon: cert.hackathonId?.title || 'Unknown Hackathon',
      type: cert.certificateType === 'winner' ? 'Rank Certificate'
           : cert.certificateType === 'finalist' ? 'Finalist'
           : 'Participation',
      rank: cert.rank ? `#${cert.rank}` : null,
      date: new Date(cert.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      certificateUrl: cert.certificateUrl,
      certificateCode: cert.certificateCode
    }));
  }

  /**
   * Upload a profile photo to Cloudinary with WebP conversion.
   * Enforces a maximum file size of 2 MB.
   * @param {Object} file - Formidable parsed file object
   * @returns {Promise<{url: string, publicId: string}>}
   * @throws {ApiError} if every check or Cloudinary upload fails
   */
  async _uploadProfilePhoto(file) {
    if (!file || !file.filepath) {
      throw new ApiError(400, "Invalid file")
    }

    // — Enforce 2 MB file-size limit before touching Cloudinary
    try {
      const stat = await fs.promises.stat(file.filepath)
      if (stat.size > PROFILE_PHOTO_MAX_FILE_SIZE) {
        throw new ApiError(
          400,
          `Profile photo must not exceed ${PROFILE_PHOTO_MAX_FILE_SIZE / (1024 * 1024)} MB`
        )
      }
    } catch (statErr) {
      if (statErr instanceof ApiError) throw statErr
      throw new ApiError(400, "Failed to read profile photo")
    }

     // — Upload to Cloudinary as WebP
     try {
       const result = await uploadToCloudinary(file.filepath, {
         folder: PROFILE_PHOTO_UPLOAD_FOLDER,
         fetch_format: "webp",
         quality: "auto",
         resource_type: "image"
       })

       return {
         url: result.secure_url,
         publicId: result.public_id
       }
     } catch (uploadErr) {
       throw new ApiError(
         500,
         "Failed to upload profile photo. Please try again later."
       )
     } finally {
       // Always clean up the temporary file from disk,
       // whether the upload succeeded or failed.
       try {
         await fs.promises.unlink(file.filepath)
       } catch { /* temp file cleanup — best-effort */ }
     }
  }
}

const userService = new UserService()
export default userService
