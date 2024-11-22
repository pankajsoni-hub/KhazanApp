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

// Middleware

const globalRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each user to 100 requests per hour
    message: {
      status: 429,
      error: 'Too many requests, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
  });
// Routes
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan("dev")); // Log HTTP requests
app.use(globalRateLimiter);

app.use("/auth", authRoutes);
app.use("/goals", goalRoutes);
app.use("/", portfolioRoutes);
app.use("/price", priceRoutes);
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
  });
  
  // Global Error Handler
 app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
// Connect to database and start server
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
