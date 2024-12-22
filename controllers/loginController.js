const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleLogin = async (req, res, username = null, hashedPassword = null) => {
    console.log('we reached here')
    let user;
    let pwd;

    // If username and hashedPassword are provided, use them
    if (username && hashedPassword) {
        user = username;
        pwd = hashedPassword;
    } else {
        // Otherwise, use req.body for regular login flow
        const { username: reqUsername, pwd: reqPwd } = req.body;
        console.log(req.body)
        if (!reqUsername || !reqPwd) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        user = reqUsername;
        pwd = reqPwd;
    }

    try {
        // Find the user
        const foundUser = await User.findOne({ username: user });
        if (!foundUser) {
            return res.sendStatus(401); // Unauthorized
        }

        // If the password is already hashed (signup scenario), skip bcrypt.compare
        const match = hashedPassword
            ? pwd === foundUser.password
            : await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            const accessToken = jwt.sign(
                { userInfo: { username: foundUser.username } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );
            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            // Update the user with the new refresh token
            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            // If called via signup, return the token instead of sending a response
            if (username && hashedPassword) {
                return { accessToken, refreshToken };
            }

            // Regular login flow
            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.json({ accessToken });
        } else {
            return res.sendStatus(401); // Unauthorized
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {handleLogin}
