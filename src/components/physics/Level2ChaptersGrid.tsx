// ==============================================================================
// NelovMallickIITD · Level 2: 28 Chapter 3D Boxes Grid
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Displays:
// - 28 individual 3D boxes with icons, badges (C1–C28), names, metadata
// - Interactive search bar filtering by chapter number, name, or unit
// - Unit category filter tabs (Mechanics, Thermal, Waves, Electromagnetism, etc.)
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { physicsChaptersData, PhysicsUnitCategory } from '../../data/physicsChapters';
import { PhysicsCard3D } from './PhysicsCard3D';
import {
  Search,
  Atom,
  ChevronRight,
  X
} from 'lucide-react';

interface Level2ChaptersGridProps {
  onSelectChapter: (chapterId: string) => void;
  onNavigateHome: () => void;
}

export const Level2ChaptersGrid: React.FC<Level2ChaptersGridProps> = ({
  onSelectChapter,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PhysicsUnitCategory>('All');

  // Categories list
  const categories: Array<'All' | PhysicsUnitCategory> = [
    'All',
    'General Physics',
    'Mechanics',
    'Thermal Physics',
    'Waves & Oscillations',
    'Electromagnetism',
    'Optics',
    'Modern Physics',
  ];

  // Filtered chapters calculation
  const filteredChapters = useMemo(() => {
    return physicsChaptersData.filter(ch => {
      // Category filter
      if (selectedCategory !== 'All' && ch.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = ch.code.toLowerCase().includes(q);
        const matchesName = ch.name.toLowerCase().includes(q);
        const matchesCategory = ch.category.toLowerCase().includes(q);
        const matchesBadge = ch.badgeText.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesCategory && !matchesBadge) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#080B14] py-8 sm:py-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              Physics Resources (C1–C28)
            </span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            28 Chapters Available
          </span>
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-wide uppercase shadow-sm">
            <Atom className="w-4 h-4 text-indigo-500 animate-[spin_10s_linear_infinite]" />
            Physics Resources Chapterwise · JEE Mains + Advanced
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Complete <span className="text-indigo-600 dark:text-indigo-400">28 Chapters</span> Vault
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Curated by <strong>Nelov Mallick (IIT Delhi)</strong>. Each chapter contains dedicated <strong>Theory Notes</strong> and <strong>Online CBT Format Exercises</strong> ready for examination drills. 100% Free Forever.
          </p>
        </div>

        {/* Search Bar & Category Filters Container */}
        <div className="space-y-4 pt-2">
          
          {/* Clean Search Input */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters by number (e.g. C8, C13) or name (e.g. Rotational, Electrostatics, Optics)..."
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-[#12172A] border border-slate-200/90 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Unit / Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                      : 'bg-white dark:bg-[#12172A] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat} {cat === 'All' ? `(28)` : ''}
                </button>
              );
            })}
          </div>

          {/* Active Filter Counter */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400 px-2">
            <span>
              Showing <strong className="text-slate-800 dark:text-zinc-200">{filteredChapters.length}</strong> of 28 Chapters
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>

        {/* 28 Chapter 3D Boxes Grid */}
        {filteredChapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {filteredChapters.map((chapter) => (
              <PhysicsCard3D
                key={chapter.id}
                iconName={chapter.iconName}
                badge={chapter.code}
                category={chapter.category}
                title={chapter.name}
                subtitle={chapter.theory.summary}
                metadata={chapter.badgeText}
                accentColor={chapter.colorTheme.accent}
                glowColor={chapter.colorTheme.glow}
                actionText="Open Chapter"
                onClick={() => onSelectChapter(chapter.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#12172A] rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-200">
              No Physics Chapters Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              No chapter matched "{searchQuery}". Try searching by chapter code like "C1" or topic like "Rotational".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
