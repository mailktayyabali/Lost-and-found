const Review = require('../models/Review');
const User = require('../models/User');
const { sendSuccess } = require('../utils/response');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { transformReview } = require('../utils/transformers');

// Get reviews for a user
const getReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit, skip } = getPaginationParams(req.query);

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name username avatar')
      .populate('item', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ reviewee: userId });

    sendSuccess(res, 'Reviews retrieved successfully', {
      reviews: reviews.map(transformReview),
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Create review
const createReview = async (req, res, next) => {
  try {
    const { reviewee, rating, comment, item } = req.body;
    const reviewerId = req.user.id;

    // Check if user is trying to review themselves
    if (reviewee === reviewerId) {
      throw new ForbiddenError('Cannot review yourself');
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ reviewer: reviewerId, reviewee });
    if (existingReview) {
      throw new ForbiddenError('You have already reviewed this user');
    }

    // Create review
    const review = await Review.create({
      reviewer: reviewerId,
      reviewee,
      rating,
      comment,
      item,
    });

    await review.populate('reviewer', 'name username avatar email');
    await review.populate('item', 'title status');

    // Update reviewee's rating
    await updateUserRating(reviewee);

    sendSuccess(res, 'Review created successfully', { review: transformReview(review) }, 201);
  } catch (error) {
    next(error);
  }
};

// Update review
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      throw new NotFoundError('Review');
    }

    // Check if user is reviewer
    if (review.reviewer.toString() !== reviewerId) {
      throw new ForbiddenError('Not authorized to update this review');
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await review.populate('reviewer', 'name username avatar email');
    await review.populate('item', 'title status');

    // Update reviewee's rating
    await updateUserRating(review.reviewee);

    sendSuccess(res, 'Review updated successfully', { review: transformReview(review) });
  } catch (error) {
    next(error);
  }
};

// Delete review
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      throw new NotFoundError('Review');
    }

    // Check if user is reviewer or admin
    if (review.reviewer.toString() !== userId && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to delete this review');
    }

    const revieweeId = review.reviewee;

    await Review.findByIdAndDelete(id);

    // Update reviewee's rating
    await updateUserRating(revieweeId);

    sendSuccess(res, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Helper function to update user rating
const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });
  if (reviews.length === 0) {
    await User.findByIdAndUpdate(userId, {
      rating: 0,
      totalRatings: 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await User.findByIdAndUpdate(userId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    totalRatings: reviews.length,
  });
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};

