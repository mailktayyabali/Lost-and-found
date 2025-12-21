import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import FeedPostCard from "../components/FeedPostCard";
import { posts } from "../data/posts";
import { Heart } from "lucide-react";

function Favorites() {
  const { favorites } = useFavorites();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto text-center py-20">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-navy mb-2">Sign in required</h2>
          <p className="text-slate mb-6">Please sign in to view your favorite items.</p>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const favoritePosts = posts.filter((post) => favorites.includes(post.id));

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="fade-in-slide-in">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 text-lg">
            {favoritePosts.length === 0
              ? "You haven't favorited any items yet."
              : `You have ${favoritePosts.length} favorite item${favoritePosts.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        {/* Favorites Grid */}
        {favoritePosts.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePosts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No favorites yet</h3>
            <p className="text-slate mb-6">
              Start favoriting items you're interested in to save them here.
            </p>
            <Link
              to="/feed"
              className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition"
            >
              Browse Items
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;

