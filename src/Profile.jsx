import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import Loader from "./Loading";
import "./styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${api_path}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.user) {
          setUser(response.data.user);
          setOrders(response.data.orders || []);
        } else {
          setUser(null);
          setOrders([]);
        }
      } catch (err) {
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Navigation
  const goToLogin = () => navigate("/login");
  const goToPickupAddress = () => navigate("/pickup-address");
  const goToWishlist = () => navigate("/wishlist");
  const goToOrderHistory = () => navigate("/orders");
  const goToHelp = () => navigate("/help");
  const goToSettings = () => navigate("/settings");

  // Loading UI
  if (loading) {
    return (
      <div className="profile-loading">
        <Loader />
      </div>
    );
  }

  // Not logged in UI
  if (!user) {
    return (
      <div className="profile-login-prompt">
        <p>Please login to view your profile and orders.</p>
        <button className="profile-login-btn" onClick={goToLogin}>
          Login
        </button>
      </div>
    );
  }

  // User data
  const name = user?.name || user?.fullName || "User";
  const email = user?.email || "";
  const phone = user?.phone || user?.mobile || "";

  return (
    <div className="profile-page">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.015-8 4.5V20h16v-1.5c0-2.485-3.582-4.5-8-4.5Z"
              fill="#111"
            />
          </svg>
        </div>

        <div className="profile-info">
          <div className="profile-name">{String(name).toUpperCase()}</div>
          {email ? <div className="profile-text">{email}</div> : null}
          {phone ? <div className="profile-text">{phone}</div> : null}
        </div>
      </div>

      {/* Menu */}
      <div className="profile-menu">
        <MenuItem
          title="Pickup Address"
          icon="📍"
          arrow
          onClick={goToPickupAddress}
        />
        <MenuItem title="Wishlist" icon="♡" onClick={goToWishlist} />
        <MenuItem title="Order History" icon="⏱" onClick={goToOrderHistory} />
        <MenuItem title="Help & Support" icon="🎧" onClick={goToHelp} />
        <MenuItem title="Setting" icon="⚙️" arrow onClick={goToSettings} />
      </div>

      {/* Optional quick stat */}
      {/* <div className="profile-stats">
        <div className="profile-stat-card">
          <div className="profile-stat-title">Total Orders</div>
          <div className="profile-stat-value">{orders.length}</div>
        </div>
      </div> */}
    </div>
  );
}

function MenuItem({ title, icon, arrow, onClick }) {
  return (
    <button className="profile-menu-item" onClick={onClick} type="button">
      <div className="profile-menu-left">
        <span className="profile-menu-icon">{icon}</span>
        <span className="profile-menu-title">{title}</span>
      </div>

      {arrow ? (
        <span className="profile-menu-arrow">›</span>
      ) : (
        <span className="profile-menu-empty" />
      )}
    </button>
  );
}
