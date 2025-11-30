function About() {
  const teamMembers = [
    { 
      img: "/assets/images/team1.jpg", 
      name: "Alishba Khan", 
      role: "Founder",
      bio: "Passionate about connecting people and their belongings. Started FindIt after losing her own backpack."
    },
    { 
      img: "/assets/images/team2.jpg", 
      name: "Ahmed Raza", 
      role: "UI/UX Designer",
      bio: "Creates beautiful and intuitive experiences. Believes design should be accessible to everyone."
    },
    { 
      img: "/assets/images/team3.jpg", 
      name: "Sara Malik", 
      role: "Marketing Lead",
      bio: "Spreads the word about FindIt and helps build our community of helpful individuals."
    }
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            About <span style={{ color: '#ffdc73' }}>FindIt</span>
          </h1>
          <p>
            At FindIt, we believe in the power of community and technology to bring people together — and their lost items back home. Every day, people lose valuable belongings, and honest individuals find them but have no way to return them.
          </p>
          <p>
            That's where FindIt comes in. We provide a simple, secure platform that connects finders and owners, building trust and promoting kindness in our digital world.
          </p>
        </div>
        <img src="/assets/images/team1.jpg" alt="About FindIt" className="hero-img" />
      </section>

      {/* OUR STORY SECTION */}
      <section className="how-it-works" style={{ background: 'linear-gradient(135deg, #346B7D, #6EAAB8)', color: '#fff' }}>
        <h2 style={{ color: '#fff' }}>Our Story</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', color: '#f0f0f0' }}>
          It all started with a missing backpack. One day, our founder lost her backpack with important documents and personal items. Despite searching everywhere, it seemed gone forever. A week later, a kind stranger found it and wanted to return it, but had no way to contact the owner.
        </p>
        <p style={{ maxWidth: '800px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: '1.8', color: '#f0f0f0' }}>
          This experience sparked an idea: What if there was a simple, secure platform where people could report lost items and connect with finders? That's how FindIt was born. Today, we've helped reunite hundreds of people with their lost belongings, and we're just getting started.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="how-it-works">
        <h2>Our Mission & Vision</h2>
        <div className="steps">
          <div className="step">
            <i className="fa-solid fa-bullseye"></i>
            <h3>Our Mission</h3>
            <p>To create a trusted platform that makes it easy for people to report lost items and connect with finders, fostering a community built on kindness and trust.</p>
          </div>
          <div className="step">
            <i className="fa-solid fa-eye"></i>
            <h3>Our Vision</h3>
            <p>To become the go-to platform for lost and found items worldwide, where every lost item has a chance to be reunited with its owner.</p>
          </div>
          <div className="step">
            <i className="fa-solid fa-heart"></i>
            <h3>Our Values</h3>
            <p>Trust, community, kindness, and security are at the heart of everything we do. We believe in making the world a better place, one found item at a time.</p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-container">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="card-inner">
                <div className="card-front">
                  <img src={member.img} alt={member.name} />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <div className="card-back">
                  <h3>{member.name}</h3>
                  <p>{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default About;
