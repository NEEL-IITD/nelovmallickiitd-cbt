// ==============================================================================
// NelovMallickIITD CBT Platform - Private Admin Dashboard (/admin)
// Gated by AdminRoute (profile.role === 'admin')
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentStorage } from '../utils/studentStorage';
import { ErrorReportItem, ErrorReportStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { isCloudConnected } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'reports' | 'students'>('overview');

  // Test configs state
  const [testConfigs, setTestConfigs] = useState<Record<string, 'live' | 'coming_soon'>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    testId: string;
    testCode: string;
    examType: string;
    newStatus: 'live' | 'coming_soon';
    questionCount: number;
  } | null>(null);

  // Error reports state
  const [reports, setReports] = useState<ErrorReportItem[]>([]);
  const [reportFilter, setReportFilter] = useState<'All' | ErrorReportStatus>('All');
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [savedNoteSuccess, setSavedNoteSuccess] = useState<string | null>(null);

  // Students & attempts state
  const [students, setStudents] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [viewAttemptLogs, setViewAttemptLogs] = useState(false);

  // Loading indicator
  const [loading, setLoading] = useState(true);

  // Load admin data on mount
  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load test configs
      const configs = await studentStorage.getTestConfigs();
      setTestConfigs(configs);

      // 2. Load error reports
      const allReports = await studentStorage.getAllErrorReports();
      setReports(allReports);

      // 3. Load students & attempts
      const userList = (window as any).authService?.getAllUsers ? (window as any).authService.getAllUsers() : [];
      setStudents(userList);

      const attemptsList = (window as any).studentStorage?.getAllAttempts ? (window as any).studentStorage.getAllAttempts() : [];
      setAllAttempts(attemptsList);
    } catch (e) {
      console.warn('Error loading admin portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Test catalog definition with local ready question counts
  const jeeMainsList = Array.from({ length: 10 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    const testId = `jee-mains-pta-${num}`;
    return {
      testId,
      code: `PTA ${num}`,
      examType: 'JEE Mains',
      title: `JEE Mains – PTA ${num} Full Syllabus Mock Test`,
      questionCount: 0 // placeholder
    };
  });

  const jeeAdvancedList = Array.from({ length: 10 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    const testId = `jee-advanced-pta-${num}`;
    const readyCount = (num === '04' || num === '05') ? 54 : 0;
    return {
      testId,
      code: `PTA ${num}`,
      examType: 'JEE Advanced',
      title: `JEE Advanced – PTA ${num} Full Syllabus Mock Test`,
      questionCount: readyCount
    };
  });

  // Handle test status toggle
  const handleToggleClick = (test: { testId: string; code: string; examType: string; questionCount: number }) => {
    const currentStatus = testConfigs[test.testId] || 'coming_soon';
    const newStatus = currentStatus === 'live' ? 'coming_soon' : 'live';

    // Show warning if trying to activate a test with 0 questions loaded
    if (newStatus === 'live' && test.questionCount === 0) {
      setConfirmModal({
        isOpen: true,
        testId: test.testId,
        testCode: test.code,
        examType: test.examType,
        newStatus,
        questionCount: test.questionCount
      });
      return;
    }

    applyStatusChange(test.testId, newStatus);
  };

  const applyStatusChange = async (testId: string, status: 'live' | 'coming_soon') => {
    setTestConfigs((prev) => ({ ...prev, [testId]: status }));
    await studentStorage.updateTestConfigStatus(testId, status);
    setConfirmModal(null);
  };

  // Handle report status change
  const handleUpdateReportStatus = async (reportId: string, newStatus: ErrorReportStatus) => {
    await studentStorage.updateErrorReportStatus(reportId, newStatus, adminNotes[reportId]);
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus, adminNote: adminNotes[reportId] || r.adminNote } : r))
    );
  };

  const handleSaveAdminNote = async (reportId: string) => {
    const note = adminNotes[reportId];
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    await studentStorage.updateErrorReportStatus(reportId, report.status, note);
    setSavedNoteSuccess(reportId);
    setTimeout(() => setSavedNoteSuccess(null), 2000);
  };

  // Metrics
  const totalRegistered = Math.max(students.length, 1);
  const totalAttemptsCount = allAttempts.length;
  const liveTestsCount = Object.values(testConfigs).filter((s) => s === 'live').length;
  const openReportsCount = reports.filter((r) => r.status === 'open').length;

  const filteredReports = reports.filter((r) => {
    if (reportFilter === 'All') return true;
    return r.status === reportFilter;
  });

  const filteredStudents = students.filter((s) => {
    if (!studentSearch) return true;
    const term = studentSearch.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 pb-20">
      {/* Top Admin Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#101116] sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-50">
                  Private Admin Dashboard
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Official JEE Test Series Engine · Mentored by <strong>Nelov Mallick (IIT Delhi)</strong>
              </p>
            </div>
          </div>

          {/* Cloud Status Pill & Quick Home Link */}
          <div className="flex items-center gap-3 text-xs">
            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Cloud Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Local Storage Mode
              </span>
            )}
            <a
              href="#/"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Exit to Student View ↗
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 sm:gap-2 overflow-x-auto pt-2">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: '📊' },
            { id: 'tests', label: 'Manage Tests (PTA 01–10)', icon: '📝' },
            { id: 'reports', label: `Error Reports (${openReportsCount})`, icon: '🚩', badge: openReportsCount },
            { id: 'students', label: 'Students & Attempt Logs', icon: '👥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100/50 dark:hover:bg-zinc-800/30'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading && (
          <div className="py-4 text-center text-xs font-bold text-slate-400 animate-pulse">Syncing admin data...</div>
        )}
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-5 shadow-sm space-y-2">
                <span className="text-2xl">👥</span>
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Registered Students
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-zinc-50">
                  {totalRegistered}
                </h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  100% Free Zero-Paywall Access
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-5 shadow-sm space-y-2">
                <span className="text-2xl">📝</span>
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Test Submissions
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-zinc-50">
                  {totalAttemptsCount}
                </h3>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Real CBT Exam Submissions
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-5 shadow-sm space-y-2">
                <span className="text-2xl">🟢</span>
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Live Active Tests
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-zinc-50">
                  {liveTestsCount} <span className="text-sm font-normal text-slate-400">/ 20</span>
                </h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  PTA 04 & PTA 05 Ready
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-5 shadow-sm space-y-2">
                <span className="text-2xl">🚩</span>
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Open Error Reports
                </p>
                <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {openReportsCount}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold">
                  Requires Admin Review
                </p>
              </div>
            </div>

            {/* Test Attempts Bar Chart & Recent Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Card */}
              <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                      <span>📈</span> Test Submissions by PTA Code
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Total candidate submissions per mock test
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Live Data
                  </span>
                </div>

                <div className="w-full overflow-x-auto py-2">
                  <div className="min-w-[480px] h-48 flex items-end gap-6 pt-6 border-b border-slate-200 dark:border-zinc-800">
                    {['PTA 01', 'PTA 02', 'PTA 03', 'PTA 04', 'PTA 05', 'PTA 06', 'PTA 07', 'PTA 08', 'PTA 09', 'PTA 10'].map((pta) => {
                      const count = allAttempts.filter((a) => a.testCode === pta || a.testId?.includes(pta.toLowerCase().replace(' ', ''))).length;
                      const maxAttempts = Math.max(...[1, count]);
                      const heightPct = Math.max(8, (count / (maxAttempts || 1)) * 100);

                      return (
                        <div key={pta} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {count}
                          </span>
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 transition-all shadow-sm"
                          />
                          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                            {pta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <span>⚡</span> Live Activity Feed
                </h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {allAttempts.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No attempts recorded yet.
                    </div>
                  ) : (
                    allAttempts.slice(0, 6).map((att, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 text-xs space-y-1">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-indigo-600 dark:text-indigo-400">{att.testCode} Completed</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {att.completedAt ? new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-zinc-300">
                          Marks: <strong>{att.totalMarksScored}</strong> / {att.totalMaxMarks} ({att.percentage}%)
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Accuracy: {att.accuracy}% · {att.predictedAirDisplay || 'Qualified'}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE TESTS (PTA 01-10) */}
        {activeTab === 'tests' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 p-5 rounded-3xl">
              <div>
                <h3 className="text-base font-black text-indigo-950 dark:text-indigo-200">
                  Dynamic Test Configuration Engine
                </h3>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
                  Toggle tests between <strong>Live Now</strong> and <strong>Coming Soon</strong>. All updates propagate instantly to student dashboards.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs shadow-sm">
                20 Total Mock Exams
              </span>
            </div>

            {/* JEE Advanced Section */}
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50">
                    JEE Advanced Series (PTA 01 – PTA 10)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Multi-Section Format · Negative & Partial Marking · Numerical Grid
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  JEE Advanced
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {jeeAdvancedList.map((test) => {
                  const isLive = testConfigs[test.testId] === 'live';
                  return (
                    <div key={test.testId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                            {test.code}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-zinc-300">
                            — {test.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          {test.questionCount > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              ✓ {test.questionCount} Questions Ready & Derived
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">
                              0 questions loaded (Upload Pending)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isLive
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          {isLive ? 'Live Now' : 'Coming Soon'}
                        </span>

                        {/* Interactive Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleClick(test)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isLive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isLive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* JEE Mains Section */}
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50">
                    JEE Mains Series (PTA 01 – PTA 10)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Standard 300 Marks Format · 75 Questions (Physics, Chemistry, Maths)
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  JEE Mains
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {jeeMainsList.map((test) => {
                  const isLive = testConfigs[test.testId] === 'live';
                  return (
                    <div key={test.testId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                            {test.code}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-zinc-300">
                            — {test.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          0 questions loaded (Upload Pending)
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isLive
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          {isLive ? 'Live Now' : 'Coming Soon'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleClick(test)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isLive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isLive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ERROR REPORTS INBOX */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121318] p-4 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Filter Status:</span>
                {(['All', 'open', 'in_review', 'resolved', 'dismissed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      reportFilter === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'All' ? 'All Reports' : st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Showing {filteredReports.length} of {reports.length} reports
              </span>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-12 text-center space-y-3">
                <span className="text-3xl">🎉</span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                  No Error Reports in this view
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Great job! Questions and answer keys have zero unresolved flags here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {report.examType}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200">
                            {report.testCode}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                            Question #{report.questionNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                            {report.issueType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Reported by <strong className="text-slate-800 dark:text-zinc-200">{report.reporterName}</strong> ({report.reporterEmail || 'No email'}) · {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        report.status === 'open' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        report.status === 'in_review' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                        report.status === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                        'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Student Description */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed">
                      <strong className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 mb-1">
                        Student's Feedback / Counter-Derivation:
                      </strong>
                      {report.description}
                    </div>

                    {/* Admin Note & Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={adminNotes[report.id] !== undefined ? adminNotes[report.id] : (report.adminNote || '')}
                          onChange={(e) => setAdminNotes({ ...adminNotes, [report.id]: e.target.value })}
                          placeholder="Add internal resolution note..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveAdminNote(report.id)}
                          className="px-3 py-2 rounded-xl bg-slate-800 dark:bg-zinc-700 text-white font-bold text-xs"
                        >
                          {savedNoteSuccess === report.id ? 'Saved! ✓' : 'Save Note'}
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateReportStatus(report.id, 'in_review')}
                          className="px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          Mark In Review
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateReportStatus(report.id, 'resolved')}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                        >
                          Mark Resolved ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateReportStatus(report.id, 'dismissed')}
                          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold text-xs hover:bg-slate-100"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDENTS & ATTEMPT LOGS */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search & Toggle Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#121318] p-4 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search registered students by name or email..."
                className="w-full sm:w-80 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs"
              />
              <button
                type="button"
                onClick={() => setViewAttemptLogs(!viewAttemptLogs)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                {viewAttemptLogs ? 'View Student Directory' : 'View Full Exam Attempt Logs'}
              </button>
            </div>

            {!viewAttemptLogs ? (
              /* Students Table */
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Student Candidate</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Target Exam</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Signup Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            No students match your query.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="p-4 font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                                {s.name.slice(0, 2).toUpperCase()}
                              </div>
                              <span>{s.name}</span>
                            </td>
                            <td className="p-4 text-slate-600 dark:text-zinc-300 font-mono">{s.email}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                                {s.targetExam || 'JEE Advanced'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                s.role === 'admin'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                              }`}>
                                {s.role || 'student'}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 font-mono">
                              {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Attempt Logs View */
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Test Code</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Percentage</th>
                        <th className="p-4">Accuracy</th>
                        <th className="p-4">Predicted AIR</th>
                        <th className="p-4">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                      {allAttempts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No attempt logs recorded.
                          </td>
                        </tr>
                      ) : (
                        allAttempts.map((att, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                              {att.testCode || att.testId}
                            </td>
                            <td className="p-4 font-mono font-bold text-slate-900 dark:text-zinc-100">
                              {att.totalMarksScored} / {att.totalMaxMarks}
                            </td>
                            <td className="p-4 font-mono">{att.percentage}%</td>
                            <td className="p-4 font-mono">{att.accuracy}%</td>
                            <td className="p-4 font-bold text-slate-700 dark:text-zinc-300">
                              {att.predictedAirDisplay || 'Qualified'}
                            </td>
                            <td className="p-4 text-slate-400 font-mono">
                              {att.completedAt ? new Date(att.completedAt).toLocaleString() : 'Recent'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Warning Modal (Toggling 0-question test to Live) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-300 dark:border-amber-800/60 bg-white dark:bg-[#121318] p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-zinc-50">
              Activate {confirmModal.testCode} with 0 Questions?
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              <strong>{confirmModal.testCode}</strong> currently has <strong>0 questions</strong> loaded in the active question registry. Activating this test will make it visible to students on the live dashboard with no exam content ready.
            </p>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Are you sure you want to toggle it to Live Now?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => applyStatusChange(confirmModal.testId, 'live')}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md"
              >
                Activate Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
