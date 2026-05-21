import mongoose, { Schema } from "mongoose";
import { PAYMENT_STATUS, PAYMENT_CURRENCY } from "./payment.constants.js";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: PAYMENT_CURRENCY.INR,
      enum: Object.values(PAYMENT_CURRENCY),
    },
    status: {
      type: String,
      default: PAYMENT_STATUS.PENDING,
      enum: Object.values(PAYMENT_STATUS),
    },
    receipt: {
      type: String,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
