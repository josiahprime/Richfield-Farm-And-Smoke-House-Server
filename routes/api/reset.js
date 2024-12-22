const express = require('express');
const router = express.Router();

const requestPasswordResetController = require('../../controllers/requestPasswordResetController');
const resetPasswordController = require('../../controllers/resetPasswordController');
const verifyResetTokenController = require('../../controllers/verifyResetTokenController');

router.post('/request-verification', requestPasswordResetController);
// router.post('/request-verification', requestPasswordResetController); // Direct function import
router.post('/verify-token', verifyResetTokenController);

router.post('/reset-password', resetPasswordController); // Direct function import

module.exports = router;
