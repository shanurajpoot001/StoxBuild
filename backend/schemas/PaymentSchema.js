const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripePaymentIntentId: { type: String, unique: true, required: true },
    stripeSessionId: { type: String, default: null },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "inr", lowercase: true },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "canceled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "card" },
    description: { type: String, default: "Wallet deposit" },
    metadata: {
      transactionType: { type: String, default: "deposit" },
      customData: mongoose.Schema.Types.Mixed,
    },
    failureReason: { type: String, default: null },
    receipt: {
      receiptUrl: String,
      receiptNumber: String,
    },
    refund: {
      refundId: String,
      refundedAt: Date,
      refundReason: String,
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });

module.exports = { PaymentSchema };
