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
const PAYMENT_OPTIONS = [
  { value: "payondelivery", label: "Pay on Delivery" },
  { value: "upi", label: "UPI" },
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
  const [payment, setPayment] = useState("payondelivery"); // default payment method
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF.");
    if (!pages || pages <= 0) return alert("PDF page count unavailable.");
    if (!name.trim() || !mobile.trim()) return alert("Fill personal details.");
    const cleanedMobile = mobile.trim().replace(/s+/g, ""); // remove spaces
console.log("Mobile value on submit:", JSON.stringify(cleanedMobile)); // debug actual string

const mobileNumberPattern = /^d{10}$/;

if (!mobileNumberPattern.test(cleanedMobile)) {
  alert("Please enter a valid 10-digit mobile number.");
  return;
}
// Use cleanedMobile for submission if needed
    if (
      activeTab === "student" &&
      (!college.trim() || !year.trim() || !section.trim() || !rollno.trim())
    )
      return alert(
        "Fill college, year, section, registration number for students."
      );
    if (activeTab === "others" && !address.trim())
      return alert("Fill delivery address for home delivery.");

    if (!payment) return alert("Select payment method.");

    if (payment === "upi" && !transactionImage && !transctionid) {
      return alert("Please upload UPI transaction screenshot.");
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
      if (payment === "upi") {
        if (transactionImage) {
          formData.append("transctionid", transactionImage);
        } else if (transctionid.trim()) {
          // if user typed in some value (optional fallback)
          formData.append("transctionid", transctionid.trim());
        }
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
      formData.append("payment", payment);

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
  maxLength={10}
  onChange={(e) => {
    const digitsOnly = e.target.value.replace(/D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  }}
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
                <sub>Max Size: 10MB</sub>
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
              <p>Max Size: 10MB</p>
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

            <div className="input-row">
              <label htmlFor="paymentMethod" className="order-label">
                Select Payment Method
              </label>
              <select
                id="paymentMethod"
                className="input"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              >
                {PAYMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {payment === "upi" && (
              <>
                <div className="upi-info">
                  <img src={qrImg} alt="UPI QR Code" className="qr" />
                  <p>UPI ID: <b>papukumarsahu686-2@oksbi</b></p>
                </div>
                <label htmlFor="transactionUpload">Transaction Details (Upload payment Screenshot)</label>
                <sub>Max Size: 10MB</sub>
                <input
                  id="transactionUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setTransactionImage(e.target.files[0]);
                      setTransctionid("");
                    } else {
                      setTransactionImage(null);
                    }
                  }}
                  required={!transactionImage}
                />
                {transactionImage && (
                  <div>
                    Selected file: {transactionImage.name}
                    <button type="button" onClick={() => setTransactionImage(null)}>
                      Remove
                    </button>
                  </div>
                )}
              </>
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
                  25% Student Discount on Prints: -₹{discountValue.toFixed(2)}
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
