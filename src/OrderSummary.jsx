import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/ordersummary.css";
import Loader from "./Loading";

function OrderSummary({ bookId, onClose }) {
  const apiPath = import.meta.env.VITE_API;
  const baseUrl = import.meta.env.VITE_BASE_URL || "";

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!bookId || bookId.length !== 24) {
      setError("Invalid Book ID");
      setLoading(false);
      return;
    }

    async function fetchBook() {
      try {
        const res = await axios.get(`${apiPath}/sellbooks/${bookId}`);
        if (res.data?._id) {
          setBook(res.data);
        } else {
          setError("Book not found.");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setError("Book not found.");
        } else {
          setError("Failed to load book details due to server error.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [apiPath, bookId]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiPath}/confirm-order`,
        { bookId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      if (action === "confirm") {
        if (res.data.book) setBook(res.data.book);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) return <div className="os-error">{error}</div>;

  if (!book) return <div className="os-error">Book not found.</div>;

  const imageUrl =
    book.image && book.image.startsWith("uploads")
      ? `${baseUrl}/${book.image.replace(/\\/g, "/").replace(/^[\\/]/, "")}`
      : book.image || "";

  const showSellerContact =
    message.toLowerCase().includes("order confirmed") && book.user;

  return (
    <div className="os-overlay">
      <div className="os-modal">
        <h2 className="os-title">Order Summary</h2>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={book.name}
            style={{ maxWidth: "100%", marginBottom: 16, borderRadius: 8 }}
          />
        )}

        <p>
          <strong>Book name:</strong> {book.name}
        </p>
        <p>
          <strong>Description:</strong> {book.description}
        </p>
        <p>
          <strong>Condition:</strong> {book.condition}
        </p>
        <p className="os-price">
          <strong>Price:</strong> ₹{book.updatedPrice ?? book.price}
        </p>

        {message && (
          <p
            className={`os-message ${
              message.toLowerCase().includes("error") ? "os-error" : "os-success"
            }`}
          >
            {message}
          </p>
        )}

        {showSellerContact ? (
          <div className="os-seller-contact">
            <h3>Seller Contact Details</h3>
            <p>Name: {book.user.fullname}</p>
            <p>Email: {book.user.email}</p>
            <p>Mobile: {book.user.mobileNumber}</p>
            <div className="os-buttons">
              <a href={`mailto:${book.user.email}`}>
                <button>Contact Seller by Email</button>
              </a>
              <a href={`tel:${book.user.mobileNumber}`} style={{ marginLeft: 10 }}>
                <button>Call Seller</button>
              </a>
            </div>
          </div>
        ) : (
          <div className="os-buttons">
            <button
              disabled={actionLoading}
              onClick={() => handleAction("confirm")}
              className="os-btn os-confirm"
            >
              {actionLoading ? "Confirming..." : "Confirm"}
            </button>
            <button
              disabled={actionLoading}
              onClick={() => {
                handleAction("decline");
                onClose?.();
              }}
              className="os-btn os-decline"
            >
              {actionLoading ? "Declining..." : "Decline"}
            </button>
          </div>
        )}
        <button onClick={onClose} className="os-close-btn">
          Close
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
