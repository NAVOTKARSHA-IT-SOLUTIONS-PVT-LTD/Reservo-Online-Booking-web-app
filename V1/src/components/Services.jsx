import React from "react";
import "./Services.css";

const EXPERIENCES = [
  {
    id: 1,
    title: "Luxury Spa Rituals",
    description: "Restore clarity and balance with hand-tailored botanical therapies, hot volcanic stones, and master therapists.",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Private Yacht Charters",
    description: "Explore remote sandbars, crystal lagoons, and sunset sail routes with a private catamaran fleet and dedicated chef.",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Helicopter Coastline Tours",
    description: "Take in stunning volcanic peaks, majestic cascading waterfalls, and oceanic vistas from premium custom heights.",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Bespoke Safari Treks",
    description: "Capture majestic animal migration, track rare reserve species, and enjoy sunset dining amidst open savanna peaks.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80"
  }
];

function Services() {
  return (
    <section className="services" id="experiences">
      <div className="container">
        <span className="section-tag">Luxury Curated Programs</span>
        <h2 className="section-title">Experiences Beyond Stays</h2>
        <p className="section-subtitle">
          Immerse yourself in authentic custom adventures mapped by local culture and elite hospitality experts.
        </p>

        <div className="experiences-grid">
          {EXPERIENCES.map((exp) => (
            <div className="experience-card" key={exp.id}>
              <div className="experience-img-wrapper">
                <img src={exp.image} alt={exp.title} className="experience-img" />
              </div>
              <div className="experience-info">
                <h3 className="experience-title">{exp.title}</h3>
                <p className="experience-desc">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;