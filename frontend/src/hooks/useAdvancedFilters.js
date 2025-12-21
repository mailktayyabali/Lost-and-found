import { useMemo } from "react";

export const useAdvancedFilters = (items, filters) => {
  return useMemo(() => {
    let result = [...items];

    // Filter by type
    if (filters.type && filters.type !== "all") {
      result = result.filter(
        (item) => item.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      result = result.filter(
        (item) => item.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      result = result.filter(
        (item) => item.status?.toUpperCase() === filters.status.toUpperCase()
      );
    }

    // Filter by location (simple text match)
    if (filters.location) {
      result = result.filter((item) =>
        item.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(filters.dateFrom);
      });
    }

    if (filters.dateTo) {
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate <= new Date(filters.dateTo);
      });
    }

    // Filter by search term (keywords in title/description)
    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(keywords) ||
          item.description?.toLowerCase().includes(keywords)
      );
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          result.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "oldest":
          result.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "title-asc":
          result.sort((a, b) => a.title?.localeCompare(b.title));
          break;
        case "title-desc":
          result.sort((a, b) => b.title?.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    return result;
  }, [items, filters]);
};

