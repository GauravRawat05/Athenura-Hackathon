import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
    judgingId: { type: mongoose.Schema.Types.ObjectId, ref: "Judging" },
    awardCategory: { type: String, required: true },
    award: { type: String, required: true },
    certificateType: { type: String },
    isWinner: { type: Boolean, default: false },
    rank: { type: Number },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    certificateUrl: { type: String },
    certificateStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    errorMessage: { type: String }
  },
  {
    timestamps: true
  }
);

// Always stamp creation date so immutable snapshots carry a consistent timestamp.
resultSchema.pre('save', function (next) {
  if (!this.date) this.date = new Date();
  next();
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
