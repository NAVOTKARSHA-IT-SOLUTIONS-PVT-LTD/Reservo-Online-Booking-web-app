import { mockRequest } from "./api.helper";
import { secureStorage } from "./secureStorage";

const BOOKINGS_KEY = "reservo-bookings";

// Migration step: Migrate plain text localStorage to secureStorage if needed
const migrateBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (raw && !secureStorage.getItem(BOOKINGS_KEY)) {
      const parsed = JSON.parse(raw);
      secureStorage.setItem(BOOKINGS_KEY, parsed);
      // We keep the old item for safety, or we can clean it up
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
};

migrateBookings();

export const bookingService = {
  async getBookings() {
    let list = secureStorage.getItem(BOOKINGS_KEY) || [];
    // If not found in secure, check plain as fallback
    if (list.length === 0) {
      try {
        const raw = localStorage.getItem(BOOKINGS_KEY);
        if (raw) list = JSON.parse(raw);
      } catch (e) {}
    }
    return mockRequest(list, 0.01, "Failed to load your reservations.");
  },

  async createBooking(bookingDetails) {
    const list = secureStorage.getItem(BOOKINGS_KEY) || [];
    
    const newBooking = {
      id: bookingDetails.id || "bk-" + Math.floor(100000 + Math.random() * 900000),
      resortName: bookingDetails.resortName,
      location: bookingDetails.location || "Goa, India",
      resortImage: bookingDetails.resortImage || bookingDetails.image,
      checkin: bookingDetails.checkin,
      checkout: bookingDetails.checkout,
      guests: bookingDetails.guests || 2,
      roomTitle: bookingDetails.roomTitle || "Luxury Suite",
      total: bookingDetails.total,
      status: "Confirmed",
      code: bookingDetails.code || `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    list.push(newBooking);
    secureStorage.setItem(BOOKINGS_KEY, list);
    
    // Also update legacy plain text storage so old components see it
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));

    return mockRequest(newBooking, 0.02, "Booking transaction failed. Please try again.");
  },

  async cancelBooking(bookingId) {
    let list = secureStorage.getItem(BOOKINGS_KEY) || [];
    list = list.filter(b => b.id !== bookingId);
    secureStorage.setItem(BOOKINGS_KEY, list);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
    return mockRequest({ success: true }, 0.02, "Failed to cancel booking.");
  },

  async checkAvailability(resortId, dates) {
    // Simulates an availability scan
    const isAvailable = Math.random() > 0.1; // 90% availability rate
    return mockRequest({
      available: isAvailable,
      suggestedRooms: isAvailable ? [
        { id: "suite", title: "Luxury Suite", price: 8000 },
        { id: "deluxe", title: "Presidential Villa", price: 15000 }
      ] : []
    }, 0.01, "Check availability request timed out.");
  }
};
