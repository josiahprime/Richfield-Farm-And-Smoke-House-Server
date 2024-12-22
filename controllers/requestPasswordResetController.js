const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendResetLink = require('../services/sendResetPasswordLink')

const requestVerification = async (req, res) => {
    console.log('we reached this file')
    const { email } = req.body;
    console.log(email)
    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }
    const allUsers = await User.find(); // Retrieves all users in the database
    console.log(allUsers);
    try {
        // Find the user
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            console.log('user not found')
            return res.status(404).json({ message: "User not found." });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userInfo: { email: foundUser.email } },
            process.env.RESET_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log('we reached sending link')
        // Send the email with the reset link
        await sendResetLink(foundUser.email, foundUser.username, resetLink);



        

        // Optionally, save the token in the database (recommended)
        foundUser.resetToken = resetToken; // Assuming your User model has a resetToken field
        foundUser.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
        await foundUser.save();

        // Send success response (but not the token itself for better security)
        return res.status(200).json({ message: "Reset token generated and sent to the email." });
    } catch (error) {
        console.error("Error during password reset request:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = requestVerification;
