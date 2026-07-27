import React from "react";
import "./Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">

      <div className="container">

        <div className="newsletter-box">

          <span className="section-tag">
            Stay Connected
          </span>

          <h2>
            Unlock Exclusive Luxury Travel Deals
          </h2>

          <p>
            Join thousands of travelers and receive exclusive resort offers,
            early access to seasonal discounts, travel inspiration, and premium
            vacation ideas directly in your inbox.
          </p>

          <form className="newsletter-form">

            <input
              type="email"
              placeholder="Enter your email address"
            />

            <button type="submit">
              Subscribe
            </button>

          </form>

          <div className="newsletter-features">

            <span>✓ Exclusive Discounts</span>

            <span>✓ No Spam</span>

            <span>✓ Weekly Travel Tips</span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Newsletter;