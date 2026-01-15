import express from 'express';
const router = express.Router();

// Import all route files
import authRoutes from './authRoutes.js';
import itemRoutes from './itemRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import messageRoutes from './messageRoutes.js';
import searchAlertRoutes from './searchAlertRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import claimRoutes from './claimRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import flagRoutes from './flagRoutes.js';

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
router.use('/flags', flagRoutes);

export default router;

