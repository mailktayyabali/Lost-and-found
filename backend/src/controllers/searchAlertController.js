const SearchAlert = require('../models/SearchAlert');
const { sendSuccess } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { matchAlerts } = require('../services/searchService');
const { transformSearchAlert, transformItems } = require('../utils/transformers');

// Get user's search alerts
const getAlerts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const userId = req.user.id;
    const active = req.query.active !== undefined ? req.query.active === 'true' : undefined;

    const query = { user: userId };
    if (active !== undefined) {
      query.active = active;
    }

    const alerts = await SearchAlert.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SearchAlert.countDocuments(query);

    sendSuccess(res, 'Search alerts retrieved successfully', {
      alerts: alerts.map(transformSearchAlert),
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Create search alert
const createAlert = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, filters } = req.body;

    const alert = await SearchAlert.create({
      user: userId,
      name,
      filters: filters || {},
      active: true,
    });

    sendSuccess(res, 'Search alert created successfully', { alert: transformSearchAlert(alert) }, 201);
  } catch (error) {
    next(error);
  }
};

// Update search alert
const updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const alert = await SearchAlert.findOne({ _id: id, user: userId });
    if (!alert) {
      throw new NotFoundError('Search alert');
    }

    const { name, filters, active } = req.body;
    if (name) alert.name = name;
    if (filters) alert.filters = { ...alert.filters, ...filters };
    if (active !== undefined) alert.active = active;

    await alert.save();

    sendSuccess(res, 'Search alert updated successfully', { alert: transformSearchAlert(alert) });
  } catch (error) {
    next(error);
  }
};

// Delete search alert
const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const alert = await SearchAlert.findOneAndDelete({ _id: id, user: userId });

    if (!alert) {
      throw new NotFoundError('Search alert');
    }

    sendSuccess(res, 'Search alert deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Check for matching items (for background job)
const checkMatches = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const alert = await SearchAlert.findOne({ _id: id, user: userId });
    if (!alert) {
      throw new NotFoundError('Search alert');
    }

    if (!alert.active) {
      return sendSuccess(res, 'Alert is not active', { matches: [] });
    }

    const matches = await matchAlerts(alert);

    sendSuccess(res, 'Matches checked successfully', {
      alert: transformSearchAlert(alert),
      matches: transformItems(matches),
      matchCount: matches.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkMatches,
};

