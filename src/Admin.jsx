import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { api_path } from "../data";
import Loader from "./Loading";

import "./styles/admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [viewingOrders, setViewingOrders] = useState(false);

  const Login = () => {
    navigate("/login");
  };

  const Orderprints = () => {
    navigate("/orderprints");
  };

  const Accounts = () => {
    navigate("/accounts");
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (username === "abc@gmail.com" && password === "abc") {
      setLoading(true);
      try {
        const response = await axios.get(`${api_path}/admin/printorders`);
        setOrders(response.data.orders);
        setViewingOrders(true);
      } catch (error) {
        setErrorMsg(error.response?.data?.error || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg("Invalid username or password");
    }
  };

  // Render login form
  if (!viewingOrders) {
    return (
      <div className="admin-container">
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
                {Admin ? (
                  <button
                    className="user"
                    onClick={Accounts}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                  >
                    {Admin}
                  </button>
                ) : (
                  <button
                    className="user"
                    onClick={Login}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                  >
                    sign in
                  </button>
                )}
              </p>
              <b>
                <button
                  className="user"
                  onClick={Accounts}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
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
        <h2>Admin Login</h2>
        {errorMsg && <div className="error-msg">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Enter user name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="admin-input"
          />
          <input
            type="password"
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="admin-input"
          />
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <footer className="pageend">
          <div className="about">
            <h2>About Us</h2>
            <p>
              Book Hub is a student-friendly platform to buy and sell old books
              and order customized printouts easily. We aim to make learning
              materials affordable, accessible, and sustainable by connecting
              students to share resources, save time, and reduce costs—whether
              it’s selling used books, ordering printouts, or donating to those
              in need.
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
      </div>
    );
  }

  return (
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
          <i className="fa-solid fa-user fa-lg" style={{ padding: "20px" }}></i>
          <div className="sign-in">
            <p className="hello">
              Hello,{" "}
              {Admin ? (
                <button
                  className="user"
                  onClick={Accounts}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  {Admin}
                </button>
              ) : (
                <button
                  className="user"
                  onClick={Login}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  sign in
                </button>
              )}
            </p>
            <b>
              <button
                className="user"
                onClick={Accounts}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
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
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>View PDF</th>
            <th>Color</th>
            <th>Sides</th>
            <th>Binding</th>
            <th>No. of Copies</th>
            <th>College</th>
            <th>Year</th>
            <th>Class & Section</th>
            <th>Address</th>
            <th>Description</th>
            <th>Transaction ID</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="16" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id || order._id}>
                <td>{order.id || order._id || "-"}</td>
                <td>{order.name || order.user?.fullname || "-"}</td>
                <td>{order.email || order.user?.email || "-"}</td>
                <td>{order.mobile || order.user?.mobileNumber || "-"}</td>
                <td>
                  {order.file ? (
                    <a
                      href={`${api_path}/${order.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{order.color || "-"}</td>
                <td>{order.sides || "-"}</td>
                <td>{order.binding || "-"}</td>
                <td>{order.copies != null ? order.copies : "-"}</td>
                <td>{order.college || "-"}</td>
                <td>{order.year || "-"}</td>
                <td>{order.section || "-"}</td>
                <td>{order.address || "-"}</td>
                <td>{order.description || "-"}</td>
                <td>{order.transctionid || "-"}</td>
                <td>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <footer className="pageend">
        <div className="about">
          <h2>About Us</h2>
          <p>
            Book Hub is a student-friendly platform to buy and sell old books
            and order customized printouts easily. We aim to make learning
            materials affordable, accessible, and sustainable by connecting
            students to share resources, save time, and reduce costs—whether
            it’s selling used books, ordering printouts, or donating to those in
            need.
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
    </div>
  );
}
