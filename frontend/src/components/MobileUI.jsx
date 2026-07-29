import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, Moon, Sun, Heart, Bell, MapPin, Calendar, Users,
  Search, ArrowRight, Waves, Mountain, Home, Droplets,
  Sparkles, Star, ChevronRight, User, Send
} from "lucide-react";
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import rivoSupport from "../assets/images/rivo_support.png";

const CATEGORIES = [
  { id: "beach", label: "Beach", icon: <Waves size={20} /> },
  { id: "mountain", label: "Mountain", icon: <Mountain size={20} /> },
  { id: "villa", label: "Villas", icon: <Home size={20} /> },
  { id: "pool", label: "Pool", icon: <Droplets size={20} /> },
];

const FEATURED = [
  {
    id: 1, name: "Ayana Resort", location: "Bali, Indonesia",
    price: 320, rating: 4.9, tag: "Top Pick",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, name: "Anantara Veli", location: "Maldives",
    price: 580, rating: 4.8, tag: "Overwater",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3, name: "Six Senses Zighy", location: "Oman",
    price: 450, rating: 4.9, tag: "Remote Luxury",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
  },
];

const QUICK_REPLIES = [
  { text: "🌴 Suggest beach resorts", key: "beach" },
  { text: "🏔️ Tell me about Manali", key: "manali" },
  { text: "📅 How do I book?", key: "book" }
];

function MobileUI({ isDark, onToggleTheme, children }) {
  const [activeTab, setActiveTab] = useState("home");
  const [activeCategory, setActiveCategory] = useState("beach");
  const [wishlist, setWishlist] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMascotOpen, setIsMascotOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "rivo", text: "Hi! I'm Rivo 🤖 Your AI travel buddy. Where would you like to travel today?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleWishlist = (id) => setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));

  const scrollToSection = (id) => {
    setIsDrawerOpen(false);
    // MobileUI is only shown on mobile — navigate to home and scroll
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: "user", text }]);
    setInputVal("");
    setIsTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Let me check that for you! Rivo is looking for the best matches...";
      if (lower.includes("beach") || lower.includes("goa")) reply = "I recommend Ocean Breeze Resort in Goa — 4.9⭐ with private beachfront pools!";
      if (lower.includes("manali") || lower.includes("mountain")) reply = "Mountain Paradise Resort in Manali is our top pick with private spa access and cozy fireplaces! 🏔️";
      if (lower.includes("book") || lower.includes("how")) reply = "Booking is super easy! Pick your destination, select dates, and tap Search Stays. Done in 30 seconds!";
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "rivo", text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[8000] md:hidden bg-bg-white flex flex-col overflow-hidden">

      {/* ── TOP BAR ─────────────────────────────────── */}
      <header className="sticky top-0 z-[99] flex items-center justify-between px-4 py-3 bg-bg-white/95 backdrop-blur-xl border-b border-border-color shrink-0">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-light transition-colors border-none bg-transparent cursor-pointer"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} className="text-text-dark" />
        </button>

        <div className="flex items-center gap-1.5">
          <img src={rivoMascot} alt="Rivo" className="w-5 h-5 rounded-full object-cover border border-border-color" />
          <span className="text-sm font-extrabold tracking-[3px] text-text-dark uppercase">
            RESERV<span className="text-gold">O</span>
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-light transition-colors border-none bg-transparent cursor-pointer"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} className="text-gold" /> : <Moon size={18} className="text-text-dark" />}
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-light transition-colors border-none bg-transparent cursor-pointer"
            onClick={() => { setActiveTab("wishlist"); navigate("/wishlist"); }}
          >
            <Heart size={18} className="text-text-dark" />
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-light transition-colors border-none bg-transparent cursor-pointer"
          >
            <Bell size={18} className="text-text-dark" />
          </button>
        </div>
      </header>

      {/* ── SCROLLABLE CONTENT ─────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {location.pathname === "/" ? (
          <>
            {/* Hero Banner */}
            <div
              className="relative h-[240px] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
              <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 text-white">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 w-fit mb-2.5">
                  <Sparkles size={10} className="text-gold fill-gold" />
                  <span className="text-[11px] font-semibold">AI Recommended</span>
                </div>
                <h2 className="text-[26px] font-extrabold leading-tight mb-2">
                  Book Smart,<br />Stay <em className="font-serif">Better.</em>
                </h2>
                <p className="text-white/80 text-[12.5px] mb-4 leading-relaxed">
                  AI-powered stays for unforgettable moments.
                </p>
                <button
                  className="flex items-center gap-2 bg-gold text-white text-sm font-bold px-5 py-2.5 rounded-full w-fit transition-all hover:bg-gold-dark border-none cursor-pointer"
                  onClick={() => { setActiveTab("explore"); navigate("/search"); }}
                >
                  Explore Stays <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Search Card */}
            <div className="mx-4 -mt-5 relative z-10">
              <div className="bg-bg-white border border-border-color rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border-color">
                  <MapPin size={15} className="text-gold shrink-0" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-gray">Where?</span>
                    <span className="text-sm font-semibold text-text-dark">Search destinations</span>
                  </div>
                </div>
                <div className="flex divide-x divide-border-color">
                  <div className="flex items-center gap-2 px-4 py-3 flex-1">
                    <Calendar size={13} className="text-gold shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-text-gray">Dates</span>
                      <span className="text-xs font-semibold text-text-dark">Select dates</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 flex-1">
                    <Users size={13} className="text-gold shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-text-gray">Guests</span>
                      <span className="text-xs font-semibold text-text-dark">2 Guests, 1 Room</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-primary text-bg-white py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors hover:bg-gold border-none cursor-pointer"
                  onClick={() => { setActiveTab("explore"); navigate("/search"); }}
                >
                  <Search size={14} /> Search Stays
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="px-4 pt-6 pb-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-extrabold text-text-dark">Explore by Category</h3>
                <button className="text-xs font-semibold text-gold flex items-center gap-0.5 bg-transparent border-none cursor-pointer" onClick={() => navigate("/search")}>
                  View all <ChevronRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? "bg-primary text-bg-white border-primary shadow-md"
                        : "bg-bg-light text-text-dark border-border-color hover:border-gold hover:text-gold"
                    }`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span className={activeCategory === cat.id ? "text-gold" : ""}>{cat.icon}</span>
                    <span className="leading-tight text-center">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Resorts */}
            <div className="px-4 pt-5 pb-32">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-extrabold text-text-dark">Featured Stays</h3>
                <button className="text-xs font-semibold text-gold flex items-center gap-0.5 bg-transparent border-none cursor-pointer" onClick={() => navigate("/search")}>
                  See all <ChevronRight size={13} />
                </button>
              </div>
              <div className="flex flex-col gap-3.5">
                {FEATURED.map((resort) => (
                  <div
                    key={resort.id}
                    className="bg-bg-white border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.06)] flex gap-3 p-3 transition-all hover:-translate-y-0.5"
                  >
                    <div className="relative w-[95px] h-[85px] rounded-xl overflow-hidden shrink-0">
                      <img src={resort.image} alt={resort.name} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {resort.tag}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h4 className="text-sm font-bold text-text-dark truncate">{resort.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-text-gray shrink-0" />
                          <span className="text-[11px] text-text-gray truncate">{resort.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <div>
                          <span className="text-sm font-extrabold text-text-dark">${resort.price}</span>
                          <span className="text-[10px] text-text-gray">/night</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                              wishlist[resort.id]
                                ? "bg-red-50 border-red-200"
                                : "border-border-color hover:border-red-200"
                            }`}
                            onClick={() => toggleWishlist(resort.id)}
                          >
                            <Heart size={12} fill={wishlist[resort.id] ? "#EF4444" : "none"} stroke={wishlist[resort.id] ? "#EF4444" : "#6e6e73"} />
                          </button>
                          <div className="flex items-center gap-1">
                            <Star size={11} fill="#c5a059" className="text-gold" />
                            <span className="text-xs font-bold text-text-dark">{resort.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 pb-24">
            {children}
          </div>
        )}
      </div>

      {/* ── RIVO MASCOT CHAT (Above bottom nav) ──── */}
      <div className="fixed bottom-[72px] right-4 z-[8500]">
        {/* Chat Popup */}
        {isMascotOpen && (
          <div className="absolute bottom-[60px] right-0 w-[300px] h-[380px] bg-bg-white border border-border-color rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Chat Header */}
            <div className="bg-[#121e1b] px-4 py-3 flex items-center gap-2.5 border-b border-white/5">
              <img src={rivoSupport} alt="Rivo" className="w-7 h-7 rounded-full object-cover border border-white/20" />
              <div className="flex-1">
                <h4 className="text-[13px] font-bold text-white m-0">Rivo AI</h4>
                <span className="text-[10px] text-white/60">🟢 Online</span>
              </div>
              <button className="bg-transparent border-none text-white/70 hover:text-white cursor-pointer" onClick={() => setIsMascotOpen(false)}>
                <X size={16} />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 bg-bg-light">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2 max-w-[90%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                  {msg.sender === "rivo" && (
                    <img src={rivoSupport} alt="Rivo" className="w-6 h-6 rounded-full object-cover border border-border-color shrink-0" />
                  )}
                  <div className={`px-3 py-2 rounded-[14px] text-[12.5px] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#121e1b] text-white rounded-tr-[3px]"
                      : "bg-bg-white text-text-dark rounded-tl-[3px] border border-border-color"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 self-start">
                  <img src={rivoSupport} alt="Rivo" className="w-6 h-6 rounded-full object-cover border border-border-color" />
                  <div className="bg-bg-white border border-border-color px-3 py-2 rounded-[14px] flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-text-gray rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-text-gray rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-text-gray rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>
            {/* Quick Replies */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-col gap-1.5 px-3 py-2 bg-bg-light border-t border-border-color">
                {QUICK_REPLIES.map((r) => (
                  <button key={r.key} className="bg-bg-white text-text-dark border border-border-color px-3 py-1.5 rounded-xl text-[11.5px] text-left cursor-pointer transition-colors hover:bg-bg-light hover:text-gold" onClick={() => handleSend(r.text)}>
                    {r.text}
                  </button>
                ))}
              </div>
            )}
            {/* Input */}
            <form className="flex px-3 py-2.5 border-t border-border-color bg-bg-white items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(inputVal); }}>
              <input
                type="text"
                placeholder="Ask Rivo..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 border-none outline-none px-2.5 py-1.5 text-[12.5px] bg-bg-light rounded-lg text-text-dark"
              />
              <button type="submit" className="bg-[#121e1b] text-white w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-gold shrink-0">
                <Send size={13} />
              </button>
            </form>
          </div>
        )}

        {/* Mascot Trigger Button */}
        <button
          className="w-12 h-12 rounded-full bg-bg-white border-2 border-gold shadow-[0_8px_25px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-110 p-0"
          onClick={() => setIsMascotOpen(!isMascotOpen)}
          aria-label="Chat with Rivo"
        >
          <img src={rivoSupport} alt="Rivo" className="w-full h-full object-cover" />
        </button>
      </div>

      {/* ── BOTTOM NAV ─────────────────────────────── */}
      <nav className="h-[68px] bg-bg-white/95 backdrop-blur-xl border-t border-border-color flex items-center justify-around px-2 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-[8100]">
        {[
          { id: "home", label: "Home", icon: <Home size={20} />, action: () => { setActiveTab("home"); navigate("/"); } },
          { id: "explore", label: "Explore", icon: <Search size={20} />, action: () => { setActiveTab("explore"); navigate("/search"); } },
          { id: "wishlist", label: "Wishlist", icon: <Heart size={20} />, action: () => { setActiveTab("wishlist"); navigate("/wishlist"); } },
          { id: "profile", label: "Profile", icon: <User size={20} />, action: () => { setActiveTab("profile"); navigate("/profile"); } },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all bg-transparent border-none cursor-pointer ${
              activeTab === tab.id ? "text-gold" : "text-text-gray hover:text-text-dark"
            }`}
            onClick={tab.action}
          >
            {tab.icon}
            <span className={`text-[10px] font-semibold ${activeTab === tab.id ? "text-gold" : ""}`}>{tab.label}</span>
            {activeTab === tab.id && <span className="w-1 h-1 bg-gold rounded-full" />}
          </button>
        ))}
      </nav>

      {/* ── SIDE DRAWER (same as desktop) ──────────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[9000] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-bg-white border-l border-border-color p-6 shadow-[-10px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-400 ease-out z-[9001] flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-border-color pb-4">
          <h3 className="text-lg font-bold text-text-dark">Account & Menu</h3>
          <button className="bg-transparent border-none cursor-pointer text-text-gray hover:text-text-dark" onClick={() => setIsDrawerOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <ul className="list-none flex flex-col gap-4 p-0 m-0 flex-1">
          <li>
            <button className="text-text-dark text-base font-semibold hover:text-gold transition-colors block bg-transparent border-none cursor-pointer text-left w-full" onClick={() => { navigate("/profile"); setIsDrawerOpen(false); }}>
              👤 Profile
            </button>
          </li>
          <li>
            <button className="text-text-dark text-base font-semibold hover:text-gold transition-colors block bg-transparent border-none cursor-pointer text-left w-full" onClick={() => scrollToSection("explore")}>
              🌍 Explore Stays
            </button>
          </li>
          <li>
            <button className="text-text-dark text-base font-semibold hover:text-gold transition-colors block bg-transparent border-none cursor-pointer text-left w-full" onClick={() => scrollToSection("why")}>
              ✨ Why Reservo
            </button>
          </li>
          <li>
            <button className="text-text-dark text-base font-semibold hover:text-gold transition-colors block bg-transparent border-none cursor-pointer text-left w-full" onClick={() => { navigate("/experiences"); setIsDrawerOpen(false); }}>
              🌅 Experiences
            </button>
          </li>
          <hr className="border-none h-px bg-border-color my-1" />
          <li className="flex flex-col gap-2.5">
            <span className="text-[11px] uppercase tracking-wider text-text-gray font-bold">Sign In or Register</span>
            <button className="w-full bg-transparent text-text-dark border border-border-color py-2.5 rounded-lg font-semibold hover:bg-text-dark hover:text-bg-white transition-all">Log In</button>
            <button className="w-full bg-gold text-white py-2.5 border-none rounded-lg font-semibold hover:bg-gold-dark transition-all">Register / Sign Up</button>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default MobileUI;
