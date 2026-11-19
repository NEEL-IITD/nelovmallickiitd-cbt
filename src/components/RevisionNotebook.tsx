import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentStorage, BookmarkedQuestion } from '../utils/studentStorage';

export const RevisionNotebook: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(() =>
    studentStorage.getBookmarks(user.id)
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const mistakeTags: BookmarkedQuestion['mistakeTag'][] = [
    'Calculation Error',
    'Conceptual Gap',
    'Misread Question',
    'Time Trap',
    'Need Revision',
  ];

  const handleRemove = (uniqueKey: string) => {
    studentStorage.toggleBookmark(user.id, { uniqueKey } as any);
    setBookmarks(studentStorage.getBookmarks(user.id));
  };

  const handleTagChange = (uniqueKey: string, tag: BookmarkedQuestion['mistakeTag']) => {
    studentStorage.updateMistakeTag(user.id, uniqueKey, tag);
    setBookmarks(studentStorage.getBookmarks(user.id));
  };

  const filtered = bookmarks.filter((b) => {
    const matchSubj = selectedSubject === 'all' || b.subject === selectedSubject;
    const matchTag = selectedTag === 'all' || b.mistakeTag === selectedTag;
    return matchSubj && matchTag;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-800 via-indigo-900 to-purple-950 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-indigo-200 border border-white/10">
              Personal Study Tool · 100% Free
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Revision Notebook & Mistake Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Curate tough questions, review derivations, and classify mistakes to prevent repetitive negative marking on JEE exam day.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Subject Filters */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Subject:
              </span>
              <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-xs font-bold">
                {['all', 'Mathematics', 'Physics', 'Chemistry'].map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedSubject === subj
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {subj === 'all' ? 'All Subjects' : subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Mistake Tag Filters */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Mistake Tag:
              </span>
              <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-xs font-bold">
                {['all', ...mistakeTags].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTag(t)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedTag === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {t === 'all' ? 'All Tags' : t}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-100 dark:border-zinc-800">
            Showing {filtered.length} of {bookmarks.length} bookmarked question{bookmarks.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Bookmarked Questions List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-3xl mx-auto">
              ⭐
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50">
                {bookmarks.length === 0 ? 'Your Revision Notebook is Empty' : 'No Questions Match Filter'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {bookmarks.length === 0
                  ? 'Star questions during any CBT mock test or in the Answer Review scorecard to compile your personal notebook of high-yield derivations and mistake patterns!'
                  : 'Try resetting the subject or mistake tag filters to view all bookmarked items.'}
              </p>
            </div>
            {bookmarks.length === 0 && (
              <div className="pt-2">
                <a
                  href="#/test/jee-advanced/pta-04"
                  className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Attempt Live Tests & Star Questions →
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((item) => (
              <div
                key={item.uniqueKey}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 space-y-4 bg-white dark:bg-[#121318] shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all"
              >
                {/* Card Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-zinc-100">
                      {item.testCode} · Question {item.id}
                    </span>
                    <span className="text-slate-300 dark:text-zinc-700">·</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.subject}</span>
                    <span className="text-slate-300 dark:text-zinc-700">·</span>
                    <span className="text-slate-500">{item.section}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mistake Tag Selector */}
                    <select
                      value={item.mistakeTag || ''}
                      onChange={(e) => handleTagChange(item.uniqueKey, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold"
                    >
                      <option value="">+ Add Mistake Tag</option>
                      {mistakeTags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.uniqueKey)}
                      className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-serif">
                  {item.question}
                </div>

                {/* Images */}
                {item.images && item.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 py-2">
                    {item.images.map((img, iIdx) => (
                      <img key={iIdx} src={img} alt="" className="max-h-40 rounded-xl border p-1 bg-white" />
                    ))}
                  </div>
                )}

                {/* Solution Panel */}
                {(item.explanation || item.solution) && (
                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1.5 text-xs text-slate-800 dark:text-zinc-200">
                    <p className="font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 text-[10px]">
                      Verified Solution & Derivation:
                    </p>
                    <div className="leading-relaxed whitespace-pre-line">
                      {item.explanation || item.solution}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
