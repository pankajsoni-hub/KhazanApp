const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  asset: { type: String, required: true },
  type: { type: String, required: true, enum: ["Stock", "Crypto", "Forex"] },
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
