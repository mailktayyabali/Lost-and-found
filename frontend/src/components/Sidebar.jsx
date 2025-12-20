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
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
  }

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
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#0f172a] text-slate-300 flex flex-col p-4 transform transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* HEADER / TOGGLE */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-3 p-2 mb-8 mt-2 transition-all`}>
           {!isCollapsed && (
             <div className="flex items-center gap-3 animate-fade-in">
                <img 
                src="/assets/images/icon.jpg" 
                className="w-8 h-8 rounded-lg shadow-md opacity-80"
                alt="Logo"
                />
                <span className="text-lg font-bold text-white tracking-wide whitespace-nowrap">Dashboard</span>
             </div>
           )}
           {isCollapsed && (
               <img 
               src="/assets/images/icon.jpg" 
               className="w-8 h-8 rounded-lg shadow-md opacity-80"
               alt="Logo"
               />
           )}
           
           <button 
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
           >
               {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
           </button>
        </div>

        {/* USER PROFILE SUMMARY */}
        {user && (
            <div className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-6 border border-white/5 transition-all ${isCollapsed ? "justify-center" : ""}`}>
            <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full ring-2 ring-teal/20"
            />
            {!isCollapsed && (
                <div className="overflow-hidden animate-fade-in">
                    <p className="font-semibold text-white truncate text-sm">{user.name}</p>
                    <p className="text-[10px] text-teal font-bold uppercase tracking-wider">{user.role || 'User'}</p>
                </div>
            )}
            </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto overflow-x-hidden">
            {!isCollapsed && <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-2 animate-fade-in">Menu</p>}
            {isCollapsed && <div className="h-4"></div>}
          
          {/* USER SPECIFIC LINKS */}
          {user?.role === 'user' && (
              <>
                 <SidebarLink 
                    to="/dashboard" 
                    icon={<LayoutDashboard size={20} />} 
                    label="Overview" 
                    isActive={isActive("/dashboard")}
                    isCollapsed={isCollapsed}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/my-reports" 
                    icon={<FileText size={20} />} 
                    label="My Reports" 
                    isActive={isActive("/my-reports")}
                    isCollapsed={isCollapsed}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/dashboard" 
                    icon={<UserIcon size={20} />} 
                    label="Profile" 
                    isActive={false} // Placeholder
                    isCollapsed={isCollapsed}
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
                    label="Overview" 
                    isActive={isActive("/admin")}
                    isCollapsed={isCollapsed}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/admin" 
                    icon={<Users size={20} />} 
                    label="Users" 
                    isActive={false}
                    isCollapsed={isCollapsed}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                 <SidebarLink 
                    to="/admin" 
                    icon={<Settings size={20} />} 
                    label="Settings" 
                    isActive={false}
                    isCollapsed={isCollapsed}
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
                label="Website" 
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
            />
            <button 
                onClick={handleLogout}
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all font-medium group w-full ${isCollapsed ? "justify-center" : "text-left"}`}
                title="Logout"
            >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="animate-fade-in">Logout</span>}
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

const SidebarLink = ({ to, icon, label, isActive, isCollapsed, onClick, className = "" }) => (
    <Link 
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
            isActive 
            ? "bg-teal text-white shadow-lg shadow-teal/20 font-medium" 
            : "hover:bg-white/5 hover:text-white text-slate-400"
        } ${isCollapsed ? "justify-center" : ""} ${className}`}
        title={isCollapsed ? label : ""}
    >
        <span className={isActive ? "" : "group-hover:scale-110 transition-transform duration-200"}>{icon}</span>
        {!isCollapsed && <span className="whitespace-nowrap animate-fade-in">{label}</span>}
        {isActive && !isCollapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
    </Link>
)
