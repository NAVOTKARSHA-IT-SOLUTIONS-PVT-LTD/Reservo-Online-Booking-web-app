import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Mascot from "./components/Mascot";
import Preloader from "./components/Preloader";
import MobileUI from "./components/MobileUI";
import BookingModal from "./components/BookingModal";
import SearchLoadingOverlay from "./components/SearchLoadingOverlay";

import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import MascotShowcase from "./components/MascotShowcase";

import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import { Careers, Terms, HelpCenter, Support, Privacy } from "./pages/DummyPages";

import ResortListing from "./components/ResortListing";
import ResortDetails from "./components/ResortDetails";
import { RESORTS } from "./data/resortsData";

import Experiences from "./pages/Experiences";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import AIPlanner from "./pages/AIPlanner";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

import rivoMascot from "./assets/images/rivo_mascot.jpg";

// Main Home Page Component
function Home({ wishlist, toggleWishlist }) {
  return (
    <>
      <Hero />
      <PopularDestinations wishlist={wishlist} toggleWishlist={toggleWishlist} />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <MascotShowcase />
    </>
  );
}

// Wrapper for Resort Details page to extract route parameter
function ResortDetailsPageWrapper({ isDark }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const idMap = {
    "1": "goa-coastline",
    "2": "kerala-backwaters",
    "3": "himalayan-chalet",
    "4": "himalayan-chalet",
    "5": "himalayan-chalet",
    "6": "udaipur-palace",
    "7": "udaipur-palace",
    "8": "himalayan-chalet",
    "9": "himalayan-chalet",
    "10": "maldives-overwater",
    "11": "goa-coastline",
    "12": "himalayan-chalet",
    "13": "udaipur-palace"
  };

  const mappedId = idMap[id] || id;
  const resort = RESORTS.find((r) => r.id === mappedId) || RESORTS[0];

  return (
    <ResortDetails
      resort={resort}
      isDarkMode={isDark}
      onBack={() => navigate("/")}
    />
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show preloader once per browser session
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem("reservo_preloader_shown");
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("reservo_preloader_shown", "true");
    setShowPreloader(false);
  };

  // Shared dark mode state (syncs with body class + localStorage)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("reservo-theme") === "dark";
  });

  const [wishlist, setWishlist] = useState([1, 2, 3]);

  // Booking checkout states
  const [bookingResort, setBookingResort] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isSearchPage = location.pathname === "/search" || location.pathname === "/search-results" || location.pathname === "/resorts";
  const isResortOrExperience = location.pathname.startsWith("/resort/") || location.pathname === "/experiences";

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("reservo-theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("reservo-theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if ((location.pathname === "/resorts" || location.pathname === "/search" || location.pathname === "/search-results") && location.state?.checkAvailabilityFor) {
      const resortId = location.state.checkAvailabilityFor;
      const resort = RESORTS.find((r) => r.id === resortId) || RESORTS[0];
      if (resort) {
        setBookingResort(resort);
        setBookingRoom(null);
        setIsCheckingAvailability(true);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const renderResortListing = () => (
    <ResortListing
      isDarkMode={isDark}
      onSelectResort={(resort) => navigate(`/resort/${resort.id}`)}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Preloader Screen */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Default browser mouse pointer used (CustomCursor removed for smooth performance) */}

      {location.pathname === "/login" || location.pathname === "/register" ? (
        <main className="flex-1 min-h-screen overflow-hidden">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      ) : isMobile ? (
        <MobileUI isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} wishlist={wishlist}>
          <Routes>
            <Route path="/" element={<Home wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={renderResortListing()} />
            <Route path="/search-results" element={renderResortListing()} />
            <Route path="/resorts" element={renderResortListing()} />
            <Route path="/resort/:id" element={<ResortDetailsPageWrapper isDark={isDark} />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileUI>
      ) : (
        <div className="flex flex-col flex-1">
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} wishlist={wishlist} />

          <main className={`flex-1 ${location.pathname === "/" ? "" : location.pathname === "/ai-planner" ? "pt-20" : "pt-28"}`}>
            <Routes>
              <Route path="/" element={<Home wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={renderResortListing()} />
              <Route path="/search-results" element={renderResortListing()} />
              <Route path="/resorts" element={renderResortListing()} />
              <Route path="/resort/:id" element={<ResortDetailsPageWrapper isDark={isDark} />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/ai-planner" element={<AIPlanner />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Floating Mascot Widget */}
          <Mascot isDark={isDark} setIsDark={setIsDark} />

          {/* Footer */}
          {location.pathname !== "/ai-planner" && <Footer />}
        </div>
      )}

      {/* Booking Modal & Search Loader Overlay integrations */}
      {isCheckingAvailability && bookingResort && (
        <SearchLoadingOverlay 
          destination={bookingResort.location} 
          onComplete={() => setIsCheckingAvailability(false)} 
        />
      )}

      {!isCheckingAvailability && bookingResort && (
        <BookingModal
          resort={bookingResort}
          room={bookingRoom}
          isDarkMode={isDark}
          onClose={() => {
            setBookingResort(null);
            setBookingRoom(null);
          }}
          onAskRivo={() => {
            const mascotBtn = document.querySelector('[aria-label="Toggle Rivo AI Companion"]');
            if (mascotBtn) {
              mascotBtn.click();
            }
          }}
        />
      )}

      {/* Global Toast Notification Container */}
      <div 
        id="toast" 
        className="fixed top-[30px] left-1/2 -translate-x-1/2 bg-[#121e1b] text-white px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2.5 text-sm font-medium z-[3000] opacity-0 pointer-events-none transition-opacity duration-300 [&.show]:opacity-100 [&.show]:pointer-events-auto"
      >
        <span id="toast-message"></span>
      </div>
    </div>
  );
}

export default App;