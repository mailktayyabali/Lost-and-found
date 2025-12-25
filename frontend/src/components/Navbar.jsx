import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessaging } from "../context/MessagingContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { User, LogOut, LayoutDashboard, Search, CheckCircle, MessageSquare, Bell } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getUnreadCount: getMessageUnreadCount } = useMessaging();
  const { getUnreadCount: getAlertUnreadCount } = useSearchAlerts();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const messageUnreadCount = getMessageUnreadCount();
  const alertUnreadCount = getAlertUnreadCount();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-slate-900 md:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/assets/images/icon.jpg"
                alt="FindIt logo"
                className="w-12 h-12 rounded-xl object-cover shadow-lg ring-2 ring-teal/20 transition-transform group-hover:scale-105 group-hover:ring-teal/50"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-teal"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-teal transition-colors">
                FindIt
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Lost & Found</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>

            {/* Split Feeds */}
            <NavLink to="/lost-items">
              <span className="flex items-center gap-1.5">
                <Search size={14} className="opacity-70" /> Lost Items
              </span>
            </NavLink>
            <NavLink to="/found-items">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="opacity-70" /> Found Items
              </span>
            </NavLink>

            <NavLink to="/contact">Contact</NavLink>

            {/* Messages & Alerts Links (if logged in) */}
            {user && (
              <>
                <Link
                  to="/messages"
                  className="relative px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <MessageSquare size={14} className="inline mr-1.5" />
                  Messages
                  {messageUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {messageUnreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/search-alerts"
                  className="relative px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <Bell size={14} className="inline mr-1.5" />
                  Alerts
                  {alertUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-teal text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {alertUnreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Separator */}
            <div className="h-6 w-px bg-white/10 mx-4"></div>

            {/* Auth Button or Profile Dropdown */}
            {user ? (
              <div className="relative ml-2" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all group focus:outline-none focus:ring-2 focus:ring-teal/50"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-white/10 group-hover:ring-teal/50 transition-all"
                  />
                  <div className="text-left hidden lg:block mr-2">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-teal uppercase tracking-wider font-bold">{user.role}</p>
                  </div>
                  <i className={`fa-solid fa-chevron-down text-white/50 text-xs transition-transform duration-200 mr-2 ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-[#1e293b] shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in overflow-hidden z-50 border border-white/10">
                    <div className="p-4 border-b border-white/5 bg-slate-900/50">
                      <p className="text-sm font-medium text-white">Signed in as</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white rounded-lg transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard size={16} className="text-teal group-hover:scale-110 transition-transform" />
                        Dashboard
                      </Link>

                      {user.role === 'user' && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white rounded-lg transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          My Profile
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/5 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all group"
                      >
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                className="ml-4 px-6 py-2.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all text-sm font-bold shadow-md hover:shadow-lg flex items-center gap-2 group border-2 border-transparent hover:border-white/50"
                to="/auth"
              >
                Sign In
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform text-teal"></i>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="flex md:hidden flex-col gap-1.5 cursor-pointer z-50 relative p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 transition-all duration-300 rounded-full ${isOpen ? "rotate-45 translate-y-2 bg-white" : "bg-white"
                }`}
            ></span>
            <span
              className={`w-6 h-0.5 transition-all duration-300 rounded-full ${isOpen ? "opacity-0" : "bg-white"
                }`}
            ></span>
            <span
              className={`w-6 h-0.5 transition-all duration-300 rounded-full ${isOpen ? "-rotate-45 -translate-y-2 bg-white" : "bg-white"
                }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/80 md:hidden z-40 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#1e293b] shadow-2xl md:hidden z-50 slide-in-right flex flex-col border-l border-white/20">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all group"
              aria-label="Close menu"
            >
              <i className="fa-solid fa-times text-white text-xl group-hover:text-red-400 transition-colors"></i>
            </button>
            <div className="flex flex-col gap-2 p-6 pt-24 flex-1 bg-navy">
              <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
              <MobileNavLink to="/lost-items" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-magnifying-glass mr-2 text-teal"></i> Lost Items
              </MobileNavLink>
              <MobileNavLink to="/found-items" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-check-circle mr-2 text-teal"></i> Found Items
              </MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>

              <div className="h-px bg-white/10 my-4"></div>

              {user ? (
                <>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 mb-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <MobileNavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsOpen(false)} highlighted>
                    <i className="fa-solid fa-gauge mr-2"></i> Dashboard
                  </MobileNavLink>
                  <button
                    onClick={handleLogout}
                    className="mt-auto px-5 py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all text-base font-medium text-center w-full flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  className="mt-4 px-5 py-4 bg-white text-slate-900 rounded-xl hover:shadow-lg transition-all text-base font-bold text-center shadow-md w-full"
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
            <div className="p-6 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500">© 2025 FindIt Inc.</p>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

// Helper components for clean code
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider relative group"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, highlighted }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`text-base font-medium py-3 px-4 rounded-xl transition-all ${highlighted
      ? "bg-teal/10 text-teal border border-teal/20"
      : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
  >
    {children}
  </Link>
);

export default Navbar;
