import React from "react";
import { Link } from "react-router-dom";
import { Globe, Send, ShieldCheck, HeadphonesIcon, Lock } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-bg-white pt-24 font-sans border-t border-border-color transition-colors duration-300" id="footer">
      <div className="w-full max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 mb-16 relative">
          
          {/* Decorative Palm Image (Simulated in CSS, or transparent image) */}
          <div className="absolute right-0 bottom-0 w-[300px] h-[200px] bg-[url('https://cdn-icons-png.flaticon.com/512/3663/3663189.png')] bg-no-repeat bg-right-bottom bg-contain opacity-[0.03] pointer-events-none"></div>

          {/* Left Column: Brand & Social */}
          <div className="lg:col-span-3">
            <Link to="/" className="flex items-center gap-2 no-underline mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-3xl font-bold bg-primary text-white">
                R
              </div>
              <span className="text-[28px] font-extrabold tracking-[1px] text-text-dark font-serif transition-colors duration-300">
                Reserv<span className="text-primary">o</span>
              </span>
            </Link>
            
            <p className="text-text-gray text-[14px] leading-relaxed mb-8 max-w-[280px] transition-colors duration-300">
              Discover India's finest luxury resorts, boutique stays, and unforgettable travel experiences. Your perfect vacation starts with Reservo.
            </p>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-dark hover:text-primary hover:border-primary transition-colors duration-300 bg-transparent"><Globe size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-dark hover:text-primary hover:border-primary transition-colors duration-300 bg-transparent font-bold text-xs font-sans">FB</a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-dark hover:text-primary hover:border-primary transition-colors duration-300 bg-transparent font-bold text-xs font-sans">IG</a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-dark hover:text-primary hover:border-primary transition-colors duration-300 bg-transparent font-bold text-xs font-sans">YT</a>
            </div>

            {/* Contact Info */}
            <div className="mt-8 bg-bg-light rounded-xl p-5 border border-border-color max-w-[280px] transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-[13px] font-bold text-text-dark transition-colors duration-300">Contact Us</span>
              </div>
              <ul className="flex flex-col gap-3 text-[13px] text-text-gray p-0 list-none transition-colors duration-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">📍</span> Pune, Maharashtra, India</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">📞</span> +91 98765 *****</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✉️</span> contact@reservo.com</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">🕒</span> Mon - Sat : 9 AM - 7 PM</li>
              </ul>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-[15px] font-extrabold text-text-dark mb-6 flex flex-col gap-2 transition-colors duration-300">
              Quick Links
              <span className="w-6 h-0.5 bg-primary"></span>
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-text-gray font-medium p-0 list-none transition-colors duration-300">
              <li><Link to="/" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Home <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Destinations <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Stays <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">About Us <span className="text-border-color">&gt;</span></Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[15px] font-extrabold text-text-dark mb-6 flex flex-col gap-2 transition-colors duration-300">
              Our Services
              <span className="w-6 h-0.5 bg-primary"></span>
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-text-gray font-medium p-0 list-none transition-colors duration-300">
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Luxury Stays <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Spa & Wellness <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Private Villas <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Wedding Events <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Travel Packages <span className="text-border-color">&gt;</span></Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[15px] font-extrabold text-text-dark mb-6 flex flex-col gap-2 transition-colors duration-300">
              Company Info
              <span className="w-6 h-0.5 bg-primary"></span>
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-text-gray font-medium p-0 list-none transition-colors duration-300">
              <li><Link to="/careers" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Careers <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Terms of Service <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Help Center <span className="text-border-color">&gt;</span></Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors flex items-center justify-between text-text-gray decoration-none">Support <span className="text-border-color">&gt;</span></Link></li>
            </ul>
          </div>

          {/* Right Column: Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-[15px] font-extrabold text-text-dark mb-6 flex flex-col gap-2 transition-colors duration-300">
              Newsletter
              <span className="w-6 h-0.5 bg-primary"></span>
            </h4>
            <p className="text-text-gray text-[13px] leading-relaxed mb-6 transition-colors duration-300">
              Subscribe to get exclusive offers, travel inspiration & more.
            </p>
            <form className="flex flex-col gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full border border-border-color rounded-lg px-4 py-3 text-[14px] outline-none focus:border-primary transition-colors bg-bg-light text-text-dark" 
              />
              <button 
                type="submit" 
                className="w-full bg-primary text-white rounded-lg px-4 py-3 text-[14px] font-bold hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer shadow-[0_5px_15px_rgba(27,92,248,0.2)]"
              >
                Subscribe <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary-dark text-white py-4 w-full transition-colors duration-300">
        <div className="w-full max-w-[1280px] mx-auto px-5 flex flex-col lg:flex-row justify-between items-center gap-4 text-[12px] font-medium">
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> 100% Secure Booking</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span className="flex items-center gap-1.5"><HeadphonesIcon size={16} /> 24/7 Customer Support</span>
          </div>

          <div className="text-white/80">
            &copy; 2026 <span className="font-bold text-white">Reservo</span>. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-black italic text-[15px] tracking-tighter">VISA</span>
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-red-500 opacity-90 mix-blend-multiply"></div>
                <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-90 mix-blend-multiply"></div>
              </div>
              <span className="font-bold italic text-[11px] border border-white/30 px-1 rounded-sm">AMEX</span>
              <span className="font-bold italic text-[14px]">UPI</span>
            </div>
            <span className="w-px h-4 bg-white/20"></span>
            <span className="flex items-center gap-1.5"><Lock size={14} /> Encrypted & Secure</span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;