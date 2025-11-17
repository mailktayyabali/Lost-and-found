import aboutImg from "../assets/images/about.jpeg";
import team1 from "../assets/images/team1.jpg";
import team2 from "../assets/images/team2.jpg";
import team3 from "../assets/images/team3.jpg";

function About() {
  return (
    <section className="about">
      <div className="hero about-hero">
        <div className="hero-content">
          <h1>
            About <span style={{ color: "#ffdc73" }}>FindIt</span>
          </h1>
          <p>
            At <b>FindIt</b>, we help lost things reunite with their humans. Tech with heart.
          </p>
        </div>
        <img src={aboutImg} alt="About" className="hero-img" />
      </div>

      <h2 className="section-title">Our Story</h2>
      <p className="section-text">
        It all started with a missing backpack. Now we solve 100s of lost & found cases.
      </p>

      <div className="team">
        <h2>Meet Our Team</h2>
        <div className="team-container">
          {[{ img: team1, name: "Alishba Khan", role: "Founder" },
            { img: team2, name: "Ahmed Raza", role: "UI/UX Designer" },
            { img: team3, name: "Sara Malik", role: "Marketing Lead" }].map((member) => (
            <div className="team-card" key={member.name}>
              <img src={member.img} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
