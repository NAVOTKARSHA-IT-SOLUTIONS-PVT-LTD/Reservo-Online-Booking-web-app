import { secureStorage } from "./secureStorage";
import { apiClient } from "./apiClient";
import { resortService } from "./resort.service";

const BOOKINGS_KEY = "reservo-bookings";


const mapBackendBooking = (b, resort = null) => ({
  // IMPORTANT: booking ID and resort ID are different things.
  // The booking ID identifies the reservation; resortId identifies the property.
  id: b.id || b.bookingId,
  resortId: b.resortId,
  resortName: resort?.name || b.resort?.name || b.resortName || "Luxury Resort",
  location: resort?.location || b.resort?.location || b.resortLocation || "India",
  resortImage: resort?.image || resort?.heroImage || b.resort?.imageUrl || b.resortImage || "",
  checkin: b.checkInDate,
  checkout: b.checkOutDate,
  guests: b.guestsCount || 2,
  roomTitle: b.room ? b.room.type.replace(/_/g, " ") : (b.roomType || "Luxury Room"),
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
    if (!user?.id) {
      throw new Error("Please log in to view your bookings.");
    }

    const result = await apiClient.get(
      `/api/v1/bookings/my-bookings?userId=${encodeURIComponent(user.id)}`
    );

    if (!result?.success || !Array.isArray(result.data)) {
      throw new Error(result?.message || "Failed to load your bookings.");
    }

    const mapped = await Promise.all(
      result.data.map(async (booking) => {
        let resort = null;
        if (booking?.resortId) {
          try {
            resort = await resortService.getResortById(booking.resortId);
          } catch (e) {
            console.warn(`Could not load resort ${booking.resortId} for booking ${booking.id}:`, e);
          }
        }
        return mapBackendBooking(booking, resort);
      })
    );

    return mapped;
  },

  async createBooking(bookingDetails) {
    const user = secureStorage.getItem("reservo_user");
    if (!user?.id) {
      throw new Error("Please log in before creating a booking.");
    }

    const rId = bookingDetails.resortId;
    const roomId = bookingDetails.roomId;
    if (!rId || !roomId) {
      throw new Error("A valid resort and room are required.");
    }

    const result = await apiClient.post(
      `/api/v1/bookings/create?userId=${encodeURIComponent(user.id)}&resortId=${encodeURIComponent(rId)}&roomId=${encodeURIComponent(roomId)}&checkIn=${encodeURIComponent(bookingDetails.checkin)}&checkOut=${encodeURIComponent(bookingDetails.checkout)}&amount=${encodeURIComponent(bookingDetails.total)}`
    );

    if (!result?.success || !result.data) {
      throw new Error(result?.message || "Failed to create booking.");
    }

    const resort = await resortService.getResortById(rId).catch(() => null);
    return mapBackendBooking(result.data, resort);
  },

  async cancelBooking(bookingId) {
    if (!bookingId) {
      throw new Error("Booking ID is required.");
    }

    const result = await apiClient.patch(
      `/api/v1/bookings/${encodeURIComponent(bookingId)}/cancel`
    );

    if (!result?.success) {
      throw new Error(result?.message || "Could not cancel booking.");
    }

    return result;
  },

  async checkAvailability(resortId, dates) {
    if (!resortId) {
      throw new Error("A valid resort ID is required.");
    }

    const checkIn = dates?.checkIn;
    const checkOut = dates?.checkOut;
    if (!checkIn || !checkOut) {
      throw new Error("Check-in and check-out dates are required.");
    }

    const result = await apiClient.get(
      `/api/v1/availability/check?resortId=${encodeURIComponent(resortId)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
    );

    if (!result?.success) {
      throw new Error(result?.message || "Failed to check availability.");
    }

    const rooms = Array.isArray(result.data) ? result.data.map(room => ({
      id: room.id,
      title: (room.roomType || room.type || "Room").replace(/_/g, " "),
      price: Number(room.pricePerNight || 0)
    })) : [];

    return {
      available: rooms.length > 0,
      suggestedRooms: rooms
    };
  },

  async createCheckoutSession(bookingDetails) {
    const user = secureStorage.getItem("reservo_user");
    const uId = user?.id;   if (!uId) throw new Error("Please log in before checkout.");

    const rId = bookingDetails.resortId;
    const roomId = bookingDetails.roomId;
    if (!rId || !roomId) {
      throw new Error("A valid resort and room are required.");
    }

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
