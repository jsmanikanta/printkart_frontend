import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import Loader from "./Loading";
import "./styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      // Not logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${api_path}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Your backend returns the user object directly (not { user: ... })
        const u = response?.data;

        if (u && u._id) {
          setUser(u);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err);

        // Token expired/invalid
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem("token");
        }
        setUser(null);
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
        <p>Please login to view your profile.</p>
        <button className="profile-login-btn" onClick={goToLogin}>
          Login
        </button>
      </div>
    );
  }

  // ✅ According to your backend output fields
  const name = user?.fullname || "User";
  const email = user?.email || "";
  const phone = user?.mobileNumber || "";

  const birthday = user?.birthday
    ? new Date(user.birthday).toLocaleDateString()
    : "";
  const location = user?.location || "";
  const college = user?.college || "";
  const year = user?.year || "";
  const branch = user?.branch || "";
  const rollno = user?.rollno || "";
  const usertype = user?.usertype || "";

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

      {/* Extra details (from backend output) */}
      <div className="profile-details">
        {usertype ? (
          <div className="profile-text">User Type: {usertype}</div>
        ) : null}
        {birthday ? (
          <div className="profile-text">Birthday: {birthday}</div>
        ) : null}
        {location ? (
          <div className="profile-text">Location: {location}</div>
        ) : null}
        {college ? (
          <div className="profile-text">College: {college}</div>
        ) : null}
        {year ? <div className="profile-text">Year: {year}</div> : null}
        {branch ? <div className="profile-text">Branch: {branch}</div> : null}
        {rollno ? <div className="profile-text">Roll No: {rollno}</div> : null}
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
