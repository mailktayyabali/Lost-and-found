import express from 'express';
const router = express.Router();
import { createFlag } from '../controllers/flagController.js';
import { authenticate } from '../middleware/auth.js';

// Protect all routes
router.use(authenticate);

// Create a new flag
router.post('/', createFlag);

export default router;
