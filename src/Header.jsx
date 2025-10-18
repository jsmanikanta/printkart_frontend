import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import "./styles/styles.css";

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation handlers
  const goToLogin = () => navigate("/login");
  const goToCart = () => navigate("/prints-cart");
  const goToHome = () => navigate("/");
  const goToHelp = () => navigate("/soon");

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
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={goToHome}>
          <span className="orange">My</span>
          <span className="black">Book</span>
          <span className="gray">Hub</span>
        </h1>
        <div className="header-actions">
          <div className="user-profile" onClick={goToLogin}>
            <div className="user-avatar">
              <img src="/images/user-avatar.png" alt="User" />
            </div>
            <span className="login-text">{userName ? userName : "Login"}</span>
          </div>
          <div className="help-section" onClick={goToHelp}>
            <img src="/images/help-icon.png" alt="Help" className="help-icon" />
            <span className="help-text">Help</span>
          </div>
          <div className="cart-section" onClick={goToCart}>
            <img src="/images/cart-icon.png" alt="Cart" className="cart-icon" />
            <span className="cart-text">My Bag</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
