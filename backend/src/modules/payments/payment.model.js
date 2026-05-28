// payment.model.js
import mongoose from 'mongoose';
import { PAYMENT_STATUSES } from '../../constants/user.constants.js'; // Assuming this constant exists

const paymentSchema = new mongoose.Schema(
    {
        registrationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Registration',
            required: true,
            unique: true, // One payment per registration
        },
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true, // Ensure no duplicate Razorpay orders
            index: true,
        },
        razorpayPaymentId: {
            type: String,
            default: null, // Filled upon successful payment
            index: true,
            sparse: true, // Only create index for documents where this field exists
        },
        amount: {
            type: Number, // Stored in smallest currency unit (e.g., paise for INR)
            required: true,
        },
        currency: {
            type: String,
            enum: ['INR'],
            required: true,
            default: 'INR',
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUSES),
            default: PAYMENT_STATUSES.CREATED,
            required: true,
        },
        gatewayResponse: {
            type: mongoose.Schema.Types.Mixed, // Store full Razorpay response for debugging/auditing
            default: {},
        },
        verifiedAt: {
            type: Date,
            default: null,
        },
        webhookProcessed: {
            type: Boolean,
            default: false, // Flag for idempotency
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
