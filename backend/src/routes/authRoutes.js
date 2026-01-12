const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,

  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateUserRegistration,
  validateUserLogin,
} = require('../utils/validation');

// Public routes
router.post('/register', authLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/google', authLimiter, googleLogin);

// Protected routes
router.get('/me', authenticate, getMe);

router.put('/password', authenticate, changePassword);

module.exports = router;

