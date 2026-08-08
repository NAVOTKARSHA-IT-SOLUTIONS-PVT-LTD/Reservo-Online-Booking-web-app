import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight,
  Play,
  Sparkles,
  Star,
  ShieldCheck,
  Wand2,
  Sun,
  IndianRupee,
  ArrowDown,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/images/hero.png";
import SearchLoadingOverlay from "./SearchLoadingOverlay";

function Hero() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  
  // Search state
  const [location, setLocation] = useState("Bali, Indonesia");
  const [checkIn, setCheckIn] = useState("12 Sep, 2026");
  const [checkOut, setCheckOut] = useState("19 Sep, 2026");
  const [guests, setGuests] = useState("2 Guests, 1 Room");

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const handleSearchComplete = () => {
    setIsSearching(false);
    navigate("/search", { state: { location, checkIn, checkOut, guests } });
  };

  const scrollToExplore = () => {
    const el = document.getElementById("explore");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] md:h-screen flex flex-col items-center justify-center pt-16 md:pt-24 pb-12 md:pb-16 overflow-hidden">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster={heroImage}
          className="w-full h-full object-cover filter brightness-[0.75]"
        >
          <source 
            src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0b3d87db1c360be1c43ab87a070eb35&profile_id=139&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        {/* Adjusted overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/55"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-12 mt-4 md:mt-10">
        
        {/* Left Content Area */}
        <div className="flex-1 max-w-[600px] text-white">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-md mb-6 shadow-lg">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[11px] font-bold uppercase tracking-[1px] text-white/90">AI-POWERED TRAVEL PLANNER</span>
          </div>

          {/* Title */}
          <h1 className="font-extrabold text-[36px] sm:text-[56px] lg:text-[70px] leading-[1.05] mb-6 font-serif tracking-tight drop-shadow-xl">
            Book Smart.<br />
            Stay <span className="italic text-[#2F80ED] font-serif">Better.</span>
          </h1>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-12">
            <button 
              onClick={() => navigate("/ai-planner")}
              className="w-full sm:w-auto bg-[#1B5CF8] text-white px-6 py-3.5 rounded-full text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 hover:bg-[#1549d4] transition-all shadow-[0_10px_25px_rgba(27,92,248,0.4)]"
            >
              <Sparkles size={18} /> Launch Rivo AI Planner
            </button>
            <button 
              onClick={scrollToExplore}
              className="w-full sm:w-auto bg-black/30 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-full text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-black/50 transition-all shadow-lg"
            >
              Explore Resorts <ArrowRight size={18} />
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&h=32&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-transparent object-cover" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=32&h=32&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-transparent object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-transparent object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white leading-tight">10,000+</span>
                <span className="text-[11px] text-white/70">Happy Travelers</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Star size={14} className="fill-current text-teal-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white leading-tight">4.9/5</span>
                <span className="text-[11px] text-white/70">12K+ Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <ShieldCheck size={14} className="text-teal-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white leading-tight">Best Price</span>
                <span className="text-[11px] text-white/70">Guaranteed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Content - AI Planner Glass Card */}
        <div className="hidden lg:block w-[350px]">
          <div className="bg-bg-white/70 backdrop-blur-2xl border border-border-color/60 rounded-[32px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-colors duration-300">
            
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-[18px] font-extrabold text-text-dark transition-colors duration-300">AI Trip Planner</h2>
            </div>
            <p className="text-[12px] text-text-gray font-medium mb-6 transition-colors duration-300">We'll plan your perfect trip tailored for you</p>

            <div className="flex flex-col gap-5 mb-6">
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0 border border-yellow-500/20">
                  <Sun size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-text-dark transition-colors duration-300">Best Time to Visit</span>
                  <span className="text-[12px] text-text-gray transition-colors duration-300">Apr - Jun • 28°C - 32°C</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 border border-green-500/20">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-text-dark transition-colors duration-300">Trending Destination</span>
                  <span className="text-[12px] text-text-gray transition-colors duration-300">Bali, Indonesia</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <IndianRupee size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-text-dark transition-colors duration-300">Average Price</span>
                  <span className="text-[12px] text-text-gray transition-colors duration-300">₹12,999 / Night</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate("/ai-planner")}
              className="w-full bg-bg-white border border-border-color text-primary py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 hover:border-primary hover:text-primary-dark transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Wand2 size={16} /> Plan My Trip
            </button>

          </div>
        </div>

      </div>


      {/* Floating Bottom Search Bar */}
      <div className="w-[95%] mx-auto relative md:absolute md:bottom-6 left-0 md:left-1/2 translate-x-0 md:-translate-x-1/2 max-w-[1100px] bg-bg-white/95 backdrop-blur-xl rounded-3xl md:rounded-[100px] p-4 md:p-3 mt-8 md:mt-0 shadow-[0_30px_60px_rgba(47,128,237,0.15)] flex flex-col md:flex-row items-center justify-between border border-border-color transition-colors duration-300 z-20">
        
        <div className="flex-1 flex flex-col md:flex-row items-center w-full divide-y md:divide-y-0 md:divide-x divide-border-color">
          
          {/* Location */}
          <div className="flex-1 flex items-center gap-3 px-6 py-2 md:py-0 w-full cursor-pointer group">
            <MapPin size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full text-left">
              <label htmlFor="search-location" className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Where to?</label>
              <input 
                id="search-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-[15px] font-bold text-text-dark bg-transparent border-none outline-none p-0 cursor-pointer transition-colors duration-300"
              />
              <span className="text-[12px] text-gray-400">All Destinations <ChevronDown size={12} className="inline" /></span>
            </div>
          </div>

          {/* Check In */}
          <div className="flex-1 flex items-center gap-3 px-6 py-2 md:py-0 w-full cursor-pointer group">
            <Calendar size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full text-left">
              <label htmlFor="search-checkin" className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Check In</label>
              <input 
                id="search-checkin"
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-[15px] font-bold text-text-dark bg-transparent border-none outline-none p-0 cursor-pointer transition-colors duration-300"
              />
              <span className="text-[12px] text-gray-400">Friday</span>
            </div>
          </div>

          {/* Check Out */}
          <div className="flex-1 flex items-center gap-3 px-6 py-2 md:py-0 w-full cursor-pointer group">
            <Calendar size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full text-left">
              <label htmlFor="search-checkout" className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Check Out</label>
              <input 
                id="search-checkout"
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-[15px] font-bold text-text-dark bg-transparent border-none outline-none p-0 cursor-pointer transition-colors duration-300"
              />
              <span className="text-[12px] text-gray-400">Friday</span>
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 flex items-center gap-3 px-6 py-2 md:py-0 w-full cursor-pointer group">
            <Users size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full text-left">
              <label htmlFor="search-guests" className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Guests & Rooms</label>
              <input 
                id="search-guests"
                type="text"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full text-[15px] font-bold text-text-dark bg-transparent border-none outline-none p-0 cursor-pointer transition-colors duration-300"
              />
              <span className="text-[12px] text-gray-400">Rooms <ChevronDown size={12} className="inline" /></span>
            </div>
          </div>

        </div>

        <button 
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl md:rounded-full font-bold text-[14px] flex items-center justify-center gap-2 border-none cursor-pointer transition-all shadow-[0_5px_15px_rgba(27,92,248,0.3)] shrink-0 ml-0 md:ml-2 mt-4 md:mt-0"
        >
          <Search size={18} /> Search Stays
        </button>
      </div>

      {/* Scroll Down Indicator */}
      <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 animate-bounce cursor-pointer" onClick={scrollToExplore}>
        <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center">
          <ArrowDown size={14} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold tracking-widest uppercase">Scroll to explore</span>
      </div>

      {isSearching && (
        <SearchLoadingOverlay destination={location} onComplete={handleSearchComplete} />
      )}
    </section>
  );
}

export default Hero;