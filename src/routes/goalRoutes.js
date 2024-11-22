const express = require("express");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a goal
router.post("/goal", authenticate, createGoal);

// Fetch all goals with optional filtering
router.get("/", authenticate, getGoals); // Adjusted route to make "GET /goals" the base route

// Update a specific goal
router.put("/:id", authenticate, updateGoal); // Adjusted to use "/:id" instead of "/goal/:id"

// Delete a specific goal
router.delete("/:id", authenticate, deleteGoal); // Adjusted to use "/:id" instead of "/goal/:id"

module.exports = router;
