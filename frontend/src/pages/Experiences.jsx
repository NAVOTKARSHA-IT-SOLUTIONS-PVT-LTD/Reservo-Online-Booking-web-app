import React, { useState } from "react";
import { Compass, Calendar, Clock, MapPin, Award, ArrowRight } from "lucide-react";
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
    <div className="pt-20 bg-bg-light min-h-screen fade-up">
      {/* Hero Header */}
      <section className="relative h-[380px] bg-[url('https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center flex items-center text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#121e1b]/40 to-[#121e1b]/80 z-10"></div>
        <div className="relative z-20 w-[90%] max-w-[1300px] mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-3 block">Experiences Beyond Stays</span>
          <h1 className="text-[38px] md:text-5xl font-bold mb-3.75 text-white">Curated Luxury Adventures</h1>
          <p className="text-base max-w-[600px] mx-auto opacity-90 leading-relaxed">Unforgettable tailor-made journeys hosted by certified local naturalists & luxury partners.</p>
        </div>
      </section>

      {/* Grid List */}
      <section className="py-12.5 pb-25">
        <div className="w-[90%] max-w-[1300px] mx-auto">
          {/* Location Filters */}
          <div className="flex items-center gap-3.75 bg-bg-white border border-border-color px-6.25 py-3.75 rounded-full mb-10 shadow-custom">
            <Compass size={18} className="text-gold shrink-0" />
            <div className="flex gap-2.5 overflow-x-auto">
              {["All", "Maldives", "Bali", "Santorini", "Coorg"].map(loc => {
                const isActive = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    className={`bg-transparent border-none text-text-gray px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-bg-light hover:text-text-dark ${
                      isActive ? "bg-bg-light! text-text-dark!" : ""
                    }`}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Stack */}
          <div className="flex flex-col gap-10">
            {filtered.length > 0 ? (
              filtered.map(exp => (
                <div key={exp.id} className="flex flex-col lg:flex-row bg-bg-white border border-border-color rounded-3xl overflow-hidden shadow-custom transition-all duration-400 ease-out hover:-translate-y-1.25 hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
                  <div className="relative w-full lg:w-[40%] h-[250px] lg:h-auto lg:min-h-[350px] shrink-0">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3.75 left-3.75 bg-[#121e1b]/85 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.25 backdrop-blur-[4px]"><Award size={12} /> {exp.rating}</span>
                  </div>

                  <div className="p-6.25 lg:p-8.75 w-full lg:w-[60%] flex flex-col">
                    <div className="flex gap-5 text-[13px] text-text-gray mb-3">
                      <span className="flex items-center gap-1.25 font-semibold"><MapPin size={12} className="text-gold" /> {exp.location}</span>
                      <span className="flex items-center gap-1.25 font-semibold"><Clock size={12} className="text-gold" /> {exp.duration}</span>
                    </div>

                    <h2 className="text-[26px] font-extrabold text-text-dark mb-3.75 leading-snug">{exp.title}</h2>
                    <p className="text-[14.5px] text-text-gray leading-relaxed mb-6.25">{exp.description}</p>

                    <div className="mb-7.5">
                      <h4 className="text-xs uppercase tracking-wider text-text-dark mb-2.5 font-bold">What's Included:</h4>
                      <ul className="list-none grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {exp.highlights.map((hl, i) => (
                          <li key={i} className="text-xs text-text-gray flex items-center gap-1.5 font-medium"><ArrowRight size={10} className="text-gold" /> {hl}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center border-t border-border-color pt-5 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-text-dark">${exp.price}</span>
                        <span className="text-[11px] text-text-gray">/ person</span>
                      </div>

                      <button 
                        className="bg-primary text-bg-white border-none px-7 py-3 rounded-lg text-sm font-semibold cursor-pointer flex items-center transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-0.5"
                        onClick={() => bookExperience(exp.title)}
                      >
                        Reserve Slot <Calendar size={14} style={{ marginLeft: 6 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-15 px-5 flex flex-col items-center text-text-gray">
                <div className="relative w-140 h-140 mb-5 w-[140px] h-[140px]">
                  <img 
                    src={rivoSearching} 
                    alt="Rivo searching experiences" 
                    className="w-full h-full rounded-full border-3 border-border-color object-cover"
                  />
                  <div className="absolute bottom-0 right-1.25 w-9 h-9 bg-gold text-white rounded-full flex items-center justify-center text-lg font-extrabold border-3 border-bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">?</div>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-2">No Luxury Experiences Found</h3>
                <p className="text-[14.5px] text-text-gray max-w-[400px] mx-auto text-center leading-relaxed">
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
