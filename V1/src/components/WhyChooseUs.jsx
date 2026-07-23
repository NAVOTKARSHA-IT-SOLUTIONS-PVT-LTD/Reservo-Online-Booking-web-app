import React from "react";
import "./WhyChooseUs.css";

const features = [
  {
    id: 1,
    icon: "🏨",
    title: "500+ Luxury Resorts",
    description:
      "Discover handpicked luxury resorts, villas, and boutique stays across India's most beautiful destinations.",
  },
  {
    id: 2,
    icon: "🛡️",
    title: "Secure Booking",
    description:
      "Book confidently with encrypted payments, instant confirmation, and trusted partners.",
  },
  {
    id: 3,
    icon: "⭐",
    title: "Verified Reviews",
    description:
      "Read genuine reviews and ratings from thousands of satisfied travelers before booking.",
  },
  {
    id: 4,
    icon: "📞",
    title: "24/7 Concierge",
    description:
      "Our travel experts are available around the clock to help plan your perfect vacation.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why">

      <div className="container">

        <span className="section-tag">
          Why Reservo
        </span>

        <h2 className="section-title">
          Why Travelers Choose Reservo
        </h2>

        <p className="section-subtitle">
          Experience luxury, comfort, and seamless booking with India's
          trusted premium resort platform.
        </p>

        <div className="why-grid">

          {features.map((feature) => (

            <div className="why-card" key={feature.id}>

              <div className="why-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

            </div>

          ))}

        </div>

        {/* Statistics */}

        <div className="why-stats">

          <div className="stat">

            <h2>500+</h2>

            <p>Luxury Resorts</p>

          </div>

          <div className="stat">

            <h2>150+</h2>

            <p>Destinations</p>

          </div>

          <div className="stat">

            <h2>50K+</h2>

            <p>Happy Guests</p>

          </div>

          <div className="stat">

            <h2>4.9★</h2>

            <p>Average Rating</p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WhyChooseUs;