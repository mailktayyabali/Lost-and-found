import { useParams } from "react-router-dom";
import { useUserProfiles } from "../context/UserProfileContext";
import { useAuth } from "../context/AuthContext";
import { posts } from "../data/posts";
import UserStats from "../components/UserStats";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import RatingDisplay from "../components/RatingDisplay";
import FeedPostCard from "../components/FeedPostCard";
import { useState } from "react";

function UserProfile() {
  const { userId } = useParams();
  const { getProfile, getReviewsForUser, getUserStats, addReview } = useUserProfiles();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const profile = getProfile(userId);
  const reviews = getReviewsForUser(userId);
  const stats = getUserStats(userId);

  // Get user's posted items
  const userPosts = posts.filter(
    (post) =>
      post.postedBy?.username === userId ||
      post.postedBy?.name?.toLowerCase().replace(/\s+/g, "") === userId
  );

  // Initialize profile if it doesn't exist
  if (!profile && userPosts.length > 0) {
    const firstPost = userPosts[0];
    if (firstPost.postedBy) {
      // Profile will be created on first access
    }
  }

  const handleReviewSubmit = (reviewData) => {
    addReview(reviewData);
    setShowReviewForm(false);
  };

  const canReview = user && user.email !== userId && !reviews.some((r) => r.reviewerId === user.email);

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={
                  profile?.avatar ||
                  userPosts[0]?.postedBy?.avatar ||
                  `https://ui-avatars.com/api/?name=${userId}&background=random`
                }
                alt={userId}
                className="w-24 h-24 rounded-full border-4 border-teal/20"
              />
              {stats.verified && (
                <span
                  className="absolute -bottom-1 -right-1 material-symbols-outlined text-teal bg-white rounded-full p-1"
                  title="Verified User"
                >
                  verified
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-navy mb-2">
                {profile?.name || userPosts[0]?.postedBy?.name || userId}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <RatingDisplay rating={stats.rating} size="default" />
                <span className="text-slate text-sm">
                  {stats.reviewCount} review{stats.reviewCount !== 1 ? "s" : ""}
                </span>
                {stats.verified && (
                  <span className="text-xs bg-teal/10 text-teal px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-slate text-sm">
                Member since {new Date(stats.memberSince).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <UserStats stats={stats} />

        {/* User's Items */}
        {userPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Posted Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-navy">
              Reviews ({reviews.length})
            </h2>
            {canReview && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && canReview && (
            <div className="mb-6">
              <ReviewForm
                userId={userId}
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
              <i className="fa-regular fa-comment text-4xl text-gray-300 mb-3"></i>
              <p className="text-slate">No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

