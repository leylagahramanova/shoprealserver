const mongoose = require("mongoose");
const User = require("../models/user");

const Product = mongoose.Schema({
  productID: { type: String },
  title: { type: String },
  price: { type: Number },
  orderQuantity: { type: Number },
});

const OrdersSchema = mongoose.Schema(
  {
    userID: { type: mongoose.ObjectId, ref: "user" },
    orderProducts: { type: [Product] },
    totalMoney: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrdersSchema);