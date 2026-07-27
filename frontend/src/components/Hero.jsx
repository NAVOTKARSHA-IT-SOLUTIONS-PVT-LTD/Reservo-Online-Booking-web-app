import React, { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Users, Search, ArrowRight, Play } from "lucide-react";
import heroImage from "../assets/images/hero.jpg";
import rivoMascot from "../assets/images/rivo_mascot.jpg";

const DESTINATIONS = [
  { name: "Bali", region: "Indonesia" },
  { name: "Maldives", region: "Indian Ocean" },
  { name: "Santorini", region: "Greece" },
  { name: "Swiss Alps", region: "Switzerland" }
];

function Hero() {
  const [destination, setDestination] = useState("Bali, Indonesia");
  const [checkIn, setCheckIn] = useState("2026-09-12");
  const [checkOut, setCheckOut] = useState("2026-09-19");
  
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });

  const [activeField, setActiveField] = useState(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFieldClick = (field) => {
    setActiveField(activeField === field ? null : field);
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const min = type === 'rooms' || type === 'adults' ? 1 : 0;
      let val = prev[type];
      if (operation === 'add') {
        val += 1;
      } else if (operation === 'subtract' && val > min) {
        val -= 1;
      }
      return { ...prev, [type]: val };
    });
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleSearch = () => {
    const modal = document.getElementById("booking-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      modal.style.display = "flex";
      
      const btn = document.getElementById("close-modal-btn");
      if (btn) btn.style.display = "none";
      
      setTimeout(() => {
        const titleEl = modal.querySelector(".modal-title");
        const descEl = modal.querySelector(".modal-desc");
        if (titleEl) titleEl.innerText = "Search Complete!";
        if (descEl) descEl.innerText = `Rivo matched 12 luxury stays in ${destination} for your dates!`;
        if (btn) btn.style.display = "block";
      }, 3000);
    }
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center text-center text-white px-5 pt-[120px] pb-15 md:pt-40 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.3)), url(${heroImage})`,
      }}
    >
      <div className="w-full max-w-[1300px] flex flex-col items-center">
        
        {/* Rivo Speech Bubble */}
        <div className="flex items-center gap-3 bg-bg-white border border-border-color px-5 py-2 rounded-full text-text-dark shadow-[0_10px_35px_rgba(0,0,0,0.15)] mb-7.5 font-semibold text-[14.5px] z-10">
          <img src={rivoMascot} alt="Rivo Avatar" className="w-7.5 h-7.5 rounded-full border border-border-color object-cover" />
          <span>Hi, I'm Rivo! Let's explore your dream luxury stay.</span>
        </div>

        <h1 className="font-bold text-[38px] sm:text-[56px] xl:text-[80px] leading-tight mb-5 text-white [text-shadow:0_5px_20px_rgba(0,0,0,0.3)]">
          Book Smart. <span>Stay <span className="italic font-serif">Better</span>.</span>
        </h1>

        <p className="max-w-[650px] mx-auto mb-8.5 text-base md:text-lg leading-relaxed text-white/92 font-normal">
          AI-powered platform for luxury resorts, boutique hotels, and unforgettable stays.
        </p>

        <div className="flex justify-center gap-5 flex-wrap mb-15 flex-col sm:flex-row items-center w-full sm:w-auto">
          <a href="#resorts" className="bg-primary text-bg-white px-9 py-4 border border-border-color rounded-full text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 hover:bg-gold hover:-translate-y-0.5 w-full sm:w-auto max-w-[280px] justify-center">
            Explore Resorts <ArrowRight size={18} />
          </a>
          <button className="bg-white/85 text-[#111111] px-9 py-4 border-none rounded-full text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 hover:bg-white hover:-translate-y-0.5 w-full sm:w-auto max-w-[280px] justify-center">
            <Play size={16} fill="#111111" /> Watch Demo
          </button>
        </div>

        {/* Floating Smart Booking Widget */}
        <div className="flex justify-center w-full max-w-[1100px] mb-5 relative z-[100]" ref={widgetRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[repeat(4,1fr)_auto] items-center bg-bg-white/85 backdrop-blur-[20px] border border-border-color p-3 lg:p-5 xl:pl-7.5 xl:pr-3 xl:py-3 rounded-[30px] xl:rounded-full gap-3.75 xl:gap-2.5 shadow-custom w-full">
            
            {/* Destination */}
            <div 
              className={`flex items-center gap-3.75 px-3.75 py-2.5 rounded-full cursor-pointer transition-colors duration-200 relative text-left bg-bg-light border border-border-color xl:bg-transparent xl:border-none hover:bg-bg-light active:bg-bg-light ${activeField === 'destination' ? 'bg-bg-light!' : ''}`}
              onClick={() => handleFieldClick('destination')}
            >
              <div className="text-text-dark flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.8px] text-text-gray font-bold">Where to?</span>
                <input 
                  type="text" 
                  className="bg-transparent border-none text-text-dark text-base font-extrabold w-full cursor-pointer pt-0.5 m-0 outline-none placeholder-text-gray" 
                  value={destination} 
                  readOnly 
                  placeholder="Select destination"
                />
              </div>

              {activeField === 'destination' && (
                <div className="absolute top-[calc(100%+15px)] left-0 bg-bg-white border border-border-color rounded-2xl p-3.75 shadow-custom w-full xl:w-[320px] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                  <div className="flex flex-col gap-1.25">
                    {DESTINATIONS.map((dest, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-200 text-text-dark hover:bg-bg-light cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDestination(`${dest.name}, ${dest.region}`);
                          setActiveField(null);
                        }}
                      >
                        <MapPin size={16} className="text-gold" />
                        <div>
                          <strong className="block text-base text-text-dark">{dest.name}</strong>
                          <span className="text-xs text-text-gray">{dest.region}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Check In */}
            <div 
              className={`flex items-center gap-3.75 px-3.75 py-2.5 rounded-full cursor-pointer transition-colors duration-200 relative text-left bg-bg-light border border-border-color xl:bg-transparent xl:border-none hover:bg-bg-light active:bg-bg-light ${activeField === 'checkin' ? 'bg-bg-light!' : ''}`}
              onClick={() => handleFieldClick('checkin')}
            >
              <div className="text-text-dark flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.8px] text-text-gray font-bold">Check In</span>
                <input 
                  type="text" 
                  className="bg-transparent border-none text-text-dark text-base font-extrabold w-full cursor-pointer pt-0.5 m-0 outline-none placeholder-text-gray" 
                  value={formatDateLabel(checkIn)} 
                  readOnly 
                />
              </div>

              {activeField === 'checkin' && (
                <div className="absolute top-[calc(100%+15px)] left-0 bg-bg-white border border-border-color rounded-2xl p-3.75 shadow-custom w-full xl:w-[280px] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]" onClick={(e) => e.stopPropagation()}>
                  <h4 className="text-[13px] m-0 mb-1.25 text-text-gray font-extrabold uppercase tracking-[0.5px]">Select Check-in Date</h4>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)} 
                    className="w-full p-2.5 rounded-lg border border-border-color bg-bg-light text-text-dark text-sm"
                  />
                </div>
              )}
            </div>

            {/* Check Out */}
            <div 
              className={`flex items-center gap-3.75 px-3.75 py-2.5 rounded-full cursor-pointer transition-colors duration-200 relative text-left bg-bg-light border border-border-color xl:bg-transparent xl:border-none hover:bg-bg-light active:bg-bg-light ${activeField === 'checkout' ? 'bg-bg-light!' : ''}`}
              onClick={() => handleFieldClick('checkout')}
            >
              <div className="text-text-dark flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.8px] text-text-gray font-bold">Check Out</span>
                <input 
                  type="text" 
                  className="bg-transparent border-none text-text-dark text-base font-extrabold w-full cursor-pointer pt-0.5 m-0 outline-none placeholder-text-gray" 
                  value={formatDateLabel(checkOut)} 
                  readOnly 
                />
              </div>

              {activeField === 'checkout' && (
                <div className="absolute top-[calc(100%+15px)] left-0 bg-bg-white border border-border-color rounded-2xl p-3.75 shadow-custom w-full xl:w-[280px] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]" onClick={(e) => e.stopPropagation()}>
                  <h4 className="text-[13px] m-0 mb-1.25 text-text-gray font-extrabold uppercase tracking-[0.5px]">Select Check-out Date</h4>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)} 
                    className="w-full p-2.5 rounded-lg border border-border-color bg-bg-light text-text-dark text-sm"
                  />
                </div>
              )}
            </div>

            {/* Guests */}
            <div 
              className={`flex items-center gap-3.75 px-3.75 py-2.5 rounded-full cursor-pointer transition-colors duration-200 relative text-left bg-bg-light border border-border-color xl:bg-transparent xl:border-none hover:bg-bg-light active:bg-bg-light ${activeField === 'guests' ? 'bg-bg-light!' : ''}`}
              onClick={() => handleFieldClick('guests')}
            >
              <div className="text-text-dark flex items-center justify-center">
                <Users size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.8px] text-text-gray font-bold">Guests & Rooms</span>
                <input 
                  type="text" 
                  className="bg-transparent border-none text-text-dark text-base font-extrabold w-full cursor-pointer pt-0.5 m-0 outline-none placeholder-text-gray" 
                  value={`${guests.adults + guests.children} Guests, ${guests.rooms} Room`} 
                  readOnly 
                />
              </div>

              {activeField === 'guests' && (
                <div className="absolute top-[calc(100%+15px)] left-0 bg-bg-white border border-border-color rounded-2xl p-5 shadow-custom w-full xl:w-[320px] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center py-2.5 border-b border-border-color">
                    <div>
                      <strong className="block text-base text-text-dark">Adults</strong>
                      <span className="text-xs text-text-gray">Age 13+</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="bg-bg-light text-text-dark w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold border border-border-color transition-colors duration-200 hover:bg-primary hover:text-bg-white hover:border-primary" onClick={() => handleGuestChange('adults', 'subtract')}>-</button>
                      <span className="text-base font-bold min-w-[15px] text-center text-text-dark">{guests.adults}</span>
                      <button className="bg-bg-light text-text-dark w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold border border-border-color transition-colors duration-200 hover:bg-primary hover:text-bg-white hover:border-primary" onClick={() => handleGuestChange('adults', 'add')}>+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-border-color">
                    <div>
                      <strong className="block text-base text-text-dark">Children</strong>
                      <span className="text-xs text-text-gray">Ages 2-12</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="bg-bg-light text-text-dark w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold border border-border-color transition-colors duration-200 hover:bg-primary hover:text-bg-white hover:border-primary" onClick={() => handleGuestChange('children', 'subtract')}>-</button>
                      <span className="text-base font-bold min-w-[15px] text-center text-text-dark">{guests.children}</span>
                      <button className="bg-bg-light text-text-dark w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold border border-border-color transition-colors duration-200 hover:bg-primary hover:text-bg-white hover:border-primary" onClick={() => handleGuestChange('children', 'add')}>+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <div>
                      <strong className="block text-base text-text-dark">Rooms</strong>
                      <span className="text-xs text-text-gray">Number of rooms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="bg-bg-light text-text-dark w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold border border-border-color transition-colors duration-200 hover:bg-primary hover:text-bg-white hover:border-primary" onClick={() => handleGuestChange('rooms', 'subtract')}>-</button>
                      <span className="text-base font-bold min-w-[15px] text-center text-text-dark">{guests.rooms}</span>
                      <button className="bg-bg-light text-text-dark w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold border border-border-color transition-colors duration-200 hover:bg-primary hover:text-bg-white hover:border-primary" onClick={() => handleGuestChange('rooms', 'add')}>+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="bg-gold text-white border-none h-[54px] px-7.5 rounded-[12px] xl:rounded-full cursor-pointer flex items-center justify-center gap-2 font-semibold text-[14.5px] transition-all duration-300 hover:bg-gold-dark hover:-translate-y-px col-span-1 lg:col-span-2 xl:col-span-1 w-full" onClick={handleSearch} aria-label="Search Stays">
              <Search size={18} />
              <span>Search Stays</span>
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;