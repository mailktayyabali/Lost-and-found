import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createClaim,
  getClaimsByItem,
  updateClaimStatus,
  getMyClaims,
  getClaimsReceived
} from '../controllers/claimController.js';

const router = express.Router();

// protect all routes
router.use(authenticate);

router.post('/', createClaim);
router.get('/my-claims', getMyClaims);
router.get('/received', getClaimsReceived);
router.get('/item/:itemId', getClaimsByItem);
router.patch('/:id/status', updateClaimStatus);

export default router;
