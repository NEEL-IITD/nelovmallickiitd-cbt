// ==============================================================================
// NelovMallickIITD CBT Platform - 3D Interactive JEE Mains 2027 PTM Schedule
// Curated by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { JEE_MAINS_2027_SCHEDULE, FINAL_REVISION_CARD, ScheduleTestItem } from '../data/scheduleData';
import { Tilt3DCard } from './ui/Tilt3DCard';
import { useAuth } from '../context/AuthContext';
import { studentStorage } from '../utils/studentStorage';
import { jeeMainsTests } from '../data/testsIndex';
import { TestMetadata } from '../data/testTypes';

interface ScheduleViewProps {
  onNavigate?: (hash: string) => void;
  onSelectTest?: (testId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  onNavigate = (hash) => { window.location.hash = hash; },
  onSelectTest
}) => {
  const { user, openAuthModal } = useAuth();

  // Filter & Layout States
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedToast, setCopiedToast] = useState(false);

  // Map of test configs / live statuses from testsIndex
  const liveStatusMap = useMemo(() => {
    const map: Record<string, string> = {};
    jeeMainsTests.forEach((t: TestMetadata) => {
      map[t.id] = t.status;
    });
    return map;
  }, []);

  // Filter tests
  const filteredSchedule = useMemo(() => {
    if (selectedPhase === 'all') return JEE_MAINS_2027_SCHEDULE;
    return JEE_MAINS_2027_SCHEDULE.filter((t) => t.phase === selectedPhase);
  }, [selectedPhase]);

  // Check if test is currently within its live window
  const isInsideWindow = (startIso: string, endIso: string) => {
    const now = Date.now();
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    return now >= start && now <= end;
  };

  // Get student attempt count for this test
  const getAttemptCount = (testId: string) => {
    if (!user) return 0;
    const history = studentStorage.getAttempts(user.id);
    return history.filter((a) => a.testId === testId).length;
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/schedule`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAction = (item: ScheduleTestItem) => {
    const isLive = liveStatusMap[item.id] === 'live';
    if (!user) {
      openAuthModal('login', item.hashRoute, `Sign in or create a free account to attempt ${item.code}.`);
      return;
    }
    if (isLive) {
      if (onSelectTest) {
        onSelectTest(item.id);
      } else {
        onNavigate(item.hashRoute);
      }
    } else {
      // Coming soon notice
      alert(`${item.code} is scheduled for ${item.dateStr} (${item.windowStr}). Every test is released according to this calendar and remains 100% open anytime afterward!`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Printable Schedule Styles */}
      <style>{`
        @media print {
          nav, aside, footer, .no-print, button {
            display: none !important;
          }
          body, html {
            background: white !important;
            color: black !important;
          }
          .print-area {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            break-inside: avoid;
            margin-bottom: 8px !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Copy Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Schedule link copied to clipboard!
        </div>
      )}

      {/* Ambient Top Glow */}
      <div className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto print-area">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        {/* Top Back & Action Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
          <button
            onClick={() => onNavigate('#/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            ← Back to Home
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Save / Print Schedule (PDF)
            </button>
          </div>
        </div>

        {/* 3D Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-purple-950/90 text-white border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill Tags */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              JEE Mains 2027 Calendar
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              100% Free Forever
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15">
              Curated by Nelov Mallick (IIT Delhi)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            JEE Mains 2027 (January Attempt)<br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
              20-Test Practice Test Mains (PTM) Schedule
            </span>
          </h1>

          {/* Academic Director Quote */}
          <div className="relative my-6 pl-4 border-l-4 border-indigo-400 text-slate-200 italic text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
            &ldquo;The 20-Test PTM Series is designed to calibrate your exam temperament, eliminate negative marking, and lock your timing before January 2027. Treat every mock with the sanctity of the actual examination.&rdquo;
            <div className="not-italic text-xs font-semibold text-indigo-300 mt-2">
              — Nelov Mallick, Academic Director & Mentor (IIT Delhi)
            </div>
          </div>

          {/* Flexible Access Reassurance Callout Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs sm:text-sm font-medium text-slate-100 shadow-inner backdrop-blur-md">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-300 text-sm font-bold">
              ✓
            </span>
            <span>
              <strong className="text-emerald-300 font-bold">Flexible Access Guarantee:</strong> Missed a live window? Every live PTM stays open anytime afterward. Never locked out.
            </span>
          </div>

          {/* 3 Fast Fact Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                20
              </span>
              <div>
                <p className="text-xs font-bold text-white">Full-Length Mocks</p>
                <p className="text-[11px] text-slate-300">300 Marks · 3 Hours · Exact CBT Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                3
              </span>
              <div>
                <p className="text-xs font-bold text-white">Progressive Phases</p>
                <p className="text-[11px] text-slate-300">Calibration → Endurance → Shift Simulation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-sm">
                0₹
              </span>
              <div>
                <p className="text-xs font-bold text-white">Zero Paywalls</p>
                <p className="text-[11px] text-slate-300">100% Free Access for Every JEE Aspirant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Filter Tabs & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 no-print">
          
          {/* Phase Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 dark:bg-zinc-900/90 p-1.5 rounded-2xl border border-slate-300/80 dark:border-zinc-800">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPhase === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Tests (20)
            </button>
            <button
              onClick={() => setSelectedPhase(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPhase === 1
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Phase 1 · Build (01–07)
            </button>
            <button
              onClick={() => setSelectedPhase(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPhase === 2
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Phase 2 · Endurance (08–16)
            </button>
            <button
              onClick={() => setSelectedPhase(3)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPhase === 3
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Phase 3 · NTA Shifts (17–20)
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center self-end sm:self-auto gap-1 bg-slate-200/70 dark:bg-zinc-900/90 p-1.5 rounded-2xl border border-slate-300/80 dark:border-zinc-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              3D Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Compact Timetable
            </button>
          </div>
        </div>

        {/* 1. 3D Cards Grid View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredSchedule.map((item) => {
              const isLive = liveStatusMap[item.id] === 'live';
              const inWindow = isInsideWindow(item.startIso, item.endIso);
              const attempts = getAttemptCount(item.id);

              return (
                <Tilt3DCard
                  key={item.id}
                  maxTilt={8}
                  perspective={1100}
                  className="print-card rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 shadow-md hover:shadow-xl dark:shadow-zinc-950/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Meta Strip: Phase Pill + Event Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {item.phase === 1 && 'Phase 1 · Build & Calibrate'}
                        {item.phase === 2 && 'Phase 2 · Speed & Endurance'}
                        {item.phase === 3 && 'Phase 3 · NTA Shift Sim'}
                      </span>

                      {item.tag && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Test Code & Headline */}
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {item.code}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        300 Marks · 3 Hrs
                      </span>
                    </div>

                    {/* Date and Window Box */}
                    <div className="space-y-2 mb-5 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-700/50 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-700 dark:text-zinc-300 font-medium">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong>Date:</strong> {item.dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 dark:text-zinc-300 font-medium">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Window:</strong> {item.windowStr}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {inWindow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          LIVE WINDOW NOW
                        </span>
                      ) : isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          Open Anytime
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700">
                          Scheduled · Coming Soon
                        </span>
                      )}

                      {attempts > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                          ✓ Attempted ({attempts}/3)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <button
                    onClick={() => handleAction(item)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isLive
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isLive ? `Attempt ${item.code} →` : `Scheduled · Preview Details`}
                  </button>
                </Tilt3DCard>
              );
            })}
          </div>
        )}

        {/* 2. Compact Timetable View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg mb-12">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Test Code</th>
                  <th className="py-3.5 px-4">Phase</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Live Window (IST)</th>
                  <th className="py-3.5 px-4">Event Tag</th>
                  <th className="py-3.5 px-4">Status & Access</th>
                  <th className="py-3.5 px-4 text-right no-print">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                {filteredSchedule.map((item) => {
                  const isLive = liveStatusMap[item.id] === 'live';
                  const inWindow = isInsideWindow(item.startIso, item.endIso);
                  const attempts = getAttemptCount(item.id);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/40 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-slate-400 dark:text-zinc-500 font-bold">
                        {String(item.num).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                        {item.code}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">
                        {item.phase === 1 && 'Phase 1 · Build'}
                        {item.phase === 2 && 'Phase 2 · Endurance'}
                        {item.phase === 3 && 'Phase 3 · NTA Shifts'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-zinc-200 whitespace-nowrap">
                        {item.dateStr}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                        {item.windowStr}
                      </td>
                      <td className="py-3 px-4">
                        {item.tag ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
                            {item.tag}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {inWindow ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                              ● Live Window
                            </span>
                          ) : isLive ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                              ● Open Anytime
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                              Scheduled
                            </span>
                          )}
                          {attempts > 0 && (
                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                              ({attempts}/3 done)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right no-print">
                        <button
                          onClick={() => handleAction(item)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                            isLive
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                              : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {isLive ? `Attempt →` : `Preview`}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Final Revision Vault Card */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/40 border border-purple-500/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 print-card">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {FINAL_REVISION_CARD.dateStr}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {FINAL_REVISION_CARD.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-xl">
              {FINAL_REVISION_CARD.description}
            </p>
          </div>

          <button
            onClick={() => onNavigate(FINAL_REVISION_CARD.hashRoute)}
            className="no-print shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-purple-500/20 transition-all flex items-center gap-2"
          >
            Open Formula Vault & Resources →
          </button>
        </div>

      </div>
    </div>
  );
};
