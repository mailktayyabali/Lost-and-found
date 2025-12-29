import { useState, useEffect } from "react";
import FeedPostCard from "../components/FeedPostCard";
import { useAuth } from "../context/AuthContext";
import { itemsApi } from "../services/itemsApi";
import { getErrorMessage } from "../utils/errorHandler";

function MyReports() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user?.id && !user?._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const userId = user.id || user._id;
        const response = await itemsApi.getUserItems(userId);
        if (response.success) {
          const fetchedItems = response.data?.items || response.data || [];
          const transformedItems = fetchedItems.map((item) => ({
            ...item,
            id: item.id || item._id,
            status: item.status || "LOST",
            imageUrl: item.imageUrl || (item.images && item.images[0]) || "",
          }));
          setItems(transformedItems);
        } else {
          setError(response.message || "Failed to load items");
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user]);

  // Filter posts based on status
  const filteredPosts =
    activeFilter === "All"
      ? items
      : activeFilter === "Resolved"
      ? items.filter((item) => item.resolved)
      : items.filter(
          (post) => post.status?.toUpperCase() === activeFilter.toUpperCase()
        );

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-6xl mx-auto">
              {error}
            </div>
          )}

          {/* Reports Grid */}
          {loading ? (
            <div className="max-w-6xl mx-auto text-center py-12">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-teal mb-4"></i>
              <p className="text-gray-600">Loading your reports...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow max-w-6xl mx-auto">
              <p className="text-gray-600 text-lg">
                {activeFilter === "All"
                  ? "You haven't reported any items yet."
                  : `No ${activeFilter.toLowerCase()} reports found.`}
              </p>
            </div>
          )}
        </div>
    </div>
  );
}

export default MyReports;

