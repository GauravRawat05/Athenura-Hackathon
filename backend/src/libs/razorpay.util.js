// razorpay.util.js
import crypto from 'crypto';
import ApiError  from './apiError.js'; // Assuming ApiError is defined

/**
 * Verifies the Razorpay payment signature.
 * Used for client-side verification (after user pays).
 * @param {string} razorpayOrderId - The Razorpay Order ID.
 * @param {string} razorpayPaymentId - The Razorpay Payment ID.
 * @param {string} razorpaySignature - The signature received from Razorpay.
 * @param {string} secret - Your Razorpay Key Secret.
 * @returns {boolean} - True if signature is valid, false otherwise.
 */
const verifyRazorpayPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature, secret) => {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    return expectedSignature === razorpaySignature;
};

/**
 * Verifies the Razorpay webhook signature.
 * Used for webhook events.
 * @param {string} rawBody - The raw request body of the webhook.
 * @param {string} razorpaySignature - The X-Razorpay-Signature header value.
 * @param {string} secret - Your Razorpay Webhook Secret.
 * @returns {boolean} - True if signature is valid, false otherwise.
 */
const verifyRazorpayWebhookSignature = (rawBody, razorpaySignature, secret) => {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    return expectedSignature === razorpaySignature;
};

export { verifyRazorpayPaymentSignature, verifyRazorpayWebhookSignature };
