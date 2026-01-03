function RatingDisplay({ rating, showNumber = true, size = "default" }) {
  const safeRating = (typeof rating === 'number' && !isNaN(rating)) ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-xl",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <i
            key={`full-${i}`}
            className={`fa-solid fa-star text-yellow-400 ${sizeClasses[size]}`}
          ></i>
        ))}
        {hasHalfStar && (
          <i
            className={`fa-solid fa-star-half-stroke text-yellow-400 ${sizeClasses[size]}`}
          ></i>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <i
            key={`empty-${i}`}
            className={`fa-regular fa-star text-yellow-400 ${sizeClasses[size]}`}
          ></i>
        ))}
      </div>
      {showNumber && (
        <span className={`text-slate font-medium ${sizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default RatingDisplay;

