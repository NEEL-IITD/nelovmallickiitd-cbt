import React from 'react';
import { useAuth } from '../context/AuthContext';
import { studentStorage } from '../utils/studentStorage';

interface MyProgressProps {
  onSelectTest?: (testId: string) => void;
  onReviewAttempt?: (attempt: any) => void;
}

export const MyProgress: React.FC<MyProgressProps> = ({
  onSelectTest,
  onReviewAttempt,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  const stats = studentStorage.getUserStats(user.id);
  const attempts = studentStorage.getAttempts(user.id);
  const lecturesCompleted = studentStorage.getTotalLecturesCompleted(user.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-800 via-indigo-900 to-slate-950 p-8 sm:p-10 text-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-indigo-200 border border-white/10">
                Personal Study Dashboard · 100% Free
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200">
                Targeting: <strong className="text-white">{user.targetExam || 'JEE Advanced'}</strong> · Mentorship by Nelov Mallick (IIT Delhi)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center min-w-[200px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">Latest Projected AIR</p>
              <div className="text-2xl sm:text-3xl font-black pt-0.5 text-white">
                {stats.recentPredictedAir}
              </div>
            </div>
          </div>
        </div>

        {/* 5 KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Tests Attempted</p>
            <p className="text-3xl font-black text-slate-900 dark:text-zinc-50">{stats.totalTests}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% Free Access</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Average Score</p>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.averageScorePct}%</p>
            <p className="text-[11px] text-slate-500">Across all completed mocks</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Best Score</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.bestScorePct}%</p>
            <p className="text-[11px] text-slate-500">Peak performance</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Overall Accuracy</p>
            <p className="text-3xl font-black text-amber-500">{stats.overallAccuracy}%</p>
            <p className="text-[11px] text-slate-500">{stats.totalQuestionsAttempted} Questions attempted</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Lectures Completed</p>
            <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{lecturesCompleted}</p>
            <p className="text-[11px] text-slate-500">YouTube chapter sessions</p>
          </div>
        </div>

        {/* Attempt History Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <span>📑</span> Completed Test History
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Detailed diagnostic scorecard & mistake analysis for each attempt
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {attempts.length} Attempt{attempts.length !== 1 ? 's' : ''} Recorded
            </span>
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-3xl mx-auto">
                📝
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-50">
                  No Mock Tests Attempted Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Attempt live test PTA 04 or PTA 05 to view your diagnostic scorecard, rank projection, and personalized mistake analytics!
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectTest?.('jee-advanced-pta-04') || (window.location.hash = '#/test/jee-advanced/pta-04')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
                >
                  Attempt PTA 04 Free →
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTest?.('jee-advanced-pta-05') || (window.location.hash = '#/test/jee-advanced/pta-05')}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs transition-colors"
                >
                  Attempt PTA 05 Free →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-900/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold">
                        {attempt.testCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                        {attempt.testTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Completed on {new Date(attempt.completedAt).toLocaleDateString()} at{' '}
                      {new Date(attempt.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="text-center min-w-[70px]">
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Score</p>
                      <p className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                        {attempt.totalMarksScored} / {attempt.totalMaxMarks}
                      </p>
                    </div>

                    <div className="text-center min-w-[60px]">
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Accuracy</p>
                      <p className="font-mono font-extrabold text-emerald-600 text-sm">
                        {attempt.accuracy}%
                      </p>
                    </div>

                    <div className="text-center min-w-[90px]">
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Predicted AIR</p>
                      <p className="font-mono font-extrabold text-slate-800 dark:text-zinc-200 text-xs">
                        {attempt.predictedAirDisplay || 'N/A'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onReviewAttempt?.(attempt)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Review Scorecard
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
