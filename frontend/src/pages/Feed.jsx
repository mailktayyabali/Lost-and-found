import FeedPostCard from "../components/FeedPostCard";
import { posts } from "../data/posts";

function Feed() {
  return (
    <main className="w-full min-h-screen bg-gray-200 px-4 py-10">
      {/* HEADER SECTION */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          All Posts Feed
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Browse the latest lost and found items from our community.
        </p>
      </section>

      {/* FILTERS */}
      <section className="max-w-5xl mx-auto mb-10 flex flex-col gap-5">
        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow">
          <i className="fa-solid fa-magnifying-glass text-gray-500" />
          <input
            type="search"
            placeholder="Search by item, description..."
            aria-label="Search posts"
            className="w-full outline-none text-gray-700 placeholder-gray-500"
          />
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-wrap gap-4">
          <select className="px-4 py-3 rounded-xl shadow bg-white text-gray-700 w-full sm:w-auto">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Keys & Wallets</option>
            <option>Bags</option>
            <option>Apparel</option>
            <option>Pets</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            className="px-4 py-3 rounded-xl shadow bg-white text-gray-700 w-full sm:w-auto"
          />

          <button
            type="button"
            className="flex items-center gap-2 px-5 py-3 rounded-xl shadow bg-white text-gray-700 hover:bg-gray-200 transition w-full sm:w-auto"
          >
            <i className="fa-solid fa-location-dot" />
            <span>Location</span>
          </button>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </section>

      {/* LOAD MORE */}
      <div className="flex justify-center mt-10">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition shadow"
        >
          <i className="fa-solid fa-arrows-rotate" />
          <span>Loading more...</span>
        </button>
      </div>
    </main>
  );
}

export default Feed;

