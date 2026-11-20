// ==============================================================================
// NelovMallickIITD · Level 1: Study Resources & Formula Vault 3D Showcase
// Top-of-Homepage Hero Feature: 3 Distinct 3D Subject Vaults (Physics, Chemistry, Maths)
// Inspired by TestonGo 3D interactive tactile feature boxes
// Curated by Nelov Mallick (IIT Delhi) · 100% Free Open Educational Resource
// ==============================================================================

import React from 'react';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { Atom, FlaskConical, FunctionSquare, Sparkles, ArrowRight } from 'lucide-react';

interface StudyResourcesVaultShowcaseProps {
  onOpenSubject: (subject: 'physics' | 'chemistry' | 'mathematics') => void;
  className?: string;
}

export const StudyResourcesVaultShowcase: React.FC<StudyResourcesVaultShowcaseProps> = ({
  onOpenSubject,
  className = '',
}) => {
  const subjects = [
    {
      id: 'physics' as const,
      title: 'Physics Resources Chapterwise',
      examTag: 'JEE MAINS + ADVANCED',
      subtitle: '28 Chapters • Theory & Chapterwise Tests',
      badge: '28 Chapters • C1–C28',
      icon: Atom,
      iconAnimation: 'animate-[spin_14s_linear_infinite]',
      color: {
        themeName: 'Electric Blue & Royal Indigo',
        primary: '#2563EB',
        gradientBg: 'from-blue-600 via-indigo-600 to-indigo-700',
        cardBg: 'from-white via-blue-50/40 to-indigo-50/50 dark:from-[#0d1322] dark:via-[#0e1628] dark:to-[#0a0f1d]',
        border: 'border-blue-200/90 dark:border-blue-900/60',
        borderBottom: 'border-b-[6px] border-b-blue-600 dark:border-b-blue-500',
        hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-400',
        pedestalBorderBottom: 'border-b-[5px] border-b-blue-800 dark:border-b-blue-950',
        shadow: 'shadow-[0_20px_50px_-15px_rgba(37,99,235,0.22),0_10px_20px_-10px_rgba(0,0,0,0.06)]',
        hoverShadow: 'hover:shadow-[0_30px_70px_-15px_rgba(37,99,235,0.38),0_15px_30px_-5px_rgba(0,0,0,0.12)]',
        badgeBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        tagText: 'text-blue-600 dark:text-blue-400',
        btnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25',
        glow: 'bg-blue-500/15 dark:bg-blue-500/20'
      },
      bullets: [
        'Complete Mechanics & Electrodynamics',
        'Theory Notes & Formula Sheets',
        'Online CBT Exercise Shells'
      ],
      ctaText: 'Enter Physics Vault (28 Chapters)'
    },
    {
      id: 'chemistry' as const,
      title: 'Chemistry Resources Chapterwise',
      examTag: 'JEE MAINS + ADVANCED',
      subtitle: '29 Chapters • Theory & Chapterwise Tests',
      badge: '29 Chapters • Ch 1–Ch 29',
      icon: FlaskConical,
      iconAnimation: 'group-hover:rotate-12 transition-transform duration-500',
      color: {
        themeName: 'Emerald & Mint Teal',
        primary: '#059669',
        gradientBg: 'from-emerald-600 via-teal-600 to-teal-700',
        cardBg: 'from-white via-emerald-50/40 to-teal-50/50 dark:from-[#0b1c16] dark:via-[#0c1f19] dark:to-[#081511]',
        border: 'border-emerald-200/90 dark:border-emerald-900/60',
        borderBottom: 'border-b-[6px] border-b-emerald-600 dark:border-b-emerald-500',
        hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-400',
        pedestalBorderBottom: 'border-b-[5px] border-b-emerald-800 dark:border-b-emerald-950',
        shadow: 'shadow-[0_20px_50px_-15px_rgba(5,150,105,0.22),0_10px_20px_-10px_rgba(0,0,0,0.06)]',
        hoverShadow: 'hover:shadow-[0_30px_70px_-15px_rgba(5,150,105,0.38),0_15px_30px_-5px_rgba(0,0,0,0.12)]',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        tagText: 'text-emerald-600 dark:text-emerald-400',
        btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25',
        glow: 'bg-emerald-500/15 dark:bg-emerald-500/20'
      },
      bullets: [
        'Organic Mechanisms & Reagents',
        'Physical Equilibria & Electrochemistry',
        'Inorganic Qualitative Salt Analysis'
      ],
      ctaText: 'Enter Chemistry Vault (29 Chapters)'
    },
    {
      id: 'mathematics' as const,
      title: 'Mathematics Resources Chapterwise',
      examTag: 'JEE MAINS + ADVANCED',
      subtitle: '26 Chapters • Theory & Chapterwise Tests',
      badge: '26 Chapters • C01–C28',
      icon: FunctionSquare,
      iconAnimation: 'group-hover:scale-110 transition-transform duration-500',
      color: {
        themeName: 'Vivid Violet & Deep Magenta',
        primary: '#7C3AED',
        gradientBg: 'from-violet-600 via-purple-600 to-fuchsia-600',
        cardBg: 'from-white via-violet-50/40 to-fuchsia-50/40 dark:from-[#150e24] dark:via-[#19102b] dark:to-[#10091d]',
        border: 'border-violet-200/90 dark:border-violet-900/60',
        borderBottom: 'border-b-[6px] border-b-violet-600 dark:border-b-violet-500',
        hoverBorder: 'hover:border-violet-400 dark:hover:border-violet-400',
        pedestalBorderBottom: 'border-b-[5px] border-b-violet-800 dark:border-b-violet-950',
        shadow: 'shadow-[0_20px_50px_-15px_rgba(124,58,237,0.22),0_10px_20px_-10px_rgba(0,0,0,0.06)]',
        hoverShadow: 'hover:shadow-[0_30px_70px_-15px_rgba(124,58,237,0.38),0_15px_30px_-5px_rgba(0,0,0,0.12)]',
        badgeBg: 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
        tagText: 'text-violet-600 dark:text-violet-400',
        btnBg: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-violet-500/25',
        glow: 'bg-violet-500/15 dark:bg-violet-500/20'
      },
      bullets: [
        'Differential & Integral Calculus',
        'Vectors, 3D & Conic Sections',
        'C18 Applications of Derivative (3 Sub-Topics)'
      ],
      ctaText: 'Enter Mathematics Vault (26 Chapters)'
    }
  ];

  return (
    <section className={`relative pt-8 pb-12 sm:pt-10 sm:pb-16 overflow-hidden ${className}`}>
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-blue-500/8 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-emerald-500/8 dark:bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/8 dark:bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-zinc-800 text-white border border-slate-700 dark:border-zinc-700 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">
              Study Resources & Formula Vault · 100% Free Forever
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
            Chapterwise Resources &amp;{' '}
            <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-violet-600 bg-clip-text text-transparent">
              CBT Test Vaults
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Curated by <strong className="font-bold text-slate-900 dark:text-zinc-200">Nelov Mallick (IIT Delhi)</strong>. Master the complete JEE Mains &amp; Advanced syllabus with deep theory notes and timed online test drills across all three subjects.
          </p>
        </div>

        {/* 3 Side-by-Side 3D Boxes (TestOnGo Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-2">
          {subjects.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="w-full flex">
                <Tilt3DCard
                  maxTilt={6}
                  scale={1.02}
                  perspective={1200}
                  className="group cursor-pointer w-full flex flex-col justify-between"
                  onClick={() => onOpenSubject(item.id)}
                >
                  <div
                    className={`relative flex flex-col justify-between h-full overflow-hidden rounded-3xl bg-gradient-to-br ${item.color.cardBg}
                      border-2 ${item.color.border}
                      ${item.color.borderBottom}
                      ${item.color.hoverBorder}
                      ${item.color.shadow}
                      ${item.color.hoverShadow}
                      p-6 sm:p-7 lg:p-8 transition-all duration-300 ease-out`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Top Ambient Glow */}
                    <div className={`absolute -top-12 -right-12 w-48 h-48 ${item.color.glow} blur-[60px] rounded-full pointer-events-none`} />

                    {/* Top Content */}
                    <div className="relative z-10 space-y-6" style={{ transform: 'translateZ(25px)' }}>
                      
                      {/* Prominent Centered 3D Icon Pedestal (TestOnGo Style) */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center
                            bg-gradient-to-tr ${item.color.gradientBg} text-white
                            border-2 border-white/40 dark:border-white/10
                            ${item.color.pedestalBorderBottom}
                            shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_12px_24px_-6px_rgba(0,0,0,0.25)]
                            group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                        >
                          <Icon className={`w-9 h-9 sm:w-10 sm:h-10 ${item.iconAnimation}`} />
                        </div>

                        {/* Chapter Count Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${item.color.badgeBg}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1.5 text-left">
                        <div className="text-[11px] font-black tracking-widest uppercase text-slate-500 dark:text-zinc-400">
                          {item.examTag}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-snug group-hover:translate-x-0.5 transition-transform">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-zinc-800/60 text-left">
                        {item.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-600 group-hover:bg-indigo-500 transition-colors" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-6 relative z-10" style={{ transform: 'translateZ(30px)' }}>
                      <div
                        className={`w-full py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all ${item.color.btnBg} group-hover:scale-[1.02]`}
                      >
                        <span>{item.ctaText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </Tilt3DCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
