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
  const [editStates, setEditStates] = useState({});
  const navigate = useNavigate();

  const STATUS_OPTIONS = [
    "Order placed",
    "Verified",
    "Ready to dispatch",
    "Out for delivery",
    "Delivered",
  ];

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

  const handleInputChange = (orderId, field, value) => {
    setEditStates((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  const handleSave = async (orderId) => {
    const edits = editStates[orderId];
    if (!edits || !edits.status) {
      alert("Status is required.");
      return;
    }
    if (!STATUS_OPTIONS.includes(edits.status)) {
      alert(`Status must be one of: ${STATUS_OPTIONS.join(", ")}`);
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${api_path}/admin/update-status/${orderId}`, {
        status: edits.status,
        discountprice:
          edits.discountprice !== undefined
            ? Number(edits.discountprice)
            : undefined,
      });
      const response = await axios.get(`${api_path}/admin/printorders`);
      setOrders(
        Array.isArray(response.data.orders) ? response.data.orders : []
      );
      setEditStates((prev) => {
        const n = { ...prev };
        delete n[orderId];
        return n;
      });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update print order.");
    } finally {
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
            autoComplete="current-password"
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
          <th style={{ width: "250px" }}>Status</th>
          <th>Discount Price</th>
          <th>Full Name</th>
          <th>Mobile Number</th>
          <th>File</th>
          <th>Color</th>
          <th>Sides</th>
          <th>Binding</th>
          <th>No. of Copies</th>
          <th>Original Price</th>
          <th>Roll Number</th>
          <th>College Name</th>
          <th>Year</th>
          <th>Branch</th>
          <th>Address</th>
          <th>Description</th>
          <th>Transaction ID</th>
          <th>Order Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 && (
          <tr>
            <td colSpan="19">No orders available</td>
          </tr>
        )}
        {orders.map((order) => {
          const edits = editStates[order._id] || {};
          return (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                <select
                  style={{ width: "230px" }}
                  value={edits.status ?? order.status ?? "Order placed"}
                  onChange={(e) =>
                    handleInputChange(order._id, "status", e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td>{order.discountprice ?? "-"}</td>
              <td>{order.fullName ?? "-"}</td>
              <td>{order.mobile ?? "-"}</td>
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
              <td>{order.color ?? "-"}</td>
              <td>{order.sides ?? "-"}</td>
              <td>{order.binding ?? "-"}</td>
              <td>{order.copies ?? "-"}</td>
              <td>{order.originalprice ?? "-"}</td>
              <td>{order.rollno ?? "-"}</td>
              <td>{order.college ?? "-"}</td>
              <td>{order.year ?? "-"}</td>
              <td>{order.section ?? "-"}</td>
              <td>{order.address ?? "-"}</td>
              <td>{order.description ?? "-"}</td>
              <td>
                {order.transctionid && order.transctionid !== "-" ? (
                  <a
                    href={order.transctionid}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Transaction
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "-"}
              </td>
              <td>
                <button
                  className="admin-btn"
                  onClick={() => handleSave(order._id)}
                  disabled={loading}
                >
                  Save
                </button>
              </td>
            </tr>
          );
        })}
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
