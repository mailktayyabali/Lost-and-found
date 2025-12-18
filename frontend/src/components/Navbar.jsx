import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-navy shadow-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/images/icon.jpg"
              alt="FindIt logo"
              className="w-10 h-10 rounded-lg object-cover shadow-md transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-semibold tracking-tight text-white">
              FindIt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative group" 
              to="/"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative group" 
              to="/about"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative group" 
              to="/feed"
            >
              Feed
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative group" 
              to="/contact"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative group" 
              to="/dashboard"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative group" 
              to="/report"
            >
              Report Item
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* CTA Button */}
            <Link
              className="px-5 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-all text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
              to="/auth"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="flex md:hidden flex-col gap-1.5 cursor-pointer z-50 relative"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-navy/80 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 h-full w-64 bg-navy shadow-2xl md:hidden z-50 slide-in-right">
            <div className="flex flex-col gap-2 p-6 pt-20">
              <Link 
                className="text-white hover:text-teal transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-white/5" 
                to="/" 
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                className="text-white hover:text-teal transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-white/5" 
                to="/about" 
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                className="text-white hover:text-teal transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-white/5" 
                to="/feed" 
                onClick={() => setIsOpen(false)}
              >
                Feed
              </Link>
              <Link 
                className="text-white hover:text-teal transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-white/5" 
                to="/contact" 
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link 
                className="text-white hover:text-teal transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-white/5" 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                className="text-white hover:text-teal transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-white/5" 
                to="/report" 
                onClick={() => setIsOpen(false)}
              >
                Report Item
              </Link>
              
              {/* Mobile CTA */}
              <Link 
                className="mt-4 px-5 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition-all text-base font-medium text-center shadow-md" 
                to="/auth" 
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
