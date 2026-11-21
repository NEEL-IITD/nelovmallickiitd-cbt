// ==============================================================================
// NelovMallickIITD CBT Platform - 3D Interactive JEE Mains 2027 PTM Schedule
// Curated by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useMemo, useEffect } from 'react';
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
  const { user, isAdmin, openAuthModal } = useAuth();

  // Filter & Layout States
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedToast, setCopiedToast] = useState(false);

  // Live real-time clock for real-time countdown & auto-unlock
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modal state for Preview Details (Syllabus + Instructions)
  const [previewItem, setPreviewItem] = useState<ScheduleTestItem | null>(null);
  const [previewTab, setPreviewTab] = useState<'syllabus' | 'instructions'>('syllabus');

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
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    return now >= start && now <= end;
  };

  // Check if test start time has arrived
  const hasStarted = (startIso: string) => {
    return now >= new Date(startIso).getTime();
  };

  // Calculate live countdown string
  const formatCountdown = (startIso: string) => {
    const diff = new Date(startIso).getTime() - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
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

  const openPreview = (item: ScheduleTestItem, initialTab: 'syllabus' | 'instructions' = 'syllabus') => {
    setPreviewItem(item);
    setPreviewTab(initialTab);
  };

  const handleAction = (item: ScheduleTestItem) => {
    const isLive = liveStatusMap[item.id] === 'live';
    const started = hasStarted(item.startIso);

    if (!user) {
      openAuthModal('login', item.hashRoute, `Sign in or create a free account to attempt ${item.code}.`);
      return;
    }

    // Admin bypass: can enter regardless of scheduled start
    if (isAdmin) {
      if (onSelectTest) {
        onSelectTest(item.id);
      } else {
        onNavigate(item.hashRoute);
      }
      return;
    }

    // For students: check if scheduled window has unlocked
    if (isLive && started) {
      if (onSelectTest) {
        onSelectTest(item.id);
      } else {
        onNavigate(item.hashRoute);
      }
    } else {
      // Locked before start time: open preview details with countdown
      openPreview(item, 'syllabus');
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
              const started = hasStarted(item.startIso);
              const attempts = getAttemptCount(item.id);
              const countdown = formatCountdown(item.startIso);
              const isCurrentlyLocked = !started && !isAdmin;

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

                    {/* Status Badge + Live Countdown */}
                    <div className="space-y-2.5 mb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        {inWindow ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            LIVE WINDOW NOW
                          </span>
                        ) : isLive && started ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Open Anytime
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Scheduled / Upcoming
                          </span>
                        )}

                        {attempts > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                            ✓ Attempted ({attempts}/3)
                          </span>
                        )}

                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                            ⚡ Admin Bypass
                          </span>
                        )}
                      </div>

                      {/* Live Ticking Countdown Pill before start time */}
                      {countdown && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                          <svg className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Starts in {countdown}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTAs */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => openPreview(item, 'syllabus')}
                      className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200/80 dark:border-zinc-700/80 transition-all text-center"
                    >
                      Preview Details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction(item)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        !isCurrentlyLocked || isAdmin
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20'
                          : 'bg-slate-200/80 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isAdmin ? (
                        <span>⚡ Admin Start →</span>
                      ) : !isCurrentlyLocked ? (
                        <span>Attempt {item.code} →</span>
                      ) : (
                        <span>🔒 Locked</span>
                      )}
                    </button>
                  </div>
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
                  <th className="py-3.5 px-4">Status & Countdown</th>
                  <th className="py-3.5 px-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                {filteredSchedule.map((item) => {
                  const isLive = liveStatusMap[item.id] === 'live';
                  const inWindow = isInsideWindow(item.startIso, item.endIso);
                  const started = hasStarted(item.startIso);
                  const attempts = getAttemptCount(item.id);
                  const countdown = formatCountdown(item.startIso);
                  const isCurrentlyLocked = !started && !isAdmin;

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
                          ) : isLive && started ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                              ● Open Anytime
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              {countdown ? `Starts in ${countdown}` : 'Scheduled'}
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openPreview(item, 'syllabus')}
                            className="px-2.5 py-1 rounded-lg font-bold text-xs bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200/80 dark:border-zinc-700/80 transition-all"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item)}
                            className={`px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                              !isCurrentlyLocked || isAdmin
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                                : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                            {isAdmin ? '⚡ Admin' : (!isCurrentlyLocked ? 'Attempt →' : '🔒 Locked')}
                          </button>
                        </div>
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

      {/* ======================================================================== */}
      {/* PREVIEW DETAILS MODAL: SYLLABUS + TEST INSTRUCTIONS                      */}
      {/* ======================================================================== */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in no-print">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#121217] border border-slate-200 dark:border-zinc-800 shadow-2xl text-slate-900 dark:text-zinc-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-start justify-between p-6 pb-4 bg-white/95 dark:bg-[#121217]/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                    {previewItem.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    Phase {previewItem.phase}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    300 Marks · 3 Hours · 75 Questions
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {previewItem.code}: Test Syllabus & Instructions
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Scheduled for {previewItem.dateStr} ({previewItem.windowStr}) · Curated by Nelov Mallick (IIT Delhi)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
              <button
                type="button"
                onClick={() => setPreviewTab('syllabus')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  previewTab === 'syllabus'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <span>📘</span>
                <span>Test Syllabus (PCM)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTab('instructions')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  previewTab === 'instructions'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <span>📋</span>
                <span>General Instructions & Marking</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              
              {/* TAB 1: SYLLABUS */}
              {previewTab === 'syllabus' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Banner note */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
                    <span className="text-lg">🎯</span>
                    <div className="space-y-1">
                      <p className="font-bold">Mastery Checklist for {previewItem.code}:</p>
                      <p className="text-[11px] text-indigo-800/90 dark:text-indigo-300">
                        This test evaluates exact NTA weightage across standard syllabus chapters. Revise formulas and standard derivations thoroughly before attempting.
                      </p>
                    </div>
                  </div>

                  {/* Physics Syllabus Card */}
                  <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20 p-5 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-600 dark:text-sky-300 flex items-center justify-center font-black text-xs">
                        PH
                      </span>
                      <div>
                        <h4 className="font-black text-sm text-sky-950 dark:text-sky-200">
                          Physics Syllabus (25 Questions · 100 Marks)
                        </h4>
                        <p className="text-[11px] text-sky-800/80 dark:text-sky-400">
                          Thermodynamics & Kinetic Theory Focus
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 pl-1">
                      {previewItem.syllabus?.physics ? (
                        previewItem.syllabus.physics.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-sky-500 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex items-start gap-2.5">
                            <span className="text-sky-500 font-bold mt-0.5">•</span>
                            <span><strong>Kinetic Theory of Gases (KTG):</strong> Degrees of freedom, Maxwell-Boltzmann velocity distribution, RMS speed, average speed, most probable speed, mean free path, and relaxation time.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-sky-500 font-bold mt-0.5">•</span>
                            <span><strong>Thermodynamics:</strong> Zeroth and First Law, work done in isobaric, isothermal, adiabatic, isochoric, and cyclic processes; indicator diagrams (P-V, T-S); Carnot engine efficiency; adiabatic bulk modulus.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Chemistry Syllabus Card */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black text-xs">
                        CH
                      </span>
                      <div>
                        <h4 className="font-black text-sm text-emerald-950 dark:text-emerald-200">
                          Chemistry Syllabus (25 Questions · 100 Marks)
                        </h4>
                        <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                          Organic Chemistry Foundations & Hydrocarbons
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 pl-1">
                      {previewItem.syllabus?.chemistry ? (
                        previewItem.syllabus.chemistry.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex items-start gap-2.5">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span><strong>Hydrocarbons:</strong> Alkanes, alkenes, alkynes; free-radical halogenation; oxymercuration-demercuration; conjugated dienes; Wurtz and Wurtz-Fittig reactions.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span><strong>General Organic Chemistry (GOC):</strong> Aromaticity and Hückel&apos;s Rule (4n+2 π electrons), relative acidic strength (pKa comparisons), dipole moments in substituted alkanes and halides.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span><strong>Purification & Practical Organic Chemistry (POC):</strong> Simple, fractional, vacuum, and steam distillation principles; Thin Layer Chromatography ($R_f$ factor); quantitative Kjeldahl's method for nitrogen.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Mathematics Syllabus Card */}
                  <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-5 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-black text-xs">
                        MA
                      </span>
                      <div>
                        <h4 className="font-black text-sm text-amber-950 dark:text-amber-200">
                          Mathematics Syllabus (25 Questions · 100 Marks)
                        </h4>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                          Trigonometry & Functional Relations
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 pl-1">
                      {previewItem.syllabus?.mathematics ? (
                        previewItem.syllabus.mathematics.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex items-start gap-2.5">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span><strong>Trigonometric Ratios & Identities:</strong> Compound angles, multiple & submultiple angle formulas, transformation product-to-sum, summation of cosine and sine series.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span><strong>Trigonometric Functions & Properties:</strong> Domain, range, periodicity, greatest integer function [sin x] combinations, graphs of reciprocal and inverse functions.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span><strong>Trigonometric Equations:</strong> General solution families, counting number of roots in bounded intervals [0, 2π] or [-π, π], and simultaneous systems.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                </div>
              )}

              {/* TAB 2: GENERAL INSTRUCTIONS */}
              {previewTab === 'instructions' && (
                <div className="space-y-6 animate-fade-in text-xs text-slate-700 dark:text-zinc-300">
                  
                  {/* Pattern Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Duration</p>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-1">180 Mins</p>
                      <p className="text-[10px] text-slate-500">3 Clock Hours</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Total Marks</p>
                      <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">300 Marks</p>
                      <p className="text-[10px] text-slate-500">100 per Subject</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Total Questions</p>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-1">75 Qs</p>
                      <p className="text-[10px] text-slate-500">25 PH · 25 CH · 25 MA</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Marking</p>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">+4 / -1</p>
                      <p className="text-[10px] text-slate-500">Negative Marking</p>
                    </div>
                  </div>

                  {/* Section Breakdown Card */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 space-y-3">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>⚖️</span> Examination Structure & Section Marking
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-zinc-700 text-[11px] font-bold text-slate-500">
                            <th className="pb-2">Section</th>
                            <th className="pb-2">Question Type</th>
                            <th className="pb-2">Count</th>
                            <th className="pb-2">Correct</th>
                            <th className="pb-2">Incorrect</th>
                            <th className="pb-2">Unanswered</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-[11px]">
                          <tr>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-zinc-100">Section I</td>
                            <td className="py-2.5">Multiple Choice (Single Correct)</td>
                            <td className="py-2.5 font-mono">20 Qs / Subject</td>
                            <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+4</td>
                            <td className="py-2.5 text-rose-600 dark:text-rose-400 font-bold">-1</td>
                            <td className="py-2.5 text-slate-500">0</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-zinc-100">Section II</td>
                            <td className="py-2.5">Numerical Value (Nearest Integer)</td>
                            <td className="py-2.5 font-mono">5 Qs / Subject</td>
                            <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-bold">+4</td>
                            <td className="py-2.5 text-rose-600 dark:text-rose-400 font-bold">-1</td>
                            <td className="py-2.5 text-slate-500">0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Test-Taking Rules List */}
                  <div className="space-y-2.5">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">
                      Strict Candidate Code of Conduct:
                    </h4>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-2.5">
                        <span className="text-indigo-500 font-bold mt-0.5">1.</span>
                        <span><strong>Calculators and Devices:</strong> No calculators, mobile phones, slide rules, or external aids are permitted. Calculations must be carried out on rough paper.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-indigo-500 font-bold mt-0.5">2.</span>
                        <span><strong>Numerical Rounding:</strong> In Section II, enter your response rounded off to the <em>nearest integer</em> unless explicitly specified otherwise.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-indigo-500 font-bold mt-0.5">3.</span>
                        <span><strong>Real CBT Palette:</strong> Use the Question Palette to track visited (grey), not answered (red), answered (green), and marked for review (purple) statuses.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-indigo-500 font-bold mt-0.5">4.</span>
                        <span><strong>Auto-Submission:</strong> When the 180-minute countdown expires, your examination will automatically freeze and submit. Answers marked for review will be evaluated.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-indigo-500 font-bold mt-0.5">5.</span>
                        <span><strong>1st-Attempt Leaderboard:</strong> Only your first verified attempt is counted for the All-India Percentile and Rank Leaderboard, maintaining authentic calibration.</span>
                      </li>
                    </ul>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer with Status & Action */}
            <div className="p-6 bg-slate-50 dark:bg-zinc-900/80 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {!hasStarted(previewItem.startIso) && !isAdmin ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Locked until {previewItem.dateStr}, 10:00 AM IST ({formatCountdown(previewItem.startIso) ? `Starts in ${formatCountdown(previewItem.startIso)}` : 'Upcoming'})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isAdmin ? 'Admin Bypass Enabled · Ready to Attempt' : 'Test is Live · 100% Free Forever'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 transition-colors"
                >
                  Close Preview
                </button>

                {!hasStarted(previewItem.startIso) && !isAdmin ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed border border-slate-300 dark:border-zinc-700"
                  >
                    🔒 Locked until 10:00 AM IST
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const item = previewItem;
                      setPreviewItem(null);
                      if (onSelectTest) {
                        onSelectTest(item.id);
                      } else {
                        onNavigate(item.hashRoute);
                      }
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{isAdmin ? '⚡ Admin Start' : 'Start Test Now'} →</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
