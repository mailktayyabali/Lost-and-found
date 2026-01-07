import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemImageGallery from "../components/ItemImageGallery";
import ItemHeader from "../components/ItemHeader";
import PosterProfile from "../components/PosterProfile";
import ItemDetailsCard from "../components/ItemDetailsCard";
import ItemActions from "../components/ItemActions";
import SafetyNotice from "../components/SafetyNotice";
import ItemMap from "../components/ItemMap";
import ItemDescription from "../components/ItemDescription";
import ClaimManagement from "../components/ClaimManagement";
import { itemsApi } from "../services/itemsApi";
import { getErrorMessage } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";

import { Flag } from "lucide-react";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await itemsApi.getItemById(id);
        if (response.success && response.data) {
          const item = response.data.item || response.data;
          // Increment views
          itemsApi.incrementViews(id).catch(() => {
            // Silently fail if view increment fails
          });

          // Transform item to match frontend format
          const transformedItem = {
            ...item,
            id: item.id || item._id,
            imageUrl: item.imageUrl || (item.images && item.images[0]) || null,
            additionalImages: item.additionalImages || (item.images && item.images.slice(1)) || [],
            fullDescription: item.description,
            date: item.date || new Date(item.createdAt).toLocaleDateString(),
            postedBy: item.postedBy || item.user,
          };
          setPost(transformedItem);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-teal mb-4"></i>
          <p className="text-gray-600">Loading item...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#212121] mb-4">
            {error || "Item Not Found"}
          </h1>
          <button
            onClick={() => navigate("/feed")}
            className="px-6 py-3 bg-[#f2b90d] text-[#212121] font-bold rounded-xl hover:bg-[#f2b90d]/90 transition"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  // Check if current user is the owner
  const currentUserId = user?.id || user?._id;
  const postedBy = post?.postedBy;
  const posterId = typeof postedBy === 'object' ? postedBy?._id || postedBy?.id : postedBy;

  //   console.log('ItemDetail Debug:', {
  //     user,
  //     currentUserId,
  //     postedBy,
  //     posterId,
  //     matchString: String(posterId) === String(currentUserId)
  //   });

  const isOwner = user && posterId && String(posterId) === String(currentUserId);

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      await itemsApi.reportItem({
        targetItemId: id,
        reason: reportReason,
        reporter: user.id
      });
      setIsReportModalOpen(false);
      setReportReason("");
      alert("Report submitted successfully. Thank you for helping keep our community safe.");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setReporting(false);
    }
  };

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 bg-[#f8f8f5] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <ItemImageGallery
            mainImage={post.imageUrl}
            additionalImages={post.additionalImages || []}
          />

          {/* Description Section (Desktop placement) */}
          <ItemDescription
            description={post.fullDescription || post.description}
            className="hidden lg:block mt-4"
          />
        </div>

        {/* Right Column: Info & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            <ItemHeader
              status={post.status}
              title={post.title}
              itemId={post.id}
              postedTime="2 hours ago"
              actionButtons={
                !isOwner && user && (
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    title="Report this item"
                  >
                    <Flag size={20} />
                  </button>
                )
              }
            />
            <p className="text-gray-500 text-sm mb-6">
              Item ID: #{post.id} • Posted {post.date}
            </p>

            {/* Poster Profile */}
            {post.postedBy && <PosterProfile postedBy={post.postedBy} />}

            {/* Key Details Grid */}
            <ItemDetailsCard
              date={post.date}
              category={post.category}
              location={post.location}
            />

            {/* Action Buttons (Hide if owner) */}
            {!isOwner && <ItemActions status={post.status} itemId={post.id} postedBy={post.postedBy} />}

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/edit-item/${post.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#212121] font-semibold transition-colors hover:bg-gray-50 hover:border-gray-300"
                  >
                    <i className="fa-solid fa-pen-to-square text-gray-500"></i>
                    Edit Item
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
                        try {
                          await itemsApi.deleteItem(post.id);
                          alert("Item deleted successfully");
                          navigate("/my-reports");
                        } catch (e) {
                          alert(getErrorMessage(e));
                        }
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 font-semibold transition-colors hover:bg-red-100 hover:border-red-200"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    Delete
                  </button>
                </div>
                <ClaimManagement itemId={post.id} />
              </div>
            )}
          </div>

          {/* Safety Notice */}
          <SafetyNotice />

          {/* Map Section */}
          {post.mapImage && (
            <ItemMap mapLocation={post.mapLocation} mapImage={post.mapImage} />
          )}

          {/* Description Section (Mobile placement - only visible on small screens) */}
          <ItemDescription
            description={post.fullDescription || post.description}
            className="lg:hidden"
          />
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Report Item</h3>
            <p className="text-slate-500 text-sm mb-4">Why is this item inappropriate?</p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-red-200 focus:outline-none mb-4 resize-none"
              placeholder="Please describe the issue (spam, scam, offensive content, etc)..."
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
                onClick={handleReport}
                disabled={reporting || !reportReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md shadow-red-200 font-bold disabled:opacity-50"
              >
                {reporting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ItemDetail;

