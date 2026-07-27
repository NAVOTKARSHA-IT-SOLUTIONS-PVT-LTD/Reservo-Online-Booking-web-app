import React from "react";
import { Quote, Star } from "lucide-react";
import "./Testimonials.css";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    review: "Reservo made our honeymoon unforgettable. The booking process was seamless, and the resort was even more beautiful than the pictures."
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Ahmedabad, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    review: "The luxury stay, exceptional hospitality, and smooth booking experience exceeded all our expectations. Highly recommended!"
  },
  {
    id: 3,
    name: "Aman Verma",
    location: "Delhi, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    review: "One of the finest resort booking platforms. Premium resorts, transparent pricing, and outstanding customer support."
  }
];

function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <span className="section-tag">Guest Reviews</span>
        <h2 className="section-title">What Our Guests Say</h2>
        <p className="section-subtitle">
          Thousands of travelers trust Reservo for unforgettable luxury vacations.
        </p>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <div className="testimonial-card" key={item.id}>
              <div className="quote-icon">
                <Quote size={32} fill="rgba(194, 168, 120, 0.1)" color="rgba(194, 168, 120, 0.2)" />
              </div>

              <p className="review">{item.review}</p>

              <div className="testimonial-user">
                <img src={item.image} alt={item.name} className="user-image" />
                <div className="user-info">
                  <h3>{item.name}</h3>
                  <span className="location">{item.location}</span>
                </div>
                <div className="stars">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#C2A878" color="#C2A878" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;