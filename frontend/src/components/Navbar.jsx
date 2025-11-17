import { Link } from "react-router-dom";

function Navbar() {
	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/" className="logo">FindIt</Link>
				<div className="nav-links">
					<Link to="/">Home</Link>
					<Link to="/about">About</Link>
					<Link to="/auth">Sign In</Link>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;

