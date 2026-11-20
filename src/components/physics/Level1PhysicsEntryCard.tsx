// ==============================================================================
// NelovMallickIITD · Level 1: Main Physics Resources 3D Entry Box
// Standalone 3D feature box:
// - Title: PHYSICS Resources Chapterwise (JEE MAINS + ADVANCED)
// - Distinct physics-themed symbol
// - Subtitle: 28 Chapters • Theory & Chapterwise Tests
// ==============================================================================

import React from 'react';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { Atom, Sparkles, BookOpen, Layers, ArrowRight } from 'lucide-react';

interface Level1PhysicsEntryCardProps {
  onOpenPhysics: () => void;
  className?: string;
}

export const Level1PhysicsEntryCard: React.FC<Level1PhysicsEntryCardProps> = ({
  onOpenPhysics,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Tilt3DCard
        maxTilt={4}
        scale={1.01}
        perspective={1400}
        className="group cursor-pointer w-full"
        onClick={onOpenPhysics}
      >
        <div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/40 dark:from-[#11121a] dark:via-[#141524] dark:to-[#0f101a]
            border-2 border-indigo-200/80 dark:border-indigo-900/60
            border-b-[6px] border-b-indigo-400 dark:border-b-indigo-600
            hover:border-indigo-400 dark:hover:border-indigo-500
            shadow-[0_20px_50px_-15px_rgba(99,102,241,0.18),0_10px_20px_-10px_rgba(0,0,0,0.06)]
            hover:shadow-[0_30px_70px_-15px_rgba(99,102,241,0.3),0_15px_30px_-5px_rgba(0,0,0,0.1)]
            transition-all duration-300 ease-out p-6 sm:p-9 lg:p-11"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Top Ambient Glow Orb */}
          <div className="absolute top-0 right-1/4 w-96 h-60 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-44 bg-violet-500/10 dark:bg-violet-500/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Side: Prominent 3D Icon & Text */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 lg:gap-8 flex-1" style={{ transform: 'translateZ(25px)' }}>
              
              {/* Elevated 3D Icon Pedestal */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:lg:h-28 rounded-3xl shrink-0 flex items-center justify-center
                  bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white
                  border-2 border-white/40 dark:border-white/10
                  border-b-[5px] border-b-indigo-800 dark:border-b-indigo-950
                  shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_15px_30px_-8px_rgba(99,102,241,0.5)]
                  group-hover:scale-105 group-hover:rotate-3 transition-all duration-300"
              >
                <Atom className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 animate-[spin_12s_linear_infinite]" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2.5 max-w-2xl">
                
                {/* Pill Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    New 3D Module · 100% Free
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    JEE Mains + Advanced
                  </span>
                </div>

                {/* Main Mandatory Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  PHYSICS Resources Chapterwise <span className="text-indigo-600 dark:text-indigo-400">(JEE MAINS + ADVANCED)</span>
                </h3>

                {/* Subtle Mandatory Subtitle */}
                <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-zinc-300 leading-relaxed">
                  28 Chapters • Theory & Chapterwise Tests
                </p>

                {/* Feature Chips */}
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" /> Comprehensive Theory Notes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-violet-500" /> Online CBT Exercises
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Atom className="w-4 h-4 text-emerald-500" /> Curated by Nelov Mallick (IIT Delhi)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Big Tactile 3D Action Button */}
            <div className="shrink-0 w-full sm:w-auto" style={{ transform: 'translateZ(30px)' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPhysics();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-4.5 rounded-2xl font-black text-sm sm:text-base text-white
                  bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600
                  border-2 border-indigo-400/40
                  border-b-[4px] border-b-indigo-900
                  shadow-[0_12px_24px_-4px_rgba(99,102,241,0.5)]
                  hover:scale-105 active:scale-95 active:border-b-2
                  transition-all duration-200"
              >
                <span>Enter Physics Vault (C1–C28)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
            </div>

          </div>
        </div>
      </Tilt3DCard>
    </div>
  );
};
