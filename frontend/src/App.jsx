import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Feed from "./pages/Feed";
import ReportItem from "./pages/ReportItem";
import UserDashboard from "./pages/UserDashboard"; 
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/dashboard" element={<UserDashboard />} />  {/* ✅ NEW */}
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
