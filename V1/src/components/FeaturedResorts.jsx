import React from "react";
import "./FeaturedResorts.css";
import { FaHeart } from "react-icons/fa";
import manali from "../assets/images/manali.jpg";
import goa from "../assets/images/goa.jpg";
import kerala from "../assets/images/kerala.jpg";
import udaipur from "../assets/images/udaipur.jpg";
import shimla from "../assets/images/shimla.jpg";
import coorg from "../assets/images/coorg.jpg";
import andaman from "../assets/images/andaman.jpg";
import jaipur from "../assets/images/jaipur.jpg";


const resorts = [
  {
    id: 1,
    name: "Mountain Paradise Resort",
    location: "Manali, Himachal Pradesh",
    price: "₹6,500",
    rating: "4.8",
    badge:"Best Seller",
    image: manali,
    amenities: ["Pool", "Spa", "WiFi"],
  },
  {
    id: 2,
    name: "Ocean Breeze Resort",
    location: "Goa",
    price: "₹8,200",
    rating: "4.9",
    badge:"Luxury",
    image: goa,
    amenities: ["Beach", "Restaurant", "Bar"],
  },
  {
    id: 3,
    name: "Green Valley Resort",
    location: "Kerala",
    price: "₹5,900",
    rating: "4.7",
    badge:"Top Rated",
    image: kerala,
    amenities: ["Spa", "Nature", "Pool"],
  },
  {
    id: 4,
    name: "Royal Lake Palace",
    location: "Udaipur",
    price: "₹9,500",
    rating: "4.9",
    badge:"Premium",
    image: udaipur,
    amenities: ["Lake View", "Luxury", "Pool"],
  },
  {
    id: 5,
    name: "Himalayan Bliss Resort",
    location: "Shimla",
    price: "₹7,300",
    rating: "4.8",
    badge:"Nature",
    image: shimla,
    amenities: ["Mountain", "Fireplace", "Spa"],
  },
  {
    id: 6,
    name: "Coorg Nature Retreat",
    location: "Coorg",
    price: "₹6,800",
    rating: "4.8",
    badge:"Editor's Pick",
    image: coorg,
    amenities: ["Coffee Estate", "Pool", "Nature"],
  },
  {
    id: 7,
    name: "Sunrise Beach Resort",
    location: "Andaman Islands",
    price: "₹10,200",
    rating: "4.9",
    badge:"Beachfront",
    image: andaman,
    amenities: ["Private Beach", "Diving", "Spa"],
  },
  {
    id: 8,
    name: "The Royal Heritage Resort",
    location: "Jaipur",
    price: "₹8,900",
    rating: "4.7",
    badge:"Heritage",
    image: jaipur,
    amenities: ["Heritage", "Restaurant", "Pool"],
  },
];
  


function FeaturedResorts() {
  return (
    <section className="featured">
      <div className="container">

        <h2 className="section-title">
          Featured Resorts
        </h2>

        <p className="section-subtitle">
          Handpicked luxury resorts for your next unforgettable vacation.
        </p>

        <div className="resorts-grid">

          {resorts.map((resort) => (
            <div className="resort-card" key={resort.id}>

              <div className="image-box">

  <img src={resort.image} alt={resort.name} />

  <span className="badge">
    {resort.badge}
  </span>

  <span className="rating">
    ⭐ {resort.rating}
  </span>

  <div className="wishlist">
    <FaHeart />
  </div>

</div>

              <div className="resort-content">

                <h3>{resort.name}</h3>

                <p className="location">
                  📍 {resort.location}
                </p>

                <div className="amenities">
                  {resort.amenities.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
                </div>

                <div className="bottom">

                  <div>
                    <small>Starting From</small>

                    <h4>
                         {resort.price}
                         <span>/Night</span>
                    </h4>
                  </div>

                      <button className="book-btn">
                          Book Now →
                      </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default FeaturedResorts;