// ==============================================================================
// NelovMallickIITD · Daily Goal, Streak & 24-Hour Study Planner Service
// Keyed by YYYY-MM-DD local date with localStorage + optional Supabase user sync
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from './authService';
import { studentStorage } from '../utils/studentStorage';

export interface PlannerActivity {
  id: string;
  label: string;
  color: string;
  isStudy: boolean;
}

export interface PlannerTopic {
  id: string;
  text: string;
  stage: string;
  done: boolean;
  createdAt: string;
}

export interface DayPlanData {
  topics: PlannerTopic[];
  slots: Record<string, string>;
  manualSolvedCount: number;
  updatedAt?: string;
}

export interface DailyPlannerStoreData {
  dailyTarget: number;
  customActivities: PlannerActivity[];
  days: Record<string, DayPlanData>;
}

export const DAILY_PLANNER_EVENT = 'nelov:daily-planner-updated';

export const DAILY_PLANNER_STAGES = [
  'No stage',
  'Theory',
  'Practice',
  'Revision',
  'PYQs',
  'Completed'
];

export const DEFAULT_PLANNER_ACTIVITIES: PlannerActivity[] = [
  { id: 'sleep', label: 'Sleep', color: '#6366F1', isStudy: false },
  { id: 'school', label: 'School', color: '#10B981', isStudy: false },
  { id: 'coaching', label: 'Coaching', color: '#F59E0B', isStudy: false },
  { id: 'self-study', label: 'Self study', color: '#3B82F6', isStudy: true },
  { id: 'revision', label: 'Revision', color: '#14B8A6', isStudy: true },
  { id: 'test', label: 'Test', color: '#F43F5E', isStudy: true },
  { id: 'break', label: 'Break', color: '#EC4899', isStudy: false },
  { id: 'misc', label: 'Misc', color: '#64748B', isStudy: false }
];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function parseDateKeyLocal(dateKey: string): Date {
  const parts = String(dateKey || '').split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  }
  return new Date();
}

function toLocalDateKey(d: Date | string): string {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  }
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

export const dailyPlannerService = {
  getLocalDateKey(d?: Date | string): string {
    return toLocalDateKey(d || new Date());
  },

  shiftDateKey(dateKey: string, deltaDays: number): string {
    const dt = parseDateKeyLocal(dateKey);
    dt.setDate(dt.getDate() + deltaDays);
    return toLocalDateKey(dt);
  },

  getWeekDates(anchorDateKey: string): Array<{ dateKey: string; weekday: string; dayNum: number }> {
    const dt = parseDateKeyLocal(anchorDateKey);
    const sunday = new Date(dt);
    sunday.setDate(dt.getDate() - dt.getDay());
    const labels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const result: Array<{ dateKey: string; weekday: string; dayNum: number }> = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(sunday);
      cur.setDate(sunday.getDate() + i);
      result.push({
        dateKey: toLocalDateKey(cur),
        weekday: labels[i],
        dayNum: cur.getDate()
      });
    }
    return result;
  },

  formatDisplayDate(dateKey: string): { title: string; relative: string } {
    const dt = parseDateKeyLocal(dateKey);
    const title = dt.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const todayKey = toLocalDateKey(new Date());
    const yestKey = this.shiftDateKey(todayKey, -1);
    const tomKey = this.shiftDateKey(todayKey, 1);
    let relative = String(dt.getFullYear());
    if (dateKey === todayKey) relative = 'Today';
    else if (dateKey === yestKey) relative = 'Yesterday';
    else if (dateKey === tomKey) relative = 'Tomorrow';
    return { title, relative };
  },

  _resolveUserId(userId?: string | null): string {
    return userId || authService.getCurrentUser()?.id || 'guest';
  },

  getStore(userId?: string | null): DailyPlannerStoreData {
    const uId = this._resolveUserId(userId);
    const base: DailyPlannerStoreData = { dailyTarget: 30, customActivities: [], days: {} };
    try {
      const userRaw = localStorage.getItem(`nelov_${uId}_daily_planner_v1`);
      const guestRaw = localStorage.getItem('nelov_daily_planner_v1');
      if (guestRaw && uId === 'guest') return { ...base, ...JSON.parse(guestRaw) };
      if (userRaw) return { ...base, ...JSON.parse(userRaw) };
      if (guestRaw) return { ...base, ...JSON.parse(guestRaw) };
    } catch {}
    return base;
  },

  saveStore(store: DailyPlannerStoreData, userId?: string | null): DailyPlannerStoreData {
    const uId = this._resolveUserId(userId);
    try {
      localStorage.setItem(`nelov_${uId}_daily_planner_v1`, JSON.stringify(store));
      if (uId === 'guest') {
        localStorage.setItem('nelov_daily_planner_v1', JSON.stringify(store));
      }
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DAILY_PLANNER_EVENT, { detail: store }));
    }
    this.syncCloudIfAuthenticated(store, uId);
    return store;
  },

  async syncCloudIfAuthenticated(store: DailyPlannerStoreData, userId?: string | null): Promise<void> {
    if (!isSupabaseConfigured || !supabase || !userId || userId === 'guest') return;
    try {
      const { data: sessData } = await supabase.auth.getSession();
      if (!sessData?.session?.user) return;
      await supabase.auth.updateUser({ data: { nelov_daily_planner_v1: store } });
    } catch {}
  },

  getAllActivities(userId?: string | null): PlannerActivity[] {
    const st = this.getStore(userId);
    return [...DEFAULT_PLANNER_ACTIVITIES, ...(st.customActivities || [])];
  },

  addCustomActivity(label: string, color: string, isStudy: boolean, userId?: string | null): PlannerActivity | null {
    const clean = label.trim();
    if (!clean) return null;
    const st = this.getStore(userId);
    const act: PlannerActivity = {
      id: `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      label: clean,
      color: color || '#8B5CF6',
      isStudy
    };
    st.customActivities = [...(st.customActivities || []), act];
    this.saveStore(st, userId);
    return act;
  },

  getDayPlan(dateKey: string, userId?: string | null): DayPlanData {
    const st = this.getStore(userId);
    const d = st.days?.[dateKey];
    return {
      topics: Array.isArray(d?.topics) ? d.topics : [],
      slots: d?.slots && typeof d.slots === 'object' ? d.slots : {},
      manualSolvedCount: Number(d?.manualSolvedCount || 0)
    };
  },

  _mutateDay(dateKey: string, mutator: (day: DayPlanData) => DayPlanData, userId?: string | null): DayPlanData {
    const st = this.getStore(userId);
    if (!st.days) st.days = {};
    const cur = this.getDayPlan(dateKey, userId);
    const next = mutator({
      topics: [...cur.topics],
      slots: { ...cur.slots },
      manualSolvedCount: cur.manualSolvedCount
    });
    st.days[dateKey] = { ...next, updatedAt: new Date().toISOString() };
    this.saveStore(st, userId);
    return st.days[dateKey];
  },

  setDailyTarget(target: number, userId?: string | null): number {
    const num = Math.max(1, Math.min(500, Math.round(Number(target) || 30)));
    const st = this.getStore(userId);
    st.dailyTarget = num;
    this.saveStore(st, userId);
    return num;
  },

  addTopic(dateKey: string, text: string, stage = 'No stage', userId?: string | null): PlannerTopic | null {
    const clean = text.trim();
    if (!clean) return null;
    const item: PlannerTopic = {
      id: `top_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      text: clean,
      stage: stage || 'No stage',
      done: stage === 'Completed',
      createdAt: new Date().toISOString()
    };
    this._mutateDay(dateKey, (day) => ({ ...day, topics: [...day.topics, item] }), userId);
    return item;
  },

  toggleTopic(dateKey: string, topicId: string, userId?: string | null): DayPlanData {
    return this._mutateDay(
      dateKey,
      (day) => ({
        ...day,
        topics: day.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                done: !t.done,
                stage:
                  !t.done && t.stage === 'No stage'
                    ? 'Completed'
                    : t.done && t.stage === 'Completed'
                      ? 'No stage'
                      : t.stage
              }
            : t
        )
      }),
      userId
    );
  },

  updateTopicStage(dateKey: string, topicId: string, stage: string, userId?: string | null): DayPlanData {
    return this._mutateDay(
      dateKey,
      (day) => ({
        ...day,
        topics: day.topics.map((t) => (t.id === topicId ? { ...t, stage, done: stage === 'Completed' ? true : t.done } : t))
      }),
      userId
    );
  },

  deleteTopic(dateKey: string, topicId: string, userId?: string | null): DayPlanData {
    return this._mutateDay(dateKey, (day) => ({ ...day, topics: day.topics.filter((t) => t.id !== topicId) }), userId);
  },

  paintSlots(dateKey: string, slotKeys: string[], activityIdOrNull: string | null, userId?: string | null): DayPlanData {
    return this._mutateDay(
      dateKey,
      (day) => {
        const nextSlots = { ...day.slots };
        slotKeys.forEach((sk) => {
          if (!activityIdOrNull || activityIdOrNull === 'erase') delete nextSlots[sk];
          else nextSlots[sk] = activityIdOrNull;
        });
        return { ...day, slots: nextSlots };
      },
      userId
    );
  },

  copyDayPlan(fromDateKey: string, toDateKey: string, userId?: string | null): DayPlanData | null {
    if (!fromDateKey || !toDateKey || fromDateKey === toDateKey) return null;
    const src = this.getDayPlan(fromDateKey, userId);
    return this._mutateDay(
      toDateKey,
      (day) => ({
        ...day,
        slots: { ...src.slots },
        topics: [
          ...day.topics,
          ...src.topics.map((t) => ({
            ...t,
            id: `top_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
            done: false
          }))
        ]
      }),
      userId
    );
  },

  clearDayPlan(dateKey: string, userId?: string | null): DayPlanData {
    return this._mutateDay(dateKey, () => ({ topics: [], slots: {}, manualSolvedCount: 0 }), userId);
  },

  getBacklog(currentDateKey: string, userId?: string | null): Array<PlannerTopic & { dateKey: string }> {
    const st = this.getStore(userId);
    const out: Array<PlannerTopic & { dateKey: string }> = [];
    Object.keys(st.days || {})
      .sort((a, b) => (a < b ? 1 : -1))
      .forEach((dKey) => {
        if (dKey >= currentDateKey) return;
        (st.days[dKey]?.topics || []).forEach((t) => {
          if (!t.done) out.push({ ...t, dateKey: dKey });
        });
      });
    return out;
  },

  moveBacklogToDate(fromDateKey: string, topicId: string, targetDateKey: string, userId?: string | null): void {
    const st = this.getStore(userId);
    const found = (st.days?.[fromDateKey]?.topics || []).find((t) => t.id === topicId);
    if (!found) return;
    this.deleteTopic(fromDateKey, topicId, userId);
    this.addTopic(targetDateKey, found.text, found.stage, userId);
  },

  getSavedDateKeys(userId?: string | null): string[] {
    const st = this.getStore(userId);
    return Object.keys(st.days || {})
      .filter((k) => {
        const d = st.days[k];
        return (d?.topics?.length || 0) > 0 || (d?.slots && Object.keys(d.slots).length > 0);
      })
      .sort((a, b) => (a < b ? 1 : -1));
  },

  getQuestionsSolvedOnDate(dateKey: string, userId?: string | null): number {
    const uId = this._resolveUserId(userId);
    const plan = this.getDayPlan(dateKey, uId);
    let fromAttempts = 0;
    if (uId !== 'guest') {
      const attempts = studentStorage.getAttempts(uId) || [];
      attempts.forEach((a) => {
        if (a.completedAt && toLocalDateKey(a.completedAt) === dateKey) {
          fromAttempts += Number(a.attemptedCount || 0);
        }
      });
    }
    return fromAttempts + (plan.manualSolvedCount || 0);
  },

  computeBreakdown(slots: Record<string, string>, userId?: string | null) {
    const activities = this.getAllActivities(userId);
    const actMap: Record<string, PlannerActivity> = {};
    activities.forEach((a) => { actMap[a.id] = a; });

    const counts: Record<string, number> = {};
    let totalSlots = 0;
    let studySlots = 0;
    Object.values(slots || {}).forEach((id) => {
      if (!id || !actMap[id]) return;
      totalSlots += 1;
      counts[id] = (counts[id] || 0) + 1;
      if (actMap[id].isStudy) studySlots += 1;
    });
    const studyHours = studySlots * 0.5;
    const plannedHours = Math.min(24, totalSlots * 0.5);
    const freeHours = Math.max(0, 24 - plannedHours);
    const segments = Object.keys(counts).map((id) => ({
      id,
      label: actMap[id].label,
      color: actMap[id].color,
      hours: counts[id] * 0.5,
      pct: Math.round(((counts[id] * 0.5) / 24) * 1000) / 10
    }));
    return { studyHours, plannedHours, freeHours, segments };
  },

  getStreak(todayKey: string, userId?: string | null): number {
    const st = this.getStore(userId);
    const target = st.dailyTarget || 30;
    const isDayActive = (dKey: string) => {
      const solved = this.getQuestionsSolvedOnDate(dKey, userId);
      const day = this.getDayPlan(dKey, userId);
      const completedTopic = (day.topics || []).some((t) => t.done);
      const hasStudyTime = this.computeBreakdown(day.slots, userId).studyHours > 0;
      return solved >= target || completedTopic || hasStudyTime;
    };

    let streak = 0;
    let cursor = isDayActive(todayKey) ? todayKey : this.shiftDateKey(todayKey, -1);
    while (isDayActive(cursor) && streak < 365) {
      streak++;
      cursor = this.shiftDateKey(cursor, -1);
    }
    return streak;
  }
};
