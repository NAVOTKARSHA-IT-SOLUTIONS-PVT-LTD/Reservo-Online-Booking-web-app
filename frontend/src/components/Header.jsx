import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { 
  Menu, X, Heart, Moon, Sun, Globe, ChevronDown, Check,
  LogIn, UserPlus, HelpCircle, Phone, Shield, FileText,
  LayoutGrid, BookOpen, Bell, Settings, User, LogOut, Sliders, Building2,
  Search, MapPin, Calendar, Users, Minus, Plus
} from "lucide-react";
import logoImage from "../assets/images/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/auth.service";
import { hostService } from "../services/host.service";
import { useToast } from "../context/ToastContext";
import CustomCalendar from "./CustomCalendar";

function Header({ isDark, onToggleTheme, wishlist = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const currencyMenuRef = useRef(null);

  const handleListPropertyClick = () => {
    navigate("/become-a-host");
    setIsMenuOpen(false);
  };

  const [hasPublished, setHasPublished] = useState(() => hostService.hasPublishedListing());

  useEffect(() => {
    const handleHostCheck = () => {
      setHasPublished(hostService.hasPublishedListing());
    };
    window.addEventListener("storage", handleHostCheck);
    window.addEventListener("reservo-host-data-updated", handleHostCheck);
    return () => {
      window.removeEventListener("storage", handleHostCheck);
      window.removeEventListener("reservo-host-data-updated", handleHostCheck);
    };
  }, []);

  // Search Stays Modal states
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationQuery, setSearchLocationQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const searchLocationRef = useRef(null);
  const searchCalendarRef = useRef(null);
  const searchGuestsRef = useRef(null);

  const DESTINATIONS_LIST = [
    { group: "🏖️ Beach", places: ["Goa", "Kovalam", "Andaman Islands", "Gokarna", "Pondicherry", "Lakshadweep"] },
    { group: "🏔️ Mountain", places: ["Manali", "Shimla", "Mussoorie", "Darjeeling", "Munnar", "Nainital", "Srinagar"] },
    { group: "🏛️ Heritage & Culture", places: ["Udaipur", "Jaipur", "Varanasi", "Jodhpur", "Mysuru"] },
    { group: "🌴 Backwaters & Nature", places: ["Alleppey", "Coorg", "Ooty", "Wayanad", "Meghalaya", "Rishikesh"] }
  ];

  const handlePerformSearch = () => {
    setShowSearchModal(false);
    setShowLocationDropdown(false);
    setShowCalendarDropdown(false);
    setShowGuestsDropdown(false);

    const queryParams = new URLSearchParams();
    if (searchLocation) queryParams.set("destination", searchLocation);
    if (checkInDate) queryParams.set("checkIn", checkInDate);
    if (checkOutDate) queryParams.set("checkOut", checkOutDate);
    if (guestCount) queryParams.set("guests", String(guestCount));

    navigate(`/search?${queryParams.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchLocationRef.current && !searchLocationRef.current.contains(e.target)) {
        setShowLocationDropdown(false);
      }
      if (searchGuestsRef.current && !searchGuestsRef.current.contains(e.target)) {
        setShowGuestsDropdown(false);
      }
      if (searchCalendarRef.current && !searchCalendarRef.current.contains(e.target)) {
        setShowCalendarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const clickOutside = (e) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target)) {
        setShowCurrencyMenu(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy to highlight active section on home page
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180; // offset threshold

      const homeEl = document.getElementById("hero") || document.querySelector("section");
      const exploreEl = document.getElementById("explore");
      const whyEl = document.getElementById("why");
      const reviewsEl = document.getElementById("testimonials");
      const contactEl = document.getElementById("footer") || document.getElementById("contact");

      let current = "home";

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        current = "contact";
      } else if (reviewsEl && scrollPosition >= reviewsEl.offsetTop) {
        current = "reviews";
      } else if (whyEl && scrollPosition >= whyEl.offsetTop) {
        current = "why";
      } else if (exploreEl && scrollPosition >= exploreEl.offsetTop) {
        current = "explore";
      } else if (homeEl && scrollPosition >= homeEl.offsetTop) {
        current = "home";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollSpy);
    handleScrollSpy(); // initial check
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const performScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -110; // offset of 110px to prevent fixed header from overlapping
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(performScroll, 350);
    } else {
      performScroll();
    }
  };

  const isHome = location.pathname === "/";

  // ── Page + Scroll + Theme adaptive classes ──────────────────────────────────
  // useHeroStyle = true  → transparent dark glass + white controls
  //              = false → solid themed navbar (white/light in light mode, dark navy in dark mode)
  //
  // Hero style is ONLY applied on the home page when NOT scrolled.
  // On any other page (AI Planner, Rewards, Contact…) always use the solid style.
  const useHeroStyle = isHome && !isScrolled;

  const navLinkBase = "inline-flex items-center justify-center h-10 relative text-[15px] font-semibold transition-all duration-[400ms] ease-[ease] cursor-pointer border-none bg-transparent after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:transition-transform after:duration-300";

  // Solid navbar colors depend on theme
  const solidNavColors = isDark
    ? "text-white/90 hover:text-white after:bg-white"
    : "text-[#102A43]/80 hover:text-[#102A43] after:bg-[#102A43]";
  const navLinkColors = useHeroStyle ? "text-white hover:text-white/90 after:bg-white" : solidNavColors;
  const navLinkStyle = !useHeroStyle && !isDark ? {} : { textShadow: "0 1px 4px rgba(0,0,0,0.55)" };
  const navLinkClass = `${navLinkBase} ${navLinkColors}`;

  const solidActiveColor = isDark ? "text-white after:scale-x-100" : "text-[#102A43] after:scale-x-100";
  const getNavLinkClass = (isActive) =>
    `${navLinkClass} ${isActive
      ? (useHeroStyle ? "text-white after:scale-x-100" : solidActiveColor)
      : "after:scale-x-0 hover:after:scale-x-100"}`;

  // Icon button classes
  const solidIconBtn = isDark
    ? "cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-white hover:border-white/40 transition-all"
    : "bg-white border border-[#DDE6EF] cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-[#102A43] hover:border-primary hover:text-primary transition-all shadow-sm";
  const iconBtnClass = useHeroStyle
    ? "cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-white hover:border-white/40 transition-all"
    : solidIconBtn;

  // Inline styles for icon buttons
  const solidIconStyle = isDark
    ? { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }
    : {};
  const iconBtnStyle = useHeroStyle
    ? { background: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.2)" }
    : solidIconStyle;

  // Globe/chevron sub-icon color
  const subIconColor = !useHeroStyle && !isDark ? "text-[#102A43]/60" : "text-white/80";

  // Language selector button
  const solidLangBtn = isDark
    ? "flex items-center gap-2 text-[13px] font-semibold h-10 px-4 rounded-full text-white hover:border-white/40 cursor-pointer transition-all focus:outline-none"
    : "flex items-center gap-2 text-[13px] font-semibold h-10 px-4 rounded-full border border-[#DDE6EF] bg-white text-[#102A43] hover:border-primary cursor-pointer transition-all focus:outline-none shadow-sm";
  const langBtnClass = useHeroStyle
    ? "flex items-center gap-2 text-[13px] font-semibold h-10 px-4 rounded-full text-white hover:border-white/40 cursor-pointer transition-all focus:outline-none"
    : solidLangBtn;

  const solidLangStyle = isDark
    ? { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }
    : {};
  const langBtnStyle = useHeroStyle
    ? { background: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.2)" }
    : solidLangStyle;

  // Navbar pill inline style
  const solidPillStyle = isDark
    ? { background: "rgba(10,20,35,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderColor: "rgba(255,255,255,0.1)", transition: "all 400ms ease" }
    : { background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderColor: "rgba(0,0,0,0.08)", transition: "all 400ms ease" };
  const heroPillStyle = { background: "rgba(10,25,45,0.35)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", transition: "all 400ms ease" };

  // Reservo brand text color
  const brandTextColor = !useHeroStyle && !isDark ? "text-[#102A43]" : "text-white drop-shadow-sm";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        {/* Navbar pill — page + theme + scroll aware */}
        <div
          className={`flex justify-between items-center px-6 navbar-transition pointer-events-auto ${
            useHeroStyle
              ? "max-w-[1300px] w-[95%] mt-6 rounded-[32px] py-3"
              : "max-w-full w-full mt-0 rounded-none py-4 border-b shadow-md"
          }`}
          style={useHeroStyle ? heroPillStyle : solidPillStyle}
        >
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group select-none shrink-0">
            <img 
              src={logoImage} 
              alt="Reservo Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <span className={`text-[22px] font-extrabold tracking-[0.5px] font-serif leading-none transition-colors duration-[400ms] ${brandTextColor}`}>
              Reservo
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center px-4">
            <ul className="flex gap-7 list-none m-0 p-0 items-center justify-center">
              <li>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={getNavLinkClass(isHome && activeSection === "home")} style={navLinkStyle}>
                  {t("home")}
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(isHome && activeSection === "explore")} style={navLinkStyle} onClick={() => scrollToSection("explore")}>
                  {t("explore")}
                </button>
              </li>
              <li>
                <Link to="/ai-planner" className={getNavLinkClass(location.pathname === "/ai-planner")} style={navLinkStyle}>
                  ✨ {t("ai_planner")}
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(isHome && activeSection === "why")} style={navLinkStyle} onClick={() => scrollToSection("why")}>
                  {t("why_us")}
                </button>
              </li>
              <li>
                <Link to="/rewards" className={getNavLinkClass(location.pathname === "/rewards")} style={navLinkStyle}>
                  {t("rewards")}
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(isHome && activeSection === "reviews")} style={navLinkStyle} onClick={() => scrollToSection("testimonials")}>
                  {t("reviews")}
                </button>
              </li>
              <li>
                <Link to="/contact" className={getNavLinkClass(location.pathname === "/contact")} style={navLinkStyle}>
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Stays icon button */}
            <button 
              onClick={() => setShowSearchModal(true)} 
              className={iconBtnClass} 
              style={iconBtnStyle}
              aria-label="Search Stays"
              title="Search Stays"
            >
              <Search size={18} />
            </button>

            {/* Theme toggle */}
            <button onClick={onToggleTheme} className={iconBtnClass} style={iconBtnStyle}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" aria-label="View Wishlist" className={`relative ${iconBtnClass}`} style={iconBtnStyle}>
              <Heart size={18} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {wishlist.length}
              </span>
            </Link>

            {/* Language / Currency */}
            <div className="relative" ref={currencyMenuRef}>
              <button onClick={() => setShowCurrencyMenu(!showCurrencyMenu)} className={langBtnClass} style={langBtnStyle}>
                <Globe size={15} className={subIconColor} />
                <span className="flex items-center gap-1.5">
                  {(() => {
                    const lang = localStorage.getItem("reservo-language") || "en";
                    const langLabel = lang === "hi" ? "हिन्दी" : "English";
                    const curr = localStorage.getItem("reservo-currency") || "en_inr";
                    const currLabel = curr === "en_usd" ? "USD" : "INR";
                    return `${langLabel} • ${currLabel}`;
                  })()}
                </span> 
                <ChevronDown size={13} className={subIconColor} />
              </button>
              
              <AnimatePresence>
                {showCurrencyMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 bg-bg-white border border-border-color rounded-2xl shadow-xl p-4 w-52 z-50 text-[11.5px] font-bold text-text-dark flex flex-col gap-3"
                  >
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-text-gray mb-1.5 px-1">Language</div>
                      <div className="flex flex-col gap-0.5">
                        {[
                          { code: "en", label: "🇺🇸 English" },
                          { code: "hi", label: "🇮🇳 हिन्दी (Hindi)" }
                        ].map((item) => (
                          <button 
                            key={item.code}
                            onClick={() => {
                              localStorage.setItem("reservo-language", item.code);
                              window.dispatchEvent(new Event("storage"));
                              setShowCurrencyMenu(false);
                              toast(`Language switched to ${item.label.split(' ')[1]}!`, "success");
                            }}
                            className="w-full text-left py-1.5 px-2 rounded-xl hover:bg-bg-light bg-transparent border-none cursor-pointer text-text-dark flex items-center justify-between transition-colors font-semibold"
                          >
                            <span>{item.label}</span>
                            {(localStorage.getItem("reservo-language") || "en") === item.code && <Check className="w-3.5 h-3.5 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border-color pt-2.5">
                      <div className="text-[9px] uppercase tracking-wider text-text-gray mb-1.5 px-1">Currency</div>
                      <div className="flex flex-col gap-0.5">
                        {[
                          { code: "en_inr", label: "🇮🇳 INR (₹)" },
                          { code: "en_usd", label: "🇺🇸 USD ($)" }
                        ].map((item) => (
                          <button 
                            key={item.code}
                            onClick={() => {
                              localStorage.setItem("reservo-currency", item.code);
                              window.dispatchEvent(new Event("storage"));
                              setShowCurrencyMenu(false);
                            }}
                            className="w-full text-left py-1.5 px-2 rounded-xl hover:bg-bg-light bg-transparent border-none cursor-pointer text-text-dark flex items-center justify-between transition-colors font-semibold"
                          >
                            <span>{item.label}</span>
                            {(localStorage.getItem("reservo-currency") || "en_inr") === item.code && <Check className="w-3.5 h-3.5 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger menu */}
            <button aria-label="Open Navigation Menu" className={iconBtnClass} style={iconBtnStyle} onClick={toggleMenu}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
 
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[2000] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={toggleMenu} />
      <div className={`fixed top-0 right-0 bottom-0 w-80 max-w-full bg-bg-white border-l border-border-color p-7 shadow-2xl transition-transform duration-400 ease-out z-[2001] flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8 border-b border-border-color pb-4">
          <h3 className="text-xl font-bold text-text-dark">Menu</h3>
          <button className="bg-transparent text-text-gray hover:text-text-dark border-none cursor-pointer" onClick={toggleMenu}><X size={24} /></button>
        </div>
        <ul className="list-none flex flex-col gap-1.5 p-0 m-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {(() => {
            const isLoggedIn = authService.isAuthenticated();
            const user = authService.getCurrentUser();
            return [
              ...(!isLoggedIn ? [
                { type: "item", icon: <LogIn size={18} />, label: "Login", path: "/login" },
                { type: "item", icon: <UserPlus size={18} />, label: "Create Account", path: "/register" }
              ] : [
                { type: "item", icon: <User size={18} />, label: `Profile (${user?.name || user?.displayName || user?.email?.split('@')[0] || "User"})`, path: "/profile" },
                ...(user?.role === "ROLE_ADMIN" ? [
                  { type: "item", icon: <Building2 size={18} />, label: "Reservo Team Admin", path: "/admin/reservo" }
                ] : user?.role === "ROLE_OWNER" ? [
                  { type: "item", icon: <Building2 size={18} />, label: "Host Administration", path: "/host/dashboard" }
                ] : [
                  user?.kycStatus === "PENDING_VERIFICATION"
                    ? { type: "item", icon: <LayoutGrid size={18} />, label: "Host Request Pending", action: () => alert("Your host request is currently pending admin review. Please wait for approval.") }
                    : { type: "item", icon: <LayoutGrid size={18} />, label: "Become a Host", path: "/become-a-host" }
                ])
              ]),
              { type: "divider" },
              { type: "item", icon: <HelpCircle size={18} />, label: "Help Center", path: "/help" },
              { type: "item", icon: <Phone size={18} />, label: "Contact", path: "/contact" },
              { type: "item", icon: <Shield size={18} />, label: "Privacy Policy", path: "/privacy" },
              { type: "item", icon: <FileText size={18} />, label: "Terms", path: "/terms" },
              { type: "divider" },
              ...(isLoggedIn ? [
                { type: "item", icon: <LayoutGrid size={18} />, label: "Dashboard", path: "/dashboard" },
                { type: "item", icon: <BookOpen size={18} />, label: "Bookings", path: "/bookings" },
                { type: "item", icon: <Bell size={18} />, label: "Notifications", path: "/notifications" },
                { type: "item", icon: <Settings size={18} />, label: "Settings", path: "/settings" },
                { type: "divider" },
                { type: "item", icon: <LogOut size={18} />, label: "Logout", action: () => { authService.logout().then(() => { navigate("/"); window.location.reload(); }); } }
              ] : [])
            ];
          })().map((item, idx) => {
            if (item.type === "divider") {
              return <hr key={idx} className="border-none h-px bg-border-color my-1 shrink-0" />;
            }
            const active = item.path && location.pathname === item.path;
            return (
              <li key={idx}>
                <button
                  onClick={() => {
                    if (item.action) item.action();
                    else if (item.path) navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl border-none transition text-sm font-semibold cursor-pointer text-left ${
                    active 
                      ? "bg-[#2F80ED]/10 text-primary" 
                      : "bg-transparent text-text-dark hover:bg-bg-light"
                  }`}
                >
                  <span className={active ? "text-primary" : "text-text-gray"}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Search Stays Pill Modal (Matching Image 2) */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-md z-[10005] flex items-center justify-center p-4 pointer-events-auto"
            onClick={() => {
              setShowSearchModal(false);
              setShowLocationDropdown(false);
              setShowCalendarDropdown(false);
              setShowGuestsDropdown(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-2xl max-w-[1100px] w-full relative space-y-6 text-left font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-border-color pb-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-text-dark flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" /> Search Luxury Stays
                  </h3>
                  <p className="text-xs text-text-gray font-medium mt-0.5">
                    Select destination, dates, and guests to explore exclusive resorts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchModal(false);
                    setShowLocationDropdown(false);
                    setShowCalendarDropdown(false);
                    setShowGuestsDropdown(false);
                  }}
                  className="bg-bg-light hover:bg-slate-200 dark:hover:bg-slate-800 text-text-gray hover:text-text-dark border-none cursor-pointer p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Pill Bar (Matching Image 2) */}
              <div className="bg-bg-light border border-border-color rounded-3xl md:rounded-full p-3 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 flex flex-col md:flex-row items-center w-full divide-y md:divide-y-0 md:divide-x divide-border-color relative">
                  
                  {/* 1. WHERE TO? */}
                  <div className="flex-1 relative w-full" ref={searchLocationRef}>
                    <div
                      onClick={() => {
                        setShowLocationDropdown(!showLocationDropdown);
                        setShowCalendarDropdown(false);
                        setShowGuestsDropdown(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 md:py-1 cursor-pointer group"
                    >
                      <MapPin size={20} className={`shrink-0 transition-colors ${showLocationDropdown ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                      <div className="flex flex-col text-left">
                        <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-0.5">WHERE TO?</label>
                        <span className="text-[14px] font-extrabold text-text-dark line-clamp-1">
                          {searchLocation || "Select Destination"}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          {searchLocation ? "Selected" : "All Destinations"} <ChevronDown size={12} className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                        </span>
                      </div>
                    </div>

                    {/* Location Dropdown */}
                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 w-full md:w-[320px] mt-3 bg-bg-white rounded-2xl shadow-2xl border border-border-color overflow-hidden z-50 p-2 space-y-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-light border border-border-color">
                          <Search size={14} className="text-gray-400" />
                          <input
                            type="text"
                            value={searchLocationQuery}
                            onChange={(e) => setSearchLocationQuery(e.target.value)}
                            placeholder="Type a city or resort..."
                            className="w-full text-xs font-semibold bg-transparent outline-none text-text-dark"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-[220px] overflow-y-auto space-y-1">
                          {DESTINATIONS_LIST.map((group, idx) => (
                            <div key={idx} className="text-left">
                              <div className="text-[10px] uppercase font-bold text-text-gray px-3 py-1 bg-bg-light rounded-md">
                                {group.group}
                              </div>
                              {group.places
                                .filter((p) => !searchLocationQuery.trim() || p.toLowerCase().includes(searchLocationQuery.toLowerCase()))
                                .map((place) => (
                                  <button
                                    key={place}
                                    onClick={() => {
                                      setSearchLocation(place);
                                      setShowLocationDropdown(false);
                                      setSearchLocationQuery("");
                                    }}
                                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-text-dark hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between border-none cursor-pointer bg-transparent"
                                  >
                                    <span>{place}</span>
                                    {searchLocation === place && <Check size={14} className="text-primary" />}
                                  </button>
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. CHECK IN */}
                  <div className="flex-1 relative w-full" ref={searchCalendarRef}>
                    <div
                      onClick={() => {
                        setShowCalendarDropdown(!showCalendarDropdown);
                        setShowLocationDropdown(false);
                        setShowGuestsDropdown(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 md:py-1 cursor-pointer group"
                    >
                      <Calendar size={20} className={`shrink-0 transition-colors ${showCalendarDropdown ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                      <div className="flex flex-col text-left">
                        <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-0.5">CHECK IN</label>
                        <span className="text-[14px] font-extrabold text-text-dark">
                          {checkInDate ? checkInDate : "Select Date"}
                        </span>
                        <span className="text-[11px] text-gray-400">{checkInDate ? "Check-in Date" : "Select date"}</span>
                      </div>
                    </div>

                    {showCalendarDropdown && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-bg-white rounded-2xl shadow-2xl border border-border-color overflow-hidden z-50 p-2">
                        <CustomCalendar
                          checkInDate={checkInDate}
                          checkOutDate={checkOutDate}
                          onDateChange={(ci, co) => {
                            setCheckInDate(ci);
                            setCheckOutDate(co);
                            if (ci && co) setShowCalendarDropdown(false);
                          }}
                          isDarkMode={isDark}
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. CHECK OUT */}
                  <div className="flex-1 relative w-full">
                    <div
                      onClick={() => {
                        setShowCalendarDropdown(!showCalendarDropdown);
                        setShowLocationDropdown(false);
                        setShowGuestsDropdown(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 md:py-1 cursor-pointer group"
                    >
                      <Calendar size={20} className={`shrink-0 transition-colors ${showCalendarDropdown ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                      <div className="flex flex-col text-left">
                        <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-0.5">CHECK OUT</label>
                        <span className="text-[14px] font-extrabold text-text-dark">
                          {checkOutDate ? checkOutDate : "Select Date"}
                        </span>
                        <span className="text-[11px] text-gray-400">{checkOutDate ? "Check-out Date" : "Select date"}</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. GUESTS & ROOMS */}
                  <div className="flex-1 relative w-full" ref={searchGuestsRef}>
                    <div
                      onClick={() => {
                        setShowGuestsDropdown(!showGuestsDropdown);
                        setShowLocationDropdown(false);
                        setShowCalendarDropdown(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 md:py-1 cursor-pointer group"
                    >
                      <Users size={20} className={`shrink-0 transition-colors ${showGuestsDropdown ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                      <div className="flex flex-col text-left">
                        <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-0.5">GUESTS & ROOMS</label>
                        <span className="text-[14px] font-extrabold text-text-dark">
                          {guestCount} Guest{guestCount > 1 ? 's' : ''}, {roomCount} Room{roomCount > 1 ? 's' : ''}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          Rooms <ChevronDown size={12} className={`transition-transform ${showGuestsDropdown ? 'rotate-180' : ''}`} />
                        </span>
                      </div>
                    </div>

                    {showGuestsDropdown && (
                      <div className="absolute top-full right-0 w-full md:w-[280px] mt-3 bg-bg-white rounded-2xl shadow-2xl border border-border-color overflow-hidden z-50 p-4 space-y-4 text-left">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-text-dark">Adults</p>
                            <p className="text-[10px] text-gray-400">Ages 13+</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-7 h-7 rounded-full border border-border-color flex items-center justify-center font-bold bg-transparent cursor-pointer text-text-dark hover:border-primary">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-text-dark w-4 text-center">{guestCount}</span>
                            <button onClick={() => setGuestCount(Math.min(10, guestCount + 1))} className="w-7 h-7 rounded-full border border-border-color flex items-center justify-center font-bold bg-transparent cursor-pointer text-text-dark hover:border-primary">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between border-t border-border-color pt-3">
                          <div>
                            <p className="text-xs font-bold text-text-dark">Children</p>
                            <p className="text-[10px] text-gray-400">Ages 2–12</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setChildCount(Math.max(0, childCount - 1))} className="w-7 h-7 rounded-full border border-border-color flex items-center justify-center font-bold bg-transparent cursor-pointer text-text-dark hover:border-primary">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-text-dark w-4 text-center">{childCount}</span>
                            <button onClick={() => setChildCount(Math.min(6, childCount + 1))} className="w-7 h-7 rounded-full border border-border-color flex items-center justify-center font-bold bg-transparent cursor-pointer text-text-dark hover:border-primary">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Rooms */}
                        <div className="flex items-center justify-between border-t border-border-color pt-3">
                          <div>
                            <p className="text-xs font-bold text-text-dark">Rooms</p>
                            <p className="text-[10px] text-gray-400">Total rooms</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setRoomCount(Math.max(1, roomCount - 1))} className="w-7 h-7 rounded-full border border-border-color flex items-center justify-center font-bold bg-transparent cursor-pointer text-text-dark hover:border-primary">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-text-dark w-4 text-center">{roomCount}</span>
                            <button onClick={() => setRoomCount(Math.min(5, roomCount + 1))} className="w-7 h-7 rounded-full border border-border-color flex items-center justify-center font-bold bg-transparent cursor-pointer text-text-dark hover:border-primary">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* 5. SEARCH STAYS BUTTON */}
                <button
                  onClick={handlePerformSearch}
                  className="bg-[#1053b8] hover:bg-[#0c4499] text-white font-extrabold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-300 w-full md:w-auto shrink-0 text-sm"
                >
                  <Search size={18} />
                  <span>Search Stays</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
