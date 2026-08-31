import { apiClient } from "./apiClient";
import { RESORTS } from "../data/resortsData";
import { ALL_RESORTS } from "../data/resorts";
import { hostService } from "./host.service";

const findStaticResort = (idOrName) => {
  const key = String(idOrName ?? '').trim();
  if (!key) return null;
  return ALL_RESORTS.find(r => String(r.id) === key)
    || ALL_RESORTS.find(r => String(r.name).toLowerCase() === key.toLowerCase())
    || null;
};

const normalizeStaticResort = (r) => {
  if (!r) return null;
  return {
    ...r,
    heroImage: r.heroImage || r.image,
    gallery: Array.isArray(r.gallery) && r.gallery.length ? r.gallery : (r.image ? [r.image] : []),
    highlights: Array.isArray(r.highlights) ? r.highlights : (Array.isArray(r.amenities) ? r.amenities.slice(0, 5) : []),
    amenities: Array.isArray(r.amenities) ? r.amenities.map(a => typeof a === 'string' ? { name: a, icon: 'Sparkles' } : a) : [],
    reviewsCount: Number(r.reviewsCount ?? r.reviewCount ?? 0),
    reviewCount: Number(r.reviewCount ?? r.reviewsCount ?? 0),
    pricePerNight: Number(r.pricePerNight ?? r.price ?? 0),
    categoryLabel: r.categoryLabel || r.type || 'Stay'
  };
};

export const resortService = {
  async getAllResorts() {
    let resortsList = [];
    try {
      const result = await apiClient.get("/api/v1/resorts");
      if (result && result.success && result.data && result.data.length > 0) {
        resortsList = result.data.map(item => this.mapBackendResort(item));
      }
    } catch (e) {
      console.warn("Backend resorts endpoint not reachable, using static resorts", e);
    }

    if (!resortsList.length) {
      resortsList = Array.isArray(ALL_RESORTS) ? [...ALL_RESORTS] : [];
    }

    // Merge user-published listings from hostService so new listings immediately show on the Resort Listing page
    try {
      const hostListings = hostService.getListings() || [];
      const userListingsMapped = hostListings.map(listing => this.mapHostListingToResort(listing));
      
      const existingIds = new Set(resortsList.map(r => String(r.id)));
      userListingsMapped.forEach(ul => {
        if (!existingIds.has(String(ul.id))) {
          resortsList.unshift(ul); // Put user published listing right at top!
        }
      });
    } catch (err) {
      console.warn("Error merging user host listings into resort list", err);
    }

    return resortsList;
  },

  async getSearchResorts() {
    return this.getAllResorts();
  },

  async searchResorts(query) {
    const all = await this.getAllResorts();
    if (!query || !query.trim()) return all;

    const q = query.toLowerCase().trim();
    return all.filter(r => 
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.categoryLabel && r.categoryLabel.toLowerCase().includes(q)) ||
      (r.badge && r.badge.toLowerCase().includes(q))
    );
  },

  mapHostListingToResort(listing) {
    const rawCity = listing.location?.city || (typeof listing.location === 'string' ? listing.location.split(',')[0] : "Goa");
    const city = rawCity ? rawCity.trim() : "Goa";
    const cover = listing.coverImage || listing.images?.[0] || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";
    const rawPrice = Number(listing.pricePerNight || listing.price) || 24500;
    
    // Standardize category key for filter matching
    let catKey = (listing.category || "villa").toLowerCase();
    if (catKey.includes("villa")) catKey = "villa";
    else if (catKey.includes("beach")) catKey = "beach";
    else if (catKey.includes("mountain") || catKey.includes("hill")) catKey = "mountain";
    else if (catKey.includes("island")) catKey = "island";
    else if (catKey.includes("chalet")) catKey = "chalet";

    return {
      id: listing.id || `published-${Date.now()}`,
      name: listing.title || listing.name || `Luxury ${listing.category || "Villa"} in ${city}`,
      location: city,
      city: city,
      description: listing.description || "Exquisite luxury retreat designed for unforgettable staycations.",
      image: cover,
      heroImage: cover,
      price: rawPrice,
      pricePerNight: rawPrice,
      rating: 5.0,
      reviewCount: listing.reviewsCount || 0,
      reviewsCount: listing.reviewsCount || 0,
      badge: listing.category || "Luxury Stay",
      featuredTag: listing.category || "Luxury Stay",
      currency: "₹",
      highlights: (listing.amenities && listing.amenities.length > 0)
        ? listing.amenities.slice(0, 4) 
        : ["Private Infinity Pool", "High-Speed WiFi", "Climate Control"],
      amenities: (listing.amenities || []).map(a => typeof a === "string" ? { name: a, icon: "Sparkles" } : a),
      perks: ["Free Cancellation", "Breakfast Included", "Transfer Services"],
      category: catKey,
      categoryLabel: listing.category || "Luxury Villa"
    };
  },

  async getResortById(id) {
    try {
      const result = await apiClient.get(`/api/v1/resorts/${encodeURIComponent(id)}`);
      if (result && result.success && result.data) {
        const mapped = this.mapBackendResort(result.data);
        const staticResort = findStaticResort(id);

        // Numeric IDs 1..12 belong to the frontend catalog. If Firestore
        // contains a different document under the same numeric ID, never
        // show that unrelated document when opening a catalog card directly.
        if (staticResort && String(id).match(/^\d+$/) &&
            String(mapped.name || '').toLowerCase() !== String(staticResort.name || '').toLowerCase()) {
          return normalizeStaticResort(staticResort);
        }

        return mapped;
      }
      throw new Error("Resort not found");
    } catch (e) {
      console.warn("Falling back to local resort details for ID:", id, e);

      // IMPORTANT: use the same ID the listing uses.
      // Never map unrelated IDs (e.g. 2 -> Kerala) because that causes
      // a clicked resort to open a completely different property.
      const staticResort = findStaticResort(id);
      if (staticResort) return normalizeStaticResort(staticResort);

      return null;
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
    // Helper to safely split URLs that might contain base64 string commas
    const splitUrls = (urlStr) => {
      if (!urlStr) return [];
      if (urlStr.includes("|")) {
        return urlStr.split("|").filter(Boolean);
      }
      if (urlStr.includes("data:") && urlStr.includes(",")) {
        const rawParts = urlStr.split(",");
        const cleaned = [];
        for (let i = 0; i < rawParts.length; i++) {
          if (rawParts[i].startsWith("data:") || rawParts[i].startsWith("http")) {
            if (rawParts[i].startsWith("data:") && i + 1 < rawParts.length) {
              cleaned.push(rawParts[i] + "," + rawParts[i+1]);
              i++;
            } else {
              cleaned.push(rawParts[i]);
            }
          } else {
            cleaned.push(rawParts[i]);
          }
        }
        return cleaned.filter(Boolean);
      }
      return urlStr.split(",").filter(Boolean);
    };

    // Map backend resort data to match frontend static data structure
    item = item || {};
    const safeName = typeof item.name === "string" ? item.name : "Luxury Stay";
    const safeLocation = typeof item.location === "string"
      ? item.location
      : (item.location?.city || item.location?.address || "India");
    const asList = (value) => {
      if (Array.isArray(value)) return value;
      if (value == null || value === "") return [];
      return String(value).split(",").map(v => v.trim()).filter(Boolean);
    };
    const category = item.category || this.getCategoryForResort(safeName, safeLocation);
    const staticMatch = ALL_RESORTS.find(r => String(r.name).toLowerCase() === safeName.toLowerCase()) || null;
    const fallbackImage = staticMatch?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80';
    const backendImage = typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '';
    return {
      id: item.id ?? `resort-${Math.random().toString(36).slice(2)}`,
      name: safeName,
      location: safeLocation,
      description: typeof item.description === "string" ? item.description : "Luxury stay for an unforgettable experience.",
      image: backendImage || fallbackImage,
      heroImage: backendImage || fallbackImage,
      price: Number(item.pricePerNight ?? item.price ?? 0),
      pricePerNight: Number(item.pricePerNight ?? item.price ?? 0),
      rating: Number(item.rating ?? 4.5),
      reviewCount: Number(item.reviewCount ?? 0),
      reviewsCount: Number(item.reviewCount ?? 0),
      featuredTag: item.featuredTag,
      badge: item.featuredTag || "New Host", // For consistency with static data
      discount: item.discountPercentage || 0,
      currency: "₹",
      gallery: item.galleryUrls ? splitUrls(item.galleryUrls) : [backendImage || fallbackImage],
      videos: item.videoUrls ? splitUrls(item.videoUrls) : [],
      highlights: asList(item.highlights).length ? asList(item.highlights) : this.getHighlightsForResort(safeName, safeLocation),
      amenities: asList(item.amenities).map(name => ({ name, icon: "Sparkles" })),
      perks: ["Free Cancellation", "Breakfast Included", "Transfer Services"],
      category: category,
      categoryLabel: this.getCategoryLabel(safeName, safeLocation),
      specs: {
        guests: item.guests ? `${item.guests} Guests` : "2-4 Guests",
        bedrooms: item.bedrooms ? `${item.bedrooms} Bedrooms` : "1-2 Bedrooms",
        beds: item.beds ? `${item.beds} Beds` : "1-2 Beds",
        bathrooms: item.bathrooms ? `${item.bathrooms} Bathrooms` : "2 En-suite Baths",
        area: "2,500 sq.ft.",
        checkIn: "3:00 PM",
        checkOut: "11:00 AM"
      }
    };
  },

  getHighlightsForResort(name, location) {
    const lowerName = String(name || "").toLowerCase();
    const lowerLocation = String(location || "").toLowerCase();
    
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
    const lowerName = String(name || "").toLowerCase();
    const lowerLocation = String(location || "").toLowerCase();
    
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
    const result = await apiClient.post("/api/v1/resorts", resortData, { suppressAuthRedirect: true });
    if (result && result.success) {
      return result.data;
    }
    throw new Error(result?.message || "Failed to submit resort for approval");
  }
};
