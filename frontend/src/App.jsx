import React, { useState, useEffect, useRef, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, WifiOff, CheckCircle2, ArrowUp, Send, Heart, Sun, Moon, Globe, ChevronDown, Menu, Check } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Mascot from "./components/Mascot";
import Preloader from "./components/Preloader";
import MobileUI from "./components/MobileUI";
import BookingModal from "./components/BookingModal";
import SearchLoadingOverlay from "./components/SearchLoadingOverlay";
import ProtectedRoute from "./components/ProtectedRoute";
import GuidedTour from "./components/GuidedTour";
import RecentlyViewed from "./components/RecentlyViewed";
import { secureStorage } from "./services/secureStorage";
import { useToast } from "./context/ToastContext";
import { useWishlist } from "./context/WishlistContext";
import { RESORTS } from "./data/resortsData";

// Lazy-loaded pages
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Rewards = React.lazy(() => import("./pages/Rewards"));
const Experiences = React.lazy(() => import("./pages/Experiences"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const AIPlanner = React.lazy(() => import("./pages/AIPlanner"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Bookings = React.lazy(() => import("./pages/Bookings"));
const Notifications = React.lazy(() => import("./pages/Notifications"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const ReservoAdminPortal = React.lazy(() => import("./pages/ReservoAdminPortal"));
const ResortAdminPortal = React.lazy(() => import("./pages/ResortAdminPortal"));

// Lazy-loaded dummy pages
const Careers = React.lazy(() => import("./pages/DummyPages").then(m => ({ default: m.Careers })));
const Terms = React.lazy(() => import("./pages/DummyPages").then(m => ({ default: m.Terms })));
const HelpCenter = React.lazy(() => import("./pages/DummyPages").then(m => ({ default: m.HelpCenter })));
const Support = React.lazy(() => import("./pages/DummyPages").then(m => ({ default: m.Support })));
const Privacy = React.lazy(() => import("./pages/DummyPages").then(m => ({ default: m.Privacy })));

// Pre-load components to prevent lag
import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import MascotShowcase from "./components/MascotShowcase";
import ResortListing from "./components/ResortListing";
import ResortDetails from "./components/ResortDetails";

// Simple Loading Indicator for Suspense
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4 font-sans bg-bg-light">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold text-text-gray tracking-wider uppercase">Loading Luxury Experience...</span>
    </div>
  );
}

const HOME_DESTINATIONS_MAP = {
  1: { name: "Goa Coastline", location: "West Coast, India", price: 8000 },
  2: { name: "Kerala Backwaters", location: "South Coast, India", price: 9000 },
  3: { name: "Solang Valley Manali", location: "Himachal Pradesh, India", price: 6500 },
  4: { name: "Coorg Hill Station", location: "Karnataka, India", price: 7200 },
  5: { name: "Coorg Forest Chalet", location: "Karnataka, India", price: 8500 },
  6: { name: "Udaipur Lake Palace", location: "Rajasthan, India", price: 15000 },
  7: { name: "Jaipur Haveli", location: "Rajasthan, India", price: 12000 },
  8: { name: "Shimla Log Cabin", location: "Himachal Pradesh, India", price: 5800 },
  9: { name: "Manali Glamping Tents", location: "Himachal Pradesh, India", price: 7500 },
  10: { name: "Andaman Private Shore", location: "Andaman Islands, India", price: 18000 },
  11: { name: "Andaman Beach Cove", location: "Andaman Islands, India", price: 13500 },
  12: { name: "Shimla Alpine Resort", location: "Himachal Pradesh, India", price: 8200 },
  13: { name: "Goa Heritage Villa", location: "Goa, India", price: 11000 }
};

// Main Home Page Component
function Home({ wishlist, toggleWishlist }) {
  // Sync currency values
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const handleStorage = () => {
      const cur = localStorage.getItem("reservo-currency") || "en_inr";
      if (cur === "en_usd") {
        setCurrencySymbol("$");
        setExchangeRate(0.012);
      } else if (cur === "es_eur") {
        setCurrencySymbol("€");
        setExchangeRate(0.011);
      } else {
        setCurrencySymbol("₹");
        setExchangeRate(1);
      }
    };
    handleStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <>
      <Hero />
      <RecentlyViewed currencySymbol={currencySymbol} rates={exchangeRate} />
      <PopularDestinations wishlist={wishlist} toggleWishlist={toggleWishlist} />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <MascotShowcase />
    </>
  );
}

// Wrapper for Resort Details page
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

  // Log details checks to recently viewed stays in secureStorage
  useEffect(() => {
    if (resort) {
      const history = secureStorage.getItem("reservo-recently-viewed") || [];
      const filtered = history.filter(item => item.id !== resort.id);
      const updated = [
        {
          id: resort.id,
          name: resort.name,
          location: resort.location,
          price: resort.price,
          heroImage: resort.heroImage,
          rating: resort.rating
        },
        ...filtered
      ].slice(0, 4);
      secureStorage.setItem("reservo-recently-viewed", updated);
      window.dispatchEvent(new Event("storage"));
    }
  }, [resort]);

  return (
    <ResortDetails
      resort={resort}
      urlId={id}
      isDarkMode={isDark}
      onBack={() => navigate("/")}
    />
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Shared theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("reservo-theme") === "dark";
  });

  // Preloader state
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem("reservo_preloader_shown");
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("reservo_preloader_shown", "true");
    setShowPreloader(false);
  };

  // Wishlist state
  const { wishlist, toggleWishlist } = useWishlist();
  const wishlistIds = [];
  wishlist.forEach((item) => {
    if (typeof item.id === 'string' && item.id.startsWith('home-')) {
      wishlistIds.push(parseInt(item.id.replace('home-', ''), 10));
    } else if (typeof item.id === 'number') {
      wishlistIds.push(item.id);
    }
  });

  const handleToggleWishlist = (id) => {
    const homeDest = HOME_DESTINATIONS_MAP[id];
    if (homeDest) {
      toggleWishlist({ id: `home-${id}`, ...homeDest });
    }
  };

  // Booking states
  const [bookingResort, setBookingResort] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Extra improvements states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem("reservo-cookie-consent") === "true";
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

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

  // Handle dark theme body class sync
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("reservo-theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("reservo-theme", "light");
    }
  }, [isDark]);

  // Online / Offline Status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast("Back online. Synchronizing data settings...", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast("You are browsing offline. Changes will save when reconnected.", "error");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // Scroll Progress and Back To Top triggers
  useEffect(() => {
    const handleScroll = () => {
      // Scroll Progress Bar
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Back to Top button
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard Shortcuts (Esc to close dialogs, Alt+H for Home, Alt+W for Wishlist)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "h") {
        navigate("/");
      } else if (e.altKey && e.key === "w") {
        navigate("/wishlist");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim() === "") return;
    toast("Thank you for your valuable feedback! Rivo has logged it.", "success");
    setFeedbackText("");
    setShowFeedback(false);
  };

  const handleAcceptCookies = () => {
    localStorage.setItem("reservo-cookie-consent", "true");
    setCookieConsent(true);
    toast("Cookies preferences accepted.", "info");
  };

  const lastProcessedKeyRef = useRef(null);
  useEffect(() => {
    const key = location.key || (location.pathname + JSON.stringify(location.state || {}));
    if ((location.pathname === "/resorts" || location.pathname === "/search" || location.pathname === "/search-results") && location.state?.checkAvailabilityFor) {
      if (lastProcessedKeyRef.current !== key) {
        lastProcessedKeyRef.current = key;
        const resortId = location.state.checkAvailabilityFor;
        const resort = RESORTS.find((r) => r.id === resortId) || RESORTS[0];
        if (resort) {
          setBookingResort(resort);
          setBookingRoom(null);
          setIsCheckingAvailability(true);
        }
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, navigate]);

  const renderResortListing = () => (
    <ResortListing
      isDarkMode={isDark}
      onSelectResort={(resort) => navigate(`/resort/${resort.id}`)}
    />
  );

  // Framer Motion Page Transition config
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 }
  };

  const renderAppRoutes = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.25 }}
        className="flex-grow flex flex-col"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home wishlist={wishlistIds} toggleWishlist={handleToggleWishlist} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Guarded Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={renderResortListing()} />
            <Route path="/search-results" element={renderResortListing()} />
            <Route path="/resorts" element={renderResortListing()} />
            <Route path="/resort/:id" element={<ResortDetailsPageWrapper isDark={isDark} />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/wishlist" element={<Wishlist onBook={(resort) => setBookingResort(resort)} />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg-light transition-colors duration-300">
      
      {/* Interactive Guided Tour component overlay */}
      <GuidedTour />

      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-xl z-[10002] font-semibold text-xs shadow transition-all">
        Skip to Main Content
      </a>

      {/* Sticky Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-primary z-[10001] transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Offline Alert Ribbon */}
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white py-1.5 px-4 text-[10px] font-bold text-center uppercase tracking-widest z-[10002] flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" /> You are currently browsing offline
        </div>
      )}

      {/* Global Preloader Screen */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/admin") ? (
        <main id="main-content" className="flex-1 min-h-screen overflow-hidden">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/reservo" element={<ProtectedRoute allowedRoles={["admin"]}><ReservoAdminPortal /></ProtectedRoute>} />
              <Route path="/admin/resort" element={<ProtectedRoute allowedRoles={["resort_admin"]}><ResortAdminPortal /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </main>
      ) : isMobile ? (
        <MobileUI isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} wishlist={wishlistIds}>
          <main id="main-content" className="flex-grow flex flex-col">
            {renderAppRoutes()}
          </main>
        </MobileUI>
      ) : (
        <div className="flex flex-col flex-1 bg-bg-light transition-colors duration-300">
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} wishlist={wishlist} />

          <main id="main-content" className={`flex-1 flex flex-col ${location.pathname === "/" ? "" : location.pathname === "/ai-planner" ? "pt-20" : "pt-28"}`}>
            {renderAppRoutes()}
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

      {/* Floating Action Buttons: Back To Top */}
      <AnimatePresence>
        {showBackToTop && !isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-26 right-8 bg-[#121e1b] text-white p-3 rounded-full shadow-lg border border-[#334155] cursor-pointer hover:bg-primary transition-colors duration-300 z-40"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Feedback Widget */}
      {!isMobile && (
        <div className="fixed bottom-8 left-8 z-40">
          <button 
            onClick={() => setShowFeedback(!showFeedback)}
            className="bg-[#121e1b] text-white py-2 px-4 rounded-full shadow-lg border border-[#334155] text-xs font-semibold cursor-pointer hover:border-gold transition-colors duration-300"
          >
            Feedback
          </button>
          
          <AnimatePresence>
            {showFeedback && (
              <motion.form 
                onSubmit={handleFeedbackSubmit}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-10 left-0 bg-bg-white border border-border-color p-4 rounded-2xl shadow-xl w-64 space-y-3"
              >
                <h4 className="text-xs font-bold text-text-dark">Send Feedback to Rivo</h4>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="w-full p-2 border border-border-color rounded-lg text-xs outline-none bg-bg-light text-text-dark h-20 resize-none font-semibold"
                />
                <button 
                  type="submit"
                  className="w-full py-1.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border-none shadow"
                >
                  <Send size={10} /> Submit Feedback
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 lg:left-6 lg:right-auto max-w-sm w-[90%] bg-bg-white border border-border-color p-5 rounded-3xl shadow-2xl z-[10001] flex flex-col gap-4 font-sans text-left"
          >
            <div>
              <h4 className="text-sm font-bold text-text-dark flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" /> Cookie Consent
              </h4>
              <p className="text-[11.5px] text-text-gray font-semibold mt-1 leading-relaxed">
                We use cookies to provide a premium booking experience and smart recommendations powered by Rivo AI.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleAcceptCookies}
                className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow hover:bg-primary-dark"
              >
                Accept All
              </button>
              <button 
                onClick={() => setCookieConsent(true)}
                className="px-4 py-2 border border-border-color text-text-dark rounded-xl text-xs font-bold cursor-pointer bg-transparent hover:bg-slate-100"
              >
                Decline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;