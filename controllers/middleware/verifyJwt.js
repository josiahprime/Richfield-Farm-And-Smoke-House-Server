const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log('auth header present')
  }
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header is missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Add user info from token payload to request object
    next();
  });
};

module.exports = {verifyJwt};
