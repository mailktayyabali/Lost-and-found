import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../data/posts";
import ItemImageGallery from "../components/ItemImageGallery";
import ItemHeader from "../components/ItemHeader";
import PosterProfile from "../components/PosterProfile";
import ItemDetailsCard from "../components/ItemDetailsCard";
import ItemActions from "../components/ItemActions";
import SafetyNotice from "../components/SafetyNotice";
import ItemMap from "../components/ItemMap";
import ItemDescription from "../components/ItemDescription";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getPostById(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#212121] mb-4">Item Not Found</h1>
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

            {/* Action Buttons */}
            <ItemActions status={post.status} itemId={post.id} postedBy={post.postedBy} />
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

