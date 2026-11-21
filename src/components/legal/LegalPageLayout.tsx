// ==============================================================================
// NelovMallickIITD CBT Platform - Reusable Legal Page Layout
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { LEGAL_CONFIG } from '../../config/legal';

export interface TocItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  badgeText = 'Official Policy',
  toc,
  children
}) => {
  const [activeSection, setActiveSection] = useState<string>(toc[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (let i = toc.length - 1; i >= 0; i--) {
        const item = toc[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop - 140 <= scrollY) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 100;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-800 dark:text-zinc-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
          <nav className="flex items-center gap-2">
            <a href="#/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </a>
            <span>›</span>
            <span className="text-slate-800 dark:text-zinc-200">Legal & Compliance</span>
            <span>›</span>
            <span className="text-indigo-600 dark:text-indigo-400">{title}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
              title="Print or Save as PDF"
            >
              <span>🖨️</span> Print / Save PDF
            </button>
            <a
              href="#/"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {badgeText}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                  Version {LEGAL_CONFIG.POLICY_VERSION}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ● Last Updated: {LEGAL_CONFIG.LAST_UPDATED}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="shrink-0 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1.5">
              <div className="font-extrabold text-slate-900 dark:text-zinc-100">
                {LEGAL_CONFIG.OWNER_NAME}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                {LEGAL_CONFIG.OWNER_TITLE}
              </div>
              <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                Jurisdiction: {LEGAL_CONFIG.JURISDICTION}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body with Sticky TOC on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation (Desktop) */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white dark:bg-[#121318] rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 px-2">
                  Table of Contents
                </h3>
                <nav className="space-y-1 text-xs">
                  {toc.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border-l-2 border-indigo-600'
                          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-[10px] opacity-60 font-mono">{idx + 1}.</span>
                      <span className="truncate">{item.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Legal Cross-Links */}
              <div className="bg-white dark:bg-[#121318] rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm space-y-2.5 text-xs">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-1">
                  Related Policies
                </h4>
                <div className="space-y-1 font-medium">
                  <a
                    href="#/privacy-policy"
                    className="block px-2 py-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    🔒 Privacy Policy (DPDP Act)
                  </a>
                  <a
                    href="#/terms"
                    className="block px-2 py-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    📜 Terms of Service
                  </a>
                  <a
                    href="#/disclaimer"
                    className="block px-2 py-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    ⚠️ Official Disclaimer
                  </a>
                  <a
                    href="#/copyright"
                    className="block px-2 py-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    ⚖️ Copyright & Takedown
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm text-sm leading-relaxed space-y-8">
              {children}
            </div>

            {/* Bottom Cross-Navigation & Grievance Box */}
            <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  🛡️
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 dark:text-zinc-100 text-base">
                    Grievance Officer & Data Redressal Contact
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Under the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Rules, any student, parent, or copyright owner may submit questions, data erasure requests, or grievance notices directly to:
                  </p>
                  <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 pt-1">
                    {LEGAL_CONFIG.GRIEVANCE_OFFICER} ({LEGAL_CONFIG.OWNER_TITLE}) · Email:{' '}
                    <a
                      href={`mailto:${LEGAL_CONFIG.CONTACT_EMAIL}`}
                      className="underline hover:text-indigo-800 dark:hover:text-indigo-200"
                    >
                      {LEGAL_CONFIG.CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-zinc-400">
                  <a href="#/privacy-policy" className="hover:underline">Privacy Policy</a>
                  <span>·</span>
                  <a href="#/terms" className="hover:underline">Terms of Service</a>
                  <span>·</span>
                  <a href="#/disclaimer" className="hover:underline">Disclaimer</a>
                  <span>·</span>
                  <a href="#/copyright" className="hover:underline">Copyright & Takedown</a>
                </div>
                <span className="font-semibold text-slate-400 dark:text-zinc-500">
                  {LEGAL_CONFIG.COPYRIGHT_NOTICE}
                </span>
              </div>
            </div>
          </main>

        </div>

      </div>
    </div>
  );
};
