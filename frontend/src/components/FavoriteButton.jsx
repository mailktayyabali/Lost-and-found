import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";

function FavoriteButton({ itemId, size = "default", className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const favorited = isFavorite(itemId);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please sign in to favorite items");
      return;
    }
    toggleFavorite(itemId);
  };

  if (!user) {
    return null;
  }

  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-10 h-10",
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center rounded-full transition-all ${
        favorited
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/90 text-gray-400 hover:bg-white hover:text-red-500"
      } ${sizeClasses[size]} ${className}`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size === "small" ? 14 : size === "large" ? 20 : 16}
        className={favorited ? "fill-current" : ""}
      />
    </button>
  );
}

export default FavoriteButton;

