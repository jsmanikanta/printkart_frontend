import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/accounts.css";
import { api_path } from "../data";
import Loader from "./Loading";

function Cart() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Only one open
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${api_path}/user/printorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setUser(response.data.user);
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading)
    return (
      <div className="orders-loading">
        <Loader />
      </div>
    );

  if (!user) {
    return (
      <div className="orders-login-prompt">
        Please{" "}
        <a href="/login" className="orders-login-btn">
          sign in
        </a>{" "}
        to view your profile and orders.
      </div>
    );
  }

  return (
    <div className="user-orders-section">
      <section className="orders-profile">
        <h2>{user.fullname}'s Profile</h2>
        <div className="orders-contact">Email: {user.email}</div>
        <div className="orders-contact">Mobile: {user.mobileNumber}</div>
      </section>
      <div className="orders-title">Your Print Orders</div>
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="orders-empty">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id || order.id}
              className={`order-card ${
                expandedOrderId === (order._id || order.id) ? "expanded" : ""
              }`}
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === (order._id || order.id)
                    ? null
                    : order._id || order.id
                )
              }
            >
              <div className="order-card-row order-card-summary">
                <div>
                  <span className="order-card-label">Order ID:</span>{" "}
                  {order._id || order.id}
                </div>
                <div>
                  <span className="order-card-label">Date:</span>{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "-"}
                </div>
                <div>
                  <span className="order-card-label">Name:</span> {order.name}
                </div>
                {order.file ? (
                  <a
                    className="order-file-link"
                    href={order.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View File
                  </a>
                ) : (
                  <span className="order-file-link">No File</span>
                )}
                <div className="expand-arrow">
                  {expandedOrderId === (order._id || order.id) ? "▲" : "▼"}
                </div>
              </div>
              {expandedOrderId === (order._id || order.id) && (
                <div className="order-card-info">
                  <div>
                    <span className="order-card-label">Email:</span>{" "}
                    {order.email}
                  </div>
                  <div>
                    <span className="order-card-label">Mobile:</span>{" "}
                    {order.mobile}
                  </div>
                  <div>
                    <span className="order-card-label">Color:</span>{" "}
                    {order.color}
                  </div>
                  <div>
                    <span className="order-card-label">Sides:</span>{" "}
                    {order.sides}
                  </div>
                  <div>
                    <span className="order-card-label">Binding:</span>{" "}
                    {order.binding}
                  </div>
                  <div>
                    <span className="order-card-label">Copies:</span>{" "}
                    {order.copies}
                  </div>
                  <div>
                    <span className="order-card-label">College:</span>{" "}
                    {order.college || "-"}
                  </div>
                  <div>
                    <span className="order-card-label">Year:</span>{" "}
                    {order.year || "-"}
                  </div>
                  <div>
                    <span className="order-card-label">Section:</span>{" "}
                    {order.section || "-"}
                  </div>
                  <div>
                    <span className="order-card-label">Address:</span>{" "}
                    {order.address || "-"}
                  </div>
                  <div>
                    <span className="order-card-label">Description:</span>{" "}
                    {order.description || "-"}
                  </div>
                  <div>
                    <span className="order-card-label">Transaction ID:</span>{" "}
                    {order.transctionid}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <button className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Cart;
