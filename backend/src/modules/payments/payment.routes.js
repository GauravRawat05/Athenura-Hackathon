// payment.routes.js
import { Router } from 'express';
import { verifyAndConfirmPayment, handleRazorpayWebhook } from './payment.controller.js';
import { verifyAndConfirmSchema } from './payment.validation.js';
import { validate } from '../../middleware/validate.middleware.js'; // Assuming a validation middleware
import { verifyJWT } from '../../middleware/auth.middleware.js'; // Assuming auth middleware
import express from 'express'; // For raw body parsing for webhook

const router = Router();

// Middleware to parse raw body for Razorpay webhook signature verification
// This must be applied ONLY to the webhook route and BEFORE other body parsers
// The `verify` function populates `req.rawBody`
const rawBodyParser = express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
});

// Route for verifying and confirming payment (frontend initiated)
router.post(
    '/verify-and-confirm',
    verifyJWT, // Ensure user is logged in
    validate(verifyAndConfirmSchema), // Validate request body
    verifyAndConfirmPayment
);

// Route for Razorpay webhook
// It's crucial this route uses rawBodyParser ONLY and not any other body parser (like general express.json())
router.post(
    '/webhook',
    rawBodyParser, // Use raw body parser for webhook
    handleRazorpayWebhook
);

export default router;
