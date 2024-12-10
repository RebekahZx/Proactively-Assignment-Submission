const express = require('express');
const { registerUser, loginUser, verifyOtp } = require('../controllers/userController');

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// OTP verification
router.post('/verify-otp', verifyOtp);

module.exports = router;
