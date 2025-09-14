import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/accounts.css";
import Loader from "./Loading";

function SoldBooks() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const api_path = import.meta.env.VITE_API_PATH;

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
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
        const response = await axios.get(`${api_path}/user/soldbooks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setUser(response.data.user);
          setBooks(response.data.books || []);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
        console.error("Failed to fetch sold books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBooks();
  }, [api_path]);

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
    <div className="container">
      <section className="accounts-profile">
        <h2>{user.fullname}'s Profile</h2>
        <div>Email: {user.email}</div>
        <div>Mobile: {user.mobileNumber}</div>
      </section>

      <h3 style={{ marginTop: "36px" }}>Your Sold Books</h3>
      <div className="accounts-orders-list">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Description</th>
              <th>Location</th>
              <th>Category</th>
              <th>Sell Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No sold books found.
                </td>
              </tr>
            ) : (
              books.map((book) => {
                // Safely handle book.image
                const imagePath = book.image
                  ? `${baseUrl}/uploads/${book.image.replace(
                      /^uploads[\\/]/,
                      ""
                    )}`
                  : null;

                return (
                  <tr key={book._id || book.id}>
                    <td>{book.name}</td>
                    <td>
                      {imagePath ? (
                        <img
                          src={imagePath}
                          alt={book.name}
                          style={{ width: "50px", height: "auto" }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{book.price}</td>
                    <td>{book.condition}</td>
                    <td>{book.description}</td>
                    <td>{book.location}</td>
                    <td>{book.category}</td>
                    <td>{book.sellType}</td>
                    <td>{book.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <button className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default SoldBooks;
