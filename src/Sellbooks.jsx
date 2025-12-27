import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/sellbook.css";

const categories = [
  "School Books",
  "College & University Books",
  "Competitive Exam Books",
  "Fictional Books",
  "Novels & Storybooks",
  "Notes & Study Materials",
  "Previous Year Papers",
  "Non-Fiction Books",
  "GATE",
  "CAT",
  "IIT JEE",
  "PYQ books",
  "others"
];

const subcategoriesMap = {
  "School Books": [
    "NCERT Books", "State Board Books", "CBSE Books",
    "Sample Papers & Workbook", "English Medium Textbooks",
    "Telugu Medium Textbooks", "Hindi Medium Textbooks"
  ],
  "College & University Books": [
    "Engineering Books", "Medical Books", "Commerce & Management Books",
    "Arts & Humanities Books", "Science & Technology Books",
    "Semester-wise Guides", "University Question Banks",
    "Reference & Research Material"
  ],
  "Competitive Exam Books": [
    "UPSC Exam Preparation", "SSC Exams", "Banking Exams (IBPS, SBI PO)",
    "Railway Exams", "Teaching & TET Exams", "Defence Exams (NDA, CDS)",
    "State PSCs (MPPSC, UPPSC etc.)", "Mock Tests & Practice Papers"
  ],
  "Fictional Books": [
    "Contemporary Fiction", "Historical Fiction", "Mythological Fiction",
    "Mystery & Thriller", "Fantasy & Sci-Fi", "Romance",
    "Short Stories & Novellas", "Classics & Translations"
  ],
  "Novels & Storybooks": [
    "Indian English Novels", "Regional Language Novels", "Mythology & Epics",
    "Children's Storybooks", "Young Adult Novels", "Biographies & Memoirs",
    "Literary Award Winners", "Book Series"
  ],
  "Notes & Study Materials": [
    "Handwritten Notes", "Printed Study Guides", "Previous Year Question Papers",
    "Model Answers", "Lecture Notes & Summaries", "Topic Wise Practice Sets",
    "Solved Examples", "Sample Question Papers"
  ],
  "Previous Year Papers": [
    "UPSC Previous Papers", "SSC Exam Past Papers", "Bank Exam Previous Papers",
    "State-Level Exams Papers", "University Exam Papers", "IIT JEE Question Papers",
    "Medical Entrance Previous Papers", "NET/SLET Previous Question Papers"
  ],
  "Non-Fiction Books": [
    "Biography & Autobiography", "Self-Help & Motivational",
    "Indian History & Culture", "Politics & Current Affairs",
    "Religion & Philosophy", "Science & Technology",
    "Travel & Exploration", "Cookbooks & DIY"
  ],
  "GATE": [
    "GATE CS Notes", "GATE ME Notes", "GATE EE Notes", "GATE Previous Papers",
    "GATE Mock Tests", "GATE Solved Papers"
  ],
  "CAT": [
    "CAT Quant", "CAT Verbal", "CAT LRDI", "CAT Mock Tests",
    "CAT Previous Papers"
  ],
  "IIT JEE": [
    "JEE Main Physics", "JEE Main Chemistry", "JEE Main Maths",
    "JEE Advanced Physics", "JEE Advanced Chemistry", "JEE Advanced Maths"
  ],
  "PYQ books": [
    "JEE PYQ", "NEET PYQ", "BITSAT PYQ", "GATE PYQ", "CAT PYQ"
  ],
  "others": [
    "Miscellaneous", "Rare Books", "Out of Print",
    "Self Published", "Local Publications"
  ]
};

const conditions = ["Brand New", "Like New", "Very Good", "Good", "Fair", "Poor"];

export default function SellBooks() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categeory: "",
    subcategeory: "",
    condition: "",
    description: "",
    location: "",
    selltype: "sell",
    soldstatus: "Instock"
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, submitting, success, error
  const [errors, setErrors] = useState({});
  const [userLocation, setUserLocation] = useState("New Delhi, India");

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Simple location - replace with actual geocoding if needed
              setUserLocation("Detected Location");
              setFormData(prev => ({ ...prev, location: "New Delhi, India" }));
            } catch (error) {
              console.log("Location error:", error);
            }
          },
          (error) => {
            console.log("Geolocation denied:", error);
          }
        );
      }
    };
    getLocation();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Book name is required";
    if (formData.name.trim().length < 2) newErrors.name = "Book name must be at least 2 characters";
    if (!formData.categeory) newErrors.categeory = "Category selection required";
    if (!formData.subcategeory) newErrors.subcategeory = "Subcategory selection required";
    if (!formData.condition) newErrors.condition = "Condition selection required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    if (formData.selltype === "sell") {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Valid price required for selling (₹1+)";
      }
    }

    if (!photo) newErrors.photo = "Book photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, photo]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleSellTypeChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      selltype: value,
      price: value === "donate" ? "0" : prev.price 
    }));
    if (errors.price) setErrors(prev => ({ ...prev, price: "" }));
  }, [errors]);

  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      categeory: value,
      subcategeory: ""
    }));
    if (errors.categeory) setErrors(prev => ({ ...prev, categeory: "" }));
    if (errors.subcategeory) setErrors(prev => ({ ...prev, subcategeory: "" }));
  }, [errors]);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: "Image size must be less than 5MB" }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: "Please select a valid image file" }));
        return;
      }
      
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, photo: "" }));
    }
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPhoto(null);
    setPreview(null);
    if (preview) URL.revokeObjectURL(preview);
    setErrors(prev => ({ ...prev, photo: "Book photo is required" }));
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setLoading(true);
    setSubmitStatus("submitting");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to list books");
        navigate("/login");
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("price", formData.selltype === "donate" ? 0 : parseFloat(formData.price));
      submitData.append("categeory", formData.categeory);
      submitData.append("subcategeory", formData.subcategeory);
      submitData.append("description", formData.description.trim());
      submitData.append("location", formData.location.trim());
      submitData.append("selltype", formData.selltype);
      submitData.append("condition", formData.condition);
      submitData.append("soldstatus", formData.soldstatus);
      submitData.append("image", photo);

      const response = await fetch(`${import.meta.env.VITE_API_PATH}/api/books/sellbooks`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        alert("✅ Book listed successfully! Check your email for confirmation.");
        // Reset form
        setFormData({
          name: "",
          price: "",
          categeory: "",
          subcategeory: "",
          condition: "",
          description: "",
          location: userLocation,
          selltype: "sell",
          soldstatus: "Instock"
        });
        setPhoto(null);
        setPreview(null);
        setErrors({});
        setTimeout(() => {
          navigate("/soldbooks");
        }, 1500);
      } else {
        setSubmitStatus("error");
        alert(`❌ Error: ${data.message || data.error || "Failed to list book"}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
      alert("❌ Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  return (
    <div className="sellbooks-container">
      <div className="sellbooks-header">
        <h1 className="sellbooks-title">📚 List Your Book</h1>
        <p className="sellbooks-subtitle">
          Sell or Donate your books to students across India
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Listing your book... Please wait</p>
        </div>
      ) : (
        <form className="sellbooks-form" onSubmit={handleSubmit}>
          {/* Photo Upload */}
          <div className="form-section">
            <h3>📷 Book Photo <span className="required">*</span></h3>
            <div className="form-group">
              <label className="upload-label">
                <div className="upload-icon">📸</div>
                <div className="upload-text">
                  Click to upload or drag & drop
                  <div className="upload-hint">PNG, JPG, GIF (Max 5MB)</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file-input"
                />
              </label>
              {errors.photo && <span className="error">{errors.photo}</span>}
              {preview && (
                <div className="photo-preview">
                  <img src={preview} alt="Book Preview" />
                  <button 
                    type="button" 
                    onClick={handleRemovePhoto}
                    className="remove-preview"
                    title="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3>📖 Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Book Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Introduction to Algorithms (CLRS)"
                  maxLength={100}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Selling Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selltype"
                      value="sell"
                      checked={formData.selltype === "sell"}
                      onChange={handleSellTypeChange}
                    />
                    <span>💰 Sell</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selltype"
                      value="donate"
                      checked={formData.selltype === "donate"}
                      onChange={handleSellTypeChange}
                    />
                    <span>❤️ Donate (Free)</span>
                  </label>
                </div>
              </div>
            </div>

            {formData.selltype === "sell" && (
              <div className="form-group">
                <label>Expected Price (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="1"
                  max="50000"
                  step="0.01"
                  placeholder="Ex: 250"
                  className={errors.price ? "input-error" : ""}
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
            )}
          </div>

          {/* Category & Details */}
          <div className="form-section">
            <h3>📂 Category & Condition</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select
                  name="categeory"
                  value={formData.categeory}
                  onChange={handleCategoryChange}
                  className={errors.categeory ? "input-error" : ""}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categeory && <span className="error">{errors.categeory}</span>}
              </div>

              <div className="form
