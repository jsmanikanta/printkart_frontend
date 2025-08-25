import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_path } from "../data";
import "./styles/auth.css";
import logoImg from "./images/logo.jpg";
import Loader from "./Loading";

function Login() {
  const navigate = useNavigate();

  const Signup = () => {
    navigate("/signup");
  };

  const Homepage = () => {
    navigate("/");
  };
  const ForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const [inputs, setInputs] = useState({ credential: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${api_path}/user/login/`, {
        identifier: inputs.credential,
        password: inputs.password,
      });

      console.log("Login response:", response.data);

      if (response.data.success && response.data.token) {
        alert("Login successful!");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Login failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="modal-header" onClick={Homepage}>
              <img src="./images/logo.jpg" alt="Logo" className="modal-logo" />
              <img src={logoImg} alt="Logo" className="modal-logo" />
            </div>
            <h2 className="modal-title">
              Buy &amp; Sell Old Books.
              <br /> Order Printout Instantly!
            </h2>
=======
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="modal-header" onClick={Homepage}>
          <img src={logoImg} alt="Logo"  className="modal-logo" />
        </div>
        <h2 className="modal-title">
          Buy &amp; Sell Old Books.
          <br /> Order Printout Instantly!
        </h2>
>>>>>>> f2d7ca3fd36f62f1ab01810b7b21c1289aec9d4a

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
              <button type="submit" className="auth-btn">
                Continue
              </button>
            </form>

            <div className="auth-links">
              <button
                type="button"
                className="transparent-link"
                onClick={ForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
            <div className="switch-auth">
              New here?
              <button type="button" className="switch-btn" onClick={Signup}>
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
