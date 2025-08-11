import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Signup from "./Signup";
import Login from "./Login";
import Accounts from './Accounts';
import Orderprints from './OrderPrints';
import ForgotPassword from "./Forgotpass";
import ComingSoon from "./Soon";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<Signup/>}/> 
      <Route path="/login" element={<Login/>} />
      <Route path="/orderprints" element={<OrderPrints/>}/>
      <Route path="/accounts" element={<Accounts/>}/>
      <Route path="/forgotpassword" element={<ForgotPassword/>}/>
      <Route path="/soon" element={<ComingSoon/>}/>
      
    </Routes>
  );
}

export default App;
