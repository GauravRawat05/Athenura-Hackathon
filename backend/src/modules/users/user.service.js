/**
   user.service.js
   Contains the core business rules for user.
 */
import fs from "fs"
import UserRepository from "./user.repository.js"
import UserUtils from "./user.utils.js"
import resultRepository from "../results/result.repository.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js"
import ApiError from "../../libs/apiError.js"
import { PROFILE_PHOTO_MAX_FILE_SIZE, PROFILE_PHOTO_UPLOAD_FOLDER } from "../../constants/user.constants.js"

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
      'resumeLink'
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
