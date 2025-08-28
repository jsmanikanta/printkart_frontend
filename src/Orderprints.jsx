import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import "./styles/orderprints.css";
import qrImg from "./images/qr.jpg";
import Loader from "./Loading";

const COLOR_OPTIONS = [
  { value: "b/w", label: "Black & White" },
  { value: "colour", label: "Colour" },
];
const SIDES_OPTIONS = [
  { value: "1", label: "Single Side" },
  { value: "2", label: "Double Side" },
];
const BINDING_OPTIONS = [
  { value: "none", label: "None" },
  { value: "spiral", label: "spiral-binding" },
  { value: "stick", label: "Stick file" },
  { value: "soft", label: "Soft Binding" },
  { value: "book", label: "Book Binding" },
];

export default function OrderPrints() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);
  const [activeTab, setActiveTab] = useState("student");

  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [color, setColor] = useState("b/w");
  const [sides, setSides] = useState("1");
  const [binding, setBinding] = useState("none");
  const [copies, setcopies] = useState(1);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [transctionid, setTransctionid] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");

  // Added state for student details
  const [collegeYear, setCollegeYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserName(null);
      return;
    }
    fetch(`${import.meta.env.VITE_API_PATH}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUserName(d?.user?.fullname || null))
      .catch(() => setUserName(null));
  }, []);

  const handleFileChange = async (e) => {
    setLoading(true);
    const uploaded = e.target.files[0];

    if (!uploaded) {
      setFile(null);
      setPages("");
      setPdfError("");
      setLoading(false);
      return;
    }

    if (uploaded.type !== "application/pdf") {
      setPdfError("Only PDF files are allowed.");
      setFile(null);
      setPages("");
      e.target.value = null;
      setLoading(false);
      return;
    }

    setFile(uploaded);
    setPdfError("");

    try {
      const arrayBuffer = await uploaded.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPages(pdf.numPages);
    } catch {
      setPages("");
      setPdfError("Invalid or corrupted PDF");
      setFile(null);
    }
    setLoading(false);
  };

  // Price calculation
  useEffect(() => {
    if (!pages || isNaN(pages) || pages <= 0) {
      setTotalAmount(0);
      return;
    }

    let pricePerPage = 0;
    if (color === "b/w" && sides === "2") pricePerPage = 1;
    else if (color === "colour" && sides === "2")
      pricePerPage = 0; // Not accepted, handle in submit
    else if (color === "b/w" && sides === "1") pricePerPage = 1.5;
    else if (color === "colour" && sides === "1") pricePerPage = 6;

    let total = pricePerPage * pages;
    if (binding === "spiral") total += 20;
    if (binding === "stick") total += 20;
    if (binding === "soft") total += 25;
    if (binding === "book") total += 150;
    total *= copies;

    setTotalAmount(Math.ceil(total));
  }, [color, sides, binding, pages, copies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Only PDF file allowed!");
    if (!pages) return alert("Could not read PDF pages.");

    if (activeTab === "student") {
      if (!collegeYear.trim() || !department.trim() || !section.trim())
        return alert("College year, department, and section are mandatory.");
    } else {
      if (!address.trim()) return alert("Delivery address required.");
    }

    if (!transctionid.trim()) return alert("Transaction ID required.");
    if (!fullName.trim() || !mobileNumber.trim() || !email.trim())
      return alert("Please fill your details.");

    if (color === "colour" && sides === "2")
      return alert("Double-sided color prints are not accepted.");

    let finalAddress;
    if (activeTab === "student") {
      finalAddress = `Year: ${collegeYear}, Dept: ${department}, Section: ${section}`;
    } else {
      finalAddress = address;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("color", color);
    formData.append("sides", sides);
    formData.append("binding", binding);
    formData.append("copies", copies);
    formData.append("address", finalAddress);
    formData.append("description", description);
    formData.append("transctionid", transctionid);
    formData.append("fullName", fullName);
    formData.append("mobileNumber", mobileNumber);
    formData.append("email", email);

    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_PATH}/orders/orderprints`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    setLoading(false);

    if (res.ok) {
      alert("Order placed!");
      navigate("/accounts");
    } else {
      const err = await res.json();
      alert(err?.error || "Order failed");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="order-main-bg">
          {/* HEADER */}
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
                  {userName ? (
                    <button
                      className="user"
                      onClick={() => navigate("/accounts")}
                      style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                      }}
                    >
                      {userName}
                    </button>
                  ) : (
                    <button
                      className="user"
                      onClick={() => navigate("/login")}
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
                    onClick={() => navigate("/accounts")}
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
              <button
                className="user"
                style={{ background: "none", border: "none" }}
              >
                <span className="cart">My cart</span>
                <sup className="notification">1</sup>
              </button>
            </div>
          </header>

          {/* TABS */}
          <div className="order-tabs">
            <button
              className={`order-tab${activeTab === "student" ? " active" : ""}`}
              onClick={() => setActiveTab("student")}
              type="button"
            >
              Student
            </button>
            <button
              className={`order-tab${activeTab === "others" ? " active" : ""}`}
              onClick={() => setActiveTab("others")}
              type="button"
            >
              Others
            </button>
          </div>

          {/* FORM */}
          <form className="order-form-wrap" onSubmit={handleSubmit}>
            <h2>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Printout
              Order
            </h2>
            <input
              className="input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Mobile Number"
              value={mobileNumber}
              maxLength={10}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="input-row">
              <label className="order-label" htmlFor="pdfFile">
                Upload PDF
              </label>
              <input
                id="pdfFile"
                className="input"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
            </div>
            {pdfError && <div className="error-text">{pdfError}</div>}
            {pages && (
              <div className="pdf-pages-info">Pages detected: {pages}</div>
            )}
            <div className="input-row">
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              >
                {COLOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={sides}
                onChange={(e) => setSides(e.target.value)}
                required
              >
                {SIDES_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-row">
              <select
                value={binding}
                onChange={(e) => setBinding(e.target.value)}
                required
              >
                {BINDING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                value={copies}
                min={1}
                onChange={(e) => setcopies(Number(e.target.value))}
              />
            </div>

            {/* Conditional address or college inputs */}
            {activeTab === "student" ? (
              <>
                <input
                  className="input"
                  placeholder="College Name"
                  value={collegeYear}
                  onChange={(e) => setCollegeYear(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Year of study"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Class & Section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
              </>
            ) : (
              <textarea
                className="input"
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            )}

            <textarea
              className="input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <img className="qr" src={qrImg} alt="QR Code" />
            <input
              className="input"
              placeholder="Transaction ID"
              value={transctionid}
              onChange={(e) => setTransctionid(e.target.value)}
              required
            />
            <br />
            <div className="total-cost-box">
              Total Amount: <span>₹{totalAmount}</span>
            </div>
            <button className="order-btn" type="submit">
              Submit Order
            </button>
          </form>

          {/* FOOTER */}
          <footer className="pageend">
            <div className="about">
              <h2>About Us</h2>
              <p>
                Book Hub is a student-friendly platform to buy and sell old
                books and order customized printouts easily. We aim to make
                learning materials affordable, accessible, and sustainable by
                connecting students to share resources, save time, and reduce
                costs—whether it’s selling used books, ordering printouts, or
                donating to those in need.
              </p>
            </div>
            <div className="categories">
              <div className="list1">
                <h3>Books</h3>
                <ul>
                  <li>School Books (class 6-12)</li>
                  <li>Competitive Books (GATE, JEE, etc.)</li>
                </ul>
              </div>
              <div className="list2">
                <h3>Printouts</h3>
                <ul>
                  <li>Assignments</li>
                  <li>Project Reports</li>
                </ul>
              </div>
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
      )}
    </>
  );
}