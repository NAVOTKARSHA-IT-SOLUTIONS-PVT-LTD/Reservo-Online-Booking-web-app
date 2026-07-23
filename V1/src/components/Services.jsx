import React from "react";
import "./Services.css";

const services = [
  {
    id: 1,
    icon: "🏨",
    title: "Luxury Resorts",
    description:
      "Stay at handpicked luxury resorts with world-class hospitality and premium comfort.",
  },
  {
    id: 2,
    icon: "🏊",
    title: "Infinity Pools",
    description:
      "Relax in stunning infinity pools overlooking mountains, lakes, and beaches.",
  },
  {
    id: 3,
    icon: "🍽️",
    title: "Fine Dining",
    description:
      "Enjoy gourmet cuisines crafted by award-winning chefs with breathtaking views.",
  },
  {
    id: 4,
    icon: "💆",
    title: "Spa & Wellness",
    description:
      "Rejuvenate your body and mind with luxurious spa and wellness experiences.",
  },
  {
    id: 5,
    icon: "🚁",
    title: "Private Experiences",
    description:
      "Book exclusive helicopter rides, yacht cruises, and personalized adventures.",
  },
  {
    id: 6,
    icon: "🎉",
    title: "Events & Weddings",
    description:
      "Celebrate weddings, anniversaries, and corporate events at stunning venues.",
  },
];

function Services() {
  return (
    <section className="services">

      <div className="container">

        <span className="section-tag">
          Premium Experiences
        </span>

        <h2 className="section-title">
          Luxury Services Designed For You
        </h2>

        <p className="section-subtitle">
          From luxury stays to unforgettable experiences, Reservo offers
          everything needed for a perfect vacation.
        </p>

        <div className="services-grid">

          {services.map((service) => (

            <div className="service-card" key={service.id}>

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <button className="service-btn">
                Learn More →
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Services;