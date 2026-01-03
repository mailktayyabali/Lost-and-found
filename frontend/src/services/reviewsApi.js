import api from './api';

export const reviewsApi = {
  // Get reviews for a user
  getUserReviews: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', {
      reviewee: reviewData.reviewee,
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    return response;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  },
};

