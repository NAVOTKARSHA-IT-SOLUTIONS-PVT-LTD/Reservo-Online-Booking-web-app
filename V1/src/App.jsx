import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Mascot from "./components/Mascot";

import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import FeaturedResorts from "./components/FeaturedResorts";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Newsletter from "./components/Newsletter";

import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import rivoMascot from "./assets/images/rivo_mascot.jpg";

function Home() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <FeaturedResorts />
      <Services />
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
    if (modal) modal.style.display = "none";
  };

  return (
    <div className="app">
      {/* Custom reactive cursor */}
      <CustomCursor />

      {/* Global Navigation Header */}
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Floating Mascot Widget */}
      <Mascot />

      {/* Footer */}
      <Footer />

      {/* Booking Confirmation / Search Feedback Modal */}
      <div id="booking-modal" className="modal-overlay" aria-hidden="true" role="dialog">
        <div className="modal-content glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h3 className="modal-title">Checking Availability...</h3>
          <p className="modal-desc">Rivo is search-matching live luxury inventories across our global verified partners...</p>
          <div className="ai-loader" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem 0", gap: "1.5rem" }}>
            <div style={{ position: "relative", width: "5.5rem", height: "5.5rem" }}>
              <img 
                src={rivoMascot} 
                alt="Rivo searching" 
                style={{ width: "100%", height: "100%", borderRadius: "50%", border: "3px solid #e5e5e7", animation: "bounceRivo 2s infinite" }}
              />
              <div className="ai-pulse-circle" style={{ position: "absolute", inset: "-8px", zIndex: -1 }}></div>
            </div>
          </div>
          <button 
            id="close-modal-btn" 
            className="book-btn" 
            style={{ marginTop: "1rem", display: "none" }}
            onClick={closeModal}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;