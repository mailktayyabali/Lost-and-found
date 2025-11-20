

function About() {
  return (
    <section className="about-section">
      {/* HERO SECTION */}
      <div className="hero about-hero">
        <div className="hero-content">
          <h1>
            About <span className="highlight">FindIt</span>
          </h1>
          <p>
            At FindIt, we believe in the power of community and technology to bring people together — and their lost items back home. Every day, people lose valuable belongings, and honest individuals find them but have no way to return them.

That’s where FindIt comes in. We provide a simple, secure platform that connects finders and owners, building trust and promoting kindness in our digital world.
          </p>
        </div>

        <img src="/assets/images/team1.jpg" alt="About" className="hero-img" />
      </div>

      {/* STORY */}
      <h2 className="section-title">Our Story</h2>
      <p className="section-text">
        It all started with a missing backpack. Now we solve 100s of lost & found cases.
      </p>

      {/* TEAM */}
      <div className="team">
        <h2 className="team-heading">Meet Our Team</h2>

        <div className="team-container">
          {[
            { img: "/assets/images/team1.jpg", name: "Alishba Khan", role: "Founder" },
            { img: "/assets/images/team2.jpg", name: "Ahmed Raza", role: "UI/UX Designer" },
            { img: "/assets/images/team3.jpg", name: "Sara Malik", role: "Marketing Lead" }
          ].map((member) => (
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
