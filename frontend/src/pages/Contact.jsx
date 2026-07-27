import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <>
      {/* Hero */}

      <section className="contact-hero">

        <div className="container">

          <span className="section-tag">
            Contact Reservo
          </span>

          <h1>
            We'd Love <br /> To Hear From You
          </h1>

          <p>
            Whether you're planning your next luxury vacation or need booking
            assistance, our travel experts are always ready to help.
          </p>

        </div>

      </section>

      {/* Contact */}

      <section className="contact">

        <div className="container contact-grid">

          {/* Left */}

          <div className="contact-info">

            <span className="small-title">
              GET IN TOUCH
            </span>

            <h2>
              Let's Plan Your Next Luxury Escape
            </h2>

            <p>
              Have questions about bookings, resorts, or special offers?
              Our friendly team is available 24/7 to assist you.
            </p>

            <div className="info-card">

              <div className="info-icon">📍</div>

              <div>

                <h4>Office</h4>

                <p>Pune, Maharashtra, India</p>

              </div>

            </div>

            <div className="info-card">

              <div className="info-icon">📞</div>

              <div>

                <h4>Phone</h4>

                <p>+91 98765 43210</p>

              </div>

            </div>

            <div className="info-card">

              <div className="info-icon">✉</div>

              <div>

                <h4>Email</h4>

                <p>support@reservo.com</p>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="contact-form">

            <h2>
              Send a Message
            </h2>

            <form>

              <input
                type="text"
                placeholder="Full Name"
              />

              <input
                type="email"
                placeholder="Email Address"
              />

              <input
                type="text"
                placeholder="Subject"
              />

              <textarea
                rows="6"
                placeholder="Tell us how we can help..."
              ></textarea>

              <button type="submit">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* Map */}

      <section className="map">

        <div className="container">

          <span className="section-tag">
            Visit Us
          </span>

          <h2 className="section-title">
            Our Office Location
          </h2>

          <p className="section-subtitle">
            Feel free to visit or schedule a meeting with our travel consultants.
          </p>

          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Pune&output=embed"
            loading="lazy"
          ></iframe>

        </div>

      </section>

    </>
  );
}

export default Contact;