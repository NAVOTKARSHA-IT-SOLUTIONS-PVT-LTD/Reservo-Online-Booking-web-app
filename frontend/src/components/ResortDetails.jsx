import React, { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Heart, MapPin, Share, Play, Waves, Sparkles, Wifi, Utensils, Shield, Check, X } from "lucide-react";
import ResortNavigationMap from "./ResortNavigationMap";

import { useTranslation } from "../hooks/useTranslation";

export default function ResortDetails({ resort, urlId, isDarkMode, onBack, currencySymbol = "₹", exchangeRate = 1, onBook }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { wishlist, toggleWishlist } = useWishlist();
  const targetId = urlId ? (isNaN(urlId) ? urlId : `home-${urlId}`) : resort.id;
  const isFavorited = wishlist.some((item) => item.id === targetId);

  const toggleFavorite = () => {
    if (isFavorited) {
      const matchingItem = wishlist.find((item) => item.id === targetId);
      if (matchingItem) {
        toggleWishlist(matchingItem);
      }
    } else {
      toggleWishlist({ ...resort, id: targetId });
    }
  };
  const [checkIn, setCheckIn] = useState("2026-05-12");
  const [checkOut, setCheckOut] = useState("2026-05-15");
  const [guests, setGuests] = useState("2 Guests, 1 Room");

  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [resortPosts, setResortPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (activeDetailTab === "posts") {
      setLoadingPosts(true);
      fetch(`/api/v1/resorts/${resort.id || 1}/posts`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to load posts");
        })
        .then(body => {
          if (body.data) setResortPosts(body.data);
          setLoadingPosts(false);
        })
        .catch(err => {
          console.error(err);
          // Local fallback
          setResortPosts([
            { id: 1, resortId: resort.id || 1, type: "image", mediaUrl: resort.heroImage || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80", caption: `🌴 Sunsets & Sanctuary. Our newly updated private infinity pool suite is ready to welcome you to ${resort.name || "our resort"}.`, createdAt: new Date().toISOString() },
            { id: 2, resortId: resort.id || 1, type: "image", mediaUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80", caption: "🍳 Luxury breakfast by the private beachfront cove. Complimentary for all our premium suite bookings.", createdAt: new Date(Date.now() - 86400000).toISOString() }
          ]);
          setLoadingPosts(false);
        });
    }
  }, [activeDetailTab, resort.id]);

  // Format price
  const convertedPriceVal = resort.price ? Math.round(resort.price * exchangeRate) : 8000;
  const formattedPrice = convertedPriceVal.toLocaleString();

  const handleCheckAvailability = () => {
    if (onBook) {
      onBook(resort);
    } else {
      navigate("/resorts", { state: { checkAvailabilityFor: resort.id } });
    }
  };

  const handleExploreMore = () => {
    navigate("/resorts");
  };

  const dynamicPhotos = resortPosts
    .filter(post => post.type === "IMAGE" || post.type === "image")
    .map(post => post.mediaUrl);
  
  const dynamicVideos = resortPosts
    .filter(post => post.type === "VIDEO" || post.type === "video")
    .map(post => post.mediaUrl);

  const finalGallery = resort.gallery && resort.gallery.length > 0 
    ? resort.gallery 
    : [resort.image || resort.imageUrl, ...dynamicPhotos].filter(Boolean);

  const finalVideos = resort.videos && resort.videos.length > 0
    ? resort.videos
    : dynamicVideos.length > 0 ? dynamicVideos : ["https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-swimming-pool-42244-large.mp4"];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 py-8 font-sans transition-colors duration-300">
      
      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Hero Card + Gallery) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero Card */}
          <div 
            className="relative rounded-[32px] overflow-hidden min-h-[480px] flex flex-col justify-between p-6 sm:p-8 bg-cover bg-center shadow-lg border border-border-color transition-all duration-500"
            style={{ backgroundImage: `url(${resort.heroImage})` }}
          >
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-0"></div>

            {/* Top Bar (Back & Action Buttons) */}
            <div className="relative z-10 flex justify-between items-center w-full">
              {/* Back Button */}
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold hover:bg-black/60 transition cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to results
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleFavorite}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md hover:bg-black/60 transition cursor-pointer"
                  aria-label="Wishlist Resort"
                >
                  <Heart size={18} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                </button>
                <button 
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold shadow-md hover:bg-black/60 transition cursor-pointer"
                >
                  <Share size={14} /> Share
                </button>
              </div>
            </div>

            {/* Bottom Info Specs */}
            <div className="relative z-10 space-y-4 text-white mt-auto">
              
              {/* Rating area */}
              <div className="flex items-center gap-3">
                <div className="bg-primary/95 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-bold text-sm shadow-md border border-white/10">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" /> {resort.rating || "4.9"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Excellent</span>
                  <span className="text-[10px] text-white/80">{resort.reviewsCount || "128"} reviews</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight">
                {resort.name}
              </h1>

              {/* Location & Tag */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1 text-xs font-medium text-white/90">
                  <MapPin size={14} className="text-primary" /> {resort.location}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 backdrop-blur-md text-white border border-primary/30 px-3 py-1 rounded-full">
                  {resort.categoryLabel || "Beachfront Resort"}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-[620px]">
                {resort.description || "Experience the perfect blend of luxury and nature. Relax by the beach, indulge in world-class amenities, and create unforgettable memories."}
              </p>

              {/* Amenities horizontal list */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-5 pt-2 border-t border-white/10 text-white/90">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Waves size={14} className="text-primary" /> Beachfront
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Waves size={14} className="text-primary" /> Pool
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Sparkles size={14} className="text-primary" /> Spa
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Wifi size={14} className="text-primary" /> Free Wi-Fi
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Utensils size={14} className="text-primary" /> Restaurant
                </div>
                <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded-full">
                  +12 more
                </span>
              </div>

            </div>
          </div>

          {/* Gallery Thumbnails row */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
            {/* View Video */}
            <div 
              onClick={() => setActiveVideoUrl(finalVideos[0])}
              className="relative rounded-2xl overflow-hidden cursor-pointer h-20 shadow-sm border border-border-color group"
            >
              <img src={finalGallery[0]} alt="Video preview" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 text-white z-10">
                <Play size={16} className="fill-current" />
                <span className="text-[9px] font-bold uppercase tracking-wider">View Video</span>
              </div>
            </div>

            {/* Gallery images */}
            {finalGallery.slice(1, 5).map((imgUrl, i) => (
              <div key={i} className="rounded-2xl overflow-hidden cursor-pointer h-20 shadow-sm border border-border-color group">
                <img src={imgUrl} alt={`Gallery thumbnail ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
            ))}

            {/* View Photos Overlay */}
            <div className="relative rounded-2xl overflow-hidden cursor-pointer h-20 shadow-sm border border-border-color group">
              <img src={finalGallery[0]} alt="Photos preview" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10">
                <span className="text-sm font-extrabold">+{finalGallery.length > 5 ? finalGallery.length - 5 : finalGallery.length}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Photos</span>
              </div>
            </div>
          </div>

          {/* Tabs bar */}
          <div className="flex border-b border-border-color gap-6 mt-6 shrink-0 overflow-x-auto pb-1 text-left">
            {[
              { id: "overview", label: "Overview" },
              { id: "location", label: "Location & Spots" },
              { id: "posts", label: "Resort Feed" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`pb-3 text-xs font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer transition-all duration-300 ${
                  activeDetailTab === tab.id
                    ? "text-primary border-b-2 border-primary font-extrabold"
                    : "text-text-gray hover:text-text-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content panel */}
          <div className="mt-4">
            {activeDetailTab === "overview" && (
              <div className="space-y-4 text-left animate-in fade-in duration-200">
                <p className="text-text-dark text-xs sm:text-sm leading-relaxed">
                  {resort.description || "Experience the perfect blend of luxury and nature. Relax by the beach, indulge in world-class amenities, and create unforgettable memories."}
                </p>
                
                {/* Amenities list */}
                <h4 className="text-xs font-bold uppercase text-text-dark tracking-wide pt-2">Featured Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Beachfront Access", "Infinity Pool", "Wellness Spa Center", "High-speed Wi-Fi", "Signature Fine Dining", "24/7 Butler Service"].map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-bg-light rounded-xl border border-border-color text-xs font-semibold text-text-dark">
                      <Check className="w-3.5 h-3.5 text-primary" /> {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDetailTab === "location" && (
              <div className="space-y-4 text-left animate-in fade-in duration-200">
                {resort.mapPoints && resort.mapPoints.length > 0 ? (
                  <ResortNavigationMap 
                    mapPoints={resort.mapPoints}
                    resortName={resort.name}
                    isDarkMode={isDarkMode}
                    onSelectSpot={(spot) => {
                      const mascotBtn = document.querySelector('[aria-label="Toggle Rivo AI Companion"]') || document.querySelector('[aria-label="Chat with Rivo"]');
                      if (mascotBtn) {
                        const chatOpen = document.querySelector('form button[type="submit"]');
                        if (!chatOpen) mascotBtn.click();
                        setTimeout(() => {
                          const inputEl = document.querySelector('form input[placeholder*="Ask Rivo"]') || document.querySelector('form input[placeholder*="Ask"]');
                          if (inputEl) {
                            inputEl.value = `Tell me about ${spot.title} at ${resort.name}`;
                            const event = new Event('input', { bubbles: true });
                            inputEl.dispatchEvent(event);
                          }
                        }, 400);
                      }
                    }}
                  />
                ) : (
                  <div className="p-6 text-center text-xs text-text-gray font-semibold border border-border-color rounded-2xl">
                    No map points or local spots configured for this resort.
                  </div>
                )}
              </div>
            )}

            {activeDetailTab === "posts" && (
              <div className="space-y-4 text-left animate-in fade-in duration-200">
                {loadingPosts ? (
                  <div className="flex items-center justify-center py-10 gap-2">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-text-gray">Fetching latest stories...</span>
                  </div>
                ) : resortPosts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-text-gray font-semibold border border-border-color rounded-2xl">
                    This resort hasn't posted any updates yet. Check back soon!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resortPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-bg-white border border-border-color rounded-2xl overflow-hidden shadow-sm hover:shadow transition"
                      >
                        <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                          <img src={post.mediaUrl} alt="Resort Post" className="w-full h-full object-cover" />
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-[8px] font-bold uppercase tracking-wider">
                            {post.type === "image" ? "📸 Story" : post.type === "video" ? "🎥 Video" : "🎉 Event"}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="text-xs text-text-dark font-semibold leading-relaxed line-clamp-3">
                            {post.caption}
                          </p>
                          <div className="text-[9px] text-text-gray font-bold border-t border-border-color pt-2 mt-2">
                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Sticky Booking Card) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-bg-white border border-border-color rounded-[32px] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.05)] space-y-5 transition-colors duration-300">
            
            {/* Rates Header */}
            <div>
              <span className="text-xs text-text-gray/80 font-medium block">{t("from")}</span>
              <div className="text-[28px] font-extrabold text-text-dark transition-colors duration-300">
                {currencySymbol}{formattedPrice} <span className="text-sm text-text-gray font-semibold">/ {t("per_night")}</span>
              </div>
              <span className="text-xs text-text-gray/70 block mt-0.5">Inclusive of taxes</span>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3.5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Check-in</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border border-border-color rounded-xl px-3 py-2.5 text-xs font-semibold bg-bg-light text-text-dark focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Check-out</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-border-color rounded-xl px-3 py-2.5 text-xs font-semibold bg-bg-light text-text-dark focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

            </div>

            {/* Guests Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Guests & Rooms</label>
              <select 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border border-border-color rounded-xl px-3 py-2.5 text-xs font-semibold bg-bg-light text-text-dark focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="1 Guest, 1 Room">1 Guest, 1 Room</option>
                <option value="2 Guests, 1 Room">2 Guests, 1 Room</option>
                <option value="3 Guests, 2 Rooms">3 Guests, 2 Rooms</option>
                <option value="4 Guests, 2 Rooms">4 Guests, 2 Rooms</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleCheckAvailability}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-[0_5px_15px_rgba(13,71,161,0.2)] hover:shadow-[0_8px_20px_rgba(13,71,161,0.3)] transition-all cursor-pointer border-none"
              >
                Check Availability
              </button>

              <button 
                onClick={handleExploreMore}
                className="w-full py-3.5 bg-transparent hover:bg-primary/5 text-primary border border-primary/20 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Explore More &rarr;
              </button>
            </div>

            {/* Footer badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-text-gray font-semibold pt-1 border-t border-border-color">
              <Check size={14} className="text-primary bg-primary/10 rounded-full p-0.5" />
              <span>Free cancellation up to 24 hours</span>
            </div>

          </div>
        </div>

      </div>

      {activeVideoUrl && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[10005] p-4 animate-fade-in" onClick={() => setActiveVideoUrl(null)}>
          <div className="relative w-full max-w-4xl aspect-[16/9] bg-black rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/45 text-white rounded-full p-2 border-none cursor-pointer z-30 transition flex items-center justify-center"
              onClick={() => setActiveVideoUrl(null)}
            >
              <X size={20} />
            </button>
            <video src={activeVideoUrl} controls autoPlay className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
