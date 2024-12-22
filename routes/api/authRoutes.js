const express = require("express");
const sendVerificationEmail = require("../services/emailService");
const generateVerificationCode = require("../utils/generateVerificationCode");

const router = express.Router();

// Endpoint to send a verification email
router.post("/send-verification-email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const code = generateVerificationCode(); // Generate a random 6-digit code

  try {
    await sendVerificationEmail(email, code);
    res.status(200).json({ message: "Verification email sent successfully", code });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;
