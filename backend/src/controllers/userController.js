const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const { sendSuccess } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');
const { transformUser, transformItems } = require('../utils/transformers');

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User');
    }

    sendSuccess(res, 'User profile retrieved successfully', { user: transformUser(user) });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
const getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const [
      totalItems,
      lostItems,
      foundItems,
      resolvedPostedItems,
      approvedClaims,
      totalFavorites,
      totalReviews,
    ] = await Promise.all([
      Item.countDocuments({ postedBy: userId }),
      Item.countDocuments({ postedBy: userId, status: 'LOST' }),
      Item.countDocuments({ postedBy: userId, status: 'FOUND' }),
      Item.countDocuments({ postedBy: userId, isResolved: true }),
      Claim.countDocuments({ claimantId: userId, status: 'approved' }),
      Favorite.countDocuments({ user: userId }),
      Review.countDocuments({ reviewee: userId }),
    ]);

    const stats = {
      totalItems,
      lostItems,
      foundItems,
      resolvedItems: resolvedPostedItems + approvedClaims,
      totalFavorites,
      totalReviews,
      rating: user.rating,
      totalRatings: user.totalRatings,
      memberSince: user.memberSince,
    };

    sendSuccess(res, 'User statistics retrieved successfully', { stats });
  } catch (error) {
    next(error);
  }
};

// Get user's items
const getUserItems = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { postedBy: userId };
    if (status) {
      query.status = status.toUpperCase();
    }

    const items = await Item.find(query)
      .populate('postedBy', 'name username avatar rating verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    sendSuccess(res, 'User items retrieved successfully', {
      items: transformItems(items),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getUserStats,
  getUserItems,
};

