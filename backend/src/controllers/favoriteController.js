import Favorite from '../models/Favorite.js';
import Item from '../models/Item.js';
import { sendSuccess } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { transformFavorite, transformFavoritesToIds } from '../utils/transformers.js';

// Get user's favorites
const getFavorites = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: 'item',
        populate: {
          path: 'postedBy',
          select: 'name username avatar rating verified',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({ user: userId });

    // Filter out null items (in case item was deleted)
    const validFavorites = favorites.filter((fav) => fav.item !== null);

    sendSuccess(res, 'Favorites retrieved successfully', {
      favorites: validFavorites.map(transformFavorite),
      favoriteIds: transformFavoritesToIds(validFavorites), // For frontend compatibility
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Add item to favorites
const addFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item');
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: userId, item: itemId });
    if (existingFavorite) {
      return sendSuccess(res, 'Item already in favorites', { favorite: existingFavorite });
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: userId,
      item: itemId,
    });

    await favorite.populate({
      path: 'item',
      populate: {
        path: 'postedBy',
        select: 'name username avatar rating verified',
      },
    });

    sendSuccess(res, 'Item added to favorites', { favorite: transformFavorite(favorite) }, 201);
  } catch (error) {
    next(error);
  }
};

// Remove item from favorites
const removeFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({ user: userId, item: itemId });

    if (!favorite) {
      throw new NotFoundError('Favorite');
    }

    sendSuccess(res, 'Item removed from favorites');
  } catch (error) {
    next(error);
  }
};

// Check if item is favorited
const checkFavorite = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ user: userId, item: itemId })
      .populate({
        path: 'item',
        populate: {
          path: 'postedBy',
          select: 'name username avatar rating verified',
        },
      });

    sendSuccess(res, 'Favorite status retrieved', {
      isFavorite: !!favorite,
      favorite: favorite ? transformFavorite(favorite) : null,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};

