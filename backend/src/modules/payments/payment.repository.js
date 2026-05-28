// payment.repository.js
import { Payment } from './payment.model.js';

class PaymentRepository {
    async createPayment(data, session) {
        // Using create with an array allows passing a session
        const [payment] = await Payment.create([data], { session });
        return payment;
    }

    async findById(id, session) {
        return await Payment.findById(id).session(session);
    }

    async findByRazorpayOrderId(razorpayOrderId, session) {
        return await Payment.findOne({ razorpayOrderId }).session(session);
    }

    async findByRegistrationId(registrationId, session) {
        return await Payment.findOne({ registrationId }).session(session);
    }

    // Methods to update payment status will usually be done by fetching the model
    // and then calling .save() on it within a session.
}

export const paymentRepository = new PaymentRepository();
