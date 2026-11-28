// ==============================================================================
// NelovMallickIITD CBT Platform - AuthModal Component
// Supports:
// 1. One-Click Google OAuth Login
// 2. Email Login & Signup (Mandatory Contact Number for non-@gmail.com addresses)
// 3. Name & Contact Number Login & Signup (100% Free, Zero Paid SMS required)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TargetExam, isGmail, isValidIndianPhone, authService } from '../services/authService';
import { validateStrongPassword } from '../utils/validationSchemas';

export const AuthModal: React.FC = () => {
  const { authModalState, closeAuthModal, logIn, signUp, signInWithGoogle, continueAsGuest } = useAuth();
  const { isOpen, mode: initialMode, redirectUrl, message } = authModalState;

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'recovery'>(initialMode || 'login');
  const [authTab, setAuthTab] = useState<'email' | 'phone'>('email');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState<TargetExam>('JEE 2027');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    if (initialMode) setMode(initialMode);
    setError('');
    setSuccessMsg('');
    setShowResendConfirmation(false);
    setTermsAgreed(false);
    setParentalConsent(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const isGmailEntered = isGmail(email);

  const handleClose = () => {
    setError('');
    setSuccessMsg('');
    closeAuthModal();
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle(redirectUrl);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setError('');
    setResendLoading(true);
    try {
      const msg = await authService.resendVerificationEmail(email);
      setSuccessMsg(msg);
      setShowResendConfirmation(false);
    } catch (err: any) {
      setError(err?.message || 'Could not resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setShowResendConfirmation(false);
    setLoading(true);

    try {
      if (authTab === 'email') {
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) {
          throw new Error('Please enter your email address.');
        }
        await logIn({ email: trimmedEmail, password });
      } else {
        if (!contactNumber.trim()) {
          throw new Error('Please enter your 10-digit contact number.');
        }
        if (!isValidIndianPhone(contactNumber)) {
          throw new Error('Please enter a valid 10-digit mobile number.');
        }
        await logIn({ contactNumber: contactNumber.trim(), password });
      }

      closeAuthModal();
      if (redirectUrl) {
        window.location.hash = redirectUrl.startsWith('#') ? redirectUrl : `#${redirectUrl}`;
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to log in. Please check your credentials.';
      setError(msg);
      if (err?.code === 'EMAIL_NOT_CONFIRMED' || msg.toLowerCase().includes('not confirmed')) {
        setShowResendConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setShowResendConfirmation(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const pwErr = validateStrongPassword(password);
    if (pwErr) {
      setError(pwErr);
      return;
    }

    if (!termsAgreed) {
      setError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      const consentTimestamp = new Date().toISOString();
      if (authTab === 'email') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!email.trim()) throw new Error('Please enter your email address.');

        if (contactNumber.trim() && !isValidIndianPhone(contactNumber)) {
          throw new Error('Please enter a valid 10-digit mobile number (e.g. 98765 43210).');
        }

        const created = await signUp({
          name: name.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim() || undefined,
          password,
          targetExam,
          acceptedTermsAt: consentTimestamp,
          acceptedTermsVersion: '2026-11',
          parentalConsentConfirmed: parentalConsent
        });
        if (created.needsEmailConfirmation) {
          setSuccessMsg('Account created! Please check your email inbox (and spam folder) to confirm before signing in.');
          setShowResendConfirmation(true);
          setMode('login');
          return;
        }
      } else {
        // Name + Contact Number Sign Up (Zero Email Needed)
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!contactNumber.trim()) throw new Error('Please enter your contact number.');
        if (!isValidIndianPhone(contactNumber)) {
          throw new Error('Please enter a valid 10-digit mobile number (e.g. 98765 43210).');
        }

        await signUp({
          name: name.trim(),
          contactNumber: contactNumber.trim(),
          password,
          targetExam,
          acceptedTermsAt: consentTimestamp,
          acceptedTermsVersion: '2026-11',
          parentalConsentConfirmed: parentalConsent
        });
      }

      closeAuthModal();
      if (redirectUrl) {
        window.location.hash = redirectUrl.startsWith('#') ? redirectUrl : `#${redirectUrl}`;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSuccessMsg(`Password reset instructions sent to ${email.trim().toLowerCase()}. Check your inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const pwErr = validateStrongPassword(password);
    if (pwErr) {
      setError(pwErr);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(password);
      setSuccessMsg('Password updated! You are signed in.');
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Brand & Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            NM
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            {mode === 'login' && 'Welcome Back Aspirant'}
            {mode === 'signup' && 'Create Free Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {message || (mode === 'login'
              ? 'Sign in to attempt PTA/PTM tests, track your rank, and access lecture notes.'
              : '100% Free Access · Mentored by Nelov Mallick (IIT Delhi)')}
          </p>
          <div className="pt-0.5">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              ✓ 100% Free Forever · Zero SMS Fees · No Paywalls
            </span>
          </div>
        </div>

        {/* Method Switcher Tabs (Gmail/Email vs Name & Contact Number) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthTab('email'); setError(''); }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'email'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>✉️</span>
              <span>Gmail / Email</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('phone'); setError(''); }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'phone'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>📱</span>
              <span>Name + Contact</span>
            </button>
          </div>
        )}

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 space-y-2">
            <div className="flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            {showResendConfirmation && authTab === 'email' && email.includes('@') && (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendConfirmation}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors disabled:opacity-50"
              >
                {resendLoading ? 'Sending Verification Link...' : 'Resend Verification Email'}
              </button>
            )}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400 space-y-2">
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
            {showResendConfirmation && authTab === 'email' && email.includes('@') && (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendConfirmation}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors disabled:opacity-50"
              >
                {resendLoading ? 'Sending Verification Link...' : 'Resend Verification Email'}
              </button>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* OPTION A: GMAIL / EMAIL TAB */}
        {/* ==================================================================== */}
        {authTab === 'email' && (mode === 'login' || mode === 'signup') && (
          <div className="space-y-3">
            {/* 1-Click Continue with Google */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 font-bold text-xs shadow-sm transition-all hover:border-slate-400"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-[10px] text-center text-slate-500 dark:text-zinc-400 leading-normal pt-0.5 px-1">
              By logging in or creating an account, you agree to our{' '}
              <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Privacy Policy</a>{' '}
              (and confirm parent/guardian consent if under 18).
            </p>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-[#121318] px-3 text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                or sign in with email
              </span>
              <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
            </div>
          </div>
        )}

        {/* EMAIL LOG IN FORM */}
        {authTab === 'email' && mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 dark:text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); }}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with Email →'}
            </button>

            <p className="text-[10px] text-center text-slate-500 dark:text-zinc-400 leading-normal pt-1 px-1">
              By logging in or creating an account, you agree to our{' '}
              <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Privacy Policy</a>{' '}
              (and confirm parent/guardian consent if under 18).
            </p>

            <div className="pt-2 text-center text-slate-500 dark:text-zinc-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign Up 100% Free
              </button>
            </div>
          </form>
        )}

        {/* EMAIL SIGN UP FORM */}
        {authTab === 'email' && mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 dark:text-zinc-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                {isGmailEntered && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Gmail detected
                  </span>
                )}
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@gmail.com (or any email)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* OPTIONAL CONTACT NUMBER FIELD */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <span>Contact Number</span>
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
              </div>
              <div className="relative flex rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="inline-flex items-center px-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs border-r border-slate-200 dark:border-zinc-700">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none text-xs"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Optional contact number for study reminders and test alerts.
              </p>
            </div>

            {/* Target Exam */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Target Examination
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both'] as TargetExam[]).map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => setTargetExam(exam)}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                      targetExam === exam
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8+ chars (letter + num)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-zinc-300">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Mandatory DPDP Clickwrap Agreement */}
            <div className="space-y-2 pt-1 pb-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] leading-relaxed text-slate-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  required
                />
                <span>
                  I agree to the{' '}
                  <a
                    href="#/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700"
                  >
                    Privacy Policy
                  </a>
                  , and confirm I have parent/guardian consent if I am under 18. <span className="text-rose-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I am under 18 and registering with my parent/guardian's permission
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAgreed}
              className="w-full py-3 mt-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Free Registration →'}
            </button>

            <p className="text-[10px] text-center text-slate-500 dark:text-zinc-400 leading-normal pt-1 px-1">
              By logging in or creating an account, you agree to our{' '}
              <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Privacy Policy</a>{' '}
              (and confirm parent/guardian consent if under 18).
            </p>

            <div className="pt-2 text-center text-slate-500 dark:text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* OPTION B: NAME + CONTACT NUMBER TAB (100% Free, Zero SMS Cost) */}
        {/* ==================================================================== */}
        {authTab === 'phone' && mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-200">
              📱 <strong>Quick Contact Number Login:</strong> Enter your registered 10-digit mobile number and password/PIN to continue.
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Registered Contact Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="inline-flex items-center px-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs border-r border-slate-200 dark:border-zinc-700">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Password / 6-Digit PIN <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password / PIN"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with Contact Number →'}
            </button>

            <p className="text-[10px] text-center text-slate-500 dark:text-zinc-400 leading-normal pt-1 px-1">
              By logging in or creating an account, you agree to our{' '}
              <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Privacy Policy</a>{' '}
              (and confirm parent/guardian consent if under 18).
            </p>

            <div className="pt-2 text-center text-slate-500 dark:text-zinc-400">
              Need to register with contact number?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign Up Here
              </button>
            </div>
          </form>
        )}

        {authTab === 'phone' && mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-200">
              🚀 <strong>No Email Required!</strong> Create an account with just your Name & Contact Number. 100% Free Forever.
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="inline-flex items-center px-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs border-r border-slate-200 dark:border-zinc-700">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none text-xs"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Enter your 10-digit mobile number. You will use this to log in anytime.
              </p>
            </div>

            {/* Target Exam */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Target Examination
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['JEE Advanced', 'JEE Mains', 'Both'] as TargetExam[]).map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => setTargetExam(exam)}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                      targetExam === exam
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">
                    Password / PIN <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8+ chars (letter + num)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-zinc-300">
                  Confirm Password / PIN <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Mandatory DPDP Clickwrap Agreement */}
            <div className="space-y-2 pt-1 pb-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] leading-relaxed text-slate-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  required
                />
                <span>
                  I agree to the{' '}
                  <a
                    href="#/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700"
                  >
                    Privacy Policy
                  </a>
                  , and confirm I have parent/guardian consent if I am under 18. <span className="text-rose-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I am under 18 and registering with my parent/guardian's permission
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAgreed}
              className="w-full py-3 mt-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Free Registration →'}
            </button>

            <p className="text-[10px] text-center text-slate-500 dark:text-zinc-400 leading-normal pt-1 px-1">
              By logging in or creating an account, you agree to our{' '}
              <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Privacy Policy</a>{' '}
              (and confirm parent/guardian consent if under 18).
            </p>

            <div className="pt-2 text-center text-slate-500 dark:text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign In with Contact Number
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Enter your registered email address and we'll send password reset instructions right away.
            </p>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Password Reset Link →'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                ← Back to Log In
              </button>
            </div>
          </form>
        )}

        {mode === 'recovery' && (
          <form onSubmit={handleRecoverySubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-300">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars (letter + num)"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-300">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white font-extrabold text-xs">
              {loading ? 'Updating Password...' : 'Save New Password →'}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-200/70 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={async () => {
              await continueAsGuest();
              handleClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.09] text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Continue as Guest (Local &amp; Free Mocks)
          </button>
        </div>
      </div>
    </div>
  );
};
