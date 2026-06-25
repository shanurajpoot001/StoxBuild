import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container p-5 mb-5 not-found-page page-transition">
      <div className="row text-center">
        <h1 className="mt-5 hero-title" style={{ fontSize: "4rem" }}>404</h1>
        <p className="hero-subtitle">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary btn-premium btn-gradient btn-cta mt-4" style={{ display: "inline-block", width: "auto" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
