import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import Cart from "./Cart";
import OrderPrints from "./Orderprints";
import ForgotPassword from "./Forgotpass";
import SellBooks from "./Sellbooks";
import SoldBooks from "./Soldbooks";
import BuyBooks from "./BuyBooks";
import Header from "./Header";
import Footer from "./Footer";
import AdminPrints from "./AdminPrints";
import AdminBooks from "./AdminBooks";
import BookDetails from "./Buyeachbook";
import OrderSummary from "./OrderSummary";
import Buyeachbook from "./Buyeachbook";
import SellerBooks from "./BooksbyId";

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/orderprints" element={<OrderPrints />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/sellbooks" element={<SellBooks />} />
        <Route path="/soldbooks" element={<SoldBooks />} />
        <Route path="/buybooks" element={<BuyBooks />} />
        <Route path="/adminprints" element={<AdminPrints />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
        <Route path="/book/:id" element={<Buyeachbook />} />
        <Route path="/seller-profile/:id" element={<SellerBooks />} />
        <Route
          path="/book/:id"
          element={<BookDetails onOrder={setOrderSummaryBookId} />}
        />
        <Route path="/confrim-order" element={<OrderSummary />} />
        <Route path="/order-summary/:bookId" element={<BookDetails />} />
      </Routes>
      {orderSummaryBookId && (
        <OrderSummary
          bookId={orderSummaryBookId}
          onClose={handleCloseOrderSummary}
        />
      )}
      <Footer />
    </>
  );
}

export default App;
