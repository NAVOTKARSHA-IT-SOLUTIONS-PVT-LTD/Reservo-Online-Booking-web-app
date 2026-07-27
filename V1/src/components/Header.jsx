import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, Heart, Moon, Sun } from "lucide-react";
import "./Header.css";

function Header() {
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

  return (
    <>
      <header className={`header-wrapper ${isScrolled ? "scrolled" : ""}`}>
        <div className="container nav-container">
          {/* Logo with Mascot Avatar */}
          <Link to="/" className="logo">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=80&q=80" 
              alt="Rivo Logo" 
              className="logo-avatar"
            />
            <span className="logo-text">
              RESERV<span>O</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar">
            <ul className="nav-links">
              <li><Link to="/" className="active">Home</Link></li>
              <li><a href="/#explore">Explore</a></li>
              <li><Link to="/resorts">Resorts</Link></li>
              <li><Link to="/experiences">Experiences</Link></li>
              <li><a href="/#why">Why Us</a></li>
              <li><a href="/#testimonials">Reviews</a></li>
              <li><a href="/#footer">Contact</a></li>
            </ul>
          </nav>

          {/* Nav Actions / Hamburger Trigger */}
          <div className="nav-actions">
            {/* Theme Switcher Button */}
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/wishlist" className="wishlist-btn" aria-label="View Wishlist">
              <Heart size={18} />
            </Link>
            
            <div className="lang-selector" aria-label="Change Language">
              <Globe size={18} />
              <span>EN</span>
            </div>

            <button 
              className="hamburger-btn" 
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
      <div className={`drawer-overlay ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}></div>
      
      <div className={`drawer-menu ${isMenuOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Account Settings</h3>
          <button className="close-btn" onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>

        <ul className="drawer-links">
          <li>
            <Link to="/profile" className="drawer-user-link" onClick={toggleMenu}>
              👤 Profile
            </Link>
          </li>
          <hr className="drawer-divider" />
          <li className="drawer-user-section">
            <span className="drawer-section-title">Sign In or Register</span>
            <div className="drawer-auth-buttons">
              <button className="login-btn" onClick={toggleMenu}>Log In</button>
              <button className="signup-btn" onClick={toggleMenu}>Register / Sign Up</button>
            </div>
          </li>
          <hr className="drawer-divider" />
          <li>
            <Link to="/" className="drawer-legal-link" onClick={toggleMenu}>
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;