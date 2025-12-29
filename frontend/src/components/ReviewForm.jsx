import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { reviewsApi } from "../services/reviewsApi";
import { getErrorMessage } from "../utils/errorHandler";
import RatingDisplay from "./RatingDisplay";

function ReviewForm({ userId, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const response = await reviewsApi.createReview({
        reviewee: userId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (response.success) {
        const newReview = response.data?.review || response.data;
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(newReview);
        }
        setRating(5);
        setComment("");
      } else {
        setError(response.message || "Failed to submit review");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <p className="text-slate text-sm">Please sign in to leave a review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-navy mb-4">Write a Review</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-navy mb-2">
          Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
              disabled={loading}
            >
              <i
                className={`fa-${
                  star <= (hoveredRating || rating) ? "solid" : "regular"
                } fa-star text-2xl ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              ></i>
            </button>
          ))}
          <span className="ml-2 text-sm text-slate">({rating}/5)</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-navy mb-2">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm disabled:opacity-50"
          placeholder="Share your experience..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Submitting...
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 bg-gray-100 text-navy rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;

