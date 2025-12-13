import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-gradient-to-br from-[#2E5C6B] to-[#3D7A8C] text-white overflow-hidden relative">
        {/* Text Content */}
        <div className="max-w-xl space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find What's Lost, Return What's Found
          </h1>
          <p className="text-lg opacity-90">
            Connecting people to their lost belongings securely and easily.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Link
              to="/auth"
              className="px-6 py-3 bg-white text-[#2E5C6B] font-semibold rounded-xl shadow-md hover:bg-yellow-400 transition"
            >
              Sign In
            </Link>

            <Link
              to="/auth"
              className="px-6 py-3 border border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition backdrop-blur"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Hero Image with Floating Effect */}
        <div className="relative mt-10 md:mt-0 z-10">
          <div className="relative w-[320px] md:w-[450px] h-auto">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-full h-full bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-3/4 h-3/4 bg-white/5 rounded-full blur-2xl"></div>
            
            {/* Image with transparent background effect */}
            <div className="relative bg-transparent rounded-2xl overflow-visible">
              <img
                src="/assets/home.jpg"
                alt="Lost and Found"
                className="w-full h-auto rounded-2xl object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                  mixBlendMode: 'normal'
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
        <h2 className="text-3xl font-bold text-[#2E5C6B] mb-12">
          How It Works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <i className="fa-solid fa-magnifying-glass text-4xl text-[#2E5C6B] mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Search</h3>
            <p className="text-gray-600">
              Browse reports to find your lost items quickly and easily.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <i className="fa-solid fa-bullhorn text-4xl text-[#2E5C6B] mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Report</h3>
            <p className="text-gray-600">
              Report a lost or found item within seconds.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <i className="fa-solid fa-handshake text-4xl text-[#2E5C6B] mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Reconnect</h3>
            <p className="text-gray-600">
              Safely connect with the rightful owner and return belongings.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
