import Flag from '../models/Flag.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

// Create a new flag
const createFlag = async (req, res, next) => {
  try {
    const { targetItemId, targetUserId, reason } = req.body;
    const reporterId = req.user.id;

    if (!targetItemId && !targetUserId) {
      return sendError(res, 'Must report either an item or a user', 400);
    }

    if (targetItemId) {
      const item = await Item.findById(targetItemId);
      if (!item) throw new NotFoundError('Item');
    }

    if (targetUserId) {
      const user = await User.findById(targetUserId);
      if (!user) throw new NotFoundError('User');
    }

    const flag = await Flag.create({
      reporter: reporterId,
      targetItem: targetItemId,
      targetUser: targetUserId,
      reason,
    });

    // Auto-ban item if it receives 5 or more pending reports
    if (targetItemId) {
        const reportCount = await Flag.countDocuments({ 
            targetItem: targetItemId, 
            status: 'PENDING' 
        });

        if (reportCount >= 5) {
            await Item.findByIdAndUpdate(targetItemId, { isBanned: true });
        }
    }

    sendSuccess(res, 'Report submitted successfully', { flag }, 201);
  } catch (error) {
    next(error);
  }
};

export {
  createFlag,
};
