const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures that the username is unique
      trim: true,   // Removes leading and trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures that the email is unique
      lowercase: true, // Automatically converts email to lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Validates email format
    },
    password: {
      type: String,
      required: true,
      minlength: 4, // Password should have at least 6 characters
    },
    // You can add more fields like the following, for example:
    resetToken: { type: String }, // Optional field for storing reset token
    resetTokenExpiry: { type: Date }, // Optional field for token expiration
    
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the created date to now
    },
    // You can add more fields like profile picture, bio, etc.
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
