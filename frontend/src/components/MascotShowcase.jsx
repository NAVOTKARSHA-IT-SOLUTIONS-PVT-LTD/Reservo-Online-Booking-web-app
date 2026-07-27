import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

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
    <section className="py-20 bg-bg-light transition-colors duration-300 overflow-hidden" id="meet-rivo">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-15">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">MEET RIVO</span>
          <h2 className="text-[28px] sm:text-[32px] md:text-[38px] xl:text-[46px] font-bold text-center text-primary mb-4.5">Your Luxury Travel Buddy</h2>
          <p className="max-w-[720px] mx-auto mb-15 text-center text-text-gray text-base md:text-lg leading-relaxed">
            Rivo is here to make your travel planning easy, smart, and unforgettable. Click the interactive tabs to see Rivo in action!
          </p>
        </div>

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12.5 items-center">
          
          {/* Left Column: Mascot profile details */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex gap-2.5 mb-5">
              <span className="text-[11px] font-bold text-gold bg-gold/10 px-3 py-1.25 rounded-xl uppercase tracking-wide">#Explorer</span>
              <span className="text-[11px] font-bold text-gold bg-gold/10 px-3 py-1.25 rounded-xl uppercase tracking-wide">#AICompanion</span>
              <span className="text-[11px] font-bold text-gold bg-gold/10 px-3 py-1.25 rounded-xl uppercase tracking-wide">#TravelBuddy</span>
            </div>

            <h3 className="text-[32px] text-text-dark font-extrabold mb-3.5 leading-tight">Interactive Assistant Showcase</h3>
            <p className="text-[15px] leading-relaxed text-text-gray mb-8.5 max-w-[520px] mx-auto lg:mx-0">
              Reservo is powered by Rivo, an elite companion designed to take the friction out of luxury hospitality. From custom itineraries to live key handovers, Rivo manages it all.
            </p>

            {/* Vertical Tab Selectors */}
            <div className="flex flex-col gap-3 w-full max-w-[440px] mx-auto lg:mx-0">
              {SHOWCASE_TABS.map(tab => {
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`flex justify-between items-center px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 ease-out text-left shadow-custom border hover:border-gold hover:translate-x-1 group ${
                      isActive 
                        ? "bg-primary border-primary" 
                        : "bg-bg-white border-border-color"
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <span className={`text-[15px] font-semibold transition-colors duration-300 ${
                      isActive ? "text-bg-white" : "text-text-dark"
                    }`}>{tab.label}</span>
                    <ArrowRight size={14} className={`transition-all duration-300 ease-out ${
                      isActive 
                        ? "text-bg-white opacity-100 translate-x-0" 
                        : "text-text-gray opacity-0 -translate-x-1.25 group-hover:opacity-100 group-hover:translate-x-0"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Display Area with active Mascot image */}
          <div className="flex justify-center w-full">
            <div className="bg-bg-white border border-border-color rounded-[28px] p-10 w-full max-w-[440px] shadow-custom relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.25">
              {/* Highlight Badge */}
              <span className="absolute top-6 left-6 bg-gold text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center shadow-[0_4px_10px_rgba(197,160,89,0.2)]">
                <Sparkles size={12} className="mr-1" /> {activeTab.badge}
              </span>

              {/* Image Frame */}
              <div className="w-[220px] h-[220px] rounded-full overflow-hidden border-4 border-border-color mt-5 mb-7.5 shadow-custom bg-bg-light">
                <img 
                  src={activeTab.image} 
                  alt={`Rivo ${activeTabId}`}
                  className="w-full h-full object-cover animate-bounce-rivo"
                />
              </div>

              {/* Caption details */}
              <div className="display-caption">
                <h4 className="text-2xl font-extrabold text-text-dark mb-2.5">{activeTab.heading}</h4>
                <p className="text-sm text-text-gray leading-relaxed m-0">{activeTab.desc}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default MascotShowcase;
