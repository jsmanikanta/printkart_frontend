import React, { useState } from "react";
import "./styles/auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import logoImg from "../public/images/logo.png";
import Loader from "./Loading";

function Signup() {
  const navigate = useNavigate();
  const Login = () => {
    navigate("/login");
  };
  const Homepage = () => {
    navigate("/");
  };
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    fullname: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileNumberPattern = /^\d{10}$/;
    if (!mobileNumberPattern.test(inputs.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (inputs.password !== inputs.confirm) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${api_path}/user/register`, {
        fullname: inputs.fullname,
        mobileNumber: inputs.mobileNumber,
        email: inputs.email,
        password: inputs.password,
      });

      if (response.data.message) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Registration failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="modal-header" onClick={Homepage}>
              <img src={logoImg} alt="Logo" className="modal-logo" />
            </div>
            <h2 className="modal-title">
              Buy &amp; Sell Old Books.
              <br /> Order Printout Instantly!
            </h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullname"
                placeholder="Enter Full Name"
                value={inputs.fullname}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={inputs.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Enter Mobile Number"
                value={inputs.mobileNumber}
                onChange={handleChange}
                required
                maxLength={10}
              />

              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={inputs.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                value={inputs.confirm}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button type="submit" className="auth-btn">
                Sign Up
              </button>
            </form>
            <div className="switch-auth">
              Already have an account?
              <button type="button" className="switch-btn" onClick={Login}>
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;
