import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/accounts.css";
import Loader from "./Loading";
import { api_path } from "../data";
import EmptyBag from "../public/images/openbag.jpg";
import prints from "../public/images/spiral-binding-icon.png";
import { useNavigate } from "react-router-dom";

function CartMobile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      } catch {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const navigate = useNavigate();
  const goToPrints = () => navigate("/orderprints");

  if (loading)
    return (
      <div className="orders-loading">
        <Loader />
      </div>
    );

  if (!user) {
    return (
      <div className="orders-login-prompt" style={{ justifyContent: "center" }}>
        <br />
        Please{" "}
        <a href="/login" className="orders-login-btn">
          Login
        </a>{" "}
        to view your profile and orders.
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="cart-mobile-root">
        <header className="cart-header">
          <span className="cart-title">My Bag</span>
        </header>

        <div className="cart-tabs">
          <span className="cart-tab">Books Vault</span>
          <span className="cart-tab cart-tab-active">Print Zone</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-bag">
            <img src={EmptyBag} alt="Empty bag" className="empty-bag-img" />
            <p className="empty-bag-text">
              Don't leave me empty like this 😢 — add something cute!
            </p>
            <button className="cart-blue-btn" onClick={goToPrints}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-mobile-list">
            {orders.map((order) => (
              <div
                className="cart-mobile-card"
                key={order.id || order._id}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="cart-card-row">
                  <div className="cart-card-icon-area" />
                  <img src={prints} style={{ height: 50, width: 50 }} />
                  <div>
                    <div className="cart-card-title">Printouts</div>
                    <div className="cart-card-meta">
                      Binding: {order.binding || "None"}
                    </div>
                  </div>

                  <div className="cart-card-side">
                    <span className="cart-card-oldprice">
                      {order.originalprice && <>₹{order.originalprice}</>}
                    </span>
                    <span className="cart-card-price">
                      ₹{order.discountprice || order.originalprice}
                    </span>
                    <div className="cart-card-qty">
                      Qty: {order.copies || "-"}
                    </div>
                    <div className="cart-card-qty">
                      Order Status: {order.status}
                    </div>
                  </div>
                </div>

                <div className="cart-card-link">View Details →</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- Screen 2: Order Details ----
  // ---- Screen 2: Order Details ----
return (
  <div className="order-detail-mobile">
    <header className="cart-header">
      <span className="cart-back" onClick={() => setSelectedOrder(null)}>
        ←
      </span>
      <span className="cart-title">Order Details</span>
    </header>

    <div className="order-detail-info">
      <div className="detail-field">
        <span className="detail-label">Order ID:</span>{" "}
        {selectedOrder.id || selectedOrder._id}
      </div>

      <div className="detail-field">
        <span className="detail-label">Name:</span> {selectedOrder.name}
      </div>

      <div className="detail-field">
        <span className="detail-label">Mobile:</span> {selectedOrder.mobile}
      </div>

      <div className="detail-field">
        <span className="detail-label">Payment Mode:</span>{" "}
        {selectedOrder.payment}
      </div>

      <div className="detail-field">
        <span className="detail-label">File:</span>{" "}
        {selectedOrder?.file ? (
          <a
            href={selectedOrder.file}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="detail-field">
        <span className="detail-label">Final Price:</span> ₹
        {selectedOrder.discountprice || selectedOrder.price}
      </div>

      <div className="detail-field">
        <span className="detail-label">Original Price:</span> ₹
        {selectedOrder.originalprice}
      </div>

      <div className="detail-field">
        <span className="detail-label">Color:</span> {selectedOrder.color}
      </div>

      <div className="detail-field">
        <span className="detail-label">Side(s):</span> {selectedOrder.sides}
      </div>

      <div className="detail-field">
        <span className="detail-label">Binding:</span> {selectedOrder.binding}
      </div>

      <div className="detail-field">
        <span className="detail-label">Copies:</span> {selectedOrder.copies}
      </div>

      <div className="detail-field">
        <span className="detail-label">Address:</span>{" "}
        {selectedOrder.address ? (
          selectedOrder.address
        ) : (
          <div style={{ display: "inline-block" }}>
            {selectedOrder.college && (
              <div>
                <strong>College:</strong> {selectedOrder.college} <br />
              </div>
            )}
            {selectedOrder.year && (
              <div>
                <strong>Year:</strong> {selectedOrder.year} <br />
              </div>
            )}
            {selectedOrder.rollno && (
              <div>
                <strong>Roll No:</strong> {selectedOrder.rollno} <br />
              </div>
            )}
            {selectedOrder.section && (
              <div>
                <strong>Branch:</strong> {selectedOrder.section} <br />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="detail-field">
        <span className="detail-label">Description:</span>{" "}
        {selectedOrder.description || "-"}
      </div>
      <div className="detail-field">
        <span className="detail-label">Mode of Payment:</span>{" "}
        {selectedOrder.payment || "-"}
      </div>

        <div className="detail-field">
  <span className="detail-label">Transaction Details:</span>{" "}
  
  {selectedOrder.transactionid ? (
    <a
      href={selectedOrder.transactionid}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Details
    </a>
  ) : (
    <span>Pay on delivery</span>
  )}
</div>

      

      <div className="detail-field">
        <span className="detail-label">Order Date:</span>{" "}
        {selectedOrder.orderDate
          ? new Date(selectedOrder.orderDate).toLocaleString()
          : "-"}
      </div>
    </div>
  </div>
);
}

export default CartMobile;
