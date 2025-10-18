import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loading";
import { api_path } from "../data";
import "./styles/adminprints.css";

export default function AdminPrints() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [viewingOrders, setViewingOrders] = useState(false);
  const navigate = useNavigate();
  const Books = () => {
    navigate("/adminbooks");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (username === "admin@mybookhub.com" && password === "Ayush@5121") {
      try {
        const response = await axios.get(`${api_path}/admin/printorders`);
        setOrders(
          Array.isArray(response.data.orders) ? response.data.orders : []
        );
        setViewingOrders(true);
      } catch (error) {
        setErrorMsg(error.response?.data?.error || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg("Invalid username or password");
      setLoading(false);
    }
  };

  if (!viewingOrders) {
    return (
      <div className="admin-container">
        <h2>Admin Login - Prints</h2>
        {errorMsg && <div className="error-msg">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Enter user name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="admin-input"
          />
          <input
            type="password"
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="admin-input"
          />
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? <Loader /> : "Login"}
          </button>
          <button
            type="button"
            className="admin-btn"
            style={{ marginTop: "10px" }}
            onClick={Books}
          >
            Go to Books Orders
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Print Orders</h2>
      <button
        className="admin-btn"
        onClick={Books}
        style={{ marginBottom: 20 }}
      >
        Go to Sold Books Orders
      </button>
      {loading && <Loader />}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Full Name</th>
            <th>Mobile Number</th>
            <th>File</th>
            <th>Color</th>
            <th>Sides</th>
            <th>Binding</th>
            <th>No. of Copies</th>
            <th>Original Price</th>
            <th>Discount Price</th>
            <th>Roll Number</th>
            <th>College Name</th>
            <th>Year</th>
            <th>Branch</th>
            <th>Address</th>
            <th>Description</th>
            <th>Transaction ID</th>
            <th>Order Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="18">No orders available</td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.fullName}</td>
              <td>{order.mobile}</td>
              <td>
                {order.file && order.file !== "-" ? (
                  <a
                    href={order.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>{order.color}</td>
              <td>{order.sides}</td>
              <td>{order.binding}</td>
              <td>{order.copies}</td>
              <td>{order.originalprice}</td>
              <td>{order.discountprice}</td>
              <td>{order.rollno}</td>
              <td>{order.college}</td>
              <td>{order.year}</td>
              <td>{order.section}</td>
              <td>{order.address}</td>
              <td>{order.description}</td>
              <td>{order.transctionid}</td>
              <td>
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "-"}
              </td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="admin-btn"
        onClick={() => {
          setViewingOrders(false);
          setUserName("");
          setPassword("");
          setOrders([]);
          setErrorMsg("");
          localStorage.removeItem("admin_token");
        }}
      >
        Logout
      </button>
    </div>
  );
}
