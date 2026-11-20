// ==============================================================================
// NelovMallickIITD · Level 2: Subject Chapters 3D Grid (Universal Component)
// Renders the chapter vault for Physics (28), Chemistry (29), or Mathematics (26)
// Parameterized by subject theme, search bar, and unit category filters
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { SubjectIcon } from './SubjectIcon';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

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

export const SubjectChaptersGrid: React.FC<SubjectChaptersGridProps> = ({
  subject,
  chapters,
  onSelectChapter,
  onBackToHub,
  onNavigateHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const config = SUBJECT_CONFIG[subject];

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach((ch) => {
      if (ch.category) set.add(ch.category);
    });
    return ['All', ...Array.from(set)];
  }, [chapters]);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return chapters.filter((ch) => {
      // Category filter
      if (selectedCategory !== 'All' && ch.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = ch.code.toLowerCase().includes(query);
        const matchesName = ch.name.toLowerCase().includes(query);
        const matchesCategory = ch.category?.toLowerCase().includes(query);
        const matchesDesc = ch.theory?.summary?.toLowerCase().includes(query);
        if (!matchesCode && !matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [chapters, selectedCategory, searchQuery]);

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
            Curated by <strong className="text-slate-900 dark:text-zinc-100">Nelov Mallick (IIT Delhi)</strong>. Each chapter contains dedicated Theory Notes and Online CBT Format Exercises ready for examination drills. 100% Free Forever.
          </p>
        </div>

        {/* Search Bar & Category Filter Bar */}
        <div className="bg-white dark:bg-[#121318] rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* Instant Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${subjectDisplayName} chapters by number (e.g. ${subject === 'chemistry' ? 'Ch 3, Ch 15' : subject === 'mathematics' ? 'C18, C21' : 'C8, C13'}) or topic name...`}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 text-sm font-semibold text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${config.searchFocus}`}
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

          {/* Unit Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? config.activePillClass
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat === 'All' ? `All (${chapters.length})` : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 px-1">
          <span>
            Showing {filteredChapters.length} of {chapters.length} Chapters
          </span>
          {searchQuery && (
            <span>Filtered by: &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>

        {/* Chapters 3D Grid (TestOnGo Style) */}
        {filteredChapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((ch) => {
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
                        border-2 border-slate-200/90 dark:border-zinc-800/90
                        ${config.borderBottomColor}
                        ${config.hoverBorderColor}
                        shadow-[0_10px_25px_-8px_rgba(0,0,0,0.06)]
                        hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]
                        p-6 transition-all duration-300 ease-out`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Top Header & Badges */}
                      <div className="relative z-10 space-y-4" style={{ transform: 'translateZ(20px)' }}>
                        <div className="flex items-center justify-between">
                          
                          {/* 3D Elevated Icon Pedestal (TestOnGo Style) */}
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center
                              bg-gradient-to-tr ${config.pedestalBg} text-white
                              border border-white/30 dark:border-white/10
                              ${config.pedestalBorderBottom}
                              shadow-md group-hover:scale-110 transition-transform`}
                          >
                            <SubjectIcon name={ch.iconName} className="w-6 h-6" />
                          </div>

                          {/* Category Badge */}
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/90 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                            {ch.category}
                          </span>
                        </div>

                        {/* Chapter Code & Name */}
                        <div className="space-y-1 text-left">
                          <span className={`text-xs font-black tracking-widest ${config.accentText}`}>
                            {ch.code}
                          </span>
                          <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {ch.name}
                          </h3>
                        </div>

                        {/* Chapter Summary Snippet */}
                        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed text-left">
                          {ch.theory?.summary || 'Comprehensive theory notes and timed online CBT exercise test drills.'}
                        </p>
                      </div>

                      {/* Bottom Metadata & CTA */}
                      <div className="pt-5 mt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold" style={{ transform: 'translateZ(25px)' }}>
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
              No chapters match your search query
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              Try searching with another keyword or resetting the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
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
