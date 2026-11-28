// ==============================================================================
// NelovMallickIITD CBT Platform - Student Storage & Cloud Sync Engine
// Supabase Cloud Sync with instant Local Storage Fallback & Crash Protection
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  ErrorReportItem, 
  ErrorReportStatus, 
  ErrorIssueType, 
  MistakeTagType,
  LeaderboardEntry,
  LeaderboardResult,
  OverallLeaderboardEntry,
  TopperSummaryItem,
  TestConfigItem
} from '../types';
import { authService } from '../services/authService';
import { checkClientRateLimit, errorReportSchema, canonicalizeLeaderboardTestId, canonicalizeAttemptTest } from '../utils/validationSchemas';
import { AdminSubmissionStats, AdminTestSubmissionBreakdown } from '../types';

export interface TestAttemptRecord {
  id: string;
  testId: string;
  testCode: string;
  testTitle: string;
  examType: 'JEE Mains' | 'JEE Advanced';
  testType?: 'mock' | 'chapter_exercise';
  status?: 'completed' | 'in_progress';
  totalMarksScored: number;
  totalMaxMarks: number;
  percentage: number;
  accuracy: number;
  attemptedCount: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  predictedAirDisplay?: string;
  tierLabel?: string;
  completedAt: string;
  subjectStats?: Record<string, { scored: number; max: number; accuracy?: number }>;
  incorrectQuestionIds?: number[];
  responses?: Record<string, any>;
  timePerQuestion?: Record<string, number>;
  questionTimings?: Record<string, number>;
  question_timings?: Record<string, number>;
  mistakeTags?: Record<string, string>;
  submissionTrigger?: string;
  timeTakenSeconds?: number;
  timeSpentTotal?: number;
  obtainedMarks?: number;
  totalMarks?: number;
}

export interface BookmarkedQuestion {
  id: number | string;
  uniqueKey: string; // e.g. "pta04_12"
  testId: string;
  testCode: string;
  subject: string;
  section: string;
  type: string;
  question: string;
  images?: string[];
  options?: any[];
  answer: any;
  explanation?: string;
  solution?: string;
  addedAt: string;
  mistakeTag?: MistakeTagType | string;
  personalNote?: string;
}

export interface UserStats {
  totalTests: number;
  averageScorePct: number;
  bestScorePct: number;
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  recentPredictedAir: string;
}

export const studentStorage = {
  // ----------------------------------------------------------------------------
  // IN-PROGRESS CBT SESSIONS (Local crash-protection against page refreshes)
  // ----------------------------------------------------------------------------
  saveSession(userId: string, testId: string, sessionData: any): void {
    if (!userId || !testId) return;
    try {
      const stamped = {
        ...(sessionData || {}),
        testId,
        updatedAt: (sessionData && sessionData.updatedAt) || new Date().toISOString()
      };
      localStorage.setItem(`nelov_${userId}_session_${testId}`, JSON.stringify(stamped));
    } catch (e) {}
  },

  getSession(userId: string, testId: string): any | null {
    if (!userId || !testId) return null;
    try {
      const raw = localStorage.getItem(`nelov_${userId}_session_${testId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  getLatestInProgressSession(userId: string): any | null {
    if (!userId) return null;
    try {
      const prefix = `nelov_${userId}_session_`;
      let best: any = null;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith(prefix)) continue;
        const testId = k.slice(prefix.length);
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (!parsed) continue;
        const ts = parsed.updatedAt ? new Date(parsed.updatedAt).getTime() : 0;
        const ansCount = parsed.responses ? Object.keys(parsed.responses).length : 0;
        if (!best || ts > best.ts || (ts === best.ts && ansCount > best.ansCount)) {
          best = { testId, ts, ansCount, ...parsed };
        }
      }
      return best;
    } catch (e) {
      return null;
    }
  },

  clearSession(userId: string, testId: string): void {
    if (!userId || !testId) return;
    try {
      localStorage.removeItem(`nelov_${userId}_session_${testId}`);
    } catch (e) {}
  },

  // ----------------------------------------------------------------------------
  // COMPLETED TEST ATTEMPTS (Cloud + Local Cache)
  // ----------------------------------------------------------------------------
  _inFlightSubmissions: new Set<string>(),
  _lastAttemptsError: null as any,

  async saveAttempt(userId: string, attemptRecord: TestAttemptRecord): Promise<void> {
    if (!userId) return;

    // 1. Generate / Validate deterministic UUID for attemptRecord.id (Postgres public.test_attempts.id is UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let attemptUuid = attemptRecord.id;
    if (!attemptUuid || !uuidRegex.test(attemptUuid)) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        attemptUuid = crypto.randomUUID();
      } else {
        attemptUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      attemptRecord.id = attemptUuid;
    }

    const canon = canonicalizeAttemptTest(
      attemptRecord.testId || attemptRecord.testCode,
      attemptRecord.testCode,
      attemptRecord.examType
    );
    const canonicalTestId = canon.testId;
    const canonicalCode = canon.code;
    const resolvedTestType = attemptRecord.testType || canon.testType;

    // Prevent concurrent double-submission for the same attempt UUID or simultaneous click+timeout
    const flightKey = `${userId}:${canonicalTestId}:${attemptUuid}`;
    if (this._inFlightSubmissions.has(flightKey)) return;
    this._inFlightSubmissions.add(flightKey);

    try {
      // Resolve live authenticated Supabase user ID if available & ensure session freshness
      let effectiveUserId = userId;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: sessData } = await supabase.auth.getSession();
          const sess = sessData?.session;
          if (sess) {
            const expMs = sess.expires_at ? sess.expires_at * 1000 : 0;
            if (expMs > 0 && expMs < Date.now() + 120000) {
              const { data: refData } = await supabase.auth.refreshSession();
              if (refData?.session?.user?.id && uuidRegex.test(refData.session.user.id)) {
                effectiveUserId = refData.session.user.id;
              }
            } else if (sess.user?.id && uuidRegex.test(sess.user.id)) {
              effectiveUserId = sess.user.id;
            }
          }
        } catch (e) {
          console.warn('[Supabase] Session check notice:', e);
        }
      }

      const normalizedRecord: TestAttemptRecord = {
        ...attemptRecord,
        id: attemptUuid,
        testId: canonicalTestId,
        testCode: canonicalCode,
        examType: attemptRecord.examType || canon.examType,
        testType: resolvedTestType,
        status: 'completed',
        completedAt: attemptRecord.completedAt || new Date().toISOString()
      };

      // 1. Always update local storage cache immediately for zero latency
      try {
        const attempts = this.getAttempts(userId);
        const existingIdx = attempts.findIndex((a) => a.id === attemptUuid);
        if (existingIdx !== -1) {
          attempts[existingIdx] = normalizedRecord;
        } else {
          attempts.unshift(normalizedRecord);
        }
        localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(attempts));
        if (effectiveUserId !== userId) {
          localStorage.setItem(`nelov_${effectiveUserId}_attempts`, JSON.stringify(attempts));
        }
      } catch (e) {}

      // 2. Cloud sync to Supabase `test_attempts` via idempotent upsert
      if (isSupabaseConfigured && supabase && uuidRegex.test(effectiveUserId)) {
        try {
          try {
            const profileName = (attemptRecord as any).candidateName || (attemptRecord as any).studentName || 'JEE Aspirant';
            const profileEmail = (attemptRecord as any).email || (attemptRecord as any).studentEmail || null;
            await supabase.from('profiles').upsert({
              id: effectiveUserId,
              full_name: profileName,
              email: profileEmail,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id', ignoreDuplicates: true });
          } catch (pe) {}

          const timeSec = attemptRecord.timeTakenSeconds || (attemptRecord.timeSpentTotal ? Math.round(attemptRecord.timeSpentTotal) : 0);
          const obtainedNum = Number(attemptRecord.totalMarksScored ?? (attemptRecord as any).obtainedMarks ?? 0);
          const totalNum = Number(attemptRecord.totalMaxMarks ?? attemptRecord.totalMarks ?? 300);
          const payload: Record<string, any> = {
            id: attemptUuid,
            user_id: effectiveUserId,
            test_id: canonicalTestId,
            exam_type: normalizedRecord.examType,
            test_type: resolvedTestType,
            status: 'completed',
            code: canonicalCode,
            obtained_marks: obtainedNum,
            total_marks: totalNum,
            score: obtainedNum,
            max_score: totalNum,
            percentage: Number(attemptRecord.percentage ?? 0),
            accuracy: Number(attemptRecord.accuracy ?? 0),
            time_taken_seconds: timeSec,
            time_spent_seconds: timeSec,
            estimated_rank_label: attemptRecord.predictedAirDisplay || 'AIR Qualified',
            subject_breakdown: attemptRecord.subjectStats || (attemptRecord as any).subjectBreakdown || {},
            responses: attemptRecord.responses || {},
            time_per_question: attemptRecord.questionTimings || attemptRecord.question_timings || attemptRecord.timePerQuestion || {},
            question_timings: attemptRecord.questionTimings || attemptRecord.question_timings || attemptRecord.timePerQuestion || {},
            mistake_tags: {
              ...(attemptRecord.mistakeTags || {}),
              submission_trigger: (attemptRecord as any).submissionTrigger || 'manual'
            },
            submitted_at: normalizedRecord.completedAt,
            updated_at: new Date().toISOString()
          };

          let savedCloud = false;
          for (let tryIdx = 0; tryIdx < 3; tryIdx++) {
            try {
              const { error } = await supabase.from('test_attempts').upsert(payload, { onConflict: 'id' });
              if (error) {
                console.warn(`[Supabase] saveAttempt try ${tryIdx + 1} warning:`, error.message);
                if ((error as any).status === 400 || (error as any).code === '42703' || /column|schema cache/i.test(error.message || '')) {
                  ['question_timings', 'test_type', 'score', 'max_score', 'time_spent_seconds', 'updated_at'].forEach((col) => {
                    if (col in payload && (error.message?.includes(col) || col !== 'status')) {
                      delete payload[col];
                    }
                  });
                }
                if ((error as any).status === 401 || error.message?.includes('JWT') || error.message?.includes('token') || error.message?.includes('expired') || error.message?.includes('auth')) {
                  try {
                    const { data: refData } = await supabase.auth.refreshSession();
                    if (refData?.session?.user?.id && uuidRegex.test(refData.session.user.id)) {
                      effectiveUserId = refData.session.user.id;
                      payload.user_id = effectiveUserId;
                    }
                  } catch (re) {}
                }
              } else {
                savedCloud = true;
                // Clean up leftover in_progress draft row for this user/test
                try {
                  await supabase
                    .from('test_attempts')
                    .delete()
                    .match({ user_id: effectiveUserId, test_id: canonicalTestId, status: 'in_progress' });
                } catch {}
                break;
              }
            } catch (err) {
              console.warn(`[Supabase] saveAttempt try ${tryIdx + 1} exception:`, err);
            }
            if (!savedCloud && tryIdx < 2) {
              await new Promise(r => setTimeout(r, 600));
            }
          }

          if (!savedCloud) {
            try {
              const qKey = 'nelov_pending_sync_attempts';
              const rawQ = localStorage.getItem(qKey);
              const q = rawQ ? JSON.parse(rawQ) : [];
              if (!q.some((item: any) => item.id === attemptUuid)) {
                q.push({ ...normalizedRecord, userId: effectiveUserId });
                localStorage.setItem(qKey, JSON.stringify(q));
              }
            } catch (qe) {}
          }
        } catch (cloudErr) {
          console.error('[Supabase] Cloud sync error:', cloudErr);
        }
      } else {
        try {
          const qKey = 'nelov_pending_sync_attempts';
          const rawQ = localStorage.getItem(qKey);
          const q = rawQ ? JSON.parse(rawQ) : [];
          if (!q.some((item: any) => item.id === attemptUuid)) {
            q.push({ ...normalizedRecord, userId: effectiveUserId });
            localStorage.setItem(qKey, JSON.stringify(q));
          }
        } catch (qe) {}
      }

      // 3. Dispatch global event so all dashboards react instantly
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('nelov_attempt_saved', {
            detail: {
              attemptRecord: normalizedRecord,
              userId: effectiveUserId,
              testId: canonicalTestId,
              code: canonicalCode
            }
          }));
        } catch (de) {}
      }
    } finally {
      this._inFlightSubmissions.delete(flightKey);
    }
  },
  async syncLocalAttemptsToSupabase(): Promise<{ synced: number; pending: number }> {
    if (!isSupabaseConfigured || !supabase) {
      return { synced: 0, pending: 0 };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let authUser: any = null;
    try {
      const { data: authData } = await supabase.auth.getUser();
      authUser = authData?.user;
    } catch (e) {}

    if (!authUser || !authUser.id || !uuidRegex.test(authUser.id)) {
      return { synced: 0, pending: 0 };
    }

    const candidates: any[] = [];
    const seenCandIds = new Set<string>();
    try {
      const qRaw = localStorage.getItem('nelov_pending_sync_attempts');
      if (qRaw) {
        const list = JSON.parse(qRaw);
        if (Array.isArray(list)) {
          list.forEach((item: any) => {
            if (item && !seenCandIds.has(item.id)) {
              if (item.id) seenCandIds.add(item.id);
              candidates.push(item);
            }
          });
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nelov_') && key.endsWith('_attempts')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              list.forEach((item: any) => {
                if (item && item.id && !seenCandIds.has(item.id)) {
                  seenCandIds.add(item.id);
                  candidates.push(item);
                }
              });
            }
          }
        }
      }
    } catch (e) {}

    if (candidates.length === 0) return { synced: 0, pending: 0 };

    try {
      await supabase.from('profiles').upsert({
        id: authUser.id,
        full_name: authUser.user_metadata?.full_name || 'JEE Aspirant',
        email: authUser.email || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id', ignoreDuplicates: true });
    } catch (pe) {}

    const existingIds = new Set<string>();
    try {
      const { data: userAttempts } = await supabase
        .from('test_attempts')
        .select('id')
        .eq('user_id', authUser.id);
      if (Array.isArray(userAttempts)) {
        userAttempts.forEach((a: any) => existingIds.add(a.id));
      }
    } catch (e) {}

    let syncedCount = 0;
    for (const attempt of candidates) {
      let attId = attempt.id;
      if (!attId || !uuidRegex.test(attId)) {
        attId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        attempt.id = attId;
      }

      if (existingIds.has(attId)) continue;

      const canonAttempt = canonicalizeAttemptTest(attempt.testId || attempt.testCode, attempt.testCode || attempt.code, attempt.examType);
      const timeSec = attempt.timeTakenSeconds || (attempt.timeSpentTotal ? Math.round(attempt.timeSpentTotal) : 0);
      const payload: Record<string, any> = {
        id: attId,
        user_id: authUser.id,
        test_id: canonAttempt.testId,
        exam_type: attempt.examType || canonAttempt.examType,
        test_type: attempt.testType || canonAttempt.testType,
        status: 'completed',
        code: canonAttempt.code,
        obtained_marks: Number(attempt.totalMarksScored ?? attempt.obtainedMarks ?? 0),
        total_marks: Number(attempt.totalMaxMarks ?? attempt.totalMarks ?? 300),
        percentage: Number(attempt.percentage ?? 0),
        accuracy: Number(attempt.accuracy ?? 0),
        time_taken_seconds: timeSec,
        estimated_rank_label: attempt.predictedAirDisplay || 'AIR Qualified',
        subject_breakdown: attempt.subjectStats || attempt.subjectBreakdown || {},
        responses: attempt.responses || {},
        time_per_question: attempt.questionTimings || attempt.question_timings || attempt.timePerQuestion || {},
        question_timings: attempt.questionTimings || attempt.question_timings || attempt.timePerQuestion || {},
        mistake_tags: {
          ...(attempt.mistakeTags || {}),
          submission_trigger: attempt.submissionTrigger || 'manual',
          sync_recovery: true
        },
        submitted_at: attempt.completedAt || attempt.submittedAt || new Date().toISOString()
      };

      try {
        let { error } = await supabase.from('test_attempts').upsert(payload, { onConflict: 'id' });
        if (error && (payload as any).question_timings && ((error as any).status === 400 || (error as any).code === '42703' || error.message?.includes('question_timings'))) {
          delete (payload as any).question_timings;
          const res2 = await supabase.from('test_attempts').upsert(payload, { onConflict: 'id' });
          error = res2.error;
        }
        if (!error) {
          existingIds.add(attId);
          syncedCount++;
        }
      } catch (err) {}
    }

    try {
      const qRaw = localStorage.getItem('nelov_pending_sync_attempts');
      if (qRaw) {
        const list = JSON.parse(qRaw);
        if (Array.isArray(list)) {
          const remaining = list.filter((item: any) => !existingIds.has(item.id));
          if (remaining.length > 0) {
            localStorage.setItem('nelov_pending_sync_attempts', JSON.stringify(remaining));
          } else {
            localStorage.removeItem('nelov_pending_sync_attempts');
          }
        }
      }
    } catch (e) {}

    return { synced: syncedCount, pending: candidates.length - syncedCount };
  },

  getAttempts(userId: string): TestAttemptRecord[] {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`nelov_${userId}_attempts`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  async fetchAttemptsFromCloud(userId: string): Promise<TestAttemptRecord[]> {
    if (!userId) return [];
    if (!isSupabaseConfigured || !supabase) {
      return this.getAttempts(userId);
    }

    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      if (!data) return this.getAttempts(userId);

      const completedRows = data.filter((d: any) => d.status !== 'in_progress' && Boolean(d.submitted_at));
      const records: TestAttemptRecord[] = completedRows.map((d: any) => ({
        id: d.id,
        testId: d.test_id,
        testCode: d.code,
        testTitle: `${d.exam_type} – ${d.code} Mock Test`,
        examType: d.exam_type,
        testType: d.test_type || (String(d.test_id || '').includes('chapter') ? 'chapter_exercise' : 'mock'),
        status: 'completed',
        totalMarksScored: Number(d.obtained_marks),
        totalMaxMarks: Number(d.total_marks),
        percentage: Number(d.percentage),
        accuracy: Number(d.accuracy),
        attemptedCount: 0,
        correctCount: 0,
        partialCount: 0,
        incorrectCount: 0,
        unattemptedCount: 0,
        predictedAirDisplay: d.estimated_rank_label,
        completedAt: d.submitted_at,
        subjectStats: d.subject_breakdown,
        responses: d.responses,
        timePerQuestion: d.time_per_question,
        mistakeTags: d.mistake_tags
      }));

      // Cache locally
      localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(records));
      return records;
    } catch (err) {
      console.warn('Error fetching attempts from Supabase:', err);
      return this.getAttempts(userId);
    }
  },

  // ----------------------------------------------------------------------------
  // REVISION NOTEBOOK BOOKMARKS (Cloud + Local Cache)
  // ----------------------------------------------------------------------------
  getBookmarks(userId: string): BookmarkedQuestion[] {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`nelov_${userId}_bookmarks`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  isBookmarked(userId: string, keyOrId: string | number): boolean {
    if (!userId || !keyOrId) return false;
    try {
      const bookmarks = this.getBookmarks(userId);
      const strKey = String(keyOrId);
      return bookmarks.some(b => 
        b.uniqueKey === strKey || 
        String(b.id) === strKey || 
        (b.uniqueKey && b.uniqueKey.endsWith(`_${strKey}`))
      );
    } catch (e) {
      return false;
    }
  },

  async toggleBookmark(userId: string, question: any): Promise<boolean> {
    if (!userId || !question) return false;
    const testId = question.testId || 'jee-advanced-pta-04';
    const uniqueKey = question.uniqueKey || `${testId}_${question.id}`;
    const bookmarks = this.getBookmarks(userId);
    const existingIndex = bookmarks.findIndex((b) => b.uniqueKey === uniqueKey);

    let isNowBookmarked = false;

    if (existingIndex !== -1) {
      // Remove
      bookmarks.splice(existingIndex, 1);
      isNowBookmarked = false;

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('bookmarks')
            .delete()
            .match({ user_id: userId, test_id: testId, question_id: String(question.id) });
        } catch (e) {}
      }
    } else {
      // Add
      const newBookmark: BookmarkedQuestion = {
        id: question.id,
        uniqueKey,
        testId,
        testCode: question.testCode || 'PTA 04',
        subject: question.subject || 'General',
        section: question.section || '',
        type: question.type || 'Single Correct',
        question: question.question || '',
        images: question.images || [],
        options: question.options || [],
        answer: question.answer,
        explanation: question.explanation || '',
        solution: question.solution || question.explanation || '',
        addedAt: new Date().toISOString(),
        mistakeTag: question.mistakeTag,
        personalNote: question.personalNote
      };
      bookmarks.unshift(newBookmark);
      isNowBookmarked = true;

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('bookmarks').upsert({
            user_id: userId,
            test_id: testId,
            question_id: String(question.id),
            exam_type: question.examType || 'JEE Advanced',
            subject: question.subject || 'General',
            question_type: question.type || 'Single Correct',
            mistake_tag: question.mistakeTag || null,
            personal_note: question.personalNote || null,
            created_at: new Date().toISOString()
          });
        } catch (e) {}
      }
    }

    try {
      localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
    } catch (e) {}

    return isNowBookmarked;
  },

  async updateMistakeTag(
    userId: string,
    uniqueKey: string,
    tag: MistakeTagType | string,
    personalNote?: string
  ): Promise<void> {
    if (!userId || !uniqueKey) return;
    const bookmarks = this.getBookmarks(userId);
    const item = bookmarks.find((b) => b.uniqueKey === uniqueKey);
    if (item) {
      item.mistakeTag = tag;
      if (personalNote !== undefined) item.personalNote = personalNote;
      try {
        localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
      } catch (e) {}

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('bookmarks')
            .update({
              mistake_tag: tag,
              personal_note: personalNote || item.personalNote
            })
            .match({ user_id: userId, test_id: item.testId, question_id: String(item.id) });
        } catch (e) {}
      }
    }
  },

  // ----------------------------------------------------------------------------
  // STUDENT "REPORT AN ERROR" WORKFLOW
  // ----------------------------------------------------------------------------
  async submitErrorReport(report: {
    userId?: string;
    reporterName: string;
    reporterEmail: string;
    reporterContactNumber?: string;
    testId: string;
    examType: string;
    testCode: string;
    questionId: string;
    questionNumber: number;
    issueType: ErrorIssueType | string;
    description: string;
  }): Promise<void> {
    const rl = checkClientRateLimit('error_report_submit', 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      throw new Error(`Please wait ${rl.retryAfterSec}s before submitting another report.`);
    }
    const parsed = errorReportSchema.safeParse({
      testId: String(report.testId || 'General'),
      issueType: String(report.issueType || 'other'),
      description: String(report.description || '')
    });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid report details.');
    }

    const reportItem: ErrorReportItem = {
      id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...report,
      description: parsed.data.description,
      issueType: parsed.data.issueType as ErrorIssueType,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    // 1. Cloud insert into Supabase `error_reports`
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('error_reports').insert({
          id: reportItem.id.startsWith('rep_') ? undefined : reportItem.id,
          user_id: report.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(report.userId) ? report.userId : null,
          reporter_name: String(report.reporterName || 'Aspirant').slice(0, 120),
          reporter_email: String(report.reporterEmail || '').slice(0, 160),
          reporter_contact_number: report.reporterContactNumber ? String(report.reporterContactNumber).slice(0, 30) : null,
          test_id: parsed.data.testId,
          exam_type: String(report.examType || 'General').slice(0, 80),
          test_code: String(report.testCode || 'General').slice(0, 80),
          question_id: String(report.questionId || '0').slice(0, 80),
          question_number: Number(report.questionNumber) || 0,
          issue_type: parsed.data.issueType,
          description: parsed.data.description,
          status: 'open',
          created_at: reportItem.createdAt
        });

        if (error) {
          console.warn('[Supabase] Error report insert failed, falling back to local store:', error.message);
        }
      } catch (e) {
        console.warn('[Supabase] Error reporting exception:', e);
      }
    }

    // 2. Local fallback storage
    try {
      const existing = this.getLocalErrorReports();
      existing.unshift(reportItem);
      localStorage.setItem('nelov_error_reports', JSON.stringify(existing));
    } catch (e) {}
  },

  getLocalErrorReports(): ErrorReportItem[] {
    try {
      const raw = localStorage.getItem('nelov_error_reports');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  async getAllErrorReports(): Promise<ErrorReportItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('error_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            reporterName: d.reporter_name,
            reporterEmail: d.reporter_email,
            reporterContactNumber: d.reporter_contact_number || d.reporterContactNumber || null,
            testId: d.test_id,
            examType: d.exam_type,
            testCode: d.test_code,
            questionId: d.question_id,
            questionNumber: d.question_number,
            issueType: d.issue_type,
            description: d.description,
            status: d.status,
            adminNote: d.admin_note,
            createdAt: d.created_at
          }));
        }
      } catch (e) {
        console.warn('Error reports query error:', e);
      }
    }
    return this.getLocalErrorReports();
  },

  async updateErrorReportStatus(
    reportId: string,
    status: ErrorReportStatus,
    adminNote?: string
  ): Promise<void> {
    // 1. Cloud update
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('error_reports')
          .update({
            status,
            admin_note: adminNote
          })
          .eq('id', reportId);
      } catch (e) {}
    }

    // 2. Local cache update
    try {
      const reports = this.getLocalErrorReports();
      const r = reports.find((item) => item.id === reportId);
      if (r) {
        r.status = status;
        if (adminNote !== undefined) r.adminNote = adminNote;
        localStorage.setItem('nelov_error_reports', JSON.stringify(reports));
      }
    } catch (e) {}
  },

  // ----------------------------------------------------------------------------
  // DYNAMIC TEST CONFIGURATIONS (Live vs Coming Soon)
  // ----------------------------------------------------------------------------
  async getTestConfigs(): Promise<Record<string, 'live' | 'coming_soon'>> {
    // Default fallback
    const defaults: Record<string, 'live' | 'coming_soon'> = {
      'jee-advanced-pta-04': 'live',
      'jee-advanced-pta-05': 'live'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('test_configs').select('test_id, status');
        if (!error && data) {
          const map: Record<string, 'live' | 'coming_soon'> = {};
          data.forEach((row: any) => {
            map[row.test_id] = row.status as 'live' | 'coming_soon';
          });
          // Ensure tests with verified digitized papers are always 'live'
          map['jee-mains-ptm-01'] = 'live';
          map['jee-mains-ptm-02'] = 'live';
          map['jee-mains-ptm-03'] = 'live';
          map['jee-mains-ptm-04'] = 'live';
          map['jee-mains-ptm-05'] = 'live';
          map['jee-advanced-pta-04'] = 'live';
          map['jee-advanced-pta-05'] = 'live';
          map['jee-advanced-pta-06'] = 'live';
          return map;
        }
      } catch (e) {}
    }

    // Local overrides
    try {
      const local = localStorage.getItem('nelov_test_configs_overrides');
      if (local) {
        return { ...defaults, ...JSON.parse(local) };
      }
    } catch (e) {}

    return defaults;
  },

  async updateTestConfigStatus(testId: string, status: 'live' | 'coming_soon'): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('test_configs')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('test_id', testId);
      } catch (e) {}
    }

    try {
      const local = localStorage.getItem('nelov_test_configs_overrides');
      const current = local ? JSON.parse(local) : {};
      current[testId] = status;
      localStorage.setItem('nelov_test_configs_overrides', JSON.stringify(current));
    } catch (e) {}
  },

  async getTestConfigsDetails(): Promise<TestConfigItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('test_configs').select('*');
        if (!error && data) {
          return data.map((d: any) => ({
            testId: d.test_id,
            examType: d.exam_type,
            code: d.code,
            title: d.title,
            status: d.status,
            isScheduledWindow: d.is_scheduled_window || false,
            startsAt: d.starts_at || null,
            endsAt: d.ends_at || null,
            windowLabel: d.window_label || null,
            lockLeaderboardUntilEnd: d.lock_leaderboard_until_end ?? false,
            allowPracticeAfterEnd: d.allow_practice_after_end ?? true,
            updatedAt: d.updated_at
          }));
        }
      } catch (e) {}
    }
    return [];
  },

  async updateTestSchedule(
    testId: string, 
    scheduleData: {
      is_scheduled_window: boolean;
      starts_at: string | null;
      ends_at: string | null;
      window_label: string | null;
      lock_leaderboard_until_end: boolean;
      allow_practice_after_end: boolean;
    }
  ): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('test_configs')
          .update({
            ...scheduleData,
            updated_at: new Date().toISOString()
          })
          .eq('test_id', testId);
        if (error) {
          console.error('[Supabase] updateTestSchedule error:', error);
          return false;
        }
      } catch (e) {
        console.error('[Supabase] updateTestSchedule error:', e);
      }
    }

    try {
      const local = localStorage.getItem('nelov_test_schedules') || '{}';
      const parsed = JSON.parse(local);
      parsed[testId] = scheduleData;
      localStorage.setItem('nelov_test_schedules', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('nelov_test_configs_changed', { detail: { testId, scheduleData } }));
      return true;
    } catch (e) {
      return false;
    }
  },

  async getTestLeaderboard(testId: string): Promise<LeaderboardResult> {
    const canonicalId = canonicalizeLeaderboardTestId(testId);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_test_leaderboard', { p_test_id: canonicalId });
        if (!error && data) {
          const mapEntry = (e: any): LeaderboardEntry => ({
            rank: e.rank,
            displayName: e.display_name || e.student_name || 'JEE Aspirant',
            marks: Number(e.marks ?? e.score ?? e.obtained_marks ?? 0),
            maxMarks: Number(e.max_marks ?? e.total_marks ?? 300),
            percentage: Number(e.percentage ?? 0),
            percentile: Number(e.percentile ?? 0),
            accuracy: Number(e.accuracy ?? 0),
            timeTakenSeconds: Number(e.time_taken_seconds ?? 0),
            submittedAt: e.submitted_at,
            attemptedInLiveWindow: Boolean(e.attempted_in_live_window),
            isCurrentUser: Boolean(e.is_current_user)
          });

          const rawTop5 = Array.isArray(data.top_5) ? data.top_5 : [];
          const rawAll = Array.isArray(data.all_entries) ? data.all_entries : [];
          const rawEntries = Array.isArray(data.entries) && data.entries.length > 0
            ? data.entries
            : (rawTop5.length > 0 ? rawTop5 : rawAll);

          const top5 = (rawTop5.length > 0 ? rawTop5 : rawEntries.slice(0, 5)).map(mapEntry);
          const allEntries = rawAll.map(mapEntry);
          const entries = rawEntries.map(mapEntry);

          return {
            locked: false,
            unlocksAt: null,
            totalParticipants: Number(data.total_participants || 0),
            averageMarks: Number(data.average_marks ?? data.avg_marks ?? 0),
            highestMarks: Number(data.highest_marks ?? 0),
            topper: data.topper ? mapEntry(data.topper) : (top5[0] || null),
            top5,
            allEntries,
            myStanding: data.my_standing ? mapEntry(data.my_standing) : null,
            entries,
            myAttemptSubmitted: Boolean(data.my_attempt_submitted),
            error: null
          };
        }
        console.error('[Supabase] get_test_leaderboard rpc error:', error);
        return {
          locked: false,
          unlocksAt: null,
          totalParticipants: 0,
          averageMarks: 0,
          highestMarks: 0,
          topper: null,
          top5: [],
          allEntries: [],
          myStanding: null,
          entries: [],
          myAttemptSubmitted: false,
          error: error?.message || 'Unable to load leaderboard from server.'
        };
      } catch (e: any) {
        console.warn('[Supabase] get_test_leaderboard rpc error:', e);
        return {
          locked: false,
          unlocksAt: null,
          totalParticipants: 0,
          averageMarks: 0,
          highestMarks: 0,
          topper: null,
          top5: [],
          allEntries: [],
          myStanding: null,
          entries: [],
          myAttemptSubmitted: false,
          error: e?.message || 'Network error while loading leaderboard.'
        };
      }
    }

    return await this.calculateLocalTestLeaderboard(canonicalId);
  },

  async calculateLocalTestLeaderboard(testId: string): Promise<LeaderboardResult> {
    let all: any[] = [];
    try {
      all = await studentStorage.getAllAttempts();
    } catch (e) {
      all = [];
    }
    if (!Array.isArray(all)) all = [];
    const currentUser = authService.getCurrentUser();
    const currentUid = currentUser?.id;

    const norm = (id: any) => (id || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetNorm = norm(testId);

    const isAdminUser = (a: any) => {
      const email = (a.userEmail || a.email || a.profiles?.email || a.candidateEmail || '').toLowerCase().trim();
      const role = (a.role || a.profiles?.role || '').toLowerCase().trim();
      return email === 'mallicknelov@gmail.com' || role === 'admin';
    };

    const isCurrentAdmin =
      (currentUser?.email || '').toLowerCase().trim() === 'mallicknelov@gmail.com' ||
      currentUser?.role === 'admin';

    // Filter by testId, exclude Admin attempts, and pick BEST attempt per user (highest marks)
    const userBestAttemptsMap: Record<string, any> = {};
    (all || [])
      .filter((a: any) => {
        if (isAdminUser(a)) return false;
        const tNorm = norm(a.testId);
        const cNorm = norm(a.testCode || a.code);
        return tNorm === targetNorm || cNorm === targetNorm || targetNorm.endsWith(cNorm) || (cNorm && targetNorm.includes(cNorm));
      })
      .forEach((a: any) => {
        const uId = a.userId || a.user_id;
        if (!uId) return;
        const currentBest = userBestAttemptsMap[uId];
        if (!currentBest) {
          userBestAttemptsMap[uId] = a;
        } else {
          const scoreCurrent = Number(a.totalMarksScored ?? a.obtainedMarks ?? a.score ?? 0);
          const scoreBest = Number(currentBest.totalMarksScored ?? currentBest.obtainedMarks ?? currentBest.score ?? 0);
          if (scoreCurrent > scoreBest) {
            userBestAttemptsMap[uId] = a;
          } else if (scoreCurrent === scoreBest) {
            const accCurrent = Number(a.accuracy ?? 0);
            const accBest = Number(currentBest.accuracy ?? 0);
            if (accCurrent > accBest) {
              userBestAttemptsMap[uId] = a;
            } else if (accCurrent === accBest) {
              const timeCurrent = Number(a.timeTakenSeconds || a.time_taken_seconds || 999999);
              const timeBest = Number(currentBest.timeTakenSeconds || currentBest.time_taken_seconds || 999999);
              if (timeCurrent < timeBest) {
                userBestAttemptsMap[uId] = a;
              }
            }
          }
        }
      });

    const bestAttempts = Object.values(userBestAttemptsMap);
    const totalParticipants = bestAttempts.length;

    if (totalParticipants === 0) {
      return {
        locked: false,
        unlocksAt: null,
        totalParticipants: 0,
        averageMarks: 0,
        highestMarks: 0,
        topper: null,
        top5: [],
        myStanding: null,
        entries: [],
        myAttemptSubmitted: false
      };
    }

    // Sort by Score DESC, Accuracy DESC, Time ASC
    bestAttempts.sort((a, b) => {
      const scoreA = Number(a.totalMarksScored ?? a.obtainedMarks ?? 0);
      const scoreB = Number(b.totalMarksScored ?? b.obtainedMarks ?? 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      const accA = Number(a.accuracy ?? 0);
      const accB = Number(b.accuracy ?? 0);
      if (accB !== accA) return accB - accA;
      return (a.timeTakenSeconds || a.time_taken_seconds || 0) - (b.timeTakenSeconds || b.time_taken_seconds || 0);
    });

    const highestMarks = Number(bestAttempts[0]?.totalMarksScored ?? bestAttempts[0]?.obtainedMarks ?? 0);
    const avgMarks = Math.round((bestAttempts.reduce((sum, a) => sum + Number(a.totalMarksScored ?? a.obtainedMarks ?? 0), 0) / totalParticipants) * 10) / 10;

    const entries: LeaderboardEntry[] = bestAttempts.map((a, index) => {
      const rank = index + 1;
      const myScore = Number(a.totalMarksScored ?? a.obtainedMarks ?? 0);
      const countBelowOrEqual = bestAttempts.filter((other) => Number(other.totalMarksScored ?? other.obtainedMarks ?? 0) <= myScore).length;
      const percentile = Math.round((countBelowOrEqual / totalParticipants) * 10000) / 100;
      const uId = a.userId || a.user_id;

      return {
        rank,
        displayName: a.studentName || a.candidateName || a.profiles?.full_name || 'JEE Aspirant',
        marks: myScore,
        maxMarks: Number(a.totalMaxMarks ?? a.totalMarks ?? 300),
        percentage: Number(a.percentage ?? 0),
        percentile,
        accuracy: Number(a.accuracy ?? 0),
        timeTakenSeconds: a.timeTakenSeconds || a.time_taken_seconds || 0,
        submittedAt: a.completedAt || a.submitted_at || a.submittedAt,
        attemptedInLiveWindow: !!(a.attemptedInLiveWindow || a.attempted_in_live_window),
        isCurrentUser: !isCurrentAdmin && currentUid === uId
      };
    });

    const topper = entries[0] || null;
    const top5 = entries.slice(0, 5);
    const myStanding = isCurrentAdmin ? null : (entries.find((e) => e.isCurrentUser) || null);
    const myAttemptSubmitted = isCurrentAdmin ? false : !!bestAttempts.find((a) => (a.userId || a.user_id) === currentUid);

    return {
      locked: false,
      unlocksAt: null,
      totalParticipants,
      averageMarks: avgMarks,
      highestMarks,
      topper,
      top5,
      myStanding,
      entries,
      myAttemptSubmitted
    };
  },

  async getTestToppersSummary(): Promise<TopperSummaryItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_test_toppers_summary');
        if (!error && Array.isArray(data)) {
          return data.map((d: any) => ({
            testId: d.test_id,
            code: d.code,
            title: d.title,
            examType: d.exam_type,
            isScheduledWindow: d.is_scheduled_window || false,
            startsAt: d.starts_at || null,
            endsAt: d.ends_at || null,
            windowLabel: d.window_label || null,
            isLocked: d.is_locked || false,
            totalParticipants: d.total_participants || 0,
            topperName: d.topper_name || null,
            topperMarks: d.topper_marks || null,
            maxMarks: d.max_marks || null,
            topperPercentile: d.topper_percentile || null
          }));
        }
      } catch (e) {
        console.warn('[Supabase] get_test_toppers_summary fallback:', e);
      }
    }
    return [];
  },

  async getOverallLeaderboard(): Promise<OverallLeaderboardEntry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_overall_leaderboard');
        if (!error && Array.isArray(data)) {
          return data.map((d: any) => ({
            rank: d.rank,
            displayName: d.display_name,
            testsAttempted: d.tests_attempted,
            avgPercentile: d.avg_percentile,
            avgMarksPercent: d.avg_marks_percent,
            totalMarksScored: d.total_marks_scored,
            totalMaxMarks: d.total_max_marks,
            isCurrentUser: d.is_current_user
          }));
        }
      } catch (e) {
        console.warn('[Supabase] get_overall_leaderboard fallback:', e);
      }
    }
    return [];
  },

  // ----------------------------------------------------------------------------
  // AGGREGATE USER STATS & KPIS
  // ----------------------------------------------------------------------------
  getUserStats(userId: string): UserStats {
    const attempts = this.getAttempts(userId);
    if (attempts.length === 0) {
      return {
        totalTests: 0,
        averageScorePct: 0,
        bestScorePct: 0,
        totalQuestionsAttempted: 0,
        overallAccuracy: 0,
        recentPredictedAir: 'Not Available'
      };
    }

    const totalPct = attempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
    const bestPct = Math.max(...attempts.map((a) => a.percentage || 0));
    const totalAttemptedQuestions = attempts.reduce((acc, a) => acc + (a.attemptedCount || 0), 0);
    const avgAccuracy = Math.round(
      attempts.reduce((acc, a) => acc + (a.accuracy || 0), 0) / attempts.length
    );

    return {
      totalTests: attempts.length,
      averageScorePct: Math.round(totalPct / attempts.length),
      bestScorePct: Math.round(bestPct),
      totalQuestionsAttempted: totalAttemptedQuestions,
      overallAccuracy: avgAccuracy,
      recentPredictedAir: attempts[0]?.predictedAirDisplay || 'Qualified'
    };
  },

  // ----------------------------------------------------------------------------
  // LECTURE PROGRESS & NOTES
  // ----------------------------------------------------------------------------
  async saveLectureProgress(
    userId: string,
    chapterSlug: string,
    videoId: string,
    lectureNumber: string,
    completed: boolean,
    personalNote?: string
  ): Promise<void> {
    const updatedAt = new Date().toISOString();
    // 1. Supabase sync if configured
    if (isSupabaseConfigured && supabase && userId) {
      try {
        await supabase.from('lecture_progress').upsert(
          {
            user_id: userId,
            chapter_slug: chapterSlug,
            video_id: videoId,
            lecture_number: lectureNumber,
            completed,
            personal_note: personalNote || null,
            updated_at: updatedAt
          },
          { onConflict: 'user_id,video_id' }
        );
      } catch (e) {}
    }

    // 2. LocalStorage fallback
    try {
      const key = `nelov_${userId}_lecture_progress`;
      const raw = localStorage.getItem(key);
      const current = raw ? JSON.parse(raw) : {};
      current[videoId] = {
        userId,
        chapterSlug,
        videoId,
        lectureNumber,
        completed,
        personalNote: personalNote !== undefined ? personalNote : current[videoId]?.personalNote || '',
        updatedAt
      };
      localStorage.setItem(key, JSON.stringify(current));
    } catch (e) {}
  },

  getLectureProgress(userId: string): Record<string, any> {
    if (!userId) return {};
    try {
      const raw = localStorage.getItem(`nelov_${userId}_lecture_progress`);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  },

  getTotalLecturesCompleted(userId: string): number {
    const progress = this.getLectureProgress(userId);
    return Object.values(progress).filter((p: any) => p && p.completed).length;
  },

  async loadCloudLectureProgress(userId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase || !userId) return;
    try {
      const { data, error } = await supabase
        .from('lecture_progress')
        .select('*')
        .eq('user_id', userId);
      if (!error && data && data.length > 0) {
        const local = this.getLectureProgress(userId);
        data.forEach((row: any) => {
          local[row.video_id] = {
            userId,
            chapterSlug: row.chapter_slug,
            videoId: row.video_id,
            lectureNumber: row.lecture_number,
            completed: row.completed,
            personalNote: row.personal_note || '',
            updatedAt: row.updated_at
          };
        });
        localStorage.setItem(`nelov_${userId}_lecture_progress`, JSON.stringify(local));
      }
    } catch (e) {}
  },

  // ----------------------------------------------------------------------------
  // ATTEMPT LIMIT ENFORCEMENT (3 Attempts per Test Limit)
  // ----------------------------------------------------------------------------
  getTestAttemptsCount(userId: string, testId: string): number {
    const attempts = this.getAttempts(userId);
    return attempts.filter((a) => a.testId === testId).length;
  },

  canAttemptTest(userId: string, testId: string): boolean {
    return this.getTestAttemptsCount(userId, testId) < 3;
  },

  // ----------------------------------------------------------------------------
  // ADMIN AGGREGATIONS & CLOUD DIRECTORY
  // ----------------------------------------------------------------------------
  async getProfilesWithStatus(): Promise<{ data: any[]; error: any | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('[Supabase] getAllProfiles error:', error);
          // Return empty data but pass along error for visibility
          return { data: [], error };
        }
        return { data: data || [], error: null };
      } catch (e: any) {
        console.error('[Supabase] getAllProfiles exception:', e);
        return { data: [], error: e };
      }
    }
    const users = (authService as any).getAllUsers ? (authService as any).getAllUsers() : [];
    return {
      data: users.map((u: any) => ({
        id: u.id,
        full_name: u.name,
        email: u.email,
        contact_number: u.contactNumber,
        auth_method: u.authMethod || (u.contactNumber ? 'phone' : 'gmail'),
        target_exam: u.targetExam,
        role: u.role,
        created_at: u.createdAt
      })),
      error: null
    };
  },

  async getAllProfiles(): Promise<any[]> {
    const res = await this.getProfilesWithStatus();
    if (res.data && res.data.length > 0) {
      return res.data;
    }
    // Local storage fallback if Supabase returns nothing or in local-only mode
    const users = (authService as any).getAllUsers ? (authService as any).getAllUsers() : [];
    return users.map((u: any) => ({
      id: u.id,
      full_name: u.name,
      email: u.email,
      contact_number: u.contactNumber,
      auth_method: u.authMethod || (u.contactNumber ? 'phone' : 'gmail'),
      target_exam: u.targetExam,
      role: u.role,
      created_at: u.createdAt
    }));
  },

  async getAllAttempts(): Promise<any[]> {
    const allAttempts: any[] = [];
    const seenIds = new Set<string>();

    if (isSupabaseConfigured && supabase) {
      try {
        const attemptsData: any[] = [];
        const PAGE_SIZE = 1000;
        let offset = 0;
        let attError: any = null;

        while (true) {
          const { data: pageRows, error: pageErr } = await supabase
            .from('test_attempts')
            .select('*')
            .eq('status', 'completed')
            .not('submitted_at', 'is', null)
            .order('submitted_at', { ascending: false })
            .range(offset, offset + PAGE_SIZE - 1);

          if (pageErr) {
            attError = pageErr;
            break;
          }
          if (Array.isArray(pageRows) && pageRows.length > 0) {
            attemptsData.push(...pageRows);
          }
          if (!Array.isArray(pageRows) || pageRows.length < PAGE_SIZE) {
            break;
          }
          offset += PAGE_SIZE;
        }

        // Fallback when DB table does not have `status` column migrated yet
        if (attError && (attError.code === '42703' || String(attError.message || '').includes('status'))) {
          attError = null;
          offset = 0;
          attemptsData.length = 0;
          while (true) {
            const { data: pageRows, error: pageErr } = await supabase
              .from('test_attempts')
              .select('*')
              .not('submitted_at', 'is', null)
              .order('submitted_at', { ascending: false })
              .range(offset, offset + PAGE_SIZE - 1);
            if (pageErr) {
              attError = pageErr;
              break;
            }
            if (Array.isArray(pageRows) && pageRows.length > 0) {
              attemptsData.push(...pageRows);
            }
            if (!Array.isArray(pageRows) || pageRows.length < PAGE_SIZE) {
              break;
            }
            offset += PAGE_SIZE;
          }
        }

        if (attError) {
          console.error('[Supabase] getAllAttempts test_attempts error:', attError.message);
          this._lastAttemptsError = attError;
        } else {
          this._lastAttemptsError = null;
        }

        const { data: profilesData } = await supabase.from('profiles').select('*');
        const profilesMap: Record<string, any> = {};
        if (Array.isArray(profilesData)) {
          profilesData.forEach((p: any) => {
            if (p.id) profilesMap[p.id] = p;
          });
        }

        attemptsData.forEach((d: any) => {
          if (d.status === 'in_progress' || !d.submitted_at) return;
          if (seenIds.has(d.id)) return;
          seenIds.add(d.id);
          const p = profilesMap[d.user_id] || {};
          const rawEmail = p.email || '';
          const isSynthetic = rawEmail.endsWith('@phone.nelovportal.local');
          const studentName = p.full_name || p.name || 'JEE Aspirant';
          const isAdminAttempt = p.role === 'admin' || rawEmail.toLowerCase().trim() === 'mallicknelov@gmail.com';
          const canon = canonicalizeAttemptTest(d.test_id, d.code, d.exam_type);
          const resolvedType = d.test_type || canon.testType;

          allAttempts.push({
            id: d.id,
            userId: d.user_id,
            user_id: d.user_id,
            studentName: studentName,
            candidateName: studentName,
            userName: studentName,
            studentEmail: isSynthetic ? '' : rawEmail,
            email: isSynthetic ? '' : rawEmail,
            studentContact: p.contact_number || '',
            contactNumber: p.contact_number || '',
            authMethod: p.auth_method || (p.contact_number ? 'phone' : 'gmail'),
            testId: canon.testId,
            rawTestId: d.test_id,
            testType: resolvedType,
            status: d.status || 'completed',
            isAdminAttempt,
            examType: d.exam_type || canon.examType,
            testCode: canon.code,
            code: canon.code,
            obtainedMarks: Number(d.obtained_marks ?? 0),
            totalMarksScored: Number(d.obtained_marks ?? 0),
            totalMarks: Number(d.total_marks ?? 300),
            totalMaxMarks: Number(d.total_marks ?? 300),
            percentage: Number(d.percentage ?? 0),
            accuracy: Number(d.accuracy ?? 0),
            timeTakenSeconds: Number(d.time_taken_seconds ?? 0),
            time_taken_seconds: Number(d.time_taken_seconds ?? 0),
            estimatedRankLabel: d.estimated_rank_label,
            predictedAirDisplay: d.estimated_rank_label,
            subjectStats: d.subject_breakdown || {},
            subjectBreakdown: d.subject_breakdown || {},
            responses: d.responses || {},
            mistakeTags: d.mistake_tags || {},
            submittedAt: d.submitted_at,
            completedAt: d.submitted_at
          });
        });

        return allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      } catch (e: any) {
        console.warn('Exception fetching all test attempts from Supabase:', e);
        this._lastAttemptsError = e;
        return [];
      }
    }

    // Offline local fallback (only executes when Supabase cloud is NOT configured)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && ((key.startsWith('nelov_') && key.endsWith('_attempts')) || key === 'nelov_pending_sync_attempts' || key === 'nelov_vault_exercise_attempts')) {
          const uId = key.replace('nelov_', '').replace('_attempts', '');
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              list.forEach((item: any) => {
                if (!item || item.status === 'in_progress') return;
                const rowId = item.id || `${uId}:${item.testId || item.exerciseId}:${item.completedAt || item.submittedAt}`;
                if (seenIds.has(rowId)) return;
                seenIds.add(rowId);
                const canon = canonicalizeAttemptTest(item.testId || item.exerciseId, item.testCode || item.code || item.exerciseTitle, item.examType);
                allAttempts.push({
                  ...item,
                  id: rowId,
                  userId: item.userId || uId,
                  user_id: item.userId || uId,
                  testId: canon.testId,
                  testType: item.testType || (key === 'nelov_vault_exercise_attempts' ? 'chapter_exercise' : canon.testType),
                  testCode: canon.code,
                  code: canon.code,
                  obtainedMarks: Number(item.totalMarksScored ?? item.obtainedMarks ?? item.score ?? 0),
                  totalMarksScored: Number(item.totalMarksScored ?? item.obtainedMarks ?? item.score ?? 0),
                  totalMarks: Number(item.totalMaxMarks ?? item.totalMarks ?? 300),
                  totalMaxMarks: Number(item.totalMaxMarks ?? item.totalMarks ?? 300),
                  submittedAt: item.completedAt || item.submittedAt || new Date().toISOString(),
                  completedAt: item.completedAt || item.submittedAt || new Date().toISOString()
                });
              });
            }
          }
        }
      }
    } catch (e) {}

    return allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async getAdminSubmissionStats(preloadedAttempts?: any[]): Promise<AdminSubmissionStats> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_admin_submission_stats');
        if (!error && data && typeof data === 'object') {
          const rawByTest: any[] = Array.isArray((data as any).by_test) ? (data as any).by_test : [];
          return {
            uniqueSubmissionsTotal: Number((data as any).unique_submissions_total ?? (data as any).unique_students_total ?? 0),
            uniqueStudentsTotal: Number((data as any).unique_students_total ?? 0),
            completedTotal: Number((data as any).completed_total ?? 0),
            completedIncludingAdmin: Number((data as any).completed_including_admin ?? 0),
            adminPreviewCount: Number((data as any).admin_preview_count ?? 0),
            inProgressCount: Number((data as any).in_progress_count ?? 0),
            mockUniqueSubmissions: Number((data as any).mock_unique_submissions ?? 0),
            chapterUniqueSubmissions: Number((data as any).chapter_unique_submissions ?? 0),
            mockCompletedCount: Number((data as any).mock_completed_count ?? 0),
            chapterCompletedCount: Number((data as any).chapter_completed_count ?? 0),
            byTest: rawByTest.map((b: any) => ({
              testId: b.test_id,
              code: b.code,
              testType: b.test_type === 'chapter_exercise' ? 'chapter_exercise' : 'mock',
              completedCount: Number(b.completed_count ?? 0),
              uniqueStudents: Number(b.unique_students ?? 0),
              inProgressCount: Number(b.in_progress_count ?? 0),
              adminPreviewCount: Number(b.admin_preview_count ?? 0),
              lastSubmittedAt: b.last_submitted_at || null
            })),
            fromRpc: true,
            error: null
          };
        }
        if (error) {
          console.warn('[Supabase] get_admin_submission_stats rpc notice:', error.message);
        }
      } catch (e) {
        console.warn('[Supabase] get_admin_submission_stats exception:', e);
      }
    }

    // Fallback aggregation from Supabase exact head count + deduplicated (user_id, test_id) pairs
    let exactCompletedCount: number | null = null;
    let exactInProgressCount = 0;
    if (isSupabaseConfigured && supabase) {
      try {
        const res = await supabase
          .from('test_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .not('submitted_at', 'is', null);
        if (!res.error && typeof res.count === 'number') {
          exactCompletedCount = res.count;
        }
        const ipRes = await supabase
          .from('test_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'in_progress');
        if (!ipRes.error && typeof ipRes.count === 'number') {
          exactInProgressCount = ipRes.count;
        }
      } catch {}
    }

    const rows = Array.isArray(preloadedAttempts) ? preloadedAttempts : await this.getAllAttempts();
    const studentRows = rows.filter((a) => !a.isAdminAttempt && a.status !== 'in_progress' && a.submittedAt);
    const adminRows = rows.filter((a) => a.isAdminAttempt && a.status !== 'in_progress' && a.submittedAt);
    const byTestMap: Record<string, { breakdown: AdminTestSubmissionBreakdown; uniqueUsers: Set<string> }> = {};
    const allUniqueStudents = new Set<string>();
    const uniqueSubmissionPairs = new Set<string>();
    const mockUniquePairs = new Set<string>();
    const chapterUniquePairs = new Set<string>();

    studentRows.forEach((a) => {
      const canon = canonicalizeAttemptTest(a.testId, a.testCode || a.code, a.examType);
      const tType = a.testType || canon.testType;
      const uid = String(a.userId || a.user_id || a.studentEmail || a.id);
      if (uid) {
        allUniqueStudents.add(uid);
        const pairKey = `${uid}::${canon.testId}`;
        uniqueSubmissionPairs.add(pairKey);
        if (tType === 'chapter_exercise') {
          chapterUniquePairs.add(pairKey);
        } else {
          mockUniquePairs.add(pairKey);
        }
      }
      if (!byTestMap[canon.testId]) {
        byTestMap[canon.testId] = {
          breakdown: {
            testId: canon.testId,
            code: canon.code,
            testType: tType,
            completedCount: 0,
            uniqueStudents: 0,
            inProgressCount: 0,
            adminPreviewCount: 0,
            lastSubmittedAt: null
          },
          uniqueUsers: new Set<string>()
        };
      }
      const bucket = byTestMap[canon.testId];
      bucket.breakdown.completedCount += 1;
      if (uid) bucket.uniqueUsers.add(uid);
      if (a.submittedAt && (!bucket.breakdown.lastSubmittedAt || new Date(a.submittedAt) > new Date(bucket.breakdown.lastSubmittedAt))) {
        bucket.breakdown.lastSubmittedAt = a.submittedAt;
      }
    });

    const byTest = Object.values(byTestMap).map(({ breakdown, uniqueUsers }) => ({
      ...breakdown,
      uniqueStudents: uniqueUsers.size
    }));

    const completedTotal = exactCompletedCount !== null ? Math.max(0, exactCompletedCount - adminRows.length) : studentRows.length;
    const mockCompletedCount = studentRows.filter((r) => (r.testType || 'mock') === 'mock').length;
    const chapterCompletedCount = studentRows.filter((r) => r.testType === 'chapter_exercise').length;

    return {
      uniqueSubmissionsTotal: uniqueSubmissionPairs.size,
      uniqueStudentsTotal: allUniqueStudents.size,
      completedTotal,
      completedIncludingAdmin: exactCompletedCount !== null ? exactCompletedCount : (studentRows.length + adminRows.length),
      adminPreviewCount: adminRows.length,
      inProgressCount: exactInProgressCount,
      mockUniqueSubmissions: mockUniquePairs.size,
      chapterUniqueSubmissions: chapterUniquePairs.size,
      mockCompletedCount,
      chapterCompletedCount,
      byTest,
      fromRpc: false,
      error: this._lastAttemptsError?.message || null
    };
  },

  async getAllBookmarks(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookmarks').select('*');
        if (!error && data) return data;
      } catch (e) {}
    }
    const allLocal: any[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nelov_') && key.endsWith('_bookmarks')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) allLocal.push(...list);
          }
        }
      }
    } catch (e) {}
    return allLocal;
  },

  async getAllLectureProgress(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('lecture_progress').select('*');
        if (!error && data) return data;
      } catch (e) {}
    }
    const allLocal: any[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nelov_') && key.endsWith('_lecture_progress')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const obj = JSON.parse(raw);
            if (obj && typeof obj === 'object') {
              Object.values(obj).forEach((v) => allLocal.push(v));
            }
          }
        }
      }
    } catch (e) {}
    return allLocal;
  }
};
