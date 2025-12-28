import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/footer.css";

function Footer() {
  const navigate = useNavigate();

  const soon = () => navigate("/soon");
  const Orderprints = () => navigate("/orderprints");
  return (
  <footer className="footer">
    <div
      className="footer-content"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "5px",
      }}
    >
      <div
        className="footer-section"
        style={{ flex: "1 1 250px", minWidth: 220, lineHeight: "0.8" }}
      >
        <h4>About Us</h4>
        <p>
          My Book Hub is an online platform designed for students to buy and sell
          old books and order customized printouts with ease. We believe that
          learning materials should be affordable, accessible, and sustainable.
          Students can connect, share, and support each other while saving time
          and money. Whether selling previous semester books, ordering printouts
          from mobile, or donating materials to those in need, we make it simple.
        </p>
      </div>
      <div
        className="footer-section"
        style={{ flex: "1 1 220px", minWidth: 180 }}
      >
        <h4>Categories</h4>
        <div
          className="category-links"
          style={{ display: "flex", gap: "24px" }}
        >
          <div className="category-column">
            <h5>Books</h5>
            <ul>
              <li onClick={soon}>School Books (Class 6–12)</li>
              <li onClick={soon}>
                Competitive Exam Books (GATE, UPSC, etc.)
              </li>
              <li onClick={soon}>Diploma / Polytechnic Books</li>
              <li onClick={soon}>B.Sc / B.Com / B.A Books</li>
              <li onClick={soon}>Engineering Books (CSE, ME, ECE, etc.)</li>
              <li onClick={soon}>Fantasy Books</li>
              <li onClick={soon}>Non-Fantasy Books</li>
            </ul>
          </div>
          <div className="category-column">
            <h5>Printouts</h5>
            <ul>
              <li onClick={Orderprints}>Assignments</li>
              <li onClick={Orderprints}>Project Reports</li>
              <li onClick={Orderprints}>Class Notes</li>
              <li onClick={Orderprints}>College Notices / PDFs</li>
              <li onClick={Orderprints}>Spiral Bound Notebooks</li>
              <li onClick={Orderprints}>Black & White / Color Prints</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="footer-section"
        style={{ flex: "1 1 200px", minWidth: 150 }}
      >
        <h4>Contacts</h4>
        <div style={{ lineHeight: "0.8" }}>
          <div>
            <strong>Hemanth Rishi</strong>
            <a href="tel:+919182415750">+91 91824 15750</a>
          </div>
          <div style={{ marginTop: 10 }}>
            <strong>Praneeth</strong>
            <a href="tel:+918074177294">+91 80741 77294</a>
          </div>
          <div style={{ marginTop: 10 }}>
            <strong>Lokesh</strong>
            <a href="tel:+918074177294">+91 80741 77294</a>
          </div>
          <div style={{ marginTop: 10 }}>
            <strong>Ayush Kumar</strong>
            <a href="tel:+917989221628">+91 79892 21628</a>
          </div>
        </div>
      </div>
    </div>
    <div style={{ marginTop: "20px", marginBottom: "10px" }}>
      <strong>Mail Us: </strong>
      <a href="mailto:printkart0001@gmail.com">printkart0001@gmail.com</a>
    </div>
    <div className="footer-bottom">
      <p>© 2025 My Book Hub. All rights reserved.</p>
    </div>
  </footer>
  );
}

export default Footer;
