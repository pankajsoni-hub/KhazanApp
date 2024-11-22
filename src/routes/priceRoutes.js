const express = require("express");
const {
  fetchRealTimePrice,
  updateDailyPriceHistory,
} = require("../controllers/priceController");
const router = express.Router();
router.get("/fetch", fetchRealTimePrice);
router.post("/update-history", updateDailyPriceHistory);
module.exports = router;
