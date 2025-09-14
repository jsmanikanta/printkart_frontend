import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/accounts.css";
import { api_path } from "../data";
import Loader from "./Loading";
import Footer from "./Footer";

function Cart() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
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
        console.error("Failed to fetch user profile:", error);
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
    <div className="container">
      {/* User Profile Section */}
      <section className="accounts-profile">
        <h2>{user.fullname}'s Profile</h2>
        <div>Email: {user.email}</div>
        <div>Mobile: {user.mobileNumber}</div>
      </section>
      {/* Orders Table */}
      <h3 style={{ marginTop: "36px" }}>Your Print Orders</h3>
      <div className="accounts-orders-list">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>File</th>
              <th>Color</th>
              <th>Sides</th>
              <th>Binding</th>
              <th>Copies</th>
              <th>College</th>
              <th>Year</th>
              <th>Section</th>
              <th>Address</th>
              <th>Description</th>
              <th>Transaction ID</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="16" style={{ textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id || order.id}>
                  <td>{order._id || order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td>{order.mobile}</td>
                  <td>
                    {order.file ? (
                      <a
                        href={order.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{order.color}</td>
                  <td>{order.sides}</td>
                  <td>{order.binding}</td>
                  <td>{order.copies}</td>
                  <td>{order.college || "-"}</td>
                  <td>{order.year || "-"}</td>
                  <td>{order.section || "-"}</td>
                  <td>{order.description || "-"}</td>
                  <td>{order.address || "-"}</td>
                  <td>{order.transctionid}</td>
                  <td>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Cart;
