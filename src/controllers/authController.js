const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password, name, dob, monthlyIncome } = req.body;
  try {
    const user = await User.create({ email, password, name, dob, monthlyIncome });
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", details: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

const getAllProfiles = async (req, res) => {
    
    try {
      const users = await User.find(); // Get all users from the database
      console.log(users)
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      res.status(200).json({
        status: "success",
        data: users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving users" });
    }
  };
  const updateProfileById = async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
  
      // Optionally check if the authenticated user is updating their own profile or is an admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "You do not have permission to update this profile" });
      }
  
      // Find and update the user by ID
      const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        status: "success",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating profile" });
    }
  };
  
  // Delete profile by ID
  const deleteProfileById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Optionally check if the authenticated user is deleting their own profile or is an admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "You do not have permission to delete this profile" });
      }
  
      // Find and delete the user by ID
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        status: "success",
        message: "User profile deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting profile" });
    }
  };
module.exports = { register, login, updateProfileById,getAllProfiles ,deleteProfileById};
