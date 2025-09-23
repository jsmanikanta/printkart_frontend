import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/accounts.css";
import Loader from "./Loading";

function SoldBooks() {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const [soldStatuses, setSoldStatuses] = useState({}); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserBooks = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${baseUrl}/user/soldbooks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setUser(response.data.user);
          setBooks(response.data.books || []);
          // Initialize soldStatuses from fetched books
          const statuses = {};
          (response.data.books || []).forEach((b) => {
            statuses[b.id || b._id] = b.soldStatus || b.status || "Instock";
          });
          setSoldStatuses(statuses);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUserBooks();
  }, [api_path]);

  // Optional: function to update soldstatus in backend when changed
  const updateSoldStatus = async (bookId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${api_path}/books/updateSoldStatus/${bookId}`,
        { soldstatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update sold status", err);
    }
  };

  const handleSoldChange = (e, bookId) => {
    e.stopPropagation(); // prevent card toggle
    const val = e.target.value;
    setSoldStatuses((prev) => ({ ...prev, [bookId]: val }));
    updateSoldStatus(bookId, val);
  };

  if (loading)
    return (
      <div className="orders-loading">
        <Loader />
      </div>
    );

  if (!user) {
    return (
      <div className="orders-login-prompt">
        Please{" "}
        <a href="/login" className="orders-login-btn">
          sign in
        </a>{" "}
        to view your profile and sold books.
      </div>
    );
  }

  return (
    <div className="user-orders-section">
      <section className="orders-profile">
        <h2>{user.fullname}'s Profile</h2>
        <div className="orders-contact">Email: {user.email}</div>
        <div className="orders-contact">Mobile: {user.mobileNumber}</div>
      </section>
      <div className="orders-title">Your Sold Books</div>
      <div className="orders-list">
        {books.length === 0 ? (
          <div className="orders-empty">No sold books found.</div>
        ) : (
          books.map((book) => {
            const bookId = book._id || book.id;
            const imagePath = book.image
              ? `${baseUrl}/uploads/${book.image.replace(/^uploads[\\/]/, "")}`
              : null;

            return (
              <div
                key={bookId}
                className={`order-card ${
                  expandedBookId === bookId ? "expanded" : ""
                }`}
                onClick={() =>
                  setExpandedBookId(expandedBookId === bookId ? null : bookId)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="order-card-row order-card-summary">
                  <div className="soldbook-image">
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={book.name}
                        style={{
                          width: 58,
                          height: 58,
                          objectFit: "cover",
                          borderRadius: "8px",
                          background: "#f3f3f3",
                        }}
                        loading="lazy"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 8,
                          background: "#e9e9e9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          color: "#aaa",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="soldbook-main">
                    <div className="soldbook-title">{book.name}</div>
                    <div className="soldbook-price-status">
                      <span className="soldbook-price">₹{book.price}</span>
                    </div>
                    <span
                      className={`soldbook-status ${
                        book.status === "Sold" ? "sold" : ""
                      }`}
                    >
                      Status {book.status}
                    </span>
                  </div>
                  <div className="expand-arrow" style={{ marginLeft: "auto" }}>
                    {expandedBookId === bookId ? "▲" : "▼"}
                  </div>
                </div>
                {expandedBookId === bookId && (
                  <div className="order-card-info soldbook-info-expand">
                    <div>
                      <span className="order-card-label">Condition:</span>{" "}
                      {book.condition}
                    </div>
                    <div>
                      <span className="order-card-label">Description:</span>{" "}
                      {book.description}
                    </div>
                    <div>
                      <span className="order-card-label">Location:</span>{" "}
                      {book.location}
                    </div>
                    <div>
                      <span className="order-card-label">Category:</span>{" "}
                      {book.category}
                    </div>
                    <div>
                      <span className="order-card-label">Sell Type:</span>{" "}
                      {book.sellType}
                    </div>
                    <div className="desc-box">
                      <label>Sold Status</label>
                      <select
                        value={soldStatuses[bookId] || "Instock"}
                        onChange={(e) => handleSoldChange(e, bookId)}
                        onClick={(e) => e.stopPropagation()}
                        required
                      >
                        <option value="Instock">Instock</option>
                        <option value="Soldout">Soldout</option>
                        <option value="Orderd">Orderd</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <button className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default SoldBooks;
