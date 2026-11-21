import React from 'react';
import { ExamType } from '../types';
import { MockTestPreview } from './MockTestPreview';

interface HeroProps {
  exam: ExamType;
  onOpenAuth?: (title?: string) => void;
  onOpenQuestionPaper?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  exam,
  onOpenQuestionPaper,
}) => {
  return (
    <section id="home" className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
      {/* Background Subtle Radial Gradient and Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                {exam === 'jee'
                  ? 'JEE Main 2027 · Built by IITians & NITians'
                  : 'NEET UG 2027 · Built by IITians & Top Doctors'}
              </span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.1]">
              Dream Big. <br />
              Prepare Boldly. <br />
              Raise Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Rank.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {exam === 'jee'
                ? "The exact NTA CBT exam interface, pinpoint AI mistake analytics, chapter-level diagnostic mastery, and mentorship from Nelov Mallick (IIT Delhi alumnus)."
                : 'Experience the real NEET UG timing and interface, deep subject diagnostics in Biology, Physics & Chemistry, with personalized mentorship from top medical rankers.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#tests"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>Attempt Live Tests Free</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href="#mentorship"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-600 text-slate-700 dark:text-zinc-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-center"
              >
                Mentorship by Nelov Mallick
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800/80 grid grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Real exam interface
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Chapter-level analysis
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  PYQs & solutions
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Mock Test Preview Component */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <MockTestPreview
              exam={exam}
              onOpenQuestionPaper={onOpenQuestionPaper}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
