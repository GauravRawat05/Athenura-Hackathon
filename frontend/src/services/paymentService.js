import api from './api';

export const paymentService = {
  createOrder: (amount, currency, registrationId) => 
    api.post('/payments/create-order', { amount, currency, receipt: registrationId }),
  verifyPayment: (razorpayOrderId, razorpayPaymentId, razorpaySignature) => 
    api.post('/payments/verify', { razorpayOrderId, razorpayPaymentId, razorpaySignature }),
  getPaymentStatus: (paymentId) => 
    api.get(`/payments/${paymentId}/status`),
};
