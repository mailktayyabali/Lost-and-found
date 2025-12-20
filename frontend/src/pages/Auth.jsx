import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation for sign up
    if (!isSignIn && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Call login from context (works for both sign in and sign up for this mock)
    const user = login(formData.email, formData.password);
    
    // Redirect based on role
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="text-center mb-8 fade-in">
        <h1 className="text-navy text-3xl font-bold mb-2">Welcome to FindIt</h1>
        <p className="text-slate text-sm">
          {isSignIn ? "Sign in to your account" : "Create a new account"}
        </p>
      </div>

      <div className="card-minimal w-full max-w-md p-8 fade-in">
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-lg overflow-hidden mb-6">
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium transition-all ${isSignIn ? "bg-navy text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium transition-all ${!isSignIn ? "bg-navy text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sign Up Only: Full Name */}
          {!isSignIn && (
            <div>
              <label className="block text-navy font-medium text-sm mb-2">
                Full Name
              </label>
              <div className="relative flex items-center">
                <i className="fa-solid fa-user absolute left-3 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-minimal w-full pl-10 pr-3 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-navy font-medium text-sm mb-2">
              Email
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-envelope absolute left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-minimal w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
             <p className="text-xs text-gray-400 mt-1">Tip: Use 'admin@findit.com' for Admin role</p>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-navy font-medium text-sm">Password</label>
              {isSignIn && (
                <Link to="#" className="text-teal text-xs hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative flex items-center">
              <i className="fa-solid fa-lock absolute left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={isSignIn ? "Enter your password" : "Create password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-minimal w-full pl-10 pr-10 py-2.5 text-sm"
              />
              <i
                className={`fa-solid absolute right-3 cursor-pointer text-gray-400 hover:text-navy ${showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                onClick={togglePassword}
              />
            </div>
          </div>

          {/* Sign Up Only: Confirm Password */}
          {!isSignIn && (
            <div>
              <label className="block text-navy font-medium text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <i className="fa-solid fa-lock absolute left-3 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-minimal w-full pl-10 pr-10 py-2.5 text-sm"
                />
                <i
                  className={`fa-solid absolute right-3 cursor-pointer text-gray-400 hover:text-navy ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  onClick={toggleConfirmPassword}
                />
              </div>
            </div>
          )}

          {/* Remember Me / Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id={isSignIn ? "remember" : "terms"}
              required={!isSignIn}
              className="accent-teal w-4 h-4 cursor-pointer"
            />
            <label htmlFor={isSignIn ? "remember" : "terms"} className="text-gray-700 cursor-pointer">
              {isSignIn ? (
                "Remember me"
              ) : (
                <>
                  I agree to the{" "}
                  <Link to="#" className="text-teal font-medium hover:underline">
                    Terms & Conditions
                  </Link>
                </>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3 text-sm"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-5 text-gray-400 text-xs">
            <span className="flex-1 h-px bg-gray-300"></span>
            Or continue with
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Social Buttons */}
          <SocialButtons />

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By signing {isSignIn ? "in" : "up"}, you agree to our commitment to privacy and security of
            your data.
          </p>
        </form>
      </div>
    </main>
  );
}

export default Auth;
