import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] shadow-lg border-b border-white/10 sticky top-0 z-50">
      
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <img 
          src="assets/images/icon.jpg" 
          alt="logo" 
          className="w-12 h-12 rounded-full object-cover shadow-md"
        />
        <span className="text-2xl font-semibold tracking-wide text-white">
          FindIt
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/">
          Home
        </Link>
        <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/about">
          About
        </Link>
        <Link className="text-white text-lg hover:text-gray-200 transition font-medium" to="/Feed">
          Feed
        </Link>
        <Link className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition font-medium backdrop-blur-md" to="/auth">
          Sign In
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
