require('dotenv').config();
const generateVerificationCode = require("../utils/generateCode"); 
const sendVerificationEmail = require("../services/emailService");
const Verification = require('../models/Verification');
const jwt = require('jsonwebtoken');


const requestVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate a 6-digit verification code
  const code = generateVerificationCode();

  try {
    // Save the code and email in the database
    await Verification.create({ email, code });
    console.log('Verification saved successfully.');

    // Send the email
    await sendVerificationEmail(email, code);
    console.log('Verification email sent successfully.');

    // Generate a JWT for the user
    const token = jwt.sign(
      { email, purpose: "verification" }, // Payload
      process.env.VERIFICATION_TOKEN_SECRET, // Secret
      { expiresIn: "15m" } // Token expiration
    );

    // Respond to the client with success and the JWT
    return res.status(200).json({
      message: "Verification code sent successfully.",
      token, // Include JWT in the response
    });
  } catch (error) {
    console.error("Error sending verification email:", error);

    // If saving or sending fails, clean up the verification record
    try {
      await Verification.deleteOne({ email });
      console.log("Verification record deleted.");
    } catch (deleteError) {
      console.error("Error deleting verification record:", deleteError);
    }

    return res.status(500).json({ message: "Failed to send verification code." });
  }
};

module.exports = { requestVerification };

