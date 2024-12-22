const bcrypt = require("bcrypt");
const User = require("../models/User");

const resetPassword = async (req, res) => {
    console.log('we reached here')
    const { token, password } = req.body;
    console.log(token, password)

    // Validate inputs
    if (!password || !password.trim()) {
        return res.status(400).json({ message: "Password is required." });
    }
    if (!token) {
        return res.status(400).json({ message: "Reset token is required." });
    }

    try {
        // Find user by token and ensure token hasn't expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Ensure token is valid
        });
        console.log(user)

        if (!user) {
            console.log('we stopped here because fuckboi reset token expiry is fucking us up')
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password and clear the reset token and expiry
        user.password = hashedPassword;
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpiry = undefined; // Clear token expiry
        await user.save(); // Save changes to the database

        return res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = resetPassword;
