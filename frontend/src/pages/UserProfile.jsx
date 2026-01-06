import { useParams } from "react-router-dom";
import { useUserProfiles } from "../context/UserProfileContext";
import { useAuth } from "../context/AuthContext";
import UserStats from "../components/UserStats";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import RatingDisplay from "../components/RatingDisplay";
import FeedPostCard from "../components/FeedPostCard";
import { useState, useEffect } from "react";
import { Flag } from "lucide-react"; // Import Flag icon
import { itemsApi } from "../services/itemsApi"; // Reuse itemsApi for reporting
import { getErrorMessage } from "../utils/errorHandler";

function UserProfile() {
  const { userId } = useParams();
  const { getProfile, getReviewsForUser, getUserStats, getUserItems, addReview } = useUserProfiles();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Local state for profile data
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  // Fetch all user data
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const [profileData, reviewsData, statsData, itemsData] = await Promise.all([
          getProfile(userId),
          getReviewsForUser(userId),
          getUserStats(userId),
          getUserItems(userId)
        ]);

        setProfile(profileData);
        setReviews(reviewsData || []);
        setStats(statsData || { reviewCount: 0, rating: 0 });
        setUserPosts(itemsData || []);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleReviewSubmit = async (reviewData) => {
    await addReview(reviewData);
    setShowReviewForm(false);
    // Refresh reviews after submission
    const updatedReviews = await getReviewsForUser(userId);
    setReviews(updatedReviews || []);
  };

  const handleReportUser = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      await itemsApi.reportItem({
        targetUserId: userId,
        reason: reportReason,
        reporter: user.id
      });
      setIsReportModalOpen(false);
      setReportReason("");
      alert("Report submitted successfully.");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setReporting(false);
    }
  };


  const canReview = user && user.email !== profile?.email && user.id !== profile?.id && !reviews.some((r) => r.reviewerId === user.email || r.reviewerId === user.id);
  // Check if current user is viewing their own profile
  const isOwnProfile = user && (user.id === userId || user._id === userId);

  if (loading) {
    return (
      <div className="flex-1 p-10 flex justify-center">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-teal"></i>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 p-10 flex justify-center text-slate">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-6 border border-gray-100 shadow-sm relative">
          {/* Report User Button */}
          {!isOwnProfile && user && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
              title="Report User"
            >
              <Flag size={16} /> Report
            </button>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={
                  profile.avatar ||
                  `https://ui-avatars.com/api/?name=${profile.name}&background=random`
                }
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-teal/20 object-cover"
              />
              {profile.verified && (
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
                {profile.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <RatingDisplay rating={stats?.rating || 0} size="default" />
                <span className="text-slate text-sm">
                  {stats?.reviewCount || 0} review{stats?.reviewCount !== 1 ? "s" : ""}
                </span>
                {profile.verified && (
                  <span className="text-xs bg-teal/10 text-teal px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-slate text-sm">
                Member since {profile.memberSince ? new Date(profile.memberSince).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                }) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        {stats && <UserStats stats={stats} />}

        {/* User's Items */}
        {userPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Posted Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => {
                // Fix post data for FeedPostCard
                const postData = {
                  ...post,
                  imageUrl: post.imageUrl || (post.images && post.images[0]),
                  status: post.status.toUpperCase(),
                };
                return <FeedPostCard key={post.id} post={postData} />;
              })}
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

      {/* Report User Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Report User</h3>
            <p className="text-slate-500 text-sm mb-4">Why is this user being reported?</p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-red-200 focus:outline-none mb-4 resize-none"
              placeholder="Spam, harassment, inappropriate behavior..."
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsReportModalOpen(false)}
                disabled={reporting}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReportUser}
                disabled={reporting || !reportReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md shadow-red-200 font-bold disabled:opacity-50"
              >
                {reporting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;

