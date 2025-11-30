import { useState } from "react";
import SocialButtons from "../components/SocialButtons";

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <main>
      <div className="page-header">
        <h1>Welcome to FindIt</h1>
        <p className="subtitle">Sign in to your account or create a new one</p>
      </div>
      
      <div className="container">
        <div className="tab">
          <button className={isSignIn ? "active" : ""} onClick={() => setIsSignIn(true)}>
            Sign In
          </button>
          <button className={!isSignIn ? "active" : ""} onClick={() => setIsSignIn(false)}>
            Sign Up
          </button>
        </div>

        <form className={isSignIn ? "active" : ""}>
          <label>Email</label>
          <div className="input-box">
            <i className="icon fa-solid fa-envelope"></i>
            <input type="email" placeholder="Enter your email" required />
          </div>
          
          <div className="password-row">
            <label>Password</label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          <div className="input-box">
            <i className="icon fa-solid fa-lock"></i>
            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required />
            <i 
              className={`toggle-password fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={togglePassword}
            ></i>
          </div>
          
          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          <button type="submit" className="submit">Sign In</button>
          
          <div className="divider">Or continue with</div>
          <SocialButtons />
        </form>

        <form className={!isSignIn ? "active" : ""}>
          <label>Full Name</label>
          <div className="input-box">
            <i className="icon fa-solid fa-user"></i>
            <input type="text" placeholder="Enter your full name" required />
          </div>
          
          <label>Email</label>
          <div className="input-box">
            <i className="icon fa-solid fa-envelope"></i>
            <input type="email" placeholder="Enter your email" required />
          </div>
          
          <label>Password</label>
          <div className="input-box">
            <i className="icon fa-solid fa-lock"></i>
            <input type={showPassword ? "text" : "password"} placeholder="Create password" required />
            <i 
              className={`toggle-password fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={togglePassword}
            ></i>
          </div>
          
          <label>Confirm Password</label>
          <div className="input-box">
            <i className="icon fa-solid fa-lock"></i>
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" required />
            <i 
              className={`toggle-password fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={toggleConfirmPassword}
            ></i>
          </div>
          
          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the <a href="#">Terms & Conditions</a></label>
          </div>
          
          <button type="submit" className="submit">Create Account</button>
          
          <div className="divider">Or continue with</div>
          <SocialButtons />
        </form>
      </div>
    </main>
  );
}

export default Auth;
