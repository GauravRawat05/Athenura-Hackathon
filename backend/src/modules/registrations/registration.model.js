// registration.model.js
import mongoose from 'mongoose';
import { REGISTRATION_STATUSES } from '../../constants/user.constants.js'; // Assuming this constant exists

const registrationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming a User model exists
            required: true,
            index: true,
        },
        hackathonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hackathon', // Assuming a Hackathon model exists
            required: true,
            index: true,
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team', // Assuming a Team model exists
            index: true,
            default: null, // Only applicable for team registrations
        },
        registrationType: {
            type: String,
            enum: ['solo', 'intern', 'team'],
            required: true,
        },
        amount: {
            type: Number, // Stored in smallest currency unit (e.g., paise for INR)
            required: true,
        },
        currency: {
            type: String,
            enum: ['INR'], // Assuming INR for Razorpay, adjust if multi-currency needed
            required: true,
            default: 'INR',
        },
        registrationStatus: {
            type: String,
            enum: Object.values(REGISTRATION_STATUSES),
            default: REGISTRATION_STATUSES.PENDING_PAYMENT,
            required: true,
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment', // Link to the Payment model
            required: false, // Make optional initially
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true, // For efficient cleanup job
        },
        confirmedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, hackathonId: 1 }, { unique: true, partialFilterExpression: { teamId: { $eq: null } } }); // For solo/intern
registrationSchema.index({ teamId: 1, hackathonId: 1 }, { unique: true, partialFilterExpression: { teamId: { $ne: null } } }); // For teams

export const Registration = mongoose.model('Registration', registrationSchema);
