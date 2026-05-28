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

export const REGISTRATION_STATUSES = {
    PENDING_PAYMENT: 'PENDING_PAYMENT',
    CONFIRMED: 'CONFIRMED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
};

export const PAYMENT_STATUSES = {
    CREATED: 'CREATED',
    PENDING: 'PENDING', // Razorpay status might be 'authorized' before 'captured'
    COMPLETED: 'COMPLETED', // Payment 'captured'
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
    EXPIRED: 'EXPIRED', // From cleanup job
};

