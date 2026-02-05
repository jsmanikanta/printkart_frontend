import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/styles.css";
import { api_path } from "../data";
import Signup from "./Signup";
import Loader from "./Loading";

function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation handlers
  const soon = () => {
    navigate("/soon");
  };
  const Login = () => {
    navigate("/login");
  };
  const Signin = () => {
    navigate("/signup");
  };

  const goToPrintKart = () => {
    window.location.href = "https://printkart.onrender.com";
  };

  const Accounts = () => {
    navigate("/accounts");
  };

  const sellbook = () => {
    navigate("/sellbooks");
  };

  const previous = () => {
    navigate("/previous-papers");
  };
  // Fetch user profile for the header
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${api_path}/user/printorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.user) {
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="phone-container">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for books, authors, subjects..."
            />
            <button type="submit">🔍</button>
          </div>
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-background"></div>
            <div className="hero-content">
              <div className="hero-text">
                <h2>
                  Buy Sell Old Books.
                  <br />
                  Order Printout Instantly!
                </h2>
              </div>
              <div className="hero-image">
                <img src="/images/book-illustration.png" alt="Books" />
              </div>
            </div>
          </section>

          {/* Featured Books Section */}
          <section className="featured-books">
            <h3 className="section-title">Books Category</h3>
            <div className="book-cards">
              <div
                className="book-card school-books"
                style={{ background: "#6BB6FF" }}
              >
                <div className="book-info " onClick={soon}>
                  <h4>School Books</h4>
                  <p>From Class 6 to 12-All Boards Covered!</p>
                </div>
              </div>
              <div
                className="book-card college-books"
                style={{ background: "#4C80E6" }}
              >
                <div className="book-info" onClick={soon}>
                  <h4>College University Books</h4>
                  <p>
                    Semester Books for Every Stream B.Tech, B.Com, B.A & More
                  </p>
                </div>
              </div>
              <div
                className="book-card competitive-books"
                style={{ background: "#FF7A5A" }}
              >
                <div className="book-info" onClick={soon}>
                  <h4>Competitive Exam Books</h4>
                  <p>Crack NEET, JEE, UPSC & More Top-Selling Prep Books!</p>
                </div>
              </div>
              <div
                className="book-card fiction-books"
                style={{ background: "#9B69D4" }}
              >
                <div className="book-info" onClick={soon}>
                  <h4>Fictional Books</h4>
                  <p>Get Lost in Imaginary Worlds - Novels, Fantasy & More</p>
                </div>
              </div>
              <div
                className="book-card novels-books"
                style={{ background: "#57C97A" }}
              >
                <div className="book-info" onClick={soon}>
                  <h4>Novels Storybooks</h4>
                  <p>Feel Every Emotion - Romantic, Classic & Hindi Stories</p>
                </div>
              </div>
              <div
                className="book-card notes-books"
                style={{ background: "#FF9C5B" }}
              >
                <div className="book-info" onClick={soon}>
                  <h4>Notes Study Materials</h4>
                  <p>
                    Handwritten Notes, Assignments & Projects - All in One
                    Place!
                  </p>
                </div>
              </div>
              <div
                className="book-card papers-books"
                style={{ background: "#6BB6FF" }}
              >
                <div className="book-info" onClick={previous}>
                  <h4>Previous Year Papers</h4>
                  <p>
                    Practice with Real Questions – Boards, Competitive &
                    University Exams!
                  </p>
                </div>
              </div>
              <div
                className="book-card non-fiction-books"
                style={{ background: "#A56D52" }}
              >
                <div className="book-info" onClick={soon}>
                  <h4>Non-Fiction Books</h4>
                  <p>Real Stories, Real Knowledge - Self-Help to Science</p>
                </div>
              </div>
            </div>
          </section>

          {/* Printouts Categories */}
          <section className="printouts-section">
            <h3 className="section-title">Printouts Categories</h3>

            <div className="printout-categories">
              <div className="printout-item" onClick={goToPrintKart}>
                <img
                  src="/images/spiral-binding-icon.png"
                  alt="Spiral binding"
                />
                <span>B&W or color</span>
              </div>

              <div className="printout-item" onClick={goToPrintKart}>
                <img src="/images/assignments-icon.png" alt="Assignments" />
                <span>Spiral binding</span>
              </div>

              <div className="printout-item" onClick={goToPrintKart}>
                <img
                  src="/images/project-report-icon.png"
                  alt="Project Report"
                />
                <span>Assignment</span>
              </div>

              <div className="printout-item" onClick={goToPrintKart}>
                <img src="/images/bw-color-icon.png" alt="BW Color" />
                <span>Project Report</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default HomePage;
