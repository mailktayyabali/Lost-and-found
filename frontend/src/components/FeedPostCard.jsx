function FeedPostCard({ post }) {
  const isFound = post.status === "FOUND";

  return (
    <article className="feed-card">
      <div className="feed-card-image-wrapper">
        <img src={post.imageUrl} alt={post.title} className="feed-card-image" />
        <span
          className={`feed-badge ${isFound ? "feed-badge-found" : "feed-badge-lost"}`}
        >
          {post.status}
        </span>
      </div>

      <div className="feed-card-body">
        <h3>{post.title}</h3>
        <p className="feed-card-desc">{post.description}</p>

        <div className="feed-card-meta">
          <div className="feed-card-meta-row">
            <i className="fa-regular fa-calendar" />
            <span>{post.date}</span>
          </div>
          <div className="feed-card-meta-row">
            <i className="fa-solid fa-location-dot" />
            <span>{post.location}</span>
          </div>
        </div>

        <button type="button" className="feed-card-btn">
          View Details
        </button>
      </div>
    </article>
  );
}

export default FeedPostCard;





