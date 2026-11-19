import React from 'react';
import { ExamType } from '../types';
import { resourcesData } from '../data/siteData';

interface ResourcesProps {
  exam: ExamType;
  onOpenAuth: (title?: string) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ exam, onOpenAuth }) => {
  const resources = resourcesData(exam);

  return (
    <section id="resources" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-zinc-900/30 border-y border-slate-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            100% Free Materials
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Study Resources
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400">
            Notes, formula sheets, PYQs, and mocks. Free with any NelovMallickIITD account — simply sign in and they're yours, no purchase required.
          </p>
        </div>

        {/* 6 Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {resources.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Pastel Gradient Corner Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl bg-gradient-to-br ${item.color} pointer-events-none group-hover:scale-125 transition-transform`} />

              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-inner border border-slate-200/60 dark:border-zinc-700/60">
                  📚
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed pt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                <button
                  type="button"
                  onClick={() => onOpenAuth(`Access ${item.title}`)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-indigo-600 dark:hover:border-indigo-500 bg-slate-50 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{item.actionText}</span>
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
