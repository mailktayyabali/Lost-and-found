const User = require('../models/User');
const Item = require('../models/Item');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const SearchAlert = require('../models/SearchAlert');
const { sendSuccess, sendError } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { transformUser, transformItems } = require('../utils/transformers');

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalItems,
      totalLostItems,
      totalFoundItems,
      resolvedItems,
      activeItems,
      totalReviews,
      totalFavorites,
      totalConversations,
      totalMessages,
      activeAlerts,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ status: 'LOST' }),
      Item.countDocuments({ status: 'FOUND' }),
      Item.countDocuments({ isResolved: true }),
      Item.countDocuments({ isResolved: false }),
      Review.countDocuments(),
      Favorite.countDocuments(),
      Conversation.countDocuments(),
      Message.countDocuments(),
      SearchAlert.countDocuments({ active: true }),
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      newUsers,
      newItems,
      newMessages,
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Item.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Message.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        new: newUsers,
      },
      items: {
        total: totalItems,
        lost: totalLostItems,
        found: totalFoundItems,
        resolved: resolvedItems,
        active: activeItems,
        new: newItems,
      },
      reviews: {
        total: totalReviews,
      },
      favorites: {
        total: totalFavorites,
      },
      conversations: {
        total: totalConversations,
      },
      messages: {
        total: totalMessages,
        new: newMessages,
      },
      alerts: {
        active: activeAlerts,
      },
    };

    sendSuccess(res, 'Dashboard statistics retrieved successfully', { stats });
  } catch (error) {
    next(error);
  }
};

// Get all users with pagination
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { role, search } = req.query;

    const query = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    sendSuccess(res, 'Users retrieved successfully', {
      users: users.map(transformUser),
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Get all items with filters
const getAllItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { status, category, isResolved, search } = req.query;

    const query = {};
    if (status) query.status = status.toUpperCase();
    if (category) query.category = category;
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query)
      .populate('postedBy', 'name username avatar rating verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(query);

    sendSuccess(res, 'Items retrieved successfully', {
      items: transformItems(items),
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user.id) {
      return sendError(res, 'Cannot delete your own account', 400);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Optionally delete user's items, reviews, etc.
    // For now, just delete the user

    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Delete any item
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      throw new NotFoundError('Item');
    }

    sendSuccess(res, 'Item deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Get activity log
const getActivityLog = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { type, days = 7 } = req.query;

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - parseInt(days));

    let activities = [];

    if (!type || type === 'items') {
      const items = await Item.find({ createdAt: { $gte: dateFilter } })
        .populate('postedBy', 'name username')
        .sort({ createdAt: -1 })
        .limit(50);
      activities.push(
        ...items.map((item) => ({
          type: 'item_created',
          user: item.postedBy,
          item: { id: item._id, title: item.title },
          timestamp: item.createdAt,
        }))
      );
    }

    if (!type || type === 'users') {
      const users = await User.find({ createdAt: { $gte: dateFilter } })
        .select('name username email')
        .sort({ createdAt: -1 })
        .limit(50);
      activities.push(
        ...users.map((user) => ({
          type: 'user_registered',
          user: { id: user._id, name: user.name, username: user.username },
          timestamp: user.createdAt,
        }))
      );
    }

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginate
    const paginatedActivities = activities.slice(skip, skip + limit);

    sendSuccess(res, 'Activity log retrieved successfully', {
      activities: paginatedActivities,
      pagination: getPaginationMeta(page, limit, activities.length),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllItems,
  deleteUser,
  deleteItem,
  getActivityLog,
};

