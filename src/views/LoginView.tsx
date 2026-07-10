import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { X, Mail, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login } = useUserProfile();

  // Login state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    login(name.trim(), email.trim());
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) return;
    setResetLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResetLoading(false);
      setResetSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-wellora-beige flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-sm">

        {/* ── Forgot Password Panel ── */}
        {showForgotPassword ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-wellora-rose/15 animate-fade-in">
            {!resetSent ? (
              <>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetEmail(''); }}
                  className="flex items-center gap-1 text-wellora-mocha/60 hover:text-wellora-mocha text-xs font-semibold mb-6 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-wellora-rose/15 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-5 h-5 text-wellora-terracotta" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-wellora-mocha">Forgot Password?</h2>
                  <p className="text-xs text-wellora-mocha/60 mt-1 leading-relaxed">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-wellora-mocha text-xs font-semibold mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full border border-wellora-rose/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wellora-terracotta/30 focus:border-wellora-terracotta transition"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-wellora-terracotta text-white py-3 rounded-full font-semibold text-sm hover:bg-wellora-terracotta/95 disabled:opacity-60 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {resetLoading ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Reset email sent confirmation */
              <div className="text-center py-4 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-serif text-lg font-bold text-wellora-mocha mb-2">Reset Link Sent!</h3>
                <p className="text-xs text-wellora-mocha/70 leading-relaxed mb-6">
                  If an account exists for <span className="font-bold text-wellora-terracotta">{resetEmail}</span>, you'll receive a password reset link shortly.
                </p>
                <p className="text-[10px] text-wellora-mocha/40 mb-6">
                  Check your spam folder if you don't see it within a few minutes.
                </p>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetSent(false); setResetEmail(''); }}
                  className="w-full py-3 bg-wellora-terracotta text-white rounded-full font-semibold text-sm hover:bg-wellora-terracotta/95 transition-all"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Login Form ── */
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-wellora-rose/15">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-wellora-terracotta flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                  W
                </div>
                <span className="font-serif text-lg font-bold tracking-wide text-wellora-mocha">
                  wellora <span className="text-wellora-terracotta italic font-normal">mama</span>
                </span>
              </div>
            </div>

            <h2 className="text-xl font-serif text-wellora-mocha text-center mb-1 font-bold">
              Welcome Back
            </h2>
            <p className="text-[11px] text-wellora-mocha/50 text-center mb-6">Log in to continue your wellness journey.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-wellora-mocha text-xs font-semibold mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full border border-wellora-rose/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wellora-terracotta/30 focus:border-wellora-terracotta transition"
                  required
                />
              </div>

              <div>
                <label className="block text-wellora-mocha text-xs font-semibold mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full border border-wellora-rose/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wellora-terracotta/30 focus:border-wellora-terracotta transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-wellora-mocha text-xs font-semibold">Password</label>
                  {/* Forgot password — ONLY here, not on account creation */}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-wellora-terracotta text-[11px] font-semibold hover:underline transition-all"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-wellora-rose/25 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-wellora-terracotta/30 focus:border-wellora-terracotta transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wellora-mocha/40 hover:text-wellora-mocha transition-all"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-wellora-terracotta text-white py-3 rounded-full font-semibold text-sm hover:bg-wellora-terracotta/95 transition-all shadow-sm mt-2"
              >
                Log In
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Success Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl relative w-full max-w-xs">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute right-3 top-3 text-wellora-mocha/60 hover:text-wellora-mocha"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-serif text-wellora-terracotta font-bold mb-1">Success!</h3>
              <p className="text-xs text-wellora-mocha/80">You are now logged in. Redirecting…</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
