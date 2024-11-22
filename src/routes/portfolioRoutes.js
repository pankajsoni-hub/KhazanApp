const express = require("express");
const {
  createPortfolio,
  addAssetToPortfolio,
  getPortfolios,
  getPortfolioSummary,
} = require("../controllers/portfolioController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/portfolio", authenticate, createPortfolio); // Create a portfolio
router.post("/portfolio/:id/assets", authenticate, addAssetToPortfolio); // Add asset
router.get("/portfolio", authenticate, getPortfolios); // Fetch all portfolios
router.get("/portfolio/summary", authenticate, getPortfolioSummary); // Portfolio summary

module.exports = router;
