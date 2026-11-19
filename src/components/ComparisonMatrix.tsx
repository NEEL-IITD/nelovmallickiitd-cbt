import React from 'react';
import { ExamType, ComparisonRow } from '../types';
import { comparisonRows } from '../data/siteData';

interface ComparisonMatrixProps {
  exam: ExamType;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ exam }) => {
  const rows = comparisonRows(exam);

  return (
    <section id="compare" className="py-20 bg-slate-50/60 dark:bg-zinc-900/30 border-y border-slate-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Clear Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Why NelovMallickIITD beats every other platform
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            See exactly what you get with NelovMallickIITD 2027 that no standard coaching test series or creator pack delivers.
          </p>
        </div>

        {/* Table Container */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#121318] rounded-3xl border border-slate-200/90 dark:border-zinc-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800">
                <th className="py-5 px-6 text-sm font-extrabold text-slate-900 dark:text-zinc-100 w-2/5">
                  Features & Capabilities
                </th>
                <th className="py-5 px-4 text-center text-xs sm:text-sm font-bold text-slate-500 dark:text-zinc-400 w-1/5">
                  Other Creator Tests
                </th>
                <th className="py-5 px-4 text-center text-xs sm:text-sm font-bold text-slate-500 dark:text-zinc-400 w-1/5">
                  Other Coaching Tests
                </th>
                <th className="py-5 px-4 text-center text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 w-1/5 border-l border-indigo-200/60 dark:border-indigo-800/40">
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm">
                    NelovMallickIITD
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs sm:text-sm">
              {rows.map((row: ComparisonRow, idx: number) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/30 dark:bg-zinc-900/10'
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-slate-800 dark:text-zinc-200">
                    {row.feature}
                  </td>

                  {/* Other Creators */}
                  <td className="py-4 px-4 text-center">
                    {row.otherCreators ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 font-bold text-xs">
                        ✕
                      </span>
                    )}
                  </td>

                  {/* Other Coaching */}
                  <td className="py-4 px-4 text-center">
                    {row.otherCoaching ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 font-bold text-xs">
                        ✕
                      </span>
                    )}
                  </td>

                  {/* NelovMallickIITD (Highlighted) */}
                  <td className="py-4 px-4 text-center bg-indigo-50/50 dark:bg-indigo-950/30 border-l border-indigo-200/60 dark:border-indigo-800/40">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-extrabold text-sm shadow-sm shadow-emerald-500/30">
                      ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
