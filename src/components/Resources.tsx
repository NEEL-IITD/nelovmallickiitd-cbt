import React, { useState } from 'react';
import { ExamType } from '../types';
import { allStudyResources, StudyResource, SubjectType } from '../data/resourcesIndex';
import { Tilt3DCard } from './ui/Tilt3DCard';

interface ResourcesProps {
  exam: ExamType;
  onOpenAuth: (title?: string) => void;
  onOpenResource?: (resource: StudyResource) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ exam, onOpenAuth, onOpenResource }) => {
  const [activeSubject, setActiveSubject] = useState<'All' | SubjectType>('All');

  const filteredResources = allStudyResources.filter(item => {
    if (activeSubject !== 'All' && item.subject !== activeSubject) return false;
    if (exam === 'JEE Mains' && item.examTarget === 'JEE Advanced') return false;
    if (exam === 'JEE Advanced' && item.examTarget === 'JEE Mains') return false;
    return true;
  });

  const getSubjectColorClasses = (subject: SubjectType) => {
    switch (subject) {
      case 'Physics':
        return {
          tab: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
          watermark: 'text-blue-600',
          dot: 'bg-blue-500',
          pill: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
      case 'Chemistry':
        return {
          tab: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          watermark: 'text-emerald-600',
          dot: 'bg-emerald-500',
          pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'Mathematics':
        return {
          tab: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
          watermark: 'text-purple-600',
          dot: 'bg-purple-500',
          pill: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
    }
  };

  const getSubjectIcon = (subject: SubjectType) => {
    switch (subject) {
      case 'Physics':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Chemistry':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Mathematics':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <section id="resources" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-[#0c0d12] border-y border-slate-200/80 dark:border-zinc-800/80 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            100% Free Resources · Curated by Nelov Mallick (IIT Delhi)
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Study <span className="text-indigo-600 dark:text-indigo-400">Resources</span> & Formula Vault
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400">
            High-yield formula sheets, key reaction mechanisms, and NCERT trend summaries. 100% free forever — sign in and they are yours, zero paywalls.
          </p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setActiveSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeSubject === sub
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 shadow-md scale-105'
                  : 'bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              {sub === 'All' ? '⚡ All Resources' : sub === 'Physics' ? '⚛️ Physics' : sub === 'Chemistry' ? '🧪 Chemistry' : '📐 Mathematics'}
            </button>
          ))}
          <a
            href="#/resources"
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 transition-colors"
          >
            Explore Full Hub
            <span>→</span>
          </a>
        </div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredResources.slice(0, 6).map((item) => {
            const colors = getSubjectColorClasses(item.subject);

            return (
              <Tilt3DCard
                key={item.id}
                maxTilt={6}
                perspective={1000}
                className="group relative rounded-2xl border border-slate-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#111217] shadow-[0_1px_3px_rgba(15,17,23,0.05)] hover:border-indigo-500/40 hover:shadow-[0_16px_36px_-16px_rgba(79,70,229,0.22)] transition-[box-shadow,border-color] duration-500 overflow-hidden flex flex-col justify-between p-6 sm:p-7 min-h-[310px]"
              >
                {/* Subtle blueprint grid watermark overlay */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-700 group-hover:opacity-75 dark:group-hover:opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse 95% 85% at 100% 0%, transparent 2%, rgba(255,255,255,0.05) 66%), linear-gradient(rgba(100,116,139,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.1) 1px, transparent 1px)',
                    backgroundSize: '100% 100%, 20px 20px, 20px 20px'
                  }}
                />

                {/* Hanging Top-Left Bookmark Tab */}
                <div
                  className={`absolute top-0 left-6 w-9 h-11 ${colors.tab} rounded-b-xl flex items-end justify-center pb-2 shadow-sm border-b border-x border-black/5 dark:border-white/5 transition-transform duration-300 group-hover:translate-y-0.5`}
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {getSubjectIcon(item.subject)}
                </div>

                {/* Top-Right Indicator Pulse Dot */}
                <div
                  className="absolute top-5 right-6 flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 dark:border-zinc-700"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`} />
                </div>

                {/* Card Main Content */}
                <div className="pt-6 relative z-10 space-y-3" style={{ transform: 'translateZ(18px)' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${colors.pill}`}>
                      {item.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      {item.resourceType}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium ml-auto">
                      ⏱️ {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {item.subtitle}
                  </p>

                  {/* Topic Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.topicsCovered.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div
                  className="pt-5 mt-5 border-t border-slate-100 dark:border-zinc-800/80 relative z-10 flex items-center justify-between"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenResource) {
                        onOpenResource(item);
                      } else {
                        onOpenAuth(`Access ${item.title}`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Read Free Sheet</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <a
                    href="#/resources"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  >
                    All Details
                  </a>
                </div>

                {/* Bottom-Right Rotated Watermark Icon */}
                <div
                  className={`pointer-events-none absolute -bottom-8 -right-8 w-28 h-28 opacity-[0.06] group-hover:opacity-[0.14] group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500 ${colors.watermark}`}
                  style={{ transform: 'translateZ(5px)' }}
                >
                  {getSubjectIcon(item.subject)}
                </div>
              </Tilt3DCard>
            );
          })}
        </div>

        {/* View All CTA Banner */}
        <div className="mt-14 text-center">
          <a
            href="#/resources"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
          >
            <span>📚 Browse Complete Formula Vault & Revision Sheets (9 Modules)</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
};
