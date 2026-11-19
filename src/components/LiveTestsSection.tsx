import React from 'react';
import { liveTestsList } from '../data/siteData';

interface LiveTestsSectionProps {
  onSelectTest?: (testId: string) => void;
}

export const LiveTestsSection: React.FC<LiveTestsSectionProps> = ({ onSelectTest }) => {
  return (
    <section id="tests" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-zinc-900/40 border-y border-slate-200/80 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            ⚡ 100% Free · No Registration or Paywall
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Official JEE Advanced Live Test Series
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400">
            Attempt authentic full-syllabus mock papers with official CBT interface, real countdown timer, and JEE Advanced partial marking. Completely free for everyone.
          </p>
        </div>

        {/* 2 Live Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {liveTestsList.map((test) => (
            <div
              key={test.id}
              className="relative rounded-3xl bg-white dark:bg-[#121318] border-2 border-indigo-600/40 hover:border-indigo-600 p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-sm">
                  {test.tag}
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                  {test.exam}
                </span>
              </div>

              {/* Header */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
                  {test.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {test.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 dark:border-zinc-800 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60">
                    <p className="text-xs text-slate-400">Questions</p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{test.totalQuestions}</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60">
                    <p className="text-xs text-slate-400">Total Marks</p>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{test.maxMarks}</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60">
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{test.durationMinutes}m</p>
                  </div>
                </div>

                {/* Subjects list */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {test.subjects.map((sub, sIdx) => (
                      <span key={sIdx} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => onSelectTest ? onSelectTest(test.id) : (window.location.hash = `#${test.id}`)}
                  className="w-full py-4 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Attempt {test.code} Free</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
