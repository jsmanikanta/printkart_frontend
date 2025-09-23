import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/buyeachbook.css";
import Loader from "./Loading";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiPath = import.meta.env.VITE_API_PATH;
  const baseUrl = import.meta.env.VITE_BASE_URL || "";

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await axios.get(`${apiPath}/books/${id}`);
        const bookData = res.data.book || res.data;
        if (
          bookData &&
          bookData.status === "Accepted" &&
          (bookData.soldstatus === "Instock" || bookData.soldstatus === "Orderd")
        ) {
          setBook(bookData);
          setErrorMsg("");
        } else {
          setBook(null);
          setErrorMsg("Book not found or unavailable.");
        }
      } catch (error) {
        setBook(null);
        setErrorMsg("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id, apiPath]);

  if (loading)
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  if (errorMsg) return <div>{errorMsg}</div>;

  const imagePath =
    book.image && book.image.startsWith("uploads")
      ? `${baseUrl}/${book.image.replace(/\\/g, "/").replace(/^[\\/]/, "")}`
      : book.image || "";

  const handleBuyNow = () => {
    navigate(`/order-summary/${id}`);
  };

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
          <div className="book-no-image" style={{ width: 300, height: 400 }}>
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
      </div>
    </div>
  );
}

export default BookDetails;
