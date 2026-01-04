const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5000, // Relaxed for debugging (was 100)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500, // Relaxed for debugging (was 5)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create/Update endpoints rate limiter
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 1000, // Relaxed (was 20)
  message: {
    success: false,
    message: 'Too many create/update requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  createLimiter,
};

