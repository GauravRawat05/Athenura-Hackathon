/**
  notificationTypes.js
  Notification event type constants used for in-app and email notification flows.
  Each constant represents a specific event that triggers a notification.
  */

// Email notification types
const EMAIL_TYPES = {
  // Authentication related
  VERIFY_EMAIL: 'verify_email',
  RESEND_OTP: 'resend_otp',
  RESET_PASSWORD: 'reset_password',
  
  // Registration related
  REGISTRATION_CONFIRMATION: 'registration_confirmation',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  PAYMENT_FAILED: 'payment_failed',
  
  // Team invitation related
  TEAM_INVITATION: 'team_invitation',
  INVITATION_ACCEPTED: 'invitation_accepted',
  INVITATION_DECLINED: 'invitation_declined',
  
  // Certificate related
  CERTIFICATE_READY: 'certificate_ready',
  
  // General
  HACKATHON_REMINDER: 'hackathon_reminder',
  RESULTS_PUBLISHED: 'results_published'
}

// All email type values as an array for validation
const EMAIL_TYPE_VALUES = Object.values(EMAIL_TYPES)

export { EMAIL_TYPES, EMAIL_TYPE_VALUES }