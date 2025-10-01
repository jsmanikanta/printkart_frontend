import React, { useEffect, useState } from "react";
import axios from "axios";
import { api_path } from "../data";

const BoughtBooks = () => {
  const [boughtBooks, setBoughtBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoughtBooks = async () => {
      try {
        const response = await axios.get(`${api_path}/user/broughtbooks`);
        setBoughtBooks(response.data.boughtBooks || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bought books.");
        setLoading(false);
      }
    };

    fetchBoughtBooks();
  }, []);

  if (loading) return <div>Loading your bought books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bought-books-list">
      <h2>Your Purchased Books</h2>
      {boughtBooks.length === 0 && <p>You have not bought any books yet.</p>}
      <ul>
        {boughtBooks.map(({ orderId, book, review }) => (
          <li key={orderId} className="bought-book-item">
            <h3>{book.name}</h3>
            <p>{book.description}</p>
            <p>Price: ₹{book.price}</p>
            <p>Condition: {book.condition}</p>
            <div>
              <strong>Your Review:</strong> {review || "No review yet"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoughtBooks;
