import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Star, 
  Quote, 
  Search, 
  Filter, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  PenSquare, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  SlidersHorizontal,
  X,
  Award,
  ShieldCheck,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import { useToast } from "../context/ToastContext";
import { authService } from "../services/auth.service";
import CustomDropdown from "../components/CustomDropdown";

// Seed verified reviews across top luxury destinations
const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Rahul Sharma",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "September 2026",
    resortId: "1",
    resortName: "Goa Coastline Luxury Retreat",
    category: "beach",
    tripType: "Honeymoon",
    title: "An unforgettable honeymoon escape!",
    content: "Reservo made our honeymoon unforgettable. The booking process was seamless, and the private beach villa exceeded all our expectations. The sunset views, private pool, and exceptional butler service made it truly magical. Worth every single rupee.",
    tags: ["Private Pool", "Sunset View", "Butler Service"],
    helpful: 48,
    isVerified: true
  },
  {
    id: "rev-2",
    name: "Priya Patel",
    location: "Ahmedabad, India",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "August 2026",
    resortId: "6",
    resortName: "Udaipur Lake Palace & Heritage Suites",
    category: "heritage",
    tripType: "Family Vacation",
    title: "Royalty at its absolute finest",
    content: "Staying at the Lake Palace through Reservo was like stepping into a fairy tale. The royal welcome, traditional folk performances by the lake, and five-star culinary dining were extraordinary. The Rivo AI assistant planned our city itinerary effortlessly.",
    tags: ["Royal Welcome", "Lake View", "Heritage Dining"],
    helpful: 39,
    isVerified: true
  },
  {
    id: "rev-3",
    name: "Aman Verma",
    location: "Delhi, India",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "August 2026",
    resortId: "3",
    resortName: "Solang Valley Alpine Chalet, Manali",
    category: "mountain",
    tripType: "Couples Retreat",
    title: "Snow-capped peaks and serene wooden chalets",
    content: "Waking up to cedar forests and snow peaks right from our heated glass balcony was heavenly. The heated floors, cedar-wood fragrance, and stargazing deck were incredible highlights. Transparent pricing with zero hidden charges.",
    tags: ["Snow Peaks", "Heated Balcony", "Fireplace"],
    helpful: 27,
    isVerified: true
  },
  {
    id: "rev-4",
    name: "Dr. Sunita Rao",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 4.9,
    date: "July 2026",
    resortId: "2",
    resortName: "Kerala Backwaters & Ayurveda Haven",
    category: "wellness",
    tripType: "Wellness Escape",
    title: "Pure rejuvenation amidst tranquil waters",
    content: "The Ayurvedic therapies and personal consultation were world-class. Gliding through the backwaters on a private houseboat while having authentic Kerala cuisine prepared fresh was the highlight of our year. Pure tranquility.",
    tags: ["Ayurveda Spa", "Private Houseboat", "Organic Cuisine"],
    helpful: 31,
    isVerified: true
  },
  {
    id: "rev-5",
    name: "Vikram Sengupta",
    location: "Kolkata, India",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "June 2026",
    resortId: "10",
    resortName: "Andaman Private Shore & Coral Villas",
    category: "beach",
    tripType: "Couples Retreat",
    title: "Crystal turquoise water and private white sand",
    content: "The water villa is right on the coral reef! We could literally step down from our sun deck directly into crystal-clear turquoise waters. Snorkeling right beside sea turtles and having candlelit dinners on the beach was unforgettable.",
    tags: ["Overwater Villa", "Coral Snorkeling", "Candlelit Beach"],
    helpful: 42,
    isVerified: true
  },
  {
    id: "rev-6",
    name: "Ananya Deshmukh",
    location: "Pune, India",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    rating: 4.8,
    date: "May 2026",
    resortId: "5",
    resortName: "Coorg Forest Plantation Estate",
    category: "villas",
    tripType: "Friends Getaway",
    title: "A misty coffee plantation paradise",
    content: "The aroma of fresh coffee blossoms and morning birdsong made this the perfect escape from the city. The infinity pool overlooking the coffee valleys was surreal. The staff treated us like royalty from the moment we arrived.",
    tags: ["Coffee Plantation", "Valley Infinity Pool", "Bird Watching"],
    helpful: 19,
    isVerified: true
  }
];

const RESORT_OPTIONS = [
  { id: "1", name: "Goa Coastline Luxury Retreat" },
  { id: "2", name: "Kerala Backwaters & Ayurveda Haven" },
  { id: "3", name: "Solang Valley Alpine Chalet, Manali" },
  { id: "4", name: "Coorg Hill Station Eco Sanctuary" },
  { id: "5", name: "Coorg Forest Plantation Estate" },
  { id: "6", name: "Udaipur Lake Palace & Heritage Suites" },
  { id: "7", name: "Jaipur Royal Haveli & Courtyard" },
  { id: "10", name: "Andaman Private Shore & Coral Villas" }
];

export default function Reviews() {
  const navigate = useNavigate();
  const toast = useToast();

  useSEO({
    title: "Guest Reviews & Ratings | Reservo Luxury Stays",
    description: "Read authentic reviews from 12,000+ verified guests who booked luxury resorts, boutique retreats, and villas across India with Reservo."
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("reservo_guest_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_REVIEWS;
  });

  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [helpfulGiven, setHelpfulGiven] = useState({});

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formResort, setFormResort] = useState(RESORT_OPTIONS[0].name);
  const [formResortId, setFormResortId] = useState(RESORT_OPTIONS[0].id);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formTripType, setFormTripType] = useState("Couples Retreat");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with current user if logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      if (!formName) setFormName(user.name || user.displayName || "");
    }
  }, [isModalOpen]);

  // Persist reviews when updated
  const saveReviews = (newList) => {
    setReviews(newList);
    try {
      localStorage.setItem("reservo_guest_reviews", JSON.stringify(newList));
    } catch (_) {}
  };

  const handleHelpfulClick = (reviewId) => {
    if (helpfulGiven[reviewId]) return;
    setHelpfulGiven(prev => ({ ...prev, [reviewId]: true }));
    const updated = reviews.map(r => r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r);
    saveReviews(updated);
    toast("Thank you for your feedback!", "success");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      toast("Please provide both a title and review content.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRev = {
        id: "rev-" + Date.now(),
        name: formName.trim() || "Verified Guest",
        location: formLocation.trim() || "India",
        avatar: "",
        rating: userRating,
        date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        resortId: formResortId,
        resortName: formResort,
        category: "beach",
        tripType: formTripType,
        title: formTitle.trim(),
        content: formContent.trim(),
        tags: ["Verified Booking", "Guest Review"],
        helpful: 1,
        isVerified: true
      };

      const updated = [newRev, ...reviews];
      saveReviews(updated);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormTitle("");
      setFormContent("");
      toast("Thank you! Your verified review has been published.", "success");
    }, 400);
  };

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      // Rating filter
      if (selectedRating === "5" && rev.rating < 4.8) return false;
      if (selectedRating === "4" && (rev.rating < 3.8 || rev.rating >= 4.8)) return false;
      if (selectedRating === "3" && rev.rating < 3.0) return false;

      // Category filter
      if (selectedCategory !== "all" && rev.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = rev.name.toLowerCase().includes(q);
        const inResort = rev.resortName.toLowerCase().includes(q);
        const inContent = rev.content.toLowerCase().includes(q);
        const inTitle = rev.title.toLowerCase().includes(q);
        const inLocation = rev.location.toLowerCase().includes(q);
        const inTags = rev.tags?.some(t => t.toLowerCase().includes(q));
        if (!inName && !inResort && !inContent && !inTitle && !inLocation && !inTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "helpful") return (b.helpful || 0) - (a.helpful || 0);
      return 0; // Default recent
    });
  }, [reviews, selectedRating, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-bg-light min-h-screen transition-colors duration-300">
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#0A192F] via-[#0F223D] to-[#0D1B2A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="w-[90%] max-w-[1240px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Star size={14} className="fill-yellow-400" />
            <span>Verified Guest Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white mb-4 leading-tight">
            Authentic Stories From Discerning Guests
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-8">
            Over 12,000+ travellers have booked unforgettable vacations with Reservo. Explore real stories, ratings, and verified reviews from stays across India.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 text-left">
            <div className="bg-[#132742] border border-white/15 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1.5">
                <span>4.9</span>
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Average Guest Rating</div>
            </div>

            <div className="bg-[#132742] border border-white/15 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">12,480+</div>
              <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Verified Stays</div>
            </div>

            <div className="bg-[#132742] border border-white/15 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">98.6%</div>
              <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Would Recommend</div>
            </div>

            <div className="bg-[#132742] border border-white/15 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Real Guest Verified</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-none"
            >
              <PenSquare size={16} />
              <span>Write a Review</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <span>Explore Luxury Stays</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content & Filter Toolbar */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Controls Toolbar */}
        <div className="bg-bg-white border border-border-color rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by guest, destination, or keyword (e.g. pool, sunset, dining)..."
                className="w-full pl-10 pr-9 py-2.5 bg-bg-light border border-border-color rounded-xl text-xs font-semibold text-text-dark placeholder:text-text-gray outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark border-none bg-transparent cursor-pointer p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-text-gray whitespace-nowrap">Sort by:</span>
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "recent", label: "✨ Newest First" },
                  { value: "highest", label: "⭐ Highest Rated" },
                  { value: "helpful", label: "👍 Most Helpful" }
                ]}
                className="min-w-[160px]"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-color">
            {/* Rating Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-gray mr-1">Rating:</span>
              {[
                { id: "all", label: "All Ratings" },
                { id: "5", label: "5.0 ★ Exceptional" },
                { id: "4", label: "4.0+ ★ Great" },
                { id: "3", label: "3.0+ ★ Good" }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRating(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedRating === item.id
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-bg-light border-border-color text-text-dark hover:border-primary/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-gray mr-1">Style:</span>
              {[
                { id: "all", label: "All Styles" },
                { id: "beach", label: "🏖️ Beach" },
                { id: "mountain", label: "🏔️ Mountain" },
                { id: "heritage", label: "👑 Heritage" },
                { id: "wellness", label: "🌿 Wellness" },
                { id: "villas", label: "🏡 Villas" }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCategory(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === item.id
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-bg-light border-border-color text-text-dark hover:border-primary/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs sm:text-sm font-bold text-text-gray">
            Showing <span className="text-text-dark font-extrabold">{filteredReviews.length}</span> verified guest reviews
          </div>

          {(selectedRating !== "all" || selectedCategory !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedRating("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-primary hover:underline border-none bg-transparent cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="bg-bg-white border border-border-color rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-base font-bold text-text-dark">No reviews match your filter</h3>
            <p className="text-xs text-text-gray">
              Try adjusting your rating filter or searching for another keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedRating("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl border-none cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  {/* Top user row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {rev.avatar ? (
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-border-color shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20 shrink-0">
                          {rev.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-text-dark flex items-center gap-1.5">
                          <span>{rev.name}</span>
                          {rev.isVerified && (
                            <span title="Verified Guest Stay" className="inline-flex text-emerald-600">
                              <CheckCircle2 size={13} className="fill-emerald-100" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-gray flex items-center gap-1">
                          <MapPin size={10} />
                          <span>{rev.location}</span>
                          <span>•</span>
                          <span>{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Star badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-xs border border-amber-500/20">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{Number(rev.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Resort Tag Link */}
                  {rev.resortName && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-light border border-border-color text-[11px] font-bold text-text-dark">
                      <span className="text-primary">Stayed at:</span>
                      <Link 
                        to={`/resort/${rev.resortId}`} 
                        className="hover:text-primary transition-colors truncate max-w-[200px]"
                      >
                        {rev.resortName}
                      </Link>
                    </div>
                  )}

                  {/* Title & Quote */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-text-dark font-serif leading-snug mb-1.5">
                      "{rev.title}"
                    </h3>
                    <p className="text-xs text-text-gray leading-relaxed">
                      {rev.content}
                    </p>
                  </div>

                  {/* Highlight Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Helpful counter */}
                <div className="pt-3 border-t border-border-color flex items-center justify-between text-xs text-text-gray">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-gray/80">
                    {rev.tripType || "Verified Stay"}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors border-none bg-transparent cursor-pointer ${
                      helpfulGiven[rev.id]
                        ? "text-primary font-bold"
                        : "text-text-gray hover:text-text-dark hover:bg-stone-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <ThumbsUp size={12} className={helpfulGiven[rev.id] ? "fill-primary text-primary" : ""} />
                    <span>Helpful ({rev.helpful || 0})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-bg-white border border-border-color rounded-3xl p-6 sm:p-7 shadow-2xl max-w-lg w-full relative text-left space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border-color pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <PenSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-dark font-serif">Write a Verified Review</h3>
                    <p className="text-[11px] text-text-gray">Share your vacation experience with future travellers</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-text-gray hover:text-text-dark border-none bg-transparent cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                {/* Resort Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">
                    Select Resort / Property *
                  </label>
                  <CustomDropdown
                    value={formResortId}
                    onChange={(val) => {
                      setFormResortId(val);
                      const found = RESORT_OPTIONS.find(r => r.id === val);
                      if (found) setFormResort(found.name);
                    }}
                    options={RESORT_OPTIONS.map(r => ({
                      value: r.id,
                      label: r.name
                    }))}
                    className="w-full"
                    buttonClassName="bg-bg-light border-border-color py-2.5 px-3 rounded-xl font-semibold text-text-dark hover:border-primary/50 text-xs"
                    menuClassName="shadow-2xl z-[120] max-h-52"
                  />
                </div>

                {/* Rating selection with stars */}
                <div className="text-center py-2 bg-bg-light/60 rounded-2xl border border-border-color">
                  <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 bg-transparent border-none cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          size={28}
                          className={
                            star <= (hoverRating || userRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300 dark:text-slate-600"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-primary mt-1">
                    {userRating === 5
                      ? "5.0 ★ Exceptional"
                      : userRating === 4
                        ? "4.0 ★ Very Good"
                        : userRating === 3
                          ? "3.0 ★ Good"
                          : userRating === 2
                            ? "2.0 ★ Fair"
                            : "1.0 ★ Poor"}
                  </div>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full p-2.5 bg-bg-light border border-border-color rounded-xl text-xs font-semibold text-text-dark outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">
                      Your City / Country
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Mumbai, India"
                      className="w-full p-2.5 bg-bg-light border border-border-color rounded-xl text-xs font-semibold text-text-dark outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Trip Type */}
                <div>
                  <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">
                    Trip Type
                  </label>
                  <CustomDropdown
                    value={formTripType}
                    onChange={setFormTripType}
                    options={[
                      { value: "Couples Retreat", label: "💑 Couples Retreat" },
                      { value: "Honeymoon", label: "💍 Honeymoon" },
                      { value: "Family Vacation", label: "👨‍👩‍👧‍👦 Family Vacation" },
                      { value: "Friends Getaway", label: "🎉 Friends Getaway" },
                      { value: "Solo Escape", label: "🧭 Solo Escape" },
                      { value: "Wellness Escape", label: "🌿 Wellness Escape" }
                    ]}
                    className="w-full"
                    buttonClassName="bg-bg-light border-border-color py-2.5 px-3 rounded-xl font-semibold text-text-dark hover:border-primary/50 text-xs"
                    menuClassName="shadow-2xl z-[120] max-h-52"
                  />
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Pure luxury and unforgettable sunset views!"
                    required
                    className="w-full p-2.5 bg-bg-light border border-border-color rounded-xl text-xs font-semibold text-text-dark outline-none focus:border-primary"
                  />
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Tell other guests about the room quality, amenities, dining, hospitality, and overall experience..."
                    required
                    className="w-full p-2.5 bg-bg-light border border-border-color rounded-xl text-xs font-semibold text-text-dark outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Publishing Review...</span>
                  ) : (
                    <>
                      <span>Submit Verified Review</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
