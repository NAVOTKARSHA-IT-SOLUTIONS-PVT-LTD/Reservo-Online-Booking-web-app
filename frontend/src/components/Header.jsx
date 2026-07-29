import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Moon, Sun, Globe, ChevronDown } from "lucide-react";
import logoImage from "../assets/images/logo.png";
import logoNameImage from "../assets/images/logoname.png";

function Header({ isDark, onToggleTheme, wishlist = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isHome = location.pathname === "/";
  // The design shows the header always as a white pill with text
  const navLinkClass = "relative text-[14px] font-semibold transition-colors duration-300 cursor-pointer border-none bg-transparent text-text-dark hover:text-primary py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:transition-transform after:duration-300";
  const getNavLinkClass = (isActive) =>
    `${navLinkClass} ${isActive ? "text-primary after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`;

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1300px] z-50 transition-all duration-300 ease-out">
        <div className="flex justify-between items-center px-6 py-3 rounded-[32px] bg-bg-white/95 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-border-color transition-colors duration-300">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src={logoImage} alt="R" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <img src={logoNameImage} alt="Reservo" className="h-5 w-auto object-contain" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5px] text-primary mt-0.5">
                Connect • Book • Relax • Revisit
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-8 list-none m-0 p-0 items-center">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className={getNavLinkClass(isHome)}>
                  Home
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(false)} onClick={() => scrollToSection("explore")}>
                  Explore
                </button>
              </li>
              <li>
                <button className={getNavLinkClass(false)} onClick={() => scrollToSection("why")}>
                  Why Us
                </button>
              </li>
              <li>
                <Link to="/experiences" className={getNavLinkClass(location.pathname === "/experiences")}>
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/rewards" className={getNavLinkClass(location.pathname === "/rewards")}>
                  Rewards
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(false)} onClick={() => scrollToSection("testimonials")}>
                  Reviews
                </button>
              </li>
              <li>
                <button className={getNavLinkClass(false)} onClick={() => scrollToSection("footer")}>
                  Contact
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleTheme} 
              className="bg-bg-white border border-border-color cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-text-dark hover:text-primary hover:border-primary transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/wishlist" className="relative bg-bg-white border border-border-color cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-text-dark hover:text-primary hover:border-primary transition-all">
              <Heart size={18} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-bg-white">
                {wishlist.length}
              </span>
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-2 text-[14px] font-semibold px-4 py-2 rounded-full border border-border-color bg-bg-white text-text-dark hover:border-primary cursor-pointer transition-all">
                <Globe size={16} />
                <span>English</span> <ChevronDown size={14} />
              </button>
            </div>

            <button className="bg-bg-white border border-border-color cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-text-dark hover:text-primary hover:border-primary transition-all" onClick={toggleMenu}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
 
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[2000] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={toggleMenu} />
      <div className={`fixed top-0 right-0 bottom-0 w-80 max-w-full bg-bg-white border-l border-border-color p-7 shadow-2xl transition-transform duration-400 ease-out z-[2001] flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8 border-b border-border-color pb-4">
          <h3 className="text-xl font-bold text-text-dark">Menu</h3>
          <button className="bg-transparent text-text-gray hover:text-text-dark border-none cursor-pointer" onClick={toggleMenu}><X size={24} /></button>
        </div>
        <ul className="flex flex-col gap-6 p-0 m-0 list-none text-[16px] font-semibold text-text-dark">
          <li><Link to="/" onClick={toggleMenu} className="hover:text-primary text-text-dark decoration-none">Home</Link></li>
          <li><button onClick={() => scrollToSection("explore")} className="bg-transparent border-none font-semibold hover:text-primary text-text-dark cursor-pointer text-left">Explore</button></li>
          <li><button onClick={() => scrollToSection("why")} className="bg-transparent border-none font-semibold hover:text-primary text-text-dark cursor-pointer text-left">Why Reservo</button></li>
          <li><button onClick={() => scrollToSection("testimonials")} className="bg-transparent border-none font-semibold hover:text-primary text-text-dark cursor-pointer text-left">Reviews</button></li>
          <li><button onClick={() => scrollToSection("footer")} className="bg-transparent border-none font-semibold hover:text-primary text-text-dark cursor-pointer text-left">Contact</button></li>
        </ul>
      </div>
    </>
  );
}

export default Header;