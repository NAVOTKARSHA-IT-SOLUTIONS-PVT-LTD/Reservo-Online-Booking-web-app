import React, { useState } from "react";
import { Heart, Star, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import "./FeaturedResorts.css";

// Import local images from Aditya's assets
import manaliImg from "../assets/images/manali.jpg";
import goaImg from "../assets/images/goa.jpg";
import keralaImg from "../assets/images/kerala.jpg";
import udaipurImg from "../assets/images/udaipur.jpg";
import shimlaImg from "../assets/images/shimla.jpg";
import coorgImg from "../assets/images/coorg.jpg";
import andamanImg from "../assets/images/andaman.jpg";
import jaipurImg from "../assets/images/jaipur.jpg";

const RESORTS = [
  {
    id: 1,
    name: "Mountain Paradise Resort",
    location: "Manali, Himachal Pradesh",
    price: 6500,
    rating: "4.8 (89 reviews)",
    badge: "Best Seller",
    image: manaliImg,
    amenities: ["🔥 Fireplace", "🧖 Spa", "📶 WiFi"],
    isAIRecommended: false
  },
  {
    id: 2,
    name: "Ocean Breeze Resort",
    location: "Goa, India",
    price: 8200,
    rating: "4.9 (142 reviews)",
    badge: "Luxury",
    image: goaImg,
    amenities: ["🏖️ Beachfront", "🍽️ Restaurant", "🍸 Bar"],
    isAIRecommended: true
  },
  {
    id: 3,
    name: "Green Valley Resort",
    location: "Kerala, India",
    price: 5900,
    rating: "4.7 (76 reviews)",
    badge: "Top Rated",
    image: keralaImg,
    amenities: ["🧘 Spa", "🌲 Nature Trails", "🏊 Pool"],
    isAIRecommended: false
  },
  {
    id: 4,
    name: "Royal Lake Palace",
    location: "Udaipur, Rajasthan",
    price: 9500,
    rating: "4.9 (198 reviews)",
    badge: "Premium Heritage",
    image: udaipurImg,
    amenities: ["🌅 Lake View", "⚜️ Luxury Suites", "🏊 Pool"],
    isAIRecommended: true
  },
  {
    id: 5,
    name: "Himalayan Bliss Resort",
    location: "Shimla, India",
    price: 7300,
    rating: "4.8 (94 reviews)",
    badge: "Nature Retreat",
    image: shimlaImg,
    amenities: ["🏔️ Mountain View", "🔥 Fireplace", "💆 Spa"],
    isAIRecommended: false
  },
  {
    id: 6,
    name: "Coorg Nature Retreat",
    location: "Coorg, Karnataka",
    price: 6800,
    rating: "4.8 (65 reviews)",
    badge: "Editor's Pick",
    image: coorgImg,
    amenities: ["☕ Coffee Estate", "🏊 Pool", "🦜 Bird Watching"],
    isAIRecommended: false
  },
  {
    id: 7,
    name: "Sunrise Beach Resort",
    location: "Andaman Islands, India",
    price: 10200,
    rating: "4.9 (120 reviews)",
    badge: "Beachfront VIP",
    image: andamanImg,
    amenities: ["🏝️ Private Beach", "🤿 Scuba Diving", "💆 Spa"],
    isAIRecommended: true
  },
  {
    id: 8,
    name: "The Royal Heritage Resort",
    location: "Jaipur, Rajasthan",
    price: 8900,
    rating: "4.7 (104 reviews)",
    badge: "Heritage Palace",
    image: jaipurImg,
    amenities: ["🏰 Palace Tour", "🍽️ Fine Dining", "🏊 Pool"],
    isAIRecommended: false
  },
];

function FeaturedResorts() {
  const [wishlist, setWishlist] = useState({});
  const [sliderIndex, setSliderIndex] = useState(0);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuickBook = (name) => {
    // Show availability confirmation modal (simulated in App.jsx via window elements)
    const modal = document.getElementById("booking-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      modal.style.display = "flex";
      
      const btn = document.getElementById("close-modal-btn");
      if (btn) btn.style.display = "none";
      
      const titleEl = modal.querySelector(".modal-title");
      const descEl = modal.querySelector(".modal-desc");
      if (titleEl) titleEl.innerText = "Checking Availability...";
      if (descEl) descEl.innerText = `Rivo is search-matching live luxury inventories for ${name}...`;

      setTimeout(() => {
        if (titleEl) titleEl.innerText = "Resort Available!";
        if (descEl) descEl.innerText = `Great choice! We have secured special rates for ${name}. Complete your check-out process.`;
        if (btn) btn.style.display = "block";
      }, 3000);
    }
  };

  const handleNext = () => {
    if (sliderIndex < RESORTS.length - 3) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  return (
    <section className="featured" id="resorts">
      <div className="container">
        
        {/* Title Header Row with Controls */}
        <div className="section-header-row">
          <div>
            <span className="section-tag">Featured Stays</span>
            <h2 className="section-title">Luxury Resorts Handpicked for You</h2>
            <p className="section-subtitle">
              Every location features premium amenities, breathtaking architecture, and stellar local service.
            </p>
          </div>

          <div className="slider-controls">
            <button 
              className={`slider-ctrl-btn ${sliderIndex === 0 ? "disabled" : ""}`}
              onClick={handlePrev}
              disabled={sliderIndex === 0}
              aria-label="Previous stays"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className={`slider-ctrl-btn ${sliderIndex >= RESORTS.length - 3 ? "disabled" : ""}`}
              onClick={handleNext}
              disabled={sliderIndex >= RESORTS.length - 3}
              aria-label="Next stays"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="resorts-carousel-wrapper">
          <div 
            className="resorts-carousel-track"
            style={{
              transform: `translateX(-${sliderIndex * (100 / 3)}%)`
            }}
          >
            {RESORTS.map((resort) => (
              <article className="resort-slide-card" key={resort.id}>
                <div className="resort-img-wrapper">
                  <img src={resort.image} alt={resort.name} className="resort-img" />
                  
                  {resort.isAIRecommended && (
                    <span className="resort-badge ai">
                      <Sparkles size={12} /> AI Recommended
                    </span>
                  )}
                  {!resort.isAIRecommended && resort.badge && (
                    <span className="resort-badge standard">
                      {resort.badge}
                    </span>
                  )}

                  <button 
                    className={`resort-wishlist ${wishlist[resort.id] ? "active" : ""}`}
                    aria-label="Add to Wishlist"
                    onClick={(e) => toggleWishlist(resort.id, e)}
                  >
                    <Heart size={16} fill={wishlist[resort.id] ? "#EF4444" : "none"} />
                  </button>
                </div>

                <div className="resort-body">
                  <div className="resort-meta">
                    <span className="resort-loc">
                      <MapPin size={12} /> {resort.location}
                    </span>
                    <span className="resort-rating">
                      <Star size={12} fill="#C2A878" color="#C2A878" /> {resort.rating}
                    </span>
                  </div>
                  
                  <h3 className="resort-name">{resort.name}</h3>
                  
                  <div className="resort-amenities">
                    {resort.amenities.map((item, index) => (
                      <span className="resort-amenity" key={index}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="resort-footer">
                    <div className="resort-price">
                      <span className="resort-price-val">₹{resort.price}</span>
                      <span className="resort-price-label">per night</span>
                    </div>
                    <button 
                      className="book-btn" 
                      onClick={() => handleQuickBook(resort.name)}
                    >
                      Quick Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturedResorts;