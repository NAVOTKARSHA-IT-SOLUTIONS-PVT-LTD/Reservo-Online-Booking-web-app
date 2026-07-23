import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-container">

        {/* Company */}

        <div className="footer-column company">

          <h2 className="footer-logo">
            Reserv<span>o</span>
          </h2>

          <p>
            Discover India's finest luxury resorts, boutique stays, and
            unforgettable travel experiences. Your perfect vacation starts
            with Reservo.
          </p>

          <div className="social-icons">

            <a href="#">🌐</a>

            <a href="#">📘</a>

            <a href="#">📷</a>

            <a href="#">▶️</a>

          </div>

        </div>

        {/* Quick Links */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <ul>

            <li><a href="/">Home</a></li>

            <li><a href="/">Destinations</a></li>

            <li><a href="/">Resorts</a></li>

            <li><a href="/about">About</a></li>

            <li><a href="/contact">Contact</a></li>

          </ul>

        </div>

        {/* Services */}

        <div className="footer-column">

          <h3>Our Services</h3>

          <ul>

            <li><a href="#">Luxury Resorts</a></li>

            <li><a href="#">Spa & Wellness</a></li>

            <li><a href="#">Private Villas</a></li>

            <li><a href="#">Wedding Events</a></li>

            <li><a href="#">Travel Packages</a></li>

          </ul>

        </div>

        {/* Contact */}

        <div className="footer-column">

          <h3>Contact Us</h3>

          <p>📍 Pune, Maharashtra, India</p>

          <p>📞 +91 98765 *****</p>

          <p>✉ contact@res.com</p>

          <p>🕒 Mon - Sat : 9 AM - 7 PM</p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 <strong>Reservo</strong>. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;