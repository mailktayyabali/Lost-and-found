const Item = require('../models/Item');

// Advanced item search with filters
const searchItems = async (filters = {}, pagination = {}) => {
  try {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const query = {};

    // Status filter
    if (filters.status) {
      query.status = filters.status.toUpperCase();
    }

    // Category filter (case-insensitive)
    if (filters.category) {
      query.category = { $regex: `^${filters.category}$`, $options: 'i' };
    }

    // Location filter (partial match)
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      query.date = {};
      if (filters.dateFrom) {
        query.date.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.date.$lte = new Date(filters.dateTo);
      }
    }

    // Resolved filter
    if (filters.isResolved !== undefined) {
      query.isResolved = filters.isResolved === 'true' || filters.isResolved === true;
    }

    // Text search (keywords)
    if (filters.keywords) {
      query.$text = { $search: filters.keywords };
    }

    // Build sort
    let sort = {};
    if (filters.sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (filters.sortBy === 'oldest') {
      sort = { createdAt: 1 };
    } else if (filters.sortBy === 'title-asc') {
      sort = { title: 1 };
    } else if (filters.sortBy === 'title-desc') {
      sort = { title: -1 };
    } else if (filters.keywords) {
      // If text search, sort by relevance
      sort = { score: { $meta: 'textScore' } };
    } else {
      sort = { createdAt: -1 }; // Default: newest first
    }

    // Execute query
    const items = await Item.find(query)
      .populate('postedBy', 'name username avatar rating verified')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Item.countDocuments(query);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

// Match items against search alerts
const matchAlerts = async (alert) => {
  try {
    const filters = {
      ...alert.filters,
      status: alert.filters.type === 'lost' ? 'LOST' : alert.filters.type === 'found' ? 'FOUND' : undefined,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    const result = await searchItems(filters, { page: 1, limit: 10, skip: 0 });
    return result.items;
  } catch (error) {
    throw new Error(`Alert matching failed: ${error.message}`);
  }
};

module.exports = {
  searchItems,
  matchAlerts,
};

