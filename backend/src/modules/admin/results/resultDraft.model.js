/**
  resultDraft.model.js
  ResultDraft — intermediate drafting layer that stores participant
  snapshots (Team/Solo details captured at time of win) for immutability.
  Treated as a transient record; cleared after transactional publish.
 */
import mongoose from "mongoose";

const resultDraftSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },
    // Participant snapshot — captured at the moment of drafting
    // so results remain immutable even if the user later deletes their account or changes their profile photo.
    participantSnapshot: {
      fullName: { type: String },
      email: { type: String },
      photoUrl: { type: String },
      teamName: { type: String },
      collegeOrUniversity: { type: String },
      mode: { type: String, enum: ["solo", "team"] }
    },
    rank: {
      type: Number,
      required: true,
      min: 1
    },
    score: {
      type: Number,
      required: true
    },
    awardCategory: {
      type: String,
      required: true
    },
    award: {
      type: String,
      required: true
    },
    isWinner: {
      type: Boolean,
      default: false
    },
    // Admin can set manual overrides that get applied on publish
    manualRankOverride: {
      type: Number,
      min: 1
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 1000
    },
    isLocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 }
  }
);

// One draft per submission per hackathon
resultDraftSchema.index(
  { submissionId: 1, hackathonId: 1 },
  { unique: true }
);
resultDraftSchema.index({ hackathonId: 1, rank: 1 });

const ResultDraft =
  mongoose.models.ResultDraft ||
  mongoose.model("ResultDraft", resultDraftSchema);

export default ResultDraft;
