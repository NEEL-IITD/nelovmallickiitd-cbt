// ==============================================================================
// NelovMallickIITD CBT Platform - Private Admin Dashboard (/admin)
// Complete Visibility for Admin Gmail (Students, Contact Numbers, Attempts, Lectures, Bookmarks, Reports)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentStorage } from '../utils/studentStorage';
import { ErrorReportItem, ErrorReportStatus, LeaderboardResult, TestConfigItem, AdminSubmissionStats } from '../types';
import { canonicalizeAttemptTest } from '../utils/validationSchemas';
import { VaultContentManager } from './vault/VaultContentManager';
import { ExerciseTestShellModal } from './physics/ExerciseTestShellModal';
import { formatISTWindow } from '../hooks/useCountdown';

export const AdminDashboard: React.FC = () => {
  const { isCloudConnected, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attempts' | 'tests' | 'reports' | 'vault' | 'leaderboards'>('overview');
  const [testToLaunch, setTestToLaunch] = useState<any | null>(null);

  // Core Data States
  const [students, setStudents] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [submissionStats, setSubmissionStats] = useState<AdminSubmissionStats | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [allBookmarks, setAllBookmarks] = useState<any[]>([]);
  const [allLectures, setAllLectures] = useState<any[]>([]);
  const [reports, setReports] = useState<ErrorReportItem[]>([]);
  const [testConfigs, setTestConfigs] = useState<Record<string, 'live' | 'coming_soon'>>({});
  const [detailedConfigs, setDetailedConfigs] = useState<Record<string, TestConfigItem>>({});

  // Leaderboard Inspection Tab
  const [adminLeaderboardTestId, setAdminLeaderboardTestId] = useState('jee-advanced-pta-04');
  const [adminLeaderboardData, setAdminLeaderboardData] = useState<LeaderboardResult | null>(null);
  const [adminLeaderboardLoading, setAdminLeaderboardLoading] = useState(false);

  // Schedule Window Modal
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    testId: string;
    code: string;
    title: string;
    isScheduled: boolean;
    startsAt: string;
    endsAt: string;
    windowLabel: string;
    lockLeaderboard: boolean;
    allowPractice: boolean;
  } | null>(null);

  // UI / Filter States
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentAuthFilter, setStudentAuthFilter] = useState<'All' | 'google' | 'gmail' | 'phone' | 'email_with_phone'>('All');
  const [studentExamFilter, setStudentExamFilter] = useState<'All' | 'JEE Mains' | 'JEE Advanced' | 'Both'>('All');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Attempts Tab Filters
  const [attemptSearch, setAttemptSearch] = useState('');
  const [attemptExamFilter, setAttemptExamFilter] = useState<'All' | 'JEE Mains' | 'JEE Advanced' | 'Chapter Exercise'>('All');
  const [attemptCodeFilter, setAttemptCodeFilter] = useState<string>('All');

  // Error Reports Tab States
  const [reportFilter, setReportFilter] = useState<'All' | ErrorReportStatus>('All');
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [savedNoteSuccess, setSavedNoteSuccess] = useState<string | null>(null);

  // Test Configs Toggle Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    testId: string;
    testCode: string;
    examType: string;
    newStatus: 'live' | 'coming_soon';
    questionCount: number;
  } | null>(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    setSupabaseError(null);
    try {
      const [profilesResult, attemptsData, bookmarksData, lecturesData, reportsData, configsData] = await Promise.all([
        studentStorage.getProfilesWithStatus(),
        studentStorage.getAllAttempts(),
        studentStorage.getAllBookmarks(),
        studentStorage.getAllLectureProgress(),
        studentStorage.getAllErrorReports(),
        studentStorage.getTestConfigs()
      ]);

      const attemptsErr = (studentStorage as any)._lastAttemptsError;
      if (profilesResult.error) {
        console.warn('Supabase profiles fetch notice:', profilesResult.error);
        setSupabaseError(profilesResult.error.message || 'Supabase profiles query returned an error or was restricted by RLS.');
      } else if (attemptsErr) {
        setSupabaseError(attemptsErr.message || 'Supabase test_attempts query was restricted or failed.');
      }

      const resolvedAttempts = attemptsData || [];
      setStudents(profilesResult.data || []);
      setAllAttempts(resolvedAttempts);
      setAllBookmarks(bookmarksData || []);
      setAllLectures(lecturesData || []);
      setReports(reportsData || []);
      setTestConfigs(configsData || {});

      const [detailed, stats] = await Promise.all([
        studentStorage.getTestConfigsDetails(),
        studentStorage.getAdminSubmissionStats(resolvedAttempts)
      ]);
      const map: Record<string, TestConfigItem> = {};
      detailed.forEach(d => { map[d.testId] = d; });
      setDetailedConfigs(map);
      setSubmissionStats(stats);
      if (stats.error && !profilesResult.error && !attemptsErr) {
        setSupabaseError(stats.error);
      }
      setLastSyncedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e: any) {
      console.warn('Error loading admin portal data:', e);
      setSupabaseError(e?.message || 'Unexpected error loading data from cloud.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leaderboards') {
      loadAdminLeaderboard(adminLeaderboardTestId);
    }
  }, [activeTab, adminLeaderboardTestId]);

  const loadAdminLeaderboard = async (testId: string) => {
    setAdminLeaderboardLoading(true);
    try {
      const res = await studentStorage.getTestLeaderboard(testId);
      setAdminLeaderboardData(res);
    } catch (e) {
      console.error('Failed to load admin leaderboard:', e);
    } finally {
      setAdminLeaderboardLoading(false);
    }
  };

  const handleSetNextSundayPreset = () => {
    const now = new Date();
    const nextSunday = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 7 : (7 - dayOfWeek);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    
    const year = nextSunday.getFullYear();
    const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
    const day = String(nextSunday.getDate()).padStart(2, '0');

    setScheduleModal(prev => prev ? ({
      ...prev,
      isScheduled: true,
      startsAt: `${year}-${month}-${day}T09:00`,
      endsAt: `${year}-${month}-${day}T14:00`,
      windowLabel: 'Sunday All-India Live Mock'
    }) : null);
  };

  const handleSaveSchedule = async () => {
    if (!scheduleModal) return;
    const startsAtIso = scheduleModal.startsAt ? new Date(scheduleModal.startsAt).toISOString() : null;
    const endsAtIso = scheduleModal.endsAt ? new Date(scheduleModal.endsAt).toISOString() : null;

    const ok = await studentStorage.updateTestSchedule(scheduleModal.testId, {
      is_scheduled_window: scheduleModal.isScheduled,
      starts_at: startsAtIso,
      ends_at: endsAtIso,
      window_label: scheduleModal.windowLabel,
      lock_leaderboard_until_end: scheduleModal.lockLeaderboard,
      allow_practice_after_end: scheduleModal.allowPractice
    });

    if (ok) {
      setDetailedConfigs(prev => ({
        ...prev,
        [scheduleModal.testId]: {
          ...(prev[scheduleModal.testId] || {}),
          testId: scheduleModal.testId,
          code: scheduleModal.code,
          title: scheduleModal.title,
          status: 'live',
          examType: 'JEE Advanced',
          isScheduledWindow: scheduleModal.isScheduled,
          startsAt: startsAtIso,
          endsAt: endsAtIso,
          windowLabel: scheduleModal.windowLabel,
          lockLeaderboardUntilEnd: scheduleModal.lockLeaderboard,
          allowPracticeAfterEnd: scheduleModal.allowPractice
        }
      }));
      setScheduleModal(null);
    }
  };

  const handleClearSchedule = async (testId: string) => {
    const ok = await studentStorage.updateTestSchedule(testId, {
      is_scheduled_window: false,
      starts_at: null,
      ends_at: null,
      window_label: null,
      lock_leaderboard_until_end: false,
      allow_practice_after_end: true
    });
    if (ok) {
      setDetailedConfigs(prev => ({
        ...prev,
        [testId]: {
          ...(prev[testId] || {}),
          isScheduledWindow: false,
          startsAt: null,
          endsAt: null,
          windowLabel: null
        }
      }));
      setScheduleModal(null);
    }
  };

  const handleExportLeaderboardCSV = () => {
    const exportRows = (adminLeaderboardData?.allEntries && adminLeaderboardData.allEntries.length > 0
      ? adminLeaderboardData.allEntries
      : adminLeaderboardData?.entries) || [];
    if (exportRows.length === 0) {
      alert('No leaderboard entries available to export for this test.');
      return;
    }

    const headers = ['Rank', 'Student Name', 'Marks Scored', 'Max Marks', 'Percentage', 'Percentile', 'Accuracy', 'Time Taken (Seconds)', 'Attempted in Live Window', 'Submitted At'];
    const rows = exportRows.map((e) => [
      e.rank,
      `"${e.displayName.replace(/"/g, '""')}"`,
      e.marks,
      e.maxMarks,
      `${e.percentage}%`,
      `${e.percentile}%ile`,
      `${e.accuracy}%`,
      e.timeTakenSeconds,
      e.attemptedInLiveWindow ? 'Yes' : 'No',
      `"${e.submittedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nelov_Leaderboard_${adminLeaderboardTestId}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy contact number with visual feedback
  const handleCopyPhone = (phone: string) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Export Students CSV
  const handleExportStudentsCSV = () => {
    if (students.length === 0) return;

    const headers = ['Full Name', 'Email', 'Contact Number', 'Auth Method', 'Target Exam', 'Role', 'Joined Date', 'Unique Tests Given', 'Total Attempts', 'Tests Breakdown', 'Avg Score %', 'Lectures Completed', 'Bookmarks'];
    const rows = students.map((s) => {
      const studentAttempts = allAttempts.filter((a) => (a.userId === s.id || a.user_id === s.id) || (s.email && (a.studentEmail === s.email || a.email === s.email)));
      const uniqueTests = new Set(studentAttempts.map(a => a.testCode || a.code || a.testId)).size;

      const attemptCountByTest: Record<string, number> = {};
      studentAttempts.forEach(a => {
        const code = a.testCode || a.code || (a.testId ? a.testId.replace('jee-mains-', '').replace('jee-advanced-', '').toUpperCase() : 'Test');
        attemptCountByTest[code] = (attemptCountByTest[code] || 0) + 1;
      });
      const breakdown = Object.entries(attemptCountByTest).map(([c, count]) => `${c} (${count}/3)`).join('; ') || 'No tests yet';

      const studentLectures = allLectures.filter((l) => l.user_id === s.id && l.completed);
      const studentBookmarks = allBookmarks.filter((b) => b.user_id === s.id);
      const avgScore = studentAttempts.length > 0
        ? Math.round(studentAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / studentAttempts.length)
        : 0;

      return [
        `"${(s.full_name || 'Student').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${(s.contact_number || '').replace(/"/g, '""')}"`,
        `"${s.auth_method || (s.contact_number ? 'phone' : 'gmail')}"`,
        `"${s.target_exam || 'JEE Advanced'}"`,
        `"${s.role || 'student'}"`,
        `"${s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}"`,
        uniqueTests,
        studentAttempts.length,
        `"${breakdown}"`,
        `${avgScore}%`,
        studentLectures.length,
        studentBookmarks.length
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nelovmallick_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Catalog definitions: PTM 01-20 for JEE Mains, PTA 01-10 for JEE Advanced
  const jeeMainsList = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    const testId = `jee-mains-ptm-${num}`;
    return {
      testId,
      code: `PTM ${num}`,
      examType: 'JEE Mains',
      title: `JEE Mains – PTM ${num} Full Syllabus Mock Test`,
      questionCount: 0
    };
  });

  const jeeAdvancedList = Array.from({ length: 10 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    const testId = `jee-advanced-pta-${num}`;
    const readyCount = (num === '04' || num === '05' || num === '06') ? 54 : 0;
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

  // Error Report Actions
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
  const totalStudents = students.length;
  const gmailStudentsCount = students.filter(
    (s) => s.auth_method === 'google' || s.auth_method === 'gmail' || (s.email && s.email.includes('@gmail.com'))
  ).length;
  const phoneStudentsCount = students.filter(
    (s) => s.auth_method === 'phone' || (!s.email && s.contact_number)
  ).length;
  const nonGmailPhoneCount = students.filter(
    (s) => s.auth_method === 'email_with_phone'
  ).length;

  const studentCompletedAttempts = allAttempts.filter((a) => !a.isAdminAttempt && a.status !== 'in_progress');
  const uniqueSubmissionPairsFallback = new Set<string>();
  const mockUniquePairsFallback = new Set<string>();
  const chapterUniquePairsFallback = new Set<string>();
  studentCompletedAttempts.forEach((a) => {
    const canon = canonicalizeAttemptTest(a.testId, a.testCode || a.code, a.examType);
    const uid = String(a.userId || a.user_id || a.studentEmail || a.id);
    if (uid) {
      const pairKey = `${uid}::${canon.testId}`;
      uniqueSubmissionPairsFallback.add(pairKey);
      if ((a.testType || canon.testType) === 'chapter_exercise') {
        chapterUniquePairsFallback.add(pairKey);
      } else {
        mockUniquePairsFallback.add(pairKey);
      }
    }
  });
  const totalAttemptsCount = submissionStats ? submissionStats.completedTotal : studentCompletedAttempts.length;
  const uniqueSubmissionsCount = submissionStats ? submissionStats.uniqueSubmissionsTotal : uniqueSubmissionPairsFallback.size;
  const uniqueStudentsSubmitting = submissionStats
    ? submissionStats.uniqueStudentsTotal
    : new Set(studentCompletedAttempts.map((a) => a.userId || a.user_id || a.id)).size;
  const mockUniqueCount = submissionStats ? submissionStats.mockUniqueSubmissions : mockUniquePairsFallback.size;
  const chapterUniqueCount = submissionStats ? submissionStats.chapterUniqueSubmissions : chapterUniquePairsFallback.size;
  const inProgressCount = submissionStats ? submissionStats.inProgressCount : 0;
  const adminPreviewCount = submissionStats ? submissionStats.adminPreviewCount : allAttempts.filter((a) => a.isAdminAttempt).length;
  const liveTestsCount = Object.values(testConfigs).filter((s) => s === 'live').length;
  const openReportsCount = reports.filter((r) => r.status === 'open').length;
  const totalLecturesCompleted = allLectures.filter((l) => l.completed).length;
  const totalBookmarksCount = allBookmarks.length;

  const perTestBreakdownMap = React.useMemo(() => {
    const map: Record<string, { code: string; testType: 'mock' | 'chapter_exercise'; completedCount: number; uniqueStudents: number }> = {};
    if (submissionStats && Array.isArray(submissionStats.byTest) && submissionStats.byTest.length > 0) {
      submissionStats.byTest.forEach((b) => {
        map[b.testId] = {
          code: b.code,
          testType: b.testType,
          completedCount: b.completedCount,
          uniqueStudents: b.uniqueStudents
        };
      });
      return map;
    }
    const uniqueSets: Record<string, Set<string>> = {};
    studentCompletedAttempts.forEach((a) => {
      const canon = canonicalizeAttemptTest(a.testId, a.testCode || a.code, a.examType);
      const tType = a.testType || canon.testType;
      if (!map[canon.testId]) {
        map[canon.testId] = { code: canon.code, testType: tType, completedCount: 0, uniqueStudents: 0 };
        uniqueSets[canon.testId] = new Set();
      }
      map[canon.testId].completedCount += 1;
      const uid = a.userId || a.user_id || a.id;
      if (uid) uniqueSets[canon.testId].add(uid);
      map[canon.testId].uniqueStudents = uniqueSets[canon.testId].size;
    });
    return map;
  }, [submissionStats, allAttempts]);

  const seriesBreakdownRows = React.useMemo(() => {
    const baseCodes = [
      { testId: 'jee-mains-ptm-01', code: 'PTM 01', testType: 'mock' as const },
      { testId: 'jee-mains-ptm-02', code: 'PTM 02', testType: 'mock' as const },
      { testId: 'jee-mains-ptm-03', code: 'PTM 03', testType: 'mock' as const },
      { testId: 'jee-mains-ptm-04', code: 'PTM 04', testType: 'mock' as const },
      { testId: 'jee-mains-ptm-05', code: 'PTM 05', testType: 'mock' as const },
      { testId: 'jee-advanced-pta-04', code: 'PTA 04', testType: 'mock' as const },
      { testId: 'jee-advanced-pta-05', code: 'PTA 05', testType: 'mock' as const },
      { testId: 'jee-advanced-pta-06', code: 'PTA 06', testType: 'mock' as const }
    ];
    const seen = new Set(baseCodes.map((b) => b.testId));
    const extras = Object.entries(perTestBreakdownMap)
      .filter(([tid, val]) => !seen.has(tid) && (val.uniqueStudents > 0 || val.testType === 'chapter_exercise'))
      .map(([tid, val]) => ({ testId: tid, code: val.code, testType: val.testType }));
    return [...baseCodes, ...extras].map((item) => {
      const hit = perTestBreakdownMap[item.testId];
      return {
        ...item,
        completedCount: hit ? hit.completedCount : 0,
        uniqueStudents: hit ? hit.uniqueStudents : 0
      };
    });
  }, [perTestBreakdownMap]);

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    if (studentSearch) {
      const term = studentSearch.toLowerCase();
      const matchName = (s.full_name || '').toLowerCase().includes(term);
      const matchEmail = (s.email || '').toLowerCase().includes(term);
      const matchContact = (s.contact_number || '').replace(/\s+/g, '').includes(term.replace(/\s+/g, ''));
      if (!matchName && !matchEmail && !matchContact) return false;
    }
    if (studentAuthFilter !== 'All') {
      const m = s.auth_method || (s.contact_number && !s.email ? 'phone' : 'gmail');
      if (studentAuthFilter === 'google' || studentAuthFilter === 'gmail') {
        if (m !== 'google' && m !== 'gmail' && !(s.email && s.email.includes('@gmail.com'))) return false;
      } else if (studentAuthFilter === 'phone') {
        if (m !== 'phone' && !(s.contact_number && !s.email)) return false;
      } else if (studentAuthFilter === 'email_with_phone') {
        if (m !== 'email_with_phone') return false;
      } else if (m !== studentAuthFilter) {
        return false;
      }
    }
    if (studentExamFilter !== 'All') {
      if (s.target_exam !== studentExamFilter) return false;
    }
    return true;
  });

  // Filtered Attempts (strictly completed student submissions)
  const filteredAttempts = studentCompletedAttempts.filter((a) => {
    if (attemptSearch) {
      const term = attemptSearch.toLowerCase();
      const matchName = (a.studentName || '').toLowerCase().includes(term);
      const matchEmail = (a.studentEmail || '').toLowerCase().includes(term);
      const matchContact = (a.studentContact || '').replace(/\s+/g, '').includes(term.replace(/\s+/g, ''));
      const matchCode = (a.testCode || '').toLowerCase().includes(term);
      if (!matchName && !matchEmail && !matchContact && !matchCode) return false;
    }
    if (attemptExamFilter !== 'All') {
      if (attemptExamFilter === 'Chapter Exercise') {
        if (a.testType !== 'chapter_exercise') return false;
      } else if (a.examType !== attemptExamFilter) {
        return false;
      }
    }
    if (attemptCodeFilter !== 'All' && a.testCode !== attemptCodeFilter && a.testId !== attemptCodeFilter) return false;
    return true;
  });

  // Filtered Reports
  const filteredReports = reports.filter((r) => {
    if (reportFilter === 'All') return true;
    return r.status === reportFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-zinc-50 pb-20">
      {/* Top Admin Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#101116] sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold shadow-sm">
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
                Logged in as <strong>{user?.email || 'Admin'}</strong> · Single Attribution to <strong>Nelov Mallick (IIT Delhi)</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2.5 text-xs flex-wrap">
            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <span className={loading ? 'animate-spin' : ''}>🔄</span>
              <span>Refresh</span>
            </button>

            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Cloud
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Local Mode
              </span>
            )}

            <a
              href="#/"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity"
            >
              Exit to Portal ↗
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-zinc-800/80 pt-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'vault', label: 'Vault Exercises & Theory', icon: '⚡' },
            { id: 'students', label: `All Students (${totalStudents})`, icon: '👥' },
            { id: 'attempts', label: `Test Attempts (${totalAttemptsCount})`, icon: '📝' },
            { id: 'tests', label: `Manage Tests (${liveTestsCount}/30 Live)`, icon: '⚙️' },
            { id: 'leaderboards', label: 'Live Leaderboards', icon: '🏆' },
            { id: 'reports', label: `Error Reports (${openReportsCount} Open)`, icon: '⚠️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 font-bold text-xs whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loading && (
          <div className="py-8 text-center text-xs font-bold text-slate-400 animate-pulse">
            Syncing real-time admin portal data from Supabase...
          </div>
        )}

        {/* Supabase Cloud Connection / RLS Warning Banner */}
        {supabaseError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">Database Connection Notice</p>
                <p className="text-xs">{supabaseError} — Showing local/cached records if available.</p>
              </div>
            </div>
            <button
              onClick={() => loadAllAdminData()}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>↻</span> Retry Supabase Sync
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* 6 Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Total Students */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-xl">👥</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">Total Students</p>
                <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{totalStudents}</p>
                <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                  <span className="block text-indigo-600 dark:text-indigo-400 font-bold">✉️ {gmailStudentsCount} Gmail/Google</span>
                  <span className="block text-emerald-600 dark:text-emerald-400 font-bold">📱 {phoneStudentsCount} Contact Only</span>
                  {nonGmailPhoneCount > 0 && <span className="block text-amber-600 dark:text-amber-400">📧 {nonGmailPhoneCount} Email+Phone</span>}
                </div>
              </div>

              {/* Unique Test Submissions Stat Card (COUNT(DISTINCT (user_id, test_id))) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-xl">📝</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">Unique Submissions</p>
                <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{uniqueSubmissionsCount}</p>
                <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                  <span className="block text-indigo-600 dark:text-indigo-400 font-bold">{uniqueStudentsSubmitting} Students · Mocks: {mockUniqueCount} · Ch: {chapterUniqueCount}</span>
                  {(totalAttemptsCount > uniqueSubmissionsCount || inProgressCount > 0 || adminPreviewCount > 0) && (
                    <span className="block text-amber-600 dark:text-amber-400">
                      {totalAttemptsCount > uniqueSubmissionsCount ? `${totalAttemptsCount - uniqueSubmissionsCount} retakes` : ''}
                      {totalAttemptsCount > uniqueSubmissionsCount && (inProgressCount > 0 || adminPreviewCount > 0) ? ' · ' : ''}
                      {inProgressCount > 0 ? `${inProgressCount} drafts` : ''}
                      {inProgressCount > 0 && adminPreviewCount > 0 ? ' · ' : ''}
                      {adminPreviewCount > 0 ? `${adminPreviewCount} admin` : ''} excluded
                    </span>
                  )}
                </div>
              </div>

              {/* Total Lectures Completed */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-xl">🎥</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">Lectures Finished</p>
                <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{totalLecturesCompleted}</p>
                <p className="text-[10px] text-slate-400 pt-1">Across 20+ Masterclasses</p>
              </div>

              {/* Total Bookmarks */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-xl">⭐</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">Total Bookmarks</p>
                <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{totalBookmarksCount}</p>
                <p className="text-[10px] text-slate-400 pt-1">In Revision Notebooks</p>
              </div>

              {/* Live Tests */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-xl">🚀</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">Live Mock Tests</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{liveTestsCount} / 30</p>
                <p className="text-[10px] text-slate-400 pt-1">PTM 01–05 &amp; PTA 04–06</p>
              </div>

              {/* Open Reports */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-xl">⚠️</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">Open Reports</p>
                <p className={`text-2xl font-black ${openReportsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-zinc-100'}`}>
                  {openReportsCount}
                </p>
                <p className="text-[10px] text-slate-400 pt-1">Requiring mentor review</p>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Chart 1: Unique Submissions per Test (COUNT(DISTINCT user_id)) & Chapter Exercises */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">Unique Submissions by Test</h3>
                    <p className="text-[11px] text-slate-400">
                      Distinct students (PTM 01–05, PTA 04–06 &amp; Chapter Exercises){lastSyncedAt ? ` · Synced ${lastSyncedAt}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadAllAdminData}
                    disabled={loading}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    {loading ? '↻ Syncing...' : '↻ Refresh Live'}
                  </button>
                </div>

                <div className="space-y-2.5 pt-2 max-h-72 overflow-y-auto pr-1">
                  {seriesBreakdownRows.map((row) => {
                    const max = Math.max(...seriesBreakdownRows.map((r) => r.uniqueStudents), 1);
                    const pct = Math.round((row.uniqueStudents / max) * 100);

                    return (
                      <div key={row.testId} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-zinc-300 gap-2">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="truncate">{row.code}</span>
                            {row.testType === 'chapter_exercise' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                Ch. Ex
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 font-mono text-[11px]">
                            {row.uniqueStudents} {row.uniqueStudents === 1 ? 'unique student' : 'unique students'}
                            {row.completedCount > row.uniqueStudents ? ` (${row.completedCount} attempts)` : ''}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              row.testType === 'chapter_exercise'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : 'bg-gradient-to-r from-indigo-500 to-violet-600'
                            }`}
                            style={{ width: `${Math.max(pct, row.uniqueStudents > 0 ? 8 : 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Auth Methods Breakdown */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">Student Access Distribution</h3>
                    <p className="text-[11px] text-slate-400">Breakdown of registration and login modes</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    100% Free
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xl">✉️</span>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{gmailStudentsCount}</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">Gmail / Google</p>
                    <p className="text-[9px] text-slate-400">Phone Optional</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xl">📱</span>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{phoneStudentsCount}</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">Contact Number</p>
                    <p className="text-[9px] text-slate-400">No Email Required</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xl">📧</span>
                    <p className="text-xl font-black text-amber-600 dark:text-amber-400">{nonGmailPhoneCount}</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">Email + Phone</p>
                    <p className="text-[9px] text-slate-400">Mandatory Phone</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
                  💡 <strong>Mentor Insight:</strong> All student accounts (whether Gmail or Contact Number) have full access to PTA mock tests, partial marking evaluations, and lecture notes with zero paywalls.
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Latest Signups */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span>👥</span> Latest Student Signups
                  </h4>
                  <button onClick={() => setActiveTab('students')} className="text-[11px] font-bold text-indigo-600 hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {students.slice(0, 5).map((s, idx) => (
                    <div key={s.id || idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-zinc-900">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-zinc-200">{s.full_name || 'Student Aspirant'}</p>
                        <p className="text-[10px] text-slate-400">{s.email || s.contact_number || 'Direct Access'}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {s.target_exam || 'JEE'}
                      </span>
                    </div>
                  ))}
                  {students.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No students registered yet.</p>}
                </div>
              </div>

              {/* Latest Test Attempts */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span>📝</span> Recent Test Submissions
                  </h4>
                  <button onClick={() => setActiveTab('attempts')} className="text-[11px] font-bold text-indigo-600 hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {studentCompletedAttempts.slice(0, 5).map((a, idx) => (
                    <div key={a.id || idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-zinc-900">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-zinc-200">{a.studentName || 'Student'}</p>
                        <p className="text-[10px] text-slate-400">{a.testCode || a.code} · {a.obtainedMarks || 0}/{a.totalMarks || 180}</p>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        {a.percentage || 0}%
                      </span>
                    </div>
                  ))}
                  {studentCompletedAttempts.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No attempts submitted yet.</p>}
                </div>
              </div>

              {/* Latest Error Reports */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span>⚠️</span> Academic Issue Reports
                  </h4>
                  <button onClick={() => setActiveTab('reports')} className="text-[11px] font-bold text-indigo-600 hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {reports.slice(0, 5).map((r) => (
                    <div key={r.id} className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-zinc-200">{r.reporterName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${r.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {r.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{r.testCode} Q#{r.questionNumber}: {r.description}</p>
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No error reports filed.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: ALL STUDENTS DIRECTORY */}
        {/* ==================================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Search, Filter & Export Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
              <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by Name, Gmail, or Contact Number..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                </div>

                {/* Filter by Auth Method */}
                <select
                  value={studentAuthFilter}
                  onChange={(e) => setStudentAuthFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="All">All Auth Methods</option>
                  <option value="google">Google OAuth</option>
                  <option value="gmail">Gmail Email</option>
                  <option value="phone">Name + Contact Number</option>
                  <option value="email_with_phone">Email + Phone</option>
                </select>

                {/* Filter by Exam */}
                <select
                  value={studentExamFilter}
                  onChange={(e) => setStudentExamFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="All">All Target Exams</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="JEE Mains">JEE Mains</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <button
                onClick={handleExportStudentsCSV}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>📥</span>
                <span>Export Students CSV</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Gmail / Email</th>
                      <th className="py-3.5 px-4">Contact Number</th>
                      <th className="py-3.5 px-4">Auth Method</th>
                      <th className="py-3.5 px-4">Target</th>
                      <th className="py-3.5 px-4 text-center">Unique Tests</th>
                      <th className="py-3.5 px-4 text-center">Total Attempts</th>
                      <th className="py-3.5 px-4">Tests Breakdown</th>
                      <th className="py-3.5 px-4 text-center">Avg %</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {filteredStudents.map((s) => {
                      const sAttempts = allAttempts.filter((a) => (a.userId === s.id || a.user_id === s.id) || (s.email && (a.studentEmail === s.email || a.email === s.email)));
                      const uniqueCount = new Set(sAttempts.map(a => a.testCode || a.code || a.testId)).size;
                      const testCountMap: Record<string, number> = {};
                      sAttempts.forEach(a => {
                        const code = a.testCode || a.code || (a.testId ? a.testId.replace('jee-mains-', '').replace('jee-advanced-', '').toUpperCase() : 'Test');
                        testCountMap[code] = (testCountMap[code] || 0) + 1;
                      });
                      const breakdownBadges = Object.entries(testCountMap).map(([tCode, count]) => ({
                        code: tCode,
                        label: `${tCode} (${count}/3)`
                      }));

                      const avgPct = sAttempts.length > 0
                        ? Math.round(sAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / sAttempts.length)
                        : 0;

                      const authMethodBadge = s.auth_method === 'phone' || (!s.email && s.contact_number)
                        ? { label: '📱 Contact', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' }
                        : s.auth_method === 'google'
                        ? { label: '🔵 Google', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300' }
                        : s.auth_method === 'email_with_phone'
                        ? { label: '📧 Email+Phone', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' }
                        : { label: '✉️ Gmail', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300' };

                      return (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center flex-shrink-0">
                                {(s.full_name || 'S').substring(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 dark:text-zinc-100">{s.full_name || 'Student Aspirant'}</p>
                                <p className="text-[10px] text-slate-400">
                                  Joined {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Active'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-zinc-300">
                            {s.email ? s.email : <span className="text-slate-400 italic">None (Contact Only)</span>}
                          </td>

                          {/* Contact Number with One-Click Copy */}
                          <td className="py-3.5 px-4">
                            {s.contact_number ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{s.contact_number}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyPhone(s.contact_number)}
                                  className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-[11px]"
                                  title="Copy contact number"
                                >
                                  {copiedPhone === s.contact_number ? '✓' : '📋'}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Optional (Not set)</span>
                            )}
                          </td>

                          {/* Auth Method */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${authMethodBadge.color}`}>
                              {authMethodBadge.label}
                            </span>
                          </td>

                          {/* Target Exam */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-700 dark:text-zinc-300">{s.target_exam || 'JEE Advanced'}</span>
                          </td>

                          {/* Unique Tests */}
                          <td className="py-3.5 px-4 text-center font-bold font-mono">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${uniqueCount > 0 ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' : 'text-slate-400'}`}>
                              {uniqueCount} {uniqueCount === 1 ? 'Test' : 'Tests'}
                            </span>
                          </td>

                          {/* Total Attempts */}
                          <td className="py-3.5 px-4 text-center font-bold font-mono">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${sAttempts.length > 0 ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'text-slate-400'}`}>
                              {sAttempts.length}
                            </span>
                          </td>

                          {/* Tests Breakdown Badges */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                              {breakdownBadges.length === 0 ? (
                                <span className="text-[10px] text-slate-400 italic">No tests yet</span>
                              ) : (
                                breakdownBadges.map((b, bIdx) => (
                                  <span
                                    key={bIdx}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                                  >
                                    {b.label}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>

                          {/* Avg Score */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`font-extrabold ${avgPct >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                              {sAttempts.length > 0 ? `${avgPct}%` : '—'}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors"
                            >
                              Inspect Details →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No matching student records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: ALL TEST ATTEMPTS */}
        {/* ==================================================================== */}
        {activeTab === 'attempts' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={attemptSearch}
                  onChange={(e) => setAttemptSearch(e.target.value)}
                  placeholder="Search by student name, contact, or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              </div>

              <select
                value={attemptExamFilter}
                onChange={(e) => setAttemptExamFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-300"
              >
                <option value="All">All Exam Types</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="JEE Mains">JEE Mains</option>
                <option value="Chapter Exercise">Chapter Exercises</option>
              </select>

              <select
                value={attemptCodeFilter}
                onChange={(e) => setAttemptCodeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-300"
              >
                <option value="All">All Test Codes</option>
                <option value="PTM 01">PTM 01</option>
                <option value="PTM 02">PTM 02</option>
                <option value="PTM 03">PTM 03</option>
                <option value="PTM 04">PTM 04</option>
                <option value="PTM 05">PTM 05</option>
                <option value="PTA 04">PTA 04</option>
                <option value="PTA 05">PTA 05</option>
                <option value="PTA 06">PTA 06</option>
              </select>
            </div>

            {/* Attempts Table */}
            <div className="rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Contact / Gmail</th>
                      <th className="py-3.5 px-4">Test Code</th>
                      <th className="py-3.5 px-4 text-center">Attempt #</th>
                      <th className="py-3.5 px-4 text-center">Score</th>
                      <th className="py-3.5 px-4 text-center">Percentage</th>
                      <th className="py-3.5 px-4 text-center">Accuracy</th>
                      <th className="py-3.5 px-4 text-center">Predicted AIR</th>
                      <th className="py-3.5 px-4 text-right">Submitted At (IST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {filteredAttempts.map((a, idx) => {
                      const userAttsThisTest = allAttempts
                        .filter(x => ((x.userId || x.user_id) === (a.userId || a.user_id)) && ((x.testCode || x.code || x.testId) === (a.testCode || a.code || a.testId)))
                        .sort((x, y) => new Date(x.submittedAt || x.completedAt).getTime() - new Date(y.submittedAt || y.completedAt).getTime());
                      const attemptNum = Math.max(1, userAttsThisTest.findIndex(x => x.id === a.id) + 1);

                      return (
                        <tr key={a.id || idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-zinc-100">
                            {a.studentName || 'Student Aspirant'}
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                            {a.studentContact || a.studentEmail || 'Direct'}
                          </td>
                          <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                            {a.testCode || a.code}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {attemptNum} of 3
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {a.obtainedMarks || 0} / {a.totalMarks || 300}
                          </td>
                          <td className="py-3 px-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400">
                            {a.percentage || 0}%
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-zinc-300">
                            {a.accuracy || 0}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              {a.estimatedRankLabel || a.predictedAirDisplay || 'AIR Qualified'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 text-[11px] font-mono">
                            {a.submittedAt ? new Date(a.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST' : 'Recent'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredAttempts.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No matching test attempt records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: MANAGE TESTS (PTM 01-10 & PTA 01-10) */}
        {/* ==================================================================== */}
        {activeTab === 'tests' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
              ⚡ <strong>Instant Test Status Control:</strong> Toggle any mock test between <code>Live</code> and <code>Coming Soon</code>. Status changes reflect immediately for all students across the country in real-time.
            </div>

            {/* JEE Advanced Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <span>🎯</span> JEE Advanced Mock Tests (PTA 01 – PTA 10)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {jeeAdvancedList.map((test) => {
                  const status = testConfigs[test.testId] || (test.questionCount > 0 ? 'live' : 'coming_soon');
                  const isLive = status === 'live';
                  const detailed = detailedConfigs[test.testId];
                  const isSched = !!detailed?.isScheduledWindow;
                  const nowMs = Date.now();
                  const sTime = detailed?.startsAt ? new Date(detailed.startsAt).getTime() : 0;
                  const eTime = detailed?.endsAt ? new Date(detailed.endsAt).getTime() : 0;
                  let schedBadge = 'Always Open';
                  let schedBadgeClass = 'bg-slate-100 dark:bg-zinc-800 text-slate-500';
                  if (isSched) {
                    if (sTime > 0 && nowMs < sTime) {
                      schedBadge = 'Scheduled Window';
                      schedBadgeClass = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
                    } else if (sTime > 0 && eTime > 0 && nowMs >= sTime && nowMs <= eTime) {
                      schedBadge = '🔴 LIVE NOW';
                      schedBadgeClass = 'bg-rose-600 text-white animate-pulse';
                    } else if (eTime > 0 && nowMs > eTime) {
                      schedBadge = 'Window Closed';
                      schedBadgeClass = 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300';
                    }
                  }

                  return (
                    <div key={test.testId} className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-zinc-100">{test.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${isLive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                            {isLive ? 'LIVE' : 'COMING SOON'}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 mt-1">{test.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{test.questionCount > 0 ? `${test.questionCount} Questions Verified` : 'Draft / Template'}</p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleToggleClick(test)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            isLive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          {isLive ? 'Deactivate (Coming Soon)' : 'Make Live 🚀'}
                        </button>

                        <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-100 dark:border-zinc-800/80">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">Schedule:</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${schedBadgeClass}`}>{schedBadge}</span>
                          </div>
                          {isSched && detailed?.startsAt && (
                            <p className="text-[10px] text-slate-500 truncate">{formatISTWindow(detailed.startsAt, detailed.endsAt)}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const d = detailedConfigs[test.testId];
                              setScheduleModal({
                                isOpen: true,
                                testId: test.testId,
                                code: test.code,
                                title: test.title,
                                isScheduled: d?.isScheduledWindow || false,
                                startsAt: d?.startsAt ? new Date(d.startsAt).toISOString().substring(0, 16) : '',
                                endsAt: d?.endsAt ? new Date(d.endsAt).toISOString().substring(0, 16) : '',
                                windowLabel: d?.windowLabel || 'Sunday All-India Live Mock',
                                lockLeaderboard: d?.lockLeaderboardUntilEnd ?? false,
                                allowPractice: d?.allowPracticeAfterEnd ?? true
                              });
                            }}
                            className="w-full py-1.5 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>📅</span> Schedule Window
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* JEE Mains Grid */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <span>🎯</span> JEE Mains Mock Tests (PTM 01 – PTM 10)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {jeeMainsList.map((test) => {
                  const status = testConfigs[test.testId] || 'coming_soon';
                  const isLive = status === 'live';
                  const detailed = detailedConfigs[test.testId];
                  const isSched = !!detailed?.isScheduledWindow;
                  const nowMs = Date.now();
                  const sTime = detailed?.startsAt ? new Date(detailed.startsAt).getTime() : 0;
                  const eTime = detailed?.endsAt ? new Date(detailed.endsAt).getTime() : 0;
                  let schedBadge = 'Always Open';
                  let schedBadgeClass = 'bg-slate-100 dark:bg-zinc-800 text-slate-500';
                  if (isSched) {
                    if (sTime > 0 && nowMs < sTime) {
                      schedBadge = 'Scheduled Window';
                      schedBadgeClass = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
                    } else if (sTime > 0 && eTime > 0 && nowMs >= sTime && nowMs <= eTime) {
                      schedBadge = '🔴 LIVE NOW';
                      schedBadgeClass = 'bg-rose-600 text-white animate-pulse';
                    } else if (eTime > 0 && nowMs > eTime) {
                      schedBadge = 'Window Closed';
                      schedBadgeClass = 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300';
                    }
                  }

                  return (
                    <div key={test.testId} className="p-4 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-zinc-100">{test.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${isLive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                            {isLive ? 'LIVE' : 'COMING SOON'}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 mt-1">{test.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">JEE Mains Format</p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleToggleClick(test)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            isLive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          {isLive ? 'Deactivate (Coming Soon)' : 'Make Live 🚀'}
                        </button>

                        <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-100 dark:border-zinc-800/80">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">Schedule:</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${schedBadgeClass}`}>{schedBadge}</span>
                          </div>
                          {isSched && detailed?.startsAt && (
                            <p className="text-[10px] text-slate-500 truncate">{formatISTWindow(detailed.startsAt, detailed.endsAt)}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const d = detailedConfigs[test.testId];
                              setScheduleModal({
                                isOpen: true,
                                testId: test.testId,
                                code: test.code,
                                title: test.title,
                                isScheduled: d?.isScheduledWindow || false,
                                startsAt: d?.startsAt ? new Date(d.startsAt).toISOString().substring(0, 16) : '',
                                endsAt: d?.endsAt ? new Date(d.endsAt).toISOString().substring(0, 16) : '',
                                windowLabel: d?.windowLabel || 'Sunday All-India Live Mock',
                                lockLeaderboard: d?.lockLeaderboardUntilEnd ?? false,
                                allowPractice: d?.allowPracticeAfterEnd ?? true
                              });
                            }}
                            className="w-full py-1.5 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>📅</span> Schedule Window
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB: LIVE LEADERBOARDS INSPECTION & CSV EXPORT */}
        {/* ==================================================================== */}
        {activeTab === 'leaderboards' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>🏆 Live CBT Leaderboards &amp; All-India Rankings</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    Admin Inspector
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Real-time official rankings (ranked by highest marks), percentiles, accuracy, and pacing for any paper. Accessible even while test windows are locked.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportLeaderboardCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>📥</span> Export Leaderboard CSV
                </button>
              </div>
            </div>

            {/* Test Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {[...jeeAdvancedList, ...jeeMainsList].map((t) => (
                <button
                  key={t.testId}
                  onClick={() => setAdminLeaderboardTestId(t.testId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    adminLeaderboardTestId === t.testId
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-[#121318] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  {t.code}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                    Leaderboard: {adminLeaderboardTestId} ({adminLeaderboardData?.totalParticipants || 0} Participants)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Highest Marks: {adminLeaderboardData?.highestMarks || 0} · Average: {adminLeaderboardData?.averageMarks || 0}
                  </p>
                </div>
                {adminLeaderboardData?.locked && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    🔒 Window Locked for Students
                  </span>
                )}
              </div>

              {/* Top 5 Performers Showcase in Admin */}
              {((adminLeaderboardData?.allEntries?.length ? adminLeaderboardData.allEntries : adminLeaderboardData?.entries) || []).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                  {((adminLeaderboardData?.allEntries?.length ? adminLeaderboardData.allEntries : adminLeaderboardData?.entries) || []).slice(0, 5).map((entry, idx) => (
                    <div
                      key={entry.rank}
                      className={`p-3.5 rounded-2xl border ${
                        idx === 0
                          ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 ring-2 ring-amber-400/20'
                          : idx === 1
                          ? 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/40'
                          : idx === 2
                          ? 'border-amber-700/40 bg-amber-50/40 dark:bg-amber-950/10'
                          : 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/10'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {idx === 0 ? '👑 Rank 1' : idx === 1 ? '🥈 Rank 2' : idx === 2 ? '🥉 Rank 3' : `🎖️ Rank ${idx + 1}`}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {entry.percentile}%ile
                        </span>
                      </div>
                      <p className="font-extrabold text-xs text-slate-900 dark:text-zinc-100 truncate">
                        {entry.displayName}
                      </p>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {entry.marks} / {entry.maxMarks} Mks
                        </span>
                        <span className="text-slate-400">{entry.accuracy}% Acc</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3 text-center">Marks Scored</th>
                      <th className="p-3 text-center">Percentile</th>
                      <th className="p-3 text-center">Accuracy</th>
                      <th className="p-3 text-right">Time Taken</th>
                      <th className="p-3 text-right">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {adminLeaderboardLoading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">Loading rankings...</td>
                      </tr>
                    ) : ((adminLeaderboardData?.allEntries?.length ? adminLeaderboardData.allEntries : adminLeaderboardData?.entries) || []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 italic">No attempt entries recorded for this paper yet.</td>
                      </tr>
                    ) : (
                      ((adminLeaderboardData?.allEntries?.length ? adminLeaderboardData.allEntries : adminLeaderboardData?.entries) || []).map((row) => (
                        <tr key={row.rank + row.displayName} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                          <td className="p-3 font-mono font-bold">
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
                            ) : row.rank === 4 ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-black text-[10px]">
                                🎖️ #4
                              </span>
                            ) : row.rank === 5 ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-black text-[10px]">
                                🎖️ #5
                              </span>
                            ) : (
                              `#${row.rank}`
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-zinc-100">
                            {row.displayName}
                            {row.attemptedInLiveWindow && (
                              <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">
                                Live Window
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono font-bold">{row.marks} / {row.maxMarks}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600">{row.percentile}%ile</td>
                          <td className="p-3 text-center font-mono">{row.accuracy}%</td>
                          <td className="p-3 text-right font-mono text-slate-500">{row.timeTakenSeconds ? `${Math.round(row.timeTakenSeconds / 60)}m` : '—'}</td>
                          <td className="p-3 text-right text-slate-400 text-[11px]">{new Date(row.submittedAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: ERROR REPORTS INBOX */}
        {/* ==================================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['All', 'open', 'in_review', 'resolved', 'dismissed'] as ('All' | ErrorReportStatus)[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setReportFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize transition-colors ${
                    reportFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {st === 'All' ? `All (${reports.length})` : `${st.replace('_', ' ')} (${reports.filter((r) => r.status === st).length})`}
                </button>
              ))}
            </div>

            {/* Reports List */}
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-zinc-100">
                        {report.testCode} · Question #{report.questionNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {report.issueType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">{new Date(report.createdAt).toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        report.status === 'open' ? 'bg-amber-100 text-amber-700' :
                        report.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
                        report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Reporter details with Contact Number */}
                  <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-zinc-900 p-2.5 rounded-xl flex-wrap">
                    <span className="font-bold text-slate-700 dark:text-zinc-300">Reporter: {report.reporterName}</span>
                    {report.reporterEmail && <span className="text-slate-400">✉️ {report.reporterEmail}</span>}
                    {report.reporterContactNumber && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span>📱 {report.reporterContactNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(report.reporterContactNumber!)}
                          className="hover:text-emerald-800"
                          title="Copy contact"
                        >
                          📋
                        </button>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                    "{report.description}"
                  </p>

                  {/* Admin Note and Status Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                      <input
                        type="text"
                        value={adminNotes[report.id] !== undefined ? adminNotes[report.id] : (report.adminNote || '')}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [report.id]: e.target.value })}
                        placeholder="Add mentor note / explanation..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveAdminNote(report.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 text-xs font-bold whitespace-nowrap"
                      >
                        {savedNoteSuccess === report.id ? 'Saved ✓' : 'Save Note'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateReportStatus(report.id, 'in_review')}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        In Review
                      </button>
                      <button
                        onClick={() => handleUpdateReportStatus(report.id, 'resolved')}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        Resolved ✓
                      </button>
                      <button
                        onClick={() => handleUpdateReportStatus(report.id, 'dismissed')}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No error reports under this status.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: VAULT EXERCISES & THEORY UPLOADER */}
        {/* ==================================================================== */}
        {activeTab === 'vault' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>⚡ Vault Content Manager &amp; JEE Exercise Uploader</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Schema Locked
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Upload chapterwise exercises as standardized JSON files and theory notes as PDF files. Automatically deployed to live student vault.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Director:</span>
                <span className="text-slate-900 dark:text-zinc-100 font-extrabold">Nelov Mallick (IIT Delhi)</span>
              </div>
            </div>

            <VaultContentManager
              onLaunchTest={(exercise) => {
                setTestToLaunch(exercise);
              }}
            />
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* STUDENT DETAIL MODAL / DRAWER */}
      {/* ==================================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              ✕
            </button>

            {/* Student Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {(selectedStudent.full_name || 'S').substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-zinc-100">{selectedStudent.full_name || 'Student Aspirant'}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                  {selectedStudent.email && <span>✉️ {selectedStudent.email}</span>}
                  {selectedStudent.contact_number && (
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>📱 {selectedStudent.contact_number}</span>
                      <button onClick={() => handleCopyPhone(selectedStudent.contact_number)} className="hover:text-emerald-800">📋</button>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-[10px]">
                    {selectedStudent.target_exam || 'JEE Advanced'}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Individual Attempts */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Individual Test Attempts</h4>
              {allAttempts.filter((a) => a.userId === selectedStudent.id).map((attempt, idx) => (
                <div key={attempt.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">{attempt.testCode || attempt.code}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{attempt.percentage || 0}% ({attempt.obtainedMarks || 0}/{attempt.totalMarks || 180})</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Accuracy: {attempt.accuracy || 0}% · {attempt.estimatedRankLabel || 'AIR Qualified'}</span>
                    <span>{attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'Attempted'}</span>
                  </div>
                </div>
              ))}
              {allAttempts.filter((a) => a.userId === selectedStudent.id).length === 0 && (
                <p className="text-xs text-slate-400 italic">No mock tests completed by this student yet.</p>
              )}
            </div>

            {/* Student Watched Lectures */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Completed Video Lectures</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {allLectures.filter((l) => l.user_id === selectedStudent.id && l.completed).map((lec, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="truncate">{lec.chapter_slug || lec.chapterSlug || 'Masterclass Video'}</span>
                  </div>
                ))}
              </div>
              {allLectures.filter((l) => l.user_id === selectedStudent.id && l.completed).length === 0 && (
                <p className="text-xs text-slate-400 italic">No lectures completed yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Test Status Toggle */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
              Confirm Test Activation
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              You are about to make <strong>{confirmModal.testCode}</strong> live. Ready questions: {confirmModal.questionCount}.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setConfirmModal(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button
                onClick={() => applyStatusChange(confirmModal.testId, confirmModal.newStatus)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Proceed & Make Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Window Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50">
                  📅 Schedule All-India Mock Window
                </h3>
                <p className="text-xs text-slate-500">{scheduleModal.code} — {scheduleModal.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModal(null)}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Toggle Enable Scheduled Window */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60">
                <div>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">Enable Scheduled All-India Window</span>
                  <p className="text-[11px] text-slate-500">Activates countdown, start-time gate, and window badges.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleModal({ ...scheduleModal, isScheduled: !scheduleModal.isScheduled })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${scheduleModal.isScheduled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${scheduleModal.isScheduled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* 1-Click Preset */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSetNextSundayPreset}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-extrabold hover:bg-amber-100 transition-colors"
                >
                  ⚡ One-Click Preset: Next Sunday (9:00 AM – 2:00 PM IST)
                </button>
              </div>

              {/* Window Label */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-zinc-300">Window Label</label>
                <input
                  type="text"
                  value={scheduleModal.windowLabel}
                  onChange={(e) => setScheduleModal({ ...scheduleModal, windowLabel: e.target.value })}
                  placeholder="e.g. Sunday All-India Live Mock"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900"
                />
              </div>

              {/* Start & End Pickers (IST) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">Starts At (Date &amp; Time)</label>
                  <input
                    type="datetime-local"
                    value={scheduleModal.startsAt}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, startsAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">Ends At (Date &amp; Time)</label>
                  <input
                    type="datetime-local"
                    value={scheduleModal.endsAt}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, endsAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleModal.lockLeaderboard}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, lockLeaderboard: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Lock Leaderboard Until Window Closes (prevents peeking at ranks)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleModal.allowPractice}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, allowPractice: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Allow Practice Attempts After Window Ends</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-3">
              <button
                type="button"
                onClick={() => handleClearSchedule(scheduleModal.testId)}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
              >
                Clear Schedule
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModal(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/30"
                >
                  Save Schedule ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Test Launch Shell from Vault */}
      {testToLaunch && (
        <ExerciseTestShellModal
          isOpen={Boolean(testToLaunch)}
          onClose={() => setTestToLaunch(null)}
          chapter={{ code: testToLaunch.chapterId, name: testToLaunch.title }}
          exercise={testToLaunch}
          subject={testToLaunch.subject || 'physics'}
          studentName={user?.name || 'Administrator'}
        />
      )}
    </div>
  );
};
