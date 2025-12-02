import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <Link to="/" className="logo">
          F
        </Link>
        <span className="brand-name">FindIt</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/feed">Feed</Link>
        <Link to="/about">About</Link>
        <Link to="/auth">Sign In</Link>
      </div>
    </nav>
  );
}

export default Navbar;

