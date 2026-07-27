import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Mascot from "./components/Mascot";

import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Newsletter from "./components/Newsletter";
import MascotShowcase from "./components/MascotShowcase";

import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Resorts from "./pages/Resorts";
import Experiences from "./pages/Experiences";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

import rivoMascot from "./assets/images/rivo_mascot.jpg";

function Home() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <MascotShowcase />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}

function App() {
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
      {/* Custom reactive cursor */}
      <CustomCursor />

      {/* Global Navigation Header */}
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resorts" element={<Resorts />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Floating Mascot Widget */}
      <Mascot />

      {/* Footer */}
      <Footer />

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