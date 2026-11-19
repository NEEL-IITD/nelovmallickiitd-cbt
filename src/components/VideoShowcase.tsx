import React, { useState } from 'react';
import { ExamType } from '../types';

interface VideoShowcaseProps {
  exam: ExamType;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ exam }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Platform Walkthrough
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            See the platform before you pay
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            A walkthrough of the real {exam.toUpperCase()} interface, interactive test controls, and the instant AI report generated after every attempt.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-black/90 aspect-video shadow-2xl overflow-hidden group">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Platform Walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-slate-950 via-indigo-950/50 to-slate-900 text-center">
              {/* Overlay Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center pl-1 shadow-2xl shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all z-10"
                aria-label="Play Walkthrough Video"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <div className="z-10 mt-6 space-y-1">
                <p className="text-white font-bold text-lg">
                  Watch Full Platform Tour (3 Mins)
                </p>
                <p className="text-slate-400 text-xs">
                  CBT UI · AI Mistake Diagnosis · Chapter Analytics
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 100% Free Platform Pledge */}
        <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl flex-shrink-0 shadow-lg shadow-emerald-500/20">
            🛡️
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center justify-center sm:justify-start gap-2">
              100% Free Open Platform · Zero Paywalls or Subscriptions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Every mock paper, computer-based test interface, and AI diagnostic report on NelovMallickIITD is completely free. Dedicated to empowering every JEE aspirant across the nation.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
