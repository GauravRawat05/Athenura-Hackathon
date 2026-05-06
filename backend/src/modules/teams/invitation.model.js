/**
  invitation.model.js
  Defines the Mongoose schema and model for team invitations.
 */
import mongoose from "mongoose";
import { invitationStatus, invitationStatusEnums } from "./team.constants.js";

const invitationSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team ID is required"]
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Inviter user ID is required"]
    },
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Invited user ID is required"]
    },
    invitedEmail: {
      type: String,
      required: [true, "Invited email is required"],
      lowercase: true
    },
    token: {
      type: String,
      required: [true, "Invitation token is required"],
      unique: true
    },
    status: {
      type: String,
      enum: invitationStatusEnums,
      default: invitationStatus.PENDING
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"]
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
invitationSchema.index({ token: 1 });
invitationSchema.index({ teamId: 1, invitedUserId: 1 });
invitationSchema.index({ invitedEmail: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TeamInvitation = mongoose.model("TeamInvitation", invitationSchema);
export default TeamInvitation;
