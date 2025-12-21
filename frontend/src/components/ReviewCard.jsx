import RatingDisplay from "./RatingDisplay";

function ReviewCard({ review }) {
  if (!review) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={review.reviewerAvatar || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random`}
            alt={review.reviewerName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-navy">{review.reviewerName}</p>
            <p className="text-xs text-slate">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <RatingDisplay rating={review.rating} size="small" />
      </div>
      {review.comment && (
        <p className="text-slate text-sm leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

export default ReviewCard;

