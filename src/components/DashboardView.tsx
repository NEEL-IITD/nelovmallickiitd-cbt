// ==============================================================================
// NelovMallickIITD · Unified Student Dashboard Workspace (/dashboard)
// TestOnGo-inspired persistent collapsible sidebar, Performance accordion,
// 83-Chapter Trackers, Auto Mistakes Log, Ctrl+K Search & Dark/Light Mode
// Curated by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Home,
  ClipboardCheck,
  TrendingUp,
  ChevronDown,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckSquare,
  Bookmark,
  BookOpen,
  Users,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Search,
  Sun,
  Moon,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Trash2,
  Atom,
  FlaskConical,
  Sigma,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TargetExam } from '../types';
import { cloudSyncService, CloudSyncStatusPayload } from '../services/cloudSyncService';
import { studentStorage, TestAttemptRecord, BookmarkedQuestion } from '../utils/studentStorage';
import { chapterProgressService, PROGRESS_UPDATED_EVENT, ChapterChecklist } from '../services/chapterProgressService';
import { physicsChaptersData } from '../data/physicsChapters';
import { chemistryChaptersData } from '../data/chemistryChapters';
import { mathsChaptersData } from '../data/mathsChapters';
import { JEE_MAINS_2027_SCHEDULE, ScheduleTestItem } from '../data/scheduleData';
import { jeeAdvancedTests, getLiveTestPaper } from '../data/testsIndex';
import { allStudyResources } from '../data/resourcesIndex';
import { ScheduleView } from './ScheduleView';
import { StudyResourcesVaultShowcase } from './vault/StudyResourcesVaultShowcase';
import { SubjectChaptersGrid } from './vault/SubjectChaptersGrid';
import { VaultContentManager } from './vault/VaultContentManager';
import { DailyGoalTodayCard } from './DailyGoalTodayCard';
import { DailyStudyPlannerView } from './DailyStudyPlannerView';
import { dailyPlannerService, DAILY_PLANNER_EVENT } from '../services/dailyPlannerService';

export type DashboardTabId =
  | 'home'
  | 'tests'
  | 'score'
  | 'analysis'
  | 'mistakes'
  | 'trackers'
  | 'notebooks'
  | 'resources'
  | 'community'
  | 'feedback'
  | 'admin-uploader';

interface DashboardViewProps {
  currentHash: string;
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate: (hash: string) => void;
  onSelectTest?: (testId: string) => void;
}

interface SearchEntry {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  keywords: string;
  badgeClass: string;
  hash?: string;
  testId?: string;
  subjectKey?: 'physics' | 'chemistry' | 'mathematics';
  chapterSlug?: string;
  isResource?: boolean;
}

interface MistakeEntry {
  uid: string;
  attempt: TestAttemptRecord;
  testId: string;
  testCode: string;
  testTitle: string;
  qNumber: number;
  subject: string;
  topic: string;
  status: 'wrong' | 'unattempted';
  userAns: any;
  correctAns: any;
  timeSpent: number;
  questionText: string;
  solution: string;
}

export function resolveDashboardTabFromHash(hash: string, isStrictAdmin: boolean): DashboardTabId {
  const clean = hash.toLowerCase().replace(/^#\/?dashboard\/?/, '').trim();
  if (clean === 'tests') return 'tests';
  if (clean === 'performance' || clean === 'performance/score') return 'score';
  if (clean === 'performance/analysis') return 'analysis';
  if (clean === 'performance/mistakes') return 'mistakes';
  if (clean === 'trackers') return 'trackers';
  if (clean === 'notebooks') return 'notebooks';
  if (clean === 'resources') return 'resources';
  if (clean === 'community') return 'community';
  if (clean === 'feedback') return 'feedback';
  if (clean === 'admin') return isStrictAdmin ? 'admin-uploader' : 'home';
  return 'home';
}

function collectMistakesFromAttempts(attempts: TestAttemptRecord[]): MistakeEntry[] {
  const entries: MistakeEntry[] = [];
  attempts.forEach((att, attIdx) => {
    const testKey = att.testId || att.testCode || `test-${attIdx}`;
    const paper = getLiveTestPaper(testKey);
    const questions = paper?.questions || [];
    const responses = att.responses || {};
    const timings = att.timePerQuestion || att.questionTimings || att.question_timings || {};

    if (questions.length > 0 && Object.keys(responses).length > 0) {
      questions.forEach((q: any, qIdx: number) => {
        const qKey = String(q.id);
        const userAns = responses[qKey];
        const hasResp =
          userAns !== undefined &&
          userAns !== null &&
          userAns !== '' &&
          (!Array.isArray(userAns) || userAns.length > 0);
        const correct = q.correctOption ?? q.correctValue ?? q.answer;
        const isRight = hasResp && correct !== undefined && String(userAns) === String(correct);
        if (!isRight) {
          entries.push({
            uid: `${att.id || testKey}__${qKey}`,
            attempt: att,
            testId: testKey,
            testCode: att.testCode || paper?.code || testKey,
            testTitle: att.testTitle || paper?.title || testKey,
            qNumber: q.qNo || qIdx + 1,
            subject: q.subject || 'Physics',
            topic: q.topic || 'JEE Concept',
            status: hasResp ? 'wrong' : 'unattempted',
            userAns,
            correctAns: correct,
            timeSpent: Number(timings[qKey] || 0),
            questionText: q.text || q.question || '',
            solution: q.solution || q.explanation || ''
          });
        }
      });
    } else if (Array.isArray(att.incorrectQuestionIds) && att.incorrectQuestionIds.length > 0) {
      att.incorrectQuestionIds.forEach((qId) => {
        entries.push({
          uid: `${att.id || testKey}__${qId}`,
          attempt: att,
          testId: testKey,
          testCode: att.testCode || testKey,
          testTitle: att.testTitle || testKey,
          qNumber: Number(qId),
          subject: 'JEE',
          topic: `Question #${qId}`,
          status: 'wrong',
          userAns: responses[String(qId)],
          correctAns: 'Review Paper',
          timeSpent: Number(timings[String(qId)] || 0),
          questionText: '',
          solution: ''
        });
      });
    }
  });
  return entries;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentHash,
  isDark,
  toggleTheme,
  onNavigate,
  onSelectTest
}) => {
  const { user, isAdmin: isStrictAdmin, logOut, updateProfile, openAuthModal } = useAuth();
  const activeTab = useMemo(() => resolveDashboardTabFromHash(currentHash, isStrictAdmin), [currentHash, isStrictAdmin]);

  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTargetExam, setEditTargetExam] = useState<TargetExam>('JEE 2027');
  const [editDailyGoal, setEditDailyGoal] = useState<number>(30);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [syncBadge, setSyncBadge] = useState<CloudSyncStatusPayload>(() => cloudSyncService.getSyncStatus());

  useEffect(() => {
    return cloudSyncService.subscribeSyncStatus((st) => setSyncBadge(st));
  }, []);

  useEffect(() => {
    if (profileSettingsOpen && user) {
      setEditName(user.name || '');
      setEditTargetExam((user.targetExam as TargetExam) || 'JEE 2027');
      const goal = dailyPlannerService.getStore(user.id).dailyTarget || user.dailyQuestionGoal || 30;
      setEditDailyGoal(goal);
      setProfileMsg('');
    }
  }, [profileSettingsOpen, user]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [perfExpanded, setPerfExpanded] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHighlightIdx, setSearchHighlightIdx] = useState(0);
  const [freePassOpen, setFreePassOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [progressTick, setProgressTick] = useState(0);
  const [trackersMode, setTrackersMode] = useState<'planner' | 'syllabus'>('planner');
  const [plannerTick, setPlannerTick] = useState(0);

  // Interactive tab controls
  const [resourceSubTab, setResourceSubTab] = useState<'hub' | 'physics' | 'chemistry' | 'mathematics' | 'formulas'>('hub');
  const [trackerSubject, setTrackerSubject] = useState<'all' | 'physics' | 'chemistry' | 'mathematics'>('all');
  const [trackerWeightage, setTrackerWeightage] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [trackerQuery, setTrackerQuery] = useState('');
  const [mistakeSubject, setMistakeSubject] = useState('All');
  const [mistakeStatus, setMistakeStatus] = useState<'all' | 'unrevised' | 'wrong' | 'unattempted'>('all');
  const [expandedSol, setExpandedSol] = useState<Record<string, boolean>>({});
  const [notebookSection, setNotebookSection] = useState<'bookmarks' | 'notes'>('bookmarks');

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const userKey = user?.id || user?.email || 'guest';

  const [revisedMistakes, setRevisedMistakes] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(`nelov_revised_mistakes_${userKey}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [personalNotes, setPersonalNotes] = useState<Array<{ id: string; title: string; subject: string; body: string }>>(() => {
    try {
      const raw = localStorage.getItem(`nelov_personal_notes_${userKey}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Physics');
  const [noteBody, setNoteBody] = useState('');

  const [communityPosts, setCommunityPosts] = useState<Array<{
    id: string;
    pinned?: boolean;
    author: string;
    subject: string;
    title: string;
    body: string;
    upvotes: number;
    createdAt: string;
  }>>(() => {
    try {
      const raw = localStorage.getItem('nelov_community_posts_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 'pin_nelov_1',
        pinned: true,
        author: 'Nelov Mallick · IIT Delhi',
        subject: 'Strategy',
        title: 'Convert 180/300 into 230+ in PTM 01–05 Using Time-Sink Logs',
        body: 'Review every question where you spent >120 seconds. Sort Time-Sink traps first and record missing concepts inside Notebooks.',
        upvotes: 148,
        createdAt: 'Pinned Strategy'
      },
      {
        id: 'comm_2',
        author: 'Riya Verma',
        subject: 'Chemistry',
        title: 'PTM 03 Organic: SN1 vs SN2 & Grignard Acid-Base Order',
        body: '-SO3H is much more acidic than -COOH when equivalent amounts of RMgX react, and SOCl2 with pyridine proceeds with inversion.',
        upvotes: 64,
        createdAt: '2h ago'
      }
    ];
  });
  const [communitySubject, setCommunitySubject] = useState('All');
  const [communityTitle, setCommunityTitle] = useState('');
  const [communityBody, setCommunityBody] = useState('');
  const [communityPostSubject, setCommunityPostSubject] = useState('Physics');

  const [feedbackCat, setFeedbackCat] = useState('Feature Suggestion');
  const [feedbackRef, setFeedbackRef] = useState('General Portal');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackDone, setFeedbackDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const refresh = () => setProgressTick((p) => p + 1);
    const refreshPlanner = () => setPlannerTick((p) => p + 1);
    window.addEventListener(PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener(DAILY_PLANNER_EVENT, refreshPlanner);
    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener(DAILY_PLANNER_EVENT, refreshPlanner);
    };
  }, []);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 40);
    } else {
      setSearchQuery('');
      setSearchHighlightIdx(0);
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (activeTab === 'score' || activeTab === 'analysis' || activeTab === 'mistakes') {
      setPerfExpanded(true);
    }
    setMobileSidebarOpen(false);
  }, [activeTab]);

  const stats = user
    ? studentStorage.getUserStats(user.id)
    : { totalTests: 0, averageScorePct: 0, bestScorePct: 0, totalQuestionsAttempted: 0, overallAccuracy: 0, recentPredictedAir: 'N/A' };

  const attempts = useMemo<TestAttemptRecord[]>(() => {
    if (!user) return [];
    return studentStorage.getAttempts(user.id) || [];
  }, [user, progressTick]);

  const bookmarks = useMemo<BookmarkedQuestion[]>(() => {
    if (!user) return [];
    return studentStorage.getBookmarks(user.id) || [];
  }, [user, progressTick]);

  const allMistakes = useMemo(() => collectMistakesFromAttempts(attempts), [attempts]);
  const unrevisedCount = useMemo(
    () => allMistakes.filter((m) => !revisedMistakes[m.uid]).length,
    [allMistakes, revisedMistakes]
  );

  // 83-chapter progress aggregation
  const chaptersSnapshot = useMemo(() => {
    const phy = (physicsChaptersData || []).map((c: any) => ({ ...c, subjectKey: 'physics' as const, subjectName: 'Physics' }));
    const chm = (chemistryChaptersData || []).map((c: any) => ({ ...c, subjectKey: 'chemistry' as const, subjectName: 'Chemistry' }));
    const mat = (mathsChaptersData || []).map((c: any) => ({ ...c, subjectKey: 'mathematics' as const, subjectName: 'Mathematics' }));
    const all = [...phy, ...chm, ...mat].map((ch) => {
      const p = chapterProgressService.getChapterProgress(ch.subjectKey, ch.id, ch.code, ch.exercises, user?.id);
      return {
        ...ch,
        checklist: p.checklist,
        progressPercent: p.progressPercent,
        testsGivenCount: p.testsGivenCount
      };
    });

    const summarize = (key: 'physics' | 'chemistry' | 'mathematics') => {
      const list = all.filter((c) => c.subjectKey === key);
      const avg = list.length > 0 ? Math.round(list.reduce((s, item) => s + item.progressPercent, 0) / list.length) : 0;
      const mastered = list.filter((item) => item.progressPercent >= 75).length;
      return { list, count: list.length, avg, mastered };
    };

    const masteredTotal = all.filter((c) => c.progressPercent >= 75).length;
    const avgTotal = all.length > 0 ? Math.round(all.reduce((s, c) => s + c.progressPercent, 0) / all.length) : 0;

    return {
      all,
      totalCount: all.length,
      masteredTotal,
      avgTotal,
      physics: summarize('physics'),
      chemistry: summarize('chemistry'),
      mathematics: summarize('mathematics')
    };
  }, [progressTick, user]);

  const hasStarted = (startIso?: string) => !startIso || now >= new Date(startIso).getTime();

  const formatCountdown = (startIso?: string) => {
    if (!startIso) return null;
    const diff = new Date(startIso).getTime() - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (days > 0) return `${days}d ${hours}h ${mins}m ${secs}s`;
    return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  const nextScheduledTest = useMemo<ScheduleTestItem | null>(() => {
    const upcoming = JEE_MAINS_2027_SCHEDULE.filter((t) => new Date(t.startIso).getTime() > now);
    return upcoming[0] || JEE_MAINS_2027_SCHEDULE[0] || null;
  }, [now]);

  const featuredTests = useMemo(() => {
    const live = JEE_MAINS_2027_SCHEDULE.filter((t) => hasStarted(t.startIso) && (t.num <= 3));
    const upcoming = JEE_MAINS_2027_SCHEDULE.filter((t) => !hasStarted(t.startIso));
    const list = [...live.slice(-1), ...upcoming].slice(0, 3);
    return list.length > 0 ? list : JEE_MAINS_2027_SCHEDULE.slice(0, 3);
  }, [now]);

  const searchItems = useMemo<SearchEntry[]>(() => {
    const navs: SearchEntry[] = [
      { id: 'n_home', kind: 'Tab', title: 'Dashboard Home', subtitle: 'Overview, KPIs & Quick Launch', keywords: 'home dashboard overview', badgeClass: 'bg-indigo-500/20 text-indigo-400', hash: '#/dashboard' },
      { id: 'n_tests', kind: 'Tab', title: 'Mock Tests & Schedule', subtitle: 'PTM 01–20 + Live PTA 04–06', keywords: 'mock tests ptm schedule', badgeClass: 'bg-blue-500/20 text-blue-400', hash: '#/dashboard/tests' },
      { id: 'n_score', kind: 'Perf', title: 'SCORE · Test History', subtitle: 'Marks, Rank Est & Review', keywords: 'score marks attempts', badgeClass: 'bg-emerald-500/20 text-emerald-400', hash: '#/dashboard/performance/score' },
      { id: 'n_analysis', kind: 'Perf', title: 'Analysis · Subject Diagnostics', subtitle: 'Subject accuracy & Time-Sink overview', keywords: 'analysis performance time', badgeClass: 'bg-emerald-500/20 text-emerald-400', hash: '#/dashboard/performance/analysis' },
      { id: 'n_mistakes', kind: 'Perf', title: 'Mistakes · Re-Practice Queue', subtitle: 'Auto-collected wrong & skipped questions', keywords: 'mistakes wrong revision', badgeClass: 'bg-rose-500/20 text-rose-400', hash: '#/dashboard/performance/mistakes' },
      { id: 'n_trackers', kind: 'Tool', title: 'Trackers · 83-Chapter Checklist', subtitle: 'Physics 28 · Chemistry 29 · Maths 26', keywords: 'trackers syllabus checklist', badgeClass: 'bg-violet-500/20 text-violet-400', hash: '#/dashboard/trackers' },
      { id: 'n_notebooks', kind: 'Tool', title: 'Notebooks · Bookmarks & Notes', subtitle: 'Saved questions & personal formula notes', keywords: 'notebooks bookmarks notes', badgeClass: 'bg-amber-500/20 text-amber-400', hash: '#/dashboard/notebooks' },
      { id: 'n_resources', kind: 'Vault', title: 'Study Resources & Formula Vault', subtitle: 'Chapterwise Vaults & Formula PDFs', keywords: 'resources vault formula', badgeClass: 'bg-indigo-500/20 text-indigo-400', hash: '#/dashboard/resources' },
      { id: 'n_community', kind: 'Forum', title: 'Community · Peer Discussions', subtitle: 'Strategy notes & JEE doubts', keywords: 'community forum doubts', badgeClass: 'bg-cyan-500/20 text-cyan-400', hash: '#/dashboard/community' }
    ];

    const sched: SearchEntry[] = JEE_MAINS_2027_SCHEDULE.map((item) => ({
      id: `s_${item.id}`,
      kind: 'PTM',
      title: `${item.code} · JEE Mains 2027 Full Mock`,
      subtitle: `${item.dateStr} · ${item.windowStr}`,
      keywords: `${item.code} ${item.id} jee mains schedule`,
      badgeClass: 'bg-blue-500/20 text-blue-400',
      hash: '#/dashboard/tests'
    }));

    const pta: SearchEntry[] = jeeAdvancedTests.map((t) => ({
      id: `p_${t.id}`,
      kind: 'PTA',
      title: `${t.code} · ${t.title}`,
      subtitle: `JEE Advanced · ${t.totalQuestions} Questions`,
      keywords: `${t.code} ${t.id} jee advanced`,
      badgeClass: 'bg-violet-500/20 text-violet-400',
      testId: t.id
    }));

    const getChapterAliases = (ch: any) => {
      const n = `${ch.name || ''} ${ch.fullName || ''} ${ch.id || ''}`.toLowerCase();
      const aliases: string[] = [];
      if (n.includes('alkyl halide') || n.includes('halo')) aliases.push('haloalkanes haloarenes aryl halide sn1 sn2');
      if (n.includes('goc') || n.includes('general organic')) aliases.push('general organic chemistry goc isomerism');
      if (n.includes('ktg') || n.includes('kinetic')) aliases.push('ktg kinetic theory of gases');
      if (n.includes('shm') || n.includes('oscillation')) aliases.push('shm simple harmonic motion');
      if (n.includes('nlm') || n.includes('friction')) aliases.push('newtons laws of motion nlm friction');
      if (n.includes('wpe') || n.includes('circular')) aliases.push('work power energy wpe circular motion');
      if (n.includes('emi') || n.includes('alternating')) aliases.push('electromagnetic induction emi ac');
      if (n.includes('application') && n.includes('derivative')) aliases.push('aod applications of derivatives maxima minima');
      if (n.includes('permutation') || n.includes('p&c')) aliases.push('pnc permutations and combinations');
      return aliases.join(' ');
    };

    const chaps: SearchEntry[] = chaptersSnapshot.all.map((ch) => {
      const topicStr = (ch.theory?.topics || []).join(' ');
      const exStr = (ch.exercises || []).map((ex: any) => ex.title || '').join(' ');
      return {
        id: `c_${ch.subjectKey}_${ch.id}`,
        kind: ch.subjectKey === 'physics' ? 'PHY' : ch.subjectKey === 'chemistry' ? 'CHM' : 'MAT',
        title: `${ch.code}: ${ch.fullName || ch.name}`,
        subtitle: `${ch.subjectName} · ${ch.category || 'JEE Chapter'} · ${ch.progressPercent}% Complete`,
        keywords: `${ch.name} ${ch.fullName || ''} ${ch.badgeText || ''} ${ch.code} ${ch.category || ''} ${ch.subjectName} ${topicStr} ${exStr} ${getChapterAliases(ch)}`,
        badgeClass:
          ch.subjectKey === 'physics'
            ? 'bg-blue-500/20 text-blue-400'
            : ch.subjectKey === 'chemistry'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-violet-500/20 text-violet-400',
        subjectKey: ch.subjectKey,
        chapterSlug: ch.id
      };
    });

    const formulas: SearchEntry[] = allStudyResources.slice(0, 20).map((r) => ({
      id: `r_${r.id}`,
      kind: 'PDF',
      title: r.title,
      subtitle: `${r.subject} · ${r.resourceType}`,
      keywords: `${r.title} ${r.subject} ${r.resourceType} formula`,
      badgeClass: 'bg-amber-500/20 text-amber-400',
      isResource: true
    }));

    return [...navs, ...pta, ...sched, ...chaps, ...formulas];
  }, [chaptersSnapshot]);

  const filteredSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return searchItems.slice(0, 12);
    return searchItems
      .filter((item) => `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase().includes(q))
      .slice(0, 14);
  }, [searchQuery, searchItems]);

  const handleSelectSearch = (item: SearchEntry) => {
    setSearchModalOpen(false);
    if (item.hash) {
      onNavigate(item.hash);
    } else if (item.testId && onSelectTest) {
      onSelectTest(item.testId);
    } else if (item.subjectKey && item.chapterSlug) {
      onNavigate(`#/resources/${item.subjectKey}/${item.chapterSlug}`);
    } else if (item.isResource) {
      setResourceSubTab('formulas');
      onNavigate('#/dashboard/resources');
    }
  };

  const handleResumeLastTest = () => {
    if (!user) {
      openAuthModal('login', '#/dashboard', 'Sign in to resume or attempt live JEE mock tests.');
      return;
    }
    const latestSess = studentStorage.getLatestInProgressSession(user.id);
    if (latestSess?.testId && onSelectTest) {
      onSelectTest(latestSess.testId);
      return;
    }
    if (onSelectTest) {
      onSelectTest('jee-mains-ptm-02');
    } else {
      onNavigate('#/dashboard/tests');
    }
  };

  // Styles aligned with Deep Obsidian (#080B14 / #0E1322) + Indigo-Charcoal (#12172A -> #171D35)
  const shellBg = isDark ? 'bg-[#080B14] text-[#F8FAFC]' : 'bg-slate-50 text-slate-900';
  const sidebarBg = isDark ? 'bg-[#0E1322]/95 border-white/[0.08]' : 'bg-white border-slate-200';
  const topBarBg = isDark ? 'bg-[#0E1322]/85 border-white/[0.08]' : 'bg-white/90 border-slate-200';
  const cardCls = isDark
    ? 'bg-gradient-to-br from-[#12172A] to-[#171D35] border border-white/[0.08] shadow-xl shadow-black/30'
    : 'bg-white border border-slate-200/90 shadow-sm shadow-slate-900/5';
  const subCardCls = isDark ? 'bg-[#0E1322]/90 border border-white/[0.08]' : 'bg-slate-50/90 border border-slate-200/80';
  const mutedText = isDark ? 'text-[#94A3B8]' : 'text-slate-500';
  const activePill = isDark
    ? 'bg-gradient-to-r from-[#6366F1]/25 via-[#7C3AED]/15 to-transparent text-indigo-200 border border-[#6366F1]/45 shadow-[0_0_24px_-6px_rgba(99,102,241,0.55)] font-bold'
    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm font-bold';
  const inactivePill = isDark
    ? 'text-slate-300/90 border border-transparent hover:bg-white/[0.05] hover:text-white font-medium'
    : 'text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900 font-medium';

  const filteredTrackers = useMemo(() => {
    const q = trackerQuery.trim().toLowerCase();
    return chaptersSnapshot.all.filter((ch) => {
      if (trackerSubject !== 'all' && ch.subjectKey !== trackerSubject) return false;
      if (trackerWeightage !== 'all' && (ch.weightage || 'mid').toLowerCase() !== trackerWeightage) return false;
      if (q && !`${ch.name} ${ch.code} ${ch.category || ''} ${ch.subjectName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [chaptersSnapshot, trackerSubject, trackerWeightage, trackerQuery]);

  const filteredMistakes = useMemo(() => {
    return allMistakes.filter((m) => {
      if (mistakeSubject !== 'All' && m.subject.toLowerCase() !== mistakeSubject.toLowerCase()) return false;
      if (mistakeStatus === 'wrong' && m.status !== 'wrong') return false;
      if (mistakeStatus === 'unattempted' && m.status !== 'unattempted') return false;
      if (mistakeStatus === 'unrevised' && revisedMistakes[m.uid]) return false;
      return true;
    });
  }, [allMistakes, mistakeSubject, mistakeStatus, revisedMistakes]);

  const handleToggleMistakeRevised = (uid: string) => {
    setRevisedMistakes((prev) => {
      const next = { ...prev, [uid]: !prev[uid] };
      try {
        localStorage.setItem(`nelov_revised_mistakes_${userKey}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim()) return;
    const updated = [{ id: `note_${Date.now()}`, title: noteTitle.trim(), subject: noteSubject, body: noteBody.trim() }, ...personalNotes];
    setPersonalNotes(updated);
    try {
      localStorage.setItem(`nelov_personal_notes_${userKey}`, JSON.stringify(updated));
    } catch {}
    setNoteTitle('');
    setNoteBody('');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    try {
      await studentStorage.submitErrorReport({
        userId: user?.id || 'guest',
        reporterName: user?.name || 'Guest Aspirant',
        reporterEmail: user?.email || 'guest@nelovmallick.local',
        testId: feedbackRef,
        examType: 'Dashboard Feedback',
        testCode: feedbackRef,
        questionId: '0',
        questionNumber: 0,
        issueType: `${feedbackCat} (${feedbackRating}/5)`,
        description: feedbackMsg.trim()
      });
    } catch {}
    setFeedbackDone(true);
    setFeedbackMsg('');
    setTimeout(() => setFeedbackDone(false), 3500);
  };

  const renderSidebar = () => (
    <div className="flex flex-col h-full">
      <div className={`h-16 px-4 flex items-center justify-between border-b shrink-0 ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={() => onNavigate('#/')}
          className={`flex items-center gap-2.5 min-w-0 text-left ${sidebarCollapsed ? 'mx-auto' : ''}`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-lg shrink-0">
            NM
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-black tracking-tight truncate">Nelov Mallick</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 truncate">JEE 2027 Workspace</div>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSidebarCollapsed((c) => !c)}
          className={`hidden lg:flex p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <button
          type="button"
          onClick={() => onNavigate('#/dashboard')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'home' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <Home className="w-[18px] h-[18px] shrink-0" />
          {!sidebarCollapsed && <span className="text-[13px] truncate">Home</span>}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('#/dashboard/tests')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'tests' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <ClipboardCheck className="w-[18px] h-[18px] shrink-0" />
            {!sidebarCollapsed && <span className="text-[13px] truncate">Mock Tests</span>}
          </span>
          {!sidebarCollapsed && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/10">20 PTM</span>}
        </button>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              if (sidebarCollapsed) {
                setSidebarCollapsed(false);
                setPerfExpanded(true);
              } else {
                setPerfExpanded((p) => !p);
              }
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              activeTab === 'score' || activeTab === 'analysis' || activeTab === 'mistakes'
                ? (isDark ? 'bg-white/[0.06] text-indigo-300 font-bold border border-indigo-500/25' : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200')
                : inactivePill
            } ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <TrendingUp className="w-[18px] h-[18px] shrink-0" />
              {!sidebarCollapsed && <span className="text-[13px] truncate">Performance</span>}
            </span>
            {!sidebarCollapsed && <ChevronDown className={`w-4 h-4 transition-transform ${perfExpanded ? 'rotate-180' : ''}`} />}
          </button>

          {!sidebarCollapsed && perfExpanded && (
            <div className={`ml-5 pl-3 space-y-1 border-l ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={() => onNavigate('#/dashboard/performance/score')}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-xs ${activeTab === 'score' ? activePill : inactivePill}`}
              >
                <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> SCORE</span>
                <span className="text-[10px] opacity-75">{attempts.length}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('#/dashboard/performance/analysis')}
                className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-xs ${activeTab === 'analysis' ? activePill : inactivePill}`}
              >
                <Activity className="w-4 h-4" /> Analysis
              </button>
              <button
                type="button"
                onClick={() => onNavigate('#/dashboard/performance/mistakes')}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-xs ${activeTab === 'mistakes' ? activePill : inactivePill}`}
              >
                <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Mistakes</span>
                {unrevisedCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400">{unrevisedCount}</span>}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('#/dashboard/trackers')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'trackers' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <CheckSquare className="w-[18px] h-[18px] shrink-0" />
            {!sidebarCollapsed && <span className="text-[13px] truncate">Trackers</span>}
          </span>
          {!sidebarCollapsed && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/10">{chaptersSnapshot.totalCount}</span>}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('#/dashboard/notebooks')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'notebooks' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <Bookmark className="w-[18px] h-[18px] shrink-0" />
            {!sidebarCollapsed && <span className="text-[13px] truncate">Notebooks</span>}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('#/dashboard/resources')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'resources' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <BookOpen className="w-[18px] h-[18px] shrink-0" />
          {!sidebarCollapsed && <span className="text-[13px] truncate">Study Resources</span>}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('#/dashboard/community')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'community' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <Users className="w-[18px] h-[18px] shrink-0" />
          {!sidebarCollapsed && <span className="text-[13px] truncate">Community</span>}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('#/dashboard/feedback')}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'feedback' ? activePill : inactivePill} ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <MessageSquare className="w-[18px] h-[18px] shrink-0" />
          {!sidebarCollapsed && <span className="text-[13px] truncate">Feedback</span>}
        </button>
      </nav>

      <div className={`p-3 border-t space-y-2 shrink-0 ${isDark ? 'border-white/[0.08] bg-[#080B14]/40' : 'border-slate-200 bg-slate-50/70'}`}>
        {isStrictAdmin && (
          <button
            type="button"
            onClick={() => onNavigate(activeTab === 'admin-uploader' ? '#/dashboard' : '#/dashboard/admin')}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between border text-xs font-bold ${
              activeTab === 'admin-uploader'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-rose-500/10 border-rose-500/25 text-rose-300 hover:bg-rose-500/20'
            }`}
          >
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {!sidebarCollapsed && 'Admin Mode (Vault)'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setFreePassOpen(true)}
          className={`w-full rounded-xl p-2.5 text-left border ${
            isDark
              ? 'bg-gradient-to-r from-emerald-500/15 via-indigo-500/15 to-violet-500/15 border-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-50 via-indigo-50 to-violet-50 border-emerald-200'
          }`}
        >
          <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-black uppercase ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>PREMIUM · ₹0</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black uppercase">FREE PASS</span>
                </div>
                <p className={`text-[10px] truncate ${mutedText}`}>100% Free Forever Access</p>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${shellBg} font-sans transition-colors duration-200`}>
      <aside className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-r transition-all duration-300 z-30 ${sidebarCollapsed ? 'w-[76px]' : 'w-64'} ${sidebarBg}`}>
        {renderSidebar()}
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className={`relative w-72 max-w-[85vw] h-full border-r shadow-2xl z-10 flex flex-col ${sidebarBg}`}>
            {renderSidebar()}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className={`sticky top-0 z-20 h-16 px-3 sm:px-6 border-b backdrop-blur-xl flex items-center justify-between gap-2 sm:gap-3 ${topBarBg}`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl border shrink-0 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}
              aria-label="Open Dashboard Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className={`flex items-center justify-between gap-2 min-w-0 flex-1 max-w-md px-3 sm:px-3.5 py-2 rounded-xl border text-left ${
                isDark ? 'bg-[#12172A] border-white/10 text-slate-400 hover:border-indigo-500/50' : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-indigo-300'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <Search className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="sm:hidden text-xs truncate">Search...</span>
                <span className="hidden sm:inline text-xs sm:text-[13px] truncate">Search 83 chapters, PTMs, formulas...</span>
              </span>
              <kbd className={`hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {nextScheduledTest && (
              <button
                type="button"
                onClick={() => onNavigate('#/dashboard/tests')}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  hasStarted(nextScheduledTest.startIso)
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                    : (isDark ? 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700')
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${hasStarted(nextScheduledTest.startIso) ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                <span>{nextScheduledTest.code}: {hasStarted(nextScheduledTest.startIso) ? 'Live Now' : formatCountdown(nextScheduledTest.startIso)}</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${isDark ? 'bg-[#12172A] border-white/10 text-amber-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && (
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold ${
                  syncBadge.status === 'saving'
                    ? (isDark ? 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700')
                    : (isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${syncBadge.status === 'saving' ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>{syncBadge.status === 'saving' ? 'Saving...' : '✓ Saved'}</span>
              </span>
            )}

            <div className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => setProfileOpen((p) => !p)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${isDark ? 'bg-[#12172A] border-white/10' : 'bg-slate-100 border-slate-200'}`}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-lg object-cover border border-white/20" />
                  ) : (
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white text-xs font-black flex items-center justify-center">
                      {(user.name || 'S').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs font-bold max-w-[110px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login', '#/dashboard', 'Sign in with Google or Email to sync your progress and bookmarks.')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white text-xs font-bold"
                >
                  Sign In Free
                </button>
              )}

              {profileOpen && user && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 text-xs ${isDark ? 'bg-[#12172A] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className={`px-3 py-2 border-b mb-1 space-y-1 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <div className="font-black truncate">{user.name}</div>
                    <div className={`text-[11px] truncate ${mutedText}`}>{user.email || user.contactNumber}</div>
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                      Target Exam: {user.targetExam || 'JEE 2027'}
                    </span>
                  </div>
                  <button type="button" onClick={() => { setProfileOpen(false); setProfileSettingsOpen(true); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 font-semibold">
                    Profile Settings
                  </button>
                  <button type="button" onClick={() => { setProfileOpen(false); onNavigate('#/'); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 font-semibold">
                    Main Website
                  </button>
                  <button type="button" onClick={() => { setProfileOpen(false); logOut(); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 font-bold">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>Nelov Mallick · JEE 2027 Dashboard</div>
              <h1 className="text-xl sm:text-2xl font-black capitalize">{activeTab.replace('-', ' ')}</h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('#/')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${isDark ? 'border-white/10 bg-[#12172A]' : 'border-slate-200 bg-white'}`}
            >
              Main Site <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTab === 'home' && (
            <div className="space-y-6">
              <DailyGoalTodayCard
                userId={user?.id}
                isDark={isDark}
                plannerTick={plannerTick}
                onOpenPlanner={() => {
                  setTrackersMode('planner');
                  onNavigate('#/dashboard/trackers');
                }}
                onResumeTest={handleResumeLastTest}
              />

              <div className={`rounded-3xl p-6 sm:p-8 border ${isDark ? 'bg-gradient-to-br from-indigo-950/80 via-[#12172A] to-[#080B14] border-indigo-500/25' : 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-indigo-500'}`}>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Welcome back, {user ? user.name : 'Future IITian'}!</h2>
                <p className="text-xs sm:text-sm text-indigo-100/85 mt-1 max-w-2xl">
                  100% Free JEE 2027 preparation hub curated by Nelov Mallick (IIT Delhi).
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button type="button" onClick={() => onNavigate('#/dashboard/tests')} className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-black text-xs flex items-center gap-1.5">
                    Attempt Mock Tests <ArrowRight className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => onNavigate('#/dashboard/trackers')} className="px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-xs">
                    83-Chapter Tracker
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <button type="button" onClick={() => onNavigate('#/dashboard/performance/score')} className={`text-left rounded-2xl p-5 ${cardCls}`}>
                  <div className={`text-[11px] font-extrabold uppercase ${mutedText}`}>Tests Completed</div>
                  <div className="text-3xl font-black mt-2">{stats.totalTests || 0}</div>
                  <div className={`text-[11px] mt-1 ${mutedText}`}>Predicted AIR: {stats.recentPredictedAir || 'N/A'}</div>
                </button>
                <button type="button" onClick={() => onNavigate('#/dashboard/performance/analysis')} className={`text-left rounded-2xl p-5 ${cardCls}`}>
                  <div className={`text-[11px] font-extrabold uppercase ${mutedText}`}>Avg Score &amp; Accuracy</div>
                  <div className="text-3xl font-black text-emerald-400 mt-2">{stats.averageScorePct || 0}%</div>
                  <div className={`text-[11px] mt-1 ${mutedText}`}>Accuracy: {stats.overallAccuracy || 0}%</div>
                </button>
                <button type="button" onClick={() => onNavigate('#/dashboard/trackers')} className={`text-left rounded-2xl p-5 ${cardCls}`}>
                  <div className={`text-[11px] font-extrabold uppercase ${mutedText}`}>Chapters Mastered</div>
                  <div className="text-3xl font-black text-violet-400 mt-2">{chaptersSnapshot.masteredTotal} / {chaptersSnapshot.totalCount}</div>
                  <div className={`text-[11px] mt-1 ${mutedText}`}>{chaptersSnapshot.avgTotal}% Syllabus Complete</div>
                </button>
                <button type="button" onClick={() => onNavigate('#/dashboard/performance/mistakes')} className={`text-left rounded-2xl p-5 ${cardCls}`}>
                  <div className={`text-[11px] font-extrabold uppercase ${mutedText}`}>Mistakes to Revise</div>
                  <div className="text-3xl font-black text-rose-400 mt-2">{unrevisedCount}</div>
                  <div className={`text-[11px] mt-1 ${mutedText}`}>Click to drill solutions →</div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'physics' as const, title: 'Physics Vault', data: chaptersSnapshot.physics, Icon: Atom, ring: 'border-blue-500/35' },
                  { key: 'chemistry' as const, title: 'Chemistry Vault', data: chaptersSnapshot.chemistry, Icon: FlaskConical, ring: 'border-emerald-500/35' },
                  { key: 'mathematics' as const, title: 'Mathematics Vault', data: chaptersSnapshot.mathematics, Icon: Sigma, ring: 'border-violet-500/35' }
                ].map(({ key, title, data, Icon, ring }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setResourceSubTab(key); onNavigate('#/dashboard/resources'); }}
                    className={`text-left rounded-3xl p-5 border transition-all hover:-translate-y-0.5 ${cardCls} ${ring}`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-6 h-6 text-indigo-400" />
                      <span className="text-xs font-black">{data.count} Chapters</span>
                    </div>
                    <h3 className="text-lg font-black mt-3">{title}</h3>
                    <div className={`text-xs mt-1 ${mutedText}`}>{data.mastered}/{data.count} Mastered · {data.avg}%</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredTests.map((t) => {
                  const started = hasStarted(t.startIso);
                  return (
                    <div key={t.id} className={`rounded-2xl p-5 space-y-3 ${cardCls}`}>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-xs font-black">{t.code}</span>
                        <span className="text-[11px] font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {started ? 'Live Now' : formatCountdown(t.startIso)}
                        </span>
                      </div>
                      <div className="text-sm font-black">{t.dateStr}</div>
                      <div className={`text-xs ${mutedText}`}>{t.windowStr}</div>
                      <button
                        type="button"
                        onClick={() => onNavigate('#/dashboard/tests')}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black"
                      >
                        Open Schedule &amp; Preview Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tests' && <ScheduleView onNavigate={onNavigate} onSelectTest={onSelectTest} />}

          {activeTab === 'score' && (
            <div className="space-y-4">
              {!user ? (
                <div className={`rounded-3xl p-8 text-center ${cardCls}`}>
                  <h2 className="text-lg font-black">Sign in to View Scorecards</h2>
                  <button type="button" onClick={() => openAuthModal('login', '#/dashboard/performance/score')} className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black">
                    Sign In Free
                  </button>
                </div>
              ) : attempts.length === 0 ? (
                <div className={`rounded-3xl p-8 text-center text-xs ${cardCls} ${mutedText}`}>No completed attempts yet.</div>
              ) : attempts.map((att) => (
                <div key={att.id} className={`rounded-2xl p-5 flex items-center justify-between gap-4 ${cardCls}`}>
                  <div>
                    <div className="text-sm font-black">{att.testTitle || att.testCode}</div>
                    <div className={`text-xs ${mutedText}`}>{att.totalMarksScored}/{att.totalMaxMarks} Marks · {att.accuracy}% Accuracy</div>
                  </div>
                  <button type="button" onClick={() => onSelectTest?.(att.testId)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                    Retake / Open
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Physics', 'Chemistry', 'Mathematics'].map((sub) => {
                const list = chaptersSnapshot[sub.toLowerCase() as 'physics' | 'chemistry' | 'mathematics'];
                return (
                  <div key={sub} className={`rounded-3xl p-5 space-y-3 ${cardCls}`}>
                    <h3 className="text-base font-black">{sub} Mastery</h3>
                    <div className="text-2xl font-black text-indigo-400">{list.avg}%</div>
                    <p className={`text-xs ${mutedText}`}>{list.mastered} of {list.count} chapters mastered</p>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              <div className={`rounded-2xl p-4 flex flex-wrap gap-2 ${cardCls}`}>
                {['All', 'Physics', 'Chemistry', 'Mathematics'].map((s) => (
                  <button key={s} type="button" onClick={() => setMistakeSubject(s)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${mistakeSubject === s ? 'bg-indigo-600 text-white' : 'bg-white/5'}`}>
                    {s}
                  </button>
                ))}
                {(['all', 'unrevised', 'wrong', 'unattempted'] as const).map((st) => (
                  <button key={st} type="button" onClick={() => setMistakeStatus(st)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${mistakeStatus === st ? 'bg-rose-600 text-white' : 'bg-white/5'}`}>
                    {st}
                  </button>
                ))}
              </div>
              {filteredMistakes.length === 0 ? (
                <div className={`rounded-3xl p-8 text-center text-xs ${cardCls} ${mutedText}`}>No unrevised mistakes matched yet.</div>
              ) : filteredMistakes.slice(0, 30).map((m) => (
                <div key={m.uid} className={`rounded-2xl p-5 space-y-3 ${cardCls}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-indigo-400">{m.testCode} · Q{m.qNumber} · {m.subject}</span>
                    <button type="button" onClick={() => handleToggleMistakeRevised(m.uid)} className="px-3 py-1 rounded-xl border border-emerald-500/40 text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {revisedMistakes[m.uid] ? 'Revised' : 'Mark Revised'}
                    </button>
                  </div>
                  <p className="text-xs">{m.questionText || m.topic}</p>
                  <button type="button" onClick={() => setExpandedSol((p) => ({ ...p, [m.uid]: !p[m.uid] }))} className="text-xs font-bold text-indigo-400">
                    {expandedSol[m.uid] ? 'Hide Solution' : 'Show Solution'}
                  </button>
                  {expandedSol[m.uid] && <div className={`p-3 rounded-xl text-xs ${subCardCls}`}>{m.solution || `Correct Answer: ${m.correctAns}`}</div>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trackers' && (
            <div className="space-y-4">
              <div className="no-print flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTrackersMode('planner')}
                  className={`px-4 py-2 rounded-xl text-xs font-black ${
                    trackersMode === 'planner'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white'
                      : `${subCardCls}`
                  }`}
                >
                  Daily Study Planner (24h Timetable)
                </button>
                <button
                  type="button"
                  onClick={() => setTrackersMode('syllabus')}
                  className={`px-4 py-2 rounded-xl text-xs font-black ${
                    trackersMode === 'syllabus'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white'
                      : `${subCardCls}`
                  }`}
                >
                  83-Chapter Syllabus Checklist ({chaptersSnapshot.masteredTotal}/83)
                </button>
              </div>

              {trackersMode === 'planner' ? (
                <DailyStudyPlannerView
                  userId={user?.id}
                  isDark={isDark}
                  plannerTick={plannerTick}
                  onBackHome={() => onNavigate('#/dashboard')}
                />
              ) : (
                <div className="space-y-4">
              <div className={`rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 ${cardCls}`}>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'physics', 'chemistry', 'mathematics'] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setTrackerSubject(s)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${trackerSubject === s ? 'bg-indigo-600 text-white' : 'bg-white/5'}`}>
                      {s}
                    </button>
                  ))}
                  {(['all', 'high', 'mid', 'low'] as const).map((w) => (
                    <button key={w} type="button" onClick={() => setTrackerWeightage(w)} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase ${trackerWeightage === w ? 'bg-rose-600 text-white' : 'bg-white/5'}`}>
                      {w}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={trackerQuery}
                  onChange={(e) => setTrackerQuery(e.target.value)}
                  placeholder="Filter 83 chapters..."
                  className={`px-3 py-1.5 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10 text-white' : 'bg-white border-slate-200'}`}
                />
              </div>
              <div className="space-y-2.5">
                {filteredTrackers.map((ch) => (
                  <div key={`${ch.subjectKey}_${ch.id}`} className={`rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${cardCls}`}>
                    <div>
                      <div className="text-sm font-black">{ch.subjectName} · {ch.code}: {ch.name}</div>
                      <div className={`text-xs ${mutedText}`}>{ch.progressPercent}% Complete · {ch.testsGivenCount} Tests Given</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['notes', 'formula', 'pyqs', 'tests'] as Array<keyof ChapterChecklist>).map((m) => {
                        const checked = Boolean(ch.checklist?.[m]);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              chapterProgressService.setMilestone(ch.subjectKey, ch.id, m, !checked, user?.id);
                              setProgressTick((p) => p + 1);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase ${checked ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-white/10 bg-white/5'}`}
                          >
                            {checked ? '✓ ' : ''}{m}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          const tKey = dailyPlannerService.getLocalDateKey(new Date());
                          dailyPlannerService.addTopic(tKey, `${ch.subjectName}: ${ch.name}`, 'Practice', user?.id);
                          setTrackersMode('planner');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-[#6366F1]/15 text-indigo-300 text-xs font-bold"
                      >
                        + Plan Today
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notebooks' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setNotebookSection('bookmarks')} className={`px-4 py-2 rounded-xl text-xs font-black ${notebookSection === 'bookmarks' ? 'bg-indigo-600 text-white' : 'bg-white/5'}`}>
                  Bookmarks ({bookmarks.length})
                </button>
                <button type="button" onClick={() => setNotebookSection('notes')} className={`px-4 py-2 rounded-xl text-xs font-black ${notebookSection === 'notes' ? 'bg-indigo-600 text-white' : 'bg-white/5'}`}>
                  Personal Notes ({personalNotes.length})
                </button>
              </div>
              {notebookSection === 'bookmarks' ? (
                <div className="space-y-3">
                  {bookmarks.length === 0 ? (
                    <div className={`rounded-2xl p-8 text-center text-xs ${cardCls} ${mutedText}`}>No bookmarked questions yet.</div>
                  ) : bookmarks.map((b, i) => (
                    <div key={b.uniqueKey || i} className={`rounded-2xl p-4 space-y-2 ${cardCls}`}>
                      <div className="text-xs font-black text-indigo-400">{b.testCode} · {b.subject}</div>
                      <p className="text-xs">{b.question}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <form onSubmit={handleAddNote} className={`rounded-2xl p-5 space-y-3 h-fit ${cardCls}`}>
                    <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Title" required className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`} />
                    <select value={noteSubject} onChange={(e) => setNoteSubject(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`}>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                    <textarea rows={4} value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Note..." required className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`} />
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black">Save Note</button>
                  </form>
                  <div className="lg:col-span-2 space-y-3">
                    {personalNotes.map((n) => (
                      <div key={n.id} className={`rounded-2xl p-4 flex justify-between gap-3 ${cardCls}`}>
                        <div>
                          <div className="text-xs font-black text-indigo-400">{n.subject} · {n.title}</div>
                          <p className="text-xs mt-1 whitespace-pre-wrap">{n.body}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = personalNotes.filter((item) => item.id !== n.id);
                            setPersonalNotes(updated);
                            try { localStorage.setItem(`nelov_personal_notes_${userKey}`, JSON.stringify(updated)); } catch {}
                          }}
                          className="text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {(['hub', 'physics', 'chemistry', 'mathematics', 'formulas'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setResourceSubTab(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-black capitalize ${resourceSubTab === t ? 'bg-indigo-600 text-white' : 'bg-white/5'}`}
                  >
                    {t === 'hub' ? '3D Vault Hub' : t}
                  </button>
                ))}
              </div>
              {resourceSubTab === 'hub' && <StudyResourcesVaultShowcase onOpenSubject={(sub) => setResourceSubTab(sub as any)} />}
              {resourceSubTab === 'physics' && <SubjectChaptersGrid subject="physics" chapters={physicsChaptersData} onSelectChapter={(id) => onNavigate(`#/resources/physics/${id}`)} />}
              {resourceSubTab === 'chemistry' && <SubjectChaptersGrid subject="chemistry" chapters={chemistryChaptersData} onSelectChapter={(id) => onNavigate(`#/resources/chemistry/${id}`)} />}
              {resourceSubTab === 'mathematics' && <SubjectChaptersGrid subject="mathematics" chapters={mathsChaptersData} onSelectChapter={(id) => onNavigate(`#/resources/mathematics/${id}`)} />}
              {resourceSubTab === 'formulas' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allStudyResources.map((r) => (
                    <div key={r.id} className={`rounded-2xl p-5 space-y-2 ${cardCls}`}>
                      <span className="text-[10px] font-black uppercase text-indigo-400">{r.subject}</span>
                      <h4 className="text-sm font-black">{r.title}</h4>
                      <p className={`text-xs ${mutedText}`}>{r.subtitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['All', 'Strategy', 'Physics', 'Chemistry', 'Mathematics'].map((s) => (
                    <button key={s} type="button" onClick={() => setCommunitySubject(s)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${communitySubject === s ? 'bg-indigo-600 text-white' : 'bg-white/5'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {communityPosts
                  .filter((p) => communitySubject === 'All' || p.subject === communitySubject)
                  .map((p) => (
                    <div key={p.id} className={`rounded-2xl p-5 space-y-2 ${cardCls}`}>
                      <div className="text-xs font-bold text-indigo-400">{p.subject} · {p.author}</div>
                      <h4 className="text-sm font-black">{p.title}</h4>
                      <p className="text-xs leading-relaxed">{p.body}</p>
                    </div>
                  ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!communityTitle.trim() || !communityBody.trim()) return;
                  const next = [communityPosts[0], { id: `c_${Date.now()}`, author: user?.name || 'Aspirant', subject: communityPostSubject, title: communityTitle.trim(), body: communityBody.trim(), upvotes: 1, createdAt: 'Just now' }, ...communityPosts.slice(1)];
                  setCommunityPosts(next);
                  try { localStorage.setItem('nelov_community_posts_v1', JSON.stringify(next)); } catch {}
                  setCommunityTitle('');
                  setCommunityBody('');
                }}
                className={`rounded-2xl p-5 space-y-3 h-fit ${cardCls}`}
              >
                <h3 className="text-sm font-black">Post Doubt or Tip</h3>
                <select value={communityPostSubject} onChange={(e) => setCommunityPostSubject(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`}>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Strategy">Strategy</option>
                </select>
                <input value={communityTitle} onChange={(e) => setCommunityTitle(e.target.value)} placeholder="Title" required className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`} />
                <textarea rows={4} value={communityBody} onChange={(e) => setCommunityBody(e.target.value)} placeholder="Question or strategy note..." required className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`} />
                <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black">Post</button>
              </form>
            </div>
          )}

          {activeTab === 'feedback' && (
            <form onSubmit={handleSubmitFeedback} className={`max-w-2xl rounded-3xl p-6 space-y-4 ${cardCls}`}>
              <h3 className="text-lg font-black">Feedback &amp; Issue Reporter</h3>
              {feedbackDone && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold">Feedback submitted!</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={feedbackCat} onChange={(e) => setFeedbackCat(e.target.value)} className={`px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`}>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Question / Answer Key Issue">Question / Answer Key Issue</option>
                </select>
                <input value={feedbackRef} onChange={(e) => setFeedbackRef(e.target.value)} placeholder="Paper / Topic" className={`px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`} />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setFeedbackRating(s)} className={`px-3 py-1 rounded-lg border text-xs font-bold ${feedbackRating >= s ? 'border-amber-500/40 text-amber-400' : 'border-white/10'}`}>★ {s}</button>
                ))}
              </div>
              <textarea rows={4} required value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)} placeholder="Describe suggestion or issue..." className={`w-full px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10' : 'bg-white border-slate-200'}`} />
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black">Submit Feedback</button>
            </form>
          )}

          {activeTab === 'admin-uploader' && isStrictAdmin && (
            <VaultContentManager onClose={() => onNavigate('#/dashboard')} />
          )}
        </main>
      </div>

      {searchModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm" onClick={() => setSearchModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'bg-[#12172A] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Search className="w-5 h-5 text-indigo-400" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchModalOpen(false);
                  if (e.key === 'ArrowDown') setSearchHighlightIdx((p) => (filteredSearch.length ? (p + 1) % filteredSearch.length : 0));
                  if (e.key === 'ArrowUp') setSearchHighlightIdx((p) => (filteredSearch.length ? (p - 1 + filteredSearch.length) % filteredSearch.length : 0));
                  if (e.key === 'Enter' && filteredSearch[searchHighlightIdx]) handleSelectSearch(filteredSearch[searchHighlightIdx]);
                }}
                placeholder="Jump to any of 83 chapters, PTM 01–20, PTA 04–06, or tools..."
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filteredSearch.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSearch(item)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs ${idx === searchHighlightIdx ? 'bg-indigo-500/20' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${item.badgeClass}`}>{item.kind}</span>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{item.title}</div>
                      <div className={`text-[11px] truncate ${mutedText}`}>{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {freePassOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={() => setFreePassOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-md rounded-3xl p-6 border space-y-4 ${cardCls}`}>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase">FREE PASS · ₹0 FOREVER</span>
            <h3 className="text-xl font-black">100% Free Forever for Every Aspirant</h3>
            <p className={`text-xs leading-relaxed ${mutedText}`}>Curated by Nelov Mallick (IIT Delhi) — all 83 chapters, PTM/PTA mocks, Time-Sink analytics, and mistake logs are permanently unlocked at ₹0.</p>
            <button type="button" onClick={() => setFreePassOpen(false)} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Continue Studying Free</button>
          </div>
        </div>
      )}

      {profileSettingsOpen && user && (
        <div className="fixed inset-0 z-[135] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={() => setProfileSettingsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-md rounded-3xl p-6 border space-y-4 ${cardCls}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase text-indigo-400">Account Preferences</div>
                <h3 className="text-lg font-black">Profile Settings</h3>
              </div>
              <button type="button" onClick={() => setProfileSettingsOpen(false)} className="p-2 rounded-xl hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            {profileMsg && <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">{profileMsg}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSavingProfile(true);
                try {
                  await updateProfile({
                    name: editName,
                    targetExam: editTargetExam,
                    dailyQuestionGoal: editDailyGoal
                  });
                  dailyPlannerService.setDailyTarget(editDailyGoal, user.id);
                  setPlannerTick((t) => t + 1);
                  setProfileMsg('Profile saved!');
                  setTimeout(() => setProfileSettingsOpen(false), 500);
                } finally {
                  setSavingProfile(false);
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${isDark ? 'bg-[#0E1322] border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Target Exam</label>
                <select
                  value={editTargetExam}
                  onChange={(e) => setEditTargetExam(e.target.value as TargetExam)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${isDark ? 'bg-[#0E1322] border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                >
                  <option value="JEE 2027">JEE 2027</option>
                  <option value="JEE Mains">JEE Mains</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="Both">Both (Mains &amp; Advanced)</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Daily Question Goal</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={editDailyGoal}
                  onChange={(e) => setEditDailyGoal(Number(e.target.value))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${isDark ? 'bg-[#0E1322] border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setProfileSettingsOpen(false)} className="px-4 py-2 rounded-xl border border-white/10 font-bold">Cancel</button>
                <button type="submit" disabled={savingProfile} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white font-black">
                  {savingProfile ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
