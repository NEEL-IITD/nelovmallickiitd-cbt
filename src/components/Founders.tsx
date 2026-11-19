import React from 'react';
import { founderData } from '../data/siteData';

export const Founders: React.FC = () => {
  return (
    <section id="mentorship" className="py-16 sm:py-24 bg-slate-50/50 dark:bg-zinc-900/30 border-y border-slate-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Lead Mentor & Academic Direction
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Mentorship by Nelov Mallick (IIT Delhi)
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Guided by an IIT Delhi alumnus who has coached thousands of aspirants to top ranks through rigorous problem-solving and computer-based test temperament.
          </p>
        </div>

        {/* Solo Founder Profile Card */}
        <div className="max-w-4xl mx-auto">
          <div className="group relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar with IIT tag */}
              <div className="relative flex-shrink-0">
                <img
                  src={founderData.avatar}
                  alt={founderData.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
                />
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                  {founderData.college}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
                    {founderData.name}
                  </h3>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                    {founderData.role}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {founderData.bio}
                </p>

                {/* Highlights */}
                <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
                  {founderData.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                      ✓ {h}
                    </span>
                  ))}
                </div>

                {/* Social Proof Tags */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 text-pink-700 dark:text-pink-300 text-xs font-bold">
                    📸 {founderData.socials.instagram}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs font-bold">
                    ▶ {founderData.socials.youtube}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                    in {founderData.socials.linkedin}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
