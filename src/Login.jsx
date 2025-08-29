import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_path } from "../data";
import "./styles/auth.css";
import logoImg from "./images/logo.jpg";
import Loader from "./Loading";

function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ credential: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setErrorMsg(""); // clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(`${api_path}/user/login/`, {
        identifier: inputs.credential,
        password: inputs.password,
      });
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    } catch (error) {
<<<<<<< HEAD
      const msg = error.response?.data?.error || "Login failed. Please try again.";
=======
      const msg =
        error.response?.data?.error || "Login failed. Please try again.";
>>>>>>> 3af2730 (Describe your admin)
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="modal-header" onClick={() => navigate("/")}>
              <img src={logoImg} alt="Logo" className="modal-logo" />
            </div>
            <h2 className="modal-title">
              Buy &amp; Sell Old Books.
              <br /> Order Printout Instantly!
            </h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="credential"
                placeholder="Mobile Number or Email"
                value={inputs.credential}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              {errorMsg && <div className="error-message">{errorMsg}</div>}
              <button type="submit" className="auth-btn">
                Continue
              </button>
            </form>
            <div className="auth-links">
              <button
                type="button"
                className="transparent-link"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="switch-auth">
              New here?
              <button
                type="button"
                className="switch-btn"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
