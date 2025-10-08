import React, { useEffect, useState } from "react";
import axios from "axios";
import { api_path } from "../data";
import "./styles/accounts.css";

const BoughtBooks = () => {
  const [boughtBooks, setBoughtBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoughtBooks = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${api_path}/user/broughtbooks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.boughtBooks)) {
          setBoughtBooks(response.data.boughtBooks);
        } else {
          setBoughtBooks([]);
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("Error fetching bought books:", err);
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              err.response.statusText || "Unauthorized"
            }`
          );
        } else if (err.request) {
          setError("Network error: No response received.");
        } else {
          setError(`Request error: ${err.message}`);
        }
        setBoughtBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtBooks();
  }, []);

  if (loading) return <div>Loading your bought books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-orders-section bought-books-list">
      <section className="orders-profile">
        <h2>Your Purchased Books</h2>
      </section>
      <div className="orders-list">
        {boughtBooks.length === 0 ? (
          <div className="orders-empty">You have not bought any books yet.</div>
        ) : (
          <ul>
            {boughtBooks.map(({ orderId, book, review }) => (
              <li key={orderId} className="order-card bought-book-item">
                <div className="order-card-row order-card-summary">
                  <h3 className="order-card-label">{book.name}</h3>
                </div>
                {book.image && (
                  <div className="book-image-container">
                    <img
                      src={
                        book.image
                      }
                      alt={book.name}
                      className="book-image"
                    />
                  </div>
                )}

                <p>{book.description}</p>
                <p>
                  <span className="order-card-label">Price:</span> ₹{book.price}
                </p>
                <p>
                  <span className="order-card-label">Condition:</span>{" "}
                  {book.condition}
                </p>
                <p>
                  <span className="order-card-label">Seller:</span>{" "}
                  {book.sellerName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BoughtBooks;
