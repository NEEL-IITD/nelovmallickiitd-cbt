import React from 'react';
import { ExamType } from '../types';

interface FooterProps {
  exam: ExamType;
  onOpenAuth: (title?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ exam, onOpenAuth }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0c] text-slate-600 dark:text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Contact */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                NM
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-zinc-50">
                NelovMallick<span className="text-indigo-600 dark:text-indigo-400">IITD</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Trusted {exam.toUpperCase()} preparation platform. Smart test series, PYQ analysis, AI mistake diagnosis, score tracking, and everything you need to secure a top rank.
            </p>

            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 block">Support Helpdesk:</span>
              <a
                href="mailto:support@nelovmallickiitd.com"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                support@nelovmallickiitd.com
              </a>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenAuth('Access Dashboard')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('Practice Mode')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Timed Practice Drills
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('PYQ Analysis')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  PYQ Question Bank
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('Formula Book')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  70+ Formula Sheets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
              Legal & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button
                  onClick={() => alert('NelovMallickIITD Privacy Policy: We respect student privacy. Student analytics and contact data are strictly private and never shared.')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('NelovMallickIITD Terms of Service: Standard one-time license for individual personal exam preparation.')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('NelovMallickIITD Refund Policy: 100% full refund within 3 days of purchase, no questions asked.')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Refund Policy (3-Day Guarantee)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Community Channels Strip */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500">Official Channels:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
              📸 @nelovmallick.iitd
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
              ▶ Nelov Mallick IITD
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
              🎓 IITian Guidance Network
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-zinc-500">
            © 2026 NelovMallickIITD. All rights reserved. · Built for ambitious aspirants.
          </p>
        </div>

      </div>
    </footer>
  );
};
