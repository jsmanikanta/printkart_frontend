import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/home.css";
import { api_path } from "../data";
import Signup from "./Signup";
import Loader from "./Loading";

function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation handlers
  const Login = () => {
    navigate("/login");
  };

  const Orderprints = () => {
    navigate("/orderprints");
  };

  const Accounts = () => {
    navigate("/accounts");
  };
  const soon = () => {
    navigate("/soon");
  };

  const sellbook = () => {
    navigate("/sellbooks");
  };
  // Fetch user profile for the header
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false); // <--- ADD THIS LINE
        return;
      }
      try {
        const response = await axios.get(`${api_path}/user/printorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.user) {
          setUserName(response.data.user.fullname);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          {/* Banner Section */}
          <section className="banner">
            <div className="heading">
              <h1>
                Buy Old Books.
                <br />
                Order Printout Instantly!
              </h1>
              <div>
                <button className="buttons" onClick={soon}>
                  <i className="fa-solid fa-book"></i> Buy Books
                </button>
                <button className="buttons" onClick={Orderprints}>
                  <i className="fa-solid fa-print"></i> Order Printouts
                </button>
              </div>
            </div>
            <div className="books"></div>
          </section>

          {/* Feature Section */}
          <div className="diff">
            <div className="getBooks1">
              <div className="category">
                <h3>Get the second hand books at low prices</h3>
                <div className="image1"></div>
              </div>
              <button className="button" onClick={soon}>
                Order now
              </button>
            </div>
            <div className="getBooks2">
              <div className="category">
                <h3>Sell your books &amp; get the money</h3>
                <div className="image2"></div>
              </div>
              <button className="button" onClick={sellbook}>
                Sell now
              </button>
            </div>
            <div className="getBooks3">
              <div className="category">
                <h3>Order printouts &amp; custom it</h3>
                <div className="image3"></div>
              </div>
              <button className="button" onClick={Orderprints}>
                Order now
              </button>
            </div>
            <div className="getBooks4">
              <div className="category">
                <h3>Donate your books</h3>
                <div className="image4"></div>
              </div>
              <button className="button" onClick={sellbook}>
                Donate now
              </button>
            </div>
          </div>

          {/* Categories Section */}
          <section className="catgeries">
            <h2>Books Categories</h2>
            <div className="booksCat" onClick={soon}>
              <div className="academic">
                <div className="imgb1"></div>
                <h4>Academic &amp; Textbooks</h4>
              </div>
              <div className="engg" onClick={soon}>
                <div className="imgb2"></div>
                <h4>Engineering &amp; Technology</h4>
              </div>
              <div className="medical" onClick={soon}>
                <div className="imgb3"></div>
                <h4>Medical &amp; Nursing</h4>
              </div>
              <div className="bcom" onClick={soon}>
                <div className="imgb4"></div>
                <h4>B.sc / B.Com / B.A</h4>
              </div>
            </div>
            <h2>Printouts Categories</h2>
            <div className="printCat" onClick={Orderprints}>
              <div className="bw">
                <div className="imgp1"></div>
                <h4>B/W Prints</h4>
              </div>
              <div className="spiral" onClick={Orderprints}>
                <div className="imgp2"></div>
                <h4>Spiral Binding</h4>
              </div>
              <div className="assignment" onClick={Orderprints}>
                <div className="imgp3"></div>
                <h4>Assignments</h4>
              </div>
              <div className="proj" onClick={Orderprints}>
                <div className="imgp4"></div>
                <h4>Project Report</h4>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="choose">
            <h2 style={{ paddingLeft: "20px" }}>Why choose us?</h2>
            <div className="boxes">
              <div className="box">
                <div className="imgc2"></div>
                <h3>Fast Delivery</h3>
                <h5>Order Anytime &amp; get delivered on time</h5>
              </div>
              <div className="box">
                <div className="imgc3"></div>
                <h3>Custom Printouts</h3>
                <h5>Color, B/W, A4/A4, spiral Binding-all in one</h5>
              </div>
              <div className="box">
                <div className="imgc4"></div>
                <h3>Instant book scan upload</h3>
                <h5>Click &amp; upload photo in seconds using mobile camera</h5>
              </div>
              <div className="box">
                <div className="imgc5"></div>
                <h5>Best prices on books &amp; printouts, made for students</h5>
              </div>
              <div className="box">
                <div className="imgc6"></div>
                <h3>Live chat support</h3>
                <h5>Stuck somewhere? Chat with our team instantly</h5>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="works">
            <h2 style={{ paddingLeft: "20px" }}>How it works:</h2>
            <div className="steps">
              <div className="step" onClick={Signup}>
                <div className="num">
                  <h2>Step 1:</h2>
                </div>
                <div className="para">
                  <p>SignUp &amp; complete profile</p>
                </div>
              </div>
              <div className="step" onClick={soon}>
                <div className="num">
                  <h2>Step 2:</h2>
                </div>
                <div className="para">
                  <p>Choose what you want to</p>
                  <p>Buy/sell books or Order printouts</p>
                </div>
              </div>
              <div className="step" onClick={Orderprints}>
                <div className="num">
                  <h2>Step 3:</h2>
                </div>
                <div className="para">
                  <p>Upload photo or file</p>
                  <p>(for book or print)</p>
                </div>
              </div>
              <div className="step" onClick={Orderprints}>
                <div className="num">
                  <h2>Step 4:</h2>
                </div>
                <div className="para">
                  <p>Choose delivery/pickup location</p>
                </div>
              </div>
              <div className="step" onClick={Orderprints}>
                <div className="num">
                  <h2>Step 5:</h2>
                </div>
                <div className="para">
                  <p>Make payment &amp; track your order</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default HomePage;
