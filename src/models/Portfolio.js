const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Stock", "Crypto", "Bond", "Real Estate"], required: true },
  amountInvested: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
});

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assets: [assetSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
