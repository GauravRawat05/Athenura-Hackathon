import crypto from "crypto";
import { razorpayInstance } from "../../config/razorpay.js";
import { Payment } from "./payment.model.js";
import { PAYMENT_STATUS } from "./payment.constants.js";
import ApiError from "../../libs/apiError.js";

class PaymentService {
  async createOrder(userId, amount, currency = "INR", receipt = "") {
    if (!amount || amount <= 0) {
      throw new ApiError(400, "Invalid amount");
    }

    // Razorpay expects amount in smaller units (paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${userId}_${Date.now()}`,
    };

    try {
      const order = await razorpayInstance.orders.create(options);

      const payment = await Payment.create({
        user: userId,
        razorpayOrderId: order.id,
        amount: amount,
        currency: order.currency,
        status: PAYMENT_STATUS.PENDING,
        receipt: options.receipt,
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to create Razorpay order: " + error.message);
    }
  }

  async verifyPayment(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new ApiError(400, "Missing payment verification parameters");
    }

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment) {
        payment.status = PAYMENT_STATUS.FAILED;
        await payment.save();
      }
      throw new ApiError(400, "Invalid payment signature");
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId, user: userId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: PAYMENT_STATUS.SUCCESS,
      },
      { new: true }
    );

    if (!payment) {
      throw new ApiError(404, "Payment record not found");
    }

    return payment;
  }

  async getPaymentStatus(paymentId, userId) {
    const payment = await Payment.findOne({ _id: paymentId, user: userId });
    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }
    return payment;
  }

  async handleWebhook(body, signature) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!secret) {
      throw new ApiError(500, "Webhook secret not configured");
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new ApiError(400, "Invalid webhook signature");
    }

    const event = body.event;
    const payload = body.payload?.payment?.entity;
    
    if (!payload) {
      return { message: "Ignored" };
    }

    const orderId = payload.order_id;

    if (!orderId) {
        // Not all events have order_id
        return { message: "Ignored" };
    }

    if (event === "payment.captured") {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { 
          status: PAYMENT_STATUS.SUCCESS,
          razorpayPaymentId: payload.id
        }
      );
    } else if (event === "payment.failed") {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status: PAYMENT_STATUS.FAILED }
      );
    }

    return { status: "success" };
  }
}

export const paymentService = new PaymentService();
