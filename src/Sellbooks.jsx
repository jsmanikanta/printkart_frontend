import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/sellbook.css";

const subcategoriesMap = {
  "School Books": [
    "NCERT Books",
    "State Board Books",
    "CBSE Books",
    "Sample Papers & Workbook",
    "English Medium Textbooks",
    "Telugu Medium Textbooks",
    "Hindi Medium Textbooks",
  ],
  "College & University Books": [
    "Engineering Books",
    "Medical Books",
    "Commerce & Management Books",
    "Arts & Humanities Books",
    "Science & Technology Books",
    "Semester-wise Guides",
    "University Question Banks",
    "Reference & Research Material",
  ],
  "Competitive Exam Books": [
    "UPSC Exam Preparation",
    "SSC Exams",
    "Banking Exams (IBPS, SBI PO)",
    "Railway Exams",
    "Teaching & TET Exams",
    "Defence Exams (NDA, CDS)",
    "State PSCs (MPPSC, UPPSC etc.)",
    "Mock Tests & Practice Papers",
  ],
  "Fictional Books": [
    "Contemporary Fiction",
    "Historical Fiction",
    "Mythological Fiction",
    "Mystery & Thriller",
    "Fantasy & Sci-Fi",
    "Romance",
    "Short Stories & Novellas",
    "Classics & Translations",
  ],
  "Novels & Storybooks": [
    "Indian English Novels",
    "Regional Language Novels",
    "Mythology & Epics",
    "Children’s Storybooks",
    "Young Adult Novels",
    "Biographies & Memoirs",
    "Literary Award Winners",
    "Book Series",
  ],
  "Notes & Study Materials": [
    "Handwritten Notes",
    "Printed Study Guides",
    "Previous Year Question Papers",
    "Model Answers",
    "Lecture Notes & Summaries",
    "Topic Wise Practice Sets",
    "Solved Examples",
    "Sample Question Papers",
  ],
  "Previous Year Papers": [
    "UPSC Previous Papers",
    "SSC Exam Past Papers",
    "Bank Exam Previous Papers",
    "State-Level Exams Papers",
    "University Exam Papers",
    "IIT JEE Question Papers",
    "Medical Entrance Previous Papers",
    "NET/SLET Previous Question Papers",
  ],
  "Non-Fiction Books": [
    "Biography & Autobiography",
    "Self-Help & Motivational",
    "Indian History & Culture",
    "Politics & Current Affairs",
    "Religion & Philosophy",
    "Science & Technology",
    "Travel & Exploration",
    "Cookbooks & DIY",
  ],
};

export default function SellBooks() {
  const navigate = useNavigate();

  const [selltype, setSelltype] = useState("sell");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categeory, setCategeory] = useState("");
  const [subcategeory, setSubCategeory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelltypeChange = (e) => {
    const val = e.target.value;
    setSelltype(val);
    if (val === "donate") {
      setPrice("0");
    } else {
      setPrice("");
    }
  };

  const handleCategoryChange = (e) => {
    setCategeory(e.target.value);
    setSubCategeory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to list a book.");
        setLoading(false);
        return;
      }
      if (
        !name.trim() ||
        (!price.trim() && selltype === "sell") ||
        !categeory.trim() ||
        !subcategeory.trim() ||
        !condition.trim() ||
        !description.trim() ||
        !location.trim()
      ) {
        alert("Please fill in all required fields before submitting!");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", selltype === "donate" ? 0 : Number(price));
      formData.append("categeory", categeory.trim());
      formData.append("selltype", selltype);
      formData.append("condition", condition.trim());
      formData.append("subcategeory", subcategeory.trim());
      formData.append("description", description.trim());
      formData.append("location", location.trim());
      if (photo) formData.append("image", photo);

      const res = await fetch(
        `${import.meta.env.VITE_API_PATH}/books/sellbook`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.status === 403) {
        alert("You are not authorized. Please log in again.");
        setLoading(false);
        return;
      }
      if (res.ok) {
        alert("Your book listing has been submitted!");
        navigate("/soldbooks");
      } else {
        const errorMsg = await res.text();
        alert(`Submission failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error sending details:", err);
      alert("Error sending details. Check console for more info.");
    }
    setLoading(false);
  };

  return (
    <div className="sellbooks-container">
      <h2 className="sellbooks-heading">
        Enter the details below to list your books for sale/donate
      </h2>
      {loading ? (
        <div className="loading-spinner">Submitting...</div>
      ) : (
        <form className="sellbooks-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="photo-upload">
              <span role="img" aria-label="upload">
                📷
              </span>
              <br />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </label>
            {photo && (
              <div className="photo-preview">
                <p>Selected file: {photo.name}</p>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </div>
          <div className="form-row">
            <div>
              <label>Book Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {selltype === "sell" && (
              <div>
                <label>Price(Expected) (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          <div className="form-row">
            <label>
              <input
                type="radio"
                value="sell"
                checked={selltype === "sell"}
                onChange={handleSelltypeChange}
              />{" "}
              Sell
            </label>
            <label>
              <input
                type="radio"
                value="donate"
                checked={selltype === "donate"}
                onChange={handleSelltypeChange}
              />{" "}
              Donate
            </label>
          </div>
          <div className="form-row">
            <div>
              <label>Category</label>
              <select
                value={categeory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {Object.keys(subcategoriesMap).map((cat) => (
                  <option value={cat} key={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Subcategory</label>
              <select
                value={subcategeory}
                onChange={(e) => setSubCategeory(e.target.value)}
                required
              >
                <option value="">Select Subcategory</option>
                {(subcategoriesMap[categeory] || []).map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Condition</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Condition of the book"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="desc-box">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
              />
            </div>
            <div className="desc-box">
              <label>Location</label>
              <textarea
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                rows={2}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
