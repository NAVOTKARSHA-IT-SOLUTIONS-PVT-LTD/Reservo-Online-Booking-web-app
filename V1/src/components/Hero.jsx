import React from "react";
import "./Hero.css";
import heroImage from "../assets/images/hero.jpg"; // Change if your image name is different

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${heroImage})`,
      }}
    >
      <div className="hero-content">

        <span className="hero-tag">
          ✨ Luxury Resort Booking
        </span>

        <h1>
          Discover Luxury <br />
          Resorts Across India
        </h1>

        <p>
          Experience premium stays, breathtaking destinations,
          and unforgettable vacations curated just for you.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Explore Resorts
          </button>

          <button className="secondary-btn">
            Watch Video
          </button>
        </div>

        {/* Booking Search */}
        <div className="booking-search">

          <div className="search-item">
            <label>Destination</label>
            <input type="text" placeholder="Goa" />
          </div>

          <div className="search-item">
            <label>Check In</label>
            <input type="date" />
          </div>

          <div className="search-item">
            <label>Check Out</label>
            <input type="date" />
          </div>

          <div className="search-item">
            <label>Guests</label>
            <select>
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
              <option>5+ Guests</option>
            </select>
          </div>

          <button className="search-btn">
            Search
          </button>

        </div>

        {/* Hero Statistics */}
        <div className="hero-stats">

          <div className="stat-box">
            <h2>500+</h2>
            <p>Luxury Resorts</p>
          </div>

          <div className="stat-box">
            <h2>150+</h2>
            <p>Destinations</p>
          </div>

          <div className="stat-box">
            <h2>50K+</h2>
            <p>Happy Guests</p>
          </div>

          <div className="stat-box">
            <h2>4.9★</h2>
            <p>Guest Rating</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;