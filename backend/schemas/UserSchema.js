const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    stripeCustomerId: { type: String, default: null },
    walletBalance: { type: Number, default: 0, min: 0 },
    totalDeposited: { type: Number, default: 0, min: 0 },
    paymentMethods: [
      {
        stripePaymentMethodId: String,
        type: { type: String, enum: ["card"], default: "card" },
        isDefault: Boolean,
        lastFour: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number,
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

module.exports = { UserSchema };


