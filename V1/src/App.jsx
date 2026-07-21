import React from "react";

function App() {
  return (
    <>
      {/* Header */}
      <header
        style={{
          padding: "20px",
          background: "#0F766E",
          color: "white",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Resort Booking
      </header>

      {/* Hero Section */}
      <section className="container">
        <h1 className="section-title mt-5">
          Find Your Dream Resort
        </h1>

        <p className="section-subtitle">
          Discover luxury resorts, villas, cottages, and unforgettable
          experiences across India.
        </p>
      </section>

      {/* Popular Destinations */}
      <section className="container">
        <h2 className="section-title">
          Popular Destinations
        </h2>
      </section>

      {/* Featured Resorts */}
      <section className="container">
        <h2 className="section-title">
          Featured Resorts
        </h2>
      </section>

      {/* Services */}
      <section className="container">
        <h2 className="section-title">
          Our Services
        </h2>
      </section>

      {/* Testimonials */}
      <section className="container">
        <h2 className="section-title">
          Testimonials
        </h2>
      </section>

      {/* FAQ */}
      <section className="container">
        <h2 className="section-title">
          Frequently Asked Questions
        </h2>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#111827",
          color: "white",
          padding: "30px",
          textAlign: "center",
        }}
      >
        © 2026 Resort Booking. All Rights Reserved.
      </footer>
    </>
  );
}

export default App;