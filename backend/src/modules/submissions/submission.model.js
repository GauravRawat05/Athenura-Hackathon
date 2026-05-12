/**
  submission.model.js
  Defines the Mongoose schema and model for submission records stored in MongoDB.
 */
import mongoose from "mongoose"
import { submissionStatusEnums, submissionStatus, assetTypesEnums } from "./submission.constants.js"

const assetSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String
  },
  type: {
    type: String,
    enum: assetTypesEnums
  },
  fileName: {
    type: String
  }
}, { _id: false })

const submissionSchema = new mongoose.Schema(
  {
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: [true, "Hackathon ID is required"]
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"]
    },
    techStack: {
      type: [String],
      default: []
    },
    repoUrl: {
      type: String
    },
    demoUrl: {
      type: String
    },
    assets: {
      type: [assetSchema],
      default: []
    },
    status: {
      type: String,
      enum: submissionStatusEnums,
      default: submissionStatus.DRAFT
    },
    version: {
      type: Number,
      default: 1
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// One submission per user per hackathon
submissionSchema.index({ hackathonId: 1, userId: 1 }, { unique: true })
submissionSchema.index({ hackathonId: 1, teamId: 1 })

const Submission = mongoose.model("Submission", submissionSchema)
export default Submission
