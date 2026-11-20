import React, { useState, useMemo, useEffect } from 'react';
import { allStudyResources, StudyResource, SubjectType, ExamTargetType, ResourceCategory } from '../data/resourcesIndex';
import { Tilt3DCard } from './ui/Tilt3DCard';
import { StudyResourcesVaultShowcase } from './vault/StudyResourcesVaultShowcase';

interface ResourcesHubProps {
  onBackToHome: () => void;
  onOpenAuth: (title?: string) => void;
  user: any; // User profile
}

export const ResourcesHub: React.FC<ResourcesHubProps> = ({ onBackToHome, onOpenAuth, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<'All' | ExamTargetType>('All');
  const [selectedSubject, setSelectedSubject] = useState<'All' | SubjectType>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ResourceCategory>('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeReadingResource, setActiveReadingResource] = useState<StudyResource | null>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const storageKey = user ? `nelov_bookmarks_${user.id}` : 'nelov_bookmarks_guest';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const storageKey = user ? `nelov_bookmarks_${user.id}` : 'nelov_bookmarks_guest';
      const updated = bookmarkedIds.includes(id)
        ? bookmarkedIds.filter(bId => bId !== id)
        : [...bookmarkedIds, id];
      setBookmarkedIds(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenResource = (resource: StudyResource) => {
    if (!user) {
      onOpenAuth(`Sign in to access ${resource.title}`);
      return;
    }
    setActiveReadingResource(resource);
  };

  const filteredResources = useMemo(() => {
    return allStudyResources.filter(item => {
      if (showBookmarksOnly && !bookmarkedIds.includes(item.id)) return false;
      if (selectedExam !== 'All' && item.examTarget !== 'Both' && item.examTarget !== selectedExam) return false;
      if (selectedSubject !== 'All' && item.subject !== selectedSubject) return false;
      if (selectedCategory !== 'All' && item.resourceType !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(q);
        const matchesSubject = item.subject.toLowerCase().includes(q);
        const matchesTopic = item.topicsCovered.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubtitle && !matchesSubject && !matchesTopic) return false;
      }
      return true;
    });
  }, [selectedExam, selectedSubject, selectedCategory, showBookmarksOnly, bookmarkedIds, searchQuery]);

  const getSubjectColorClasses = (subject: SubjectType) => {
    switch (subject) {
      case 'Physics':
        return {
          tab: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
          watermark: 'text-blue-600',
          dot: 'bg-blue-500',
          pill: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
      case 'Chemistry':
        return {
          tab: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          watermark: 'text-emerald-600',
          dot: 'bg-emerald-500',
          pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'Mathematics':
        return {
          tab: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
          watermark: 'text-purple-600',
          dot: 'bg-purple-500',
          pill: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
    }
  };

  const getSubjectIcon = (subject: SubjectType) => {
    switch (subject) {
      case 'Physics':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Chemistry':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Mathematics':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0e] text-slate-900 dark:text-zinc-50 pt-20 pb-28">
      {/* Top Banner / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 hover:border-indigo-500 shadow-sm transition-all"
          >
            <span>←</span>
            <span>Back to Homepage</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Free Materials Forever
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Study Resources & <span className="text-indigo-600 dark:text-indigo-400">Formula Vault</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400">
            Comprehensive formula sheets, reaction mechanisms, and NCERT trends. Derived with full KaTeX equations by <strong className="font-semibold text-slate-900 dark:text-zinc-100">Nelov Mallick (IIT Delhi)</strong>.
          </p>
        </div>

        {/* Level 1: 3 Subject Vaults 3D Showcase (Physics, Chemistry, Maths) */}
        <div className="mb-10">
          <StudyResourcesVaultShowcase
            onOpenSubject={(subject) => {
              window.location.hash = `#/resources/${subject}`;
            }}
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-[#12131a] rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm mb-10 space-y-5">
          {/* Search Input */}
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas, reaction mechanisms, conics, calculus, electrostatics..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills Grid */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase mr-1">Subject:</span>
              {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map(sub => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSubject === sub
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Exam Target Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase mr-1">Exam:</span>
              {(['All', 'JEE Mains', 'JEE Advanced'] as const).map(exam => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setSelectedExam(exam)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedExam === exam
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>

            {/* Bookmarked Filter */}
            <button
              type="button"
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>⭐</span>
              <span>Bookmarks ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#12131a] rounded-2xl border border-slate-200 dark:border-zinc-800">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-zinc-200">No resources matched your criteria</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Try clearing your search query or adjusting your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedExam('All');
                setSelectedSubject('All');
                setSelectedCategory('All');
                setShowBookmarksOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item) => {
              const colors = getSubjectColorClasses(item.subject);
              const isBookmarked = bookmarkedIds.includes(item.id);

              return (
                <Tilt3DCard
                  key={item.id}
                  maxTilt={7}
                  perspective={1000}
                  className="group relative rounded-2xl border border-slate-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#111217] shadow-[0_1px_3px_rgba(15,17,23,0.05)] hover:border-indigo-500/40 hover:shadow-[0_16px_36px_-16px_rgba(79,70,229,0.22)] transition-[box-shadow,border-color] duration-500 overflow-hidden flex flex-col justify-between p-6 sm:p-7 min-h-[320px]"
                >
                  {/* Subtle Blueprint Grid Background */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-700 group-hover:opacity-75 dark:group-hover:opacity-40"
                    style={{
                      backgroundImage:
                        'radial-gradient(ellipse 95% 85% at 100% 0%, transparent 2%, rgba(255,255,255,0.05) 66%), linear-gradient(rgba(100,116,139,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.1) 1px, transparent 1px)',
                      backgroundSize: '100% 100%, 20px 20px, 20px 20px'
                    }}
                  />

                  {/* Hanging Top-Left Bookmark Tab */}
                  <div
                    className={`absolute top-0 left-6 w-9 h-11 ${colors.tab} rounded-b-xl flex items-end justify-center pb-2 shadow-sm border-b border-x border-black/5 dark:border-white/5 transition-transform duration-300 group-hover:translate-y-0.5`}
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    {getSubjectIcon(item.subject)}
                  </div>

                  {/* Top-Right Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(item.id, e)}
                    className="absolute top-5 right-6 w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center justify-center text-xs transition-colors shadow-sm z-20"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Sheet'}
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    {isBookmarked ? '⭐' : '☆'}
                  </button>

                  {/* Card Main Info */}
                  <div className="pt-6 relative z-10 space-y-3" style={{ transform: 'translateZ(18px)' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${colors.pill}`}>
                        {item.subject}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                        {item.resourceType}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium ml-auto">
                        ⏱️ {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>

                    {/* Topic Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.topicsCovered.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div
                    className="pt-5 mt-5 border-t border-slate-100 dark:border-zinc-800/80 relative z-10 flex items-center justify-between gap-3"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenResource(item)}
                      className="flex-1 py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Read Online</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleOpenResource(item);
                        setTimeout(() => window.print(), 600);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 text-slate-600 dark:text-zinc-400 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Print or Save as PDF"
                    >
                      <span>🖨️</span>
                      <span>PDF</span>
                    </button>
                  </div>

                  {/* Bottom-Right Rotated Watermark Icon */}
                  <div
                    className={`pointer-events-none absolute -bottom-8 -right-8 w-28 h-28 opacity-[0.06] group-hover:opacity-[0.14] group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500 ${colors.watermark}`}
                    style={{ transform: 'translateZ(5px)' }}
                  >
                    {getSubjectIcon(item.subject)}
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>
        )}

      </div>

      {/* Interactive Resource Reader Modal */}
      {activeReadingResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#121319] rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 dark:bg-[#121319]/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activeReadingResource.subject} · {activeReadingResource.resourceType}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                  {activeReadingResource.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeReadingResource.id)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm"
                  title="Bookmark"
                >
                  {bookmarkedIds.includes(activeReadingResource.id) ? '⭐' : '☆'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5"
                >
                  <span>🖨️</span>
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReadingResource(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body / Markdown + KaTeX content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 dark:text-zinc-200 leading-relaxed font-sans prose prose-slate dark:prose-invert max-w-none">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span>📚 <strong>Author:</strong> Nelov Mallick (IIT Delhi)</span>
                <span>⏱️ <strong>Read Time:</strong> {activeReadingResource.readTime}</span>
                <span>🎯 <strong>Exam Target:</strong> {activeReadingResource.examTarget}</span>
              </div>

              <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm bg-slate-50 dark:bg-[#0d0e12] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-x-auto">
                {activeReadingResource.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900/80 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>NelovMallickIITD · 100% Free Authentic Revision Engine</span>
              <button
                type="button"
                onClick={() => setActiveReadingResource(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold hover:opacity-90"
              >
                Close Sheet
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
