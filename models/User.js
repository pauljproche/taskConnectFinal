const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String, // Google ID for OAuth
  displayName: String,
  email: String,
  // Other user fields...
});

module.exports = mongoose.model('User', userSchema);
