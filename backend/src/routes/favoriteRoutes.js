const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateMongoId } = require('../utils/validation');

// All routes are protected
router.use(authenticate);

router.get('/', apiLimiter, getFavorites);
router.post('/:itemId', apiLimiter, validateMongoId, addFavorite);
router.delete('/:itemId', apiLimiter, validateMongoId, removeFavorite);
router.get('/check/:itemId', apiLimiter, validateMongoId, checkFavorite);

module.exports = router;

