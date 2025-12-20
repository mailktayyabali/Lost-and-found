import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Globe,
  Settings,
  Users
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
      logout();
      navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Toggle Button (Visible on Dashboard Layout Mobile) */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-navy text-white rounded-lg shadow-lg border border-white/10 hover:bg-navy/90 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0f172a] text-slate-300 flex flex-col p-4 transform transition-transform duration-300 ease-in-out border-r border-white/5 shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* BRAND */}
        <div className="flex items-center gap-3 p-2 mb-8 mt-2">
            <img 
             src="/assets/images/icon.jpg" 
             className="w-8 h-8 rounded-lg shadow-md opacity-80"
             alt="Logo"
            />
            <span className="text-lg font-bold text-white tracking-wide">Dashboard</span>
        </div>

        {/* USER PROFILE SUMMARY */}
        {user && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl mb-6 border border-white/5">
            <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full ring-2 ring-teal/20"
            />
            <div className="overflow-hidden">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-teal font-bold uppercase tracking-wider">{user.role || 'User'}</p>
            </div>
            </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 mt-2">Menu</p>
          
          {/* USER SPECIFIC LINKS */}
          {user?.role === 'user' && (
              <>
                 <SidebarLink 
                    to="/dashboard" 
                    icon={<LayoutDashboard size={20} />} 
                    label="Overview" 
                    isActive={isActive("/dashboard")}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/my-reports" 
                    icon={<FileText size={20} />} 
                    label="My Reports" 
                    isActive={isActive("/my-reports")}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/dashboard" 
                    icon={<UserIcon size={20} />} 
                    label="Profile Settings" 
                    isActive={false} // Placeholder
                    onClick={() => setIsMobileMenuOpen(false)}
                />
              </>
          )}

          {/* ADMIN SPECIFIC LINKS */}
          {user?.role === 'admin' && (
               <>
                 <SidebarLink 
                    to="/admin" 
                    icon={<LayoutDashboard size={20} />} 
                    label="Admin Overview" 
                    isActive={isActive("/admin")}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/admin" 
                    icon={<Users size={20} />} 
                    label="Manage Users" 
                    isActive={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/admin" 
                    icon={<Settings size={20} />} 
                    label="System Settings" 
                    isActive={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
              </>
          )}

        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
           <SidebarLink 
                to="/" 
                icon={<Globe size={20} />} 
                label="Back to Website" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
            />
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all font-medium group w-full text-left"
            >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
            </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
}

const SidebarLink = ({ to, icon, label, isActive, onClick, className = "" }) => (
    <Link 
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
            isActive 
            ? "bg-teal text-white shadow-lg shadow-teal/20 font-medium" 
            : "hover:bg-white/5 hover:text-white text-slate-400"
        } ${className}`}
    >
        <span className={isActive ? "" : "group-hover:scale-110 transition-transform duration-200"}>{icon}</span>
        <span>{label}</span>
        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
    </Link>
)
