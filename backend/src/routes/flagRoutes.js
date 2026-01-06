const express = require('express');
const router = express.Router();
const { createFlag } = require('../controllers/flagController');
const { authenticate } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// Create a new flag
router.post('/', createFlag);

module.exports = router;
