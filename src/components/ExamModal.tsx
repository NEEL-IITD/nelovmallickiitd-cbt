import React from 'react';
import { ExamType } from '../types';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExam: ExamType;
  onSelectExam: (exam: ExamType) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  currentExam,
  onSelectExam,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          ✕
        </button>

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🎯
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-50">
            Which exam are you preparing for?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Customize your mock test syllabus, mentors, and practice platform.
          </p>
        </div>

        {/* 2 Exam Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              onSelectExam('jee');
              onClose();
            }}
            className={`p-5 rounded-2xl border text-center transition-all ${
              currentExam === 'jee'
                ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500'
                : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <span className="block text-2xl mb-1">📐</span>
            <span className="block font-bold text-base text-slate-900 dark:text-zinc-100">JEE 2027</span>
            <span className="block text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Main + Advanced</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectExam('neet');
              onClose();
            }}
            className={`p-5 rounded-2xl border text-center transition-all ${
              currentExam === 'neet'
                ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500'
                : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <span className="block text-2xl mb-1">🩺</span>
            <span className="block font-bold text-base text-slate-900 dark:text-zinc-100">NEET UG 2027</span>
            <span className="block text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Medical + AIIMS</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
        >
          Confirm Selection
        </button>

      </div>
    </div>
  );
};
