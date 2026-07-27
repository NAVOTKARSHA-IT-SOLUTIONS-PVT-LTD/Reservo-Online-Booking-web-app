import React, { useState } from "react";
import { Compass, Calendar, Clock, MapPin, Award, ArrowRight } from "lucide-react";
import "./Experiences.css";
import rivoSearching from "../assets/images/rivo_searching.png";

const EXPERIENCES = [
  {
    id: 1,
    title: "Private Lagoon Sunset Yacht Sailing",
    location: "Maldives",
    duration: "4 Hours",
    price: 450,
    rating: "4.9 (120 reviews)",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80",
    description: "Sail into the deep coral lagoons of the Maldives. Includes a private chef sunset lobster dinner, personalized music selections, and champagne toast on deck.",
    highlights: ["Private chef onboard", "Complimentary champagne", "Snorkeling gear included"],
  },
  {
    id: 2,
    title: "Guided Volcanic Peak Heli-Tour",
    location: "Bali, Indonesia",
    duration: "1.5 Hours",
    price: 620,
    rating: "5.0 (88 reviews)",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    description: "Fly over dense jungle canyons and active volcanic ridges with professional guides. High-resolution drone footage of your flight is captured and provided.",
    highlights: ["Aerial drone footage", "Professional pilot guide", "Private runway access"],
  },
  {
    id: 3,
    title: "Cliffside Private Serenade Dinner",
    location: "Santorini, Greece",
    duration: "3 Hours",
    price: 380,
    rating: "4.9 (150 reviews)",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    description: "Enjoy intimate candlelit dining on private caldera edges with a dedicated personal butler. Includes live violin accompaniment and custom flower walkways.",
    highlights: ["Dedicated butler", "Bespoke flower path", "Live classical violin"],
  },
  {
    id: 4,
    title: "Guided Rainforest Tea Walk & Picnic",
    location: "Coorg, India",
    duration: "5 Hours",
    price: 120,
    rating: "4.8 (95 reviews)",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    description: "Hike along wild rainforest paths and organic tea fields with naturalists. Concludes with an premium local organic picnic next to private canyon waterfalls.",
    highlights: ["Expert naturalist guide", "Organic gourmet lunch", "Private waterfall path"],
  }
];

function Experiences() {
  const [selectedLocation, setSelectedLocation] = useState("All");

  const showGlobalToast = (msg) => {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    if (toast && toastMessage) {
      toastMessage.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3500);
    }
  };

  const bookExperience = (title) => {
    const modal = document.getElementById("booking-modal");
    const closeBtn = document.getElementById("close-modal-btn");
    if (!modal) return;

    modal.querySelector(".modal-title").textContent = "Consulting Rivo...";
    modal.querySelector(".modal-desc").innerHTML = `Booking slot request for <strong>${title}</strong> is being processed across our verified premium operators...`;
    
    // Set matching Rivo mascot
    const loaderImg = modal.querySelector(".ai-loader img");
    if (loaderImg) {
      loaderImg.src = "/src/assets/images/rivo_confirmed.png";
    }

    modal.querySelector(".ai-loader").style.display = "flex";
    if (closeBtn) closeBtn.style.display = "none";
    modal.style.display = "flex";

    setTimeout(() => {
      modal.querySelector(".modal-title").textContent = "Experience Slot Confirmed!";
      modal.querySelector(".modal-desc").innerHTML = `Your private booking for <strong>${title}</strong> is secured. Digital tickets and instructions are sent.`;
      modal.querySelector(".ai-loader").style.display = "none";
      if (closeBtn) closeBtn.style.display = "inline-flex";
      showGlobalToast(`Successfully booked ${title}!`);
    }, 2500);
  };

  const filtered = selectedLocation === "All" 
    ? EXPERIENCES 
    : EXPERIENCES.filter(exp => exp.location.includes(selectedLocation));

  return (
    <div className="experiences-page fade-up">
      {/* Hero Header */}
      <section className="exp-hero">
        <div className="exp-hero-overlay"></div>
        <div className="container exp-hero-content">
          <span className="exp-tag">Experiences Beyond Stays</span>
          <h1>Curated Luxury Adventures</h1>
          <p>Unforgettable tailor-made journeys hosted by certified local naturalists & luxury partners.</p>
        </div>
      </section>

      {/* Grid List */}
      <section className="exp-list-section">
        <div className="container">
          {/* Location Filters */}
          <div className="exp-filters-row">
            <Compass size={18} className="filter-icon" />
            <div className="exp-filters-pills">
              {["All", "Maldives", "Bali", "Santorini", "Coorg"].map(loc => (
                <button
                  key={loc}
                  className={`exp-filter-btn ${selectedLocation === loc ? "active" : ""}`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Stack */}
          <div className="exp-stack">
            {filtered.length > 0 ? (
              filtered.map(exp => (
                <div key={exp.id} className="exp-wide-card">
                  <div className="exp-img-box">
                    <img src={exp.image} alt={exp.title} />
                    <span className="exp-rating"><Award size={12} /> {exp.rating}</span>
                  </div>

                  <div className="exp-content-box">
                    <div className="exp-meta-header">
                      <span className="exp-loc"><MapPin size={12} /> {exp.location}</span>
                      <span className="exp-duration"><Clock size={12} /> {exp.duration}</span>
                    </div>

                    <h2>{exp.title}</h2>
                    <p>{exp.description}</p>

                    <div className="exp-highlights-list">
                      <h4>What's Included:</h4>
                      <ul>
                        {exp.highlights.map((hl, i) => (
                          <li key={i}><ArrowRight size={10} /> {hl}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="exp-footer">
                      <div className="exp-price-box">
                        <span className="exp-price-value">${exp.price}</span>
                        <span className="exp-price-lbl">/ person</span>
                      </div>

                      <button 
                        className="book-exp-btn"
                        onClick={() => bookExperience(exp.title)}
                      >
                        Reserve Slot <Calendar size={14} style={{ marginLeft: 6 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-resorts-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "60px 20px" }}>
                <div style={{ position: "relative", width: "140px", height: "140px", marginBottom: "20px" }}>
                  <img 
                    src={rivoSearching} 
                    alt="Rivo searching experiences" 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", border: "3px solid var(--border-color)", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, right: "5px", width: "36px", height: "36px",
                    background: "var(--gold)", color: "white", borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800",
                    border: "3px solid var(--bg-white)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}>?</div>
                </div>
                <h3>No Luxury Experiences Found</h3>
                <p style={{ fontSize: "14.5px", color: "var(--text-gray)", maxWidth: "400px", margin: "8px auto 0 auto", textAlign: "center", lineHeight: "1.6" }}>
                  Try selecting a different destination filter from the menu.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Experiences;
