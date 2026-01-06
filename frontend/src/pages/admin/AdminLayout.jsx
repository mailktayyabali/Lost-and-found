import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    Flag,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Bell
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="p-6 border-b border-white/10 flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-teal to-blue-500 p-2 rounded-lg">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Moderation</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-white/5 bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`}
                                alt="Admin"
                                className="w-10 h-10 rounded-full ring-2 ring-teal/50"
                            />
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Overview</p>

                        <NavLink
                            to="/admin/dashboard"
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            active={location.pathname === "/admin/dashboard" || location.pathname === "/admin"}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <NavLink
                            to="/admin/analytics"
                            icon={<i className="fa-solid fa-chart-line text-lg w-5"></i>}
                            label="Analytics"
                            active={location.pathname === "/admin/analytics"}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Management</p>

                        <NavLink
                            to="/admin/users"
                            icon={<Users size={20} />}
                            label="Users"
                            active={location.pathname === "/admin/users"}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <NavLink
                            to="/admin/items"
                            icon={<Package size={20} />}
                            label="Items"
                            active={location.pathname === "/admin/items"}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <NavLink
                            to="/admin/reports"
                            icon={<Flag size={20} />}
                            label="Moderation Queue"
                            active={location.pathname === "/admin/reports"}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">System</p>

                        <NavLink
                            to="/admin/settings"
                            icon={<Settings size={20} />}
                            label="Settings"
                            active={location.pathname === "/admin/settings"}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 lg:hidden px-4 h-16 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <Shield size={20} className="text-teal" />
                            <span className="font-bold text-slate-800">Admin Portal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`}
                            alt="Admin"
                            className="w-8 h-8 rounded-full"
                        />
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

function NavLink({ to, icon, label, active, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active
                    ? "bg-teal text-white shadow-lg shadow-teal/20 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
        >
            <span className={active ? "" : "opacity-70"}>{icon}</span>
            <span>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
        </Link>
    );
}
