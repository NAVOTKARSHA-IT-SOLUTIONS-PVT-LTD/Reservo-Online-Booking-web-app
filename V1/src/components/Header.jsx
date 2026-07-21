import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">

      <div className="container nav-container">

        {/* Logo */}
        <div className="logo">
          Resort<span>Book</span>
        </div>

        {/* Navigation */}
        <nav className="navbar">

          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Resorts</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>

        </nav>

        {/* Buttons */}

        <div className="nav-buttons">

          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Sign Up
          </button>

        </div>

      </div>

    </header>
  );
}

export default Header;