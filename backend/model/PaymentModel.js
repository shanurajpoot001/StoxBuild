const mongoose = require("mongoose");
const { PaymentSchema } = require("../schemas/PaymentSchema");

const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

module.exports = { PaymentModel };
