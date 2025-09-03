import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/header.css";
import { api_path } from "../data";

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation handlers
  const Login = () => navigate("/login");
  const Accounts = () => navigate("/accounts");

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
        const response = await axios.get(`${api_path}/user/profile`, {
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
        setLoading(false); // Fix: always stop loading
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false); // Double safety!
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <header className="navbar">
      <div className="logo" onClick={() => navigate("/")}></div>
      <div className="navsearch">
        <input placeholder="Search" className="searchinput" />
        <div className="searchicon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <div className="sign">
        <i className="fa-solid fa-user fa-lg" style={{ padding: "20px" }}></i>
        <div className="sign-in">
          <p className="hello">
            Hello,{" "}
            {userName ? (
              <button
                className="user"
                onClick={Accounts}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              >
                {userName}
              </button>
            ) : (
              <button
                className="user"
                onClick={Login}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              >
                sign in
              </button>
            )}
          </p>
          <b>
            <button
              className="user"
              onClick={Accounts}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              <span className="options">Accounts &amp; Lists</span>
            </button>
          </b>
        </div>
      </div>
      <div className="carts ca">
        <i
          className="fa-solid fa-cart-shopping"
          style={{ paddingBottom: "20px" }}
        ></i>
        <button className="user">
          <span className="cart">My cart</span>
          <sup className="notification">1</sup>
        </button>
      </div>
    </header>
  );
}

export default Header;
