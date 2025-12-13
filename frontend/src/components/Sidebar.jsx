import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] text-white flex flex-col p-6 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* USER PROFILE — TOP */}
        <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg mb-8">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
            JD
          </div>
          <div>
            <p className="font-semibold">John Doe</p>
            <p className="text-sm opacity-80">User Account</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 flex-1">
          <Link 
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive("/dashboard") ? "bg-white/10" : "hover:bg-white/10"
            }`}
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} /> 
            <span className="font-medium">Dashboard Overview</span>
          </Link>

          <Link 
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive("/my-reports") ? "bg-white/10" : "hover:bg-white/10"
            }`}
            to="/my-reports"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText size={20} /> 
            <span>My Reports</span>
          </Link>

          <Link 
            className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors" 
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User size={20} /> 
            <span>Edit Profile</span>
          </Link>
        </nav>

        {/* LOGOUT BUTTON */}
        <button className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white transition font-medium border border-white/20">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
}
