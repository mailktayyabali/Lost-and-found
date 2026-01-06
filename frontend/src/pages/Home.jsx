import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Search, CheckCircle, PlusCircle } from "lucide-react";

function Home() {
  const { user } = useAuth();

  // Redirect admins to Admin Dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-[#0f172a] overflow-hidden min-h-[600px] flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-teal/20 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col md:flex-row items-center gap-12">

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            {user ? (
              // LOGGED IN VIEW
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-bold uppercase tracking-widest mb-6">
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
                  Welcome back, {user.name}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                  Manage your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-emerald-400">Lost & Found</span> items.
                </h1>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  Jump straight into your dashboard or check the latest items reported in your area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-teal hover:bg-teal-dark text-white rounded-xl text-base font-bold shadow-lg shadow-teal/20 hover:shadow-teal/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/report"
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-base font-bold transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={18} className="text-teal" /> Report New Item
                  </Link>
                </div>
              </>
            ) : (
              // GUEST VIEW
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
                  Community Driven Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                  Lost something? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-emerald-400">Let's find it.</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  FindIt connects you with people around you to help recover lost items.
                  Simple, fast, and community-powered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to="/lost-items"
                    className="px-8 py-4 bg-teal hover:bg-teal-dark text-white rounded-xl text-base font-bold shadow-lg shadow-teal/20 hover:shadow-teal/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    I Lost Something <Search size={18} />
                  </Link>
                  <Link
                    to="/found-items"
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-base font-bold transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    I Found Something <CheckCircle size={18} className="text-teal" />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Hero Image/Illustration would go here */}
          <div className="flex-1 relative hidden md:block">
            {/* Abstract decorative elements simulating items */}
            <div className="relative z-10 grid grid-cols-2 gap-4 animate-float-slow">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform translate-y-8">
                <div className="h-40 bg-slate-800/50 rounded-xl mb-3 flex items-center justify-center">
                  <Search size={48} className="text-teal/20" />
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-white/5 rounded"></div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform -translate-y-8">
                <div className="h-40 bg-slate-800/50 rounded-xl mb-3 flex items-center justify-center">
                  <CheckCircle size={48} className="text-purple-500/20" />
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-white/5 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (Placeholder for guest/user context) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center text-teal mx-auto mb-6">
                <i className="fa-solid fa-pen-to-square text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">1. Report</h3>
              <p className="text-slate leading-relaxed">Details about what you lost or found helping others identify it.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-6">
                <i className="fa-solid fa-bell text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">2. Notify</h3>
              <p className="text-slate leading-relaxed">Our system matches keywords and locations to alert relevant users.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                <i className="fa-solid fa-handshake text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">3. Recover</h3>
              <p className="text-slate leading-relaxed">Connect securely and arrange the return of the item.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
