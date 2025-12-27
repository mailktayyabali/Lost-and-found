const express = require('express');
const router = express.Router();
const {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkMatches,
} = require('../controllers/searchAlertController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const { validateSearchAlert, validateMongoId } = require('../utils/validation');

// All routes are protected
router.use(authenticate);

router.get('/', apiLimiter, getAlerts);
router.post('/', createLimiter, validateSearchAlert, createAlert);
router.put('/:id', createLimiter, validateMongoId, validateSearchAlert, updateAlert);
router.delete('/:id', apiLimiter, validateMongoId, deleteAlert);
router.get('/:id/check-matches', apiLimiter, validateMongoId, checkMatches);

module.exports = router;

