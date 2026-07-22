import React from "react";
import "./PopularDestinations.css";

const destinations = [
  {
    id: 1,
    name: "Goa",
    resorts: "120+ Luxury Resorts",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Manali",
    resorts: "85+ Mountain Resorts",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Kerala",
    resorts: "95+ Nature Resorts",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Udaipur",
    resorts: "70+ Heritage Resorts",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Coorg",
    resorts: "55+ Nature Retreats",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Andaman",
    resorts: "40+ Beach Resorts",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
];

function PopularDestinations() {
  return (
    <section className="destinations">

      <div className="container">

        <span className="section-tag">
          ✈ Explore India
        </span>

        <h2 className="section-title">
          Popular Destinations
        </h2>

        <p className="section-subtitle">
          Discover breathtaking destinations and luxury resorts carefully selected for unforgettable vacations.
        </p>

        <div className="destination-grid">

          {destinations.map((item) => (

            <div className="destination-card" key={item.id}>

              <img src={item.image} alt={item.name} />

              <div className="overlay">

                <div>

                  <h3>{item.name}</h3>

                  <p>{item.resorts}</p>

                </div>

                <button>
                  Explore →
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default PopularDestinations;