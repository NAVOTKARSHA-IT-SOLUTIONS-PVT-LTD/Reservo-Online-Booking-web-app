import React from "react";
import "./About.css";
import aboutImage from "../assets/images/about.jpg";

function About() {
  return (
    <>

      {/* Hero */}

      <section className="about-hero">

        <div className="container">

          <span className="section-tag">
            About Reservo
          </span>

          <h1>
            Luxury Stays, <br /> Extraordinary Experiences
          </h1>

          <p>
            Reservo is your trusted luxury resort booking platform,
            helping travelers discover premium destinations across India
            with comfort, elegance, and unforgettable hospitality.
          </p>

        </div>

      </section>

      {/* About */}

      <section className="about">

        <div className="container about-grid">

          <div className="about-image">

            <img
              src={aboutImage}
              alt="Luxury Resort"
            />

          </div>

          <div className="about-content">

            <span className="small-title">
              WHO WE ARE
            </span>

            <h2>
              Making Every Journey Truly Memorable
            </h2>

            <p>
              Reservo connects travelers with India's finest luxury resorts,
              boutique stays, villas, and nature retreats. Our carefully
              selected properties ensure comfort, elegance, and exceptional
              experiences.
            </p>

            <p>
              From secure online booking to verified guest reviews and
              dedicated customer support, we simplify every step of your
              vacation planning.
            </p>

            <button className="about-btn">
              Explore Resorts
            </button>

          </div>

        </div>

      </section>

      {/* Mission */}

      <section className="mission">

        <div className="container">

          <span className="section-tag">
            Our Purpose
          </span>

          <h2 className="section-title">
            Built Around Trust & Luxury
          </h2>

          <p className="section-subtitle">
            Everything we do is focused on creating unforgettable travel
            experiences for every guest.
          </p>

          <div className="mission-grid">

            <div className="mission-card">

              <div className="mission-icon">
                🎯
              </div>

              <h3>Our Mission</h3>

              <p>
                To simplify luxury resort booking through technology,
                transparency, and exceptional customer service.
              </p>

            </div>

            <div className="mission-card">

              <div className="mission-icon">
                👁
              </div>

              <h3>Our Vision</h3>

              <p>
                To become India's most trusted premium travel platform
                for unforgettable luxury vacations.
              </p>

            </div>

            <div className="mission-card">

              <div className="mission-icon">
                ❤️
              </div>

              <h3>Our Values</h3>

              <p>
                Trust, honesty, quality, customer satisfaction,
                innovation, and premium hospitality.
              </p>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}

export default About;