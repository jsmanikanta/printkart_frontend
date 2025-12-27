import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/sellbook.css";

// Categories and subcategories based on your model
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
  "others",
];

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
  others: ["Miscellaneous"],
};

const conditions = [
  "Brand New",
  "Like New",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
];

export default function SellBooks() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categeory: "",
    subcategeory: "",
    condition: "",
    description: "",
    location: "New Delhi, India",
    selltype: "sell",
    soldstatus: "Instock",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Book name required";
    if (!formData.categeory) e.categeory = "Category required";
    if (!formData.subcategeory) e.subcategeory = "Subcategory required";
    if (!formData.condition) e.condition = "Condition required";
    if (!formData.description.trim()) e.description = "Description required";
    if (!formData.location.trim()) e.location = "Location required";
    if (formData.selltype === "sell" && (!formData.price || Number(formData.price) <= 0))
      e.price = "Valid price required";
    if (!photo) e.photo = "Book image required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("price", formData.selltype === "donate" ? "0" : formData.price);
      fd.append("categeory", formData.categeory);
      fd.append("subcategeory", formData.subcategeory);
      fd.append("condition", formData.condition);
      fd.append("description", formData.description.trim());
      fd.append("location", formData.location.trim());
      fd.append("selltype", formData.selltype);
      fd.append("soldstatus", formData.soldstatus);
      fd.append("image", photo);

      const res = await fetch(
        `${import.meta.env.VITE_API_PATH}/books/sellbook`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("Book listed successfully!");
      navigate("/soldbooks");
    } catch (err) {
      console.error(err);
      alert("Failed to submit book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sellbooks-container">
      <h1>List Your Book</h1>

      <form onSubmit={handleSubmit} className="sellbooks-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files[0];
            setPhoto(f);
            setPreview(URL.createObjectURL(f));
          }}
        />
        {errors.photo && <p className="error">{errors.photo}</p>}
        {preview && <img src={preview} alt="preview" width="150" />}

        <input
          type="text"
          placeholder="Book name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <select
          value={formData.categeory}
          onChange={(e) =>
            setFormData({ ...formData, categeory: e.target.value, subcategeory: "" })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {errors.categeory && <p className="error">{errors.categeory}</p>}

        <select
          value={formData.subcategeory}
          onChange={(e) =>
            setFormData({ ...formData, subcategeory: e.target.value })
          }
        >
          <option value="">Select Subcategory</option>
          {subcategoriesMap[formData.categeory]?.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {errors.subcategeory && <p className="error">{errors.subcategeory}</p>}

        <select
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
        >
          <option value="">Condition</option>
          {conditions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {errors.condition && <p className="error">{errors.condition}</p>}

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        {errors.description && <p className="error">{errors.description}</p>}

        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        {errors.location && <p className="error">{errors.location}</p>}

        {formData.selltype === "sell" && (
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        )}
        {errors.price && <p className="error">{errors.price}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
