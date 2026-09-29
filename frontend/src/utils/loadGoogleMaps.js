let googleMapsPromise = null;

// Suppress Google Maps non-actionable deprecation warnings (e.g. google.maps.Marker notice)
if (typeof window !== "undefined" && !window.__googleMapsWarnFiltered) {
  window.__googleMapsWarnFiltered = true;
  const originalWarn = console.warn;
  console.warn = function (...args) {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (msg.includes("google.maps.Marker is deprecated") || msg.includes("AdvancedMarkerElement")) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

/**
 * Singleton Google Maps API Loader.
 * Prevents multiple script injections and duplicate callback console errors.
 */
export function loadGoogleMaps(apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not defined"));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key not configured"));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          resolve(window.google.maps);
        }
      }, 100);
      return;
    }

    const callbackName = "__initGoogleMapsGlobal";
    window[callbackName] = () => {
      resolve(window.google.maps);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
