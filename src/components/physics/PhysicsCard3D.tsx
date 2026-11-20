// ==============================================================================
// NelovMallickIITD · 3D Tactile Physics Card
// Design inspired by https://www.testongo.com/ 3D feature boxes:
// - Elevated 3D box geometry with tactile 4px bottom border bevel
// - Layered soft shadows with dynamic ambient glow
// - Prominent floating icon pedestal on top with inset highlight
// - Crisp, modern typography & metadata underneath
// ==============================================================================

import React from 'react';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { PhysicsIcon } from './PhysicsIcon';

interface PhysicsCard3DProps {
  iconName: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  metadata?: string;
  category?: string;
  onClick?: () => void;
  accentColor?: string;
  glowColor?: string;
  actionText?: string;
  className?: string;
  isLarge?: boolean;
  highlightBorder?: boolean;
}

export const PhysicsCard3D: React.FC<PhysicsCard3DProps> = ({
  iconName,
  badge,
  badgeColor = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800',
  title,
  subtitle,
  metadata,
  category,
  onClick,
  accentColor = 'text-indigo-600 dark:text-indigo-400',
  glowColor = 'rgba(99, 102, 241, 0.25)',
  actionText = 'Explore Chapter',
  className = '',
  isLarge = false,
  highlightBorder = false,
}) => {
  return (
    <Tilt3DCard
      maxTilt={isLarge ? 4 : 7}
      scale={isLarge ? 1.01 : 1.025}
      perspective={1200}
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div
        className={`relative h-full flex flex-col justify-between rounded-2xl bg-white dark:bg-[#12131a] 
          border border-slate-200/90 dark:border-zinc-800/90
          border-b-4 border-b-slate-300 dark:border-b-zinc-700
          hover:border-b-indigo-500 dark:hover:border-b-indigo-500
          hover:border-slate-300 dark:hover:border-zinc-700
          shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.04)]
          hover:shadow-[0_20px_35px_-10px_rgba(99,102,241,0.2),0_10px_15px_-5px_rgba(0,0,0,0.06)]
          transition-all duration-300 ease-out p-6 sm:p-7
          ${highlightBorder ? 'ring-2 ring-indigo-500/20' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Hover Backlight Glow */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: glowColor }}
        />

        {/* Top Header Row: Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-4 relative z-10" style={{ transform: 'translateZ(15px)' }}>
          {badge ? (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase border shadow-sm ${badgeColor}`}
            >
              {badge}
            </span>
          ) : (
            <span />
          )}

          {category && (
            <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 tracking-wider uppercase">
              {category}
            </span>
          )}
        </div>

        {/* Center 3D Icon Pedestal */}
        <div className="my-auto py-3 text-center relative z-10" style={{ transform: 'translateZ(25px)' }}>
          <div
            className={`mx-auto rounded-2xl flex items-center justify-center transition-all duration-300
              ${isLarge ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-18 sm:h-18'}
              bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-800/90 dark:to-zinc-900/90
              border border-slate-200/80 dark:border-zinc-700/80
              border-b-[3px] border-b-slate-300 dark:border-b-zinc-700
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_8px_16px_-4px_rgba(0,0,0,0.08)]
              group-hover:scale-110 group-hover:shadow-[0_12px_24px_-6px_rgba(99,102,241,0.3)]
              group-hover:border-indigo-400 dark:group-hover:border-indigo-500
            `}
          >
            <PhysicsIcon
              name={iconName}
              className={`${isLarge ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-9 sm:h-9'} ${accentColor} transition-transform duration-300 group-hover:rotate-6`}
            />
          </div>

          {/* Title */}
          <h3
            className={`mt-4 font-bold text-slate-900 dark:text-zinc-50 tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400
              ${isLarge ? 'text-xl sm:text-2xl lg:text-3xl font-extrabold' : 'text-base sm:text-lg'}
            `}
          >
            {title}
          </h3>

          {/* Subtitle / Description */}
          {subtitle && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed max-w-sm mx-auto line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Bottom Metadata & Action CTA */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-zinc-800/70 flex items-center justify-between text-xs relative z-10" style={{ transform: 'translateZ(15px)' }}>
          {metadata ? (
            <span className="font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {metadata}
            </span>
          ) : (
            <span className="text-slate-600 dark:text-zinc-300 font-medium">Ready for CBT</span>
          )}

          <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-200">
            {actionText}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Tilt3DCard>
  );
};
