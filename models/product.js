const mongoose = require("mongoose");

const ProductsSchema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image_src: { type: String, required: true },
category: { type: String, required: false },
 type: { type: String, required: true },
});

module.exports = mongoose.model("Products", ProductsSchema);