// payment.service.js
import { Payment } from './payment.model.js';
import { paymentRepository } from './payment.repository.js';
import { registrationService } from '../registrations/registration.service.js';
import ApiError  from '../../libs/apiError.js';
import envConfig from '../../config/envConfig.js'; // Assuming this exists and contains Razorpay secrets
import mongoose from 'mongoose';
import { PAYMENT_STATUSES, REGISTRATION_STATUSES } from '../../constants/user.constants.js';
import { verifyRazorpayPaymentSignature, verifyRazorpayWebhookSignature } from '../../libs/razorpay.util.js';

// Assuming these exist in the project structure
import { emitSocketEvent } from '../../sockets/index.js'; // Placeholder for socket emitter
// import { sendRegistrationConfirmationEmail } from '../../utils/mail/mail.service.js'; // Email service (REMOVED)
import { sendEmail, EMAIL_TYPES } from '../notifications/notification.mailer.js'; // Use existing Brevo mailer
import userRepository  from '../users/user.repository.js'; // For fetching user details for email
import  hackathonRepository  from '../hackathons/hackathon.repository.js'; // For fetching hackathon details for email

// Initialize Razorpay SDK
import Razorpay from 'razorpay';
// Ensure API_SECRET.RAZORPAY_KEY_ID and API_SECRET.RAZORPAY_KEY_SECRET are available
const razorpay = new Razorpay({
    key_id: envConfig.razorpayKeyId,
    key_secret: envConfig.razorpayKeySecret,
});

class PaymentService {
    /**
     * Internal method to create a payment record in the database.
     * @param {object} paymentData - Data for the new payment record.
     * @param {mongoose.ClientSession} [session] - Mongoose client session.
     * @returns {Payment} - The created payment document.
     */
    async createPaymentRecord(paymentData, session) {
        return paymentRepository.createPayment(paymentData, session);
    }

    /**
     * Creates a Razorpay order.
     * @param {number} amount - Amount in the smallest currency unit (e.g., paise).
     * @param {string} currency - Currency code (e.g., 'INR').
     * @param {string} receiptId - A unique identifier for the order (e.g., internal payment ID).
     * @returns {object} - The created Razorpay order object.
     */
    async createRazorpayOrder(amount, currency, receiptId) {
        try {
            const options = {
                amount: amount,
                currency: currency,
                receipt: receiptId,
                // Optional: notes, etc.
            };
            const order = await razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error('Razorpay order creation failed:', error);
            throw new ApiError(500, 'Failed to create Razorpay order.', error.message);
        }
    }

    /**
     * Verifies the payment from the frontend and confirms the registration.
     * @param {string} userId - The ID of the user performing verification.
     * @param {string} registrationId - The ID of the registration.
     * @param {string} razorpay_order_id - Razorpay Order ID from frontend.
     * @param {string} razorpay_payment_id - Razorpay Payment ID from frontend.
     * @param {string} razorpay_signature - Razorpay Signature from frontend.
     */
    async verifyAndConfirmPayment(userId, registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        console.log('[PaymentService] verifyAndConfirmPayment called with:', { userId, registrationId, razorpay_order_id, razorpay_payment_id });
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // --- 1. Fetch Payment Record ---
            const payment = await paymentRepository.findByRazorpayOrderId(razorpay_order_id, session);
            if (!payment) {
                throw new ApiError(404, 'Payment record not found for the provided order ID.');
            }

            // --- 2. Verify Registration Exists & Belongs to User ---
            const registration = await registrationService.getRegistrationById(registrationId, session);
            if (!registration || !registration._id.equals(payment.registrationId)) {
                throw new ApiError(404, 'Registration not found or does not match payment record.');
            }
            if (!registration.userId.equals(userId)) {
                throw new ApiError(403, 'You are not authorized to verify this registration.');
            }

            // --- 3. Verify Payment is not already completed/finalized ---
            if (payment.paymentStatus === PAYMENT_STATUSES.COMPLETED) {
                // Idempotency: If already completed (e.g., by webhook), just return success
                await session.commitTransaction();
                return;
            }
            if (payment.paymentStatus === PAYMENT_STATUSES.FAILED || payment.paymentStatus === PAYMENT_STATUSES.REFUNDED || payment.paymentStatus === PAYMENT_STATUSES.EXPIRED) {
                 throw new ApiError(400, `Payment already ${payment.paymentStatus}. Cannot confirm.`);
            }

            // --- 4. Verify Razorpay signature using crypto HMAC SHA256 ---
            const isValidSignature = verifyRazorpayPaymentSignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                envConfig.razorpayKeySecret // Use key_secret for payment verification
            );
            if (!isValidSignature) {
                throw new ApiError(400, 'Invalid Razorpay signature. Payment verification failed.');
            }

            // --- 5. Verify amount matches stored amount ---
            // For robust verification, fetch actual payment details from Razorpay using razorpay_payment_id
            // and compare its amount with `payment.amount`.
            // For this implementation, we trust the stored amount `payment.amount` as it was calculated securely
            // on the backend. The webhook will provide a second layer of verification for the actual captured amount.
            let razorpayFetchedPayment;
            try {
                razorpayFetchedPayment = await razorpay.payments.fetch(razorpay_payment_id);
            } catch (fetchError) {
                console.error(`Failed to fetch Razorpay payment details for ${razorpay_payment_id}:`, fetchError);
                throw new ApiError(500, 'Failed to verify payment with Razorpay. Please try again.');
            }

            if (razorpayFetchedPayment.status !== 'captured' && razorpayFetchedPayment.status !== 'authorized') {
                throw new ApiError(400, `Payment status is ${razorpayFetchedPayment.status}. Must be 'authorized' or 'captured' to confirm.`);
            }

            // CRITICAL: Verify amount matches the originally calculated amount.
            // Razorpay returns amount in smallest unit (paise/cents).
            if (razorpayFetchedPayment.amount !== payment.amount) {
                console.error(`Amount mismatch detected for Razorpay payment ${razorpay_payment_id}. Expected ${payment.amount}, Got ${razorpayFetchedPayment.amount}.`);
                throw new ApiError(400, 'Payment amount mismatch. Potential tampering detected.');
            }


            // --- 6. Verify order ID matches database (already implicitly done by fetching payment record by order_id) ---
            if (payment.razorpayOrderId !== razorpay_order_id) {
                throw new ApiError(400, 'Razorpay order ID mismatch in database record.');
            }

            // --- 7. Mark payment COMPLETED and registration CONFIRMED ---
            payment.paymentStatus = PAYMENT_STATUSES.COMPLETED;
            payment.razorpayPaymentId = razorpay_payment_id;
            payment.verifiedAt = new Date();
            payment.gatewayResponse = razorpayFetchedPayment; // Store the full response for audit
            payment.webhookProcessed = true; // Mark as processed, as this path confirms payment
            await payment.save({ session });

            await registrationService.confirmRegistration(registration._id, session);

            await session.commitTransaction();

            // --- 8. Emit socket event ---
            // Assuming emitSocketEvent expects userId as a string
            emitSocketEvent(registration.userId.toString(), 'registration.confirmed', {
                registrationId: registration._id.toString(),
                hackathonId: registration.hackathonId.toString(),
                userId: registration.userId.toString(),
            });

            // --- 9. Send confirmation email ---
            const user = await userRepository.findById(registration.userId);
            const hackathon = await hackathonRepository.findById(registration.hackathonId);
            if (user && hackathon) {
                try {
                    await sendEmail(user.email, EMAIL_TYPES.REGISTRATION_CONFIRMATION, {
                        fullName: user.fullName || user.username || 'Participant',
                        hackathonTitle: hackathon.title || 'the hackathon',
                        startDate: hackathon.startDate, // Assuming hackathon object has startDate
                        endDate: hackathon.endDate, // Assuming hackathon object has endDate
                        // The template does not currently use registrationType or teamName directly,
                        // but we can pass them if the template were to be enhanced.
                        // registrationType: registration.registrationType,
                        // teamName: registration.teamId ? (await teamRepository.findById(registration.teamId))?.name : undefined,
                    });
                } catch (emailError) {
                    console.error('[PaymentService] Non-fatal error sending confirmation email:', emailError);
                }
            } else {
                console.warn(`Could not send confirmation email for registration ${registration._id}. User or Hackathon details not found.`);
            }

            } catch (error) {
            await session.abortTransaction();
            console.error('Payment verification and confirmation failed:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Handles incoming Razorpay webhook events.
     * @param {string} razorpaySignature - The `X-Razorpay-Signature` header from the webhook request.
     * @param {string} rawBody - The raw request body of the webhook.
     * @param {string} webhookSecret - Your configured Razorpay webhook secret.
     */
    async handleRazorpayWebhook(razorpaySignature, rawBody, webhookSecret) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // --- 1. Verify Razorpay Webhook Signature ---
            const isValidSignature = verifyRazorpayWebhookSignature(rawBody, razorpaySignature, webhookSecret);
            if (!isValidSignature) {
                console.error('Invalid Razorpay webhook signature.', { razorpaySignature, rawBody });
                throw new ApiError(400, 'Invalid Razorpay webhook signature.', null, 'WEBHOOK_SIGNATURE_INVALID');
            }

            const event = JSON.parse(rawBody); // Parse after signature verification
            const { event: eventType, payload } = event;
            const razorpayOrderId = payload.order?.entity?.id || payload.payment?.entity?.order_id;
            const razorpayPaymentId = payload.payment?.entity?.id;
            const webhookAmount = payload.payment?.entity?.amount; // in paise, from webhook payload

            if (!razorpayOrderId) {
                console.error('Missing Razorpay Order ID in webhook payload.', { eventType, payload });
                throw new ApiError(400, 'Missing Razorpay Order ID in webhook payload.', null, 'WEBHOOK_PAYLOAD_ERROR');
            }

            // --- 2. Fetch Payment Record ---
            const payment = await paymentRepository.findByRazorpayOrderId(razorpayOrderId, session);
            if (!payment) {
                console.warn(`Webhook received for unknown Razorpay Order ID: ${razorpayOrderId}. Event Type: ${eventType}`);
                await session.commitTransaction(); // Commit empty transaction to release lock
                return; // Return silently to Razorpay, but log the issue
            }

            // --- 3. Idempotency Check ---
            // If webhook already processed or payment is already completed/failed by frontend verification
            if (payment.webhookProcessed || payment.paymentStatus === PAYMENT_STATUSES.COMPLETED || payment.paymentStatus === PAYMENT_STATUSES.FAILED || payment.paymentStatus === PAYMENT_STATUSES.EXPIRED) {
                console.log(`Webhook for Order ID ${razorpayOrderId} (Event Type: ${eventType}) already processed or payment status is final.`);
                await session.commitTransaction(); // Commit empty transaction to release lock
                return;
            }

            // --- 4. Reconcile delayed payments & Update statuses safely ---
            let registration = null;
            switch (eventType) {
                case 'payment.captured':
                    // CRITICAL: Verify amount again from webhook payload
                    if (webhookAmount !== payment.amount) {
                         console.error(`Amount mismatch in webhook for order ${razorpayOrderId}. Expected ${payment.amount}, Got ${webhookAmount}. Manual intervention needed.`);
                         // This is a critical error. Log it prominently.
                         // Decision: Proceed with confirmation, but flag the discrepancy for manual review.
                         // For stricter policies, this could throw an error to prevent confirmation.
                    }

                    payment.paymentStatus = PAYMENT_STATUSES.COMPLETED;
                    payment.razorpayPaymentId = razorpayPaymentId;
                    payment.gatewayResponse = payload; // Store full webhook payload
                    payment.verifiedAt = new Date();
                    payment.webhookProcessed = true;
                    await payment.save({ session });

                    registration = await registrationService.confirmRegistration(payment.registrationId, session);
                    break;

                case 'payment.failed':
                    payment.paymentStatus = PAYMENT_STATUSES.FAILED;
                    payment.razorpayPaymentId = razorpayPaymentId; // Still capture payment ID if available
                    payment.gatewayResponse = payload;
                    payment.webhookProcessed = true;
                    await payment.save({ session });

                    registration = await registrationService.failRegistration(payment.registrationId, session);
                    break;

                // Handle other events like payment.refunded if necessary
                default:
                    console.warn(`Unhandled Razorpay webhook event type: ${eventType} for order ${razorpayOrderId}`);
                    await session.commitTransaction(); // Commit empty transaction
                    return; // Return silently for unhandled types
            }

            await session.commitTransaction();

            // --- 5. Emit socket event & Send confirmation email (if confirmed via webhook) ---
            if (registration && registration.registrationStatus === REGISTRATION_STATUSES.CONFIRMED) {
                emitSocketEvent(registration.userId.toString(), 'registration.confirmed', {
                    registrationId: registration._id.toString(),
                    hackathonId: registration.hackathonId.toString(),
                    userId: registration.userId.toString(),
                });

                const user = await userRepository.findById(registration.userId);
                const hackathon = await hackathonRepository.findById(registration.hackathonId);
                if (user && hackathon) {
                    await sendEmail(user.email, EMAIL_TYPES.REGISTRATION_CONFIRMATION, {
                        fullName: user.fullName || user.username || 'Participant',
                        hackathonTitle: hackathon.name,
                        startDate: hackathon.startDate,
                        endDate: hackathon.endDate,
                    });
                } else {
                    console.warn(`Could not send confirmation email (webhook) for registration ${registration._id}. User or Hackathon not found.`);
                }
                }

                } catch (error) {
            await session.abortTransaction();
            console.error('Error handling Razorpay webhook:', error);
            // It's critical to still return 200 OK to Razorpay here to prevent re-delivery attempts,
            // even if our internal processing failed. The error should be logged and alert generated.
            throw new ApiError(500, 'Internal server error processing webhook.', error.message);
        } finally {
            session.endSession();
        }
    }
}

export const paymentService = new PaymentService();
