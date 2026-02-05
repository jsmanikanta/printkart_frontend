import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import Cart from "./Cart";
import OrderPrints from "./OrderPrints";
import ForgotPassword from "./Forgotpass";
import SellBooks from "./Sellbooks";
import Header from "./Header";
import BottomNav from "./Bottomnav";
import Footer from "./Footer";
import AdminPrints from "./AdminPrints";
import AdminBooks from "./AdminBooks";
import Categories from "./Categerioes";
import VideoHelpSection from "./Help";
import ComingSoon from "./CommingSoon";
import CollegePYQ from "./Previouspaper";
import ThankYouPageHub from "./Thankyou";

function App() {
  const [orderSummaryBookId, setOrderSummaryBookId] = useState(null);
  const handleCloseOrderSummary = () => setOrderSummaryBookId(null);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/prints-cart" element={<Cart />} />
        <Route path="/orderprints" element={<OrderPrints />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/sellbook" element={<SellBooks />} />
        <Route path="/adminprints" element={<AdminPrints />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
        <Route path="/all-categories" element={<Categories />} />
        <Route path="/help" element={<VideoHelpSection />} />
        <Route path="/soon" element={<ComingSoon />} />
        <Route path="/previous-papers" element={<CollegePYQ/>} />
        <Route path="/thankyou" element={<ThankYouPageHub/>}/>
      </Routes>
      <BottomNav />
      <Footer />
    </>
  );
}

export default App;
