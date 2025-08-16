import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/accounts.css";
import { api_path } from "../data";
import Loader from "./Loading";

function Accounts() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);

  const navigate = useNavigate();
  const Login = () => navigate("/login");
  const AccountsNav = () => navigate("/accounts");

  // Fetch user info and orders for Accounts page
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${api_path}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setUser(response.data.user);
          setOrders(response.data.orders || []);
          setUserName(response.data.user.fullname);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) return <div className="orders-loading">Loading...</div>;

  if (!user) {
    return (
      <>
        {loading ? (
          <loading />
        ) : (
          <div>
            <header className="navbar">
              <div className="logo" onClick={() => navigate("/")}></div>
              <div className="navsearch">
                <input placeholder="Search" className="searchinput" />
                <div className="searchicon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
              <div className="sign">
                <i
                  className="fa-solid fa-user fa-lg"
                  style={{ padding: "20px" }}
                ></i>
                <div className="sign-in">
                  <p className="hello">
                    Hello,{" "}
                    <button
                      className="user"
                      onClick={Login}
                      style={{ background: "none", border: "none" }}
                    >
                      sign in
                    </button>
                  </p>
                  <b>
                    <button
                      className="user"
                      onClick={AccountsNav}
                      style={{ background: "none", border: "none" }}
                    >
                      <span className="options">Accounts &amp; Lists</span>
                    </button>
                  </b>
                </div>
              </div>
              <div className="carts ca">
                <i
                  className="fa-solid fa-cart-shopping"
                  style={{ paddingBottom: "20px" }}
                ></i>
                <button className="user">
                  <span className="cart">My cart</span>
                  <sup className="notification">1</sup>
                </button>
              </div>
            </header>
            <div className="orders-login-prompt">
              Please{" "}
              <a href="/login" className="orders-login-btn">
                sign in
              </a>{" "}
              to view your profile and orders.
            </div>
            <Footer />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="navbar">
        <div className="logo" onClick={() => navigate("/")}></div>
        <div className="navsearch">
          <input placeholder="Search" className="searchinput" />
          <div className="searchicon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="sign">
          <i className="fa-solid fa-user fa-lg" style={{ padding: "20px" }}></i>
          <div className="sign-in">
            <p className="hello">
              Hello,{" "}
              {userName ? (
                <button
                  className="user"
                  onClick={AccountsNav}
                  style={{ background: "none", border: "none" }}
                >
                  {userName}
                </button>
              ) : (
                <button
                  className="user"
                  onClick={Login}
                  style={{ background: "none", border: "none" }}
                >
                  sign in
                </button>
              )}
            </p>
            <b>
              <button
                className="user"
                onClick={AccountsNav}
                style={{ background: "none", border: "none" }}
              >
                <span className="options">Accounts &amp; Lists</span>
              </button>
            </b>
          </div>
        </div>
        <div className="carts ca">
          <i
            className="fa-solid fa-cart-shopping"
            style={{ paddingBottom: "20px" }}
          ></i>
          <button className="user">
            <span className="cart">My cart</span>
            <sup className="notification">1</sup>
          </button>
        </div>
      </header>

      {/* User profile and orders */}
      <section className="user-orders-section">
        <div className="orders-profile">
          <h2>{user.fullname}'s Profile</h2>
          <span className="orders-contact">
            Email: {user.email} | Mobile: {user.mobileNumber}
          </span>
        </div>
        <h3 className="orders-title">Your Print Orders</h3>
        {orders.length === 0 ? (
          <div className="orders-empty">No orders found.</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const fileLabel = order.file
                ? order.file.split("/").pop()
                : "Download";

              // Use backend-provided full URL directly
              const fileUrl = order.file || "#";

              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileLabel);
              const isPDF = /\.pdf$/i.test(fileLabel);

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-card-row">
                    <b>File: </b>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-file-link"
                    >
                      {fileLabel}
                    </a>
                  </div>

                  {isImage && (
                    <div style={{ margin: "10px 0" }}>
                      <img
                        src={fileUrl}
                        alt={fileLabel}
                        style={{
                          maxWidth: 220,
                          maxHeight: 220,
                          borderRadius: 7,
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}

                  {isPDF && (
                    <div style={{ margin: "10px 0" }}>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#04793f", fontWeight: 600 }}
                      >
                        Open PDF
                      </a>
                    </div>
                  )}

                  <div className="order-card-info">
                    <div>
                      <b>Ordered By:</b> {user.fullname}
                    </div>
                    <div>
                      <b>Email:</b> {user.email}
                    </div>
                    <div>
                      <b>Mobile:</b> {user.mobileNumber}
                    </div>
                    <div>
                      <b>Delivery Address:</b> {order.address}
                    </div>
                    <div>
                      <b>Order Date:</b> {formatDate(order.orderDate)}
                    </div>
                    <div>
                      <b>Copies:</b> {order.copies}
                    </div>
                    {order.cost !== undefined && (
                      <div className="order-cost">
                        <b>Cost:</b>{" "}
                        <span className="order-cost-highlight">
                          ₹
                          {Number(order.cost).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
}

function Footer() {
  return (
    <footer className="pageend">
      <div className="about">
        <h2>About Us</h2>
        <p>
          Book Hub is a student-friendly platform to buy and sell old books and
          order customized printouts easily. We aim to make learning materials
          affordable, accessible, and sustainable by connecting students to
          share resources, save time, and reduce costs—whether it’s selling used
          books, ordering printouts, or donating to those in need.
        </p>
      </div>
      <div className="categories">
        <div className="list1">
          <h3>Books</h3>
          <ul>
            <li>School Books (class 6-12)</li>
            <li>Competitive Books (GATE, JEE, etc.)</li>
            <li>Diploma books</li>
            <li>B.Sc / B.Com / B.A Books</li>
            <li>Fantasy Books</li>
            <li>Non-Fantasy Books</li>
          </ul>
        </div>
        <div className="list2">
          <h3>Printouts</h3>
          <ul>
            <li>Assignments</li>
            <li>Project Reports</li>
            <li>Class Notes</li>
            <li>College Notice / PDFs</li>
            <li>Spiral Binding Books</li>
            <li>Black &amp; White / Color Prints</li>
          </ul>
        </div>
      </div>
      <div className="otherservices">
        <h2>Other Services</h2>
        <ul>
          <li>Book Donation Requests</li>
          <li>Seller Registration</li>
          <li>PrintKart Service Partner</li>
        </ul>
      </div>
      <div className="contacts">
        <h2>Contact Us</h2>
        <p>
          Hemanth Rishi: <a href="tel:+919182415750">+91 91824 15750</a>
        </p>
        <p>
          Praneeth: <a href="tel:+918074177294">+91 80741 77294</a>
        </p>
        <p>
          Ayush Kumar: <a href="tel:+917989221628">+91 79892 21628</a>
        </p>
        <p>
          Lokesh: <a href="tel:+919398892297">+91 93988 92297</a>
        </p>
      </div>
    </footer>
  );
}

export default Accounts;
