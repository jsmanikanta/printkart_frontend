import { Routes, Route } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";

import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import Accounts from "./Accounts";
import OrderPrints from "./Orderprints";
import ForgotPassword from "./Forgotpass";
import Admin from "./Admin";
import SellBooks from "./Sellbooks";
import ComingSoon from "./Soon";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/orderprints" element={<OrderPrints />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/sellbooks" element={<SellBooks />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
