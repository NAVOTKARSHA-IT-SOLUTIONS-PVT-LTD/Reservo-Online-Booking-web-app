import React, { useState } from "react";
import { Heart, Star, MapPin } from "lucide-react";
import "./PopularDestinations.css";

// Import local images from Aditya's assets
import goaImg from "../assets/images/goa.jpg";
import manaliImg from "../assets/images/manali.jpg";
import keralaImg from "../assets/images/kerala.jpg";
import coorgImg from "../assets/images/coorg.jpg";
import andamanImg from "../assets/images/andaman.jpg";
import udaipurImg from "../assets/images/udaipur.jpg";

const DESTINATIONS = [
  {
    id: 1,
    name: "Goa",
    location: "West Coast, India",
    rating: 4.9,
    price: 8000,
    image: goaImg,
  },
  {
    id: 2,
    name: "Manali",
    location: "Himachal Pradesh, India",
    rating: 4.8,
    price: 6500,
    image: manaliImg,
  },
  {
    id: 3,
    name: "Kerala",
    location: "South India Coast, India",
    rating: 4.9,
    price: 9000,
    image: keralaImg,
  },
  {
    id: 4,
    name: "Coorg",
    location: "Karnataka Hills, India",
    rating: 4.7,
    price: 7500,
    image: coorgImg,
  },
  {
    id: 5,
    name: "Andaman",
    location: "Bay of Bengal, India",
    rating: 4.9,
    price: 12000,
    image: andamanImg,
  },
  {
    id: 6,
    name: "Udaipur",
    location: "Rajasthan, India",
    rating: 4.8,
    price: 11000,
    image: udaipurImg,
  },
];

function PopularDestinations() {
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="destinations" id="explore">
      <div className="container">
        <span className="section-tag">Popular Destinations</span>
        <h2 className="section-title">Trending Vacation Stays</h2>
        <p className="section-subtitle">
          Discover gorgeous corners across India, verified for absolute comfort, style, and luxury.
        </p>

        <div className="destinations-grid">
          {DESTINATIONS.map((dest) => (
            <div className="destination-card" key={dest.id}>
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
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;