import { mockRequest } from "./api.helper";
import { ALL_RESORTS } from "../data/resorts";

export const searchService = {
  async searchDestinations(query, filters = {}) {
    let results = [...ALL_RESORTS];
    
    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      results = results.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.location.toLowerCase().includes(q) ||
        (r.region && r.region.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== "all") {
      results = results.filter(r => r.category === filters.category);
    }

    if (filters.maxPrice) {
      results = results.filter(r => r.price <= filters.maxPrice);
    }

    // Return the search results
    return mockRequest(results, 0.01, "Search request failed. Please try again.");
  },

  async getSuggestions(query) {
    if (!query || query.trim().length < 2) {
      return mockRequest([]);
    }
    const q = query.toLowerCase().trim();
    const suggestions = ALL_RESORTS
      .filter(r => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q))
      .map(r => ({
        id: r.id,
        name: r.name,
        location: r.location,
        type: "resort"
      }))
      .slice(0, 5);
      
    return mockRequest(suggestions);
  }
};
