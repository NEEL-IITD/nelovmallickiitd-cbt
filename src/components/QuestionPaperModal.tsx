import React from 'react';
import { ExamType } from '../types';

interface QuestionPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamType;
}

export const QuestionPaperModal: React.FC<QuestionPaperModalProps> = ({
  isOpen,
  onClose,
  exam,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          ✕
        </button>

        <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
              {exam === 'jee' ? 'JEE Main 2027 Full Test 04' : 'NEET UG 2027 Full Test 04'} — Complete Paper
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Total Duration: 180 Mins · Total Marks: 300 · Negative Marking: -1
          </p>
        </div>

        {/* Sections Preview */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 space-y-2">
            <div className="flex justify-between font-bold text-slate-900 dark:text-zinc-100">
              <span>Section A: Physics (Q1 - Q25)</span>
              <span className="text-indigo-600">100 Marks</span>
            </div>
            <p className="text-xs text-slate-500">
              Topics covered: Rotational Mechanics, Wave Optics, Current Electricity, Thermodynamics & Kinetic Theory.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 space-y-2">
            <div className="flex justify-between font-bold text-slate-900 dark:text-zinc-100">
              <span>Section B: Chemistry (Q26 - Q50)</span>
              <span className="text-indigo-600">100 Marks</span>
            </div>
            <p className="text-xs text-slate-500">
              Topics covered: Coordination Compounds, Chemical Kinetics, Organic Reaction Mechanisms & Electrochemistry.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 space-y-2">
            <div className="flex justify-between font-bold text-slate-900 dark:text-zinc-100">
              <span>Section C: {exam === 'jee' ? 'Mathematics (Q51 - Q75)' : 'Biology (Q51 - Q100)'}</span>
              <span className="text-indigo-600">{exam === 'jee' ? '100 Marks' : '360 Marks'}</span>
            </div>
            <p className="text-xs text-slate-500">
              {exam === 'jee'
                ? 'Topics covered: Calculus, Definite Integrals, Conic Sections, Probability & Complex Numbers.'
                : 'Topics covered: Plant Physiology, Genetics, Human Reproduction, Biotechnology & Ecology.'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md"
        >
          Return to Test Simulation
        </button>

      </div>
    </div>
  );
};
