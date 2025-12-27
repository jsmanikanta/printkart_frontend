import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/previous.css";
import Loader from "./Loading";
import { api_path } from "../data";
import prints from "../public/images/spiral-binding-icon.png";
import { useNavigate } from "react-router-dom";

function CollegePYQ() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        navigate("/login");
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
        } else {
          setError("Failed to load question papers.");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Something went wrong while fetching question papers.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [navigate]);

  const handleTapToView = (fileUrl) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="pyq-orders-loading">
        <Loader />
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return (
      <div className="pyq-orders-login-prompt">
        <br />
        Please{" "}
        <a href="/login" className="pyq-orders-login-btn">
          Login
        </a>{" "}
        to view college PYQ.
      </div>
    );
  }
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
      {error && <p className="pyq-error">{error}</p>}

      {papers.length === 0 && !error ? (
        <p>No question papers available.</p>
      ) : (
        <div className="pyq-list">
          {papers.map((paper) => (
            <div className="pyq-card" key={paper.id}>
              {/* 1. Spiral image */}
              <div className="pyq-icon-area">
                <img
                  src={prints}
                  alt="Paper icon"
                  className="pyq-paper-img"
                />
              </div>

              {/* All text stacked vertically */}
              <div className="pyq-info-area-vertical">
                {/* College */}
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">
                    College Name:&nbsp;
                  </span>
                  <span className="pyq-value-inline">{paper.college}</span>
                </div>

                {/* Branch */}
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">Branch:&nbsp;</span>
                  <span className="pyq-value-inline">
                    {paper.branch || "Common for all branches"}
                  </span>
                </div>

                {/* Year & Semester */}
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">
                    Year & Semester:&nbsp;
                  </span>
                  <span className="pyq-value-inline">
                    Year {paper.year} • Sem {paper.sem}
                  </span>
                </div>

                <button
                  className="pyq-tap-button"
                  onClick={() => handleTapToView(paper.file_url)}
                >
                  👁 Tap To View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}

export default CollegePYQ;






