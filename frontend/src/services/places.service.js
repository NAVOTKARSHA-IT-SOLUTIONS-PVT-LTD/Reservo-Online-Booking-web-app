const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Places Service
 * Provides methods to interact with the backend Google Places API
 * This service calls backend endpoints which use the server-side Places API key
 */

class PlacesService {
  /**
   * Get place autocomplete suggestions
   * @param {string} input - Search query (minimum 3 characters)
   * @returns {Promise<Array>} - Array of place suggestions
   */
  async getAutocompleteSuggestions(input) {
    try {
      const response = await fetch(`${API_URL}/api/v1/places/autocomplete?input=${encodeURIComponent(input)}`);
      if (!response.ok) return [];
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(suggestion => ({
          placeId: suggestion.placeId,
          description: suggestion.description,
          structured_formatting: suggestion.structuredFormatting
        }));
      }
      return [];
    } catch (error) {
      console.warn('Backend autocomplete unavailable, falling back to client-side:', error.message);
      return [];
    }
  }

  /**
   * Get detailed information about a place
   * @param {string} placeId - Google Place ID
   * @returns {Promise<Object|null>} - Place details or null
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await fetch(`${API_URL}/api/v1/places/details?placeId=${encodeURIComponent(placeId)}`);
      if (!response.ok) return null;
      const data = await response.json();
      
      if (data.success && data.data) {
        const details = data.data;
        return {
          googlePlaceId: details.placeId,
          address: details.formattedAddress || details.name,
          latitude: details.latitude,
          longitude: details.longitude,
          city: details.city || this.extractCityFromAddress(details.formattedAddress),
          state: details.state || this.extractStateFromAddress(details.formattedAddress),
          country: details.country || 'India',
          pinCode: details.postalCode || this.extractPinCodeFromAddress(details.formattedAddress)
        };
      }
      return null;
    } catch (error) {
      console.warn('Backend place details unavailable, falling back to client-side:', error.message);
      return null;
    }
  }

  /**
   * Get nearby places around a location
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius in meters
   * @returns {Promise<Array>} - Array of nearby places
   */
  async getNearbyPlaces(latitude, longitude, radius = 1000) {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/places/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      if (!response.ok) return [];
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(place => ({
          name: place.name,
          vicinity: place.vicinity || place.formattedAddress,
          rating: place.rating,
          location: {
            lat: place.latitude,
            lng: place.longitude
          }
        }));
      }
      return [];
    } catch (error) {
      console.warn('Nearby places request skipped:', error.message);
      return [];
    }
  }

  /**
   * Check if the Places API is configured
   * @returns {Promise<boolean>} - True if configured
   */
  async isConfigured() {
    try {
      const response = await fetch(`${API_URL}/api/v1/places/health`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.success && data.data === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Helper: Extract city from address
   */
  extractCityFromAddress(address) {
    if (!address) return null;
    // Simple extraction - can be improved
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim();
    }
    return null;
  }

  /**
   * Helper: Extract state from address
   */
  extractStateFromAddress(address) {
    if (!address) return null;
    // Simple extraction - can be improved
    const parts = address.split(',');
    if (parts.length >= 1) {
      return parts[parts.length - 1].trim();
    }
    return null;
  }

  /**
   * Helper: Extract PIN code from address
   */
  extractPinCodeFromAddress(address) {
    if (!address) return null;
    const pinMatch = address.match(/\b\d{6}\b/); // Indian PIN codes are 6 digits
    return pinMatch ? pinMatch[0] : null;
  }
}

export default new PlacesService();
