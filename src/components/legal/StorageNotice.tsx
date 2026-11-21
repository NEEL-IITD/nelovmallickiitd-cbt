// ==============================================================================
// NelovMallickIITD CBT Platform - Essential Storage / Cookie Notice
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'nelov_storage_notice_dismissed';

export const StorageNotice: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch (e) {
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and storage notification"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-[#121318]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 shadow-xl text-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
            🍪
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 text-xs">
              Essential Storage Notice
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
              This free portal uses only essential login cookies and browser storage to save your active exam timer and study progress—never advertising trackers.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800/80">
          <a
            href="#/privacy-policy"
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Learn more in Privacy Policy →
          </a>
          <button
            onClick={handleDismiss}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-all shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </aside>
  );
};
