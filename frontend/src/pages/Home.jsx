import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Find What's Lost, Return What's Found</h1>
          <p>Connecting people to their lost belongings securely and easily.</p>
          <div className="hero-buttons">
            <Link to="/auth" clas
            sName="btn primary">Sign In</Link>
            <Link to="/auth" className="btn outline">Create Account</Link>
          </div>
        </div>
        <img src="/assets/homepic.jpg" alt="Lost and Found Illustration" className="hero-img" />
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <i className="fa-solid fa-magnifying-glass"></i>
            <h3>Search</h3>
            <p>Browse reports to find your lost items quickly and easily.</p>
          </div>
          <div className="step">
            <i className="fa-solid fa-bullhorn"></i>
            <h3>Report</h3>
            <p>Report a lost or found item within seconds.</p>
          </div>
          <div className="step">
            <i className="fa-solid fa-handshake"></i>
            <h3>Reconnect</h3>
            <p>Safely connect with the rightful owner and return belongings.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
