import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import "./styles/orderprints.css";
import qrImg from "../public/images/qr.jpg";

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
  const [copies, setCopies] = useState(1);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [transctionid, setTransctionid] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form inputs
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Student-specific fields (added missing states)
  const [collegeName, setCollegeName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [classSection, setClassSection] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserName(null);
      return;
    }
    fetch(`${import.meta.env.VITE_API_PATH}/user/printorders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUserName(d?.user?.name || null))
      .catch(() => setUserName(null));
  }, []);

  // ---- PDF PAGE COUNTER ----
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
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!pages || isNaN(pages) || pages <= 0) {
      setTotalAmount(0);
      return;
    }
    let pricePerPage = 0;
    if (color === "b/w" && sides === "2") pricePerPage = 1;
    else if (color === "colour" && sides === "2") pricePerPage = "not accepted";
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
    if (!address.trim()) return alert("Delivery address required.");
    if (!transctionid.trim()) return alert("Transaction ID required.");
    if (!name.trim() || !mobile.trim() || !email.trim())
      return alert("Please fill your details.");
    if (activeTab === "student") {
      if (!collegeName.trim() || !yearOfStudy.trim() || !classSection.trim())
        return alert("Please provide college name, year, and class/section.");
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
    formData.append("address", address);
    formData.append("description", description);
    formData.append("transctionid", transctionid);
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("orderType", activeTab);

    if (activeTab === "student") {
      formData.append("collegeName", collegeName);
      formData.append("yearOfStudy", yearOfStudy);
      formData.append("classSection", classSection);
    }

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
      navigate("/prints-cart");
    } else {
      const err = await res.json();
      alert(err?.error || "Order failed");
    }
  };

  return (
    <>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div className="order-main-bg">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength="10"
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

            {activeTab === "student" && (
              <>
                <input
                  className="input"
                  placeholder="College Name"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Year of Study"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Class & Section"
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  required
                />
              </>
            )}

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
                style={{ display: "none" }}
              />
              <label
                htmlFor="pdfFile"
                className="custom-file-label"
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 12px",
                  display: "inline-block",
                  cursor: "pointer",
                  background: "#f8f8f8",
                }}
              >
                {file ? file.name : "Choose File"}
              </label>
              {pdfError && <div className="error-text">{pdfError}</div>}
              {pages && (
                <div className="pdf-pages-info">Pages detected: {pages}</div>
              )}
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
                onChange={(e) => setCopies(Number(e.target.value))}
              />
            </div>
            <textarea
              className="input"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <textarea
              className="input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <img className="qr" src={qrImg} alt="QR Code" /><br />
            <span><b>UPI ID: </b>papukumarsahu686-2@oksbi</span> <br />
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
        </div>
      )}
    </>
  );
}
