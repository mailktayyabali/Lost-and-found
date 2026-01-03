const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  createClaim,
  getClaimsByItem,
  updateClaimStatus,
  getMyClaims
} = require('../controllers/claimController');

const router = express.Router();

// protect all routes
router.use(authenticate);

router.post('/', createClaim);
router.get('/my-claims', getMyClaims);
router.get('/item/:itemId', getClaimsByItem);
router.patch('/:id/status', updateClaimStatus);

module.exports = router;
