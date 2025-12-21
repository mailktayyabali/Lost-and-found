import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

function FeedPostCard({ post }) {
  const navigate = useNavigate();
  
  if (!post) {
    return null;
  }
  
  const isFound = post.status === "FOUND";
  const isResolved = post.status === "RESOLVED";

  const handleViewDetails = () => {
    navigate(`/item/${post.id}`);
  };

  const getStatusColor = () => {
    if (isResolved) return "badge-info";
    return isFound ? "badge-success" : "badge-error";
  };

  return (
    <article className="card-minimal overflow-hidden group cursor-pointer">
      {/* IMAGE WRAPPER */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-100">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* STATUS BADGE */}
        <span className={`absolute top-3 left-3 badge ${getStatusColor()}`}>
          {post.status}
        </span>

        {/* FAVORITE BUTTON */}
        <div className="absolute top-3 right-3">
          <FavoriteButton itemId={post.id} size="small" />
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-navy group-hover:text-teal transition">{post.title}</h3>

        <p className="text-slate text-sm line-clamp-2">{post.description}</p>

        {/* META DATA */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 text-slate text-sm">
            <i className="fa-regular fa-calendar" />
            <span>{post.date}</span>
          </div>

          <div className="flex items-center gap-2 text-slate text-sm">
            <i className="fa-solid fa-location-dot" />
            <span>{post.location}</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleViewDetails}
          className="mt-3 w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal transition shadow-sm hover:shadow-md"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export default FeedPostCard;
