import React, { useState, useRef } from "react";
import { Heart, Star, MapPin, ChevronLeft, ChevronRight, Waves, Mountain, Trees, Home, Tent, Sparkles, Palmtree, Compass, PawPrint, HeartHandshake } from "lucide-react";
import "./PopularDestinations.css";

// Import local images from Aditya's assets
import goaImg from "../assets/images/goa.jpg";
import manaliImg from "../assets/images/manali.jpg";
import keralaImg from "../assets/images/kerala.jpg";
import coorgImg from "../assets/images/coorg.jpg";
import andamanImg from "../assets/images/andaman.jpg";
import udaipurImg from "../assets/images/udaipur.jpg";

const CATEGORIES = [
  { id: "beach", label: "Beach Resorts", icon: <Waves size={16} /> },
  { id: "mountain", label: "Mountain Retreats", icon: <Mountain size={16} /> },
  { id: "forest", label: "Forest Chalets", icon: <Trees size={16} /> },
  { id: "villas", label: "Luxury Villas", icon: <Home size={16} /> },
  { id: "cabins", label: "Rustic Cabins", icon: <Tent size={16} /> },
  { id: "glamping", label: "Glamping Stays", icon: <Sparkles size={16} /> },
  { id: "island", label: "Private Islands", icon: <Palmtree size={16} /> },
  { id: "camping", label: "Eco Camping", icon: <Compass size={16} /> },
  { id: "pet", label: "Pet Friendly", icon: <PawPrint size={16} /> },
  { id: "family", label: "Family Stays", icon: <HeartHandshake size={16} /> }
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Goa Coastline",
    location: "West Coast, India",
    rating: 4.9,
    price: 8000,
    image: goaImg,
    category: "beach"
  },
  {
    id: 2,
    name: "Manali Peaks",
    location: "Himachal Pradesh, India",
    rating: 4.8,
    price: 6500,
    image: manaliImg,
    category: "mountain"
  },
  {
    id: 3,
    name: "Kerala Backwaters",
    location: "South Coast, India",
    rating: 4.9,
    price: 9000,
    image: keralaImg,
    category: "beach"
  },
  {
    id: 4,
    name: "Coorg Coffee Estate",
    location: "Karnataka Hills, India",
    rating: 4.7,
    price: 7500,
    image: coorgImg,
    category: "forest"
  },
  {
    id: 5,
    name: "Andaman Shore",
    location: "Bay of Bengal, India",
    rating: 4.9,
    price: 12000,
    image: andamanImg,
    category: "island"
  },
  {
    id: 6,
    name: "Udaipur Lake Palace",
    location: "Rajasthan, India",
    rating: 4.8,
    price: 11000,
    image: udaipurImg,
    category: "villas"
  },
];

function PopularDestinations() {
  const [activeCategory, setActiveCategory] = useState("beach");
  const [wishlist, setWishlist] = useState({});
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef(null);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter destinations by category or show fallback list
  const filteredDestinations = DESTINATIONS.filter(
    (dest) => dest.category === activeCategory || activeCategory === "all"
  );

  const handleNext = () => {
    if (sliderIndex < filteredDestinations.length - 3) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  return (
    <section className="destinations" id="explore">
      <div className="container">
        
        {/* Categories Tab Bar */}
        <div className="categories-tab-bar">
          <div className="categories-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-item-tab ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSliderIndex(0); // Reset index on tab change
                }}
              >
                {cat.icon}
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div className="section-header-row">
          <div>
            <span className="section-tag">Popular Destinations</span>
            <h2 className="section-title">Trending Vacation Stays</h2>
            <p className="section-subtitle">
              Discover gorgeous corners around the world, verified for absolute comfort and luxury.
            </p>
          </div>
          
          {/* Navigation Slider Buttons */}
          {filteredDestinations.length > 3 && (
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
                className={`slider-ctrl-btn ${sliderIndex >= filteredDestinations.length - 3 ? "disabled" : ""}`}
                onClick={handleNext}
                disabled={sliderIndex >= filteredDestinations.length - 3}
                aria-label="Next stays"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Card Carousel Slider */}
        <div className="destinations-carousel-wrapper">
          <div 
            className="destinations-carousel-track"
            ref={sliderRef}
            style={{
              transform: `translateX(-${sliderIndex * (100 / 3)}%)`
            }}
          >
            {filteredDestinations.map((dest) => (
              <div className="destination-slide-card" key={dest.id}>
                <div className="destination-img-wrapper">
                  <img src={dest.image} alt={dest.name} className="destination-img" />
                  <button 
                    className={`destination-bookmark ${wishlist[dest.id] ? "active" : ""}`}
                    aria-label="Bookmark destination"
                    onClick={(e) => toggleWishlist(dest.id, e)}
                  >
                    <Heart size={16} fill={wishlist[dest.id] ? "#EF4444" : "none"} />
                  </button>
                </div>
                <div className="destination-info">
                  <div className="destination-top">
                    <h3 className="destination-name">{dest.name}</h3>
                    <span className="destination-rating">
                      <Star size={14} fill="#C2A878" color="#C2A878" /> {dest.rating}
                    </span>
                  </div>
                  <div className="destination-details">
                    <span className="destination-loc">
                      <MapPin size={12} /> {dest.location}
                    </span>
                    <span className="destination-price">
                      from <span>₹{dest.price}</span>/night
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDestinations.length === 0 && (
              <div className="no-destinations-fallback">
                <p>No verified stays available for this category yet. Checking with Rivo...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default PopularDestinations;