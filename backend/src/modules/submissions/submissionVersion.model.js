/**
  submissionVersion.model.js
  Stores immutable snapshots of older submission versions so participants can resubmit without losing history.
 */
import mongoose from "mongoose"
import { assetTypesEnums } from "./submission.constants.js"

const versionAssetSchema = new mongoose.Schema({
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

const submissionVersionSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: [true, "Submission ID is required"]
    },
    version: {
      type: Number,
      required: [true, "Version number is required"]
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
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
      type: [versionAssetSchema],
      default: []
    },
    snapshotAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

submissionVersionSchema.index({ submissionId: 1, version: -1 })

const SubmissionVersion = mongoose.model("SubmissionVersion", submissionVersionSchema)
export default SubmissionVersion
