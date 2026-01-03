import { useState } from "react";
import { authApi } from "../services/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      if (res && res.success) {
        setMessage(res.message || 'If an account exists, a reset email has been sent');
      } else {
        setError(res.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card-minimal w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4">Reset your password</h2>
        <p className="text-sm text-slate mb-4">Enter your email and we'll send a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-minimal w-full"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded">{message}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </main>
  );
}
