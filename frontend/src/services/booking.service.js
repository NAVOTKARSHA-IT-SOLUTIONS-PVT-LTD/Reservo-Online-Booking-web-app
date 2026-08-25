import { secureStorage } from "./secureStorage";
import { apiClient } from "./apiClient";

const BOOKINGS_KEY = "reservo-bookings";

const resortStringToIdMap = {
  "goa-coastline": 1,
  "kerala-backwaters": 2,
  "himalayan-chalet": 3,
  "udaipur-palace": 6,
  "maldives-overwater": 10
};

const mapBackendBooking = (b) => ({
  id: b.id,
  resortName: b.resort ? b.resort.name : "Luxury Resort",
  location: b.resort ? b.resort.location : "India",
  resortImage: b.resort ? (b.resort.imageUrl || b.resort.image) : "",
  checkin: b.checkInDate,
  checkout: b.checkOutDate,
  guests: b.guestsCount || 2,
  roomTitle: b.room ? b.room.type.replace(/_/g, " ") : "Luxury Room",
  total: b.totalAmount,
  status: b.status === "CONFIRMED" ? "Confirmed" : b.status === "CANCELLED" ? "Cancelled" : b.status,
  code: b.bookingCode,
  createdAt: b.createdAt
});

// Migration step: Migrate plain text localStorage to secureStorage if needed
const migrateBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (raw && !secureStorage.getItem(BOOKINGS_KEY)) {
      const parsed = JSON.parse(raw);
      secureStorage.setItem(BOOKINGS_KEY, parsed);
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
};

migrateBookings();

export const bookingService = {
  async getBookings() {
    const user = secureStorage.getItem("reservo_user");
    if (!user || !user.id) {
      const list = secureStorage.getItem(BOOKINGS_KEY) || [];
      return list;
    }

    try {
      const result = await apiClient.get(`/api/v1/bookings/my-bookings?userId=${user.id}`);
      if (result && result.success && result.data) {
        const mapped = result.data.map(mapBackendBooking);
        return mapped;
      }
    } catch (e) {
      console.warn("Failed to load live reservations from backend, using cache:", e);
    }

    const list = secureStorage.getItem(BOOKINGS_KEY) || [];
    return list;
  },

  async createBooking(bookingDetails) {
    const user = secureStorage.getItem("reservo_user");
    let uId = user ? user.id : null;

    let rId = bookingDetails.resortId;
    if (typeof rId === "string") {
      const mapped = resortStringToIdMap[rId];
      if (mapped) rId = mapped;
    }
    if (!rId) rId = 1;

    let roomId = bookingDetails.roomId;
    if (typeof roomId === "string") {
      roomId = parseInt(roomId.replace(/\D/g, ""), 10) || 1;
    }
    if (!roomId) roomId = 1;

    if (uId) {
      try {
        const result = await apiClient.post(
          `/api/v1/bookings/create?userId=${uId}&resortId=${rId}&roomId=${roomId}&checkIn=${bookingDetails.checkin}&checkOut=${bookingDetails.checkout}&amount=${bookingDetails.total}`
        );
        if (result && result.success && result.data) {
          const list = secureStorage.getItem(BOOKINGS_KEY) || [];
          const localBooking = mapBackendBooking(result.data);
          list.push(localBooking);
          secureStorage.setItem(BOOKINGS_KEY, list);
          localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
          return localBooking;
        }
      } catch (e) {
        console.warn("Failed to create booking on backend, using local cache fallback:", e);
      }
    }

    // Fallback saving
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
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));

    return newBooking;
  },

  async cancelBooking(bookingId) {
    let list = secureStorage.getItem(BOOKINGS_KEY) || [];
    list = list.filter(b => b.id !== bookingId);
    secureStorage.setItem(BOOKINGS_KEY, list);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
    return { success: true };
  },

  async checkAvailability(resortId, dates) {
    let rId = resortId;
    if (typeof rId === "string") {
      const mapped = resortStringToIdMap[rId];
      if (mapped) rId = mapped;
    }
    if (!rId) rId = 1;

    const checkIn = dates.checkIn || "2026-09-12";
    const checkOut = dates.checkOut || "2026-09-15";

    try {
      const result = await apiClient.get(`/api/v1/availability/check?resortId=${rId}&checkIn=${checkIn}&checkOut=${checkOut}`);
      if (result && result.success && result.data) {
        const available = result.data.length > 0;
        const rooms = result.data.map(room => ({
          id: room.id,
          title: room.type.replace(/_/g, " "),
          price: room.pricePerNight
        }));
        return { available, suggestedRooms: rooms };
      }
    } catch (e) {
      console.warn("Failed to check backend availability, using mock fallback:", e);
    }

    const isAvailable = Math.random() > 0.1;
    return {
      available: isAvailable,
      suggestedRooms: isAvailable ? [
        { id: "suite", title: "Luxury Suite", price: 8000 },
        { id: "deluxe", title: "Presidential Villa", price: 15000 }
      ] : []
    };
  },

  async createCheckoutSession(bookingDetails) {
    const user = secureStorage.getItem("reservo_user");
    let uId = user ? user.id : 1;

    let rId = bookingDetails.resortId;
    if (typeof rId === "string") {
      const mapped = resortStringToIdMap[rId];
      if (mapped) rId = mapped;
    }
    if (!rId) rId = 1;

    let roomId = bookingDetails.roomId;
    if (typeof roomId === "string") {
      roomId = parseInt(roomId.replace(/\D/g, ""), 10) || 1;
    }
    if (!roomId) roomId = 1;

    const successUrl = `${window.location.origin}/payment/success`;
    const cancelUrl = `${window.location.origin}/payment/cancel`;

    let url = `/api/v1/payments/checkout?userId=${uId}&resortId=${rId}&roomId=${roomId}&checkIn=${bookingDetails.checkin}&checkOut=${bookingDetails.checkout}&amount=${bookingDetails.total}&successUrl=${encodeURIComponent(successUrl)}&cancelUrl=${encodeURIComponent(cancelUrl)}`;
    if (bookingDetails.couponCode) {
      url += `&couponCode=${encodeURIComponent(bookingDetails.couponCode)}`;
    }
    if (bookingDetails.pointsToRedeem) {
      url += `&pointsToRedeem=${bookingDetails.pointsToRedeem}`;
    }
    if (bookingDetails.guestName) {
      url += `&guestName=${encodeURIComponent(bookingDetails.guestName)}`;
    }
    if (bookingDetails.guestPhone) {
      url += `&guestPhone=${encodeURIComponent(bookingDetails.guestPhone)}`;
    }

    const result = await apiClient.post(url);
    if (result && result.success && result.data) {
      return result.data;
    }
    throw new Error(result?.message || "Failed to generate checkout link");
  }
};
