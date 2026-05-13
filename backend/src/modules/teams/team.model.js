/**
  team.model.js
  Defines the Mongoose schema and model for team records.
 */
import mongoose from "mongoose";
import { teamRoles, teamRolesEnums } from "./team.constants.js";

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: teamRolesEnums,
    default: teamRoles.MEMBER
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  invitationStatus: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "accepted"  // leader is auto-accepted; direct additions are accepted
  }
});

const teamSchema = new mongoose.Schema(
  {
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: [true, "Hackathon ID is required"]
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [3, "Team name must be at least 3 characters"],
      maxlength: [50, "Team name cannot exceed 50 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team leader is required"]
    },
    members: [memberSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
teamSchema.index({ hackathonId: 1, "members.userId": 1 });
teamSchema.index({ leader: 1 });

const Team = mongoose.model("Team", teamSchema);
export default Team;
