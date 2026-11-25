// ==============================================================================
// NelovMallickIITD · Full 24-Hour Daily Study Planner (/dashboard/trackers)
// Curated by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Copy,
  Calendar,
  CheckSquare,
  History,
  Eraser,
  X
} from 'lucide-react';
import { dailyPlannerService, DAILY_PLANNER_STAGES } from '../services/dailyPlannerService';

interface DailyStudyPlannerViewProps {
  userId?: string | null;
  isDark: boolean;
  plannerTick: number;
  onBackHome: () => void;
}

export const DailyStudyPlannerView: React.FC<DailyStudyPlannerViewProps> = ({
  userId,
  isDark,
  plannerTick,
  onBackHome
}) => {
  const effectiveUser = userId || 'guest';
  const todayKey = dailyPlannerService.getLocalDateKey(new Date());

  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [topicText, setTopicText] = useState('');
  const [topicStage, setTopicStage] = useState('No stage');
  const [activeBrush, setActiveBrush] = useState('sleep');
  const [isDraggingPaint, setIsDraggingPaint] = useState(false);
  const [saveLabel, setSaveLabel] = useState('Saved');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customColor, setCustomColor] = useState('#8B5CF6');
  const [customIsStudy, setCustomIsStudy] = useState(true);

  useEffect(() => {
    const stop = () => setIsDraggingPaint(false);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, []);

  const pulseSaved = () => {
    setSaveLabel('Saving...');
    setTimeout(() => setSaveLabel('Saved'), 250);
  };

  const dayPlan = useMemo(
    () => dailyPlannerService.getDayPlan(selectedDateKey, effectiveUser),
    [selectedDateKey, effectiveUser, plannerTick]
  );
  const activities = useMemo(
    () => dailyPlannerService.getAllActivities(effectiveUser),
    [effectiveUser, plannerTick]
  );
  const actMap = useMemo(() => {
    const m: Record<string, typeof activities[0]> = {};
    activities.forEach((a) => { m[a.id] = a; });
    return m;
  }, [activities]);

  const weekDates = useMemo(() => dailyPlannerService.getWeekDates(selectedDateKey), [selectedDateKey]);
  const displayDate = useMemo(() => dailyPlannerService.formatDisplayDate(selectedDateKey), [selectedDateKey]);
  const backlogItems = useMemo(() => dailyPlannerService.getBacklog(todayKey, effectiveUser), [todayKey, effectiveUser, plannerTick]);
  const savedDates = useMemo(
    () => dailyPlannerService.getSavedDateKeys(effectiveUser).filter((k) => k !== selectedDateKey),
    [selectedDateKey, effectiveUser, plannerTick]
  );
  const breakdown = useMemo(
    () => dailyPlannerService.computeBreakdown(dayPlan.slots, effectiveUser),
    [dayPlan.slots, effectiveUser, plannerTick]
  );

  const cardSurface = isDark
    ? 'bg-gradient-to-br from-[#12172A] to-[#171D35] border border-white/[0.08] shadow-xl shadow-black/30'
    : 'bg-white border border-slate-200 shadow-sm';
  const subSurface = isDark ? 'bg-[#0E1322] border border-white/[0.08]' : 'bg-slate-50 border border-slate-200';
  const muted = isDark ? 'text-[#94A3B8]' : 'text-slate-500';
  const hairline = isDark ? 'border-white/[0.08]' : 'border-slate-200';

  const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
  const formatHour = (h: number) => (h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`);
  const formatHoursVal = (v: number) => (Number.isInteger(v) ? `${v}h` : `${v.toFixed(1)}h`);

  const paintSlot = (sk: string) => {
    dailyPlannerService.paintSlots(selectedDateKey, [sk], activeBrush === 'erase' ? null : activeBrush, effectiveUser);
    pulseSaved();
  };

  const renderHalfDay = (startHour: number, endHour: number, title: string) => {
    const hours = Array.from({ length: endHour - startHour }, (_, idx) => startHour + idx);
    return (
      <div className={`rounded-2xl p-4 select-none ${cardSurface}`}>
        <div className={`text-[11px] font-bold tracking-wider uppercase mb-3 ${muted}`}>{title}</div>
        <div className={`border-t ${hairline}`}>
          {hours.map((h) => {
            const hh = pad2(h);
            return (
              <div key={h} className={`flex items-stretch border-b ${hairline} min-h-[34px]`}>
                <div className={`w-12 shrink-0 pr-2 py-1 text-[10px] font-semibold flex items-center justify-end ${muted}`}>
                  {formatHour(h)}
                </div>
                <div className="flex-1 grid grid-cols-1 divide-y divide-white/[0.04]">
                  {[`${hh}:00`, `${hh}:30`].map((sk) => {
                    const actId = dayPlan.slots[sk];
                    const act = actId ? actMap[actId] : null;
                    return (
                      <div
                        key={sk}
                        role="button"
                        tabIndex={0}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsDraggingPaint(true);
                          paintSlot(sk);
                        }}
                        onMouseEnter={() => { if (isDraggingPaint) paintSlot(sk); }}
                        style={act ? { backgroundColor: `${act.color}28`, borderLeft: `3px solid ${act.color}` } : undefined}
                        className="h-[17px] px-2 flex items-center text-[10px] font-bold cursor-pointer hover:bg-white/[0.05]"
                      >
                        {act && <span className="truncate leading-none">{act.label}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBackHome} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Trackers</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-[#10B981]">
            <Check className="w-3.5 h-3.5" />
            <span>{saveLabel}</span>
          </span>

          <div className="relative">
            <button type="button" onClick={() => setConfirmClearOpen((c) => !c)} className={`p-2 rounded-xl border ${cardSurface}`} aria-label="Clear Day">
              <Trash2 className="w-4 h-4" />
            </button>
            {confirmClearOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl p-3 border z-40 space-y-2 ${cardSurface}`}>
                <p className="text-xs font-bold">Clear all items for this day?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      dailyPlannerService.clearDayPlan(selectedDateKey, effectiveUser);
                      setConfirmClearOpen(false);
                      pulseSaved();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-[#F43F5E] text-white text-xs font-bold"
                  >
                    Clear
                  </button>
                  <button type="button" onClick={() => setConfirmClearOpen(false)} className={`flex-1 py-1.5 rounded-lg border text-xs ${hairline}`}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white text-xs font-black shadow-lg shadow-indigo-600/30"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className={`no-print rounded-2xl p-4 sm:p-5 space-y-4 ${cardSurface}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSelectedDateKey(dailyPlannerService.shiftDateKey(selectedDateKey, -7))} className={`p-2 rounded-xl border ${subSurface}`}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black">{displayDate.title}</h2>
              <p className={`text-xs font-semibold ${muted}`}>{displayDate.relative}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button type="button" onClick={() => setCopyMenuOpen((o) => !o)} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold ${subSurface}`}>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy from</span>
              </button>
              {copyMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 border z-40 space-y-1 text-xs ${cardSurface}`}>
                  <button
                    type="button"
                    onClick={() => {
                      dailyPlannerService.copyDayPlan(dailyPlannerService.shiftDateKey(selectedDateKey, -1), selectedDateKey, effectiveUser);
                      setCopyMenuOpen(false);
                      pulseSaved();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 font-semibold"
                  >
                    Previous Day
                  </button>
                  {savedDates.slice(0, 4).map((dk) => (
                    <button
                      key={dk}
                      type="button"
                      onClick={() => {
                        dailyPlannerService.copyDayPlan(dk, selectedDateKey, effectiveUser);
                        setCopyMenuOpen(false);
                        pulseSaved();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 font-semibold"
                    >
                      {dailyPlannerService.formatDisplayDate(dk).title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className={`p-2 rounded-xl border cursor-pointer ${subSurface}`} title="Pick date">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={selectedDateKey}
                onChange={(e) => { if (e.target.value) setSelectedDateKey(e.target.value); }}
                className="sr-only"
              />
            </label>

            <button type="button" onClick={() => setSelectedDateKey(dailyPlannerService.shiftDateKey(selectedDateKey, 7))} className={`p-2 rounded-xl border ${subSurface}`}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((wd) => {
            const active = wd.dateKey === selectedDateKey;
            return (
              <button
                key={wd.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(wd.dateKey)}
                className={`rounded-xl py-2.5 px-1 flex flex-col items-center border ${
                  active ? 'bg-gradient-to-br from-[#6366F1] to-[#7C3AED] border-indigo-400/50 text-white shadow-lg' : subSurface
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${active ? 'text-indigo-100' : muted}`}>{wd.weekday}</span>
                <span className="text-sm font-black">{wd.dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className={`lg:col-span-8 rounded-2xl p-5 space-y-4 ${cardSurface}`}>
          <div className="flex items-center gap-2 text-sm font-black">
            <CheckSquare className="w-4 h-4 text-[#6366F1]" />
            <span>What are you studying?</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!topicText.trim()) return;
              dailyPlannerService.addTopic(selectedDateKey, topicText.trim(), topicStage, effectiveUser);
              setTopicText('');
              setTopicStage('No stage');
              pulseSaved();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              value={topicText}
              onChange={(e) => setTopicText(e.target.value)}
              placeholder="What are you studying?"
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${isDark ? 'bg-[#080B14] border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200'}`}
            />
            <select value={topicStage} onChange={(e) => setTopicStage(e.target.value)} className={`px-3 py-2.5 rounded-xl border text-xs font-bold ${subSurface}`}>
              {DAILY_PLANNER_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white text-xs font-black">
              + Add
            </button>
          </form>

          {dayPlan.topics.length === 0 ? (
            <div className={`py-8 text-center text-xs font-semibold ${muted}`}>Nothing planned yet</div>
          ) : (
            <div className="space-y-2">
              {dayPlan.topics.map((t) => (
                <div key={t.id} className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border ${subSurface}`}>
                  <button
                    type="button"
                    onClick={() => { dailyPlannerService.toggleTopic(selectedDateKey, t.id, effectiveUser); pulseSaved(); }}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${t.done ? 'bg-[#10B981] border-[#10B981] text-white' : 'border-slate-500'}`}>
                      {t.done ? '✓' : ''}
                    </span>
                    <span className={`text-xs sm:text-sm font-bold truncate ${t.done ? 'line-through opacity-70' : ''}`}>{t.text}</span>
                  </button>
                  <button type="button" onClick={() => { dailyPlannerService.deleteTopic(selectedDateKey, t.id, effectiveUser); pulseSaved(); }} className="text-slate-400 hover:text-rose-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`lg:col-span-4 rounded-2xl p-5 space-y-4 ${cardSurface}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-black">
              <History className="w-4 h-4 text-[#F59E0B]" />
              <span>Backlog</span>
            </div>
            <span className="text-xs font-black text-[#F59E0B]">{backlogItems.length}</span>
          </div>
          {backlogItems.length === 0 ? (
            <div className={`py-8 text-center text-xs font-semibold ${muted}`}>Nothing pending</div>
          ) : (
            <div className="space-y-2">
              {backlogItems.map((b) => (
                <div key={`${b.dateKey}_${b.id}`} className={`p-3 rounded-xl space-y-2 ${subSurface}`}>
                  <div className="text-xs font-bold">{b.text}</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { dailyPlannerService.moveBacklogToDate(b.dateKey, b.id, selectedDateKey, effectiveUser); pulseSaved(); }}
                      className="px-2 py-1 rounded-lg bg-[#6366F1]/20 text-indigo-300 text-[10px] font-bold"
                    >
                      → Move
                    </button>
                    <button
                      type="button"
                      onClick={() => { dailyPlannerService.toggleTopic(b.dateKey, b.id, effectiveUser); pulseSaved(); }}
                      className="px-2 py-1 rounded-lg bg-[#10B981]/20 text-emerald-300 text-[10px] font-bold"
                    >
                      ✓ Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="no-print flex flex-wrap items-center gap-2">
        {activities.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => setActiveBrush(act.id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              activeBrush === act.id
                ? (isDark ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-white border-slate-900')
                : subSurface
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: act.color }} />
            <span>{act.label}</span>
          </button>
        ))}

        <button type="button" onClick={() => setCustomOpen((o) => !o)} className="px-3 py-1.5 rounded-xl border border-dashed border-white/20 text-xs font-bold">
          + Activity
        </button>

        <button
          type="button"
          onClick={() => setActiveBrush('erase')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
            activeBrush === 'erase' ? 'bg-[#F43F5E]/20 border-[#F43F5E] text-rose-300' : subSurface
          }`}
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Erase</span>
        </button>
      </div>

      {customOpen && (
        <div className={`no-print rounded-2xl p-4 flex flex-wrap items-center gap-3 ${cardSurface}`}>
          <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} placeholder="Custom activity..." className={`px-3 py-1.5 rounded-xl border text-xs ${isDark ? 'bg-[#080B14] border-white/10 text-white' : 'bg-white border-slate-200'}`} />
          <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent" />
          <label className="text-xs font-semibold flex items-center gap-1.5">
            <input type="checkbox" checked={customIsStudy} onChange={(e) => setCustomIsStudy(e.target.checked)} />
            Study Hours
          </label>
          <button
            type="button"
            onClick={() => {
              const created = dailyPlannerService.addCustomActivity(customLabel, customColor, customIsStudy, effectiveUser);
              if (created) { setActiveBrush(created.id); setCustomLabel(''); setCustomOpen(false); }
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white text-xs font-bold"
          >
            Save
          </button>
        </div>
      )}

      <div className="no-print grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderHalfDay(0, 12, '12 AM — 12 PM')}
          {renderHalfDay(12, 24, '12 PM — 12 AM')}
        </div>

        <div className={`xl:col-span-3 rounded-2xl p-4 space-y-3 ${cardSurface}`}>
          <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${subSurface}`}>
            <span className="text-xl font-black text-[#818CF8]">{formatHoursVal(breakdown.studyHours)}</span>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${muted}`}>STUDY</span>
          </div>
          <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${subSurface}`}>
            <span className="text-xl font-black">{formatHoursVal(breakdown.plannedHours)}</span>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${muted}`}>PLANNED</span>
          </div>
          <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${subSurface}`}>
            <span className="text-xl font-black text-[#F59E0B]">{formatHoursVal(breakdown.freeHours)}</span>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${muted}`}>FREE</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden flex ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            {breakdown.segments.map((seg) => (
              <div key={seg.id} style={{ width: `${Math.max(2, (seg.hours / 24) * 100)}%`, backgroundColor: seg.color }} className="h-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
