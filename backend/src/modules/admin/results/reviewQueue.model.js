/**
  reviewQueue.model.js
  AdminReviewQueue schema — acts as the central buffer
  for all judge submissions before they are drafted into results.
 */
import mongoose from "mongoose";

const reviewQueueSchema = new mongoose.Schema(
  {
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true
    },
    judgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    scoreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Score",
      required: true
    },
    scoreRecommendation: {
      criterionScores: [
        {
          criterionName: {
            type: String,
            required: true
          },
          score: {
            type: Number,
            required: true,
            min: 0,
            max: 10
          },
          weight: {
            type: Number,
            required: true
          }
        }
      ],
      totalScore: {
        type: Number,
        required: true
      },
      feedback: {
        type: String,
        trim: true,
        maxLength: 2000
      }
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true
    },
    adminComment: {
      type: String,
      trim: true,
      maxLength: 2000
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    resolvedAt: {
      type: Date
    },
    resolutionVersion: {
      type: Number,
      default: 0
    },
    resolvedQueueVersion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

reviewQueueSchema.pre('save', function (next) {
  if (this.isNew) {
    // initialize versions for optimistic resolve
    this.resolutionVersion = this.resolutionVersion ?? 0;
    this.resolvedQueueVersion = this.resolvedQueueVersion ?? 0;
  }
  next();
});

// Prevent duplicate queue entries for the same judge + submission
reviewQueueSchema.index(
  { judgeId: 1, submissionId: 1 },
  { unique: true }
);
reviewQueueSchema.index({ hackathonId: 1, judgeId: 1, submissionId: 1, status: 1 });
reviewQueueSchema.index({ hackathonId: 1, status: 1 });
reviewQueueSchema.index({ submissionId: 1 });

const AdminReviewQueue =
  mongoose.models.AdminReviewQueue ||
  mongoose.model("AdminReviewQueue", reviewQueueSchema);

export default AdminReviewQueue;
