import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ExternalLink, Layers, Sparkles, AlertCircle } from "lucide-react";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";
import SimpleMapEmbed from "./SimpleMapEmbed";

// City coordinate directory for high-accuracy destination fallback
const CITY_COORDS = {
  pune: { lat: 18.5204, lng: 73.8567 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  goa: { lat: 15.2993, lng: 74.1240 },
  lonavala: { lat: 18.7557, lng: 73.4091 },
  khandala: { lat: 18.7610, lng: 73.3762 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  jaisalmer: { lat: 26.9157, lng: 70.9083 },
  manali: { lat: 32.2432, lng: 77.1892 },
  shimla: { lat: 31.1048, lng: 77.1734 },
  kerala: { lat: 9.9312, lng: 76.2673 },
  munnar: { lat: 10.0889, lng: 77.0595 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  gangtok: { lat: 27.3389, lng: 88.6065 },
  sikkim: { lat: 27.5330, lng: 88.5122 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  ooty: { lat: 11.4102, lng: 76.6950 },
  coorg: { lat: 12.3375, lng: 75.8069 },
  rishikesh: { lat: 30.0869, lng: 78.2676 },
  maldives: { lat: 3.2028, lng: 73.2207 }
};

export default function GoogleMap({ resort = {}, isDarkMode = false, height = "480px" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState("roadmap");
  const [loadError, setLoadError] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Resolve best coordinates
  const rawLat = Number(resort?.latitude ?? resort?.lat);
  const rawLng = Number(resort?.longitude ?? resort?.lng);
  const hasValidCoords = !isNaN(rawLat) && !isNaN(rawLng) && rawLat !== 0 && rawLng !== 0;

  const resolveCoords = () => {
    if (hasValidCoords) return { lat: rawLat, lng: rawLng };
    const text = `${resort?.name || ""} ${resort?.location || ""} ${resort?.city || ""} ${resort?.address || ""}`.toLowerCase();
    for (const [key, val] of Object.entries(CITY_COORDS)) {
      if (text.includes(key)) return val;
    }
    return { lat: 18.5204, lng: 73.8567 }; // Default Pune
  };

  const coords = resolveCoords();
  const lat = coords.lat;
  const lng = coords.lng;

  // Dark mode styles
  const darkMapStyles = [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] }
  ];

  // Load Google Maps API script
  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey)
      .then(() => setMapLoaded(true))
      .catch((err) => {
        console.warn("GoogleMap component failed to load Google Maps script:", err.message);
        setLoadError(true);
      });
  }, [apiKey]);

  // Initialize and update single resort map
  useEffect(() => {
    if (!mapLoaded || !window.google || !window.google.maps || !mapRef.current) return;

    const position = { lat, lng };

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        styles: isDarkMode && mapType === "roadmap" ? darkMapStyles : [],
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: false,
      });

      infoWindowRef.current = new window.google.maps.InfoWindow();
    } else {
      mapInstanceRef.current.setCenter(position);
      mapInstanceRef.current.setMapTypeId(mapType);
      mapInstanceRef.current.setOptions({
        styles: isDarkMode && mapType === "roadmap" ? darkMapStyles : []
      });
    }

    const map = mapInstanceRef.current;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Custom luxury pin
    const priceText = resort?.pricePerNight ?? resort?.price;
    const formattedPrice = priceText ? `₹${Number(priceText).toLocaleString("en-IN")}` : "";
    const imageUrl = resort?.image || resort?.imageUrl || resort?.heroImage || resort?.images?.[0] || "";
    const resortTitle = resort?.name || resort?.title || "Luxury Resort";
    const resortAddr = resort?.address || resort?.location || resort?.city || "Scenic Location";

    const pinSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="46" height="54" viewBox="0 0 46 54">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M 23 2 C 12 2, 3 11, 3 22 C 3 34, 23 50, 23 50 C 23 50, 43 34, 43 22 C 43 11, 34 2, 23 2 Z" fill="#0d9488" stroke="#ffffff" stroke-width="2.5"/>
          <circle cx="23" cy="22" r="9" fill="#ffffff" />
          <circle cx="23" cy="22" r="5" fill="#0d9488" />
        </g>
      </svg>
    `;

    const marker = new window.google.maps.Marker({
      position,
      map,
      title: resortTitle,
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(pinSvg),
        scaledSize: new window.google.maps.Size(46, 54),
        anchor: new window.google.maps.Point(23, 50)
      },
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    const imageHtml = imageUrl
      ? `<img src="${imageUrl}" alt="${resortTitle}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 12px; margin-bottom: 10px; display: block;" onerror="this.style.display='none'"/>`
      : "";

    const priceHtml = formattedPrice
      ? `<div style="font-size: 14px; font-weight: 800; color: #0d9488; margin-top: 4px;">${formattedPrice} <span style="font-size: 10px; font-weight: 500; color: #64748b;">/ night</span></div>`
      : "";

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;

    const infoContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; width: 230px; box-sizing: border-box;">
        ${imageHtml}
        <div style="font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.25; margin-bottom: 3px;">
          ${resortTitle}
        </div>
        <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-bottom: 6px;">
          📍 ${resortAddr}
        </div>
        ${priceHtml}
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9;">
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="width: 100%; text-align: center; box-sizing: border-box; background: #0d9488; color: #ffffff; text-decoration: none; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; display: inline-block;">
            Get Driving Directions →
          </a>
        </div>
      </div>
    `;

    marker.addListener("click", () => {
      infoWindowRef.current.setContent(infoContent);
      infoWindowRef.current.open(map, marker);
    });

  }, [mapLoaded, isDarkMode, mapType, lat, lng, resort]);

  // Fallback to SimpleMapEmbed if API key is not configured or failed to load
  if (!apiKey || loadError) {
    return (
      <SimpleMapEmbed 
        latitude={lat} 
        longitude={lng} 
        height={height} 
        isDarkMode={isDarkMode} 
        address={resort?.address || resort?.location || resort?.name} 
      />
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border-color shadow-sm" style={{ height }}>
      {/* Map Canvas */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Type Controls (Roadmap / Satellite) */}
      <div className="absolute top-3 right-3 z-10 flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-border-color">
        <button
          type="button"
          onClick={() => setMapType("roadmap")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border-none ${
            mapType === "roadmap"
              ? "bg-primary text-white shadow-xs"
              : "bg-transparent text-text-gray hover:text-text-dark"
          }`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setMapType("satellite")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border-none flex items-center gap-1.5 ${
            mapType === "satellite"
              ? "bg-primary text-white shadow-xs"
              : "bg-transparent text-text-gray hover:text-text-dark"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Satellite
        </button>
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border-color shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-text-dark truncate">
            {resort?.address || resort?.location || "Resort coordinates"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const dest = hasValidCoords ? `${lat},${lng}` : encodeURIComponent(resort?.name || "");
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, "_blank");
          }}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 bg-transparent border-none cursor-pointer"
        >
          Open in Maps <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
