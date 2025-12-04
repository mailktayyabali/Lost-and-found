import { Link } from "react-router-dom";

function Navbar() {
	return (
		<nav className="navbar">
			<div className="logo-section">
				<img src="/assets/images/icon.jpg" alt="logo" className="logo"/>
				<span className="brand-name">FindIt</span>
			</div>
			<div className="nav-links">
				<Link to="/">Home</Link>
				<Link to="/about">About</Link>
				<Link to="/auth">Sign In</Link>
			</div>
		</nav>
	);
}

export default Navbar;

