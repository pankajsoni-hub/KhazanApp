const express = require("express");
const { register, login,deleteProfileById, updateProfileById,getAllProfiles } = require("../controllers/authController");

const { authenticate } = require("../middlewares/authMiddleware");
const rateLimit = require('express-rate-limit');
const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many login attempts, please try again later.',
  });
  const ipRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per 15 minutes for /register and /login
    message: {
      status: 429,
      error: 'Too many requests from this IP, please try again later.',
    },
    keyGenerator: (req) => req.ip, // Use IP address as the key for rate limiting
    standardHeaders: true, // Include rate-limit info in the response headers
    legacyHeaders: false, // Disable legacy headers like X-RateLimit-*
  });

router.post("/register",ipRateLimiter, register);
router.post("/login",loginLimiter,ipRateLimiter, login);
router.put("/profile/:id", authenticate, updateProfileById); 
router.delete("/profile/:id", authenticate, deleteProfileById); 
router.get("/profiles", authenticate, getAllProfiles);
module.exports = router;
