import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/categories.css";

function Categories() {
  const [active, setActive] = useState("books");
  const navigate = useNavigate();

  const categories = [
    {
      label: "School Books",
      desc: "From Class 6 to 12-All Boards Covered!",
      image: "/images/school.png",
      route: "/category/school-books",
    },
    {
      label: "College & University Books",
      desc: "Semester Books for Every Stream: B.Tech, B.Com, B.A & More",
      image: "/images/college.png",
      route: "/category/college-university",
    },
    {
      label: "Competitive Exam Books",
      desc: "Crack NEET, JEE, UPSC & More Top-Selling Prep Books!",
      image: "/images/competitive.png",
      route: "/category/competitive-exam",
    },
    {
      label: "Fictional Books",
      desc: "Get Lost in Imaginary Worlds - Novels, Fantasy & More",
      image: "/images/fictional.png",
      route: "/category/fiction",
    },
    {
      label: "Novels & Storybooks",
      desc: "Feel Every Emotion - Romantic, Classic & Hindi Stories",
      image: "/images/novels.png",
      route: "/category/novels-storybooks",
    },
    {
      label: "Notes & Study Materials",
      desc: "Handwritten Notes, Assignments & Projects - All in One Place!",
      image: "/images/notes.png",
      route: "/category/notes-study",
    },
    {
      label: "Previous Year Papers",
      desc: "Practice with Real Questions - Boards, Competitive & University Exams!",
      image: "/images/previous.png",
      route: "/category/previous-papers",
    },
    {
      label: "Non-Fiction Books",
      desc: "Real Stories, Real Knowledge: Self-Help to Science",
      image: "/images/non-fictional.png",
      route: "/category/nonfiction",
    },
  ];

  const printouts = [
    {
      label: "Assignments",
      image: "/images/assignments-icon.png",
      route: "/printout/assignments",
    },
    {
      label: "Project Reports",
      image: "/images/project-report-icon.png",
      route: "/printout/project-reports",
    },
    {
      label: "Class Notes",
      image: "/images/notes-icon.png",
      route: "/printout/class-notes",
    },
    {
      label: "Spiral Binding",
      image: "/images/spiral-binding-icon.png",
      route: "/printout/spiral-binding",
    },
    {
      label: "B/W & Color Prints",
      image: "/images/bw-color-icon.png",
      route: "/printout/bw-color",
    },
  ];

  return (
    <div className="categories-root">
      <div className="categories-tabs">
        <button className={`tab-btn ${active === "books" ? "active" : ""}`} onClick={() => setActive("books")}>
          Book Category
        </button>
        <button className={`tab-btn ${active === "prints" ? "active" : ""}`} onClick={() => setActive("prints")}>
          Printouts
        </button>
      </div>
      <div className="categories-panels">
        <section className={`categories-section ${active !== "books" ? "hidden-section" : ""}`}>
          <h3 className="section-title">Books Categories</h3>
          <div className="category-grid">
            {categories.map((cat) => (
              <div
                className="category-item"
                key={cat.label}
                onClick={() => navigate(cat.route)}>
                <img
                  src={cat.image}
                  alt={cat.label}
                />
                <span>
                  {cat.label}
                  <br />
                  <small>{cat.desc}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className={`printouts-section ${active !== "prints" ? "hidden-section" : ""}`}>
          <h3 className="section-title">Printouts Categories</h3>
          <div className="printout-categories">
            {printouts.map((p) => (
              <div
                className="printout-item"
                key={p.label}
                onClick={() => navigate(p.route)}>
                <img
                  src={p.image}
                  alt={p.label}
                />
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Categories;
