import React from 'react';
import { studentResults } from '../data/siteData';

export const Testimonials: React.FC = () => {
  return (
    <section id="results" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Proven Exam Performance
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Top Ranker Insights
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400">
            Aspirants who mastered time allocation, partial marking strategy, and CBT error analysis using Nelov Mallick's test series.
          </p>
        </div>

        {/* 3-Column Rank Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {studentResults.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-md">
                    {item.rank}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.exam}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed italic pt-2">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Verified CBT Student
                </span>
                <span>
                  NelovMallickIITD Platform
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
