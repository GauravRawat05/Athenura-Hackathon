/**
 * user.constants.js
 * Shared constants for the user module so that nothing
 * is duplicated across service and route files.
 */

/** Maximum allowed size for a profile photo upload (in bytes) */
export const PROFILE_PHOTO_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

/** Default upload destination folder used by the cloudinary upload helper */
export const PROFILE_PHOTO_UPLOAD_FOLDER = "hackathon-profile-photos"

/** MIME types that are allowed for profile photo uploads */
export const ALLOWED_PROFILE_PHOTO_MIMETYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
