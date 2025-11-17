import heroImg from "../assets/9276436.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Find What’s Lost, Return What’s Found</h1>
        <p>Connecting people to their lost belongings securely and easily.</p>
        <div className="hero-buttons">
          <Link to="/auth" className="btn primary">Sign In</Link>
          <Link to="/auth" className="btn outline">Create Account</Link>
        </div>
      </div>
      <img src={heroImg} alt="Lost and Found Illustration" className="hero-img" />
    </section>
  );
}

export default Home;
