import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookListedSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          navigate("/soldbooks");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "450px",
        width: "100%",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>
          ✔
        </div>

        <h1 style={{ fontSize: "28px", marginBottom: "10px", color: "#333" }}>
          Book Listed Successfully!
        </h1>

        <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
          Thank you for selling your book
        </p>

        <p style={{
          fontSize: "16px",
          color: "#4a5568",
          marginBottom: "30px",
          background: "#f7fafc",
          padding: "15px",
          borderRadius: "10px",
          borderLeft: "4px solid #4299e1"
        }}>
          We will contact you shortly
        </p>

        <button
          style={{
            background: "#4299e1",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "25px",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(66,153,225,0.3)"
          }}
          onClick={() => navigate("/soldbooks")}
        >
          View My Books
        </button>

        <div style={{ marginTop: "25px", fontSize: "14px", color: "#718096" }}>
          Redirecting in{" "}
          <span style={{ color: "#4299e1", fontWeight: "bold" }}>
            {countdown}
          </span>
          s...
        </div>
      </div>
    </div>
  );
}
