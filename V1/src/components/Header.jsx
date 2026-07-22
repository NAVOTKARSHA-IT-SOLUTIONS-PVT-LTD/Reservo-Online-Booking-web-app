import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="header">

      <div className="container nav-container">

        {/* Logo */}
        <h2 className="logo">
    Reserv<span>o</span>
</h2>

        {/* Navigation */}
        <nav className="navbar">

         <ul className="nav-links">

    <li>
        <Link to="/">Home</Link>
    </li>

    <li>
        <Link to="/">Resorts</Link>
    </li>

    <li>
        <Link to="/">Services</Link>
    </li>

    <li>
        <Link to="/about">About</Link>
    </li>

    <li>
        <Link to="/contact">Contact</Link>
    </li>

    <li>
        <Link to="/">FAQ</Link>
    </li>

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