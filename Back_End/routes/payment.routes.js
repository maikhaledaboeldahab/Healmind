const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { validate } = require("../validation/User.validators");
const { checkoutSessionSchema, mockChargeSchema, payBalanceSchema } = require("../validation/payment.validation");
const {
  createCheckoutSession,
  mockCharge,
  stripeWebhook,
  createBalanceCheckoutSession,
  mockChargeBalance,
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

// Stripe Checkout Session Balance - Patient only
router.post(
  "/balance-checkout-session",
  protect,
  restrictTo("patient"),
  validate(payBalanceSchema),
  createBalanceCheckoutSession
);

// Fallback Mock Charge Balance - Patient only
router.post(
  "/mock-charge-balance",
  protect,
  restrictTo("patient"),
  validate(payBalanceSchema),
  mockChargeBalance
);

// Stripe Webhook Receiver - Public (signature verification happens inside controller)
router.post("/webhook", stripeWebhook);

module.exports = router;
