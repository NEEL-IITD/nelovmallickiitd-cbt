import React, { useState, useMemo } from 'react';
import { allChapters, ChapterPlaylist, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_ID } from '../data/lectures/lecturesIndex';
import { Tilt3DCard } from './ui/Tilt3DCard';
import { studentStorage } from '../utils/studentStorage';

interface LecturesHubProps {
  currentUser?: any;
  onSelectChapter?: (slug: string) => void;
  onBackToHome?: () => void;
  openAuth?: (mode: 'login' | 'signup') => void;
}

export const LecturesHub: React.FC<LecturesHubProps> = ({
  currentUser,
  onSelectChapter,
  onBackToHome,
  openAuth
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Mathematics'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch student progress for all chapters
  const progressData = useMemo(() => {
    if (!currentUser?.id) return {};
    return studentStorage.getLectureProgress(currentUser.id);
  }, [currentUser]);

  // Filtered chapters based on subject and search query
  const filteredChapters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allChapters.filter(ch => {
      const matchSubject = selectedSubject === 'All' || ch.subject === selectedSubject;
      if (!matchSubject) return false;
      if (!q) return true;

      // Match chapter name or description
      if (ch.chapterName.toLowerCase().includes(q) || ch.description.toLowerCase().includes(q)) {
        return true;
      }

      // Match individual lecture titles
      return ch.lectures.some(l => l.title.toLowerCase().includes(q));
    });
  }, [selectedSubject, searchQuery]);

  const handleCardClick = (slug: string) => {
    if (onSelectChapter) {
      onSelectChapter(slug);
    } else {
      window.location.hash = `#/lectures/${slug}`;
    }
  };

  const subjectBadges: Record<string, string> = {
    Chemistry: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Physics: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    Mathematics: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    General: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  };

  // Calculate total completed lectures
  const totalCompleted = useMemo(() => {
    if (!currentUser?.id) return 0;
    return Object.values(progressData).filter((p: any) => p && p.completed).length;
  }, [currentUser, progressData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans selection:bg-red-500 selection:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onBackToHome ? onBackToHome() : (window.location.hash = '#/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            ← Return to Test Library
          </button>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              ✓ 100% Free Open Educational Resource
            </span>
          </div>
        </div>

        {/* Educator Channel Banner */}
        <div className="relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Nelov Mallick Portrait */}
            <div className="relative flex-shrink-0">
              <img
                src="/images/nelov-mallick.png"
                alt="Nelov Mallick"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover object-top ring-4 ring-red-500/20 shadow-2xl"
              />
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                IIT Delhi
              </span>
            </div>

            {/* Channel Info & Description */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <span>▶</span> YouTube Lectures Hub · Channel ID: {YOUTUBE_CHANNEL_ID}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight pt-1">
                    Nelov Mallick (IIT Delhi)
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-zinc-400">
                    Founder & Academic Director · Complete JEE Mains & Advanced Video Vault
                  </p>
                </div>

                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all flex-shrink-0"
                >
                  <span>▶</span> Visit YouTube Channel
                </a>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
                Master complete organic reaction mechanisms, physical chemistry equilibrium, advanced problem-solving sessions, and mock test walk-throughs. Every lecture is 100% free with zero paywalls.
              </p>

              {/* Progress Summary if Logged In */}
              {currentUser ? (
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1.5">
                    <span>🎓</span> Logged in as: <strong className="text-slate-900 dark:text-zinc-100">{currentUser.name}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>✅</span> Total Completed: <strong className="text-rose-600 dark:text-rose-400">{totalCompleted} Lectures</strong>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-zinc-800/80">
                  <span>🔒 Log in to mark lectures complete, save revision notes, and track chapter progress.</span>
                  <button
                    onClick={() => openAuth?.('login')}
                    className="font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Sign In Free →
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Subject Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(['All', 'Chemistry', 'Physics', 'Mathematics'] as const).map(subj => {
                const count = subj === 'All' ? allChapters.length : allChapters.filter(c => c.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedSubject === subj
                        ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    {subj === 'All' ? `All Chapters (${allChapters.length})` : `${subj} (${count})`}
                  </button>
                );
              })}
            </div>

            {/* Instant Search Bar */}
            <div className="relative min-w-[280px] sm:min-w-[340px]">
              <input
                type="text"
                placeholder="Search chapters or lecture topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] text-xs font-medium text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm"
              />
              <span className="absolute left-3.5 top-3 text-slate-400 text-xs">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400">
            Showing <strong>{filteredChapters.length}</strong> chapter playlists {searchQuery && `matching "${searchQuery}"`}
          </div>
        </div>

        {/* Chapters Grid with 3D Depth */}
        {filteredChapters.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-8 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">No chapters found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No playlists matched "{searchQuery}". Try searching for keywords like "Aldehydes", "Equilibrium", "Isomerism", or "PYQ".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSubject('All'); }}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredChapters.map(chapter => {
              // Calculate completion for this chapter
              const chapterVids = chapter.lectures;
              const completedInChapter = chapterVids.filter(v => progressData[v.videoId]?.completed).length;
              const pct = chapterVids.length > 0 ? Math.round((completedInChapter / chapterVids.length) * 100) : 0;
              const firstUnwatched = chapterVids.find(v => !progressData[v.videoId]?.completed) || chapterVids[0];

              return (
                <Tilt3DCard
                  key={chapter.id}
                  maxTilt={6}
                  glare={true}
                  onClick={() => handleCardClick(chapter.slug)}
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

                        {/* Complete badge if 100% */}
                        {pct === 100 && (
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-[10px] font-extrabold uppercase text-white shadow">
                            ✓ Completed
                          </div>
                        )}
                      </div>

                      {/* Header & Subject */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${subjectBadges[chapter.subject] || subjectBadges.General}`}>
                            {chapter.subject}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-500">
                            100% Free
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                          {chapter.chapterName}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                      {currentUser && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                            <span>Progress</span>
                            <span>{completedInChapter} / {chapter.lectureCount} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-red-600 dark:bg-red-500 transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                          Nelov Mallick (IITD)
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform">
                          {completedInChapter > 0 && firstUnwatched ? `Continue ${firstUnwatched.lectureNumber} →` : 'Start Watching →'}
                        </span>
                      </div>
                    </div>

                  </div>
                </Tilt3DCard>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
