import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FeedPostCard from "../components/FeedPostCard";
import { posts } from "../data/posts";

function MyReports() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Filter posts based on status
  const filteredPosts =
    activeFilter === "All"
      ? posts
      : activeFilter === "Resolved"
      ? [] // You can add resolved posts logic here if needed
      : posts.filter(
          (post) => post.status.toUpperCase() === activeFilter.toUpperCase()
        );

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        <div className="fade-in-slide-in">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide mb-2">
              My Reported Items
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage and track all your lost & found reports in one place.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-10">
            <div className="flex flex-wrap justify-center gap-2 bg-white p-1.5 rounded-full shadow-md">
              {["All", "LOST", "FOUND", "Resolved"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                    activeFilter === filter
                      ? "bg-gray-800 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow">
                <p className="text-gray-600 text-lg">
                  No reports found for this filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyReports;

