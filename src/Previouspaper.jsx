import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/previous.css";
import Loader from "./Loading";
import { api_path } from "../data";
import prints from "../public/images/spiral-binding-icon.png";
import { useNavigate, useParams } from "react-router-dom";

function CollegePYQ() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { college } = useParams(); // Get college from route: /:college/previous-years

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        setError("Please login to view question papers.");
        return;
      }

      // Use college param or fallback to 'anits'
      const collegeName = college || 'anits';
      const endpoint = `${collegeName}/previous-years`;

      try {
        console.log(`Fetching: ${api_path}/${endpoint}`); // Debug log
        
        const res = await axios.get(`${api_path}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.success) {
          setPapers(res.data.data || []);
        } else {
          setPapers([]);
          setError("No question papers available for this college.");
        }
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        
        setError(`Failed to load papers: ${err.response?.status || 'Network Error'}`);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [navigate, college]); // Add college as dependency

  const handleTapToView = (fileUrl) => {
    if (!fileUrl) {
      alert("File not available");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  // ALWAYS show header + consistent layout
  const renderContent = () => {
    if (loading) {
      return (
        <div className="pyq-orders-loading">
          <Loader />
        </div>
      );
    }

    if (error) {
      return (
        <div className="pyq-content">
          <p className="pyq-error">{error}</p>
          <a href="/login" className="pyq-orders-login-btn">
            Login to continue
          </a>
        </div>
      );
    }

    if (papers.length === 0) {
      return (
        <div className="pyq-content">
          <p>No question papers available.</p>
        </div>
      );
    }

    return (
      <div className="pyq-content">
        <div className="pyq-list">
          {papers.map((paper, index) => (
            <div className="pyq-card" key={paper.id || paper.file_url || index}>
              <div className="pyq-icon-area">
                <img src={prints} alt="Paper icon" className="pyq-paper-img" />
              </div>
              <div className="pyq-info-area-vertical">
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">College Name:&nbsp;</span>
                  <span className="pyq-value-inline">{paper.college }</span>
                </div>
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">Branch:&nbsp;</span>
                  <span className="pyq-value-inline">{paper.branch}</span>
                </div>
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">Year & Semester:&nbsp;</span>
                  <span className="pyq-value-inline">
                    Year {paper.year } • Sem {paper.sem}
                  </span>
                </div>
                <div className="pyq-field-row">
                  <span className="pyq-label-inline">Subject:&nbsp;</span>
                  <span className="pyq-value-inline">{paper.subject }</span>
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
    );
  };

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
      {renderContent()}
    </div>
  );
}

export default CollegePYQ;

