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
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-yellow-400">FindIt</span>
          </h1>
          <p className="mb-4 text-lg md:text-xl">
            At FindIt, we believe in the power of community and technology to
            bring people together — and their lost items back home. Every day,
            people lose valuable belongings, and honest individuals find them
            but have no way to return them.
          </p>
          <p className="text-lg md:text-xl">
            That's where FindIt comes in. We provide a simple, secure platform
            that connects finders and owners, building trust and promoting
            kindness in our digital world.
          </p>
        </div>
        <img
          src="/assets/images/team1.jpg"
          alt="About FindIt"
          className="md:w-1/2 rounded-xl shadow-lg"
        />
      </section>

      {/* OUR STORY SECTION */}
      <section className="w-full py-16 px-8 bg-white text-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-90">
          It all started with a missing backpack. One day, our founder lost her
          backpack with important documents and personal items. Despite
          searching everywhere, it seemed gone forever. A week later, a kind
          stranger found it and wanted to return it, but had no way to contact
          the owner.
        </p>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-90 mt-6">
          This experience sparked an idea: What if there was a simple, secure
          platform where people could report lost items and connect with
          finders? That's how FindIt was born.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="w-full py-16 px-8 text-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>

        {/* Paragraph below heading */}
        <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-10">
          At FindIt, we aim to build a community where lost items find their way
          back to their owners. Through innovation, trust, and kindness, we
          ensure that every lost and found item creates a positive connection
          between people.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 bg-[#A0B0C0] rounded-2xl shadow-lg hover:shadow-xl transition text-black">
            <i
              className="fa-solid fa-bullseye text-4xl mb-4"
              style={{ color: "#333333" }}
            ></i>
            <h3 className="text-2xl font-semibold mt-2">Our Mission</h3>
            <p className="mt-2">
              To create a trusted platform connecting finders and owners. We
              focus on making reporting and finding lost items easy, secure, and
              fast, ensuring a seamless experience for everyone.
            </p>
          </div>

          <div className="p-8 bg-[#A0B0C0] rounded-2xl shadow-lg hover:shadow-xl transition text-black">
            <i
              className="fa-solid fa-eye text-4xl mb-4"
              style={{ color: "#333333" }}
            ></i>
            <h3 className="text-2xl font-semibold mt-2">Our Vision</h3>
            <p className="mt-2">
              To become the go-to global platform for lost and found. We
              envision a world where no valuable item remains lost, and every
              community becomes more connected through trust and kindness.
            </p>
          </div>

          <div className="p-8 bg-[#A0B0C0] rounded-2xl shadow-lg hover:shadow-xl transition text-black">
            <i
              className="fa-solid fa-heart text-4xl mb-4"
              style={{ color: "#333333" }}
            ></i>
            <h3 className="text-2xl font-semibold mt-2">Our Values</h3>
            <p className="mt-2">
              Trust, community, kindness, and security are at the heart of
              everything we do. We strive to create a culture of helpfulness,
              integrity, and compassion, making the world a better place, one
              found item at a time.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="w-full py-16 px-8 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="flip-card-container">
              <div className="flip-card-inner">
                {/* FRONT SIDE */}
                <div className="flip-card-front rounded-2xl overflow-hidden shadow-lg relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex flex-col items-center">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm">{member.role}</p>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="flip-card-back rounded-2xl p-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#346B7D] to-[#6EAAB8] text-white shadow-lg">
                  <h3 className="text-xl font-semibold mb-3">{member.name}</h3>
                  <p className="text-sm font-medium mb-2 opacity-80">{member.role}</p>
                  <p className="text-center text-sm leading-relaxed opacity-90">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GET IN TOUCH SECTION */}
        <div className="mt-16 py-12 px-8 bg-gray-100 max-w-3xl mx-auto text-center rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We love hearing from our community! Whether you have questions,
            suggestions, or want to collaborate, feel free to reach out. Connect
            with us and be part of our journey to make lost items find their way
            home.
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
