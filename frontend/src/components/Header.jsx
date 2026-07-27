import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, Heart, Moon, Sun } from "lucide-react";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("reservo-theme") === "dark";
  });

  // Track page scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync dark theme with body tag
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("reservo-theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("reservo-theme", "light");
    }
  }, [isDark]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const isHome = location.pathname === "/";
  const shouldBeDarkHeader = !isHome || isScrolled;

  return (
    <>
      <header className={`fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[1400px] z-50 transition-all duration-300 ease-out`}>
        <div className={`flex justify-between items-center px-6 py-3 rounded-full transition-all duration-300 ease-out ${
          shouldBeDarkHeader 
            ? "bg-bg-white border border-border-color shadow-[0_10px_30px_rgba(0,0,0,0.08)]" 
            : "bg-white/12 backdrop-blur-xl border border-white/28 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
        }`}>
          {/* Logo with Mascot Avatar */}
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=80&q=80" 
              alt="Rivo Logo" 
              className={`w-8.5 h-8.5 rounded-full object-cover transition-colors duration-300 ${
                shouldBeDarkHeader ? "border-1.5 border-border-color" : "border-1.5 border-white/30"
              }`}
            />
            <span className={`text-[26px] font-extrabold tracking-[1px] transition-colors duration-300 ${
              shouldBeDarkHeader ? "text-text-dark" : "text-white"
            }`}>
              RESERV<span className="text-gold">O</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-6 list-none">
              <li>
                <Link 
                  to="/" 
                  className={`text-[15px] font-semibold transition-colors duration-300 ${
                    shouldBeDarkHeader 
                      ? "text-text-dark" 
                      : "text-white"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <a 
                  href="/#explore" 
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    shouldBeDarkHeader ? "text-text-gray hover:text-text-dark" : "text-white/80 hover:text-white"
                  }`}
                >
                  Explore
                </a>
              </li>
              <li>
                <Link 
                  to="/resorts" 
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    shouldBeDarkHeader ? "text-text-gray hover:text-text-dark" : "text-white/80 hover:text-white"
                  }`}
                >
                  Resorts
                </Link>
              </li>
              <li>
                <Link 
                  to="/experiences" 
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    shouldBeDarkHeader ? "text-text-gray hover:text-text-dark" : "text-white/80 hover:text-white"
                  }`}
                >
                  Experiences
                </Link>
              </li>
              <li>
                <a 
                  href="/#why" 
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    shouldBeDarkHeader ? "text-text-gray hover:text-text-dark" : "text-white/80 hover:text-white"
                  }`}
                >
                  Why Us
                </a>
              </li>
              <li>
                <a 
                  href="/#testimonials" 
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    shouldBeDarkHeader ? "text-text-gray hover:text-text-dark" : "text-white/80 hover:text-white"
                  }`}
                >
                  Reviews
                </a>
              </li>
              <li>
                <a 
                  href="/#footer" 
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    shouldBeDarkHeader ? "text-text-gray hover:text-text-dark" : "text-white/80 hover:text-white"
                  }`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Nav Actions / Hamburger Trigger */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Button */}
            <button 
              className={`bg-transparent border-none cursor-pointer flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                shouldBeDarkHeader 
                  ? "text-text-dark hover:bg-bg-light hover:text-gold" 
                  : "text-white hover:bg-white/15 hover:text-gold"
              }`} 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link 
              to="/wishlist" 
              className={`bg-transparent border-none cursor-pointer flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                shouldBeDarkHeader 
                  ? "text-text-dark hover:bg-bg-light hover:text-gold" 
                  : "text-white hover:bg-white/15 hover:text-gold"
              }`} 
              aria-label="View Wishlist"
            >
              <Heart size={18} />
            </Link>
            
            <div className={`flex items-center gap-1.5 text-[13.5px] font-semibold cursor-pointer px-3 py-1.5 rounded-full transition-all duration-300 ${
              shouldBeDarkHeader 
                ? "text-text-dark bg-bg-light hover:bg-black/5" 
                : "text-white bg-white/10 hover:bg-white/20"
            }`} aria-label="Change Language">
              <Globe size={18} />
              <span>EN</span>
            </div>

            <button 
              className={`bg-transparent border-none cursor-pointer flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                shouldBeDarkHeader 
                  ? "text-text-dark hover:bg-bg-light hover:text-gold" 
                  : "text-white hover:bg-white/15 hover:text-gold"
              }`} 
              onClick={toggleMenu} 
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Overlay Menu */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[2000] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
        onClick={toggleMenu}
      ></div>
      
      <div 
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-full bg-bg-white border-l border-border-color p-7.5 shadow-[-10px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-400 ease-out z-[2001] flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-7.5 border-b border-border-color pb-3.5">
          <h3 className="text-xl font-bold text-text-dark">Account Settings</h3>
          <button className="bg-transparent text-text-gray hover:text-text-dark border-none cursor-pointer transition-colors duration-300" onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>

        <ul className="list-none flex flex-col gap-5 p-0 m-0">
          <li>
            <Link to="/profile" className="text-text-dark text-base font-semibold transition-all duration-300 hover:text-gold hover:pl-1 block text-decoration-none" onClick={toggleMenu}>
              👤 Profile
            </Link>
          </li>
          <hr className="border-none h-px bg-border-color my-2.5" />
          <li className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider text-text-gray font-bold">Sign In or Register</span>
            <div className="flex flex-col gap-2.5 mt-1">
              <button className="w-full bg-transparent text-text-dark border border-border-color py-2.5 rounded-lg font-semibold hover:bg-text-dark hover:text-bg-white hover:border-text-dark transition-all duration-300" onClick={toggleMenu}>Log In</button>
              <button className="w-full bg-gold text-white py-2.5 border-none rounded-lg font-semibold hover:bg-gold-dark transition-all duration-300" onClick={toggleMenu}>Register / Sign Up</button>
            </div>
          </li>
          <hr className="border-none h-px bg-border-color my-2.5" />
          <li>
            <Link to="/" className="text-sm text-text-gray hover:text-text-dark transition-colors duration-300 block text-decoration-none" onClick={toggleMenu}>
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;