const cron = require("node-cron");
const axios = require("axios");
const { storeDailyPrice } = require("../controllers/marketDataController");

const assetsToTrack = ["bitcoin", "ethereum", "dogecoin"]; // Add more assets as needed

const updateDailyPrices = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily price update...");

    for (const asset of assetsToTrack) {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          { params: { ids: asset, vs_currencies: "usd" } }
        );

        const price = response.data[asset]?.usd;
        if (price) {
          await storeDailyPrice(asset, price);
        }
      } catch (error) {
        console.error(`Failed to fetch daily price for ${asset}:`, error.message);
      }
    }
  });
};

module.exports = { updateDailyPrices };
