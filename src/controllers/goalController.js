const Goal = require("../models/Goal");

// POST /goals: Create a financial goal
const createGoal = async (req, res) => {
    const { title, targetAmount, currentSavings, targetDate } = req.body;
  
    try {
      const goal = await Goal.create({
        title,
        targetAmount,
        currentSavings,
        targetDate,
        user: req.user.id, // Link goal to the user
      });
  
      // Populate the user field
      const populatedGoal = await Goal.findById(goal._id).populate("user");
  
      res.status(201).json({ message: "Goal created successfully", goal: populatedGoal });
    } catch (error) {
      res.status(500).json({ error: "Failed to create goal", details: error.message });
    }
  };
  

// GET /goals: Fetch all financial goals for the logged-in user
const getGoals = async (req, res) => {
  const { timeHorizon } = req.query;

  try {
    let filter = { user: req.user.id };

    // Apply time horizon filtering if provided
    if (timeHorizon === "short-term") {
      filter.targetDate = { $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) };
    } else if (timeHorizon === "long-term") {
      filter.targetDate = { $gt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) };
    }

    const goals = await Goal.find(filter);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals", details: error.message });
  }
};

// PUT /goals/:id: Update a specific financial goal
const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, targetAmount, currentSavings, targetDate } = req.body;

  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, targetAmount, currentSavings, targetDate },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal", details: error.message });
  }
};

// DELETE /goals/:id: Delete a specific financial goal
const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete goal", details: error.message });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
};
