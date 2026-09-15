import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, PhoneCall, ArrowLeft } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80&fm=webp";

function NotFound() {
  return (
    <section 
      className="min-h-screen flex justify-center items-center text-center px-5 py-24 bg-cover bg-center text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(18,30,27,0.85), rgba(18,30,27,0.92)), url(${heroImage})`
      }}
    >
      <div className="w-[92%] max-w-[850px] mx-auto z-10 flex flex-col items-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2.5px] text-[#C2A878] bg-[#C2A878]/10 border border-[#C2A878]/30 px-4 py-1.5 rounded-full mb-4">
          Reservo • Error 404
        </span>

        <h1 className="text-7xl sm:text-9xl font-black text-[#C2A878] tracking-tight mb-2 leading-none font-serif">
          404
        </h1>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 font-serif">
          This Destination is Off the Map
        </h2>

        <p className="max-w-[580px] mx-auto text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
          The sanctuary or suite you are searching for might have been archived, relocated, or the link has expired. Let us guide you back to serenity.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <Link 
            to="/" 
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C2A878] hover:bg-[#B39665] text-[#121e1b] rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home size={16} /> Explore Stays
          </Link>

          <Link 
            to="/contact" 
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <PhoneCall size={16} /> Contact Support
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-10">
          Need immediate assistance? Our 24/7 concierge is standing by.
        </p>
      </div>
    </section>
  );
}

export default NotFound;