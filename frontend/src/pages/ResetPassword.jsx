import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, password);
      if (res && res.success) {
        setMessage('Password reset successfully. You can now sign in.');
        setTimeout(() => navigate('/auth'), 1500);
      } else {
        setError(res.error || 'Failed to reset password');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card-minimal w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4">Set a new password</h2>
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-3">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-minimal w-full"
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input-minimal w-full"
          />

          <button type="submit" disabled={loading || !token} className="btn-primary w-full py-2">
            {loading ? 'Saving...' : 'Set password'}
          </button>
        </form>
      </div>
    </main>
  );
}
