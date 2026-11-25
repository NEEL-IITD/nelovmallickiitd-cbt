// ==============================================================================
// NelovMallickIITD · Dashboard Home Widget: Daily Goal & Today Card
// Curated by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { dailyPlannerService } from '../services/dailyPlannerService';

interface DailyGoalTodayCardProps {
  userId?: string | null;
  isDark: boolean;
  plannerTick: number;
  onOpenPlanner: () => void;
  onResumeTest: () => void;
}

export const DailyGoalTodayCard: React.FC<DailyGoalTodayCardProps> = ({
  userId,
  isDark,
  plannerTick,
  onOpenPlanner,
  onResumeTest
}) => {
  const effectiveUser = userId || 'guest';
  const todayKey = dailyPlannerService.getLocalDateKey(new Date());
  const dateInfo = dailyPlannerService.formatDisplayDate(todayKey);
  const storeData = dailyPlannerService.getStore(effectiveUser);
  const dayPlan = dailyPlannerService.getDayPlan(todayKey, effectiveUser);
  const solvedToday = dailyPlannerService.getQuestionsSolvedOnDate(todayKey, effectiveUser);
  const dailyTarget = storeData.dailyTarget || 30;
  const goalPct = dailyTarget > 0 ? Math.min(100, Math.round((solvedToday / dailyTarget) * 100)) : 0;

  const topics = dayPlan.topics || [];
  const doneTopics = topics.filter((t) => t.done).length;
  const topicsPct = topics.length > 0 ? Math.round((doneTopics / topics.length) * 100) : 0;
  const streak = dailyPlannerService.getStreak(todayKey, effectiveUser);

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(String(dailyTarget));

  useEffect(() => {
    setGoalDraft(String(dailyTarget));
  }, [dailyTarget, plannerTick]);

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    dailyPlannerService.setDailyTarget(Number(goalDraft), effectiveUser);
    setEditingGoal(false);
  };

  const muted = isDark ? 'text-[#94A3B8]' : 'text-slate-500';
  const hairline = isDark ? 'border-white/[0.08]' : 'border-slate-200/90';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
          {dateInfo.title}
        </h2>
        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
          isDark ? 'bg-[#12172A] border-white/[0.08] text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
        }`}>
          {dateInfo.relative}
        </span>
      </div>

      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 border ${
        isDark
          ? 'bg-gradient-to-br from-[#131936] via-[#12172A] to-[#171D35] border-white/[0.08] shadow-2xl shadow-indigo-950/35'
          : 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/70 border-indigo-200/80 shadow-md'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className={`md:col-span-4 md:pr-6 md:border-r space-y-4 flex flex-col justify-center ${hairline}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider ${muted}`}>DAILY GOAL</span>
                {!editingGoal ? (
                  <button
                    type="button"
                    onClick={() => setEditingGoal(true)}
                    className={`text-xs font-semibold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600'}`}
                  >
                    Edit
                  </button>
                ) : (
                  <form onSubmit={handleSaveTarget} className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={goalDraft}
                      onChange={(e) => setGoalDraft(e.target.value)}
                      className={`w-16 px-2 py-0.5 rounded-lg border text-xs font-bold ${isDark ? 'bg-[#080B14] border-white/15 text-white' : 'bg-white border-slate-300'}`}
                    />
                    <button type="submit" className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white text-[11px] font-bold">
                      Save
                    </button>
                  </form>
                )}
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-black ${solvedToday >= dailyTarget ? 'text-[#10B981]' : ''}`}>{solvedToday}</span>
                <span className={`text-sm font-semibold ${muted}`}>/ {dailyTarget}</span>
              </div>

              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${solvedToday >= dailyTarget ? 'bg-[#10B981]' : 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED]'}`}
                  style={{ width: `${goalPct}%` }}
                />
              </div>
            </div>

            <div className={`border-t ${hairline}`} />

            <div className="space-y-2">
              <div className={`text-[11px] font-extrabold uppercase tracking-wider ${muted}`}>TOPICS DONE</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{topicsPct}%</span>
                <span className={`text-xs font-bold ${muted}`}>{doneTopics}/{topics.length}</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                <div className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#10B981]" style={{ width: `${topicsPct}%` }} />
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-center space-y-3">
            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${muted}`}>TODAY</span>
            <h3 className="text-lg sm:text-xl font-black">What are you studying today?</h3>
            {topics.length === 0 ? (
              <div>
                <button
                  type="button"
                  onClick={onOpenPlanner}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    isDark ? 'bg-white/[0.08] border-white/15 text-[#F8FAFC] hover:bg-[#6366F1]' : 'bg-white border-indigo-200 text-indigo-700'
                  }`}
                >
                  + Plan your day
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {topics.slice(0, 6).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => dailyPlannerService.toggleTopic(todayKey, t.id, effectiveUser)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left ${
                      t.done ? 'bg-[#10B981]/10 border-[#10B981]/35' : (isDark ? 'bg-[#080B14]/55 border-white/[0.08]' : 'bg-white border-slate-200')
                    }`}
                  >
                    <span className={`text-xs font-bold truncate ${t.done ? 'line-through opacity-75' : ''}`}>
                      {t.done ? '✓ ' : ''}{t.text}
                    </span>
                    {t.stage !== 'No stage' && (
                      <span className="text-[10px] font-bold text-indigo-400 shrink-0">{t.stage}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`border-t ${hairline} mt-5 pt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs`}>
          <span className={streak > 0 ? 'text-[#F59E0B] font-bold' : muted}>
            {streak > 0 ? `🔥 ${streak} day streak` : 'No streak yet'}
          </span>
          <button type="button" onClick={onResumeTest} className="inline-flex items-center gap-1.5 font-bold hover:text-indigo-300">
            <Play className="w-4 h-4 text-indigo-400" />
            <span>Resume your test</span>
          </button>
          <button type="button" onClick={onOpenPlanner} className="font-bold hover:underline">
            Edit plan →
          </button>
        </div>
      </div>
    </div>
  );
};
