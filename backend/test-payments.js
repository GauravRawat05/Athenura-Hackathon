import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import { paymentService } from "./src/modules/payments/payment.service.js";
import { Payment } from "./src/modules/payments/payment.model.js";

dotenv.config();

async function runTests() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB.");

    // Using a dummy user ObjectId for the test
    const dummyUserId = new mongoose.Types.ObjectId();

    console.log("\n--- Testing createOrder ---");
    const orderResult = await paymentService.createOrder(dummyUserId, 500, "INR", "receipt_test_123");
    console.log("Order Created:", orderResult);

    if (!orderResult.orderId) throw new Error("Order ID missing");

    console.log("\n--- Testing getPaymentStatus (Pending) ---");
    const statusResult = await paymentService.getPaymentStatus(orderResult.paymentId, dummyUserId);
    console.log("Payment Status:", statusResult.status);

    console.log("\n--- Testing verifyPayment (Simulating Client Success) ---");
    // To simulate success, we need to generate a valid signature ourselves
    // Razorpay sends razorpay_payment_id starting with 'pay_'
    const dummyPaymentId = "pay_DummyPayment123";
    
    const body = orderResult.orderId + "|" + dummyPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const verifyResult = await paymentService.verifyPayment(
      dummyUserId,
      orderResult.orderId,
      dummyPaymentId,
      expectedSignature
    );
    console.log("Verification Result Status:", verifyResult.status);

    console.log("\n--- Testing Webhook ---");
    // Let's create another order to test the webhook
    const order2 = await paymentService.createOrder(dummyUserId, 200, "INR", "receipt_test_webhook");
    console.log("Webhook Order Created:", order2.orderId);

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookBody = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_WebhookDummy456",
            order_id: order2.orderId
          }
        }
      }
    };

    const webhookSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(webhookBody))
      .digest("hex");

    const webhookResult = await paymentService.handleWebhook(webhookBody, webhookSignature);
    console.log("Webhook Result:", webhookResult);

    const checkWebhookStatus = await paymentService.getPaymentStatus(order2.paymentId, dummyUserId);
    console.log("Payment Status After Webhook:", checkWebhookStatus.status);

    console.log("\n✅ All Tests Passed Successfully!");

    // Clean up test data
    await Payment.deleteMany({ user: dummyUserId });
    
  } catch (error) {
    console.error("\n❌ Test Failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runTests();
