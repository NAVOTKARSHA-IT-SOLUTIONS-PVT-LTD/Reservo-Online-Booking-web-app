import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, Heart, MapPin, Share, Play, Waves, Sparkles, Wifi, Check, X, ChevronDown, Plus, Minus, Calendar as CalendarIcon,
  Coffee, Compass, Mountain, Tv, Zap, Wind, Award, HeartHandshake, Flame,
  ChevronLeft, ChevronRight, Maximize2
} from "lucide-react";
import ResortNavigationMap from "./ResortNavigationMap";
import CustomCalendar from "./CustomCalendar";
import SimpleMapEmbed from "./SimpleMapEmbed";
import { rewardService } from "../services/reward.service";
import { bookingService } from "../services/booking.service";
import { apiClient } from "../services/apiClient";

import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../context/ToastContext";

const getAmenityIcon = (name = "") => {
  const lower = String(name).toLowerCase();
  if (lower.includes("view") || lower.includes("compass") || lower.includes("panoramic")) {
    return Compass;
  }
  if (lower.includes("mountain") || lower.includes("snow") || lower.includes("peak") || lower.includes("hill")) {
    return Mountain;
  }
  if (lower.includes("pool") || lower.includes("swim") || lower.includes("jacuzzi") || lower.includes("hot tub") || lower.includes("water") || lower.includes("beach") || lower.includes("ocean") || lower.includes("lake")) {
    return Waves;
  }
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("network")) {
    return Wifi;
  }
  if (lower.includes("chef") || lower.includes("cook") || lower.includes("dining") || lower.includes("restaurant") || lower.includes("food") || lower.includes("coffee") || lower.includes("breakfast")) {
    return Coffee;
  }
  if (lower.includes("fire") || lower.includes("hearth") || lower.includes("pit")) {
    return Flame;
  }
  if (lower.includes("work") || lower.includes("tv") || lower.includes("desk") || lower.includes("office")) {
    return Tv;
  }
  if (lower.includes("ev") || lower.includes("charg") || lower.includes("electric")) {
    return Zap;
  }
  if (lower.includes("climate") || lower.includes("air") || lower.includes("cooling") || lower.includes("ac") || lower.includes("wind")) {
    return Wind;
  }
  if (lower.includes("butler") || lower.includes("concierge") || lower.includes("award")) {
    return Award;
  }
  if (lower.includes("pet") || lower.includes("dog") || lower.includes("cat") || lower.includes("animal")) {
    return HeartHandshake;
  }
  if (lower.includes("spa") || lower.includes("wellness") || lower.includes("massage") || lower.includes("sauna")) {
    return Sparkles;
  }
  return Sparkles;
};

export default function ResortDetails({ resort, urlId, isDarkMode, onBack, currencySymbol = "₹", exchangeRate = 1, onBook }) {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { t } = useTranslation();
  const toast = useToast();
  const { wishlist, toggleWishlist } = useWishlist();
  const targetId = urlId || resort.id;
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

  const calendarRef = useRef(null);
  const guestPickerRef = useRef(null);

  const getTodayStr = () => new Date().toISOString().split("T")[0];

  // Generate sample map points for resorts that don't have them configured
  const generateSampleMapPoints = (resortName) => {
    const basePoints = [
      {
        id: 'main-reception',
        title: 'Main Reception',
        category: 'accommodation',
        x: 50,
        y: 50,
        walkTime: '0 min',
        status: 'Open 24/7',
        desc: 'Central reception with concierge services, luggage storage, and check-in/check-out facilities.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099925?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'infinity-pool',
        title: 'Infinity Pool',
        category: 'leisure',
        x: 30,
        y: 35,
        walkTime: '2 min',
        status: 'Open 6AM-10PM',
        desc: 'Temperature-controlled infinity pool with ocean views, poolside service, and luxury cabanas.',
        image: 'https://images.unsplash.com/photo-1576013571620-4f1b7dd30b47?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'private-beach',
        title: 'Private Beach Access',
        category: 'leisure',
        x: 70,
        y: 40,
        walkTime: '3 min',
        status: 'Open 24/7',
        desc: 'Exclusive private beach with sun loungers, water sports equipment, and beach butler service.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'wellness-spa',
        title: 'Wellness Spa Center',
        category: 'wellness',
        x: 45,
        y: 65,
        walkTime: '4 min',
        status: 'Open 9AM-9PM',
        desc: 'Full-service spa with massage therapies, sauna, steam room, and beauty treatments.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fine-dining',
        title: 'Fine Dining Restaurant',
        category: 'dining',
        x: 55,
        y: 30,
        walkTime: '3 min',
        status: 'Open 7AM-11PM',
        desc: 'Award-winning restaurant serving local and international cuisine with ocean-view seating.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'helipad',
        title: 'Helipad & Arrivals',
        category: 'transport',
        x: 80,
        y: 70,
        walkTime: '5 min',
        status: 'On Request',
        desc: 'Private helipad for charter arrivals with VIP transfer services and luggage handling.',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=800&q=80'
      }
    ];

    return basePoints;
  };

  const getFutureDateStr = (baseDateStr, addDays = 3) => {
    try {
      const d = baseDateStr ? new Date(baseDateStr + "T00:00:00") : new Date();
      d.setDate(d.getDate() + addDays);
      return d.toISOString().split("T")[0];
    } catch (e) {
      const d = new Date();
      d.setDate(d.getDate() + addDays);
      return d.toISOString().split("T")[0];
    }
  };

  // Retrieve saved search state from location or sessionStorage
  const getSearchState = () => {
    try {
      const todayStr = getTodayStr();
      if (locationState?.state?.guestsLabel || locationState?.state?.checkInDate) {
        const state = { ...locationState.state };
        if (!state.checkInDate || state.checkInDate < todayStr) {
          state.checkInDate = todayStr;
          state.checkOutDate = getFutureDateStr(todayStr, 3);
        }
        return state;
      }
      if (locationState?.state?.guests || locationState?.state?.checkIn) {
        const cIn = (locationState.state.checkInDate && locationState.state.checkInDate >= todayStr) ? locationState.state.checkInDate : todayStr;
        const cOut = (locationState.state.checkOutDate && locationState.state.checkOutDate > cIn) ? locationState.state.checkOutDate : getFutureDateStr(cIn, 3);
        return {
          checkInDate: cIn,
          checkOutDate: cOut,
          guestsLabel: locationState.state.guests || "2 Guests, 1 Room",
          guestCount: locationState.state.guestCount || 2,
          childCount: locationState.state.childCount || 0,
          roomCount: locationState.state.roomCount || 1
        };
      }
      const saved = sessionStorage.getItem("reservo_search_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.checkInDate && parsed.checkInDate < todayStr) {
          parsed.checkInDate = todayStr;
          parsed.checkOutDate = getFutureDateStr(todayStr, 3);
        }
        return parsed;
      }
    } catch (e) {}
    return null;
  };

  const initialSearch = getSearchState();

  const [checkIn, setCheckIn] = useState(() => {
    const todayStr = getTodayStr();
    if (initialSearch?.checkInDate && initialSearch.checkInDate >= todayStr) {
      return initialSearch.checkInDate;
    }
    return todayStr;
  });

  const [checkOut, setCheckOut] = useState(() => {
    const todayStr = getTodayStr();
    const cIn = (initialSearch?.checkInDate && initialSearch.checkInDate >= todayStr) ? initialSearch.checkInDate : todayStr;
    if (initialSearch?.checkOutDate && initialSearch.checkOutDate > cIn) {
      return initialSearch.checkOutDate;
    }
    return getFutureDateStr(cIn, 3);
  });
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);
  const [activeDateField, setActiveDateField] = useState("checkIn");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendarPopover(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target)) {
        setShowGuestPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Select Date";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
        return dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };
  
  const isWholeVilla = String(resort?.listingMode || "").toUpperCase() === "VILLA";
  const [roomInventory, setRoomInventory] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [roomInventoryLoading, setRoomInventoryLoading] = useState(false);

  useEffect(() => {
    if (isWholeVilla || !resort?.id) {
      setRoomInventory([]);
      setSelectedRoomType("");
      return;
    }
    let active = true;
    setRoomInventoryLoading(true);
    apiClient.get(`/api/v1/rooms/resort/${resort.id}`)
      .then(res => {
        if (!active) return;
        const rooms = Array.isArray(res?.data) ? res.data : [];
        setRoomInventory(rooms);
        const firstType = rooms.find(r => r.status === "AVAILABLE")?.roomType || rooms[0]?.roomType || rooms[0]?.type || "";
        setSelectedRoomType(prev => prev || firstType);
      })
      .catch(() => { if (active) setRoomInventory([]); })
      .finally(() => { if (active) setRoomInventoryLoading(false); });
    return () => { active = false; };
  }, [resort?.id, isWholeVilla]);

  const roomTypeOptions = Array.from(new Set((roomInventory || []).map(room => String(room.roomType || room.type || "Room").trim()).filter(Boolean)));
  const selectedRoomRecords = roomInventory.filter(room => String(room.roomType || room.type || "Room") === String(selectedRoomType));
  const selectedRoomCapacity = isWholeVilla
    ? Math.max(1, Number(resort?.guests || 1))
    : Math.max(1, Number(selectedRoomRecords.find(r => Number(r.capacity) > 0)?.capacity || selectedRoomRecords[0]?.capacity || 2));
  const selectedAvailableRoomCount = selectedRoomRecords.filter(r => r.status === "AVAILABLE").length;
  const selectedRoomPrice = isWholeVilla
    ? Number(resort?.pricePerNight ?? resort?.price ?? 0)
    : Number(selectedRoomRecords.find(r => r.status === "AVAILABLE")?.pricePerNight || selectedRoomRecords[0]?.pricePerNight || resort?.pricePerNight || resort?.price || 0);

  const [adults, setAdults] = useState(() => Math.max(1, initialSearch?.guestCount || 2));
  const [childrenCount, setChildrenCount] = useState(() => Math.max(0, initialSearch?.childCount || 0));
  const [roomsCount, setRoomsCount] = useState(() => Math.max(
    1,
    initialSearch?.roomCount || 1,
    Math.ceil((initialSearch?.guestCount || 2) / 2),
    Math.ceil((initialSearch?.childCount || 0) / 2)
  ));
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // One room supports up to 2 adults and up to 2 children. Increase rooms
  // automatically when guest counts require it; never reduce a user-selected
  // number of rooms unless it falls below the minimum required.
  const minimumRoomsForGuests = isWholeVilla ? 1 : Math.max(
    1,
    Math.ceil((adults + childrenCount) / selectedRoomCapacity)
  );

  useEffect(() => {
    if (isWholeVilla) setRoomsCount(1);
    else setRoomsCount(prev => Math.max(prev, minimumRoomsForGuests));
  }, [minimumRoomsForGuests, isWholeVilla]);

  useEffect(() => {
    if (!isWholeVilla && selectedRoomType) {
      setRoomsCount(prev => Math.max(1, Math.min(prev, Math.max(1, selectedAvailableRoomCount))));
    }
  }, [selectedRoomType, selectedAvailableRoomCount, isWholeVilla]);

  const formatGuestsLabel = (a, c, r) => {
    let label = `${a} Adult${a !== 1 ? "s" : ""}`;
    if (c > 0) label += `, ${c} Child${c !== 1 ? "ren" : ""}`;
    label += `, ${r} Room${r !== 1 ? "s" : ""}`;
    return label;
  };

  const [guests, setGuests] = useState(() => initialSearch?.guestsLabel || formatGuestsLabel(adults, childrenCount, roomsCount));

  useEffect(() => {
    setGuests(formatGuestsLabel(adults, childrenCount, roomsCount));
  }, [adults, childrenCount, roomsCount]);

  useEffect(() => {
    try {
      const activeState = {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsLabel: guests,
        guestCount: adults,
        childCount: childrenCount,
        roomCount: roomsCount,
        roomType: selectedRoomType,
        roomCapacity: selectedRoomCapacity
      };
      sessionStorage.setItem("reservo_search_state", JSON.stringify(activeState));
    } catch (e) {}
  }, [checkIn, checkOut, guests, adults, childrenCount, roomsCount]);

  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [viewFullPhotoUrl, setViewFullPhotoUrl] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [currentRating, setCurrentRating] = useState(resort.rating || 4.9);
  const [reviewsCount, setReviewsCount] = useState(resort.reviewsCount || resort.reviewCount || 128);

  const parsedAmenities = useMemo(() => {
    if (!resort) return [];
    let raw = resort.amenities;
    if (!raw && typeof resort.amenitiesString === "string") raw = resort.amenitiesString;
    let list = [];
    if (Array.isArray(raw)) {
      list = raw.map(item => {
        if (typeof item === "string") return item.trim();
        return String(item?.name || item?.label || item?.title || "").trim();
      }).filter(Boolean);
    } else if (typeof raw === "string" && raw.trim()) {
      list = raw.split(",").map(s => s.trim()).filter(Boolean);
    }
    return Array.from(new Set(list));
  }, [resort]);

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponDiscountVal, setCouponDiscountVal] = useState(0);
  const [couponDiscountType, setCouponDiscountType] = useState("PERCENTAGE");
  const [couponMessage, setCouponMessage] = useState("");

  const [resortPosts, setResortPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (activeDetailTab === "posts") {
      setLoadingPosts(true);
      const storedPosts = JSON.parse(localStorage.getItem("reservo_resort_posts") || "[]");
      const filteredStored = storedPosts.filter(p => 
        String(p.resortId) === String(resort.id) || 
        String(p.resortId) === String(targetId) ||
        (p.resortName && p.resortName.toLowerCase() === (resort.name || "").toLowerCase())
      );

      fetch(`/api/v1/resorts/${resort.id || 1}/posts`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to load posts");
        })
        .then(body => {
          const apiPosts = body.data || [];
          const combined = [...filteredStored, ...apiPosts];
          setResortPosts(combined);
          setLoadingPosts(false);
        })
        .catch(err => {
          if (filteredStored.length > 0) {
            setResortPosts(filteredStored);
          } else {
            setResortPosts([
              { id: 1, resortId: resort.id || 1, type: "image", mediaUrl: resort.heroImage || resort.image || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80", title: "Monsoon Special Offer", caption: `🌴 Sunsets & Sanctuary. Our newly updated private infinity pool suite is ready to welcome you to ${resort.name || "our resort"}.`, createdAt: new Date().toISOString() },
              { id: 2, resortId: resort.id || 1, type: "image", mediaUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80", title: "Aura Spa Event", caption: "🍳 Luxury breakfast by the private beachfront cove. Complimentary for all our premium suite bookings.", createdAt: new Date(Date.now() - 86400000).toISOString() }
            ]);
          }
          setLoadingPosts(false);
        });
    }
  }, [activeDetailTab, resort.id, resort.name, targetId]);

  // Format price
  const convertedPriceVal = (selectedRoomPrice > 0 ? selectedRoomPrice : Number(resort.pricePerNight ?? resort.price)) > 0
    ? Math.round((selectedRoomPrice > 0 ? selectedRoomPrice : Number(resort.pricePerNight ?? resort.price)) * exchangeRate)
    : 8000;
  const formattedPrice = convertedPriceVal.toLocaleString();

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut || !new Date(`${checkIn}T00:00:00`).getTime() || !new Date(`${checkOut}T00:00:00`).getTime()) {
      toast("Please select valid check-in and check-out dates.", "error");
      return;
    }
    if (checkOut <= checkIn) {
      toast("Check-out must be after check-in.", "error");
      return;
    }

    try {
      // Availability is checked BEFORE opening the booking wizard. This
      // includes the exact number of rooms required by the guest count.
      await bookingService.checkAvailability(
        resort.id,
        { checkIn, checkOut },
        { adults, children: childrenCount, roomsCount, wholeVilla: isWholeVilla, roomType: selectedRoomType, roomCapacity: selectedRoomCapacity }
      );

      if (onBook) {
        await onBook(resort, {
          checkIn,
          checkOut,
          adults,
          children: childrenCount,
          roomsCount,
          roomType: selectedRoomType,
          roomCapacity: selectedRoomCapacity
        });
      } else {
        navigate("/resorts", {
          state: {
            checkAvailabilityFor: resort.id,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guestCount: adults,
            childCount: childrenCount,
            roomCount: roomsCount
          }
        });
      }
    } catch (e) {
      toast(e.message || "These dates/rooms are not available.", "error");
    }
  };

  const handleExploreMore = () => {
    navigate("/resorts");
  };

  // Customer pricing is simply nightly rate × nights × rooms.
  // No cleaning, luxury, service, or tax charges are added.
  const calculateNights = () => {
    try {
      const d1 = new Date(`${checkIn}T00:00:00`);
      const d2 = new Date(`${checkOut}T00:00:00`);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.round(diffTime / 86400000);
      return diffDays > 0 ? diffDays : 1;
    } catch (e) {
      return 1;
    }
  };

  const nights = calculateNights();
  const subtotal = convertedPriceVal * nights * roomsCount;
  const totalBeforeDiscount = subtotal;

  const discountAmount = couponApplied
    ? (couponDiscountType === "PERCENTAGE"
        ? Math.round(totalBeforeDiscount * (Number(couponDiscountVal) / 100))
        : Math.min(Math.round(Number(couponDiscountVal) || 0), totalBeforeDiscount))
    : 0;
  const grandTotal = Math.max(0, totalBeforeDiscount - discountAmount);

  // Use the same backend coupon-validation logic as BookingModal.
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code || couponLoading) return;

    setCouponLoading(true);
    setCouponMessage("");
    try {
      const resp = await rewardService.validateCoupon(
        code,
        resort.id,
        totalBeforeDiscount
      );

      setCouponDiscountVal(Number(resp.discountValue) || 0);
      setCouponDiscountType(resp.discountType || "PERCENTAGE");
      setCouponApplied(true);

      const label = resp.discountType === "PERCENTAGE"
        ? `${resp.discountValue}%`
        : `₹${Number(resp.discountValue).toLocaleString("en-IN")}`;
      setCouponMessage(`✓ Coupon applied successfully! ${label} discount applied.`);
    } catch (e) {
      setCouponDiscountVal(0);
      setCouponApplied(false);
      setCouponMessage(`❌ ${e.message || "Invalid promo code."}`);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    const newCount = reviewsCount + 1;
    const updatedRating = parseFloat(((currentRating * reviewsCount + userRating) / newCount).toFixed(1));
    setCurrentRating(updatedRating);
    setReviewsCount(newCount);
    setShowRateModal(false);
    setRatingComment("");
    alert(`Thank you for rating ${resort.name}! Your ${userRating}-star rating has been registered.`);
  };

  const dynamicPhotos = resortPosts
    .filter(post => post.type === "IMAGE" || post.type === "image")
    .map(post => post.mediaUrl);
  
  const dynamicVideos = resortPosts
    .filter(post => post.type === "VIDEO" || post.type === "video")
    .map(post => post.mediaUrl);

  const finalGallery = (resort.gallery && resort.gallery.length > 0 
    ? resort.gallery 
    : [resort.image || resort.imageUrl, ...dynamicPhotos])
    .filter(Boolean)
    .map(url => url.trim())
    .filter(url => url !== "");

  // ONLY include videos if explicitly provided by resort / host (NO mandatory mixkit fallback)
  const finalVideos = (resort.videos && resort.videos.length > 0)
    ? resort.videos.filter(Boolean)
    : (resort.videoUrls ? resort.videoUrls.split("|").filter(Boolean) : dynamicVideos.filter(Boolean));

  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    if (finalGallery && finalGallery.length > 0) {
      setActivePhoto(finalGallery[0]);
    }
  }, [resort]);

  const currentPhoto = activePhoto || resort.heroImage || (finalGallery && finalGallery[0]) || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80";

  const currentPhotoIndex = useMemo(() => {
    if (!finalGallery || finalGallery.length === 0) return 0;
    const idx = finalGallery.findIndex(url => url === currentPhoto);
    return idx >= 0 ? idx : 0;
  }, [finalGallery, currentPhoto]);

  const handlePrevPhoto = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!finalGallery || finalGallery.length <= 1) return;
    const prevIdx = (currentPhotoIndex - 1 + finalGallery.length) % finalGallery.length;
    const nextUrl = finalGallery[prevIdx];
    setActivePhoto(nextUrl);
    if (viewFullPhotoUrl) {
      setViewFullPhotoUrl(nextUrl);
    }
  }, [finalGallery, currentPhotoIndex, viewFullPhotoUrl]);

  const handleNextPhoto = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!finalGallery || finalGallery.length <= 1) return;
    const nextIdx = (currentPhotoIndex + 1) % finalGallery.length;
    const nextUrl = finalGallery[nextIdx];
    setActivePhoto(nextUrl);
    if (viewFullPhotoUrl) {
      setViewFullPhotoUrl(nextUrl);
    }
  }, [finalGallery, currentPhotoIndex, viewFullPhotoUrl]);

  useEffect(() => {
    if (!viewFullPhotoUrl) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevPhoto();
      else if (e.key === "ArrowRight") handleNextPhoto();
      else if (e.key === "Escape") setViewFullPhotoUrl(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewFullPhotoUrl, handlePrevPhoto, handleNextPhoto]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 py-8 font-sans transition-colors duration-300">
      
      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Hero Card + Gallery) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero Card */}
          <div 
            onClick={() => setViewFullPhotoUrl(currentPhoto)}
            className="relative rounded-[32px] overflow-hidden min-h-[360px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 bg-slate-900 shadow-lg border border-border-color cursor-pointer group select-none"
            title="Click to view photo in full screen"
          >
            {/* Animated Photo Layer */}
            <div className="absolute inset-0 overflow-hidden z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto}
                  src={currentPhoto}
                  alt={resort.name || "Resort"}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Subtle Gradient at top and bottom for button visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50 z-10 pointer-events-none"></div>

            {/* Top Bar (Back & Action Buttons) */}
            <div className="relative z-20 flex justify-between items-center w-full" onClick={e => e.stopPropagation()}>
              {/* Back Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onBack();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold hover:bg-black/60 transition cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to results
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRateModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold shadow-md hover:bg-black/60 transition cursor-pointer"
                  title="Rate this resort"
                >
                  <Star size={14} className="fill-yellow-400 text-yellow-400" /> Rate
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite();
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md hover:bg-black/60 transition cursor-pointer"
                  aria-label="Wishlist Resort"
                >
                  <Heart size={18} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold shadow-md hover:bg-black/60 transition cursor-pointer"
                >
                  <Share size={14} /> Share
                </button>
              </div>
            </div>

            {/* Left & Right Navigation Arrows */}
            {finalGallery.length > 1 && (
              <div 
                className="absolute inset-y-0 inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none z-20"
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 active:scale-90 text-white border border-white/25 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 pointer-events-auto cursor-pointer"
                  aria-label="Previous photo"
                  title="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 active:scale-90 text-white border border-white/25 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 pointer-events-auto cursor-pointer"
                  aria-label="Next photo"
                  title="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            )}

            {/* Bottom Bar: Fullscreen Hint & Photo Counter */}
            <div className="relative z-20 flex justify-between items-end w-full pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[11px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                <Maximize2 size={13} /> Click to expand
              </span>
              {finalGallery.length > 1 && (
                <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 ml-auto">
                  {currentPhotoIndex + 1} / {finalGallery.length}
                </span>
              )}
            </div>
          </div>

          {/* Gallery Thumbnails row */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
            {/* View Video (ONLY if video was actually uploaded!) */}
            {finalVideos && finalVideos.length > 0 && finalVideos[0] && (
              <div 
                onClick={() => setActiveVideoUrl(finalVideos[0])}
                className="relative rounded-2xl overflow-hidden cursor-pointer h-20 shadow-sm border border-border-color group"
              >
                <img src={finalGallery[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80"} alt="Video preview" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 text-white z-10">
                  <Play size={16} className="fill-current" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">View Video</span>
                </div>
              </div>
            )}

            {/* Gallery images - Clicking opens image in full screen preview modal! */}
            {finalGallery.map((imgUrl, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setActivePhoto(imgUrl);
                  setViewFullPhotoUrl(imgUrl);
                }}
                className={`rounded-2xl overflow-hidden cursor-pointer h-20 shadow-sm border group transition-all duration-300 relative ${
                  activePhoto === imgUrl || (!activePhoto && i === 0) ? "border-primary border-2 scale-[1.03]" : "border-border-color"
                }`}
                title="Click to view photo full screen"
              >
                <img src={imgUrl} alt={`Gallery thumbnail ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
            ))}
          </div>

          {/* Resort Header & Details Section (Moved Below Gallery) */}
          <div className="space-y-4 text-left pt-2">
            
            {/* Rating area */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setShowRateModal(true)}
                className="bg-primary text-white px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold text-xs shadow-sm cursor-pointer hover:scale-105 transition"
              >
                <Star size={14} className="fill-yellow-400 text-yellow-400" /> {currentRating}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-dark">Excellent</span>
                <span className="text-[10px] text-text-gray font-medium">{reviewsCount} reviews</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-text-dark leading-tight">
              {resort.name}
            </h1>

            {/* Location & Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 text-xs font-semibold text-text-gray">
                <MapPin size={14} className="text-primary" /> {resort.location}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                {resort.categoryLabel || "Beachfront Resort"}
              </span>
            </div>

            {/* Description */}
            <p className="text-text-gray text-xs sm:text-sm leading-relaxed max-w-[680px]">
              {resort.description || "Experience the perfect blend of luxury and nature. Relax by the beach, indulge in world-class amenities, and create unforgettable memories."}
            </p>
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
                {/* Amenities list */}
                <h4 className="text-xs font-bold uppercase text-text-dark tracking-wide pt-2">Featured Amenities</h4>
                {parsedAmenities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {parsedAmenities.map((amenity, i) => {
                      const IconComp = getAmenityIcon(amenity);
                      return (
                        <div 
                          key={i} 
                          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-bg-light rounded-xl border border-border-color text-xs font-semibold text-text-dark min-h-[42px] transition-colors"
                        >
                          <div className="w-5 h-5 flex items-center justify-center shrink-0 text-primary">
                            <IconComp size={15} />
                          </div>
                          <span className="truncate text-text-dark" title={amenity}>
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-text-gray italic">No specific amenities listed for this property.</p>
                )}
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
                  <ResortNavigationMap 
                    mapPoints={generateSampleMapPoints(resort.name)}
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
                )}

                {/* Google Maps Embed API (Secure) */}
                {(resort.latitude && resort.longitude) ? (
                  <SimpleMapEmbed
                    latitude={parseFloat(resort.latitude)}
                    longitude={parseFloat(resort.longitude)}
                    zoom={15}
                    isDarkMode={isDarkMode}
                    height="400px"
                    mode="place"
                  />
                ) : (
                  <SimpleMapEmbed
                    latitude={15.5164}
                    longitude={73.7634}
                    zoom={15}
                    isDarkMode={isDarkMode}
                    height="400px"
                    mode="place"
                    address={resort.location || resort.city || "Goa, India"}
                  />
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

            {/* Date Pickers - Custom Stylish Calendar */}
            <div className="grid grid-cols-2 gap-3.5 relative" ref={calendarRef}>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Check-in</label>
                <button 
                  type="button"
                  onClick={() => {
                    if (showCalendarPopover && activeDateField === "checkIn") {
                      setShowCalendarPopover(false);
                    } else {
                      setActiveDateField("checkIn");
                      setShowCalendarPopover(true);
                      setShowGuestPicker(false);
                    }
                  }}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold bg-bg-light text-text-dark outline-none transition-colors text-left flex items-center justify-between cursor-pointer shadow-xs ${
                    showCalendarPopover && activeDateField === "checkIn" ? "border-primary ring-2 ring-primary/20" : "border-border-color focus:border-primary"
                  }`}
                >
                  <span>{formatDisplayDate(checkIn)}</span>
                  <CalendarIcon size={14} className="text-primary" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Check-out</label>
                <button 
                  type="button"
                  onClick={() => {
                    if (showCalendarPopover && activeDateField === "checkOut") {
                      setShowCalendarPopover(false);
                    } else {
                      setActiveDateField("checkOut");
                      setShowCalendarPopover(true);
                      setShowGuestPicker(false);
                    }
                  }}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold bg-bg-light text-text-dark outline-none transition-colors text-left flex items-center justify-between cursor-pointer shadow-xs ${
                    showCalendarPopover && activeDateField === "checkOut" ? "border-primary ring-2 ring-primary/20" : "border-border-color focus:border-primary"
                  }`}
                >
                  <span>{formatDisplayDate(checkOut)}</span>
                  <CalendarIcon size={14} className="text-primary" />
                </button>
              </div>

              {/* Custom Calendar Popover Modal */}
              {showCalendarPopover && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-white border border-border-color rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in duration-200">
                  <CustomCalendar
                    checkInDate={checkIn}
                    checkOutDate={checkOut}
                    activeField={activeDateField}
                    onActiveFieldChange={(field) => setActiveDateField(field)}
                    isDarkMode={isDarkMode}
                    onDateChange={(start, end, nextField) => {
                      setCheckIn(start || "");
                      setCheckOut(end || "");
                      if (nextField === "done" || (start && end)) {
                        setShowCalendarPopover(false);
                      }
                    }}
                  />
                  <div className="flex justify-between items-center px-3 pb-2 pt-1 border-t border-border-color/60 mt-1">
                    <span className="text-[10px] font-bold text-text-gray">
                      {activeDateField === "checkIn" ? "Selecting Check-in date" : "Selecting Check-out date"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCalendarPopover(false)}
                      className="text-xs font-extrabold text-primary hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

            </div>

            {!isWholeVilla && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Room Type</label>
                <select
                  value={selectedRoomType}
                  onChange={e => { setSelectedRoomType(e.target.value); setRoomsCount(1); }}
                  disabled={roomInventoryLoading || roomTypeOptions.length === 0}
                  className="w-full border border-border-color rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-bg-light text-text-dark outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                >
                  {roomTypeOptions.length === 0 ? <option value="">No room types available</option> : roomTypeOptions.map(type => {
                    const records = roomInventory.filter(room => String(room.roomType || room.type || "Room") === type);
                    const available = records.filter(room => room.status === "AVAILABLE").length;
                    const capacity = Number(records.find(r => Number(r.capacity) > 0)?.capacity || 2);
                    const price = Number(records.find(r => r.status === "AVAILABLE")?.pricePerNight || records[0]?.pricePerNight || 0);
                    return <option key={type} value={type}>{type} • {capacity} guests • ₹{price.toLocaleString("en-IN")} • {available} available</option>;
                  })}
                </select>
                <span className="text-[9px] text-text-gray">Capacity: {selectedRoomCapacity} guest{selectedRoomCapacity !== 1 ? "s" : ""} per room • {selectedAvailableRoomCount} available</span>
              </div>
            )}

            {/* Guests & Rooms Interactive Modifier Card */}
            <div className="flex flex-col gap-1.5 relative" ref={guestPickerRef}>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Guests & Rooms</label>
              <span className="text-[9px] text-text-gray font-medium">{isWholeVilla ? `Entire villa • up to ${selectedRoomCapacity} guests` : `Selected room type • up to ${selectedRoomCapacity} guests per room`}</span>
              <button
                type="button"
                onClick={() => setShowGuestPicker(!showGuestPicker)}
                className="w-full border border-border-color rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-bg-light text-text-dark focus:border-primary outline-none text-left flex items-center justify-between cursor-pointer transition-all shadow-xs"
              >
                <span className="font-extrabold">{guests}</span>
                <ChevronDown size={14} className={`text-text-gray transition-transform duration-200 ${showGuestPicker ? "rotate-180 text-primary" : ""}`} />
              </button>

              {/* Interactive Counter Popover Modal matching image */}
              {showGuestPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-white border border-border-color rounded-3xl p-5 shadow-2xl z-50 space-y-4 animate-in fade-in duration-200">
                  {/* Adults Counter */}
                  <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
                    <div>
                      <div className="text-xs font-extrabold text-text-dark">Adults</div>
                      <div className="text-[10px] text-text-gray font-medium">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-dark font-bold text-sm hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-bg-light transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center font-black text-xs text-text-dark">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(prev => prev + 1)}
                        className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-dark font-bold text-sm hover:border-primary cursor-pointer bg-bg-light transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
                    <div>
                      <div className="text-xs font-extrabold text-text-dark">Children</div>
                      <div className="text-[10px] text-text-gray font-medium">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={childrenCount <= 0}
                        onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))}
                        className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-dark font-bold text-sm hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-bg-light transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center font-black text-xs text-text-dark">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount(prev => prev + 1)}
                        className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-dark font-bold text-sm hover:border-primary cursor-pointer bg-bg-light transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Rooms Counter */}
                  <div className="flex items-center justify-between pb-3">
                    <div>
                      <div className="text-xs font-extrabold text-text-dark">Rooms</div>
                      <div className="text-[10px] text-text-gray font-medium">Number of rooms</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={isWholeVilla || roomsCount <= minimumRoomsForGuests}
                        onClick={() => setRoomsCount(prev => Math.max(minimumRoomsForGuests, prev - 1))}
                        className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-dark font-bold text-sm hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-bg-light transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center font-black text-xs text-text-dark">{roomsCount}</span>
                      <button
                        type="button"
                        onClick={() => !isWholeVilla && setRoomsCount(prev => Math.min(prev + 1, Math.max(1, selectedAvailableRoomCount)))}
                        className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-dark font-bold text-sm hover:border-primary cursor-pointer bg-bg-light transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Done Button matching media_1787723647886.png */}
                  <button
                    type="button"
                    onClick={() => setShowGuestPicker(false)}
                    className="w-full py-3 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl cursor-pointer border-none shadow transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Price Breakdown & Coupon Box */}
            <div className="pt-3 border-t border-border-color space-y-3 text-xs">
              <h4 className="font-extrabold text-text-dark text-xs uppercase tracking-wider">Price Breakdown</h4>
              
              <div className="space-y-2 text-text-gray font-medium">
                <div className="flex justify-between">
                  <span>{currencySymbol}{formattedPrice} × {nights} {nights === 1 ? "night" : "nights"} × {roomsCount} {roomsCount === 1 ? "room" : "rooms"}</span>
                  <span className="font-bold text-text-dark">{currencySymbol}{(subtotal).toLocaleString()}</span>
                </div>

                {couponApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({couponDiscountType === "PERCENTAGE" ? `${couponDiscountVal}% OFF` : `₹${Number(couponDiscountVal).toLocaleString("en-IN")} OFF`})</span>
                    <span>-{currencySymbol}{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Promo code (e.g. SUMMER20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponApplied || couponLoading}
                  className="flex-1 border border-border-color rounded-xl px-3 py-2 text-xs font-bold bg-bg-light text-text-dark outline-none focus:border-primary uppercase disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={couponApplied || couponLoading || !couponCode.trim()}
                  className="px-3 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponLoading ? "Checking..." : couponApplied ? "Applied" : "Apply"}
                </button>
              </form>

              {couponMessage && (
                <div className={`text-[11px] font-bold ${couponApplied ? "text-emerald-600" : "text-red-500"}`}>
                  {couponMessage}
                </div>
              )}
              {couponApplied && (
                <button
                  type="button"
                  onClick={() => {
                    setCouponApplied(false);
                    setCouponCode("");
                    setCouponDiscountVal(0);
                    setCouponDiscountType("PERCENTAGE");
                    setCouponMessage("");
                  }}
                  className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Remove
                </button>
              )}

              {/* Total Payable */}
              <div className="flex justify-between items-baseline pt-2 border-t border-border-color text-text-dark">
                <span className="font-extrabold text-sm">Total Payable</span>
                <span className="font-black text-xl text-primary">{currencySymbol}{(grandTotal).toLocaleString()}</span>
              </div>
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

      {/* Full Screen Photo Viewer Modal */}
      {viewFullPhotoUrl && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[10005] p-4 sm:p-8 animate-fade-in select-none" 
          onClick={() => setViewFullPhotoUrl(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 border-none cursor-pointer z-40 transition flex items-center justify-center shadow-xl hover:scale-105 active:scale-95"
            onClick={() => setViewFullPhotoUrl(null)}
            title="Close (Esc)"
          >
            <X size={22} />
          </button>

          {/* Photo Counter */}
          {finalGallery.length > 1 && (
            <div className="absolute top-6 left-6 text-xs font-bold text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 z-40">
              {currentPhotoIndex + 1} / {finalGallery.length}
            </div>
          )}

          {/* Modal Container */}
          <div className="relative max-w-6xl max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* Prev button */}
            {finalGallery.length > 1 && (
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/25 backdrop-blur-md flex items-center justify-center z-40 cursor-pointer transition shadow-2xl"
                title="Previous photo (←)"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img 
                key={viewFullPhotoUrl}
                src={viewFullPhotoUrl} 
                alt="Full size preview" 
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
              />
            </AnimatePresence>

            {/* Next button */}
            {finalGallery.length > 1 && (
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/25 backdrop-blur-md flex items-center justify-center z-40 cursor-pointer transition shadow-2xl"
                title="Next photo (→)"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Rate Experience Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[10005] p-4 animate-fade-in" onClick={() => setShowRateModal(false)}>
          <div className="bg-bg-white border border-border-color rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-text-gray hover:text-text-dark bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-bg-light transition"
              onClick={() => setShowRateModal(false)}
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold font-serif text-text-dark">Rate Your Experience</h3>
              <p className="text-xs text-text-gray">How was your stay or experience at {resort.name}?</p>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Star selector */}
              <div className="flex justify-center items-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="bg-transparent border-none cursor-pointer p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      size={28} 
                      className={star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"} 
                    />
                  </button>
                ))}
              </div>
              <div className="text-center text-xs font-bold text-primary uppercase tracking-wider">
                {userRating === 5 ? "5.0 ★ Exceptional" : userRating === 4 ? "4.0 ★ Excellent" : userRating === 3 ? "3.0 ★ Good" : "Average"}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">Your Review / Feedback (Optional)</label>
                <textarea
                  rows="3"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share details about your room, service, or amenities..."
                  className="w-full border border-border-color rounded-xl p-3 text-xs bg-bg-light text-text-dark outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md cursor-pointer border-none transition-all"
              >
                Submit Rating
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
