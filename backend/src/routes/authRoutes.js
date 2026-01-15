import express from 'express';
const router = express.Router();
import {
  register,
  login,
  getMe,

  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  validateUserRegistration,
  validateUserLogin,
} from '../utils/validation.js';

// Public routes
router.post('/register', authLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/google', authLimiter, googleLogin);

// Protected routes
router.get('/me', authenticate, getMe);

router.put('/password', authenticate, changePassword);

export default router;

