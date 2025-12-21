import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RatingDisplay from "./RatingDisplay";

function ReviewForm({ userId, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    onSubmit({
      revieweeId: userId,
      reviewerId: user.email,
      reviewerName: user.name,
      reviewerAvatar: `https://ui-avatars.com/api/?name=${user.name}&background=random`,
      rating,
      comment: comment.trim(),
    });

    setRating(5);
    setComment("");
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
          placeholder="Share your experience..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium"
        >
          Submit Review
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-navy rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;

