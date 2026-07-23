import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: "★★★★★",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Reservo made our honeymoon unforgettable. The booking process was seamless, and the resort was even more beautiful than the pictures.",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Ahmedabad",
    rating: "★★★★★",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "The luxury stay, exceptional hospitality, and smooth booking experience exceeded all our expectations. Highly recommended!",
  },
  {
    id: 3,
    name: "Aman Verma",
    location: "Delhi",
    rating: "★★★★★",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    review:
      "One of the finest resort booking platforms. Premium resorts, transparent pricing, and outstanding customer support.",
  },
];

function Testimonials() {
  return (
    <section className="testimonials">

      <div className="container">

        <span className="section-tag">
          Guest Reviews
        </span>

        <h2 className="section-title">
          What Our Guests Say
        </h2>

        <p className="section-subtitle">
          Thousands of travelers trust Reservo for unforgettable luxury vacations.
        </p>

        <div className="testimonial-grid">

          {testimonials.map((item) => (

            <div className="testimonial-card" key={item.id}>

              <div className="quote">
                “
              </div>

              <img
                src={item.image}
                alt={item.name}
                className="user-image"
              />

              <div className="stars">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="review">
                {item.review}
              </p>

              <h3>{item.name}</h3>

              <span className="location">
                {item.location}
              </span>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;