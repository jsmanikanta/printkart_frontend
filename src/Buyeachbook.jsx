import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/buyeachbook.css";
import Loader from "./Loading";

function Buyeachbook() {
  const { id } = useParams();
  const apiPath = import.meta.env.VITE_API_PATH;
  const baseUrl = import.meta.env.VITE_BASE_URL || "";

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch book details on component mount or id change
  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await axios.get(`${apiPath}/books/${id}`);
        const bookData = res.data.book || res.data;
        if (
          bookData &&
          bookData.status === "Accepted" &&
          bookData.soldstatus === "Instock"
        ) {
          setBook(bookData);
          setErrorMsg("");
        } else {
          setErrorMsg("Book not found or unavailable.");
        }
      } catch (error) {
        setErrorMsg("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [apiPath, id]);

  // Handle the buy now click
  const handleBuyNow = async () => {
    if (!window.confirm(`Do you want to confirm purchasing "${book.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Please login to continue.");
        return;
      }
      const response = await axios.post(
        `${apiPath}/books/confirm-order`,
        { bookId: id, action: "confirm" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setOrderConfirmed(true);
        setErrorMsg("");
      } else {
        setErrorMsg("Failed to confirm the order, please try again.");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Order confirmation failed."
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  if (errorMsg) {
    return <div style={{ color: "red" }}>{errorMsg}</div>;
  }

  if (!book) {
    return <div>Book not found.</div>;
  }

  const imagePath =
    book.image && book.image.startsWith("uploads")
      ? `${baseUrl}/${book.image.replace(/\\/g, "/").replace(/^[\\/]/, "")}`
      : book.image || "";

  return (
    <div className="book-details-container">
      <div className="book-image-section">
        {imagePath ? (
          <img
            src={imagePath}
            alt={book.name}
            className="book-details-image"
            style={{ maxWidth: 300, borderRadius: 8 }}
          />
        ) : (
          <div
            className="book-no-image"
            style={{
              width: 300,
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#aaa",
            }}
          >
            No Image
          </div>
        )}
      </div>

      <div className="book-info-section">
        <h2>{book.name}</h2>
        <p>{book.description}</p>
        <p>Category: {book.categeory}</p>
        <p>Condition: {book.condition}</p>
        <p>Price: ₹{book.updatedPrice ?? book.price}</p>

        {!orderConfirmed && (
          <button
            onClick={handleBuyNow}
            style={{
              marginTop: 20,
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "24px",
              padding: "12px 36px",
              fontWeight: "700",
              fontSize: "1.1rem",
              boxShadow: "0 6px 15px rgb(16, 200, 138)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 8px 20px rgb(16, 200, 138)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 6px 15px rgb(16, 200, 138)";
            }}
          >
            Buy Now
          </button>
        )}

        {orderConfirmed && book.user && (
          <div style={{ marginTop: 20, color: "green", fontWeight: "bold" }}>
            <h3>Order Confirmed!</h3>
            <p>
              Seller Name: <strong>{book.user.fullname}</strong>
            </p>
            <p>
              Email: <a href={`mailto:${book.user.email}`}>{book.user.email}</a>
            </p>
            <p>
              Mobile:{" "}
              <a href={`tel:${book.user.mobileNumber}`}>
                {book.user.mobileNumber}
              </a>
            </p>
            <button
              onClick={() => {
                window.location.href = `/seller-profile/${book.user.id}`;
              }}
              style={{
                marginTop: 10,
                padding: "8px 24px",
                borderRadius: 10,
                cursor: "pointer",
                backgroundColor: "#1e90ff",
                color: "white",
                fontWeight: "600",
                border: "none",
              }}
            >
              View Seller's Profile
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ color: "red", marginTop: 10 }}>{errorMsg}</div>
        )}
      </div>
    </div>
  );
}

export default Buyeachbook;
