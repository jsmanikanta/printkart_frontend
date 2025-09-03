import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import Accounts from "./Accounts";
import OrderPrints from "./Orderprints";
import ForgotPassword from "./Forgotpass";
import Admin from "./Admin";
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
        <Route path="/orderprints" element={<OrderPrints />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/soon" element={<ComingSoon />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
