import asyncHandler from "../../libs/asyncHandler.js";
import { paymentService } from "./payment.service.js";
import ApiResponse from "../../libs/apiResponse.js";
import ApiError from "../../libs/apiError.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency, receipt } = req.body;
  
  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  const orderData = await paymentService.createOrder(req.user._id, amount, currency, receipt);

  res.status(201).json(new ApiResponse(201, orderData, "Order created successfully"));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
  const payment = await paymentService.verifyPayment(
    req.user._id,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  res.status(200).json(new ApiResponse(200, payment, "Payment verified successfully"));
});

export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const payment = await paymentService.getPaymentStatus(id, req.user._id);

  res.status(200).json(new ApiResponse(200, payment, "Payment status fetched successfully"));
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  // Webhooks from Razorpay will contain the signature in the headers
  const signature = req.headers["x-razorpay-signature"];
  
  if (!signature) {
    throw new ApiError(400, "Missing razorpay signature");
  }

  // The webhook body needs to be the raw body or correctly parsed JSON
  // In Express, body-parser already parses it as JSON, we just stringify it in service
  await paymentService.handleWebhook(req.body, signature);

  // Razorpay expects a quick 2xx response
  res.status(200).send("OK");
});
