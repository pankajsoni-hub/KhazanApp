const Portfolio = require("../models/Portfolio");
const createPortfolio = async (req, res) => {
    const { name } = req.body;
  
    try {
      const portfolio = await Portfolio.create({
        name,
        user: req.user.id,
      });
  
      res.status(201).json({ message: "Portfolio created successfully", portfolio });
    } catch (error) {
      res.status(500).json({ error: "Failed to create portfolio", details: error.message });
    }
};
const addAssetToPortfolio = async (req, res) => {
    const { id } = req.params;
    const { name, type, amountInvested, purchaseDate } = req.body;
  
    try {
      const portfolio = await Portfolio.findOne({ _id: id, user: req.user.id });
  
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found or unauthorized" });
      }
  
      portfolio.assets.push({ name, type, amountInvested, purchaseDate });
      await portfolio.save();
  
      res.status(200).json({ message: "Asset added successfully", portfolio });
    } catch (error) {
      res.status(500).json({ error: "Failed to add asset", details: error.message });
    }
};
const getPortfolios = async (req, res) => {
    try {
      const portfolios = await Portfolio.find({ user: req.user.id }).populate("user");
  
      res.status(200).json(portfolios);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolios", details: error.message });
    }
};
const getPortfolioSummary = async (req, res) => {
    try {
      const portfolios = await Portfolio.find({ user: req.user.id });
  
      const summary = portfolios.reduce((acc, portfolio) => {
        portfolio.assets.forEach((asset) => {
          acc.totalInvestments += asset.amountInvested;
          acc.assetTypes[asset.type] = (acc.assetTypes[asset.type] || 0) + asset.amountInvested;
        });
        return acc;
      }, { totalInvestments: 0, assetTypes: {} });
  
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio summary", details: error.message });
    }
};
module.exports = {
  createPortfolio,
  addAssetToPortfolio,
  getPortfolios,
  getPortfolioSummary,
};
