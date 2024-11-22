const axios = require("axios");
const PriceHistory = require("../models/PriceHistory");

const getApiUrl = (asset, type) => {
  if (type === "Crypto") {
    return `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd`;
  }
  if (type === "Stock") {
    return `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${asset}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  }
  if (type === "Forex") {
    return `https://api.exchangerate.host/latest?base=${asset}`;
  }
  throw new Error(`Unsupported type: ${type}`);
};

const fetchRealTimePrice = async (req, res) => {
  const { asset, type } = req.query;

  try {
    const apiUrl = getApiUrl(asset, type);
    const response = await axios.get(apiUrl);

    let price;
    if (type === "Crypto") {
      price = response.data[asset.toLowerCase()]?.usd;
    } else if (type === "Stock") {
      price = response.data["Global Quote"]?.["05. price"];
    } else if (type === "Forex") {
      price = response.data.rates?.USD; // Convert to USD
    }

    if (!price) {
      return res.status(404).json({ error: `Price for asset ${asset} not found` });
    }

    res.status(200).json({
      message: "Real-time price fetched successfully",
      asset,
      price,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch real-time price",
      details: error.message,
    });
  }
};

// Update daily price history
const updateDailyPriceHistory = async (req, res) => {
  const { asset, type } = req.body;

  try {
    const apiUrl = getApiUrl(asset, type);
    const response = await axios.get(apiUrl);

    let price;
    if (type === "Crypto") {
      price = response.data[asset.toLowerCase()]?.usd;
    } else if (type === "Stock") {
      price = response.data["Global Quote"]?.["05. price"];
    } else if (type === "Forex") {
      price = response.data.rates?.USD;
    }

    if (!price) {
      return res.status(404).json({ error: `Price for asset ${asset} not found` });
    }

    // Save to database
    const priceHistory = new PriceHistory({
      asset,
      type,
      price,
    });

    await priceHistory.save();
    res.status(201).json({ message: "Price history updated", priceHistory });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update price history",
      details: error.message,
    });
  }
};

module.exports = { fetchRealTimePrice, updateDailyPriceHistory };
