const mongoose = require("mongoose");

// Create a schema

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
