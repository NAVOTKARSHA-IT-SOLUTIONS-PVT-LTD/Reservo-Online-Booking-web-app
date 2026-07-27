import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-wrapper">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-text">
            RESERV<span>O</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Resorts</Link></li>
            <li><Link to="/">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/">FAQ</Link></li>
          </ul>
        </nav>

        {/* Nav Actions / Hamburger Trigger */}
        <div className="nav-actions">
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

      {/* Drawer Overlay Menu */}
      <div className={`drawer-overlay ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div className={`drawer-menu ${isMenuOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Menu</h3>
            <button className="close-btn" onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>

          <ul className="drawer-links">
            <li>
              <Link to="/" onClick={toggleMenu}>Home</Link>
            </li>
            <li>
              <Link to="/" onClick={toggleMenu}>Resorts</Link>
            </li>
            <li>
              <Link to="/" onClick={toggleMenu}>Services</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>About Us</Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            </li>
            <hr className="drawer-divider" />
            <li className="drawer-user-section">
              <span className="drawer-section-title">User Account</span>
              <div className="drawer-user-links">
                <Link to="/" className="drawer-user-link" onClick={toggleMenu}>
                  👤 Profile
                </Link>
                <div className="drawer-auth-buttons">
                  <button className="login-btn" onClick={toggleMenu}>Log In</button>
                  <button className="signup-btn" onClick={toggleMenu}>Sign Up</button>
                </div>
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
      </div>
    </header>
  );
}

export default Header;