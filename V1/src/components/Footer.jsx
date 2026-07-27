import React from "react";
import { Link } from "react-router-dom";
import { Globe, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer-container">
        
        {/* Company Column */}
        <div className="footer-column company">
          <h2 className="footer-logo">
            Reserv<span>o</span>
          </h2>
          <p>
            Discover India's finest luxury resorts, boutique stays, and unforgettable travel experiences. Your perfect vacation starts with Reservo.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Website"><Globe size={18} /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF size={18} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" aria-label="Youtube"><FaYoutube size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Destinations</Link></li>
            <li><Link to="/">Resorts</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Our Services */}
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

        {/* Contact Info */}
        <div className="footer-column contact-info">
          <h3>Contact Us</h3>
          <p><MapPin size={14} /> Pune, Maharashtra, India</p>
          <p><Phone size={14} /> +91 98765 *****</p>
          <p><Mail size={14} /> contact@reservo.com</p>
          <p><Clock size={14} /> Mon - Sat : 9 AM - 7 PM</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2026 <strong>Reservo</strong>. All Rights Reserved. Created with absolute visual detail.
        </p>
      </div>
    </footer>
  );
}

export default Footer;