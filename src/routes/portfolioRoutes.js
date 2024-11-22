const express = require("express");
const {
  createPortfolio,
  addAssetToPortfolio,
  getPortfolios,
  getPortfolioSummary,
} = require("../controllers/portfolioController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/portfolio", authenticate, createPortfolio); 
router.post("/portfolio/:id/assets", authenticate, addAssetToPortfolio); 
router.get("/portfolio", authenticate, getPortfolios);
router.get("/portfolio/summary", authenticate, getPortfolioSummary); 

module.exports = router;
