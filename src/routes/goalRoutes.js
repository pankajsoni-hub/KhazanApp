const express = require("express");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/goal", authenticate, createGoal);


router.get("/", authenticate, getGoals); 

// Update a specific goal
router.put("/:id", authenticate, updateGoal); 

// Delete a specific goal
router.delete("/:id", authenticate, deleteGoal); 

module.exports = router;
