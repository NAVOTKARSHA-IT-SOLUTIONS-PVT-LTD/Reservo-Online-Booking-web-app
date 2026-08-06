import { mockRequest } from "./api.helper";
import { secureStorage } from "./secureStorage";

const WISHLIST_KEY = "reservo-wishlist";

// Migration step
const migrateWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (raw && !secureStorage.getItem(WISHLIST_KEY)) {
      const parsed = JSON.parse(raw);
      secureStorage.setItem(WISHLIST_KEY, parsed);
    }
  } catch (e) {}
};

migrateWishlist();

export const wishlistService = {
  async getWishlist() {
    let list = secureStorage.getItem(WISHLIST_KEY) || [];
    if (list.length === 0) {
      try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        if (raw) list = JSON.parse(raw);
      } catch (e) {}
    }
    return mockRequest(list, 0.01, "Failed to load wishlist.");
  },

  async toggleWishlist(resort) {
    let list = secureStorage.getItem(WISHLIST_KEY) || [];
    const exists = list.some((item) => item.id === resort.id);
    
    if (exists) {
      list = list.filter((item) => item.id !== resort.id);
    } else {
      list.push({
        id: resort.id,
        name: resort.name,
        location: resort.location,
        price: resort.price,
        image: resort.heroImage || resort.image
      });
    }

    secureStorage.setItem(WISHLIST_KEY, list);
    // Sync with legacy local storage for compatibility with other components
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("wishlist-updated"));
    
    return mockRequest(list);
  }
};
