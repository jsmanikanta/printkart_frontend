import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import "./styles/header.css";

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation handlers
  const goToLogin = () => navigate("/login");
  const goToCart = () => navigate("/prints-cart");
  const goToSold = () => navigate("/soldbooks");
  const goToHome = () => navigate("/");

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setUserName(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${api_path}/user/printorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.user) {
          setUserName(
            response.data.user.fullname || response.data.user.name || null
          );
        } else {
          setUserName(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        setUserName(null);
        localStorage.removeItem("token");
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={goToHome}></div>
        <span className="app-title" onClick={goToHome}>
          My <span style={{ color: "#f8bb44" }}>Book</span> Hub
        </span>
      </div>
      <div className="navbar-center">
        <input className="searchinput" placeholder="Search" />
        <button className="searchicon"></button>
      </div>
      <div className="navbar-right">
        <button className="icon-button" onClick={goToLogin}>
          <i className="fa-solid fa-user"></i>
          <span className="icon-label">{userName ? userName : "Login"}</span>
        </button>
        <button className="icon-button" onClick={goToCart}>
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="icon-label">Prints</span>
        </button>
        <button className="icon-button" onClick={goToSold}>
          <i className="fa-solid fa-book"></i>
          <span className="icon-label">My Books</span>
        </button>
        <button>
          <span className="icon-label">Books</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
