import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  razorpayWebhook,
} from "./payment.controller.js";

const router = Router();

// Webhook endpoint does NOT need JWT, as it's called by Razorpay servers
router.post("/webhooks/razorpay", razorpayWebhook);

// The rest are protected routes
router.use(verifyJWT);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/:id/status", getPaymentStatus);

export default router;
