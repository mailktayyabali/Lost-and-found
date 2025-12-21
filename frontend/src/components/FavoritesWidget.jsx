import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { posts } from "../data/posts";
import { Heart } from "lucide-react";

function FavoritesWidget() {
  const { favorites, getFavoriteCount } = useFavorites();
  const favoriteCount = getFavoriteCount();
  const favoritePosts = posts.filter((post) => favorites.includes(post.id)).slice(0, 3);

  if (favoriteCount === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy">My Favorites</h2>
          <Link
            to="/favorites"
            className="text-sm text-teal hover:underline font-medium"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-slate">
          <Heart size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm">No favorites yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-navy">My Favorites</h2>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {favoriteCount}
          </span>
        </div>
        <Link
          to="/favorites"
          className="text-sm text-teal hover:underline font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {favoritePosts.map((post) => (
          <Link
            key={post.id}
            to={`/item/${post.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-navy text-sm truncate">
                {post.title}
              </p>
              <p className="text-xs text-slate truncate mt-1">
                {post.location}
              </p>
            </div>
            <Heart size={16} className="text-red-500 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FavoritesWidget;

