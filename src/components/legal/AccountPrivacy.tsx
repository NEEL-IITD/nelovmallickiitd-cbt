// ==============================================================================
// NelovMallickIITD CBT Platform - Self-Service Account & Privacy Center (/account)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LEGAL_CONFIG } from '../../config/legal';

interface AccountPrivacyProps {
  onBackToHome?: () => void;
}

export const AccountPrivacy: React.FC<AccountPrivacyProps> = ({ onBackToHome }) => {
  const { user, deleteMyAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [confirmText, setConfirmText] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>('');
  const [exporting, setExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            Please log in to manage your Account & Privacy settings.
          </p>
          <a
            href="#/login"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  // Sanitize email: never expose synthetic internal phone emails
  const isSyntheticEmail = user.email && (user.email.endsWith('@phone.nelovportal.local') || user.email.includes('.local') || user.email.includes('.internal'));
  const cleanDisplayEmail = isSyntheticEmail ? null : user.email;

  const handleDownloadMyData = async () => {
    setExporting(true);
    try {
      // Gather all local data for this user
      const uId = user.id;
      let attempts: any[] = [];
      let bookmarks: any[] = [];
      let lectures: any = {};

      try {
        const attemptsRaw = localStorage.getItem(`nelov_${uId}_attempts`) || localStorage.getItem('nelov_test_attempts');
        if (attemptsRaw) attempts = JSON.parse(attemptsRaw);
      } catch (e) {}

      try {
        const bmRaw = localStorage.getItem(`nelov_${uId}_bookmarks`) || localStorage.getItem('nelov_bookmarks');
        if (bmRaw) bookmarks = JSON.parse(bmRaw);
      } catch (e) {}

      try {
        const lecRaw = localStorage.getItem(`nelov_${uId}_lecture_progress`);
        if (lecRaw) lectures = JSON.parse(lecRaw);
      } catch (e) {}

      const exportPayload = {
        platform: LEGAL_CONFIG.PORTAL_NAME,
        mentor: `${LEGAL_CONFIG.OWNER_NAME} (IIT Delhi)`,
        exportTimestamp: new Date().toISOString(),
        userProfile: {
          id: user.id,
          fullName: user.name,
          email: cleanDisplayEmail,
          contactNumber: user.contactNumber || null,
          loginMethod: user.authMethod || (cleanDisplayEmail ? 'email' : 'phone'),
          targetExam: user.targetExam,
          role: user.role,
          accountCreated: user.createdAt,
          acceptedTermsAt: user.acceptedTermsAt || 'Not Recorded',
          acceptedTermsVersion: user.acceptedTermsVersion || LEGAL_CONFIG.POLICY_VERSION,
          parentalConsentConfirmed: Boolean(user.parentalConsentConfirmed)
        },
        attemptHistory: attempts,
        revisionBookmarks: bookmarks,
        lectureProgress: lectures
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `nelov_mallick_jee_student_data_${user.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setToastMessage('Personal data exported successfully!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: any) {
      alert('Failed to export data: ' + (err?.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmText.trim() !== 'DELETE') {
      setDeleteError('Please type DELETE in capital letters to confirm.');
      return;
    }

    if (user.role === 'admin') {
      setDeleteError('Admin accounts cannot be self-deleted.');
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      await deleteMyAccount();
      alert('Your account and all associated test records, bookmarks, and personal data have been permanently erased.');
      window.location.hash = '#/';
      window.location.reload();
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-800 dark:text-zinc-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
          <nav className="flex items-center gap-2">
            <a href="#/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </a>
            <span>›</span>
            <span className="text-slate-800 dark:text-zinc-200">Account & Privacy</span>
          </nav>

          <button
            onClick={() => {
              if (onBackToHome) onBackToHome();
              else window.location.hash = '#/';
            }}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            ← Back to Portal
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'NM'}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50">
                  {user.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Student Aspirant Account · Mentored by <strong>{LEGAL_CONFIG.OWNER_NAME} (IIT Delhi)</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                100% Free Forever
              </span>
              {user.role === 'admin' && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between">
            <span>✓ {toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-xs">✕</button>
          </div>
        )}

        {/* Section 1: Profile Summary & Consent Audit */}
        <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-zinc-50 flex items-center gap-2">
              <span>👤</span> Profile & Compliance Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Personal credentials and legal consent timestamps stored in compliance with India's DPDP Act, 2023.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</span>
              <p className="font-extrabold text-slate-900 dark:text-zinc-100 text-sm">{user.name}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Email / Gmail</span>
              <p className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                {cleanDisplayEmail || '— (Registered via Mobile Number)'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Contact Number</span>
              <p className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                {user.contactNumber ? `📞 ${user.contactNumber}` : '—'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Method</span>
              <p className="font-semibold text-slate-900 dark:text-zinc-100 text-sm capitalize">
                {user.authMethod === 'google' ? 'Google OAuth 2.0' : (user.authMethod === 'phone' ? 'Mobile Number + PIN' : (user.authMethod || 'Gmail / Email'))}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Examination</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                {user.targetExam || 'JEE Advanced'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Terms & DPDP Consent Status</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                {user.acceptedTermsAt ? (
                  <>✓ Accepted on {new Date(user.acceptedTermsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (v{user.acceptedTermsVersion || LEGAL_CONFIG.POLICY_VERSION})</>
                ) : (
                  <>✓ Consent Active (Policy v{LEGAL_CONFIG.POLICY_VERSION})</>
                )}
                {user.parentalConsentConfirmed && (
                  <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    • Under-18 Parental Permission Confirmed
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Data Portability & Rights */}
        <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <span>📥</span> Download My Data (Right to Portability)
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Download a complete, machine-readable JSON archive of your personal profile, test scores, attempt histories, Revision Notebook bookmarks, and video progress.
              </p>
            </div>

            <button
              onClick={handleDownloadMyData}
              disabled={exporting}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <span>{exporting ? 'Exporting...' : '📥 Download Data (.JSON)'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Danger Zone — Permanent Account Deletion */}
        <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <span>⚠️</span> Danger Zone — Permanent Account Deletion
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              In accordance with Section 12 of India’s Digital Personal Data Protection (DPDP) Act, you have the right to permanently erase your account and all associated test records.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-extrabold text-slate-900 dark:text-zinc-100">
                Permanently Delete My Student Account
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                This action is irreversible. All your PTM/PTA attempts, accuracy scores, mistake bookmarks, and lecture progress will be purged.
              </p>
            </div>

            {user.role === 'admin' ? (
              <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 text-xs font-bold shrink-0">
                Admin Account (Deletion Disabled)
              </span>
            ) : (
              <button
                onClick={() => {
                  setConfirmText('');
                  setDeleteError('');
                  setShowDeleteModal(true);
                }}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all shrink-0"
              >
                Delete My Account
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Account Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121318] rounded-3xl border border-rose-200 dark:border-rose-900 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
                🗑️
              </div>
              <h3 className="text-xl font-black text-rose-700 dark:text-rose-400">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                This action <strong>CANNOT BE UNDONE</strong>. Deleting your account will immediately and permanently erase:
              </p>
            </div>

            <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-zinc-300 space-y-1">
              <li>All PTM & PTA exam attempts, scores, and percentile histories</li>
              <li>Your personal Revision Notebook and question bookmarks</li>
              <li>Your video lecture completion progress</li>
              <li>Your registered contact number and authentication credentials</li>
            </ul>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                To confirm, please type <span className="font-mono text-rose-600 dark:text-rose-400 font-extrabold">DELETE</span> below:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                type="button"
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={confirmText.trim() !== 'DELETE' || deleting}
                type="button"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
              >
                {deleting ? 'Erasing Account...' : 'Yes, Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
