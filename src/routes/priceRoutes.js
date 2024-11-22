const express = require("express");
const {
  fetchRealTimePrice,
  updateDailyPriceHistory,
} = require("../controllers/priceController");

const router = express.Router();

// Fetch real-time price of an asset
router.get("/fetch", fetchRealTimePrice);

// Update daily price history
router.post("/update-history", updateDailyPriceHistory);

module.exports = router;
