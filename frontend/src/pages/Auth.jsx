import { useState } from "react";
import SocialButtons from "../components/SocialButtons";

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <main className="auth-container">
      <h1>Welcome to FindIt</h1>
      <div className="tab">
        <button className={isSignIn ? "active" : ""} onClick={() => setIsSignIn(true)}>
          Sign In
        </button>
        <button className={!isSignIn ? "active" : ""} onClick={() => setIsSignIn(false)}>
          Sign Up
        </button>
      </div>

      {isSignIn ? (
        <form className="form">
          {/* Sign In Form */}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button className="submit">Sign In</button>
          <SocialButtons />
        </form>
      ) : (
        <form className="form">
          {/* Sign Up Form */}
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Create password" required />
          <input type="password" placeholder="Confirm password" required />
          <button className="submit">Create Account</button>
          <SocialButtons />
        </form>
      )}
    </main>
  );
}

export default Auth;
