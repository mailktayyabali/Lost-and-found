import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { sendSuccess } from '../utils/response.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.js';

// Create a new claim request
const createClaim = async (req, res, next) => {
  try {
    const { itemId, message } = req.body;
    const claimantId = req.user.id;

    const item = await Item.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item');
    }

    // Prevent claiming own item
    if (item.postedBy.toString() === claimantId) {
      throw new BadRequestError('You cannot claim your own item');
    }

    // Check if any pending claim exists for this item
    const existingPendingClaim = await Claim.findOne({ itemId, status: 'pending' });
    if (existingPendingClaim) {
      throw new BadRequestError('This item already has a pending claim request');
    }

    // Check if already claimed by this user
    // Check if already claimed by this user
    let claim = await Claim.findOne({ itemId, claimantId });

    if (claim) {
      if (claim.status === 'pending') {
        throw new BadRequestError('You already have a pending request for this item');
      }
      if (claim.status === 'approved') {
        throw new BadRequestError('You have already successfully claimed this item');
      }
      
      // If status is 'rejected', allow re-submission
      if (claim.status === 'rejected') {
        claim.status = 'pending';
        claim.message = message;
        await claim.save();
        return sendSuccess(res, 'Request re-submitted successfully', { claim }, 200);
      }
    }

    claim = await Claim.create({
      itemId,
      claimantId,
      posterId: item.postedBy,
      message,
      status: 'pending',
    });

    sendSuccess(res, 'Claim submitted successfully', { claim }, 201);
  } catch (error) {
    next(error);
  }
};

// Get claims for a specific item (Poster only)
const getClaimsByItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    
    if (!item) {
      throw new NotFoundError('Item');
    }

    // specific check: only poster can see claims
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to view claims for this item');
    }

    const claims = await Claim.find({ itemId })
      .populate('claimantId', 'name email avatar username verified')
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Claims retrieved successfully', { claims });
  } catch (error) {
    next(error);
  }
};

// Update claim status (Approve/Reject)
const updateClaimStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      throw new BadRequestError('Invalid status. Must be approved or rejected');
    }

    const claim = await Claim.findById(id);
    if (!claim) {
      throw new NotFoundError('Claim');
    }

    // Verify authorized user (must be the poster)
    if (claim.posterId.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to manage this claim');
    }

    // If approving, we need to handle other claims and the item status
    if (status === 'approved') {
      // 1. Update this claim
      claim.status = 'approved';
      await claim.save();

      // 2. Reject all other pending claims for this item
      await Claim.updateMany(
        { itemId: claim.itemId, _id: { $ne: claim._id }, status: 'pending' },
        { status: 'rejected' }
      );

      // 3. Update the Item status to CLAIMED/RESOLVED
      const item = await Item.findById(claim.itemId);
      if (item) {
        item.isResolved = true;
        item.resolvedBy = claim.claimantId; // The person who successfully claimed it
        item.resolvedAt = new Date();
        await item.save();
      }
    } else {
      // Just reject this claim
      claim.status = 'rejected';
      await claim.save();
    }

    sendSuccess(res, `Claim ${status} successfully`, { claim });
  } catch (error) {
    next(error);
  }
};

// Get my claims (as a claimant)
const getMyClaims = async (req, res, next) => {
    try {
        const claims = await Claim.find({ claimantId: req.user.id })
            .populate('itemId', 'title images status')
            .sort({ createdAt: -1 });
            
        sendSuccess(res, 'My claims retrieved successfully', { claims });
    } catch (error) {
        next(error);
    }
};

// Get claims received (as a poster)
const getClaimsReceived = async (req, res, next) => {
    try {
        const claims = await Claim.find({ posterId: req.user.id, status: 'pending' })
            .populate('itemId', 'title images status')
            .populate('claimantId', 'name email avatar username verified')
            .sort({ createdAt: -1 });
            
        sendSuccess(res, 'Received claims retrieved successfully', { claims });
    } catch (error) {
        next(error);
    }
};

export {
  createClaim,
  getClaimsByItem,
  updateClaimStatus,
  getMyClaims,
  getClaimsReceived
};
