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
  const [copies, setCopies] = useState(1);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [transctionid, setTransctionid] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false); // Form inputs

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState(""); // Student-specific fields

  const [collegeName, setCollegeName] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");

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
  }, []); // PDF page count handling

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
    if (!file) {
      alert("Only PDF file allowed!");
      return;
    }
    if (!pages) {
      alert("Could not read PDF pages.");
      return;
    }
    if (!address.trim()) {
      alert("Delivery address required.");
      return;
    }
    if (!transctionid.trim()) {
      alert("Transaction ID required.");
      return;
    }
    if (!name.trim() || !mobile.trim() || !email.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (activeTab === "student") {
      if (!collegeName.trim() || !year.trim() || !section.trim()) {
        alert("Please fill student details.");
        return;
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
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
      formData.append("year", year);
      formData.append("section", section);
    }

    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_PATH}/orders/orderprints`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    setLoading(false);

    if (response.ok) {
      alert("Order placed successfully!");
      navigate("/cart");
    } else {
      const errData = await response.json();
      alert(errData.error || "Order submission failed");
    }
  };

  return (
    <>
           {" "}
      {loading ? (
        <div className="loading-container">
                    <Loader />       {" "}
        </div>
      ) : (
        <div className="order-print-container">
                   {" "}
          <div className="tab-buttons">
                       {" "}
            <button
              className={activeTab === "student" ? "active" : ""}
              onClick={() => setActiveTab("student")}
            >
                            Student            {" "}
            </button>
                       {" "}
            <button
              className={activeTab === "others" ? "active" : ""}
              onClick={() => setActiveTab("others")}
            >
                            Others            {" "}
            </button>
                     {" "}
          </div>
                   {" "}
          <form onSubmit={handleSubmit} className="order-form">
                        {/* Form fields here as in your code */}           {" "}
            {/* Example for name field */}
                       {" "}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
                        {/* Other inputs go here */}           {" "}
            <button type="submit" disabled={loading}>
                            Submit Order            {" "}
            </button>
                     {" "}
          </form>
                 {" "}
        </div>
      )}
         {" "}
    </>
  );
}
