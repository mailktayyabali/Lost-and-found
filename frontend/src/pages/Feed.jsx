import { useState } from "react";
import FeedPostCard from "../components/FeedPostCard";
import { posts } from "../data/posts";

function Feed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 6));
  const [showAll, setShowAll] = useState(false);

  // Filter posts based on search query, category, and date
  const filteredPosts = displayedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" || post.category === selectedCategory;

    const matchesDate =
      !selectedDate || post.date.includes(selectedDate);

    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleLoadMore = () => {
    if (showAll) {
      setDisplayedPosts(posts.slice(0, 6));
      setShowAll(false);
    } else {
      setDisplayedPosts(posts);
      setShowAll(true);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-50 px-4 py-10">
      {/* HEADER SECTION */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-navy tracking-tight mb-2">
          All Posts Feed
        </h1>
        <p className="text-slate text-lg">
          Browse the latest lost and found items from our community
        </p>
      </section>

      {/* FILTERS */}
      <section className="max-w-5xl mx-auto mb-10 flex flex-col gap-5">
        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white px-4 py-3.5 rounded-lg shadow-sm border border-gray-200 focus-within:border-teal focus-within:shadow-md transition">
          <i className="fa-solid fa-magnifying-glass text-gray-400" />
          <input
            type="search"
            placeholder="Search by item, description..."
            aria-label="Search posts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-wrap gap-4">
          <select
            className="input-minimal w-full sm:w-auto px-4 py-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
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
            className="input-minimal w-full sm:w-auto px-4 py-3"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button
            type="button"
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Categories");
              setSelectedDate("");
            }}
          >
            <i className="fa-solid fa-rotate-right" />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <i className="fa-solid fa-search text-5xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">No posts found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedDate("");
              }}
              className="mt-4 text-teal hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* LOAD MORE */}
      {filteredPosts.length > 0 && posts.length > 6 && (
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleLoadMore}
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            <i className={`fa-solid ${showAll ? "fa-minus" : "fa-plus"}`} />
            <span>{showAll ? "Show Less" : "Load More"}</span>
          </button>
        </div>
      )}
    </main>
  );
}

export default Feed;
