/**
 * certificate.model.js
 * Defines the Mongoose schema and model for certificate records stored in MongoDB.
 */
import mongoose from "mongoose";
import { GENERATION_STATUS } from "./certificate.constants.js";

const certificateSchema = new mongoose.Schema(
  {
    /**
     * The user who this certificate belongs to.
     */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },

    /**
     * The hackathon event the certificate is associated with.
     */
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: [true, "hackathonId is required"],
    },

    /**
     * The submission this certificate rewards (null for pure participation).
     */
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      default: null,
    },

    /**
     * Type of certificate — matches CERTIFICATE_TYPES constants.
     *   participation  : participant signed up or attended
     *   winner         : placed 1st / award holder
     *   finalist       : shortlisted / finalist round
     *   judge          : awarded to a hackathon judge
     */
    certificateType: {
      type: String,
      enum: ["participation", "winner", "finalist", "judge"],
      required: [true, "certificateType is required"],
    },

    /**
     * If the certificate belongs to a specific award category (e.g. "Best AI Project",
     * "Best Use of Cloudinary").
     */
    awardCategory: {
      type: String,
      default: null,
    },

    /**
     * A human-readable, unique identification code printed on the certificate and
     * used for the public verification endpoint.
     * Format: CERT-<timestamp>-<randomAlpha>
     */
    certificateCode: {
      type: String,
      required: [true, "certificateCode is required"],
      unique: true,
      index: true,
    },

    /**
     * The rank the recipient achieved, if any (1-based; null for plain participation).
     */
    rank: {
      type: Number,
      min: [1, "rank must be at least 1"],
      default: null,
    },

    /**
     * Team name at the time the certificate was issued, preserved for historical accuracy.
     */
    teamName: {
      type: String,
      default: null,
    },

    /**
     * Current generation status of the certificate document.
     * See GENERATION_STATUS for allowed values.
     */
    generationStatus: {
      type: String,
      enum: Object.values(GENERATION_STATUS),
      default: GENERATION_STATUS.PENDING,
      index: true,
    },

    /**
     * Number of times a generation/upload attempt has been retried.
     * Starts at 0 and is incremented on each retry attempt.
     */
    retryCount: {
      type: Number,
      default: 0,
      min: [0, "retryCount cannot be negative"],
    },

    /**
     * Human-readable reason for the most recent failure, if any.
     * Used for debugging and for surfacing useful information on retry.
     */
    lastFailureReason: {
      type: String,
      default: null,
    },

    /**
     * Timestamp when the async generation process kicked off.
     */
    generationStartedAt: {
      type: Date,
      default: null,
    },

    /**
     * Timestamp when the generation process completed (success or final failure).
     */
    generationCompletedAt: {
      type: Date,
      default: null,
    },

    /**
     * Cloudinary public_id of the uploaded PDF artefact.
     */
    cloudinaryPublicId: {
      type: String,
      default: null,
    },

    /**
     * Full HTTPS URL to the generated certificate PDF on Cloudinary CDN.
     */
    certificateUrl: {
      type: String,
      default: null,
    },

    /**
     * Whether the certificate has been revoked by an admin.
     */
    isRevoked: {
      type: Boolean,
      default: false,
    },

    /**
     * When the certificate was revoked, if applicable.
     */
    revokedAt: {
      type: Date,
      default: null,
    },

    /**
     * Soft-deletion flag so records can be archived without losing history.
     */
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,        // adds `createdAt` and `updatedAt`
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,               // don't expose __v
  }
);

/**
 * Compound unique index:
 * A single user can only have ONE certificate per hackathon + certificateType combination.
 * This is the idempotency guard — re-issuing a certificate for the same participant
 * in the same event with the same type will throw a duplicate key error, which is
 * surfaced to the caller so they can decide whether to skip or skip-regenerate.
 */
certificateSchema.index(
  { userId: 1, hackathonId: 1, certificateType: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
    name: "uniq_user_hackathon_type",
  }
);

/**
 * index certificateCode so the public verify endpoint is fast.
 * (Also declared as a unique field above, but the explicit index makes the
 * optimisation intent explicit and allows MongoDB to use the index for the
 * uniqueness constraint even in partial-filter scenarios.)
 */
certificateSchema.index(
  { certificateCode: 1 },
  { unique: true, name: "certificate_code_unique" }
);

/**
 * Common projection defaults used in list queries.
 */
certificateSchema.statics.defaultListProjection = () => ({
  _id: 1,
  userId: 1,
  hackathonId: 1,
  certificateCode: 1,
  certificateType: 1,
  awardCategory: 1,
  rank: 1,
  generationStatus: 1,
  certificateUrl: 1,
  createdAt: 1,
  updatedAt: 1,
  revokedAt: 1,
  isRevoked: 1,
});

/**
 * Public-safe projection for the verification endpoint — strips sensitive fields.
 */
certificateSchema.statics.publicProjection = () => ({
  _id: 0,
  certificateCode: 1,
  certificateType: 1,
  awardCategory: 1,
  rank: 1,
  hackathonId: 1,
  issuedAt: '$createdAt',         // hide internal timestamps, show issuedAt only
  isRevoked: 1,
  revokedAt: 1,
});

/**
 * Pre-save hook: stamp generation timestamps on transitions.
 */
certificateSchema.pre('save', function (next) {
  if (this.isNew && !this.generationStartedAt) {
    // New document — initialise timestamps
    this.generationStartedAt = new Date();
  }

  // If we are GENERATING and the status changed to it, stamp the start time
  if (this.isModified('generationStatus')) {
    if (this.generationStatus === GENERATION_STATUS.GENERATING) {
      this.generationStartedAt = new Date();
    }

    // Any terminal status stamps the completion time
    if (
      this.generationStatus === GENERATION_STATUS.COMPLETED ||
      this.generationStatus === GENERATION_STATUS.FAILED
    ) {
      this.generationCompletedAt = new Date();
    }
  }

  next();
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
