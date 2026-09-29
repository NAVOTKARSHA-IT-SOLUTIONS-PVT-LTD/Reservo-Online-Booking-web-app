import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, Navigation, ExternalLink, Loader2, X, Compass, CheckCircle2, Crosshair } from "lucide-react";
import placesService from "../services/places.service";
import locationTrackingService from "../services/locationTracking.service";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";

export default function GoogleLocationPicker({ value, onChange, height = "380px", isDarkMode = false }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const lastGeocodedQueryRef = useRef("");
  const isInternalMapActionRef = useRef(false);

  // Auto-display and locate typed address on map
  useEffect(() => {
    if (!value) return;

    if (value.address && !query) {
      setQuery(value.address);
    }
    setSelectedPlace(value);

    // If change was triggered by pin drag or map click, skip forward geocoding
    if (isInternalMapActionRef.current) {
      isInternalMapActionRef.current = false;
      return;
    }

    const lat = Number(value.latitude ?? value.lat);
    const lng = Number(value.longitude ?? value.lng);

    // If explicit coordinates exist and are valid, center map
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      if (mapInstanceRef.current && markerRef.current) {
        const pos = { lat, lng };
        mapInstanceRef.current.panTo(pos);
        markerRef.current.setPosition(pos);
      }
      return;
    }

    // If user typed in address fields (Street Address, City, State, PIN):
    const parts = [
      value.address,
      value.city,
      value.state,
      value.pinCode,
      value.country || "India"
    ]
      .filter(Boolean)
      .map(s => String(s).trim())
      .filter(s => s.length > 0);

    const searchQuery = parts.join(", ");

    // Only forward-geocode if user provided at least a City or Address
    if (parts.length >= 2 && searchQuery !== lastGeocodedQueryRef.current) {
      const timer = setTimeout(() => {
        lastGeocodedQueryRef.current = searchQuery;
        locateTypedAddressOnMap(searchQuery);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [value?.address, value?.city, value?.state, value?.pinCode, value?.country, value?.latitude, value?.longitude]);

  // Forward geocode typed input and drop pin on map
  const locateTypedAddressOnMap = async (addressText) => {
    if (!addressText || addressText.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressText)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          if (!isNaN(lat) && !isNaN(lng)) {
            const pos = { lat, lng };
            if (mapInstanceRef.current && markerRef.current) {
              mapInstanceRef.current.panTo(pos);
              mapInstanceRef.current.setZoom(15);
              markerRef.current.setPosition(pos);
            }

            // Sync resolved coordinates back to parent without replacing user's typed texts
            onChange?.({
              ...(value || {}),
              latitude: lat,
              longitude: lng,
              googlePlaceId: String(data[0].place_id || "")
            });
          }
        }
      }
    } catch (e) {
      console.warn("Typed address geocoding fallback error:", e.message);
    }
  };

  // Load Google Maps API script safely via singleton
  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey)
      .then(() => {
        initMap();
      })
      .catch((err) => {
        console.warn("Google Maps loader:", err.message);
      });
  }, [apiKey]);

  // Initialize Interactive Map with Draggable Pin
  const initMap = () => {
    if (!mapContainerRef.current || !window.google || !window.google.maps) return;

    const hasInitialCoords = value?.latitude != null && value?.longitude != null;
    const initialLat = Number(value?.latitude ?? value?.lat ?? 18.5204);
    const initialLng = Number(value?.longitude ?? value?.lng ?? 73.8567);
    const initialPos = { lat: initialLat, lng: initialLng };

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: initialPos,
        zoom: hasInitialCoords ? 15 : 12,
        mapTypeId: "roadmap",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      markerRef.current = new window.google.maps.Marker({
        position: initialPos,
        map: mapInstanceRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: "Drag to pinpoint exact property location",
      });

      // When host drags the pin on the map
      markerRef.current.addListener("dragend", () => {
        const newPos = markerRef.current.getPosition();
        if (newPos) {
          locationTrackingService.trackLocation({
            latitude: newPos.lat(),
            longitude: newPos.lng(),
            action: "MAP_PIN_DRAGGED",
            googleMapsOperation: "google.maps.Marker (dragend)",
          });
          reverseGeocodePosition(newPos.lat(), newPos.lng());
        }
      });

      // When host clicks anywhere on the map
      mapInstanceRef.current.addListener("click", (e) => {
        if (e.latLng) {
          locationTrackingService.trackLocation({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
            action: "MAP_CLICKED",
            googleMapsOperation: "google.maps.Map (click)",
          });
          markerRef.current.setPosition(e.latLng);
          reverseGeocodePosition(e.latLng.lat(), e.latLng.lng());
        }
      });
    }
  };

  // Safe Reverse Geocoding without triggering Google billing console errors
  const reverseGeocodePosition = async (lat, lng) => {
    try {
      // Use free high-accuracy reverse geocoder (works without Google billing account)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const city = addr.city || addr.town || addr.suburb || addr.county || addr.state_district || "";
        const state = addr.state || "";
        const country = addr.country || "India";
        const pinCode = addr.postcode || "";
        const formatted = data.display_name || `${city}, ${state}`;

        const updated = {
          address: formatted,
          city: city || value?.city || "",
          state: state || value?.state || "",
          country: country || value?.country || "India",
          pinCode: pinCode || value?.pinCode || "",
          latitude: lat,
          longitude: lng,
          googlePlaceId: String(data.place_id || ""),
        };

        isInternalMapActionRef.current = true;
        setSelectedPlace(updated);
        setQuery(formatted);
        onChange?.(updated);
        return;
      }
    } catch (e) {
      console.warn("Reverse geocode fallback:", e.message);
    }

    // Direct coordinate update if network fails
    const fallbackUpdate = {
      ...(value || {}),
      latitude: lat,
      longitude: lng,
    };
    isInternalMapActionRef.current = true;
    setSelectedPlace(fallbackUpdate);
    onChange?.(fallbackUpdate);
  };

  // Click "Use My Current Location" button
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const position = { lat, lng };

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.panTo(position);
          mapInstanceRef.current.setZoom(16);
          markerRef.current.setPosition(position);
        }

        locationTrackingService.trackLocation({
          latitude: lat,
          longitude: lng,
          action: "CURRENT_LOCATION_DETECTED",
          googleMapsOperation: "navigator.geolocation.getCurrentPosition",
        });

        reverseGeocodePosition(lat, lng);
      },
      (err) => {
        setDetectingLocation(false);
        alert("Unable to detect your current location. Please check browser location permissions or type in the search box.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Autocomplete search - Modern & safe without calling deprecated legacy APIs
  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);

    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);

    // 1. Try Backend Places API (New)
    try {
      const results = await placesService.getAutocompleteSuggestions(searchQuery);
      if (Array.isArray(results) && results.length > 0) {
        setSuggestions(results);
        setShowSuggestions(true);
        setLoading(false);
        return;
      }
    } catch (_) {}

    // 2. Safe Places API (New) modern suggestions if available in JS SDK
    if (window.google?.maps?.places?.AutocompleteSuggestion) {
      try {
        const response = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: searchQuery
        });
        if (response?.suggestions && response.suggestions.length > 0) {
          const mapped = response.suggestions.map(s => {
            const pred = s.placePrediction;
            return {
              placeId: pred?.placeId,
              description: pred?.text?.text || searchQuery,
              structured_formatting: {
                mainText: pred?.structuredFormat?.mainText?.text || pred?.text?.text,
                secondaryText: pred?.structuredFormat?.secondaryText?.text || ""
              }
            };
          });
          setSuggestions(mapped);
          setShowSuggestions(true);
          setLoading(false);
          return;
        }
      } catch (_) {}
    }

    // 3. Robust OpenSearch fallback (Free, zero billing, zero console errors)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => {
            const addr = item.address || {};
            const city = addr.city || addr.town || addr.suburb || addr.county || "";
            const state = addr.state || "";
            return {
              placeId: String(item.place_id),
              description: item.display_name,
              structured_formatting: {
                mainText: item.name || city || item.display_name.split(",")[0],
                secondaryText: [city, state, addr.country].filter(Boolean).join(", ")
              },
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              addressDetails: addr
            };
          });
          setSuggestions(mapped);
          setShowSuggestions(true);
          setLoading(false);
          return;
        }
      }
    } catch (_) {}

    setLoading(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // When suggestion clicked
  const handleSuggestionClick = async (suggestion) => {
    setLoading(true);
    setShowSuggestions(false);

    // If suggestion already contains coordinates (from OpenSearch fallback)
    if (suggestion.lat && suggestion.lng) {
      const addr = suggestion.addressDetails || {};
      const city = addr.city || addr.town || addr.suburb || addr.county || "";
      const state = addr.state || "";
      const country = addr.country || "India";
      const pinCode = addr.postcode || "";

      applyLocation({
        address: suggestion.description,
        city: city || value?.city || "",
        state: state || value?.state || "",
        country: country || value?.country || "India",
        pinCode: pinCode || value?.pinCode || "",
        latitude: suggestion.lat,
        longitude: suggestion.lng,
        googlePlaceId: suggestion.placeId,
      });
      setLoading(false);
      return;
    }

    // Try backend place details
    try {
      const locationData = await placesService.getPlaceDetails(suggestion.placeId);
      if (locationData && locationData.latitude && locationData.longitude) {
        applyLocation(locationData);
        setLoading(false);
        return;
      }
    } catch (_) {}

    // Fallback: search place text to resolve coordinates without billing error
    try {
      const searchQuery = suggestion.structured_formatting?.mainText
        ? `${suggestion.structured_formatting.mainText}, ${suggestion.structured_formatting?.secondaryText || ""}`
        : suggestion.description;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          const item = data[0];
          const addr = item.address || {};
          applyLocation({
            address: item.display_name || suggestion.description,
            city: addr.city || addr.town || addr.county || "",
            state: addr.state || "",
            country: addr.country || "India",
            pinCode: addr.postcode || "",
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            googlePlaceId: suggestion.placeId,
          });
          setLoading(false);
          return;
        }
      }
    } catch (_) {}

    setLoading(false);
  };

  const applyLocation = (locationData) => {
    console.log("📍 [Map Location Selected] -> Latitude:", locationData.latitude, "Longitude:", locationData.longitude, "Address:", locationData.address);
    isInternalMapActionRef.current = true;
    setSelectedPlace(locationData);
    setQuery(locationData.address || "");
    setSuggestions([]);

    if (locationData.latitude && locationData.longitude) {
      locationTrackingService.trackLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        action: "MAP_LOCATION_SELECTED",
        googleMapsOperation: "Google Maps / Places Selection",
        formattedAddress: locationData.address || ""
      });
    }

    if (mapInstanceRef.current && locationData.latitude && locationData.longitude) {
      const pos = { lat: Number(locationData.latitude), lng: Number(locationData.longitude) };
      mapInstanceRef.current.panTo(pos);
      mapInstanceRef.current.setZoom(16);
      if (markerRef.current) {
        markerRef.current.setPosition(pos);
      } else if (window.google?.maps?.Marker) {
        markerRef.current = new window.google.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
          title: "Drag to pinpoint exact property location",
        });
        markerRef.current.addListener("dragend", () => {
          const newPos = markerRef.current.getPosition();
          if (newPos) {
            reverseGeocodePosition(newPos.lat(), newPos.lng());
          }
        });
      }
    }

    onChange?.(locationData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedPlace(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Search Bar with "Use Current Location" Action */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search property or landmark name (e.g., Sunny's World, Taj Exotica)..."
              className="w-full pl-10 pr-10 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl text-xs font-semibold text-[var(--color-text-dark)] outline-none focus:border-primary shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {loading && (
              <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.placeId}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800/50 last:border-b-0 transition flex items-start gap-3"
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                      {suggestion.structured_formatting?.mainText || suggestion.description}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.structured_formatting?.secondaryText || suggestion.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Use My Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={detectingLocation}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-primary/40 hover:border-primary text-primary hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-2xl text-xs font-bold transition shadow-sm shrink-0 cursor-pointer"
          title="Detect and set my current GPS location"
        >
          {detectingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <Crosshair className="w-4 h-4 text-primary" />
              <span>Use My Location</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive Google Map Canvas */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden border border-[var(--color-border-color)] shadow-sm bg-gray-100 dark:bg-slate-800"
        style={{ height }}
      >
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Helper Badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-[11px] font-bold text-gray-800 dark:text-gray-200 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span>Click anywhere or drag pin to adjust exact location</span>
        </div>

        {/* Fallback info when no API key */}
        {!apiKey && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 p-4 text-center">
            <MapPin className="w-10 h-10 text-primary mb-2 opacity-60" />
            <p className="text-sm font-bold text-gray-800">Map View Available</p>
            <p className="text-xs text-gray-500 mt-1 max-w-[260px]">
              Set <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="text-[10px]">frontend/.env</code> to render live interactive satellite/roadmap tiles.
            </p>
          </div>
        )}
      </div>

      {/* 3. Selected Address & Coordinate Confirmation Card */}
      {selectedPlace?.address && (
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-blue-950 dark:text-blue-200">Location Pin Set</p>
            <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-0.5 break-words line-clamp-2">
              {selectedPlace.address}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {selectedPlace.city && (
                <span className="text-[10px] bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  City: {selectedPlace.city}
                </span>
              )}
              {selectedPlace.state && (
                <span className="text-[10px] bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  State: {selectedPlace.state}
                </span>
              )}
              {selectedPlace.pinCode && (
                <span className="text-[10px] bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  PIN: {selectedPlace.pinCode}
                </span>
              )}
              {selectedPlace.latitude && selectedPlace.longitude && (
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                  {Number(selectedPlace.latitude).toFixed(5)}, {Number(selectedPlace.longitude).toFixed(5)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}