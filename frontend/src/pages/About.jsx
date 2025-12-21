import { Link } from "react-router-dom";

function About() {
  const teamMembers = [
    {
      img: "/assets/images/team1.jpg",
      name: "Alishba Khan",
      role: "Founder",
      bio: "Passionate about connecting people and their belongings. Started FindIt after losing her own backpack.",
    },
    {
      img: "/assets/images/team2.jpg",
      name: "Ahmed Raza",
      role: "UI/UX Designer",
      bio: "Creates beautiful and intuitive experiences. Believes design should be accessible to everyone.",
    },
    {
      img: "/assets/images/team3.jpg",
      name: "Sara Malik",
      role: "Marketing Lead",
      bio: "Spreads the word about FindIt and helps build our community of helpful individuals.",
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 bg-gradient-to-r from-[#0d9488]/10 to-[#1e293b]/10">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1e293b]">
            About <span className="text-[#0d9488]">FindIt</span>
          </h1>
          <p className="mb-4 text-lg text-[#64748b]">
            At FindIt, we believe in the power of community and technology to
            bring people together — and their lost items back home. Every day,
            people lose valuable belongings, and honest individuals find them
            but have no way to return them.
          </p>
          <p className="text-lg text-[#64748b]">
            That's where FindIt comes in. We provide a simple, secure platform
            that connects finders and owners, building trust and promoting
            kindness in our digital world.
          </p>
        </div>
        <img
          src="/assets/images/abouthero.jpg"
          alt="About FindIt"
          className="md:w-1/2 rounded-xl shadow-lg"
        />
      </section>

      {/* OUR STORY SECTION */}
      <section className="w-full py-16 px-8 bg-white text-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#1e293b]">Our Story</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-[#64748b]">
          It all started with a missing backpack. One day, our founder lost her
          backpack with important documents and personal items. Despite
          searching everywhere, it seemed gone forever. A week later, a kind
          stranger found it and wanted to return it, but had no way to contact
          the owner.
        </p>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-[#64748b] mt-6">
          This experience sparked an idea: What if there was a simple, secure
          platform where people could report lost items and connect with
          finders? That's how FindIt was born.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="w-full py-16 px-8 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-4 text-[#1e293b]">Our Mission & Vision</h2>

        <p className="max-w-3xl mx-auto text-lg text-[#64748b] mb-10">
          At FindIt, we aim to build a community where lost items find their way
          back to their owners. Through innovation, trust, and kindness, we
          ensure that every lost and found item creates a positive connection
          between people.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="card-minimal p-8 group">
            <div className="w-16 h-16 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0d9488]/20 transition">
              <i className="fa-solid fa-bullseye text-4xl text-[#0d9488]"></i>
            </div>
            <h3 className="text-2xl font-semibold mt-2 text-[#1e293b]">Our Mission</h3>
            <p className="mt-3 text-[#64748b]">
              To create a trusted platform connecting finders and owners. We
              focus on making reporting and finding lost items easy, secure, and
              fast, ensuring a seamless experience for everyone.
            </p>
          </div>

          <div className="card-minimal p-8 group">
            <div className="w-16 h-16 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0d9488]/20 transition">
              <i className="fa-solid fa-eye text-4xl text-[#0d9488]"></i>
            </div>
            <h3 className="text-2xl font-semibold mt-2 text-[#1e293b]">Our Vision</h3>
            <p className="mt-3 text-[#64748b]">
              To become the go-to global platform for lost and found. We
              envision a world where no valuable item remains lost, and every
              community becomes more connected through trust and kindness.
            </p>
          </div>

          <div className="card-minimal p-8 group">
            <div className="w-16 h-16 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0d9488]/20 transition">
              <i className="fa-solid fa-heart text-4xl text-[#0d9488]"></i>
            </div>
            <h3 className="text-2xl font-semibold mt-2 text-[#1e293b]">Our Values</h3>
            <p className="mt-3 text-[#64748b]">
              Trust, community, kindness, and security are at the heart of
              everything we do. We strive to create a culture of helpfulness,
              integrity, and compassion, making the world a better place, one
              found item at a time.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="w-full py-16 px-8 text-center bg-white">
        <h2 className="text-3xl font-bold mb-12 text-[#1e293b]">Meet Our Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="flip-card-container">
              <div className="flip-card-inner">
                {/* FRONT SIDE */}
                <div className="flip-card-front rounded-xl overflow-hidden shadow-md relative bg-white">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e293b]/95 via-[#1e293b]/80 to-transparent text-white p-5 flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-white/90">{member.role}</p>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="flip-card-back rounded-xl p-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#64748b] text-white shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-white">{member.name}</h3>
                  <p className="text-sm font-medium mb-3 text-white/80">
                    {member.role}
                  </p>
                  <p className="text-center text-sm leading-relaxed text-white/90">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GET IN TOUCH SECTION */}
        <div className="mt-16 py-12 px-8 bg-gray-50 max-w-3xl mx-auto text-center rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-[#1e293b]">Get in Touch</h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-6">
            We love hearing from our community! Whether you have questions,
            suggestions, or want to collaborate, feel free to reach out. Connect
            with us and be part of our journey to make lost items find their way
            home.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition shadow-md font-medium"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

export default About;
