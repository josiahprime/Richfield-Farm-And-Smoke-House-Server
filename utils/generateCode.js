const generateVerificationCode = () => {
    // Generate a 6-digit random code
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  module.exports = generateVerificationCode;
  