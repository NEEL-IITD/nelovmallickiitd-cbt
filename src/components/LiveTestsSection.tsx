import React, { useState } from 'react';
import { jeeMainsTests, jeeAdvancedTests } from '../data/testsIndex';

interface LiveTestsSectionProps {
  onSelectTest?: (testId: string) => void;
}

export const LiveTestsSection: React.FC<LiveTestsSectionProps> = ({ onSelectTest }) => {
  const [activeCategory, setActiveCategory] = useState<'jee-advanced' | 'jee-mains'>('jee-advanced');

  const testsList = activeCategory === 'jee-advanced' ? jeeAdvancedTests : jeeMainsTests;

  return (
    <section id="tests" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-zinc-900/40 border-y border-slate-200/80 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            ⚡ 100% Free · No Registration or Paywall
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Complete Test Library (PTA 01 – PTA 10)
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400">
            Structured into dedicated categories for <strong>JEE Mains</strong> and <strong>JEE Advanced</strong>. All papers are 100% free with official CBT interface.
          </p>
        </div>

        {/* 2 Category Folder Cards / Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('jee-advanced')}
            className={`w-full sm:w-1/2 p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
              activeCategory === 'jee-advanced'
                ? 'border-indigo-600 bg-white dark:bg-zinc-900 shadow-lg ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-zinc-800 bg-slate-100/60 dark:bg-zinc-800/60 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📁</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-zinc-100">
                  JEE Advanced
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
                PTA 01 to PTA 10 (180 Mks)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
              2 Live
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('jee-mains')}
            className={`w-full sm:w-1/2 p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
              activeCategory === 'jee-mains'
                ? 'border-indigo-600 bg-white dark:bg-zinc-900 shadow-lg ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-zinc-800 bg-slate-100/60 dark:bg-zinc-800/60 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📁</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-zinc-100">
                  JEE Mains
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
                PTA 01 to PTA 10 (300 Mks)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400">
              10 Slots
            </span>
          </button>
        </div>

        {/* 10 Test Cards Grid (PTA 01 to PTA 10) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testsList.map((test) => {
            const isLive = test.status === 'live';

            return (
              <div
                key={test.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isLive
                    ? 'bg-white dark:bg-[#121318] border-2 border-indigo-600 shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-4 ring-indigo-500/10'
                    : 'bg-white/60 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm opacity-90'
                }`}
              >
                <div className="space-y-4">
                  {/* Badge Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                      {test.code}
                    </span>

                    {isLive ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live Now · Free
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 pt-1.5 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1.5 py-3 border-y border-slate-100 dark:border-zinc-800 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/60">
                      <p className="text-[10px] text-slate-400">Questions</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{test.totalQuestions}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/60">
                      <p className="text-[10px] text-slate-400">Total Marks</p>
                      <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{test.totalMarks}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/60">
                      <p className="text-[10px] text-slate-400">Duration</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{test.durationMinutes}m</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  {isLive ? (
                    <button
                      type="button"
                      onClick={() => onSelectTest ? onSelectTest(test.id) : (window.location.hash = `#/test/${test.id}`)}
                      className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <span>Attempt Test Free</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500 cursor-not-allowed"
                    >
                      Coming Soon · Upload Slot
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
