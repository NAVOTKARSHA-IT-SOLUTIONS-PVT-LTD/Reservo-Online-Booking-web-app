import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <section className="not-found">

      <div className="container">

        <span className="section-tag">
          Error 404
        </span>

        <h1>Oops!</h1>

        <h2>
          This Page Doesn't Exist
        </h2>

        <p>
          The page you're looking for may have been moved, deleted,
          or never existed. Let's get you back to exploring luxury
          destinations.
        </p>

        <Link to="/" className="home-btn">
          ← Back to Home
        </Link>

      </div>

    </section>
  );
}

export default NotFound;