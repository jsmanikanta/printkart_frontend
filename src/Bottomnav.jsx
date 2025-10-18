import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/styles.css";
function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const soon = () => {
    navigate("/soon");
  };
  const cat = () => {
    navigate("/all-categories");
  };
  const [clicked, setClicked] = useState(false);

  const handlePrintClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    navigate("/orderprints");
  };

  const printAnimation = {
    animation: "pulseScale 1s infinite",
    border: "none",
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${isActive("/") ? "active" : ""}`}
        onClick={() => navigate("/")}
        aria-label="Home"
      >
        <img src="/images/home-icon.png" alt="Home" />
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${isActive("/my-book") ? "active" : ""}`}
        onClick={() => navigate("/soon")}
        aria-label="My book"
      >
        <img src="/images/my-book-icon.png" alt="My book" />
        <span>My book</span>
      </button>

      <button
        className={`nav-item ${isActive("/sellbooks") ? "active" : ""}`}
        onClick={() => navigate("/soon")}
        aria-label="Sell Now"
      >
        <img src="/images/sell-now-icon.png" alt="Sell Now" />
        <span>Sell Now</span>
      </button>

      <button
        className={`nav-item ${isActive("/all-categories") ? "active" : ""}`}
        onClick={cat}
        aria-label="Category"
      >
        <img src="/images/category-icon.png" alt="Category" />
        <span>Category</span>
      </button>

      <button
        className={`nav-item ${isActive("/orderprints") ? "active" : ""}`}
        onClick={handlePrintClick}
        aria-label="Print"
      >
        <img src="/images/print-icon.png" alt="Print" style={printAnimation} />
        <span>Print</span>
      </button>
    </nav>
  );
}

export default BottomNav;
