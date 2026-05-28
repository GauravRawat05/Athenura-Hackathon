// payment.controller.js
import asyncHandler from '../../libs/asyncHandler.js';
import ApiResponse  from '../../libs/apiResponse.js';
import { paymentService } from './payment.service.js';
import { verifyAndConfirmSchema } from './payment.validation.js';
import { validate } from '../../middleware/validate.middleware.js'; // Assuming a validation middleware exists
import envConfig  from '../../config/envConfig.js'; // For webhook secret

// Endpoint: POST /payments/verify-and-confirm
const verifyAndConfirmPayment = asyncHandler(async (req, res) => {
    console.log('[PaymentController] verifyAndConfirmPayment request body:', JSON.stringify(req.body, null, 2));
    
    // Validate request body
    const { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate fields exist
    if (!registrationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error('[PaymentController] Missing required fields in request body:', req.body);
        throw new ApiError(400, 'Missing required payment verification fields.');
    }

    // Call service layer
    await paymentService.verifyAndConfirmPayment(
        req.user._id, // User performing the verification
        registrationId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    );

    // Return response
    return res.status(200).json(
        new ApiResponse(200, null, 'Payment successfully verified and registration confirmed.')
    );
});

// Endpoint: POST /payments/webhook
const handleRazorpayWebhook = asyncHandler(async (req, res) => {
    // Razorpay sends `X-Razorpay-Signature` header and raw body
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const webhookSecret = envConfig.razorpayWebhookSecret; // Ensure this is securely loaded from env

    // The raw body is required for signature verification
    // Assuming express.json() is configured with { verify: (req, res, buf) => { req.rawBody = buf; } }
    const rawBody = req.rawBody; // Make sure this is populated by Express middleware

    await paymentService.handleRazorpayWebhook(razorpaySignature, rawBody, webhookSecret);

    // Always return 200 OK to Razorpay immediately to avoid retries
    return res.status(200).json({ status: 'ok' });
});

export { verifyAndConfirmPayment, handleRazorpayWebhook };
