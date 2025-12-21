import { useState, useEffect, useMemo } from "react";
import FeedPostCard from "../components/FeedPostCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { useAdvancedFilters } from "../hooks/useAdvancedFilters";
import FilterPanel from "../components/FilterPanel";
import FilterChip from "../components/FilterChip";
import CreateAlertModal from "../components/CreateAlertModal";
import { posts } from "../data/posts";

function Feed({ type }) {
  const { favorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { createAlert } = useSearchAlerts();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: null,
    dateFrom: null,
    dateTo: null,
    location: null,
    sortBy: "newest",
    keywords: null,
  });

  // Convert posts to items format and merge with mock items
  const mockItems = [
    {
      id: 1,
      title: "Lost iPhone 13 Pro",
      description: "Left it on a bench in Central Park near the fountain...",
      location: "Central Park, NY",
      date: "2023-10-25",
      type: "lost",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Found Golden Retriever",
      description: "Found wandering near 5th Ave. Very friendly, has a red collar...",
      location: "5th Ave, NY",
      date: "2023-10-26",
      type: "found",
      category: "Pets",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Lost Leather Wallet",
      description: "Brown leather wallet lost in the subway. Contains ID and cards...",
      location: "Subway Station, Brooklyn",
      date: "2023-10-24",
      type: "lost",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Found Blue Backpack",
      description: "Found a blue Nike backpack at the library entrance...",
      location: "Public Library",
      date: "2023-10-27",
      type: "found",
      category: "Bags",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Merge posts with mock items, converting posts format
  const items = useMemo(() => {
    const postsAsItems = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      location: post.location,
      date: post.date,
      type: post.status.toLowerCase(),
      category: post.category || "Other",
      image: post.imageUrl,
      imageUrl: post.imageUrl,
      status: post.status,
    }));
    return [...postsAsItems, ...mockItems];
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  // Merge search term into filters
  useEffect(() => {
    if (searchTerm) {
      setFilters((prev) => ({ ...prev, keywords: searchTerm }));
    } else {
      setFilters((prev) => ({ ...prev, keywords: null }));
    }
  }, [searchTerm]);

  // Normalize items format
  const itemsWithType = useMemo(() => {
    return items.map((item) => ({
      ...item,
      status: item.status || (item.type ? item.type.toUpperCase() : "LOST"),
      imageUrl: item.imageUrl || item.image,
      category: item.category || "Other",
    }));
  }, [items]);

  // Apply advanced filters
  const filteredByAdvanced = useAdvancedFilters(itemsWithType, {
    ...filters,
    type: type || "all",
  });

  // Apply favorites filter
  const filteredItems = showFavoritesOnly && user
    ? filteredByAdvanced.filter((item) => isFavorite(item.id))
    : filteredByAdvanced;

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
  };

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
                className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                  showFavoritesOnly
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

        {/* Grid */}
        {filteredItems.length > 0 ? (
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
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />

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
