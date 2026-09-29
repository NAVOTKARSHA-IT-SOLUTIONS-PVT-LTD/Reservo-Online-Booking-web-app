import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ExternalLink, Layers, Sparkles, AlertCircle } from "lucide-react";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";
import SimpleMapEmbed from "./SimpleMapEmbed";

export default function GoogleMap({ resort = {}, isDarkMode = false, height = "480px" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState("roadmap");
  const [loadError, setLoadError] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const lat = Number(resort?.latitude ?? resort?.lat ?? 15.2993);
  const lng = Number(resort?.longitude ?? resort?.lng ?? 74.1240);
  const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  // Dark mode styles
  const darkMapStyles = [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }
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

    const position = hasValidCoords ? { lat, lng } : { lat: 15.2993, lng: 74.1240 };

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: hasValidCoords ? 15 : 12,
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
      title: resort?.name || "Resort Location",
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(pinSvg),
        scaledSize: new window.google.maps.Size(46, 54),
        anchor: new window.google.maps.Point(23, 50)
      },
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    const infoContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 4px; max-width: 250px; color: #0f172a;">
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0f172a;">${resort?.name || "Resort"}</h4>
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${resort?.address || resort?.location || "Scenic Location"}</p>
        ${formattedPrice ? `<div style="font-size: 13px; font-weight: 800; color: #0d9488; margin-bottom: 6px;">${formattedPrice} <span style="font-size: 10px; color: #64748b; font-weight: 500;">/ night</span></div>` : ""}
        <a href="https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}" target="_blank" rel="noopener noreferrer" style="display: inline-block; font-size: 11px; font-weight: 700; color: #ffffff; background: #0d9488; padding: 4px 10px; border-radius: 9999px; text-decoration: none;">Get Directions →</a>
      </div>
    `;

    marker.addListener("click", () => {
      infoWindowRef.current.setContent(infoContent);
      infoWindowRef.current.open(map, marker);
    });

  }, [mapLoaded, isDarkMode, mapType, hasValidCoords, lat, lng, resort]);

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
