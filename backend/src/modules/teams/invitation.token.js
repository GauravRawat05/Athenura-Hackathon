/**
  invitation.token.js
  Generates and verifies secure tokens for team invitations.
 */
import crypto from "crypto";

class InvitationToken {
  /**
   * Generate a secure random token for invitation
   */
  generateToken() {
    const unhashedToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(unhashedToken)
      .digest("hex");

    return {
      unhashedToken,
      hashedToken
    };
  }

  /**
   * Hash a token for comparison
   */
  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

const invitationToken = new InvitationToken();
export default invitationToken;
