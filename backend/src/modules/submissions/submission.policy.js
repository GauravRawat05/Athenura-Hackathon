/**
  submission.policy.js
  Checks authorization and object-level access rules for submission, such as ownership, role, and state checks.
 */

class SubmissionPolicy {

  /**
   * Check if user owns this submission
   */
  isOwner(submission, userId) {
    return submission.userId.toString() === userId.toString()
  }

  /**
   * Check if user can access submission version history
   * Owners, admins, and judges can view versions
   */
  canAccessVersions(submission, user) {
    if (this.isOwner(submission, user._id)) return true
    if (user.role === "Admin") return true
    if (user.role === "Judge") return true
    return false
  }
}

const submissionPolicy = new SubmissionPolicy()
export default submissionPolicy
