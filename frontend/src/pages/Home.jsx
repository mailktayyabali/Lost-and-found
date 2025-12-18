import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-gradient-to-br from-[#1e293b] to-[#64748b] text-white overflow-hidden relative">
        {/* Text Content */}
        <div className="max-w-xl space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Find What's Lost, Return What's Found
          </h1>
          <p className="text-lg text-white opacity-90">
            Connecting people to their lost belongings securely and easily.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Link
              to="/auth"
              className="px-6 py-3 bg-[#0d9488] text-white font-semibold rounded-lg shadow-md hover:bg-[#0f766e] transition hover:-translate-y-0.5"
            >
              Sign In
            </Link>

            <button
              onClick={() => navigate("/auth", { state: { signUp: true } })}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition backdrop-blur"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Hero Image with Floating Effect */}
        <div className="relative mt-10 md:mt-0 z-10">
          <div className="relative w-[320px] md:w-[450px] h-auto">
            {/* Decorative background circles */}
            <div className="absolute -top-10 -right-10 w-full h-full bg-[#0d9488]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-3/4 h-3/4 bg-[#0d9488]/5 rounded-full blur-2xl"></div>

            {/* Image */}
            <div className="relative bg-transparent rounded-2xl overflow-visible">
              <img
                src="/assets/home.jpg"
                alt="Lost and Found"
                className="w-full h-auto rounded-2xl object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                }}
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="px-10 py-20 text-center bg-gray-50">
        <h2 className="text-3xl font-bold text-[#1e293b] mb-4">
          How It Works
        </h2>
        <p className="text-[#64748b] mb-12 max-w-2xl mx-auto">
          Simple, secure, and effective way to reunite lost items with their owners
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="card-minimal p-8 text-center group">
            <div className="w-16 h-16 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0d9488]/20 transition">
              <i className="fa-solid fa-magnifying-glass text-3xl text-[#0d9488]"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#1e293b]">Search</h3>
            <p className="text-[#64748b]">
              Browse reports to find your lost items quickly and easily.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-minimal p-8 text-center group">
            <div className="w-16 h-16 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0d9488]/20 transition">
              <i className="fa-solid fa-bullhorn text-3xl text-[#0d9488]"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#1e293b]">Report</h3>
            <p className="text-[#64748b]">
              Report a lost or found item within seconds.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-minimal p-8 text-center group">
            <div className="w-16 h-16 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0d9488]/20 transition">
              <i className="fa-solid fa-handshake text-3xl text-[#0d9488]"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#1e293b]">Reconnect</h3>
            <p className="text-[#64748b]">
              Safely connect with the rightful owner and return belongings.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
