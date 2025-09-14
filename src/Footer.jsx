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
      <div className="footer-header-row">
        <span>About Us</span>
        <span>Books</span>
        <span>Printouts</span>
        <span>Other Services</span>
        <span>Contact Us</span>
      </div>
      <div className="footer-container">
        <div className="footer-column about">
          <p>
            Book Hub is a student-friendly platform to buy and sell old books and order customized printouts easily. We aim to make learning materials affordable, accessible, and sustainable by connecting students to share resources, save time, and reduce costs—whether it’s selling used books, ordering printouts, or donating to those in need.
          </p>
        </div>
        <div className="footer-column">
          <ul>
            <li>School Books (class 6-12)</li>
            <li>Competitive Books (GATE, JEE, etc.)</li>
            <li>Diploma Books</li>
            <li>B.Sc / B.Com / B.A Books</li>
            <li>Fantasy Books</li>
            <li>Non-Fantasy Books</li>
          </ul>
        </div>
        <div className="footer-column">
          <ul>
            <li>Assignments</li>
            <li>Project Reports</li>
            <li>Class Notes</li>
            <li>College Notices / PDFs</li>
            <li>Spiral Binding Books</li>
            <li>Black & White / Color Prints</li>
          </ul>
        </div>
        <div className="footer-column">
          <ul>
            <li>Book Donation Requests</li>
            <li>Seller Registration</li>
            <li>PrintKart Service Partner</li>
          </ul>
        </div>
        <div className="footer-column contacts">
          <p>
            Hemanth Rishi: <a href="tel:+919182415750">+91 9182415750</a>
          </p>
          <p>
            Praneeth: <a href="tel:+918074177294">+91 8074177294</a>
          </p>
          <p>
            Ayush Kumar: <a href="tel:+917989221628">+91 7989221628</a>
          </p>
          <p>
            Lokesh: <a href="tel:+919398892297">+91 9398892297</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Book Hub. All rights reserved.</p>
        <button className="admin-short-btn" onClick={admin}>Admin</button>
      </div>
    </footer>
  );
}

export default Footer;
