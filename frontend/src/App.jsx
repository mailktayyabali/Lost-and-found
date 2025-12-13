import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Feed from "./pages/Feed";
import ReportItem from "./pages/ReportItem";
import UserDashboard from "./pages/UserDashboard";
import ItemDetail from "./pages/ItemDetail";
import Contact from "./pages/Contact";
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
