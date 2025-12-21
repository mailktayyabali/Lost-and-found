import { useState } from "react";
import { X, Filter } from "lucide-react";

const CATEGORIES = [
  "All",
  "Electronics",
  "Accessories",
  "Clothing",
  "Documents",
  "Pets",
  "Keys",
  "Bags",
  "Other",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

function FilterPanel({ filters, onFilterChange, onClearFilters, isOpen, onToggle }) {
  const [isExpanded, setIsExpanded] = useState({
    category: true,
    date: false,
    location: false,
    sort: false,
  });

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== "all"
  ).length;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-teal text-white p-4 rounded-full shadow-lg hover:bg-teal-dark transition-all flex items-center gap-2"
      >
        <Filter size={20} />
        {activeFilterCount > 0 && (
          <span className="bg-white text-teal rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div
        className={`fixed lg:static inset-0 lg:inset-auto bg-white lg:bg-transparent z-50 lg:z-auto transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:block`}
      >
        <div className="h-full lg:h-auto overflow-y-auto lg:overflow-visible p-6 lg:p-0">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-navy">Filters</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filter Content */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <button
                onClick={() => toggleSection("category")}
                className="w-full flex items-center justify-between text-left font-semibold text-navy mb-3"
              >
                <span>Category</span>
                <i
                  className={`fa-solid fa-chevron-${isExpanded.category ? "up" : "down"} text-sm`}
                ></i>
              </button>
              {isExpanded.category && (
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.toLowerCase()}
                        checked={
                          (filters.category || "all").toLowerCase() ===
                          category.toLowerCase()
                        }
                        onChange={(e) =>
                          onFilterChange({
                            category:
                              e.target.value === "all" ? null : e.target.value,
                          })
                        }
                        className="accent-teal"
                      />
                      <span className="text-sm text-slate">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Filter */}
            <div>
              <button
                onClick={() => toggleSection("date")}
                className="w-full flex items-center justify-between text-left font-semibold text-navy mb-3"
              >
                <span>Date Range</span>
                <i
                  className={`fa-solid fa-chevron-${isExpanded.date ? "up" : "down"} text-sm`}
                ></i>
              </button>
              {isExpanded.date && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate mb-1">From</label>
                    <input
                      type="date"
                      value={filters.dateFrom || ""}
                      onChange={(e) =>
                        onFilterChange({ dateFrom: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate mb-1">To</label>
                    <input
                      type="date"
                      value={filters.dateTo || ""}
                      onChange={(e) =>
                        onFilterChange({ dateTo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div>
              <button
                onClick={() => toggleSection("location")}
                className="w-full flex items-center justify-between text-left font-semibold text-navy mb-3"
              >
                <span>Location</span>
                <i
                  className={`fa-solid fa-chevron-${isExpanded.location ? "up" : "down"} text-sm`}
                ></i>
              </button>
              {isExpanded.location && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location || ""}
                    onChange={(e) =>
                      onFilterChange({ location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
                  />
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div>
              <button
                onClick={() => toggleSection("sort")}
                className="w-full flex items-center justify-between text-left font-semibold text-navy mb-3"
              >
                <span>Sort By</span>
                <i
                  className={`fa-solid fa-chevron-${isExpanded.sort ? "up" : "down"} text-sm`}
                ></i>
              </button>
              {isExpanded.sort && (
                <div className="space-y-2">
                  {SORT_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) =>
                          onFilterChange({ sortBy: e.target.value })
                        }
                        className="accent-teal"
                      />
                      <span className="text-sm text-slate">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-navy rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 -z-10"
            onClick={onToggle}
          ></div>
        )}
      </div>
    </>
  );
}

export default FilterPanel;

