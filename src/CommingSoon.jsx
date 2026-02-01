import React from "react";

export default function ComingSoon() {
  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>MyBookHub</h1>
      <h2 style={styles.headline}>Coming Soon</h2>
      <p style={styles.description}>
        We’re working hard to bring you an amazing experience. Stay tuned!
      </p>
      <div style={styles.socials}>
        <a
          href="https://www.instagram.com/print_kart0001?igsh=MWI5NGc5MmxkNHA5eA=="
          style={styles.socialLink}
        >
          Instagram
        </a>
      </div>
      <footer style={styles.footer}>
        © 2026 MyBookHub. All rights reserved.
      </footer>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #f0f2f5, #d9e2ec)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
    color: "#2c3e50",
  },
  logo: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#34495e",
  },
  headline: {
    fontSize: "2.4rem",
    margin: "10px 0",
    fontWeight: "600",
  },
  description: {
    fontSize: "1.25rem",
    color: "#5d6d7e",
    marginBottom: "2rem",
    maxWidth: "320px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "2rem",
  },
  input: {
    padding: "12px 18px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1.5px solid #ccc",
    outline: "none",
    width: "240px",
  },
  button: {
    backgroundColor: "#2980b9",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "600",
    padding: "12px 25px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  socials: {
    display: "flex",
    gap: "25px",
    justifyContent: "center",
    marginBottom: "3rem",
  },
  socialLink: {
    textDecoration: "none",
    color: "#2980b9",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  footer: {
    fontSize: "0.9rem",
    color: "#b0bec5",
  },
};
