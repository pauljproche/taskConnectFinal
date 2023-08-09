const express = require("express");
const { updateUserEmail, updateUsername, updatePassword, registerUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/auth"); 
const router = express.Router();

// Update user's email
router.route('/userControllers').post(protect, updateUserEmail);

// Update user's username
router.route('/userControllers').post(protect, updateUsername);

// Update user's password
router.route('/userControllers').post(protect, updatePassword);

// Register a new user
router.route('/userControllers').post(registerUser);

module.exports = router;
