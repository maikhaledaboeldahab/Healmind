const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { validate } = require("../validation/User.validators");
const { checkoutSessionSchema, mockChargeSchema } = require("../validation/payment.validation");
const {
  createCheckoutSession,
  mockCharge,
  stripeWebhook,
} = require("../controllers/payment.controller");

// Stripe Checkout Session - Patient only
router.post(
  "/checkout-session",
  protect,
  restrictTo("patient"),
  validate(checkoutSessionSchema),
  createCheckoutSession
);

// Fallback Mock Charge - Patient only
router.post(
  "/mock-charge",
  protect,
  restrictTo("patient"),
  validate(mockChargeSchema),
  mockCharge
);

// Stripe Webhook Receiver - Public (signature verification happens inside controller)
router.post("/webhook", stripeWebhook);

module.exports = router;
