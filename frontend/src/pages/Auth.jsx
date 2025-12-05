import { useState } from "react";
import SocialButtons from "../components/SocialButtons";

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#346B7D] to-[#5C9EA9] px-4">
      <div className="text-center mt-10 mb-4 animate-fadeIn">
        <h1 className="text-white text-2xl font-bold">Welcome to FindIt</h1>
        <p className="text-[#bac1ca] text-sm mt-1 mb-4">
          Sign in to your account or create a new one
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-[#e6eeff] border border-[#dbeafe] rounded-2xl shadow-lg w-full max-w-sm p-8 animate-fadeIn hover:translate-y-[-5px] hover:bg-gradient-to-br hover:from-[#f8fbff] hover:to-[#eaf1ff] transition-all duration-300 mb-8">
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-lg overflow-hidden mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium transition ${
              isSignIn ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition ${
              !isSignIn ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        <form className={`${isSignIn ? "block" : "hidden"} animate-slideIn`}>
          <label className="block text-gray-900 font-bold text-sm mb-1">
            Email
          </label>
          <div className="relative flex items-center mb-4">
            <i className="fa-solid fa-envelope absolute left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md outline-none text-gray-900 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center mb-1">
            <label className="text-gray-900 font-bold text-sm">Password</label>
            <a href="#" className="text-blue-600 text-xs hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative flex items-center mb-4">
            <i className="fa-solid fa-lock absolute left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="w-full pl-10 pr-10 py-2 border rounded-md outline-none text-gray-900 focus:border-blue-500"
            />
            <i
              className={`fa-solid absolute right-3 cursor-pointer text-gray-400 ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              onClick={togglePassword}
            />
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <input
              type="checkbox"
              id="remember"
              className="accent-gray-900 w-4 h-4"
            />
            <label htmlFor="remember" className="text-gray-900">
              Remember me
            </label>
          </div>

          <button className="w-full py-2 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition">
            Sign In
          </button>

          <div className="flex items-center justify-center gap-2 my-4 text-gray-400 text-xs">
            <span className="flex-1 h-px bg-gray-300"></span>
            Or continue with
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          <SocialButtons />
          {/* Privacy paragraph */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            By signing, you agree to our commitment to privacy and security of
            your data.
          </p>
        </form>

        {/* Sign Up Form */}
        <form className={`${!isSignIn ? "block" : "hidden"} animate-slideIn`}>
          <label className="block text-gray-900 font-bold text-sm mb-1">
            Full Name
          </label>
          <div className="relative flex items-center mb-4">
            <i className="fa-solid fa-user absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Enter your full name"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md outline-none text-gray-900 focus:border-blue-500"
            />
          </div>

          <label className="block text-gray-900 font-bold text-sm mb-1">
            Email
          </label>
          <div className="relative flex items-center mb-4">
            <i className="fa-solid fa-envelope absolute left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md outline-none text-gray-900 focus:border-blue-500"
            />
          </div>

          <label className="block text-gray-900 font-bold text-sm mb-1">
            Password
          </label>
          <div className="relative flex items-center mb-4">
            <i className="fa-solid fa-lock absolute left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              required
              className="w-full pl-10 pr-10 py-2 border rounded-md outline-none text-gray-900 focus:border-blue-500"
            />
            <i
              className={`fa-solid absolute right-3 cursor-pointer text-gray-400 ${
                showPassword ? "fa-eye" : "fa-eye-slash"
              }`}
              onClick={togglePassword}
            />
          </div>

          <label className="block text-gray-900 font-bold text-sm mb-1">
            Confirm Password
          </label>
          <div className="relative flex items-center mb-4">
            <i className="fa-solid fa-lock absolute left-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              required
              className="w-full pl-10 pr-10 py-2 border rounded-md outline-none text-gray-900 focus:border-blue-500"
            />
            <i
              className={`fa-solid absolute right-3 cursor-pointer text-gray-400 ${
                showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              onClick={toggleConfirmPassword}
            />
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <input
              type="checkbox"
              id="terms"
              required
              className="accent-gray-900 w-4 h-4"
            />
            <label htmlFor="terms" className="text-gray-500">
              I agree to the{" "}
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          <button className="w-full py-2 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition mb-4">
            Create Account
          </button>

          <div className="flex items-center justify-center gap-2 my-4 text-gray-400 text-xs">
            <span className="flex-1 h-px bg-gray-300"></span>
            Or continue with
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          <SocialButtons />
          {/* Privacy paragraph */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            By signing, you agree to our commitment to privacy and security of
            your data.
          </p>
        </form>
      </div>
    </main>
  );
}

export default Auth;
