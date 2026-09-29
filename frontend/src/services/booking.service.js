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

  async getBookingHistory() {
    const user = secureStorage.getItem("reservo_user");
    if (!user?.id) {
      throw new Error("Please log in to view your booking history.");
    }

    const result = await apiClient.get(
      `/api/v1/bookings/history?userId=${encodeURIComponent(user.id)}`
    );

    if (!result?.success || !Array.isArray(result.data)) {
      throw new Error(result?.message || "Failed to load your booking history.");
    }

    const mapped = await Promise.all(result.data.map(async (booking) => {
      let resort = null;
      if (booking?.resortId) {
        try {
          resort = await resortService.getResortById(booking.resortId);
        } catch (e) {}
      }
      return {
        ...mapBackendBooking(booking, resort),
        id: booking.bookingId || booking.id,
        resortId: booking.resortId,
        code: booking.bookingCode,
        roomTitle: booking.roomType || (Array.isArray(booking.roomTypes) ? booking.roomTypes.join(", ") : "Room"),
        roomNumber: booking.roomNumber || (Array.isArray(booking.roomNumbers) ? booking.roomNumbers.join(", ") : ""),
        roomTypes: Array.isArray(booking.roomTypes) ? booking.roomTypes : [],
        roomNumbers: Array.isArray(booking.roomNumbers) ? booking.roomNumbers : [],
        checkin: booking.checkInDate,
        checkout: booking.checkOutDate,
        guests: booking.guestsCount || 0,
        total: Number(booking.totalAmount || 0),
        status: booking.status,
        reviewed: Boolean(booking.reviewed)
      };
    }));

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
      `/api/v1/bookings/create?userId=${encodeURIComponent(user.id)}&resortId=${encodeURIComponent(rId)}&roomId=${encodeURIComponent(roomId)}&checkIn=${encodeURIComponent(bookingDetails.checkin)}&checkOut=${encodeURIComponent(bookingDetails.checkout)}&amount=${encodeURIComponent(bookingDetails.total)}&adults=${encodeURIComponent(bookingDetails.adults ?? 2)}&children=${encodeURIComponent(bookingDetails.children ?? 0)}&roomsCount=${encodeURIComponent(bookingDetails.roomsCount ?? 1)}&couponCode=${encodeURIComponent(bookingDetails.couponCode || "")}&discountAmount=${encodeURIComponent(bookingDetails.discountAmount ?? 0)}&pointsToRedeem=${encodeURIComponent(bookingDetails.pointsToRedeem ?? 0)}&pointsValue=${encodeURIComponent(bookingDetails.pointsValue ?? 0)}&roomType=${encodeURIComponent(bookingDetails.roomType || "")}`
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

  async checkAvailability(resortId, dates, guests = {}) {
    if (!resortId) throw new Error("A valid resort ID is required.");

    const checkIn = dates?.checkIn;
    const checkOut = dates?.checkOut;
    if (!checkIn || !checkOut) {
      throw new Error("Check-in and check-out dates are required.");
    }

    const adults = Math.max(1, Number(guests.adults ?? 2));
    const children = Math.max(0, Number(guests.children ?? 0));
    const roomCapacity = Math.max(1, Number(guests.roomCapacity ?? 4));
    const requiredRooms = guests.wholeVilla ? 1 : Math.max(
      1,
      Math.ceil((adults + children) / roomCapacity),
      Number(guests.roomsCount ?? 1)
    );

    const result = await apiClient.get(
      `/api/v1/availability/check?resortId=${encodeURIComponent(resortId)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
    );

    if (!result?.success) {
      throw new Error(result?.message || "Failed to check availability.");
    }

    const allRooms = Array.isArray(result.data) ? result.data.map(room => ({
      id: room.id,
      title: (room.roomType || room.type || "Room").replace(/_/g, " "),
      roomType: room.roomType || room.type || "Room",
      price: Number(room.pricePerNight || 0),
      capacity: Number(room.capacity || 0)
    })) : [];
    const requestedType = String(guests.roomType || "").trim();
    const rooms = requestedType
      ? allRooms.filter(room => String(room.roomType).trim() === requestedType)
      : allRooms;

    if (rooms.length < requiredRooms) {
      throw new Error(
        requiredRooms === 1
          ? "No room is available for the selected dates. Please choose different dates."
          : `Only ${rooms.length} room${rooms.length === 1 ? "" : "s"} available for these dates. You need ${requiredRooms}. Please choose different dates or reduce the number of rooms.`
      );
    }

    return {
      available: true,
      suggestedRooms: rooms,
      requiredRooms
    };
  },

  async initiateRazorpayPayment(bookingDetails) {
    const user = secureStorage.getItem("reservo_user");
    if (!user?.id) {
      throw new Error("Please log in to complete your reservation.");
    }

    const queryParams = new URLSearchParams({
      userId: user.id,
      resortId: bookingDetails.resortId,
      roomId: bookingDetails.roomId || "",
      checkIn: bookingDetails.checkin,
      checkOut: bookingDetails.checkout,
      adults: String(bookingDetails.adults || 2),
      children: String(bookingDetails.children || 0),
      roomsCount: String(bookingDetails.roomsCount || 1)
    });

    if (bookingDetails.couponCode) {
      queryParams.append("couponCode", bookingDetails.couponCode);
    }
    if (bookingDetails.pointsToRedeem) {
      queryParams.append("pointsToRedeem", String(bookingDetails.pointsToRedeem));
    }
    if (bookingDetails.guestName) {
      queryParams.append("guestName", bookingDetails.guestName);
    }
    if (bookingDetails.guestPhone) {
      queryParams.append("guestPhone", bookingDetails.guestPhone);
    }

    const orderResult = await apiClient.post(
      `/api/v1/payments/razorpay/create-order?${queryParams.toString()}`
    );

    if (!orderResult?.success || !orderResult.data) {
      throw new Error(orderResult?.message || "Failed to initiate payment order.");
    }

    const orderData = orderResult.data;

    // 1. Zero-Total Comped Flow (100% discount, ₹0 payable)
    if (orderData.isComped) {
      return {
        success: true,
        isComped: true,
        bookingCode: orderData.bookingCode,
        redirectUrl: orderData.redirectUrl || `/payment/success?bookingCode=${encodeURIComponent(orderData.bookingCode)}`
      };
    }

    // 2. Standard Razorpay Checkout Flow
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.keyId, // PUBLIC KEY ONLY
        amount: orderData.amountInPaise,
        currency: orderData.currency || "INR",
        name: "Reservo Luxury Stays",
        description: `Booking for ${orderData.resortName || "Resort"}`,
        image: "/favicon.png",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Cryptographic verification on backend
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingCode: orderData.bookingCode
            };

            const verifyResult = await apiClient.post("/api/v1/payments/razorpay/verify", verifyPayload);
            if (verifyResult?.success) {
              resolve({
                success: true,
                bookingCode: orderData.bookingCode,
                paymentId: response.razorpay_payment_id,
                redirectUrl: `/payment/success?bookingCode=${encodeURIComponent(orderData.bookingCode)}`
              });
            } else {
              reject(new Error(verifyResult?.message || "Payment verification failed."));
            }
          } catch (err) {
            reject(new Error(err.message || "Payment verification failed."));
          }
        },
        prefill: {
          name: orderData.userName || "",
          email: orderData.userEmail || "",
          contact: orderData.userPhone || ""
        },
        theme: {
          color: "#105B5C"
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment was cancelled by the user."));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        reject(new Error(response?.error?.description || "Payment failed. Please try again."));
      });
      rzp.open();
    });
  },

  async createCheckoutSession(bookingDetails) {
    return this.initiateRazorpayPayment(bookingDetails);
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
