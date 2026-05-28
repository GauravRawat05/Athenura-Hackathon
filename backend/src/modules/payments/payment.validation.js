// payment.validation.js
import Joi from 'joi';

const verifyAndConfirmSchema = Joi.object({
    registrationId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Registration ID must be a valid MongoDB ObjectId.',
            'any.required': 'Registration ID is required.',
        }),
    razorpay_order_id: Joi.string().required().messages({
        'any.required': 'Razorpay Order ID is required.',
    }),
    razorpay_payment_id: Joi.string().required().messages({
        'any.required': 'Razorpay Payment ID is required.',
    }),
    razorpay_signature: Joi.string().required().messages({
        'any.required': 'Razorpay Signature is required.',
    }),
});

// No specific Joi schema for webhook, as its body is verified by Razorpay signature first
// and then parsed based on event type within the service.

export { verifyAndConfirmSchema };
