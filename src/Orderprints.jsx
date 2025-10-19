import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import "./styles/orderprints.css";
import qrImg from "/images/qr.jpg";

const colleges = [
  "Anil Neerukonda Institute of Technology & Sciences (ANITS), Visakhapatnam",
  "Andhra University, Waltair Junction, Visakhapatnam",
  "Gayatri Vidya Parishad College of Engineering (GVPE),Kommadi, Visakhapatnam",
  "SIMS College Madhurawada, Visakhapatnam",
  "Dr. Lankapalli Bullayya College of Engineering,Visakhapatnam",
  "Avanti Institute of Engineering & Technology, Vizianagaram",
  "Nadimpalli Satyanarayana Raju Institute of Technology (NSRIT), Visakhapatnam",
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
  const [transactionImage, setTransactionImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [rollno, setRollNo] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [printCost, setPrintCost] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [bindingCost, setBindingCost] = useState(0);

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

  // Price calculation with 10% student discount on print cost only
  useEffect(() => {
    if (!pages || pages <= 0) {
      setPrintCost(0);
      setBindingCost(0);
      setOriginalPrice(0);
      setDiscountValue(0);
      setDiscountPrice(0);
      return;
    }

    let pricePerPage = 0;
    if (color === "b/w" && sides === "2") pricePerPage = 1;
    else if (color === "b/w" && sides === "1") pricePerPage = 1.5;
    else if (color === "colour" && sides === "1") pricePerPage = 6;

    const printAmount = pricePerPage * pages * copies;
    setPrintCost(printAmount);

    let bindingAmount = 0;
    switch (binding) {
      case "spiral":
        bindingAmount = 15 * copies;
        break;
      case "stick":
        bindingAmount = 20 * copies;
        break;
      case "soft":
        bindingAmount = 25 * copies;
        break;
      case "book":
        bindingAmount = 150 * copies;
        break;
      default:
        bindingAmount = 0;
    }
    setBindingCost(bindingAmount);

    const originalTotal = printAmount + bindingAmount;
    setOriginalPrice(originalTotal);

    let discountAmount = 0;
    if (activeTab === "student") discountAmount = printAmount * 0.25;
    setDiscountValue(discountAmount);

    const finalTotal = Math.ceil(printAmount - discountAmount + bindingAmount);
    setDiscountPrice(finalTotal);
  }, [color, sides, binding, pages, copies, activeTab]);

  // File Input handler
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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF.");
    if (!pages || pages <= 0) return alert("PDF page count unavailable.");
    if (!name.trim() || !mobile.trim()) return alert("Fill personal details.");
    if (
      activeTab === "student" &&
      (!college.trim() || !year.trim() || !section.trim() || !rollno.trim())
    )
      return alert(
        "Fill college, year, section, registration number for students."
      );
    if (activeTab === "others" && !address.trim())
      return alert("Fill delivery address for home delivery.");
    if (!/^d{10}$/.test(mobile.trim())) {
  alert("Please enter your 10 digits mobile number");
  return;
}


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
      if (transactionImage) {
        formData.append("transctionid", transactionImage);
      } else {
        formData.append("transctionid", transctionid);
      }
      formData.append("color", color);
      formData.append("sides", sides);
      formData.append("binding", binding);
      formData.append("copies", copies);
      formData.append("description", description.trim());
      formData.append("name", name.trim());
      formData.append("mobile", mobile.trim());
      formData.append("originalprice", Math.ceil(originalPrice));
      formData.append("discountprice", discountPrice);

      if (activeTab === "student") {
        formData.append("college", college.trim());
        formData.append("year", year.trim());
        formData.append("section", section.trim());
        formData.append("rollno", rollno.trim());
      }
      if (activeTab === "others") {
        formData.append("address", address.trim());
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_PATH}/orders/orderprints`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Order failed");
      }

      alert("Order placed successfully!");
      navigate("/prints-cart");
    } catch (e) {
      alert(e.message || "Error placing order.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <h2>Placing your order....</h2>
      ) : (
        <div className="order-main-bg">
          <div className="order-tabs">
            <button
              className={`order-tab${activeTab === "student" ? " active" : ""}`}
              onClick={() => setActiveTab("student")}
              type="button"
            >
              CLASS ROOM <br /> DELIVERY
            </button>
            <button
              className={`order-tab${activeTab === "others" ? " active" : ""}`}
              onClick={() => setActiveTab("others")}
              type="button"
            >
              HOME <br /> DELIVERY
            </button>
          </div>
          <form className="order-form-wrap" onSubmit={handleSubmit}>
            <h2>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Printout
              Order
            </h2>
            <input
              type="text"
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
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
                  required
                >
                  <option value="">Select College</option>
                  {colleges.map((clg) => (
                    <option key={clg} value={clg}>
                      {clg}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="input"
                  placeholder="Studying Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Branch (e.g., CSE, ECE)"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Registration Number"
                  value={rollno}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </>
            )}
            {activeTab === "others" && (
              <textarea
                className="input"
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            )}
            <div className="input-row">
              <label htmlFor="pdfFile" className="order-label">
                Upload PDF
              </label>
              <input
                id="pdfFile"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                required
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
            </div>
            {pdfError && <div className="error-text">{pdfError}</div>}
            {pages > 0 && (
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
                type="number"
                className="input"
                min={1}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                required
              />
            </div>
            <textarea
              className="input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p>
              For bulk or custom requests, get in touch at{" "}
              <a
                href="tel:8074177249"
                style={{ color: "#2980b9", textDecoration: "underline" }}
              >
                8074177249
              </a>
              .
            </p>
            <img className="qr" src={qrImg} alt="QR Code" />
            <span>UPI id: papukumarsahu686-2@oksbi</span>
            <br />
            <label>Transaction ID (Upload payment Screenshot)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setTransactionImage(e.target.files[0]);
                  setTransctionid(""); // clear text input if image selected
                } else {
                  setTransactionImage(null);
                }
              }}
              required={!transctionid}
            />
            {transactionImage && (
              <div>
                Selected file: {transactionImage.name}
                <button type="button" onClick={() => setTransactionImage(null)}>
                  Remove
                </button>
              </div>
            )}
            {file && pages > 0 && (
              <div className="total-cost-box">
                <p>
                  Original Price: ₹{originalPrice}
                  <span style={{ fontSize: "smaller" }}>
                    (Prints ₹{printCost} + Binding ₹{bindingCost})
                  </span>
                </p>
                <p>
                  10% Student Discount on Prints: -₹{discountValue.toFixed(2)}
                </p>
                <p>New Price: ₹{discountPrice}</p>
              </div>
            )}

            <button
              className="order-btn"
              type="submit"
              disabled={loading || pages <= 0}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
