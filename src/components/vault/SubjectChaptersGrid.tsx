// ==============================================================================
// NelovMallickIITD · Level 2: Subject Chapters 3D Grid (Universal Component)
// Renders the chapter vault for Physics (28), Chemistry (29), or Mathematics (26)
// Features: Weightage-Based 3D Glows + Live Per-Chapter Mini Progress Dashboard
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SubjectIcon } from './SubjectIcon';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { Search, ArrowRight, Sparkles, CheckCircle2, Circle, Trophy, Award, CheckSquare, BarChart3, Filter, ArrowUpDown } from 'lucide-react';
import { chapterProgressService, PROGRESS_UPDATED_EVENT } from '../../services/chapterProgressService';

export interface SubjectChaptersGridProps {
  subject: 'physics' | 'chemistry' | 'mathematics';
  chapters: any[];
  onSelectChapter: (chapterId: string) => void;
  onBackToHub?: () => void;
  onNavigateHome?: () => void;
}

const SUBJECT_CONFIG = {
  physics: {
    title: 'Physics Resources Chapterwise',
    examTag: 'JEE MAINS + ADVANCED',
    totalChapters: 28,
    primaryColor: '#2563EB',
    badgeText: '28 Chapters Available',
    gradientText: 'from-blue-600 via-indigo-600 to-indigo-700',
    borderBottomColor: 'border-b-blue-600 dark:border-b-blue-500',
    pedestalBorderBottom: 'border-b-blue-800 dark:border-b-blue-950',
    pedestalBg: 'from-blue-600 via-indigo-600 to-indigo-700',
    hoverBorderColor: 'hover:border-blue-400 dark:hover:border-blue-500',
    accentText: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    searchFocus: 'focus:border-blue-500 focus:ring-blue-500/20',
    activePillClass: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
  },
  chemistry: {
    title: 'Chemistry Resources Chapterwise',
    examTag: 'JEE MAINS + ADVANCED',
    totalChapters: 29,
    primaryColor: '#059669',
    badgeText: '29 Chapters Available',
    gradientText: 'from-emerald-600 via-teal-600 to-teal-700',
    borderBottomColor: 'border-b-emerald-600 dark:border-b-emerald-500',
    pedestalBorderBottom: 'border-b-emerald-800 dark:border-b-emerald-950',
    pedestalBg: 'from-emerald-600 via-teal-600 to-teal-700',
    hoverBorderColor: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    searchFocus: 'focus:border-emerald-500 focus:ring-emerald-500/20',
    activePillClass: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
  },
  mathematics: {
    title: 'Mathematics Resources Chapterwise',
    examTag: 'JEE MAINS + ADVANCED',
    totalChapters: 26,
    primaryColor: '#7C3AED',
    badgeText: '26 Chapters Available',
    gradientText: 'from-violet-600 via-purple-600 to-fuchsia-600',
    borderBottomColor: 'border-b-violet-600 dark:border-b-violet-500',
    pedestalBorderBottom: 'border-b-violet-800 dark:border-b-violet-950',
    pedestalBg: 'from-violet-600 via-purple-600 to-fuchsia-600',
    hoverBorderColor: 'hover:border-violet-400 dark:hover:border-violet-500',
    accentText: 'text-violet-600 dark:text-violet-400',
    badgeClass: 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    btnClass: 'bg-violet-600 hover:bg-violet-700 text-white',
    searchFocus: 'focus:border-violet-500 focus:ring-violet-500/20',
    activePillClass: 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
  }
};

// Weightage Visual Profiles
const WEIGHTAGE_THEMES = {
  high: {
    label: 'High Weightage',
    badgeText: '⭐ High Weightage',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    cardBorder: 'border-amber-400/80 dark:border-amber-500/60',
    borderBottom: 'border-b-4 border-b-amber-500 dark:border-b-amber-500',
    haloShadow: 'shadow-[0_10px_25px_-5px_rgba(245,158,11,0.22),0_0_15px_1px_rgba(255,122,0,0.12)]',
    hoverShadow: 'hover:shadow-[0_20px_35px_-8px_rgba(245,158,11,0.38),0_0_25px_3px_rgba(255,122,0,0.22)]',
    progressBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    dotColor: 'bg-amber-500'
  },
  mid: {
    label: 'Mid Weightage',
    badgeText: '🔹 Mid Weightage',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10',
    glowColor: 'rgba(6, 182, 212, 0.3)',
    cardBorder: 'border-cyan-400/70 dark:border-cyan-500/50',
    borderBottom: 'border-b-4 border-b-cyan-500 dark:border-b-cyan-500',
    haloShadow: 'shadow-[0_10px_25px_-5px_rgba(6,182,212,0.18),0_0_12px_1px_rgba(59,130,246,0.1)]',
    hoverShadow: 'hover:shadow-[0_20px_35px_-8px_rgba(6,182,212,0.32),0_0_20px_2px_rgba(59,130,246,0.18)]',
    progressBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    dotColor: 'bg-cyan-500'
  },
  low: {
    label: 'Low Weightage',
    badgeText: '🟢 Low Weightage',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    cardBorder: 'border-emerald-400/60 dark:border-emerald-500/40',
    borderBottom: 'border-b-4 border-b-emerald-500 dark:border-b-emerald-500',
    haloShadow: 'shadow-[0_10px_25px_-5px_rgba(16,185,129,0.15),0_0_10px_1px_rgba(20,184,166,0.08)]',
    hoverShadow: 'hover:shadow-[0_20px_35px_-8px_rgba(16,185,129,0.28),0_0_18px_2px_rgba(20,184,166,0.15)]',
    progressBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    dotColor: 'bg-emerald-500'
  }
};

export const SubjectChaptersGrid: React.FC<SubjectChaptersGridProps> = ({
  subject,
  chapters,
  onSelectChapter,
  onBackToHub,
  onNavigateHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWeightage, setSelectedWeightage] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'weightage' | 'completed' | 'lowest'>('default');
  const [progressTick, setProgressTick] = useState(0);

  const config = SUBJECT_CONFIG[subject] || SUBJECT_CONFIG.physics;

  // Listen to live progress changes across the application
  useEffect(() => {
    const handleProgressUpdate = () => {
      setProgressTick((prev) => prev + 1);
    };
    window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    chapterProgressService.fetchProgressFromSupabase().then(() => {
      setProgressTick((prev) => prev + 1);
    });
    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    };
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach((ch) => {
      if (ch.category) set.add(ch.category);
    });
    return ['All', ...Array.from(set)];
  }, [chapters]);

  // Read progress and tests count for all chapters
  const chaptersWithStats = useMemo(() => {
    return chapters.map((ch) => {
      const stats = chapterProgressService.getChapterProgress(
        subject,
        ch.id,
        ch.code,
        ch.exercises
      );
      return {
        ...ch,
        checklist: stats.checklist,
        progressPercent: stats.progressPercent,
        testsGivenCount: stats.testsGivenCount,
        weightage: (ch.weightage || 'mid') as 'high' | 'mid' | 'low'
      };
    });
  }, [chapters, subject, progressTick]);

  // Overall Subject Progress Stats
  const subjectOverview = useMemo(() => {
    const total = chaptersWithStats.length || 1;
    const sumPct = chaptersWithStats.reduce((acc, ch) => acc + (ch.progressPercent || 0), 0);
    const avgPct = Math.round(sumPct / total);
    const startedCount = chaptersWithStats.filter((ch) => (ch.progressPercent || 0) > 0).length;
    const masteredCount = chaptersWithStats.filter((ch) => (ch.progressPercent || 0) === 100).length;
    const totalTestsCount = chaptersWithStats.reduce((acc, ch) => acc + (ch.testsGivenCount || 0), 0);

    const highCount = chaptersWithStats.filter((ch) => ch.weightage === 'high').length;
    const midCount = chaptersWithStats.filter((ch) => ch.weightage === 'mid').length;
    const lowCount = chaptersWithStats.filter((ch) => ch.weightage === 'low').length;

    return {
      avgPct,
      startedCount,
      masteredCount,
      totalTestsCount,
      highCount,
      midCount,
      lowCount,
      totalChapters: total
    };
  }, [chaptersWithStats]);

  // Filtered and Sorted chapters
  const processedChapters = useMemo(() => {
    let result = chaptersWithStats.filter((ch) => {
      // Weightage filter
      if (selectedWeightage !== 'all' && ch.weightage !== selectedWeightage) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && ch.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = (ch.code || '').toLowerCase().includes(query);
        const matchesName = (ch.name || '').toLowerCase().includes(query);
        const matchesCategory = (ch.category || '').toLowerCase().includes(query);
        const matchesDesc = (ch.theory?.summary || '').toLowerCase().includes(query);
        if (!matchesCode && !matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortBy === 'weightage') {
      const order: Record<string, number> = { high: 0, mid: 1, low: 2 };
      result.sort((a, b) => (order[a.weightage] ?? 1) - (order[b.weightage] ?? 1));
    } else if (sortBy === 'completed') {
      result.sort((a, b) => (b.progressPercent || 0) - (a.progressPercent || 0));
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => (a.progressPercent || 0) - (b.progressPercent || 0));
    } else {
      // Default syllabus order (chapterNumber or C1..C28)
      result.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    }

    return result;
  }, [chaptersWithStats, selectedWeightage, selectedCategory, searchQuery, sortBy]);

  // Milestone toggle handler
  const handleToggleMilestone = useCallback(
    (e: React.MouseEvent, chapterId: string, milestoneKey: 'notes' | 'formula' | 'pyqs' | 'tests', currentValue: boolean) => {
      e.stopPropagation();
      chapterProgressService.setMilestone(subject, chapterId, milestoneKey, !currentValue);
      setProgressTick((prev) => prev + 1);
    },
    [subject]
  );

  const subjectDisplayName = subject.charAt(0).toUpperCase() + subject.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0e] text-slate-900 dark:text-zinc-50 pt-6 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Interactive Breadcrumb Trail */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </button>
            <span>›</span>
            <button
              type="button"
              onClick={onBackToHub}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Study Resources
            </button>
            <span>›</span>
            <span className={`font-extrabold ${config.accentText}`}>
              {subjectDisplayName} Resources ({config.totalChapters} Chapters)
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${config.badgeClass}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {config.badgeText}
            </span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              {config.title} · {config.examTag}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
            Complete{' '}
            <span className={`bg-gradient-to-r ${config.gradientText} bg-clip-text text-transparent`}>
              {config.totalChapters} Chapters Vault
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Curated by <strong className="text-slate-900 dark:text-zinc-100">Nelov Mallick (IIT Delhi)</strong>. Each chapter contains dedicated Theory Notes, interactive 4-milestone mastery tracking, and CBT drill exercises. 100% Free Forever.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SUBJECT OVERVIEW STRIP: Overall Subject Completion & Stats               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-[#121318] rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm">
          {/* Card 1: Overall Completion */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Subject Mastery</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">{subjectOverview.avgPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${subjectOverview.avgPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Overall progress across all {subjectOverview.totalChapters} chapters
              </p>
            </div>
          </div>

          {/* Card 2: Chapters Mastered / Started */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Chapters Status
              </div>
              <div className="text-base font-black text-slate-900 dark:text-zinc-100">
                {subjectOverview.startedCount} <span className="text-xs font-semibold text-slate-500">/ {subjectOverview.totalChapters} Started</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                ⭐ {subjectOverview.masteredCount} Mastered (100%)
              </p>
            </div>
          </div>

          {/* Card 3: Total Tests Practiced */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                CBT Drills Given
              </div>
              <div className="text-base font-black text-slate-900 dark:text-zinc-100">
                {subjectOverview.totalTestsCount} <span className="text-xs font-semibold text-slate-500">Tests Attempted</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Real-time submitted chapter exams
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTROLS BAR: Search, Weightage Filter, Category Filter, and Sorting      */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-[#121318] rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* Row 1: Search Bar & Quick Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${subjectDisplayName} chapters by code (e.g. ${subject === 'chemistry' ? 'Ch 3, Ch 15' : subject === 'mathematics' ? 'C18, C21' : 'C8, C13'}) or topic name...`}
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 text-sm font-semibold text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${config.searchFocus}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3 py-2.5">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <label htmlFor="sort-dropdown" className="text-xs font-bold text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="default">Default Syllabus Order</option>
                <option value="weightage">High Weightage First</option>
                <option value="completed">Most Completed First</option>
                <option value="lowest">Needs Work (Lowest %)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Weightage-Based 3D Filter Pills */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              <span>Weightage Filter & 3D Glow Legend</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedWeightage('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedWeightage === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                All Chapters ({chapters.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedWeightage('high')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                  selectedWeightage === 'high'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>High Weightage ({subjectOverview.highCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWeightage('mid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                  selectedWeightage === 'mid'
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/50'
                    : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Mid Weightage ({subjectOverview.midCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWeightage('low')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                  selectedWeightage === 'low'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Low Weightage ({subjectOverview.lowCount})</span>
              </button>
            </div>
          </div>

          {/* Row 3: Unit Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100 dark:border-zinc-800/80">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? config.activePillClass
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat === 'All' ? `All Units (${chapters.length})` : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Count & Active Filter Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 px-1">
          <span>
            Showing {processedChapters.length} of {chapters.length} Chapters
          </span>
          {(searchQuery || selectedWeightage !== 'all' || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedWeightage('all');
                setSelectedCategory('All');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CHAPTERS 3D GRID: Weightage Glows + Per-Chapter Mini Progress Dashboard   */}
        {/* ========================================================================= */}
        {processedChapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedChapters.map((ch) => {
              const wTheme = (WEIGHTAGE_THEMES as any)[ch.weightage] || WEIGHTAGE_THEMES.mid;
              const isMastered = (ch.progressPercent || 0) === 100;

              return (
                <div key={ch.id} className="w-full flex">
                  <Tilt3DCard
                    maxTilt={5}
                    scale={1.02}
                    perspective={1200}
                    className="group cursor-pointer w-full flex flex-col justify-between"
                    onClick={() => onSelectChapter(ch.id)}
                  >
                    <div
                      className={`relative flex flex-col justify-between h-full overflow-hidden rounded-2xl bg-white dark:bg-[#121318]
                        border-2 ${wTheme.cardBorder}
                        ${wTheme.borderBottom}
                        ${wTheme.haloShadow}
                        ${wTheme.hoverShadow}
                        hover:-translate-y-1.5
                        p-5 sm:p-6 transition-all duration-300 ease-out select-none`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Top Ambient Backlight Glow on Hover */}
                      <div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"
                        style={{ background: wTheme.glowColor }}
                      />

                      {/* Header Section: Icons & Badges */}
                      <div className="relative z-10 space-y-3" style={{ transform: 'translateZ(20px)' }}>
                        <div className="flex items-center justify-between gap-2">
                          
                          {/* 3D Elevated Icon Pedestal */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center
                              bg-gradient-to-tr ${config.pedestalBg} text-white
                              border border-white/30 dark:border-white/10
                              ${config.pedestalBorderBottom}
                              shadow-md group-hover:scale-110 transition-transform`}
                          >
                            <SubjectIcon name={ch.iconName} className="w-5 h-5" />
                          </div>

                          {/* Weightage Badge & Category Badge */}
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${wTheme.badgeClass}`}>
                              {wTheme.badgeText}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                              {ch.category}
                            </span>
                          </div>
                        </div>

                        {/* Chapter Code & Name */}
                        <div className="space-y-1 text-left">
                          <span className={`text-xs font-black tracking-widest ${config.accentText}`}>
                            {ch.code}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {ch.name}
                          </h3>
                        </div>

                        {/* Summary Snippet */}
                        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed text-left">
                          {ch.theory?.summary || 'Comprehensive theory notes and timed online CBT exercise drills.'}
                        </p>
                      </div>

                      {/* =================================================================== */}
                      {/* PER-CHAPTER MINI PROGRESS DASHBOARD                                 */}
                      {/* =================================================================== */}
                      <div
                        className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/90 dark:border-zinc-800 relative z-10 space-y-2.5"
                        style={{ transform: 'translateZ(25px)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Progress Header: Percentage Bar + Tests Given Badge */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-black text-slate-800 dark:text-zinc-200">
                            {isMastered ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                100% Mastered! 🎉
                              </span>
                            ) : (
                              <span>{ch.progressPercent || 0}% Done</span>
                            )}
                          </div>

                          {/* Tests Given Counter Badge */}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-xs">
                            <span>📝</span>
                            <span>{ch.testsGivenCount || 0} Tests Given</span>
                          </span>
                        </div>

                        {/* Animated Slim Progress Bar */}
                        <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ease-out ${
                              isMastered
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : wTheme.progressBg
                            }`}
                            style={{ width: `${ch.progressPercent || 0}%` }}
                          />
                        </div>

                        {/* 4 Interactive Mastery Checkboxes (Each 25%) */}
                        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                          {/* 1. Theory Notes */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleMilestone(e, ch.id, 'notes', Boolean(ch.checklist?.notes))}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-left transition-all border ${
                              ch.checklist?.notes
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : 'bg-white dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/80 hover:bg-slate-100'
                            }`}
                          >
                            {ch.checklist?.notes ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">Theory Notes</span>
                          </button>

                          {/* 2. Formula Sheet */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleMilestone(e, ch.id, 'formula', Boolean(ch.checklist?.formula))}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-left transition-all border ${
                              ch.checklist?.formula
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : 'bg-white dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/80 hover:bg-slate-100'
                            }`}
                          >
                            {ch.checklist?.formula ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">Formula Sheet</span>
                          </button>

                          {/* 3. PYQs Solved */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleMilestone(e, ch.id, 'pyqs', Boolean(ch.checklist?.pyqs))}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-left transition-all border ${
                              ch.checklist?.pyqs
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : 'bg-white dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/80 hover:bg-slate-100'
                            }`}
                          >
                            {ch.checklist?.pyqs ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">PYQs Solved</span>
                          </button>

                          {/* 4. Chapter Test Practiced */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleMilestone(e, ch.id, 'tests', Boolean(ch.checklist?.tests))}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-left transition-all border ${
                              ch.checklist?.tests
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : 'bg-white dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/80 hover:bg-slate-100'
                            }`}
                          >
                            {ch.checklist?.tests ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">Mock Practiced</span>
                          </button>
                        </div>
                      </div>

                      {/* Bottom Metadata & CTA */}
                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold relative z-10" style={{ transform: 'translateZ(20px)' }}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] font-bold">
                          {ch.badgeText}
                        </span>
                        
                        <div className={`inline-flex items-center gap-1 font-extrabold ${config.accentText} group-hover:translate-x-1 transition-transform`}>
                          <span>Open Chapter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                    </div>
                  </Tilt3DCard>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              No chapters match your search query or filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              Try resetting the search query, weightage filter, or unit category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedWeightage('all');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
