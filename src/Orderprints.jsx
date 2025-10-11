import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import "./styles/orderprints.css";
import qrImg from "/images/qr.jpg";

const colleges = [
  "Anil Neerukonda Institute of Technology & Sciences (ANITS), Visakhapatnam",
  "Andhra University, Waltair Junction, Visakhapatnam",
  "G.V.P COLLEGE OF ENGINEERING,Kommadi, Visakhapatnam",
  "Sims College in Madhurawada, Visakhapatnam",
  "Dr. Lankapalli Bullayya College of Engineering,Visakhapatnam",
];
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
  { value: "spiral", label: "Spiral Binding" },
  { value: "stick", label: "Stick File" },
  { value: "soft", label: "Soft Binding" },
  { value: "book", label: "Book Binding" },
];

export default function OrderPrints() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(0);
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
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [rollno, setRollNo] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!file) {
      setPages(0);
      setPdfError("");
      return;
    }
    const loadPdfPages = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPages(pdf.numPages);
        setPdfError("");
      } catch (e) {
        setPages(0);
        setPdfError("Invalid or corrupted PDF");
      }
    };
    loadPdfPages();
  }, [file]);
  const handleCollegeChange = (e) => {
    setCategeory(e.target.value);
    setSubCategeory("");
  };

  useEffect(() => {
    if (!pages || pages <= 0) {
      setTotalAmount(0);
      return;
    }
    let pricePerPage = 0;
    if (color === "b/w" && sides === "2") pricePerPage = 1;
    else if (color === "colour" && sides === "2") pricePerPage = 0;
    else if (color === "b/w" && sides === "1") pricePerPage = 1.5;
    else if (color === "colour" && sides === "1") pricePerPage = 6;

    let total = pricePerPage * pages;

    if (binding === "spiral") total += 20;
    else if (binding === "stick") total += 20;
    else if (binding === "soft") total += 25;
    else if (binding === "book") total += 150;

    total *= copies;
    setTotalAmount(Math.ceil(total));
  }, [color, sides, binding, pages, copies]);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) {
      setFile(null);
      setPages(0);
      setPdfError("");
      return;
    }
    if (uploaded.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      e.target.value = null;
      return;
    }
    setFile(uploaded);
  };

  const fetchWithTimeout = async (url, options, timeout = 90000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort("Request timed out");
    }, timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timer);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please upload a PDF file.");
    if (!pages || pages <= 0)
      return alert("Could not determine number of pages.");
    if (!address.trim()) return alert("Delivery address is required.");
    if (!transctionid.trim()) return alert("Transaction ID is required.");
    if (!name.trim() || !mobile.trim() )
      return alert("Please fill in all personal details.");
    if (
      activeTab === "student" &&
      (!college.trim() || !year.trim() || !section.trim())
    )
      return alert(
        "Please fill college, year, and section for student orders."
      );

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("color", color);
      formData.append("sides", Number(sides));
      formData.append("binding", binding);
      formData.append("copies", Number(copies));
      formData.append("address", address.trim());
      formData.append("description", description.trim());
      formData.append("transctionid", transctionid.trim());
      formData.append("name", name.trim());
      formData.append("mobile", mobile.trim());
      formData.append("price", Number(price));
      formData.append("rollno", rollno);
      formData.append("orderType", activeTab);
      if (activeTab === "student") {
        formData.append("collegeName", college.trim());
        formData.append("yearOfStudy", year.trim());
        formData.append("classSection", section.trim());
      }

      console.log("Submitting with data:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await fetchWithTimeout(
        `${import.meta.env.VITE_API_PATH}/orders/orderprints`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
        90000
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Order failed");
      }

      alert("Order placed successfully!");
      navigate("/prints-cart");
    } catch (err) {
      if (err.name === "AbortError") {
        alert("Request took too long. Please try again.");
        console.error("Timeout:", err);
      } else {
        alert(err.message || "Error placing order.");
        console.error("Error placing order:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <p style={{ textAlign: "center" }}>loading...</p>
      ) : (
        <div className="order-main-bg">
          <div className="order-tabs">
            <button
              className={`order-tab${activeTab === "student" ? " active" : ""}`}
              onClick={() => setActiveTab("student")}
              type="button"
            >
              CLASS ROOM <br />
              DELIVERY
            </button>
            <button
              className={`order-tab${activeTab === "others" ? " active" : ""}`}
              onClick={() => setActiveTab("others")}
              type="button"
            >
              HOME <br />
              DELIVERY
            </button>
          </div>

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
              maxLength={10}
              required
            />

            {activeTab === "student" && (
              <>
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                >
                  <option value="">Select College</option>
                  {colleges.map((clg) => (
                    <option key={clg} value={clg}>
                      {clg}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Registeration Number"
                  value={rollno}
                  onChange={(e) => setRollNo(e.target.value)}
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
              {pages > 0 && (
                <div className="pdf-pages-info">Pages detected: {pages}</div>
              )}
            </div>

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
                min={1}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                required
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

            <img className="qr" src={qrImg} alt="QR Code" />
            <input
              className="input"
              placeholder="Transaction ID"
              value={transctionid}
              onChange={(e) => setTransctionid(e.target.value)}
              required
            />

            <div
              className="total-cost-box"
              onChange={(e) => setPrice(e.target.value)}
            >
              Total Amount: <span>₹{totalAmount}</span>
            </div>

            <button className="order-btn" type="submit">
              Place Order
            </button>
          </form>
        </div>
      )}
    </>
  );
}
