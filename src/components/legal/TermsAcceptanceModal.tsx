// ==============================================================================
// NelovMallickIITD CBT Platform - First-Time Terms Acceptance Modal (Clickwrap)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState } from 'react';
import { LEGAL_CONFIG } from '../../config/legal';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  userName?: string;
  onAccept: () => Promise<void>;
}

export const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({
  isOpen,
  userName = 'Student Aspirant',
  onAccept
}) => {
  const [agreed, setAgreed] = useState<boolean>(false);
  const [parentalConfirmed, setParentalConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!agreed) {
      setError('You must check the agreement box to proceed.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAccept();
    } catch (err: any) {
      setError(err?.message || 'Failed to record consent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl shadow-sm">
            📜
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Terms & Privacy Consent Required
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Welcome, <strong>{userName}</strong>! Under India's DPDP Act, 2023, please review and accept our platform policies to access free CBT mock exams and study vaults.
          </p>
        </div>

        {/* Highlights */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs space-y-2 text-slate-700 dark:text-zinc-300">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>100% Free Access:</strong> Zero fees, zero subscriptions, zero paid tiers forever.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Strict Non-Monetization:</strong> Your contact number and email are never sold or rented.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>3-Attempt Fair Use Cap:</strong> Mock tests have a diagnostic 3-attempt limit per student.</span>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-1 text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="leading-relaxed">
              I agree to the{' '}
              <a
                href="#/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-bold underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-bold underline"
              >
                Privacy Policy
              </a>
              , and confirm I have parent/guardian consent if I am under 18. <span className="text-rose-500">*</span>
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-slate-500 dark:text-zinc-400 text-[11px]">
            <input
              type="checkbox"
              checked={parentalConfirmed}
              onChange={(e) => setParentalConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="leading-relaxed">
              I am under 18 and registering with my parent or lawful guardian's permission.
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!agreed || loading}
          type="button"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Recording Consent...' : 'Accept & Enter Portal →'}
        </button>

        <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500">
          Mentored by {LEGAL_CONFIG.OWNER_NAME} (IIT Delhi) · Policy Version {LEGAL_CONFIG.POLICY_VERSION}
        </p>
      </div>
    </div>
  );
};
