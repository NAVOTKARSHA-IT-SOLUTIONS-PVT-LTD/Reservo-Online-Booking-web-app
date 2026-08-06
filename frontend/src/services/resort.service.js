import { mockRequest } from "./api.helper";
import { RESORTS } from "../data/resortsData";
import { ALL_RESORTS } from "../data/resorts";

export const resortService = {
  async getAllResorts() {
    return mockRequest(RESORTS, 0.01, "Failed to load resorts. Please try again.");
  },

  async getSearchResorts() {
    // Uses ALL_RESORTS for search results page
    return mockRequest(ALL_RESORTS, 0.01, "Failed to load search results.");
  },

  async getResortById(id) {
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
    const resort = RESORTS.find((r) => r.id === mappedId) || RESORTS[0];
    
    return mockRequest(resort, 0.02, `Failed to load resort details for ID: ${id}`);
  },

  async getCategories() {
    const categories = [
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
    return mockRequest(categories);
  }
};
