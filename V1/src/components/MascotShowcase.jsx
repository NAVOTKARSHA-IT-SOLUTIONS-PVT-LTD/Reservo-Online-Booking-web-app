import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import "./MascotShowcase.css";

// Import all Rivo mascot images
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import rivoSearching from "../assets/images/rivo_searching.png";
import rivoConfirmed from "../assets/images/rivo_confirmed.png";
import rivoPlanner from "../assets/images/rivo_planner.png";
import rivoSupport from "../assets/images/rivo_support.png";

const SHOWCASE_TABS = [
  {
    id: "welcome",
    label: "1. Welcome",
    image: rivoMascot,
    heading: "Rivo welcomes you!",
    desc: "Rivo greets you to Reservo with a warm polar wave and makes you feel right at home at any premium resort.",
    badge: "Friendly Guide"
  },
  {
    id: "search",
    label: "2. Search",
    image: rivoSearching,
    heading: "Live Availability Matching",
    desc: "Rivo matches live luxury inventories globally to find you the best matching stays in milliseconds.",
    badge: "Smart Match"
  },
  {
    id: "book",
    label: "3. Book Suite",
    image: rivoConfirmed,
    heading: "Instant Secure Payments",
    desc: "Rivo makes booking fast, secure, and hassle-free, delivering your confirmation details and digital keys instantly.",
    badge: "Verified Booking"
  },
  {
    id: "plan",
    label: "4. Trip Plan",
    image: rivoPlanner,
    heading: "Tailored AI Itineraries",
    desc: "Rivo details daily itineraries tailored to your specific mood (Relaxed, Adventurous, Romantic, or Cultural).",
    badge: "Bespoke Plans"
  },
  {
    id: "support",
    label: "5. Live Support",
    image: rivoSupport,
    heading: "24/7 Concierge Service",
    desc: "Rivo is wearing a headset and stays connected around the clock to support booking adjustments, dining reservations, or local guides.",
    badge: "Active Care"
  }
];

function MascotShowcase() {
  const [activeTabId, setActiveTabId] = useState("welcome");

  const activeTab = SHOWCASE_TABS.find(tab => tab.id === activeTabId) || SHOWCASE_TABS[0];

  return (
    <section className="mascot-showcase" id="meet-rivo">
      <div className="container">
        
        {/* Section Header */}
        <div className="showcase-header">
          <span className="section-tag">MEET RIVO</span>
          <h2 className="section-title">Your Luxury Travel Buddy</h2>
          <p className="section-subtitle">
            Rivo is here to make your travel planning easy, smart, and unforgettable. Click the interactive tabs to see Rivo in action!
          </p>
        </div>

        {/* Split Screen Grid */}
        <div className="showcase-grid">
          
          {/* Left Column: Mascot profile details */}
          <div className="showcase-profile">
            <div className="showcase-pills">
              <span className="showcase-pill">#Explorer</span>
              <span className="showcase-pill">#AICompanion</span>
              <span className="showcase-pill">#TravelBuddy</span>
            </div>

            <h3 className="profile-h3">Interactive Assistant Showcase</h3>
            <p className="profile-text">
              Reservo is powered by Rivo, an elite companion designed to take the friction out of luxury hospitality. From custom itineraries to live key handovers, Rivo manages it all.
            </p>

            {/* Vertical Tab Selectors */}
            <div className="showcase-tabs-list">
              {SHOWCASE_TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`showcase-tab-btn ${activeTabId === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span className="tab-btn-lbl">{tab.label}</span>
                  <ArrowRight size={14} className="tab-arrow" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Display Area with active Mascot image */}
          <div className="showcase-display-area">
            <div className="display-panel glass-panel">
              {/* Highlight Badge */}
              <span className="display-badge">
                <Sparkles size={12} style={{ marginRight: 5 }} /> {activeTab.badge}
              </span>

              {/* Image Frame */}
              <div className="mascot-image-frame">
                <img 
                  src={activeTab.image} 
                  alt={`Rivo ${activeTabId}`}
                  className="mascot-showcase-img"
                />
              </div>

              {/* Caption details */}
              <div className="display-caption">
                <h4>{activeTab.heading}</h4>
                <p>{activeTab.desc}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default MascotShowcase;
