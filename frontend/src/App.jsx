import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Feed from "./pages/Feed";
import ReportItem from "./pages/ReportItem";
import UserDashboard from "./pages/UserDashboard";
import MyReports from "./pages/MyReports";
import ItemDetail from "./pages/ItemDetail";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
