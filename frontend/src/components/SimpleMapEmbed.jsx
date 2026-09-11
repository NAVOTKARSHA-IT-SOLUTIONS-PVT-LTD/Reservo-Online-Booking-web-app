import React from 'react';

export default function SimpleMapEmbed({ 
  latitude, 
  longitude, 
  zoom = 15, 
  height = "400px", 
  isDarkMode = false,
  address = ""
}) {
  // Use address if provided, otherwise fallback to coordinates
  const query = address ? encodeURIComponent(address) : `${latitude},${longitude}`;
  
  return (
    <div 
      className={`w-full rounded-2xl overflow-hidden border shadow-sm ${
        isDarkMode ? 'border-[#334155] bg-[#1E293B]' : 'border-[#E2E8F0] bg-gray-50'
      }`}
      style={{ height }}
    >
      <iframe
        title="Google Maps Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${query}&t=m&z=${zoom}&output=embed&iwloc=near`}
      />
    </div>
  );
}
