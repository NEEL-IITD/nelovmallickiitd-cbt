import React from 'react';
import { ExamType } from '../types';

interface CTABannerProps {
  exam?: ExamType;
  onOpenAuth?: (title?: string) => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({ onOpenAuth: _onOpenAuth }) => {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 p-8 sm:p-14 text-white shadow-2xl shadow-indigo-900/40 overflow-hidden">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-indigo-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              100% Free · Lead Mentorship by Nelov Mallick (IIT Delhi)
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Master JEE Advanced with Real CBT Simulation.
            </h2>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-xl mx-auto">
              Real-exam mocks, deep mistake diagnostics, authentic CBT interface, and partial marking simulation. 100% Free for every aspirant with zero fees or paywalls.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-left max-w-xl mx-auto text-xs font-medium text-indigo-100">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">✓</span> PTA 04 Full Mock
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">✓</span> PTA 05 Full Mock
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">✓</span> Instant AI Diagnostic
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">✓</span> Real Partial Marking
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">✓</span> Step-by-Step KaTeX Solutions
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">✓</span> Zero Paywalls
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#tests"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Attempt PTA 04 & PTA 05 Free →
              </a>
            </div>

            {/* Free Note */}
            <p className="text-[11px] text-indigo-200/80 pt-4">
              Completely free open access · No credit card or registration needed · Mentorship by Nelov Mallick (IIT Delhi)
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
