require("dotenv").config(); // Load environment variables
const express = require("express");
const rateLimit = require('express-rate-limit')
const connectDB = require("./src/models/db");
const authRoutes = require("./src/routes/authRoutes");
const goalRoutes = require("./src/routes/goalRoutes");
const portfolioRoutes = require("./src/routes/portfolioRoutes");
const priceRoutes = require("./src/routes/priceRoutes");

const bodyParser = require("body-parser");

const morgan = require("morgan");
const cors = require("cors");
const app = express()
const globalRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, 
    message: {
      status: 429,
      error: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false, 
  });
// Routes
app.use(express.json());
app.use(bodyParser.json()); 
app.use(cors()); 
app.use(morgan("dev")); 
app.use(globalRateLimiter);

app.use("/auth", authRoutes);
app.use("/goals", goalRoutes);
app.use("/", portfolioRoutes);
app.use("/price", priceRoutes);
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
  });
 app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
