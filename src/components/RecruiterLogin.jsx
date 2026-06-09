import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { KeyRound, Mail, AlertCircle, Info, Lock } from "lucide-react";

const RecruiterLogin = () => {
  const { login, sendPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { user, error: loginErr } = await login(email.trim(), password);
      if (loginErr) {
        if (loginErr.includes("auth/user-not-found") || loginErr.includes("auth/wrong-password") || loginErr.includes("invalid-credential")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(loginErr);
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setResetSuccess("");
    setForgotLoading(true);

    if (!forgotEmail) {
      setForgotError("Please enter your email address.");
      setForgotLoading(false);
      return;
    }

    const { success, error: resetErr } = await sendPasswordReset(forgotEmail.trim());
    setForgotLoading(false);
    if (success) {
      setResetSuccess(`A password reset link has been sent to ${forgotEmail}.`);
      setShowForgotModal(false);
      setForgotEmail("");
    } else {
      setForgotError(resetErr || "Failed to send reset email.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
      <div className="text-center mb-8">
        <div className="bg-blue-50 rounded-full p-3.5 w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-navy-800">Recruiter Access Portal</h2>
        <p className="text-slate-500 text-xs mt-1">Authorized access only. Log in to manage applications.</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <div className="flex items-start text-slate-700 text-xs">
          <Info className="w-4.5 h-4.5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-800">Recruiter Access Instructions:</p>
            <p className="mt-1 leading-relaxed text-slate-600">
              Please obtain your login credentials from your company owner. Do not use any demo or shared account details here.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start text-rose-800 text-sm font-semibold bg-rose-50 border border-rose-100 p-3.5 rounded-lg mb-5">
          <AlertCircle className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resetSuccess && (
        <div className="text-emerald-800 text-sm font-semibold bg-emerald-50 border border-emerald-100 p-3.5 rounded-lg mb-5">
          {resetSuccess}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="off"
              className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(true);
                setForgotError("");
              }}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <KeyRound className="w-4 h-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="off"
              className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 flex items-center justify-center text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging In...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-navy-800 mb-2">Reset Password</h3>
            <p className="text-slate-500 text-xs mb-5">Enter your email address and we'll send you a recovery link.</p>
            
            {forgotError && (
              <div className="text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-lg mb-4">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="text-slate-500 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterLogin;
