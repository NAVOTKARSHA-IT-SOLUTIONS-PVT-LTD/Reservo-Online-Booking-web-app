import { apiClient } from "./apiClient";
import { secureStorage } from "./secureStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Service to track and log Google Maps latitude/longitude interactions to Firebase via backend.
 * Keeps Google Maps operations decoupled and handles errors gracefully.
 */
class LocationTrackingService {

  /**
   * Get current authenticated user ID if logged in
   */
  getCurrentUserId() {
    try {
      const stored = secureStorage.getItem("reservo_user");
      if (stored) {
        const user = typeof stored === "string" ? JSON.parse(stored) : stored;
        return user?.id || user?.email || null;
      }
    } catch (_) {}
    return null;
  }

  /**
   * Log Google Maps operation and coordinates to Firebase
   * @param {Object} params
   * @param {number} params.latitude - Latitude
   * @param {number} params.longitude - Longitude
   * @param {string} params.action - Action name (e.g. MAP_PIN_DROPPED, MAP_CLICKED, PLACE_SELECTED)
   * @param {string} params.googleMapsOperation - Google Maps API / Component interaction description
   * @param {string} [params.formattedAddress] - Optional resolved address
   * @param {Object} [params.metadata] - Optional additional context
   */
  async trackLocation({
    latitude,
    longitude,
    action = "MAP_INTERACTION",
    googleMapsOperation = "Google Maps API",
    formattedAddress = "",
    metadata = {}
  }) {
    // Validate coordinates (Requirement 6)
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng) || latitude == null || longitude == null) {
      console.warn("Location tracking skipped: Invalid or missing latitude/longitude", { latitude, longitude });
      return null;
    }

    const userId = this.getCurrentUserId();

    const payload = {
      latitude: lat,
      longitude: lng,
      userId: userId || "anonymous",
      action,
      googleMapsOperation,
      formattedAddress,
      metadata: {
        ...metadata,
        url: window.location.pathname,
        userAgent: navigator.userAgent
      }
    };

    try {
      // Fire-and-forget to backend Firestore logging endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/map-tracking/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn("Location tracking logging response not ok:", response.status);
        return null;
      }

      const resData = await response.json().catch(() => null);
      return resData;
    } catch (err) {
      // Non-blocking error handling (Requirement 5 & 6)
      console.warn("Location tracking skipped due to network/server:", err.message);
      return null;
    }
  }

  /**
   * Query Firebase statistics for a specific coordinate point
   * Determines:
   * - which coordinates were used
   * - when they were used
   * - which user triggered the operation
   * - how many times the point was used (Requirement 4)
   */
  async getCoordinateStats(latitude, longitude) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (isNaN(lat) || isNaN(lng)) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/map-tracking/stats?lat=${lat}&lng=${lng}`);
      if (!response.ok) return null;
      const json = await response.json();
      return json.data || null;
    } catch (err) {
      console.warn("Failed to fetch coordinate stats:", err.message);
      return null;
    }
  }

  /**
   * Retrieve recent Firebase location logs
   */
  async getRecentLogs(limit = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/map-tracking/recent?limit=${limit}`);
      if (!response.ok) return [];
      const json = await response.json();
      return json.data || [];
    } catch (err) {
      console.warn("Failed to fetch recent location logs:", err.message);
      return [];
    }
  }
}

export const locationTrackingService = new LocationTrackingService();
export default locationTrackingService;
