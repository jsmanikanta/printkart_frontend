import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/footer.css";

function Footer() {
  const navigate = useNavigate();

  const admin = () => {
    navigate("/adminprints");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            My Book Hub is an online platform designed for students to buy and
            sell old books and order customized printouts with ease. We believe
            that learning materials should be affordable, accessible, and
            sustainable. Students can connect, share, and support each other
            while saving time and money. Whether selling previous semester
            books, ordering printouts from mobile, or donating materials to
            those in need, we make it simple.
          </p>
          <button className="admin-short-btn" onClick={admin}>
            Admin
          </button>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <div className="category-links">
            <div className="category-column">
              <h5>Books</h5>
              <ul>
                <li>School Books (Class 6–12)</li>
                <li>Competitive Exam Books (GATE, UPSC, etc.)</li>
                <li>Diploma / Polytechnic Books</li>
                <li>B.Sc / B.Com / B.A Books</li>
                <li>Engineering Books (CSE, ME, ECE, etc.)</li>
                <li>Fantasy Books</li>
                <li>Non-Fantasy Books</li>
              </ul>
            </div>
            <div className="category-column">
              <h5>Printouts</h5>
              <ul>
                <li>Assignments</li>
                <li>Project Reports</li>
                <li>Class Notes</li>
                <li>College Notices / PDFs</li>
                <li>Spiral Bound Notebooks</li>
                <li>Black & White / Color Prints</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 My Book Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
