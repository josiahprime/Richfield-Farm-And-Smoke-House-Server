const Verification = require("../models/Verification");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { handleLogin } = require("./loginController");

const verifyAndCreateUser = async (req, res) => {
  const { email, code, password, username } = req.body;
  console.log({
    email,
    password,
    username,
    code
  });
  

  if (!email || !code || !password) {
    return res.status(400).json({ message: "Email code and password are required." });
  }

  try {
    // Step 1: Verify the code
    const verification = await Verification.findOne({ email, code });
    if (!verification) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Step 3: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create the user
    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    

    // Step 5: Remove the verification record
    await Verification.deleteOne({ email });

    console.log('now we want to handle login')
    const tokens = await handleLogin(null, null, username, hashedPassword);

    
    if (tokens) {
        const { accessToken, refreshToken } = tokens;
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 });
        // Respond with success
        return res.status(201).json({ 
          accessToken,
          user: {
            id: User._id,
            email: User.email,
            username: User.username,
            // role: User.role, // Include additional fields as needed
          },
           message: "User created successfully." });
    }

    
  } catch (error) {
    console.error("Error creating user:", error);

    // Respond with a generic error message
    res.status(500).json({ message: "Failed to create user. Please try again later." });
  }
};

module.exports = { verifyAndCreateUser };


