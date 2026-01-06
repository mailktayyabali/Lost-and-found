const User = require('../models/User');
const Item = require('../models/Item');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const SearchAlert = require('../models/SearchAlert');
const Flag = require('../models/Flag');
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
      pendingFlags,
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
      Flag.countDocuments({ status: 'PENDING' }),
    ]);

    // Get recent activity (last 30 days) for charts
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newUsers,
      newItems,
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Item.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

     // Aggregate daily signups for last 7 days
     const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

      const dailyItems = await Item.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
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
      },
      alerts: {
        active: activeAlerts,
      },
      flags: {
        pending: pendingFlags,
      },
      chartData: {
          dailySignups,
          dailyItems
      }
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
    const { role, search, status } = req.query;

    const query = {};
    if (role) {
      query.role = role;
    }
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
        query.isBanned = { $ne: true };
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

// Ban user
const banUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
  
      if (id === req.user.id) {
        return sendError(res, 'Cannot ban yourself', 400);
      }
  
      const user = await User.findByIdAndUpdate(
        id,
        { isBanned: true, banReason: reason },
        { new: true }
      );
  
      if (!user) {
        throw new NotFoundError('User');
      }
  
      sendSuccess(res, 'User banned successfully', { user: transformUser(user) });
    } catch (error) {
      next(error);
    }
  };
  
// Unban user
const unbanUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
        id,
        { isBanned: false, banReason: null },
        { new: true }
        );

        if (!user) {
        throw new NotFoundError('User');
        }

        sendSuccess(res, 'User unbanned successfully', { user: transformUser(user) });
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
    const { type, days = 30 } = req.query; // Increase default to 30 days

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - parseInt(days));
    
    console.log('ActivityLog: Fetching since', dateFilter.toISOString());

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
        .select('name username email createdAt') // Added createdAt
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

// Get flags
const getFlags = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { status } = req.query;

        const query = {};
        if (status) query.status = status.toUpperCase();

        const flags = await Flag.find(query)
            .populate('reporter', 'name email avatar')
            .populate('targetItem', 'title description images')
            .populate('targetUser', 'name email avatar')
            .populate('resolvedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Flag.countDocuments(query);

        sendSuccess(res, 'Flags retrieved successfully', {
            flags,
            pagination: getPaginationMeta(page, limit, total),
        });
    } catch (error) {
        next(error);
    }
};

// Resolve flag
const updateFlagStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, resolutionNote } = req.body;

        const flag = await Flag.findByIdAndUpdate(
            id,
            { 
                status: status, 
                resolutionNote,
                resolvedBy: req.user.id
            },
            { new: true }
        );

        if (!flag) throw new NotFoundError('Flag');

        sendSuccess(res, 'Flag status updated', { flag });
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
  banUser,
  unbanUser,
  getFlags,
  updateFlagStatus
};
