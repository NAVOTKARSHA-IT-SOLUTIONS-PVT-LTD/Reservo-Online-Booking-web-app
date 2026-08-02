import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, Heart, Moon, Sun, Globe, ChevronDown,
  LogIn, UserPlus, HelpCircle, Phone, Shield, FileText,
  LayoutGrid, BookOpen, Bell, Settings
} from "lucide-react";
import logoImage from "../assets/images/logo.png";

function Header({ isDark, onToggleTheme, wishlist = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy to highlight active section on home page
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180; // offset threshold

      const homeEl = document.getElementById("hero") || document.querySelector("section");
      const exploreEl = document.getElementById("explore");
      const whyEl = document.getElementById("why");
      const reviewsEl = document.getElementById("testimonials");
      const contactEl = document.getElementById("footer") || document.getElementById("contact");

      let current = "home";

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        current = "contact";
      } else if (reviewsEl && scrollPosition >= reviewsEl.offsetTop) {
        current = "reviews";
      } else if (whyEl && scrollPosition >= whyEl.offsetTop) {
        current = "why";
      } else if (exploreEl && scrollPosition >= exploreEl.offsetTop) {
        current = "explore";
      } else if (homeEl && scrollPosition >= homeEl.offsetTop) {
        current = "home";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollSpy);
    handleScrollSpy(); // initial check
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const performScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -110; // offset of 110px to prevent fixed header from overlapping
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(performScroll, 350);
    } else {
      performScroll();
    }
  };

  const isHome = location.pathname === "/";
  const navLinkClass = "relative text-[14px] font-semibold transition-colors duration-300 cursor-pointer border-none bg-transparent text-text-dark hover:text-primary py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:transition-transform after:duration-300";
  const getNavLinkClass = (isActive) =>
    `${navLinkClass} ${isActive ? "text-primary after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <div className={`flex justify-between items-center px-6 navbar-transition pointer-events-auto ${
          isScrolled
            ? "max-w-full w-full mt-0 rounded-none py-4 bg-bg-white border-b border-border-color border-t-transparent border-l-transparent border-r-transparent shadow-md"
            : "max-w-[1300px] w-[95%] mt-6 rounded-[32px] py-3 bg-bg-white/95 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-border-color"
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src={logoImage} alt="R" className="h-9 w-auto object-contain" />
            <span className="text-[20px] font-extrabold tracking-[0.5px] text-text-dark font-serif transition-colors duration-300">
              Reserv<span className="text-primary">o</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-8 list-none m-0 p-0 items-center">
              <li>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={getNavLinkClass(isHome && activeSection === "home")}>
                  Home
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(isHome && activeSection === "explore")} onClick={() => scrollToSection("explore")}>
                  Explore
                </button>
              </li>
              <li>
                <Link to="/ai-planner" className={getNavLinkClass(location.pathname === "/ai-planner")}>
                  ✨ AI Planner
                </Link>
              </li>
              <li>
                <button className={getNavLinkClass(isHome && activeSection === "why")} onClick={() => scrollToSection("why")}>
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
                <button className={getNavLinkClass(isHome && activeSection === "reviews")} onClick={() => scrollToSection("testimonials")}>
                  Reviews
                </button>
              </li>
              <li>
                <Link to="/contact" className={getNavLinkClass(location.pathname === "/contact")}>
                  Contact
                </Link>
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
        <ul className="list-none flex flex-col gap-1.5 p-0 m-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {[
            { type: "item", icon: <LogIn size={18} />, label: "Login", path: "/login" },
            { type: "item", icon: <UserPlus size={18} />, label: "Create Account", path: "/register" },
            { type: "divider" },
            { type: "item", icon: <HelpCircle size={18} />, label: "Help Center", path: "/help" },
            { type: "item", icon: <Phone size={18} />, label: "Contact", path: "/contact" },
            { type: "item", icon: <Shield size={18} />, label: "Privacy Policy", path: "/privacy" },
            { type: "item", icon: <FileText size={18} />, label: "Terms", path: "/terms" },
            { type: "divider" },
            { type: "item", icon: <LayoutGrid size={18} />, label: "Dashboard", path: "/dashboard" },
            { type: "item", icon: <BookOpen size={18} />, label: "Bookings", path: "/bookings" },
            { type: "item", icon: <Bell size={18} />, label: "Notifications", path: "/notifications" },
            { type: "item", icon: <Settings size={18} />, label: "Settings", path: "/settings" }
          ].map((item, idx) => {
            if (item.type === "divider") {
              return <hr key={idx} className="border-none h-px bg-border-color my-1 shrink-0" />;
            }
            const active = item.path && location.pathname === item.path;
            return (
              <li key={idx}>
                <button
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl border-none transition text-sm font-semibold cursor-pointer text-left ${
                    active 
                      ? "bg-[#2F80ED]/10 text-primary" 
                      : "bg-transparent text-text-dark hover:bg-bg-light"
                  }`}
                >
                  <span className={active ? "text-primary" : "text-text-gray"}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Header;