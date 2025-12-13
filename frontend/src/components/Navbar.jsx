import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
<nav className="w-full px-8 py-4 flex items-center justify-between bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] shadow-lg border-b border-white/10 sticky top-0 z-50">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <img
          src="/assets/images/icon.jpg"
          alt="logo"
          className="w-12 h-12 rounded-[10px] object-cover shadow-md"
        />
        <span className="text-2xl font-semibold tracking-wide text-white">
          FindIt
        </span>
      </div>

      {/* Hamburger Menu (Mobile) */}
      <button
        onClick={toggleMenu}
        className="flex md:hidden flex-col gap-1 cursor-pointer"
      >
        <span className={`w-6 h-0.5 bg-white transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all ${isOpen ? "opacity-0" : ""}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>

      {/* Navigation Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/">
          Home
        </Link>
        <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/about">
          About
        </Link>
        <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/feed">
          Feed
        </Link>

        {/* NEW Dashboard Button */}
        <Link
          className="text-white text-lg hover:text-gray-200 transition font-medium"
          to="/dashboard"
        >
          Dashboard
        </Link>

        {/* Single Post Items */}
        <Link
          className="text-white text-lg hover:text-gray-200 transition font-medium"
          to="/report?type=lost"
        >
          Post Items
        </Link>

        <Link
          className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition font-medium backdrop-blur-md"
          to="/auth"
        >
          Sign In
        </Link>
      </div>

      {/* Navigation Links - Mobile */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] flex flex-col gap-4 p-6 md:hidden shadow-lg">
          <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/feed" onClick={() => setIsOpen(false)}>
            Feed
          </Link>

          {/* NEW Dashboard Button (Mobile) */}
          <Link
            className="text-white text-lg hover:text-gray-200 transition font-medium"
            to="/dashboard"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>

          <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/report?type=lost" onClick={() => setIsOpen(false)}>
            Post Items
          </Link>

          <Link className="w-full px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition font-medium backdrop-blur-md text-center" to="/auth" onClick={() => setIsOpen(false)}>
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
