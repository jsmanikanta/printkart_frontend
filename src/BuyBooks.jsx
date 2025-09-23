import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/buybooks.css";
import Loader from "./Loading";

const categories = [
  "All",
  "School Books",
  "IIT - JEE",
  "Engineering",
  "NEET UG/PG",
  "Medical",
  "B.sc & B.com",
  "GATE",
  "CAT",
  "Bank Exams",
  "RRB",
  "UPSC & Other state PSC",
  "Others",
];

function BuyBooks() {
  const apiPath = import.meta.env.VITE_API_PATH;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get(`${apiPath}/books/`);
        const acceptedAndInStock = res.data.books.filter(
          (b) => b.status === "Accepted" && (b.soldstatus ? b.soldstatus === "Instock" : true)
        );
        setBooks(
          acceptedAndInStock.map((book) => ({
            ...book,
            category: book.category ?? book.categeory ?? "-",
          }))
        );
      } catch (error) {
        console.error("Error fetching books", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [apiPath]);

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter(
          (book) =>
            book.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div>
      {/* Category Navbar */}
      <nav className="category-navbar">
        <ul className="category-list">
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className={`category-item${selectedCategory === cat ? " active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
              style={{
                cursor: "pointer",
                color: selectedCategory === cat ? "black" : undefined,
                fontWeight: selectedCategory === cat ? "bold" : "normal",
              }}
            >
              {cat === "All" ? <span className="navbar-icon">&#9776; </span> : null}
              {cat}
            </li>
          ))}
        </ul>
      </nav>

      {loading ? (
        <div className="books-loading">
          <Loader />
        </div>
      ) : filteredBooks.length ? (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            // Fix backslashes in image path
            const imageUrl =
              book.image && book.image.startsWith("uploads")
                ? `${baseUrl}/${book.image.replace(/\\/g, "/").replace(/^[\\/]/, "")}`
                : book.image || "";

            return (
              <div
                key={book._id}
                className="book-card"
                onClick={() => navigate(`/book/${book._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="book-img-wrap">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={book.name}
                      className="book-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="book-no-image">No Image</div>
                  )}
                </div>
                <div className="book-info">
                  <div
                    className="book-title"
                    title={book.name}
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {book.name}
                  </div>
                  <div className="book-user-name">
                    {/* Use flat userFullName field here as per backend */}
                    {book.userFullName || ""}
                  </div>
                  <div className="book-price">
                    ₹{book.updatedPrice ?? book.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="books-empty">No accepted books found.</div>
      )}
    </div>
  );
}

export default BuyBooks;
