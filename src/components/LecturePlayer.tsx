import React, { useState, useEffect, useMemo } from 'react';
import { allChapters, ChapterPlaylist, Lecture, YOUTUBE_CHANNEL_URL } from '../data/lectures/lecturesIndex';
import { studentStorage } from '../utils/studentStorage';

interface LecturePlayerProps {
  chapterSlug: string;
  initialLectureIndex?: number;
  currentUser?: any;
  onBackToHub?: () => void;
  openAuth?: (mode: 'login' | 'signup') => void;
}

export const LecturePlayer: React.FC<LecturePlayerProps> = ({
  chapterSlug,
  initialLectureIndex = 1,
  currentUser,
  onBackToHub,
  openAuth
}) => {
  const chapter: ChapterPlaylist | undefined = useMemo(() => {
    return allChapters.find(ch => ch.slug === chapterSlug) || allChapters[0];
  }, [chapterSlug]);

  const [activeLectureIndex, setActiveLectureIndex] = useState<number>(initialLectureIndex);
  const [personalNote, setPersonalNote] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});

  // Sync initialLectureIndex if props change
  useEffect(() => {
    if (initialLectureIndex && initialLectureIndex > 0) {
      setActiveLectureIndex(initialLectureIndex);
    }
  }, [initialLectureIndex]);

  // Load user progress
  useEffect(() => {
    if (currentUser?.id) {
      const p = studentStorage.getLectureProgress(currentUser.id);
      setProgressMap(p);
    }
  }, [currentUser]);

  const currentLecture: Lecture | undefined = useMemo(() => {
    if (!chapter || !chapter.lectures || chapter.lectures.length === 0) return undefined;
    return chapter.lectures[activeLectureIndex - 1] || chapter.lectures[0];
  }, [chapter, activeLectureIndex]);

  // Load note for current lecture
  useEffect(() => {
    if (currentLecture && currentUser?.id) {
      const saved = progressMap[currentLecture.videoId]?.personalNote || '';
      setPersonalNote(saved);
      setNoteSaved(false);
    }
  }, [currentLecture, currentUser, progressMap]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-4xl">⚠️</p>
          <h2 className="text-xl font-bold">Chapter not found</h2>
          <button
            onClick={() => onBackToHub ? onBackToHub() : (window.location.hash = '#/lectures')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs"
          >
            ← Return to Lectures Hub
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = currentLecture && !!progressMap[currentLecture.videoId]?.completed;

  const handleToggleComplete = async () => {
    if (!currentUser?.id) {
      openAuth?.('login');
      return;
    }
    if (!currentLecture) return;

    const newCompleted = !isCompleted;
    await studentStorage.saveLectureProgress(
      currentUser.id,
      chapter.slug,
      currentLecture.videoId,
      currentLecture.lectureNumber,
      newCompleted,
      personalNote
    );

    setProgressMap(prev => ({
      ...prev,
      [currentLecture.videoId]: {
        ...prev[currentLecture.videoId],
        completed: newCompleted,
        personalNote
      }
    }));
  };

  const handleSaveNote = async () => {
    if (!currentUser?.id) {
      openAuth?.('login');
      return;
    }
    if (!currentLecture) return;

    await studentStorage.saveLectureProgress(
      currentUser.id,
      chapter.slug,
      currentLecture.videoId,
      currentLecture.lectureNumber,
      isCompleted,
      personalNote
    );

    setProgressMap(prev => ({
      ...prev,
      [currentLecture.videoId]: {
        ...prev[currentLecture.videoId],
        completed: isCompleted,
        personalNote
      }
    }));

    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const hasPrev = activeLectureIndex > 1;
  const hasNext = activeLectureIndex < chapter.lectures.length;

  const completedCount = useMemo(() => {
    return chapter.lectures.filter(l => progressMap[l.videoId]?.completed).length;
  }, [chapter, progressMap]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans selection:bg-red-500 selection:text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <button
              onClick={() => onBackToHub ? onBackToHub() : (window.location.hash = '#/lectures')}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              ← All Chapters
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-zinc-100 font-bold truncate max-w-xs sm:max-w-md">
              {chapter.chapterName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Completed: <strong className="text-rose-600 dark:text-rose-400">{completedCount}</strong> / {chapter.lectureCount}
            </span>
            <a
              href={chapter.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
            >
              <span>▶</span> Open Full Playlist on YouTube
            </a>
          </div>
        </div>

        {/* Main Content Layout: Video Player + Playlist Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Video Player & Controls */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Embedded Player or Auth Required Banner */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-200 dark:border-zinc-800 shadow-2xl">
              {currentUser ? (
                currentLecture ? (
                  <iframe
                    src={`${currentLecture.embedUrl}?rel=0&modestbranding=1&enablejsapi=1`}
                    title={currentLecture.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    No lecture selected.
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 text-white space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center text-3xl shadow-lg">
                    🔒
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-xl font-black">Free Login Required to Watch</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      All video lectures on NelovMallickIITD are 100% free with zero fees. Please sign in or create a free candidate account to watch and track your syllabus progress.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => openAuth?.('login')}
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
                    >
                      Sign In Free →
                    </button>
                    <button
                      onClick={() => openAuth?.('signup')}
                      className="px-6 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-colors"
                    >
                      Create Free Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls & Information */}
            {currentLecture && (
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Lecture Meta & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider">
                        {currentLecture.lectureNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                        ⏱️ {currentLecture.duration || 'Full Session'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        100% Free Video
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 leading-snug">
                      {currentLecture.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Academic Guidance & Problem Derivations by <strong>Nelov Mallick (IIT Delhi)</strong>
                    </p>
                  </div>

                  {/* Complete Toggle & YouTube Link */}
                  <div className="flex flex-wrap items-center sm:flex-col sm:items-end gap-2.5 flex-shrink-0">
                    <button
                      onClick={handleToggleComplete}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700'
                      }`}
                    >
                      <span>{isCompleted ? '✓' : '○'}</span>
                      {isCompleted ? 'Completed' : 'Mark as Completed'}
                    </button>

                    <a
                      href={currentLecture.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>▶</span> Open on YouTube ↗
                    </a>
                  </div>
                </div>

                {/* Prev / Next Lecture Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    disabled={!hasPrev}
                    onClick={() => setActiveLectureIndex(prev => Math.max(1, prev - 1))}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      hasPrev
                        ? 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200'
                        : 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-zinc-900 text-slate-400'
                    }`}
                  >
                    ← Previous Lecture
                  </button>

                  <span className="text-xs font-semibold text-slate-500">
                    {activeLectureIndex} of {chapter.lectures.length}
                  </span>

                  <button
                    disabled={!hasNext}
                    onClick={() => setActiveLectureIndex(prev => Math.min(chapter.lectures.length, prev + 1))}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      hasNext
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
                        : 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-zinc-900 text-slate-400'
                    }`}
                  >
                    Next Lecture →
                  </button>
                </div>

                {/* Personal Revision Notes Box */}
                {currentUser && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <span>📝</span> Personal Study Notes for this Lecture
                      </label>
                      {noteSaved && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Note Saved!
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={personalNote}
                      onChange={e => setPersonalNote(e.target.value)}
                      placeholder="Jot down key reaction steps, tricky formulas, or question timestamps (e.g. 14:20 tricky optical rotation)..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#0d0e12] text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-y"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-xs font-bold transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right Column (4 cols): Chapter Lectures Playlist Sidebar */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                  Chapter Lectures
                </h3>
                <p className="text-[11px] text-slate-500">
                  {chapter.lectureCount} Lectures in exact syllabus order
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                {chapter.subject}
              </span>
            </div>

            {/* Lecture Items List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {chapter.lectures.map((lec, idx) => {
                const lecNum = idx + 1;
                const isActive = activeLectureIndex === lecNum;
                const lecCompleted = !!progressMap[lec.videoId]?.completed;

                return (
                  <button
                    key={lec.videoId}
                    onClick={() => setActiveLectureIndex(lecNum)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                      isActive
                        ? 'border-red-500/50 bg-red-50/60 dark:bg-red-950/20 text-slate-900 dark:text-zinc-50 shadow-sm'
                        : 'border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {/* Lecture Number / Completed Checkmark */}
                    <div className="flex-shrink-0 pt-0.5">
                      {lecCompleted ? (
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}>
                          {String(lecNum).padStart(2, '0')}
                        </div>
                      )}
                    </div>

                    {/* Lecture Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className={`text-xs font-bold line-clamp-2 leading-snug ${
                        isActive ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-zinc-200'
                      }`}>
                        {lec.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-500 font-medium">
                        <span>⏱️ {lec.duration || 'Session'}</span>
                        {isActive && <span className="text-red-600 dark:text-red-400 font-bold">● Now Playing</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sidebar Channel Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-center">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
              >
                <span>▶</span> Subscribe on YouTube for New Lectures ↗
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
