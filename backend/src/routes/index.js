const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const itemRoutes = require('./itemRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const messageRoutes = require('./messageRoutes');
const searchAlertRoutes = require('./searchAlertRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const claimRoutes = require('./claimRoutes');
const notificationRoutes = require('./notificationRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/messages', messageRoutes);
router.use('/alerts', searchAlertRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/claims', claimRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;

