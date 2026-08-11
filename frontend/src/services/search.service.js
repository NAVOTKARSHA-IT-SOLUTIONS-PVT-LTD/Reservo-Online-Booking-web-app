import { ALL_RESORTS } from "../data/resorts";
import { apiClient } from "./apiClient";

export const searchService = {
  async searchDestinations(query, filters = {}) {
    let results = [];
    try {
      const result = await apiClient.get("/api/v1/resorts");
      if (result && result.success && result.data && result.data.length > 0) {
        results = result.data.map(r => ({
          id: r.id,
          name: r.name,
          location: r.location,
          price: r.pricePerNight || 8000,
          rating: r.rating || 4.5,
          image: r.imageUrl || r.image || "",
          amenities: r.amenities || ["Pool", "Wifi"],
          tag: r.tag || "Luxury",
          category: r.category || "beach",
          description: r.description || ""
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch live search items, using mock list fallback:", e);
    }

    if (results.length === 0) {
      results = [...ALL_RESORTS];
    }
    
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

    return results;
  },

  async getSuggestions(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const q = query.toLowerCase().trim();

    let resortsList = [];
    try {
      const result = await apiClient.get("/api/v1/resorts");
      if (result && result.success && result.data && result.data.length > 0) {
        resortsList = result.data;
      }
    } catch (e) {}

    if (resortsList.length === 0) {
      resortsList = [...ALL_RESORTS];
    }

    const suggestions = resortsList
      .filter(r => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q))
      .map(r => ({
        id: r.id,
        name: r.name,
        location: r.location,
        type: "resort"
      }))
      .slice(0, 5);
      
    return suggestions;
  }
};
