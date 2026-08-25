import { apiClient } from "./apiClient";
import { RESORTS } from "../data/resortsData";
import { ALL_RESORTS } from "../data/resorts";

export const resortService = {
  async getAllResorts() {
    const result = await apiClient.get("/api/v1/resorts");
    if (result && result.success && result.data && result.data.length > 0) {
      return result.data.map(item => this.mapBackendResort(item));
    }
    throw new Error("No resorts available from backend");
  },

  async getSearchResorts() {
    const result = await apiClient.get("/api/v1/resorts");
    if (result && result.success && result.data && result.data.length > 0) {
      return result.data.map(item => this.mapBackendResort(item));
    }
    throw new Error("No resorts available from backend");
  },

  async searchResorts(query) {
    const result = await apiClient.get(`/api/v1/resorts/search?search=${encodeURIComponent(query || "")}`);
    if (result && result.success && result.data && result.data.length > 0) {
      return result.data.map(item => this.mapBackendResort(item));
    }
    throw new Error("No resorts found");
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
    // Map backend resort data to match frontend static data structure
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
      reviewsCount: item.reviewCount || 0, // For consistency with static data
      featuredTag: item.featuredTag,
      badge: item.featuredTag, // For consistency with static data
      discount: item.discountPercentage || 0,
      currency: "₹",
      // Add proper highlights based on resort name/location
      highlights: this.getHighlightsForResort(item.name, item.location),
      // Add proper amenities based on resort type
      amenities: this.getAmenitiesForResort(item.name),
      // Add perks
      perks: ["Free Cancellation", "Breakfast Included", "Transfer Services"],
      // Determine category based on location/name
      category: this.getCategoryForResort(item.name, item.location),
      categoryLabel: this.getCategoryLabel(item.name, item.location)
    };
  },

  getHighlightsForResort(name, location) {
    const lowerName = name.toLowerCase();
    const lowerLocation = location.toLowerCase();
    
    if (lowerName.includes("goa") || lowerLocation.includes("goa")) {
      return ["Private Beach Access", "Infinity Edge Pool", "Aura Ayurvedic Spa", "Personal AI Butler", "Private Helipad Access"];
    } else if (lowerName.includes("kerala") || lowerLocation.includes("kerala")) {
      return ["Private Houseboat Cruise", "Lakefront Infinity Pool", "Panchakarma Spa", "Organic Spice Garden"];
    } else if (lowerName.includes("udaipur") || lowerLocation.includes("udaipur")) {
      return ["Royal Butler Service", "Boat Arrival Experience", "Private Courtyard Pool", "Royal Spa Suites"];
    } else if (lowerName.includes("himalayan") || lowerLocation.includes("manali")) {
      return ["Heated Outdoor Jacuzzi", "Stone Fireplaces", "Guided Alpine Treks", "Glass Stargazing Dome"];
    } else if (lowerName.includes("maldives") || lowerLocation.includes("maldives")) {
      return ["Glass Floor Viewing", "Ocean Slide", "Private Lagoon", "Underwater Restaurant Access"];
    } else if (lowerName.includes("rajasthan") || lowerLocation.includes("jaisalmer")) {
      return ["Private Sand Dune Dining", "Camel Safari Experience", "Traditional Architecture", "Desert Sunset Views"];
    }
    
    return ["Luxury Amenities", "Premium Service", "Scenic Views", "Spa & Wellness"];
  },

  getAmenitiesForResort(name) {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("goa")) {
      return [
        { name: "Private Plunge Pool", icon: "Waves" },
        { name: "Aura Luxury Spa", icon: "Sparkles" },
        { name: "Oceanfront Dining", icon: "Utensils" },
        { name: "24/7 Rivo Concierge", icon: "Bot" },
        { name: "High-Speed Wi-Fi 6", icon: "Wifi" }
      ];
    } else if (lowerName.includes("kerala")) {
      return [
        { name: "Private Lake Cruise", icon: "Waves" },
        { name: "Ayurvedic Treatment", icon: "Sparkles" },
        { name: "Lakefront Dining", icon: "Utensils" },
        { name: "Rivo Concierge", icon: "Bot" }
      ];
    } else if (lowerName.includes("udaipur")) {
      return [
        { name: "Royal Butler", icon: "Bot" },
        { name: "Private Boat Charter", icon: "Waves" },
        { name: "Palace Dining", icon: "Utensils" }
      ];
    } else if (lowerName.includes("himalayan")) {
      return [
        { name: "Heated Jacuzzi", icon: "Waves" },
        { name: "Fireplace", icon: "Flame" },
        { name: "Star Observatory", icon: "Sparkles" }
      ];
    } else if (lowerName.includes("maldives")) {
      return [
        { name: "Lagoon Pool", icon: "Waves" },
        { name: "Underwater Dining", icon: "Utensils" },
        { name: "Personal Butler", icon: "Bot" }
      ];
    }
    
    return [
      { name: "Swimming Pool", icon: "Waves" },
      { name: "Spa & Wellness", icon: "Sparkles" },
      { name: "Fine Dining", icon: "Utensils" }
    ];
  },

  getCategoryForResort(name, location) {
    const lowerName = name.toLowerCase();
    const lowerLocation = location.toLowerCase();
    
    if (lowerName.includes("goa") || lowerLocation.includes("goa")) return "beach";
    if (lowerName.includes("kerala")) return "villa";
    if (lowerName.includes("udaipur")) return "villa";
    if (lowerName.includes("himalayan") || lowerLocation.includes("manali")) return "mountain";
    if (lowerName.includes("maldives")) return "island";
    if (lowerName.includes("rajasthan") || lowerLocation.includes("jaisalmer")) return "chalet";
    
    return "beach";
  },

  getCategoryLabel(name, location) {
    const category = this.getCategoryForResort(name, location);
    const labels = {
      beach: "Beach Resorts",
      villa: "Luxury Villas",
      mountain: "Mountain Retreats",
      island: "Private Islands",
      chalet: "Forest Chalets"
    };
    return labels[category] || "Luxury Stays";
  },

  async updateResort(id, resortDetails) {
    const result = await apiClient.put(`/api/v1/resorts/${id}`, resortDetails);
    if (result && result.success) {
      return result.data;
    }
    throw new Error(result?.message || "Failed to update resort details");
  },

  async deleteResort(id) {
    const result = await apiClient.delete(`/api/v1/resorts/${id}`);
    if (result && result.success) {
      return true;
    }
    throw new Error(result?.message || "Failed to delete resort");
  },

  async createResort(resortData) {
    const result = await apiClient.post("/api/v1/resorts", resortData);
    if (result && result.success) {
      return result.data;
    }
    throw new Error(result?.message || "Failed to submit resort for approval");
  }
};
