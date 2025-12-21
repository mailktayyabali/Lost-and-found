import { Link } from "react-router-dom";

function PosterProfile({ postedBy }) {
  if (!postedBy) return null;

  const userId = postedBy.username || postedBy.email || postedBy.name.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F4F6FA] border border-gray-100 mb-6">
      <div className="relative">
        <img
          alt={postedBy.name}
          className="size-12 rounded-full object-cover border-2 border-white shadow-sm"
          src={postedBy.avatar}
        />
        {postedBy.rating && (
          <div className="absolute -bottom-1 -right-1 bg-[#f2b90d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {postedBy.rating}★
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">
          {postedBy.rating ? "Found by" : "Posted by"}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-[#212121] font-bold font-heading">
            {postedBy.name}
          </p>
          {postedBy.verified && (
            <span
              className="material-symbols-outlined text-[#243DB3] text-[16px]"
              title="Verified User"
            >
              verified
            </span>
          )}
        </div>
      </div>
      <Link
        to={`/profile/${userId}`}
        className="text-sm font-bold text-[#243DB3] hover:underline"
      >
        View Profile
      </Link>
    </div>
  );
}

export default PosterProfile;

