const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/authMiddleware");
const { UserModel } = require("../model/UserModel");
const { PaymentModel } = require("../model/PaymentModel");
const {
  createStripeCustomer,
  createPaymentIntent,
  retrievePaymentIntent,
  confirmPaymentIntent,
  listPaymentMethods,
  detachPaymentMethod,
  refundPayment,
  verifyWebhookSignature,
} = require("../utils/stripeHelper");

const router = express.Router();

// POST /api/payments/create-payment-intent
// Create a new payment intent for deposit
router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create Stripe customer if not exists
    if (!user.stripeCustomerId) {
      user.stripeCustomerId = await createStripeCustomer(user.email, user.name);
      await user.save();
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      user.stripeCustomerId,
      amount,
      "inr",
      description || "Wallet deposit"
    );

    // Create payment record in database
    const payment = await PaymentModel.create({
      userId: user._id,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: "inr",
      status: "pending",
      description: description || "Wallet deposit",
    });

    return res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: payment._id,
      amount,
      currency: "inr",
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
});

// POST /api/payments/confirm
// Confirm payment with saved card or new card details
router.post("/confirm", authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = await PaymentModel.findOne({
      stripePaymentIntentId: paymentIntentId,
      userId: req.user.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Confirm the payment intent
    const confirmedIntent = await confirmPaymentIntent(paymentIntentId, paymentMethodId);

    // Update payment status
    payment.status = confirmedIntent.status;
    if (confirmedIntent.status === "succeeded") {
      const user = await UserModel.findById(req.user.id);
      user.walletBalance += payment.amount;
      user.totalDeposited += payment.amount;
      await user.save();
    }
    await payment.save();

    return res.json({
      success: confirmedIntent.status === "succeeded",
      paymentIntentId: confirmedIntent.id,
      status: confirmedIntent.status,
      message:
        confirmedIntent.status === "succeeded"
          ? "Payment successful! Wallet credited."
          : "Payment processing...",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
});

// GET /api/payments/payment-intent/:intentId
// Get payment intent status
router.get("/payment-intent/:intentId", authMiddleware, async (req, res) => {
  try {
    const payment = await PaymentModel.findOne({
      stripePaymentIntentId: req.params.intentId,
      userId: req.user.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const stripeIntent = await retrievePaymentIntent(req.params.intentId);

    return res.json({
      paymentId: payment._id,
      stripePaymentIntentId: stripeIntent.id,
      status: stripeIntent.status,
      amount: payment.amount,
      currency: payment.currency,
      createdAt: payment.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment",
      error: error.message,
    });
  }
});

// GET /api/payments/history
// Get payment history for user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const payments = await PaymentModel.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await PaymentModel.countDocuments({ userId: req.user.id });

    return res.json({
      success: true,
      payments,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
});

// GET /api/payments/wallet
// Get user wallet balance and payment methods
router.get("/wallet", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select(
      "walletBalance totalDeposited stripeCustomerId paymentMethods"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let savedPaymentMethods = [];
    if (user.stripeCustomerId) {
      try {
        savedPaymentMethods = await listPaymentMethods(user.stripeCustomerId);
      } catch (e) {
        console.error("Error fetching payment methods:", e);
      }
    }

    return res.json({
      success: true,
      walletBalance: user.walletBalance,
      totalDeposited: user.totalDeposited,
      paymentMethods: savedPaymentMethods.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: {
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet",
      error: error.message,
    });
  }
});

// DELETE /api/payments/payment-method/:paymentMethodId
// Remove saved payment method
router.delete("/payment-method/:paymentMethodId", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ message: "User not found" });
    }

    await detachPaymentMethod(req.params.paymentMethodId);

    return res.json({
      success: true,
      message: "Payment method removed successfully",
    });
  } catch (error) {
    console.error("Error removing payment method:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove payment method",
      error: error.message,
    });
  }
});

// POST /api/payments/refund
// Refund a completed payment
router.post("/refund", authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment intent ID required" });
    }

    const payment = await PaymentModel.findOne({
      stripePaymentIntentId: paymentIntentId,
      userId: req.user.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "succeeded") {
      return res.status(400).json({ message: "Only succeeded payments can be refunded" });
    }

    const refund = await refundPayment(paymentIntentId, amount || payment.amount);

    // Update payment record
    payment.refund = {
      refundId: refund.id,
      refundedAt: new Date(),
      refundReason: "User requested",
    };
    await payment.save();

    // Deduct from wallet if partial/full refund
    const user = await UserModel.findById(req.user.id);
    user.walletBalance -= amount || payment.amount;
    await user.save();

    return res.json({
      success: true,
      message: "Refund processed successfully",
      refundId: refund.id,
      amount: (refund.amount / 100).toFixed(2),
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message,
    });
  }
});

// POST /api/payments/webhook
// Stripe webhook handler
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({ message: "Webhook secret not configured" });
  }

  try {
    const event = verifyWebhookSignature(req.body, signature, webhookSecret);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const payment = await PaymentModel.findOne({
          stripePaymentIntentId: paymentIntent.id,
        });

        if (payment) {
          payment.status = "succeeded";
          await payment.save();

          const user = await UserModel.findById(payment.userId);
          if (user && !user.walletBalance || user.walletBalance < payment.amount) {
            user.walletBalance += payment.amount;
            user.totalDeposited += payment.amount;
            await user.save();
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const payment = await PaymentModel.findOne({
          stripePaymentIntentId: paymentIntent.id,
        });

        if (payment) {
          payment.status = "failed";
          payment.failureReason = paymentIntent.last_payment_error?.message || "Unknown error";
          await payment.save();
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const payment = await PaymentModel.findOne({
          stripePaymentIntentId: charge.payment_intent,
        });

        if (payment && charge.refunded) {
          payment.refund = {
            refundId: charge.refunds.data[0]?.id,
            refundedAt: new Date(),
          };
          await payment.save();
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ error: "Webhook error" });
  }
});

module.exports = router;
