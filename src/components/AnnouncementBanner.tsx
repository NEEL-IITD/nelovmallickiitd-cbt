import React, { useState } from 'react';

interface AnnouncementBannerProps {
  onSelectTest?: (testId: string) => void;
  onNavigate?: (hash: string) => void;
}

const BANNER_STORAGE_KEY = 'dismiss_pta_live_banner_2026_11';

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  onSelectTest,
  onNavigate,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(BANNER_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors in private browsing
    }
  };

  const handleTestClick = (testId: string, testHash: string) => {
    if (onSelectTest) {
      onSelectTest(testId);
    } else if (onNavigate) {
      onNavigate(testHash);
    } else {
      window.location.hash = testHash;
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Live Mock Exam Announcement"
      className="relative z-40 w-full bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 border-b border-indigo-800/40 py-2.5 px-4 text-white shadow-inner transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left: Live indicator + Headline */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm animate-pulse whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Live Now
          </span>
          <span className="font-semibold text-indigo-100 text-center md:text-left">
            JEE Advanced Mock Papers <strong className="text-white font-extrabold">PTA 04</strong>, <strong className="text-white font-extrabold">PTA 05</strong> &amp; <strong className="text-white font-extrabold">PTA 06</strong> are live and 100% free!
          </span>
        </div>

        {/* Right: Quick action buttons + Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleTestClick('jee-advanced-pta-04', '#/test/jee-advanced/pta-04')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            Start PTA 04 →
          </button>
          <button
            type="button"
            onClick={() => handleTestClick('jee-advanced-pta-05', '#/test/jee-advanced/pta-05')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            Start PTA 05 →
          </button>
          <button
            type="button"
            onClick={() => handleTestClick('jee-advanced-pta-06', '#/test/jee-advanced/pta-06')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap flex items-center gap-1"
          >
            <span>Start PTA 06</span>
            <span className="text-[10px] bg-emerald-700/80 px-1 rounded font-extrabold">New</span>
            <span>→</span>
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            title="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};
