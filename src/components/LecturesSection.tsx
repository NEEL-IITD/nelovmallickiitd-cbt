import React, { useState } from 'react';
import { allChapters, YOUTUBE_CHANNEL_URL } from '../data/lectures/lecturesIndex';
import { Tilt3DCard } from './ui/Tilt3DCard';

interface LecturesSectionProps {
  onSelectChapter?: (slug: string) => void;
  onBrowseAll?: () => void;
}

export const LecturesSection: React.FC<LecturesSectionProps> = ({
  onSelectChapter,
  onBrowseAll
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Mathematics'>('All');

  const filteredChapters = selectedSubject === 'All'
    ? allChapters.slice(0, 6)
    : allChapters.filter(ch => ch.subject === selectedSubject).slice(0, 6);

  const handleChapterClick = (slug: string) => {
    if (onSelectChapter) {
      onSelectChapter(slug);
    } else {
      window.location.hash = `#/lectures/${slug}`;
    }
  };

  const handleBrowseAllClick = () => {
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      window.location.hash = '#/lectures';
    }
  };

  const subjectBadges: Record<string, string> = {
    Chemistry: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Physics: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    Mathematics: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    General: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  };

  return (
    <section id="lectures" className="py-20 sm:py-28 relative bg-slate-50/60 dark:bg-[#0d0e12]/60 border-t border-slate-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
              <span>▶</span> Official YouTube Channel · 100% Free
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              Video Lectures & Chapter Masterclasses
            </h2>
            <p className="text-base text-slate-600 dark:text-zinc-400">
              Curated and taught by <strong>Nelov Mallick (IIT Delhi)</strong>. Watch complete chapter one-shots, reaction mechanisms, advanced problem sessions, and mock paper walk-throughs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
            >
              <span>▶</span> Visit YouTube Channel
            </a>
            <button
              onClick={handleBrowseAllClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-xs transition-colors"
            >
              Browse All {allChapters.length} Chapters →
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(['All', 'Chemistry', 'Physics', 'Mathematics'] as const).map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === subj
                  ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-slate-300'
              }`}
            >
              {subj === 'All' ? `All Chapters (${allChapters.length})` : subj}
            </button>
          ))}
        </div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredChapters.map(chapter => (
            <Tilt3DCard
              key={chapter.id}
              maxTilt={7}
              glare={true}
              onClick={() => handleChapterClick(chapter.slug)}
              className="cursor-pointer group flex flex-col justify-between"
            >
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Thumbnail & Video Count Badge */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/50 dark:border-zinc-800/80 shadow-inner group-hover:shadow-md transition-shadow">
                    <img
                      src={chapter.thumbnailUrl}
                      alt={chapter.chapterName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-lg shadow-xl shadow-red-600/50 transform group-hover:scale-110 transition-transform">
                        ▶
                      </div>
                    </div>

                    {/* Lecture count badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 shadow">
                      <span>🎞️</span> {chapter.lectureCount} Lectures
                    </div>
                  </div>

                  {/* Header & Subject */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${subjectBadges[chapter.subject] || subjectBadges.General}`}>
                        {chapter.subject}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-500">
                        100% Free Access
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                      {chapter.chapterName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                    <span>👨‍🏫</span> Nelov Mallick
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform">
                    Start Chapter →
                  </span>
                </div>

              </div>
            </Tilt3DCard>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-3xl border border-red-200/80 dark:border-red-900/50 bg-gradient-to-br from-red-50/50 via-white to-slate-50 dark:from-red-950/20 dark:via-[#121318] dark:to-[#0a0a0c] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-red-600/30">
              ▶
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-zinc-50">
                All 18 Chapter Playlists & 200+ Videos Are 100% Free
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Log in to keep track of completed lectures, resume from where you stopped, and write personal revision notes.
              </p>
            </div>
          </div>
          <button
            onClick={handleBrowseAllClick}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex-shrink-0"
          >
            Explore Complete Lecture Vault →
          </button>
        </div>

      </div>
    </section>
  );
};
