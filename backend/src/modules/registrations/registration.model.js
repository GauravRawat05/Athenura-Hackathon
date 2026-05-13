/**
   registration.model.js
   Defines the Mongoose schema and model for registration records stored in MongoDB.
 */
import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: [true, "Hackathon ID is required"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Required for solo mode, optional for team mode
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      // Required for team mode, optional for solo mode
    },
    mode: {
      type: String,
      enum: ["solo", "team"],
      required: [true, "Registration mode is required"]
    },
    participantIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }],
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "payment_failed"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending"
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"]
    },
    currency: {
      type: String,
      enum: ["INR", "DOLLAR"],
      default: "INR"
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"]
    },
    cancelledAt: {
      type: Date
    },
    cancellationReason: {
      type: String,
      maxlength: [500, "Cancellation reason cannot exceed 500 characters"]
    },
    confirmedAt: {
      type: Date
    },
    paymentCompletedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes to enforce uniqueness and fast lookups
// A user can have only one active (non-cancelled) solo registration per hackathon
registrationSchema.index({ hackathonId: 1, userId: 1 }, {
  unique: true,
  partialFilterExpression: {
    mode: "solo",
    userId: { $exists: true, $ne: null },
    status: { $nin: ["cancelled"] }
  }
});

// A team can have only one active (non-cancelled) registration per hackathon
registrationSchema.index({ hackathonId: 1, teamId: 1 }, {
  unique: true,
  partialFilterExpression: {
    mode: "team",
    teamId: { $exists: true, $ne: null },
    status: { $nin: ["cancelled"] }
  }
});

// A user cannot be in both solo and team registration for same hackathon
// This is enforced at application level (check both solo and team existing registrations)

// Indexes for query performance
registrationSchema.index({ userId: 1 });
registrationSchema.index({ teamId: 1 });
registrationSchema.index({ hackathonId: 1, status: 1 });
registrationSchema.index({ paymentStatus: 1 });

// Unique index to ensure a user can only have one active registration per hackathon (solo or team)
// This enforces at the database level that a participant cannot be in multiple active registrations
registrationSchema.index(
  { hackathonId: 1, participantIds: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $nin: ["cancelled"] } }
  }
);

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
