import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, TargetExam } from '../services/authService';

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'recovery';
  onSuccess: () => void;
  onContinueGuest: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onContinueGuest,
}) => {
  const { logIn, signUp, signInWithGoogle, continueAsGuest, isCloudConnected } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'recovery'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState<TargetExam>('JEE 2027');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
    setSuccessMsg('');
    setShowResendConfirmation(false);
  }, [initialMode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setShowResendConfirmation(false);
    setLoading(true);
    try {
      if (mode === 'login') {
        await logIn({ email: email.trim().toLowerCase(), password });
        onSuccess();
      } else if (mode === 'signup') {
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        const created = await signUp({
          name: name.trim(),
          email: email.trim(),
          password,
          targetExam,
          acceptedTermsAt: new Date().toISOString(),
          acceptedTermsVersion: '2026-11',
          parentalConsentConfirmed: true,
        });
        if (created.needsEmailConfirmation) {
          setSuccessMsg('Account created! Please check your email inbox (and spam) to verify your address before signing in.');
          setShowResendConfirmation(true);
          setMode('login');
        } else {
          onSuccess();
        }
      } else if (mode === 'forgot') {
        await authService.resetPassword(email);
        setSuccessMsg(`Password reset instructions sent to ${email.trim().toLowerCase()}. Check your inbox (and spam folder).`);
      } else if (mode === 'recovery') {
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        await authService.updatePassword(password);
        setSuccessMsg('Password updated! You are signed in.');
        onSuccess();
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed.';
      setError(msg);
      if (err?.code === 'EMAIL_NOT_CONFIRMED' || msg.toLowerCase().includes('not confirmed')) {
        setShowResendConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#12172A] to-[#171D35] p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#7C3AED] text-white font-black text-sm flex items-center justify-center mx-auto">
            NM
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {mode === 'login' && 'Sign In to Cloud Sync'}
            {mode === 'signup' && 'Create Free Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'recovery' && 'Choose New Password'}
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Sync daily goals, streaks, timetable blocks, mistakes &amp; mock attempts across phone and laptop.
          </p>
          {!isCloudConnected && (
            <div className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Offline Local Mode
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 space-y-2">
            <div>{error}</div>
            {showResendConfirmation && email.includes('@') && (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendConfirmation}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-500/25 hover:bg-rose-500/35 text-white font-bold text-[11px] transition-colors disabled:opacity-50"
              >
                {resendLoading ? 'Sending Verification Link...' : 'Resend Verification Email'}
              </button>
            )}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
            <div>{successMsg}</div>
            {showResendConfirmation && email.includes('@') && (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendConfirmation}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 text-white font-bold text-[11px] transition-colors disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <button
            type="button"
            disabled={loading}
            onClick={() => signInWithGoogle('#/dashboard').catch((e: any) => setError(e?.message || 'Google login failed'))}
            className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs"
          >
            Continue with Google
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#0E1322] border border-white/10 text-white" />
            </div>
          )}
          {mode !== 'recovery' && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#0E1322] border border-white/10 text-white" />
            </div>
          )}
          {mode === 'signup' && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Target Exam</label>
              <select value={targetExam} onChange={(e) => setTargetExam(e.target.value as TargetExam)} className="w-full px-4 py-2.5 rounded-xl bg-[#0E1322] border border-white/10 text-white">
                <option value="JEE 2027">JEE 2027</option>
                <option value="JEE Mains">JEE Mains</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="Both">Both</option>
              </select>
            </div>
          )}
          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-bold text-slate-300">{mode === 'recovery' ? 'New Password' : 'Password'}</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setShowResendConfirmation(false); }} className="text-indigo-400 font-bold hover:underline">Forgot Password?</button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={mode === 'login' ? 1 : 8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter password' : 'Min 8 chars (letter + num)'}
                  className="w-full px-4 py-2.5 pr-14 rounded-xl bg-[#0E1322] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}
          {(mode === 'signup' || mode === 'recovery') && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-2.5 pr-14 rounded-xl bg-[#0E1322] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white font-black">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : mode === 'signup' ? 'Create Free Account →' : mode === 'forgot' ? 'Send Reset Link →' : 'Update Password →'}
          </button>
        </form>

        <div className="text-center text-xs text-[#94A3B8]">
          {mode === 'login' ? (
            <button type="button" onClick={() => setMode('signup')} className="text-indigo-400 font-bold hover:underline">Create a free account</button>
          ) : (
            <button type="button" onClick={() => setMode('login')} className="text-indigo-400 font-bold hover:underline">Back to Sign In</button>
          )}
        </div>

        <button
          type="button"
          onClick={async () => {
            await continueAsGuest();
            onContinueGuest();
          }}
          className="w-full py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200"
        >
          Continue as Guest →
        </button>
      </div>
    </div>
  );
};
