import Item from '../models/Item.js';
import SearchAlert from '../models/SearchAlert.js';

// Advanced item search with filters
const searchItems = async (filters = {}, pagination = {}) => {
  try {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const query = {};

    // Status filter
    if (filters.status) {
      query.status = filters.status.toUpperCase();
    }

    // Exclude banned items
    query.isBanned = { $ne: true };

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

// Find alerts that match a newly posted item
const findMatchingAlerts = async (item) => {
  try {

    
    console.log('[Alerts] Finding matches for item:', {
      id: item._id,
      title: item.title,
      status: item.status,
      category: item.category,
      location: item.location
    });

    // Build query to find alerts that match this item
    // Logic: Look for alerts where filters match the item's properties
    const query = {
      active: true,
      user: { $ne: item.postedBy },
    };

    const andConditions = [];

    // 1. Type Match
    // If item.status="FOUND", we look for Alerts.type="found" (or "all"/null)
    if (item.status) {
      andConditions.push({
        $or: [
          { 'filters.type': item.status.toLowerCase() },
          { 'filters.type': null },
          { 'filters.type': { $exists: false } },
          { 'filters.type': '' }
        ]
      });
    }

    // 2. Category Match
    // If alert has category, it must match item's category (or be null/"all")
    if (item.category) {
      andConditions.push({
        $or: [
          { 'filters.category': item.category },
          { 'filters.category': null },
          { 'filters.category': { $exists: false } },
          { 'filters.category': '' },
          { 'filters.category': 'All' } // Handle "All" explicitly if stored
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    console.log('[Alerts] Query:', JSON.stringify(query));

    // Optimization: Fetch candidates first
    const candidates = await SearchAlert.find(query).populate('user', 'email name');
    console.log(`[Alerts] Found ${candidates.length} candidates before JS filtering`);

    // Filter candidates in memory for Location and Keywords
    const matches = candidates.filter(alert => {
      // Location Check
      if (alert.filters.location && item.location) {
        const alertLoc = alert.filters.location.toLowerCase();
        const itemLoc = item.location.toLowerCase();
        if (!itemLoc.includes(alertLoc)) {
            // console.log(`[Alerts] filtered out ${alert._id} due to location mismatch`);
            return false;
        }
      }

      // Keyword Check
      if (alert.filters.keywords) {
        const keywords = alert.filters.keywords.toLowerCase().split(/\s+/);
        const itemText = (item.title + ' ' + (item.description || '')).toLowerCase();
        
        // All keywords must be present
        const allKeywordsMatch = keywords.every(k => itemText.includes(k));
        if (!allKeywordsMatch) {
            // console.log(`[Alerts] filtered out ${alert._id} due to keyword mismatch`);
            return false;
        }
      }

      return true;
    });

    console.log(`[Alerts] Final matches: ${matches.length}`);
    return matches;
  } catch (error) {
    console.error('[Alerts] Error finding matching alerts:', error);
    return [];
  }
};

export {
  searchItems,
  matchAlerts,
  findMatchingAlerts,
};

