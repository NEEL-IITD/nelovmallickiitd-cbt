import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

export type CloudSyncState = 'idle' | 'saving' | 'saved' | 'offline';

export interface CloudSyncStatusPayload {
  status: CloudSyncState;
  detail: string;
  updatedAt: string;
}

export const SYNC_STATUS_EVENT = 'nelov:sync-status';
const DAILY_PLANNER_EVENT = 'nelov:daily-planner-updated';
const CHAPTER_PROGRESS_EVENT = 'nelov:chapter-progress-updated';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let currentStatus: CloudSyncStatusPayload = {
  status: 'idle',
  detail: '',
  updatedAt: new Date().toISOString(),
};

export function emitSyncStatus(status: CloudSyncState, detail = ''): void {
  currentStatus = {
    status,
    detail,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_STATUS_EVENT, { detail: currentStatus }));
  }
}

export function subscribeSyncStatus(listener: (payload: CloudSyncStatusPayload) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const ce = e as CustomEvent<CloudSyncStatusPayload>;
    if (ce.detail) listener(ce.detail);
  };
  window.addEventListener(SYNC_STATUS_EVENT, handler);
  return () => window.removeEventListener(SYNC_STATUS_EVENT, handler);
}

export function getSyncStatus(): CloudSyncStatusPayload {
  return { ...currentStatus };
}

export const cloudSyncService = {
  emitSyncStatus,
  subscribeSyncStatus,
  getSyncStatus,

  migrateGuestLocalData(userId: string): boolean {
    if (typeof window === 'undefined' || !userId || userId === 'guest') return false;
    let changed = false;

    try {
      const guestRaw = localStorage.getItem('nelov_guest_daily_planner_v1') || localStorage.getItem('nelov_daily_planner_v1');
      if (guestRaw) {
        const guestPlan = JSON.parse(guestRaw);
        const userPlanKey = `nelov_${userId}_daily_planner_v1`;
        const existingRaw = localStorage.getItem(userPlanKey);
        const userPlan = existingRaw ? JSON.parse(existingRaw) : { dailyTarget: 30, customActivities: [], days: {} };

        if (!existingRaw && guestPlan?.dailyTarget) {
          userPlan.dailyTarget = guestPlan.dailyTarget;
        }
        const seenActs = new Set((userPlan.customActivities || []).map((a: any) => a.id));
        (guestPlan?.customActivities || []).forEach((a: any) => {
          if (a && !seenActs.has(a.id)) {
            userPlan.customActivities = [...(userPlan.customActivities || []), a];
            seenActs.add(a.id);
            changed = true;
          }
        });
        Object.keys(guestPlan?.days || {}).forEach((dKey) => {
          const gDay = guestPlan.days[dKey] || {};
          const uDay = userPlan.days?.[dKey];
          if (!uDay) {
            if (!userPlan.days) userPlan.days = {};
            userPlan.days[dKey] = gDay;
            changed = true;
          } else {
            const seenTopIds = new Set((uDay.topics || []).map((t: any) => t.id));
            const mergedTopics = [...(uDay.topics || [])];
            (gDay.topics || []).forEach((t: any) => {
              if (!seenTopIds.has(t.id)) {
                mergedTopics.push(t);
                changed = true;
              }
            });
            const mergedSlots = { ...(gDay.slots || {}), ...(uDay.slots || {}) };
            const mergedManual = Math.max(Number(uDay.manualSolvedCount || 0), Number(gDay.manualSolvedCount || 0));
            userPlan.days[dKey] = {
              ...uDay,
              topics: mergedTopics,
              slots: mergedSlots,
              manualSolvedCount: mergedManual,
              updatedAt: uDay.updatedAt || gDay.updatedAt || new Date().toISOString(),
            };
          }
        });
        localStorage.setItem(userPlanKey, JSON.stringify(userPlan));
        localStorage.removeItem('nelov_guest_daily_planner_v1');
        localStorage.removeItem('nelov_daily_planner_v1');
      }
    } catch {}

    try {
      const guestCpRaw = localStorage.getItem('nelov_guest_chapter_progress');
      if (guestCpRaw) {
        const guestCp = JSON.parse(guestCpRaw);
        const userCpKey = `nelov_${userId}_chapter_progress`;
        const userCp = JSON.parse(localStorage.getItem(userCpKey) || '{}');
        Object.keys(guestCp || {}).forEach((k) => {
          if (!userCp[k] || (guestCp[k].progressPercent || 0) > (userCp[k].progressPercent || 0)) {
            userCp[k] = guestCp[k];
            changed = true;
          }
        });
        localStorage.setItem(userCpKey, JSON.stringify(userCp));
        localStorage.removeItem('nelov_guest_chapter_progress');
      }
    } catch {}

    try {
      const gAttRaw = localStorage.getItem('nelov_guest_attempts');
      if (gAttRaw) {
        const gAtt = JSON.parse(gAttRaw);
        const uAttKey = `nelov_${userId}_attempts`;
        const uAtt = JSON.parse(localStorage.getItem(uAttKey) || '[]');
        const seen = new Set(uAtt.map((a: any) => a.id));
        (gAtt || []).forEach((a: any) => {
          if (a && !seen.has(a.id)) {
            uAtt.push({ ...a, userId });
            seen.add(a.id);
            changed = true;
          }
        });
        localStorage.setItem(uAttKey, JSON.stringify(uAtt));
        localStorage.removeItem('nelov_guest_attempts');
      }
    } catch {}

    try {
      const gBmRaw = localStorage.getItem('nelov_guest_bookmarks');
      if (gBmRaw) {
        const gBm = JSON.parse(gBmRaw);
        const uBmKey = `nelov_${userId}_bookmarks`;
        const uBm = JSON.parse(localStorage.getItem(uBmKey) || '[]');
        const seen = new Set(uBm.map((b: any) => b.uniqueKey));
        (gBm || []).forEach((b: any) => {
          if (b && !seen.has(b.uniqueKey)) {
            uBm.push(b);
            seen.add(b.uniqueKey);
            changed = true;
          }
        });
        localStorage.setItem(uBmKey, JSON.stringify(uBm));
        localStorage.removeItem('nelov_guest_bookmarks');
      }
    } catch {}

    if (changed) {
      window.dispatchEvent(new CustomEvent(DAILY_PLANNER_EVENT));
      window.dispatchEvent(new CustomEvent(CHAPTER_PROGRESS_EVENT));
    }
    return changed;
  },

  async hydrateFromCloud(user: User): Promise<void> {
    if (!isSupabaseConfigured || !supabase || !user?.id || !uuidRegex.test(user.id)) return;
    emitSyncStatus('saving', 'Syncing cloud data');
    const uId = user.id;

    try {
      const userPlanKey = `nelov_${uId}_daily_planner_v1`;
      const localPlan = JSON.parse(localStorage.getItem(userPlanKey) || '{"dailyTarget":30,"customActivities":[],"days":{}}');
      let planChanged = false;
      let explicitGoal: number | null = null;
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const uMeta = userRes?.user?.user_metadata || {};
        if (uMeta.daily_question_goal) explicitGoal = Number(uMeta.daily_question_goal);
        if (uMeta.nelov_daily_planner_v1 && typeof uMeta.nelov_daily_planner_v1 === 'object') {
          const mp = uMeta.nelov_daily_planner_v1;
          if (mp.dailyTarget && (!localPlan.dailyTarget || localPlan.dailyTarget === 30)) {
            localPlan.dailyTarget = Number(mp.dailyTarget);
            planChanged = true;
          }
          Object.keys(mp.days || {}).forEach((dKey) => {
            const gDay = mp.days[dKey] || {};
            const lDay = localPlan.days?.[dKey];
            const gTs = gDay.updatedAt ? new Date(gDay.updatedAt).getTime() : 0;
            const lTs = lDay?.updatedAt ? new Date(lDay.updatedAt).getTime() : 0;
            if (!lDay || gTs > lTs) {
              if (!localPlan.days) localPlan.days = {};
              localPlan.days[dKey] = gDay;
              planChanged = true;
            }
          });
        }
      } catch {}

      const resolvedGoal = explicitGoal || (user.dailyQuestionGoal && user.dailyQuestionGoal !== 30 ? user.dailyQuestionGoal : null);
      if (resolvedGoal && resolvedGoal !== localPlan.dailyTarget) {
        localPlan.dailyTarget = resolvedGoal;
        planChanged = true;
      }

      const { data: planRows, error: dpErr } = await supabase
        .from('daily_plans')
        .select('plan_date, topics, timetable_blocks, custom_activities, questions_solved_today, updated_at')
        .eq('user_id', uId)
        .order('plan_date', { ascending: false })
        .limit(90);

      if (!dpErr && Array.isArray(planRows)) {
        const actMap = new Map((localPlan.customActivities || []).map((a: any) => [a.id, a]));
        planRows.forEach((row: any) => {
          (row.custom_activities || []).forEach((a: any) => {
            if (a && a.id && !actMap.has(a.id)) {
              actMap.set(a.id, a);
              planChanged = true;
            }
          });
          const dKey = String(row.plan_date || '').slice(0, 10);
          if (!dKey) return;
          const localDay = localPlan.days?.[dKey];
          const cloudTs = row.updated_at ? new Date(row.updated_at).getTime() : 0;
          const localTs = localDay?.updatedAt ? new Date(localDay.updatedAt).getTime() : 0;
          if (!localDay || cloudTs >= localTs) {
            if (!localPlan.days) localPlan.days = {};
            localPlan.days[dKey] = {
              topics: Array.isArray(row.topics) ? row.topics : [],
              slots: row.timetable_blocks && typeof row.timetable_blocks === 'object' ? row.timetable_blocks : {},
              manualSolvedCount: Number(row.questions_solved_today || 0),
              updatedAt: row.updated_at || new Date().toISOString(),
            };
            planChanged = true;
          }
        });
        localPlan.customActivities = Array.from(actMap.values());
      }
      if (planChanged) {
        localStorage.setItem(userPlanKey, JSON.stringify(localPlan));
        window.dispatchEvent(new CustomEvent(DAILY_PLANNER_EVENT, { detail: localPlan }));
      }
    } catch {}

    try {
      const { data: cpRows } = await supabase
        .from('chapter_progress')
        .select('*')
        .eq('user_id', uId);

      if (Array.isArray(cpRows) && cpRows.length > 0) {
        const userCpKey = `nelov_${uId}_chapter_progress`;
        const all = JSON.parse(localStorage.getItem(userCpKey) || '{}');
        cpRows.forEach((row: any) => {
          const k = `${String(row.subject || '').toLowerCase()}:${String(row.chapter_slug || '').toLowerCase()}`;
          all[k] = {
            subject: row.subject,
            chapterSlug: row.chapter_slug,
            checklist: row.checklist || { notes: false, formula: false, pyqs: false, tests: false },
            progressPercent: row.progress_percent || 0,
            updatedAt: row.updated_at || new Date().toISOString(),
          };
        });
        localStorage.setItem(userCpKey, JSON.stringify(all));
        window.dispatchEvent(new CustomEvent(CHAPTER_PROGRESS_EVENT, { detail: all }));
      }
    } catch {}

    emitSyncStatus('saved', 'All data synced');
  },

  async hydrateAndMigrateOnLogin(user: User): Promise<void> {
    if (!user?.id) return;
    const hadGuest = this.migrateGuestLocalData(user.id);
    if (hadGuest && isSupabaseConfigured && supabase && uuidRegex.test(user.id)) {
      try {
        const localPlan = JSON.parse(localStorage.getItem(`nelov_${user.id}_daily_planner_v1`) || '{"dailyTarget":30,"customActivities":[],"days":{}}');
        const days = Object.keys(localPlan.days || {});
        if (days.length > 0) {
          const rows = days.map((dKey) => {
            const dPlan = localPlan.days[dKey] || {};
            return {
              user_id: user.id,
              plan_date: dKey,
              topics: dPlan.topics || [],
              timetable_blocks: dPlan.slots || {},
              custom_activities: localPlan.customActivities || [],
              questions_solved_today: Number(dPlan.manualSolvedCount || 0),
              updated_at: dPlan.updatedAt || new Date().toISOString(),
            };
          });
          await supabase.from('daily_plans').upsert(rows, { onConflict: 'user_id,plan_date' });
        }
      } catch {}
    }
    await this.hydrateFromCloud(user);
  },
};
