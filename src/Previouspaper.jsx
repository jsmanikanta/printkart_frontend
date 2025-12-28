import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/previous.css";
import Loader from "./Loading";
import { api_path } from "../data";
import prints from "../public/images/spiral-binding-icon.png";
import { useNavigate } from "react-router-dom";

function CollegePYQ() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      
      // Handle no token case
      if (!token) {
        setLoading(false);
        setError("Please login to view question papers.");
        return;
      }

      try {
        const res = await axios.get(`${api_path}/anits/previous-years`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (res.data?.success) {
          setPapers(res.data.data || []);
          setError(""); // Clear any previous errors
        } else {
          setError("No question papers available.");
          setPapers([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load question papers. Please try again.");
          setPapers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [navigate]);

  const handleTapToView = (fileUrl) => {
    if (!fileUrl) {
      alert("File not available");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="pyq-orders-loading">
        <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pyq-page">
        <header className="pyq-header">
          <span className="pyq-back-button" onClick={() => navigate(-1)}>
            ←
          </span>
          <span className="pyq-header-title">
            Previous Year Question Papers
          </span>
        </header>
        <div className="pyq-content">
          <p className="pyq-error">{error}</p>
          {!localStorage.getItem("token") && (
            <a href="/login" className="pyq-orders-login-btn">
              Login to continue
            </a>
          )}
        </div>
      </div>
    );
  }

  // No papers state
  if (papers.length === 0) {
    return (
      <div className="pyq-page">
        <header className="pyq-header">
          <span className="pyq-back-button" onClick={() => navigate(-1)}>
            ←
          </span>
          <span className="pyq-header-title">
            Previous Year Question Papers
          </span>
        </header>
        <div className="pyq-content">
          <p>No question papers available.</p>
        </div>
      </div>
    );
  }

  // Success state - render papers
  return (
    <div className="pyq-page">
      <header className="pyq-header">
        <span className="pyq-back-button" onClick={() => navigate(-1)}>
          ←
        </span>
        <span className="pyq-header-title">
          Previous Year Question Papers
        </span>
      </header>

      <div className="pyq-content">
        <div className="pyq-list">
          {papers.map((paper) => (
            <div className="pyq-card" key={paper.id || paper.file_url || Math.random()}>
              <div className="pyq-icon-area">
                <img
                  src={prints}
                  alt="Paper icon"
                  className="pyq-paper-img"
                />
              </div>

              <div className="pyq-info-area-vertical">
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">
                    College Name:&nbsp;
                  </span>
                  <span className="pyq-value-inline">{paper.college || "N/A"}</span>
                </div>

                <div className="pyq-field-row">
                  <span className="pyq-label-inline">Branch:&nbsp;</span>
                  <span className="pyq-value-inline">
                    {paper.branch || "Common for all branches"}
                  </span>
                </div>

                <div className="pyq-field-row">
                  <span className="pyq-label-inline">
                    Year & Semester:&nbsp;
                  </span>
                  <span className="pyq-value-inline">
                    Year {paper.year || "N/A"} • Sem {paper.sem || "N/A"}
                  </span>
                </div>

                <button
                  className="pyq-tap-button"
                  onClick={() => handleTapToView(paper.file_url)}
                >
                  Tap To View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollegePYQ;
