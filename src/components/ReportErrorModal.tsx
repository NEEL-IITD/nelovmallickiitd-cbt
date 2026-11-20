// ==============================================================================
// NelovMallickIITD CBT Platform - Student "Report an Error" Modal
// Allows students to report typos, broken equations, or disputed answer keys
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentStorage } from '../utils/studentStorage';
import { ErrorIssueType } from '../types';

export interface ReportErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionInfo: {
    testId: string;
    examType: string;
    testCode: string;
    questionId: string | number;
    questionNumber: number;
  } | null;
  onSuccess?: () => void;
}

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
  isOpen,
  onClose,
  questionInfo,
  onSuccess
}) => {
  const { user } = useAuth();
  const [issueType, setIssueType] = useState<ErrorIssueType>('wrong_answer_key');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !questionInfo) return null;

  const categories: { type: ErrorIssueType; label: string; icon: string }[] = [
    { type: 'wrong_answer_key', label: 'Disputed Answer Key', icon: '⚖️' },
    { type: 'broken_equation', label: 'Broken Formula / Diagram', icon: '📐' },
    { type: 'typo', label: 'Typo / Wording Issue', icon: '✍️' },
    { type: 'missing_diagram', label: 'Unclear Explanation', icon: '💡' },
    { type: 'other', label: 'Other Feedback', icon: '💬' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a brief description of the issue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await studentStorage.submitErrorReport({
        userId: user?.id,
        reporterName: user?.name || 'Aspirant Student',
        reporterEmail: user?.email || '',
        reporterContactNumber: user?.contactNumber || undefined,
        testId: questionInfo.testId,
        examType: questionInfo.examType,
        testCode: questionInfo.testCode,
        questionId: String(questionInfo.questionId),
        questionNumber: questionInfo.questionNumber,
        issueType,
        description: description.trim()
      });

      // Mark as reported in session storage to prevent duplicates
      sessionStorage.setItem(`nelov_reported_${questionInfo.testId}_${questionInfo.questionId}`, 'true');

      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        onClose();
      }, 1600);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-sm">
              🚩
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-zinc-50">
                Report an Issue
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Help improve questions and answer keys for all JEE aspirants
              </p>
            </div>
          </div>

          {/* Question Context Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              {questionInfo.examType}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-xs">
              {questionInfo.testCode}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold text-xs">
              Question #{questionInfo.questionNumber}
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-zinc-50">
              Report Submitted Successfully!
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
              Thank you! Your feedback has been forwarded to the academic review panel.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Issue Category Radio Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Select Issue Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => setIssueType(c.type)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      issueType === c.type
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="text-[11px] font-semibold">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-300">
                Details & Observations
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why you believe the answer key or formula is incorrect, or provide your step-by-step counter-derivation..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            {/* Reporter details notice */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Submitting as: <strong className="text-slate-800 dark:text-zinc-200">{user?.name || 'Aspirant'}</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Review</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-all"
              >
                {loading ? 'Submitting...' : 'Send Error Report 🚀'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
