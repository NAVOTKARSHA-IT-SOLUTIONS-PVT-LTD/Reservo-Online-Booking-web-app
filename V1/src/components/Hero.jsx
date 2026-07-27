import React, { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Users, Search, ArrowRight, Play } from "lucide-react";
import heroImage from "../assets/images/hero.jpg";
import "./Hero.css";

const DESTINATIONS = [
  { name: "Goa", region: "West Coast, India" },
  { name: "Manali", region: "Himalayas, India" },
  { name: "Kerala", region: "South Coast, India" },
  { name: "Coorg", region: "Western Ghats, India" },
  { name: "Andaman", region: "Island Territory, India" }
];

function Hero() {
  const [destination, setDestination] = useState("Goa, India");
  const [checkIn, setCheckIn] = useState("2026-09-12");
  const [checkOut, setCheckOut] = useState("2026-09-19");
  
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });

  const [activeField, setActiveField] = useState(null); // 'destination' | 'checkin' | 'checkout' | 'guests' | null
  const widgetRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFieldClick = (field) => {
    setActiveField(activeField === field ? null : field);
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const min = type === 'rooms' || type === 'adults' ? 1 : 0;
      let val = prev[type];
      if (operation === 'add') {
        val += 1;
      } else if (operation === 'subtract' && val > min) {
        val -= 1;
      }
      return { ...prev, [type]: val };
    });
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleSearch = () => {
    alert(`Searching luxury stays in ${destination} for ${guests.adults + guests.children} guests (${guests.rooms} room/s) from ${formatDateLabel(checkIn)} to ${formatDateLabel(checkOut)}.`);
  };

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.3)), url(${heroImage})`,
      }}
    >
      <div className="hero-content">
        <span className="hero-tag">
          ✨ Premium Stays, AI Curated
        </span>

        <h1 className="hero-title">
          Book Smart. <br />
          Stay <span>Better.</span>
        </h1>

        <p className="hero-subtitle">
          AI-powered booking for India's finest luxury resorts, boutique villas, and memorable stays.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Explore Resorts <ArrowRight size={18} />
          </button>
          <button className="secondary-btn">
            <Play size={16} fill="white" /> Watch Demo
          </button>
        </div>

        {/* Floating Smart Booking Widget */}
        <div className="booking-widget-container" ref={widgetRef}>
          <div className="booking-widget glass-panel">
            
            {/* Destination */}
            <div 
              className={`booking-field ${activeField === 'destination' ? 'active' : ''}`}
              onClick={() => handleFieldClick('destination')}
            >
              <div className="booking-field-icon">
                <MapPin size={18} />
              </div>
              <div className="booking-field-info">
                <span className="booking-field-label">Where to?</span>
                <input 
                  type="text" 
                  className="booking-field-input" 
                  value={destination} 
                  readOnly 
                  placeholder="Select destination"
                />
              </div>

              {activeField === 'destination' && (
                <div className="booking-dropdown dest-dropdown">
                  <div className="dropdown-dest-list">
                    {DESTINATIONS.map((dest, i) => (
                      <div 
                        key={i} 
                        className="dropdown-dest-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDestination(`${dest.name}, India`);
                          setActiveField(null);
                        }}
                      >
                        <MapPin size={16} />
                        <div>
                          <strong>{dest.name}</strong>
                          <span className="dest-sub">{dest.region}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Check In */}
            <div 
              className={`booking-field ${activeField === 'checkin' ? 'active' : ''}`}
              onClick={() => handleFieldClick('checkin')}
            >
              <div className="booking-field-icon">
                <Calendar size={18} />
              </div>
              <div className="booking-field-info">
                <span className="booking-field-label">Check In</span>
                <input 
                  type="text" 
                  className="booking-field-input" 
                  value={formatDateLabel(checkIn)} 
                  readOnly 
                />
              </div>

              {activeField === 'checkin' && (
                <div className="booking-dropdown date-dropdown" onClick={(e) => e.stopPropagation()}>
                  <h4>Select Check-in Date</h4>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)} 
                    className="date-picker-input"
                  />
                </div>
              )}
            </div>

            {/* Check Out */}
            <div 
              className={`booking-field ${activeField === 'checkout' ? 'active' : ''}`}
              onClick={() => handleFieldClick('checkout')}
            >
              <div className="booking-field-icon">
                <Calendar size={18} />
              </div>
              <div className="booking-field-info">
                <span className="booking-field-label">Check Out</span>
                <input 
                  type="text" 
                  className="booking-field-input" 
                  value={formatDateLabel(checkOut)} 
                  readOnly 
                />
              </div>

              {activeField === 'checkout' && (
                <div className="booking-dropdown date-dropdown" onClick={(e) => e.stopPropagation()}>
                  <h4>Select Check-out Date</h4>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)} 
                    className="date-picker-input"
                  />
                </div>
              )}
            </div>

            {/* Guests */}
            <div 
              className={`booking-field ${activeField === 'guests' ? 'active' : ''}`}
              onClick={() => handleFieldClick('guests')}
            >
              <div className="booking-field-icon">
                <Users size={18} />
              </div>
              <div className="booking-field-info">
                <span className="booking-field-label">Guests & Rooms</span>
                <input 
                  type="text" 
                  className="booking-field-input" 
                  value={`${guests.adults + guests.children} Guest${guests.adults + guests.children > 1 ? 's' : ''}, ${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}`} 
                  readOnly 
                />
              </div>

              {activeField === 'guests' && (
                <div className="booking-dropdown guests-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-guest-row">
                    <div>
                      <strong>Adults</strong>
                      <span className="guest-sub">Age 13+</span>
                    </div>
                    <div className="guest-controls">
                      <button className="ctrl-btn" onClick={() => handleGuestChange('adults', 'subtract')}>-</button>
                      <span className="count">{guests.adults}</span>
                      <button className="ctrl-btn" onClick={() => handleGuestChange('adults', 'add')}>+</button>
                    </div>
                  </div>
                  <div className="dropdown-guest-row">
                    <div>
                      <strong>Children</strong>
                      <span className="guest-sub">Ages 2-12</span>
                    </div>
                    <div className="guest-controls">
                      <button className="ctrl-btn" onClick={() => handleGuestChange('children', 'subtract')}>-</button>
                      <span className="count">{guests.children}</span>
                      <button className="ctrl-btn" onClick={() => handleGuestChange('children', 'add')}>+</button>
                    </div>
                  </div>
                  <div className="dropdown-guest-row">
                    <div>
                      <strong>Rooms</strong>
                      <span className="guest-sub">Number of rooms</span>
                    </div>
                    <div className="guest-controls">
                      <button className="ctrl-btn" onClick={() => handleGuestChange('rooms', 'subtract')}>-</button>
                      <span className="count">{guests.rooms}</span>
                      <button className="ctrl-btn" onClick={() => handleGuestChange('rooms', 'add')}>+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="btn-search-widget" onClick={handleSearch} aria-label="Search Stays">
              <Search size={20} />
              <span>Search</span>
            </button>

          </div>
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