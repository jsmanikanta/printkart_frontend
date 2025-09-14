import { Routes, Route } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";

import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import Cart from "./Cart";
import OrderPrints from "./Orderprints";
import ForgotPassword from "./Forgotpass";
import SellBooks from "./Sellbooks";
import SoldBooks from "./Soldbooks";
import ComingSoon from "./Soon";
import Header from "./Header";
import Footer from "./Footer";
import AdminPrints from "./AdminPrints";
import AdminBooks from "./AdminBooks";

function App() {
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
        <Route path="/adminprints" element={<AdminPrints />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
