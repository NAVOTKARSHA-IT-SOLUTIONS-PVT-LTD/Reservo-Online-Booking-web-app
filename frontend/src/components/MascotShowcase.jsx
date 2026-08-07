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
    desc: "Rivo makes booking fast, secure, and hassle-free, delivering your confirmation details instantly.",
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
    desc: "Rivo is wearing a headset and stays connected around the clock to support booking adjustments.",
    badge: "Active Care"
  }
];

function MascotShowcase() {
  const [activeTabId, setActiveTabId] = useState("welcome");

  const activeTab = SHOWCASE_TABS.find(tab => tab.id === activeTabId) || SHOWCASE_TABS[0];

  return (
    <section className="py-12 bg-bg-light transition-colors duration-300 overflow-hidden" id="mascot-showcase">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-2">MEET RIVO</span>
          <h2 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-center text-primary mb-2">Your AI Travel Companion</h2>
          <p className="max-w-[720px] mx-auto mb-4 text-center text-text-gray text-[14px] leading-relaxed">
            Rivo is your personal travel concierge, powered by AI to seamlessly curate and manage every aspect of your trip.
          </p>
        </div>

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-center">
          
          {/* Left Column: Mascot profile details */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h3 className="text-[24px] text-text-dark font-extrabold mb-2 leading-tight">Always at your service</h3>
            <p className="text-[13.5px] leading-relaxed text-text-gray mb-4 max-w-[520px] mx-auto lg:mx-0">
              From crafting bespoke itineraries to live key handovers, Rivo takes the friction out of luxury hospitality.
            </p>

            {/* Vertical Tab Selectors */}
            <div className="flex flex-col gap-2 w-full max-w-[440px] mx-auto lg:mx-0">
              {SHOWCASE_TABS.map(tab => {
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`flex justify-between items-center px-5 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out text-left shadow-custom border hover:border-gold hover:translate-x-1 group ${
                      isActive 
                        ? "bg-primary border-primary" 
                        : "bg-bg-white border-border-color"
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <span className={`text-[13.5px] font-semibold transition-colors duration-300 ${
                      isActive ? "text-bg-white" : "text-text-dark"
                    }`}>{tab.label}</span>
                    <ArrowRight size={14} className={`transition-all duration-300 ease-out ${
                      isActive 
                        ? "text-bg-white opacity-100 translate-x-0" 
                        : "text-text-gray opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Display Area with active Mascot image */}
          <div className="flex justify-center w-full">
            <div className="bg-gradient-to-br from-sky-50/80 via-bg-white to-[#2563eb]/5 border border-sky-100 dark:border-slate-800/80 dark:from-slate-900/90 dark:via-[#111A2E]/90 dark:to-sky-950/40 rounded-[32px] p-6 w-full max-w-[400px] shadow-custom relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20">
              {/* Highlight Badge */}
              <span className="absolute top-4 left-4 bg-gold text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center shadow-[0_4px_10px_rgba(197,160,89,0.2)]">
                <Sparkles size={10} className="mr-1" /> {activeTab.badge}
              </span>

              {/* Image Frame */}
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-sky-200/50 dark:border-slate-700/80 mt-4 mb-6 shadow-lg bg-gradient-to-tr from-sky-100 to-sky-50/20 dark:from-slate-800 dark:to-sky-900/30">
                <img 
                  src={activeTab.image} 
                  alt={`Rivo ${activeTabId}`}
                  className="w-full h-full object-cover animate-bounce-rivo"
                />
              </div>

              {/* Caption details */}
              <div className="display-caption">
                <h4 className="text-xl font-extrabold text-text-dark mb-1.5">{activeTab.heading}</h4>
                <p className="text-[13px] text-text-gray leading-relaxed m-0">{activeTab.desc}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default MascotShowcase;
