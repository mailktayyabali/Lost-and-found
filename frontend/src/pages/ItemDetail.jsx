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

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  console.log('ItemDetail Debug:', {
    user,
    currentUserId,
    postedBy,
    posterId,
    matchString: String(posterId) === String(currentUserId)
  });

  const isOwner = user && posterId && String(posterId) === String(currentUserId);

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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <ItemHeader
              status={post.status}
              title={post.title}
              itemId={post.id}
              postedTime="2 hours ago"
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

            {/* Claim Management (Only for Owner) */}
            {isOwner && <ClaimManagement itemId={post.id} />}
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
    </main>
  );
}

export default ItemDetail;

