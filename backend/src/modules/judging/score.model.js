import mongoose from "mongoose";
import { scoreStatusEnums } from "./judging.constants.js";

const scoreSchema = new mongoose.Schema(
  {
    judgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true
    },
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
      default: 0
    },
    feedback: {
      type: String,
      trim: true,
      maxLength: 2000
    },
    status: {
      type: String,
      enum: scoreStatusEnums,
      default: scoreStatusEnums[0] // 'submitted'
    }
  },
  {
    timestamps: true
  }
);

// One score per judge per submission
scoreSchema.index({ judgeId: 1, submissionId: 1 }, { unique: true });
scoreSchema.index({ hackathonId: 1, submissionId: 1 });

// Pre-save hook to calculate totalScore
scoreSchema.pre("save", function (next) {
  if (this.criterionScores && this.criterionScores.length > 0) {
    let totalScore = 0;
    this.criterionScores.forEach((criterion) => {
      totalScore += criterion.score * criterion.weight;
    });
    // Assuming weights might sum to >1, we might need to normalize, but according to plan:
    // "totalScore = sum of (score * weight) for each criterionScore"
    this.totalScore = totalScore;
  } else {
    this.totalScore = 0;
  }
  next();
});

const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);
export default Score;
