const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model

const verifyResetToken = async (req, res) => {
    // console.log('we reached here');
    const { token } = req.body; // Token sent from the frontend
    // console.log(token);

    if (!token) {
        return res.status(400).json({ message: "Token is required." });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
        // if (decoded) {
        //     console.log('decoded');
        // }
        const email = decoded.userInfo.email;
        // console.log(email);

        // Check if the token exists in the database
        const foundUser = await User.findOne({ email });
        // console.log(foundUser);

        if (!foundUser || foundUser.resetToken !== token) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        // Return success if token is valid
        if (foundUser) {
            return res.status(200).json({ message: "Token is valid. Access granted.", isValid: true });
        } else {
            return res.status(200).json({ isValid: false });
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyResetToken;
