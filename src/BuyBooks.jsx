import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/buybooks.css";

const categories = [
  "School Books",
  "IIT - JEE",
  "Engineering",
  "NEET UG/PG",
  "Medical",
  "B.sc & B.com",
  "GATE",
  "CAT",
  "Bank Exams",
  "RRP",
  "UPSC & APPSC",
  "Others",
];

function BuyBooks() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const api_path = import.meta.env.VITE_API_PATH;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Track selected category

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${api_path}/books`);
        let fetchedBooks = response.data.books || [];
        fetchedBooks = fetchedBooks.map((book) => ({
          ...book,
          category:
            book.category !== undefined
              ? book.category
              : book.categeory !== undefined
              ? book.categeory
              : "-",
        }));
        // We keep all books here, filtering happens during render
        setBooks(fetchedBooks.filter((book) => book.status === "Accepted"));
      } catch (error) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [api_path]);

  if (loading) return <div className="books-loading">Loading...</div>;

  // Filter books by selected category unless "All" is selected
  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  if (!filteredBooks.length)
    return <div className="books-empty">No accepted books found.</div>;

  return (
    <div>
      <nav className="category-navbar">
        <button
          className={`navbar-menu${
            selectedCategory === "All" ? " active" : ""
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          <span className="navbar-icon">&#9776;</span> All
        </button>
        <ul className="category-list">
          {categories.map((cat, idx) => (
            <li
              className={`category-item${
                selectedCategory === cat ? " active" : ""
              }`}
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              style={{ cursor: "pointer" }}
            >
              {cat}
            </li>
          ))}
        </ul>
      </nav>
      <div className="books-grid">
        {filteredBooks.map((book) => {
          const imagePath =
            book.image && book.image.startsWith("uploads")
              ? `${baseUrl}/${book.image.replace(/^[\\/]/, "")}`
              : book.image || "";
          return (
            <div className="book-card" key={book._id}>
              <div className="book-img-wrap">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt={book.name}
                    className="book-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="book-no-image">No Image</div>
                )}
              </div>
              <div className="book-info">
                <div className="book-title" title={book.name}>
                  {book.name}
                </div>
                <div className="book-condition">{book.condition}</div>
                <div className="book-price">
                  ₹{book.updatedPrice ?? book.price}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BuyBooks;
