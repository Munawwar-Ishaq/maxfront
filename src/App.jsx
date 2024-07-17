import "./App.css";
import CreateAccount from "./pages/CreateAccount";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AccountVerification from "./pages/AccountVerification";
import SendCode from "./pages/SendCode";



function App() {
  const navigate = useNavigate();

  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CreateAccount" element={<CreateAccount  />} />
          <Route
            path="/AccountVerification/:token"
            element={<AccountVerification />}
          />
          <Route path="/SendMail" element={<SendCode />} />
        </Routes>
      </div>
  );
}

export default App;
