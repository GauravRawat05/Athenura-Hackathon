import api from './api';

export const paymentService = {
  createOrder: (amount, currency, registrationId) => 
    api.post('/payments/create-order', { amount, currency, receipt: registrationId }),
  verifyPayment: (registrationId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => 
    api.post('/payments/verify-and-confirm', { registrationId, razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature }),
  getPaymentStatus: (paymentId) => 
    api.get(`/payments/${paymentId}/status`),
};
