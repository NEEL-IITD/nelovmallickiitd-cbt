import React, { useState, useEffect } from 'react';
import { LeaderboardResult, OverallLeaderboardEntry, TopperSummaryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { studentStorage } from '../utils/studentStorage';
import { Tilt3DCard } from './ui/Tilt3DCard';
import { useCountdown } from '../hooks/useCountdown';

interface LeaderboardHubProps {
  initialTestId?: string;
  onSelectTest?: (testId: string) => void;
  onNavigateHome?: () => void;
}

export const LeaderboardHub: React.FC<LeaderboardHubProps> = ({
  initialTestId = 'jee-advanced-pta-04',
  onSelectTest,
  onNavigateHome
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'jee-advanced' | 'jee-mains' | 'overall'>('jee-advanced');
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId);
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResult | null>(null);
  const [toppersSummaries, setToppersSummaries] = useState<TopperSummaryItem[]>([]);
  const [overallLeaderboard, setOverallLeaderboard] = useState<OverallLeaderboardEntry[]>([]);
  const [allTestConfigs, setAllTestConfigs] = useState<Record<string, any>>({});

  // Countdown for locked window
  const unlockCountdown = useCountdown(leaderboardData?.locked ? leaderboardData.unlocksAt : null);

  // Load summaries and test configs on mount
  useEffect(() => {
    loadTestConfigsAndSummaries();
  }, []);

  // Reload test leaderboard when selected test changes
  useEffect(() => {
    if (activeTab !== 'overall') {
      loadTestLeaderboard(selectedTestId);
    } else {
      loadOverallLeaderboard();
    }
  }, [selectedTestId, activeTab]);

  const loadTestConfigsAndSummaries = async () => {
    try {
      const summaries = await studentStorage.getTestToppersSummary();
      setToppersSummaries(summaries);

      const configs = await studentStorage.getTestConfigs();
      setAllTestConfigs(configs);
    } catch (e) {
      console.warn('Error loading toppers summaries:', e);
    }
  };

  const loadTestLeaderboard = async (testId: string) => {
    setLoading(true);
    try {
      const result = await studentStorage.getTestLeaderboard(testId);
      setLeaderboardData(result);
    } catch (e) {
      console.error('Failed to load test leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const result = await studentStorage.getOverallLeaderboard();
      setOverallLeaderboard(result);
    } catch (e) {
      console.error('Failed to load overall leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  // Catalog tests for selector pills
  const ptaTests = Array.from({ length: 10 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
      testId: `jee-advanced-pta-${num}`,
      code: `PTA ${num}`,
      title: `JEE Advanced – PTA ${num}`,
      isLive: ['04', '05', '06'].includes(num) || allTestConfigs[`jee-advanced-pta-${num}`] === 'live'
    };
  });

  const ptmTests = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
      testId: `jee-mains-ptm-${num}`,
      code: `PTM ${num}`,
      title: `JEE Mains – PTM ${num}`,
      isLive: allTestConfigs[`jee-mains-ptm-${num}`] === 'live'
    };
  });

  const currentTestList = activeTab === 'jee-advanced' ? ptaTests : ptmTests;

  // Filter entries by search query
  const filteredEntries = (leaderboardData?.entries || []).filter((entry) =>
    entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOverall = overallLeaderboard.filter((entry) =>
    entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSeconds = (sec: number) => {
    if (!sec || sec <= 0) return '—';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome ? onNavigateHome : () => { window.location.hash = '#/'; }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              ← Back to Portal Home
            </button>
            <span className="text-slate-300 dark:text-zinc-700">/</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">All-India CBT Rankings</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              100% Free · NTA Percentile Normalized
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 p-8 sm:p-10 text-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-100">
              <span>🏆</span> Live All-India CBT Leaderboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Authentic JEE Mains &amp; Advanced Rankings
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Transparent, merit-first peer benchmarking mentored by <strong>Nelov Mallick</strong> (IIT Delhi). Inspect who is on top, exact marks scored, and authentic percentile standings.
            </p>
          </div>
        </div>

        {/* Fairness Notice Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start sm:items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2.5">
            <span className="text-base">⚖️</span>
            <p>
              <strong>1st-Attempt-Only Official Rankings:</strong> Ranks, marks, and percentiles are locked to each student's official 1st attempt. Re-attempts (2nd &amp; 3rd) serve strictly for self-practice and never alter leaderboard standings.
            </p>
          </div>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
            Anti-Cheat Protected
          </span>
        </div>

        {/* 3 Main View Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-zinc-800 gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('jee-advanced');
              setSelectedTestId('jee-advanced-pta-04');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'jee-advanced'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <span>🎯</span>
            <span>JEE Advanced (PTA 01–10)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('jee-mains');
              setSelectedTestId('jee-mains-ptm-01');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'jee-mains'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <span>⚡</span>
            <span>JEE Mains (PTM 01–10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overall')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overall'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <span>👑</span>
            <span>Overall Portal Toppers (All Tests)</span>
          </button>
        </div>

        {/* Paper Selector Pills (For JEE Advanced & JEE Mains tabs) */}
        {activeTab !== 'overall' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>Select Question Paper:</span>
              <span>{currentTestList.filter((t) => t.isLive).length} Active Live Papers</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {currentTestList.map((test) => {
                const isSelected = selectedTestId === test.testId;
                const summary = toppersSummaries.find((s) => s.testId === test.testId);
                const participantCount = summary?.totalParticipants || 0;

                return (
                  <button
                    key={test.testId}
                    type="button"
                    onClick={() => setSelectedTestId(test.testId)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                        : test.isLive
                        ? 'bg-white dark:bg-[#121318] text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-800 hover:border-indigo-400'
                        : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-400 dark:text-zinc-600 border-dashed border-slate-200 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <span>{test.code}</span>
                    {test.isLive ? (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}>
                        {participantCount} Students
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400">Soon</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1 & 2: PER-TEST LEADERBOARD */}
        {/* ========================================================================= */}
        {activeTab !== 'overall' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Locked Window State Banner */}
            {leaderboardData?.locked && (
              <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-8 sm:p-10 text-center space-y-5 shadow-xl">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-600 dark:text-amber-400 text-3xl flex items-center justify-center mx-auto shadow-inner">
                  🔒
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-500 text-white">
                    Live Window Underway
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50">
                    Leaderboard Locked Until Scheduled Window Closes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    To maintain strict exam integrity during this All-India Live Mock, peer ranks, marks, and percentiles will unlock automatically when the window concludes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/80 max-w-md mx-auto shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unlocks In</p>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-amber-600 dark:text-amber-400 pt-1">
                    {unlockCountdown.formatted}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    {leaderboardData.totalParticipants} students have submitted their official attempt so far.
                  </p>
                </div>

                {/* If current student hasn't submitted yet */}
                {!leaderboardData.myAttemptSubmitted && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectTest ? onSelectTest(selectedTestId) : (window.location.hash = `#/test/${activeTab}/${selectedTestId.split('-').pop()}`)}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                      Attempt Test Now Before Window Closes →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Unlocked Leaderboard Content */}
            {!leaderboardData?.locked && (
              <>
                {/* 1. TOP 3 CROWNED PODIUM SHOWCASE */}
                {leaderboardData?.entries && leaderboardData.entries.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        Top 3 Performers
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50">
                        Crowned Toppers Podium
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-4xl mx-auto">
                      
                      {/* #2 Runner-Up Podium Card (Silver) */}
                      {leaderboardData.entries[1] ? (
                        <Tilt3DCard maxTilt={8} perspective={1000} className="rounded-3xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#121318] p-6 shadow-lg text-center space-y-4 md:order-1 order-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xl font-black flex items-center justify-center mx-auto shadow-sm">
                            🥈 #2
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 line-clamp-1">
                              {leaderboardData.entries[1].displayName}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-500">Runner-Up</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 space-y-1">
                            <div className="text-2xl font-black font-mono text-slate-800 dark:text-zinc-200">
                              {leaderboardData.entries[1].marks} <span className="text-xs text-slate-400">/ {leaderboardData.entries[1].maxMarks}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <span>{leaderboardData.entries[1].percentile}%ile</span>
                              <span>·</span>
                              <span>{leaderboardData.entries[1].accuracy}% Acc</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Time Taken: {formatSeconds(leaderboardData.entries[1].timeTakenSeconds)}
                          </p>
                        </Tilt3DCard>
                      ) : (
                        <div className="hidden md:block md:order-1" />
                      )}

                      {/* #1 Topper Podium Card (Gold Crown, Elevated) */}
                      {leaderboardData.entries[0] && (
                        <Tilt3DCard maxTilt={10} perspective={1000} className="rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-amber-500/10 via-white dark:via-[#121318] to-white dark:to-[#121318] p-7 shadow-2xl text-center space-y-4 md:order-2 order-1 md:-translate-y-4 ring-4 ring-amber-500/10">
                          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white text-3xl font-black flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 animate-bounce">
                            👑
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500 text-white shadow-sm">
                            Rank #1 Topper
                          </span>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-zinc-50 line-clamp-1">
                              {leaderboardData.entries[0].displayName}
                            </h4>
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">All-India #1 Scorer</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-1">
                            <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                              {leaderboardData.entries[0].marks} <span className="text-sm text-slate-500 font-semibold">/ {leaderboardData.entries[0].maxMarks}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                              <span>{leaderboardData.entries[0].percentile}%ile</span>
                              <span>·</span>
                              <span>{leaderboardData.entries[0].accuracy}% Acc</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                            Pacing: {formatSeconds(leaderboardData.entries[0].timeTakenSeconds)}
                          </p>
                        </Tilt3DCard>
                      )}

                      {/* #3 Bronze Podium Card */}
                      {leaderboardData.entries[2] ? (
                        <Tilt3DCard maxTilt={8} perspective={1000} className="rounded-3xl border-2 border-amber-700/50 dark:border-amber-700/40 bg-white dark:bg-[#121318] p-6 shadow-lg text-center space-y-4 md:order-3 order-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xl font-black flex items-center justify-center mx-auto shadow-sm">
                            🥉 #3
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 line-clamp-1">
                              {leaderboardData.entries[2].displayName}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-500">2nd Runner-Up</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 space-y-1">
                            <div className="text-2xl font-black font-mono text-slate-800 dark:text-zinc-200">
                              {leaderboardData.entries[2].marks} <span className="text-xs text-slate-400">/ {leaderboardData.entries[2].maxMarks}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <span>{leaderboardData.entries[2].percentile}%ile</span>
                              <span>·</span>
                              <span>{leaderboardData.entries[2].accuracy}% Acc</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Time Taken: {formatSeconds(leaderboardData.entries[2].timeTakenSeconds)}
                          </p>
                        </Tilt3DCard>
                      ) : (
                        <div className="hidden md:block md:order-3" />
                      )}

                    </div>
                  </div>
                )}

                {/* 2. YOUR OFFICIAL STANDING CARD (HIGHLIGHTED) */}
                <div className="rounded-3xl border-2 border-indigo-600 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-xl shadow-indigo-600/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                        👤
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-zinc-50">
                          Your Official 1st-Attempt Standing
                        </h4>
                        <p className="text-xs text-slate-500">
                          Benchmarked against {leaderboardData?.totalParticipants || 0} active JEE aspirants
                        </p>
                      </div>
                    </div>

                    {leaderboardData?.myStanding && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                        Official Entry Verified
                      </span>
                    )}
                  </div>

                  {leaderboardData?.myStanding ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Your Rank</p>
                        <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 pt-1">
                          #{leaderboardData.myStanding.rank}
                        </p>
                        <p className="text-[10px] text-slate-400">of {leaderboardData.totalParticipants} students</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Your Marks</p>
                        <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-zinc-100 pt-1">
                          {leaderboardData.myStanding.marks}
                        </p>
                        <p className="text-[10px] text-slate-400">out of {leaderboardData.myStanding.maxMarks}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Peer Percentile</p>
                        <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                          {leaderboardData.myStanding.percentile}%ile
                        </p>
                        <p className="text-[10px] text-slate-400">NTA Normalized</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Gap to #1 Topper</p>
                        <p className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400 pt-1">
                          {leaderboardData.topper ? (
                            leaderboardData.topper.marks - leaderboardData.myStanding.marks === 0
                              ? '🏆 Tied at Top'
                              : `-${leaderboardData.topper.marks - leaderboardData.myStanding.marks} marks`
                          ) : '—'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {leaderboardData.topper ? `Topper: ${leaderboardData.topper.marks} Mks` : '—'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        You have not attempted this question paper yet. Take the official CBT test now to claim your authentic rank, marks, and percentile on the All-India Leaderboard.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isAuthenticated) {
                            openAuthModal('login', `#/test/${activeTab}/${selectedTestId.split('-').pop()}`);
                          } else if (onSelectTest) {
                            onSelectTest(selectedTestId);
                          } else {
                            window.location.hash = `#/test/${activeTab}/${selectedTestId.split('-').pop()}`;
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                      >
                        Attempt Paper to Enter Leaderboard →
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. FULL RANKED LEADERBOARD TABLE */}
                <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50">
                        Official Rankings ({filteredEntries.length} Ranked)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Sorted by Score (Desc) · Accuracy (Desc) · Time Taken (Asc)
                      </p>
                    </div>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student name..."
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs w-full sm:w-64"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-500 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-3.5">Rank</th>
                          <th className="p-3.5">Student Name</th>
                          <th className="p-3.5 text-center">Marks Scored</th>
                          <th className="p-3.5 text-center">Percentile</th>
                          <th className="p-3.5 text-center">Accuracy</th>
                          <th className="p-3.5 text-right">Time Taken</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-400">
                              <div className="inline-block animate-spin text-2xl pb-2">↻</div>
                              <p>Loading All-India rankings...</p>
                            </td>
                          </tr>
                        ) : filteredEntries.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                              No official test attempts recorded for this paper yet. Be the first to claim Rank #1!
                            </td>
                          </tr>
                        ) : (
                          filteredEntries.map((row) => (
                            <tr
                              key={row.rank + row.displayName}
                              className={`transition-colors ${
                                row.isCurrentUser
                                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-bold'
                                  : 'hover:bg-slate-50 dark:hover:bg-zinc-900/40'
                              }`}
                            >
                              <td className="p-3.5 font-bold font-mono">
                                {row.rank === 1 ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px]">
                                    👑 #1
                                  </span>
                                ) : row.rank === 2 ? (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-300 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-black text-[10px]">
                                    🥈 #2
                                  </span>
                                ) : row.rank === 3 ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-700 text-white font-black text-[10px]">
                                    🥉 #3
                                  </span>
                                ) : (
                                  `#${row.rank}`
                                )}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-900 dark:text-zinc-100">{row.displayName}</span>
                                  {row.isCurrentUser && (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-600 text-white">
                                      You
                                    </span>
                                  )}
                                  {row.attemptedInLiveWindow && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                      Live Window
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5 text-center font-bold font-mono text-slate-900 dark:text-zinc-100">
                                {row.marks} <span className="text-slate-400 font-normal">/ {row.maxMarks}</span>
                              </td>
                              <td className="p-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {row.percentile}%ile
                              </td>
                              <td className="p-3.5 text-center font-mono">
                                {row.accuracy}%
                              </td>
                              <td className="p-3.5 text-right font-mono text-slate-500">
                                {formatSeconds(row.timeTakenSeconds)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: OVERALL PORTAL TOPPERS (ALL TESTS AGGREGATED) */}
        {/* ========================================================================= */}
        {activeTab === 'overall' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                    <span>👑</span> Overall Platform Champions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregated across all official 1st attempts. Ranked by Average Percentile &amp; Participation.
                  </p>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student name..."
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs w-full sm:w-64"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3.5">Overall Rank</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5 text-center">Tests Attempted</th>
                      <th className="p-3.5 text-center">Avg Percentile</th>
                      <th className="p-3.5 text-center">Avg Marks %</th>
                      <th className="p-3.5 text-right">Total Marks Scored</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400">
                          <div className="inline-block animate-spin text-2xl pb-2">↻</div>
                          <p>Aggregating portal champions...</p>
                        </td>
                      </tr>
                    ) : filteredOverall.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                          No multi-test attempt records aggregated yet.
                        </td>
                      </tr>
                    ) : (
                      filteredOverall.map((row) => (
                        <tr
                          key={row.rank + row.displayName}
                          className={`transition-colors ${
                            row.isCurrentUser
                              ? 'bg-amber-50/70 dark:bg-amber-950/30 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-zinc-900/40'
                          }`}
                        >
                          <td className="p-3.5 font-bold font-mono">
                            {row.rank === 1 ? '👑 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-900 dark:text-zinc-100">{row.displayName}</span>
                              {row.isCurrentUser && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-white">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-center font-bold">
                            {row.testsAttempted} Papers
                          </td>
                          <td className="p-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {row.avgPercentile}%ile
                          </td>
                          <td className="p-3.5 text-center font-mono">
                            {row.avgMarksPercent}%
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {row.totalMarksScored} <span className="text-slate-400 font-normal">/ {row.totalMaxMarks}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
