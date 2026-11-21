// ==============================================================================
// NelovMallickIITD CBT Platform - Footer (TestonGo-Inspired Free Portal Edition)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React from 'react';
import { ExamType } from '../types';
import { LEGAL_CONFIG } from '../config/legal';

interface FooterProps {
  exam?: ExamType;
  onOpenAuth?: (title?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0c] text-slate-600 dark:text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Main 4-Column Grid (TestonGo Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1 & 2: Brand, Mentor & Support */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                NM
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-zinc-50">
                NelovMallick<span className="text-indigo-600 dark:text-indigo-400">IITD</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Official Computer-Based Test (CBT) portal for JEE Mains & JEE Advanced. Practice real examination interfaces, diagnostic analytics, KaTeX solutions, and chapter-wise study vaults. 100% free forever.
            </p>

            <div className="pt-1 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 block">
                Mentored by:
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                {LEGAL_CONFIG.OWNER_NAME} ({LEGAL_CONFIG.OWNER_TITLE})
              </p>
              <a
                href={`mailto:${LEGAL_CONFIG.CONTACT_EMAIL}`}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-block pt-0.5"
              >
                {LEGAL_CONFIG.CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Col 3: Platform Tests */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
              Mock Tests
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#/tests/jee-advanced"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  JEE Advanced (PTA 01–10)
                </a>
              </li>
              <li>
                <a
                  href="#/tests/jee-mains"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  JEE Mains (PTM 01–10)
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('Live Test Series')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  3-Attempt Mock Engine
                </button>
              </li>
              <li>
                <a
                  href="#/progress"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Rank Predictor & Scores
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Vault & Lectures */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
              Study Vaults
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#/resources/physics"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Physics Vault (28 Chapters)
                </a>
              </li>
              <li>
                <a
                  href="#/resources/chemistry"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Chemistry Vault (29 Chapters)
                </a>
              </li>
              <li>
                <a
                  href="#/resources/mathematics"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Mathematics Vault (26 Chapters)
                </a>
              </li>
              <li>
                <a
                  href="#/lectures"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  YouTube Video Lectures
                </a>
              </li>
              <li>
                <a
                  href="#/notebook"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Revision Notebook
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Compliance Column (TestonGo Style) */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#/privacy-policy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <span>🔒</span> Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#/terms"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <span>📜</span> Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#/disclaimer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <span>⚠️</span> Official Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="#/copyright"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <span>⚖️</span> Copyright & Takedown
                </a>
              </li>
              <li>
                <a
                  href="#/account"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-semibold text-slate-800 dark:text-zinc-300 pt-1"
                >
                  <span>👤</span> Account & Privacy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Subtle Divider (TestonGo Style) */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright Bar */}
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 text-center sm:text-left space-y-0.5">
            <p className="font-semibold">
              {LEGAL_CONFIG.COPYRIGHT_NOTICE} · Free Open Educational Platform
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">
              Curated by <strong>Nelov Mallick (IIT Delhi)</strong> · Zero Third-Party Advertising · 100% Free Forever
            </p>
          </div>

          {/* Social / Community Links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={LEGAL_CONFIG.YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-bold text-xs hover:bg-red-100 dark:hover:bg-red-900/60 transition-all shadow-sm"
              title="Subscribe on YouTube"
            >
              <span>▶</span> {LEGAL_CONFIG.YOUTUBE_LABEL}
            </a>
            <a
              href={LEGAL_CONFIG.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900/60 font-bold text-xs hover:bg-pink-100 dark:hover:bg-pink-900/60 transition-all shadow-sm"
              title="Follow on Instagram"
            >
              <span>📸</span> {LEGAL_CONFIG.INSTAGRAM_LABEL}
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
