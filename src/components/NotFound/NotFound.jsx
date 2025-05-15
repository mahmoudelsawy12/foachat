import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h2 className="mb-3">404 - Page Not Found</h2>
      <p className="mb-4">Oops! The page you're looking for doesn't exist.</p>
      <button className="not-found" onClick={() => navigate("/home")}>
        Go to Home
      </button>
    </div>
  );
}

export default NotFound;
