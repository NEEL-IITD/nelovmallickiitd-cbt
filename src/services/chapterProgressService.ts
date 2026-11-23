// ==============================================================================
// NelovMallickIITD · Chapter Progress & Mastery Service
// Tracks per-chapter 4-milestone checklist (0-100%) and tests given counts
// Immediate LocalStorage reactivity + background Supabase sync
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from './authService';

export interface ChapterChecklist {
  notes: boolean;    // Theory & Notes Revised (25%)
  formula: boolean;  // Formula Sheet Revised (25%)
  pyqs: boolean;     // PYQs / Sheet Solved (25%)
  tests: boolean;    // Chapter Test / Mock Practiced (25%)
}

export interface ChapterProgressData {
  subject: string;
  chapterSlug: string;
  checklist: ChapterChecklist;
  progressPercent: number; // 0, 25, 50, 75, 100
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'nelov_chapter_progress';
export const PROGRESS_UPDATED_EVENT = 'nelov:chapter-progress-updated';

function getStorageKey(userId?: string | null): string {
  if (userId) return `nelov_${userId}_chapter_progress`;
  return LOCAL_STORAGE_KEY;
}

function normalizeKey(subject: string, chapterSlug: string): string {
  return `${(subject || '').toLowerCase().trim()}:${(chapterSlug || '').toLowerCase().trim()}`;
}

export const chapterProgressService = {
  // --------------------------------------------------------------------------
  // Read All Progress from LocalStorage
  // --------------------------------------------------------------------------
  getAllProgress(userId?: string | null): Record<string, ChapterProgressData> {
    try {
      const activeUser = userId ? { id: userId } : authService.getCurrentUser();
      const key = getStorageKey(activeUser?.id);
      const raw = localStorage.getItem(key);
      const guestRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      let store: Record<string, ChapterProgressData> = {};
      if (guestRaw) {
        try { Object.assign(store, JSON.parse(guestRaw)); } catch (e) {}
      }
      if (raw && raw !== guestRaw) {
        try { Object.assign(store, JSON.parse(raw)); } catch (e) {}
      }
      return store;
    } catch (e) {
      return {};
    }
  },

  // --------------------------------------------------------------------------
  // Get Progress for a single chapter
  // --------------------------------------------------------------------------
  getChapterProgress(
    subject: string,
    chapterSlug: string,
    chapterCode?: string,
    exercises?: any[],
    userId?: string | null
  ): { checklist: ChapterChecklist; progressPercent: number; testsGivenCount: number } {
    const all = this.getAllProgress(userId);
    const key = normalizeKey(subject, chapterSlug);
    const existing = all[key] || all[chapterSlug.toLowerCase()] || null;

    const testsCount = this.getChapterTestsCount(subject, chapterSlug, chapterCode, exercises, userId);

    let checklist: ChapterChecklist = {
      notes: false,
      formula: false,
      pyqs: false,
      tests: false
    };

    if (existing && existing.checklist) {
      checklist = {
        notes: Boolean(existing.checklist.notes),
        formula: Boolean(existing.checklist.formula),
        pyqs: Boolean(existing.checklist.pyqs),
        tests: Boolean(existing.checklist.tests)
      };
    }

    // Auto-mark tests milestone if student has actually given test(s)
    if (testsCount > 0 && !checklist.tests) {
      checklist.tests = true;
    }

    const checkedCount = [checklist.notes, checklist.formula, checklist.pyqs, checklist.tests].filter(Boolean).length;
    const progressPercent = Math.round((checkedCount / 4) * 100);

    return {
      checklist,
      progressPercent,
      testsGivenCount: testsCount
    };
  },

  // --------------------------------------------------------------------------
  // Count submitted tests for a chapter
  // --------------------------------------------------------------------------
  getChapterTestsCount(
    _subject: string,
    chapterSlug: string,
    chapterCode?: string,
    exercises?: any[],
    userId?: string | null
  ): number {
    try {
      const activeUser = userId ? { id: userId } : authService.getCurrentUser();
      const uId = activeUser?.id || 'guest';

      let attempts: any[] = [];
      if (typeof window !== 'undefined' && (window as any).studentStorage?.getAttempts) {
        attempts = (window as any).studentStorage.getAttempts(uId) || [];
      } else {
        const raw = localStorage.getItem(`nelov_${uId}_attempts`) || localStorage.getItem('nelov_guest_attempts');
        if (raw) attempts = JSON.parse(raw);
      }

      // Merge vault exercise attempts if present
      const rawVaultAttempts = localStorage.getItem('nelov_vault_exercise_attempts');
      if (rawVaultAttempts) {
        try {
          const parsed = JSON.parse(rawVaultAttempts);
          if (Array.isArray(parsed)) attempts = attempts.concat(parsed);
        } catch (e) {}
      }

      if (!Array.isArray(attempts) || attempts.length === 0) return 0;

      const normSlug = (chapterSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const normCode = (chapterCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const exerciseIds = new Set((exercises || []).map(e => String(e.id || '').toLowerCase()));

      let count = 0;
      const countedKeys = new Set<string>();

      for (const att of attempts) {
        if (!att) continue;
        const dedupeKey = att.id || `${att.testId}_${att.completedAt || ''}_${att.percentage || ''}`;
        if (countedKeys.has(dedupeKey)) continue;

        const tId = String(att.testId || att.testCode || '').toLowerCase();
        const attSlug = String(att.chapterSlug || att.chapterId || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        let matches = false;
        if (exerciseIds.has(tId)) {
          matches = true;
        } else if (normSlug && (attSlug === normSlug || tId.startsWith(normSlug + '-') || tId.startsWith(normSlug + '_') || tId.includes(normSlug))) {
          matches = true;
        } else if (normCode && (attSlug === normCode || tId.startsWith(normCode + '-') || tId.startsWith(normCode + '_') || tId.includes(normCode))) {
          matches = true;
        }

        if (matches) {
          count++;
          countedKeys.add(dedupeKey);
        }
      }

      return count;
    } catch (e) {
      return 0;
    }
  },

  // --------------------------------------------------------------------------
  // Toggle or Set a Milestone Checkbox
  // --------------------------------------------------------------------------
  setMilestone(
    subject: string,
    chapterSlug: string,
    milestone: keyof ChapterChecklist,
    value: boolean,
    userId?: string | null
  ): ChapterProgressData {
    const all = this.getAllProgress(userId);
    const key = normalizeKey(subject, chapterSlug);
    const existing = all[key] || {
      subject,
      chapterSlug,
      checklist: { notes: false, formula: false, pyqs: false, tests: false },
      progressPercent: 0,
      updatedAt: new Date().toISOString()
    };

    const newChecklist = {
      ...existing.checklist,
      [milestone]: Boolean(value)
    };

    const checkedCount = [newChecklist.notes, newChecklist.formula, newChecklist.pyqs, newChecklist.tests].filter(Boolean).length;
    const progressPercent = Math.round((checkedCount / 4) * 100);

    const updatedData: ChapterProgressData = {
      subject,
      chapterSlug,
      checklist: newChecklist,
      progressPercent,
      updatedAt: new Date().toISOString()
    };

    all[key] = updatedData;

    // Save to local storage
    try {
      const activeUser = userId ? { id: userId } : authService.getCurrentUser();
      const storageKey = getStorageKey(activeUser?.id);
      localStorage.setItem(storageKey, JSON.stringify(all));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all)); // Keep guest sync in tandem
    } catch (e) {}

    // Dispatch reactivity event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT, { detail: updatedData }));
    }

    // Background sync to Supabase
    this.syncChapterToSupabase(updatedData, userId);

    return updatedData;
  },

  // --------------------------------------------------------------------------
  // Background Sync Single Chapter to Supabase
  // --------------------------------------------------------------------------
  async syncChapterToSupabase(data: ChapterProgressData, userId?: string | null): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const activeUser = userId ? { id: userId } : authService.getCurrentUser();
      if (!activeUser || !activeUser.id) return;

      const payload = {
        user_id: activeUser.id,
        subject: data.subject.toLowerCase(),
        chapter_slug: data.chapterSlug.toLowerCase(),
        checklist: data.checklist,
        progress_percent: data.progressPercent,
        updated_at: data.updatedAt || new Date().toISOString()
      };

      const { error } = await supabase
        .from('chapter_progress')
        .upsert(payload, { onConflict: 'user_id,subject,chapter_slug' });

      if (error) {
        console.warn('[ChapterProgress] Supabase sync warning:', error.message);
      }
    } catch (e) {
      console.warn('[ChapterProgress] Supabase sync exception:', e);
    }
  },

  // --------------------------------------------------------------------------
  // Fetch All Progress from Supabase for Logged-In Student
  // --------------------------------------------------------------------------
  async fetchProgressFromSupabase(userId?: string | null): Promise<Record<string, ChapterProgressData>> {
    if (!isSupabaseConfigured || !supabase) return this.getAllProgress(userId);
    try {
      const activeUser = userId ? { id: userId } : authService.getCurrentUser();
      if (!activeUser || !activeUser.id) return this.getAllProgress(userId);

      const { data, error } = await supabase
        .from('chapter_progress')
        .select('*')
        .eq('user_id', activeUser.id);

      if (error || !data) {
        return this.getAllProgress(userId);
      }

      const all = this.getAllProgress(userId);
      data.forEach((row: any) => {
        const key = normalizeKey(row.subject, row.chapter_slug);
        all[key] = {
          subject: row.subject,
          chapterSlug: row.chapter_slug,
          checklist: row.checklist || { notes: false, formula: false, pyqs: false, tests: false },
          progressPercent: row.progress_percent || 0,
          updatedAt: row.updated_at || new Date().toISOString()
        };
      });

      const storageKey = getStorageKey(activeUser.id);
      localStorage.setItem(storageKey, JSON.stringify(all));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT, { detail: all }));
      }

      return all;
    } catch (e) {
      return this.getAllProgress(userId);
    }
  }
};

// Expose globally for vanilla browser scripts
if (typeof window !== 'undefined') {
  (window as any).chapterProgressService = chapterProgressService;
}
