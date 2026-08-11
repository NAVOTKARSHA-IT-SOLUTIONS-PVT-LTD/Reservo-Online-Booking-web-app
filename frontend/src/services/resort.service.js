import { apiClient } from "./apiClient";
import { RESORTS } from "../data/resortsData";
import { ALL_RESORTS } from "../data/resorts";

export const resortService = {
  async getAllResorts() {
    try {
      const result = await apiClient.get("/api/v1/resorts");
      if (result && result.success && result.data && result.data.length > 0) {
        return result.data.map(item => this.mapBackendResort(item));
      }
      throw new Error("Empty list");
    } catch (e) {
      console.warn("Fallback to static resort listings:", e);
      return RESORTS;
    }
  },

  async getSearchResorts() {
    try {
      const result = await apiClient.get("/api/v1/resorts");
      if (result && result.success && result.data && result.data.length > 0) {
        return result.data.map(item => this.mapBackendResort(item));
      }
      throw new Error("Empty list");
    } catch (e) {
      console.warn("Fallback to static search listings:", e);
      return ALL_RESORTS;
    }
  },

  async getResortById(id) {
    try {
      const result = await apiClient.get(`/api/v1/resorts/${id}`);
      if (result && result.success && result.data) {
        return this.mapBackendResort(result.data);
      }
      throw new Error("Resort not found");
    } catch (e) {
      console.warn("Fallback to static details for ID:", id, e);
      const idMap = {
        "1": "goa-coastline",
        "2": "kerala-backwaters",
        "3": "himalayan-chalet",
        "4": "himalayan-chalet",
        "5": "himalayan-chalet",
        "6": "udaipur-palace",
        "7": "udaipur-palace",
        "8": "himalayan-chalet",
        "9": "himalayan-chalet",
        "10": "maldives-overwater",
        "11": "goa-coastline",
        "12": "himalayan-chalet",
        "13": "udaipur-palace"
      };
      const mappedId = idMap[id] || id;
      return RESORTS.find((r) => r.id === mappedId) || RESORTS[0];
    }
  },

  async getCategories() {
    return [
      { id: 'all', label: 'All Stays', icon: 'Sparkles' },
      { id: 'beach', label: 'Beach Resorts', icon: 'Waves' },
      { id: 'mountain', label: 'Mountain Retreats', icon: 'Mountain' },
      { id: 'chalet', label: 'Forest Chalets', icon: 'Trees' },
      { id: 'villa', label: 'Luxury Villas', icon: 'Home' },
      { id: 'cabin', label: 'Rustic Cabins', icon: 'Tent' },
      { id: 'glamping', label: 'Glamping Stays', icon: 'Flame' },
      { id: 'island', label: 'Private Islands', icon: 'Palmtree' },
      { id: 'eco', label: 'Eco Camping', icon: 'Compass' }
    ];
  },

  mapBackendResort(item) {
    return {
      id: item.id,
      name: item.name,
      location: item.location,
      description: item.description,
      image: item.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
      heroImage: item.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
      price: item.pricePerNight,
      rating: item.rating || 4.5,
      reviewCount: item.reviewCount || 0,
      featuredTag: item.featuredTag,
      discount: item.discountPercentage || 0,
      highlights: ["Private Beach Access", "Infinity Edge Pool", "Aura Ayurvedic Spa", "Personal AI Butler", "Private Helipad Access"],
      amenities: [
        { name: "Private Plunge Pool", icon: "Waves" },
        { name: "Aura Luxury Spa", icon: "Sparkles" },
        { name: "Oceanfront Dining", icon: "Utensils" }
      ],
      perks: ["Free Cancellation", "Breakfast Included", "Transfer Services"],
      category: "beach"
    };
  }
};
