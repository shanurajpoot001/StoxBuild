const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  amount: Number,
  status: { type: String, default: "EXECUTED" },
  paymentMethod: { type: String, default: "Funds" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };
