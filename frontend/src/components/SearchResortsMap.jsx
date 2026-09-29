import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";

export default function SearchResortsMap({ 
  resorts = [], 
  selectedResort = null, 
  onSelectResort, 
  isDarkMode = false, 
  height = "100%" 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const navigate = useNavigate();

  const [mapLoaded, setMapLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load Google Maps script via singleton
  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey)
      .then(() => setMapLoaded(true))
      .catch((err) => {
        console.warn("SearchResortsMap failed to load Google Maps:", err.message);
      });
  }, [apiKey]);

  // Dark mode styles
  const darkMapStyles = [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }
  ];

  // Airbnb-style Price Pill generator
  const createPricePillIcon = (priceText, isActive = false) => {
    const width = Math.max(62, priceText.length * 8 + 24);
    const height = 28;
    const radius = 14;
    const bgColor = isActive ? "#0d9488" : "#ffffff";
    const textColor = isActive ? "#ffffff" : "#0f172a";
    const strokeColor = isActive ? "#0d9488" : "#cbd5e1";
    const shadowOpacity = isActive ? "0.4" : "0.22";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + 7}" viewBox="0 0 ${width} ${height + 7}">
        <defs>
          <filter id="pillShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#pillShadow)">
          <rect x="2" y="2" width="${width - 4}" height="${height}" rx="${radius}" ry="${radius}" fill="${bgColor}" stroke="${strokeColor}" stroke-width="1.5"/>
          <polygon points="${width / 2 - 4},${height + 2} ${width / 2 + 4},${height + 2} ${width / 2},${height + 6}" fill="${bgColor}" />
        </g>
        <text x="${width / 2}" y="${height / 2 + 6}" fill="${textColor}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11px" font-weight="800" text-anchor="middle">
          ${priceText}
        </text>
      </svg>
    `;

    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(width, height + 7),
      anchor: new window.google.maps.Point(width / 2, height + 7)
    };
  };

  // Initialize and update markers
  useEffect(() => {
    if (!mapLoaded || !window.google || !window.google.maps || !mapRef.current) return;

    // Center map around first resort or center of India (Goa/Mumbai region)
    const validResorts = resorts.filter(r => {
      const lat = Number(r.latitude ?? r.lat);
      const lng = Number(r.longitude ?? r.lng);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    const defaultCenter = validResorts.length > 0
      ? { lat: Number(validResorts[0].latitude ?? validResorts[0].lat), lng: Number(validResorts[0].longitude ?? validResorts[0].lng) }
      : { lat: 15.2993, lng: 74.1240 }; // Default to Goa

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 9,
        styles: isDarkMode ? darkMapStyles : [],
        mapTypeId: "roadmap",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      infoWindowRef.current = new window.google.maps.InfoWindow();
    } else {
      mapInstanceRef.current.setOptions({
        styles: isDarkMode ? darkMapStyles : []
      });
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(item => item.marker.setMap(null));
    markersRef.current = [];

    if (validResorts.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    validResorts.forEach(resort => {
      const lat = Number(resort.latitude ?? resort.lat);
      const lng = Number(resort.longitude ?? resort.lng);
      const position = { lat, lng };
      bounds.extend(position);

      const price = resort.pricePerNight ?? resort.price ?? "";
      const formattedPrice = price ? `₹${Number(price).toLocaleString("en-IN")}` : "View";
      const isSelected = selectedResort && String(selectedResort.id) === String(resort.id);

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: `${resort.name} - ${formattedPrice}`,
        icon: createPricePillIcon(formattedPrice, isSelected),
        zIndex: isSelected ? 9999 : 100,
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        // Highlight clicked marker and reset others
        markersRef.current.forEach(item => {
          const isThis = item.resortId === resort.id;
          item.marker.setIcon(createPricePillIcon(item.priceText, isThis));
          item.marker.setZIndex(isThis ? 9999 : 100);
        });

        const content = document.createElement("div");
        content.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        content.style.maxWidth = "240px";
        content.style.padding = "4px";
        content.innerHTML = `
          ${resort.image || resort.imageUrl || resort.heroImage ? `<img src="${resort.image || resort.imageUrl || resort.heroImage}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;" onerror="this.style.display='none'"/>` : ''}
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px; line-height: 1.2;">${resort.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">📍 ${resort.location || resort.city || 'India'}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 8px;">
            <div>
              <span style="font-size: 14px; font-weight: 800; color: #0d9488;">${formattedPrice}</span>
              <span style="font-size: 10px; color: #94a3b8;"> / night</span>
            </div>
            <button id="view-pill-resort-${resort.id}" style="background: #0d9488; color: #ffffff; border: none; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">View &rarr;</button>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, marker);

        infoWindowRef.current.addListener("domready", () => {
          const btn = document.getElementById(`view-pill-resort-${resort.id}`);
          if (btn) {
            btn.onclick = () => {
              navigate(`/resort/${resort.id}`, { state: { selectedResort: resort } });
            };
          }
        });

        if (onSelectResort) {
          onSelectResort(resort);
        }
      });

      markersRef.current.push({
        resortId: resort.id,
        priceText: formattedPrice,
        marker
      });
    });

    if (validResorts.length > 1) {
      map.fitBounds(bounds);
    } else if (validResorts.length === 1) {
      map.setCenter(defaultCenter);
      map.setZoom(12);
    }
  }, [mapLoaded, resorts, isDarkMode]);

  // Synchronize with external selected/hovered resort
  useEffect(() => {
    if (!selectedResort || !mapInstanceRef.current) return;
    
    markersRef.current.forEach(item => {
      const isSelected = String(item.resortId) === String(selectedResort.id);
      item.marker.setIcon(createPricePillIcon(item.priceText, isSelected));
      item.marker.setZIndex(isSelected ? 9999 : 100);
      if (isSelected) {
        mapInstanceRef.current.panTo(item.marker.getPosition());
      }
    });
  }, [selectedResort]);


  if (!apiKey) {
    return (
      <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center rounded-[24px] border ${
        isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-gray-50 border-gray-200'
      }`}>
        <MapPin className="w-10 h-10 text-primary mb-2 opacity-60" />
        <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Interactive Search Map</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
          Configure <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px]">VITE_GOOGLE_MAPS_API_KEY</code> to enable live resort pins.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-[24px] overflow-hidden shadow-sm border border-border-color">
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />
      
      {/* Live counter overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-border-color px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-[11px] font-bold text-primary">
        <Sparkles size={12} />
        <span>{resorts.length} {resorts.length === 1 ? 'Stay' : 'Stays'} on Map</span>
      </div>
    </div>
  );
}
