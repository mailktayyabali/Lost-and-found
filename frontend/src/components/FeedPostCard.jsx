function FeedPostCard({ post }) {
  const isFound = post.status === "FOUND";

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
      {/* IMAGE WRAPPER */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />

        {/* STATUS BADGE */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-lg text-white
            ${isFound ? "bg-green-600" : "bg-red-600"}`}
        >
          {post.status}
        </span>
      </div>

      {/* BODY */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>

        <p className="text-gray-600 text-sm">{post.description}</p>

        {/* META DATA */}
        <div className="mt-1 space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <i className="fa-regular fa-calendar" />
            <span>{post.date}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <i className="fa-solid fa-location-dot" />
            <span>{post.location}</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          className="mt-3 w-full bg-gray-800 text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export default FeedPostCard;

