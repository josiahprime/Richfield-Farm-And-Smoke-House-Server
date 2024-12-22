const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');
const verifyAndCreateUser = require('../../controllers/verifyAndCreateUserController'); // Ensure correct import
const verifyVerificationToken = require('../../controllers/middleware/verifyJwt'); // Import middleware

// Route to request verification code
router.post('/request-verification', registerController.requestVerification);

// Route to verify token, then verify the code and create the user
router.post('/verify-user', verifyVerificationToken.verifyJwt, verifyAndCreateUser.verifyAndCreateUser);

module.exports = router;
