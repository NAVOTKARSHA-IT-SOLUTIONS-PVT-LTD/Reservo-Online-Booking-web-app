import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Mascot from "./components/Mascot";
import Preloader from "./components/Preloader";
import MobileUI from "./components/MobileUI";

import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import MascotShowcase from "./components/MascotShowcase";

import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import { Careers, Terms, HelpCenter, Support } from "./pages/DummyPages";

import SearchResults from "./pages/SearchResults";
import Experiences from "./pages/Experiences";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

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

function App() {
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

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const location = useLocation();

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
  const isSearchPage = location.pathname === "/search";
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

  const closeModal = () => {
    const modal = document.getElementById("booking-modal");
    if (modal) {
      modal.style.display = "none";
      // Reset modal image back to default search mascot when closed
      const loaderImg = modal.querySelector(".ai-loader img");
      if (loaderImg) {
        loaderImg.src = rivoMascot;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Preloader Screen */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Custom reactive cursor */}
      <CustomCursor />

      {isMobile ? (
        <MobileUI isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} wishlist={wishlist}>
          <Routes>
            <Route path="/" element={<Home wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/about" element={<About />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/support" element={<Support />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileUI>
      ) : (
        <div className="flex flex-col flex-1">
          {!isSearchPage && <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} wishlist={wishlist} />}

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
              <Route path="/about" element={<About />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/support" element={<Support />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Floating Mascot Widget */}
          <Mascot />

          {/* Footer */}
          {!isSearchPage && !isResortOrExperience && <Footer />}
        </div>
      )}

      {/* Booking Confirmation / Search Feedback Modal */}
      <div id="booking-modal" className="fixed inset-0 bg-black/45 backdrop-blur-[10px] z-[3000] hidden items-center justify-center p-5" aria-hidden="true" role="dialog">
        <div className="bg-bg-white border border-border-color p-10 rounded-3xl max-w-[480px] w-full shadow-[0_30px_60px_rgba(0,0,0,0.2)] flex flex-col items-center text-center">
          <h3 className="modal-title text-2xl font-bold text-text-dark mb-2.5">Checking Availability...</h3>
          <p className="modal-desc text-[14.5px] text-text-gray leading-relaxed mb-6.25">Rivo is search-matching live luxury inventories across our global verified partners...</p>
          <div className="flex flex-col items-center py-4 gap-6">
            <div className="relative w-22 h-22">
              <img 
                src={rivoMascot} 
                alt="Rivo searching" 
                className="w-full h-full rounded-full border-3 border-border-color animate-bounce-rivo"
              />
              <div className="absolute -inset-2 border-2 border-gold rounded-full animate-pulse-rivo pointer-events-none z-[-1]"></div>
            </div>
          </div>
          <button 
            id="close-modal-btn" 
            className="bg-primary text-bg-white px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-gold mt-4 border border-border-color" 
            style={{ display: "none" }}
            onClick={closeModal}
          >
            Close Window
          </button>
        </div>
      </div>

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