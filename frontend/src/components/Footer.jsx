import React from "react";
import { Link } from "react-router-dom";
import { Globe, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-20 border-t border-white/5" id="footer">
      <div className="w-[90%] max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 md:gap-15 pb-12.5">
        
        {/* Company Column */}
        <div className="flex flex-col">
          <h2 className="text-[34px] font-bold text-white mb-5">
            Reserv<span className="text-gold">o</span>
          </h2>
          <p className="text-white/70 leading-relaxed mb-6 max-w-[350px] text-sm">
            Discover India's finest luxury resorts, boutique stays, and unforgettable travel experiences. Your perfect vacation starts with Reservo.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full flex justify-center items-center bg-white/5 text-white/80 transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-0.75" aria-label="Website"><Globe size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full flex justify-center items-center bg-white/5 text-white/80 transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-0.75" aria-label="Facebook"><FaFacebookF size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full flex justify-center items-center bg-white/5 text-white/80 transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-0.75" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full flex justify-center items-center bg-white/5 text-white/80 transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-0.75" aria-label="Youtube"><FaYoutube size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
          <ul className="list-none p-0 m-0">
            <li className="mb-3"><Link to="/" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Home</Link></li>
            <li className="mb-3"><Link to="/" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Destinations</Link></li>
            <li className="mb-3"><Link to="/" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Resorts</Link></li>
            <li className="mb-3"><Link to="/about" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">About Us</Link></li>
            <li className="mb-3"><Link to="/contact" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Contact</Link></li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-white">Our Services</h3>
          <ul className="list-none p-0 m-0">
            <li className="mb-3"><a href="#" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Luxury Resorts</a></li>
            <li className="mb-3"><a href="#" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Spa & Wellness</a></li>
            <li className="mb-3"><a href="#" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Private Villas</a></li>
            <li className="mb-3"><a href="#" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Wedding Events</a></li>
            <li className="mb-3"><a href="#" className="text-white/70 hover:text-gold text-sm transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Travel Packages</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold mb-3 text-white">Contact Us</h3>
          <p className="text-white/70 mb-3 leading-relaxed text-sm flex items-center gap-2"><MapPin size={14} className="text-gold shrink-0" /> Pune, Maharashtra, India</p>
          <p className="text-white/70 mb-3 leading-relaxed text-sm flex items-center gap-2"><Phone size={14} className="text-gold shrink-0" /> +91 98765 *****</p>
          <p className="text-white/70 mb-3 leading-relaxed text-sm flex items-center gap-2"><Mail size={14} className="text-gold shrink-0" /> contact@reservo.com</p>
          <p className="text-white/70 mb-3 leading-relaxed text-sm flex items-center gap-2"><Clock size={14} className="text-gold shrink-0" /> Mon - Sat : 9 AM - 7 PM</p>
        </div>

      </div>

      <div className="border-t border-white/5 text-center py-6 px-5 text-white/50 text-[13.5px]">
        <p>
          &copy; 2026 <strong className="text-gold">Reservo</strong>. All Rights Reserved. Created with absolute visual detail.
        </p>
      </div>
    </footer>
  );
}

export default Footer;