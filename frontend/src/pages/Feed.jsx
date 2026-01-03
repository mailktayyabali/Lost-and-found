import { useState, useEffect, useMemo } from "react";
import FeedPostCard from "../components/FeedPostCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import FilterPanel from "../components/FilterPanel";
import FilterChip from "../components/FilterChip";
import CreateAlertModal from "../components/CreateAlertModal";
import { itemsApi } from "../services/itemsApi";
import { getErrorMessage } from "../utils/errorHandler";

function Feed({ type }) {
  const { favorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { createAlert } = useSearchAlerts();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: null,
    dateFrom: null,
    dateTo: null,
    location: null,
    sortBy: "newest",
    keywords: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: 20,
          ...filters // Pass all filters to backend
        };

        // Add status filter if type is specified
        if (type === "lost" || type === "found") {
          params.status = type.toUpperCase();
        }

        // Use search API if search term exists or standard get if not
        let response;
        if (searchTerm.trim()) {
          params.keywords = searchTerm.trim();
          // We can use getAllItems for everything since the backend controller handles keywords too
          // But if we want to stick to searchItems logic:
          response = await itemsApi.getAllItems(params);
        } else {
          response = await itemsApi.getAllItems(params);
        }

        if (response.success) {
          const fetchedItems = response.data?.items || response.data || [];

          // Transform items to match frontend format
          const transformedItems = fetchedItems.map((item) => ({
            ...item,
            id: item.id || item._id,
            type: item.status?.toLowerCase() || "lost",
            imageUrl: item.imageUrl || (item.images && item.images[0]) || null,
            image: item.imageUrl || (item.images && item.images[0]) || null,
          }));

          if (page === 1) {
            setItems(transformedItems);
          } else {
            setItems((prev) => [...prev, ...transformedItems]);
          }

          setHasMore(fetchedItems.length === 20);
        } else {
          setError(response.message || "Failed to load items");
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type, filters, searchTerm, page]);

  // Normalize items format
  const itemsWithType = useMemo(() => {
    return items.map((item) => ({
      ...item,
      status: item.status || (item.type ? item.type.toUpperCase() : "LOST"),
      imageUrl: item.imageUrl || item.image || null,
      category: item.category || "Other",
    }));
  }, [items]);

  // Apply favorites filter (client-side only for favorites view)
  const filteredItems = showFavoritesOnly && user
    ? itemsWithType.filter((item) => isFavorite(item.id))
    : itemsWithType;

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: null,
      dateFrom: null,
      dateTo: null,
      location: null,
      sortBy: "newest",
      keywords: null,
    });
    setSearchTerm("");
    setPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [type, filters.category, searchTerm]);

  const getActiveFilters = () => {
    const active = [];
    if (filters.category) {
      active.push({ key: "category", label: "Category", value: filters.category });
    }
    if (filters.dateFrom || filters.dateTo) {
      active.push({
        key: "date",
        label: "Date",
        value: `${filters.dateFrom || "..."} - ${filters.dateTo || "..."}`,
      });
    }
    if (filters.location) {
      active.push({ key: "location", label: "Location", value: filters.location });
    }
    if (filters.sortBy && filters.sortBy !== "newest") {
      active.push({
        key: "sort",
        label: "Sort",
        value: filters.sortBy,
      });
    }
    return active;
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (value) => value && value !== "newest" && value !== null
    );
  };

  const handleSaveSearch = () => {
    if (!user) {
      alert("Please sign in to save searches");
      return;
    }
    setIsAlertModalOpen(true);
  };


  const getPageTitle = () => {
    if (type === 'lost') return 'Lost Items';
    if (type === 'found') return 'Found Items';
    return 'All Items';
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Filter Panel - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy">{getPageTitle()}</h1>
                <p className="text-slate text-sm mt-1">
                  Browsing {filteredItems.length} {type ? type : ''} items in your area
                </p>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {user && (
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${showFavoritesOnly
                      ? "bg-teal text-white border-teal"
                      : "bg-white text-navy border-gray-200 hover:border-teal"
                      }`}
                  >
                    <i className={`fa-solid fa-heart mr-2 ${showFavoritesOnly ? "text-white" : "text-red-500"}`}></i>
                    My Favorites
                  </button>
                )}

                {/* Search Bar */}
                <div className="w-full md:w-96 relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by keyword or location..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {getActiveFilters().length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-slate font-medium">Active filters:</span>
                {getActiveFilters().map((filter) => (
                  <FilterChip
                    key={filter.key}
                    label={filter.label}
                    value={filter.value}
                    onRemove={() => {
                      if (filter.key === "category") {
                        handleFilterChange({ category: null });
                      } else if (filter.key === "date") {
                        handleFilterChange({ dateFrom: null, dateTo: null });
                      } else if (filter.key === "location") {
                        handleFilterChange({ location: null });
                      } else if (filter.key === "sort") {
                        handleFilterChange({ sortBy: "newest" });
                      }
                    }}
                  />
                ))}
                {user && hasActiveFilters() && (
                  <button
                    onClick={handleSaveSearch}
                    className="ml-auto px-4 py-1.5 bg-teal/10 text-teal rounded-full text-sm font-medium border border-teal/20 hover:bg-teal/20 transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-bell text-xs"></i>
                    Save Search
                  </button>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && page === 1 ? (
              <div className="text-center py-20">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-teal mb-4"></i>
                <p className="text-slate">Loading items...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => {
                    // Transform item to match FeedPostCard expected structure
                    const post = {
                      ...item,
                      status: item.type ? item.type.toUpperCase() : 'LOST',
                      imageUrl: item.image || item.imageUrl,
                    };
                    return <FeedPostCard key={item.id} post={post} />;
                  })}
                </div>
                {hasMore && !loading && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="btn-secondary px-6 py-2"
                    >
                      Load More
                    </button>
                  </div>
                )}
                {loading && page > 1 && (
                  <div className="text-center mt-8">
                    <i className="fa-solid fa-spinner fa-spin text-teal"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <i className="fa-solid fa-box-open text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">No items found</h3>
                <p className="text-slate">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel - Mobile */}
        <div className="lg:hidden">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Create Alert Modal */}
        <CreateAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          onCreate={(alertData) => {
            createAlert(alertData);
            setIsAlertModalOpen(false);
          }}
          currentFilters={{
            ...filters,
            type: type || null,
          }}
        />
      </div>
    </main>
  );
}

export default Feed;
