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

export interface TestAttemptRecord {
  id: string;
  testId: string;
  testCode: string;
  testTitle: string;
  examType: 'JEE Mains' | 'JEE Advanced';
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
  mistakeTags?: Record<string, string>;
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
      localStorage.setItem(`nelov_${userId}_session_${testId}`, JSON.stringify(sessionData));
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

  clearSession(userId: string, testId: string): void {
    if (!userId || !testId) return;
    try {
      localStorage.removeItem(`nelov_${userId}_session_${testId}`);
    } catch (e) {}
  },

  // ----------------------------------------------------------------------------
  // COMPLETED TEST ATTEMPTS (Cloud + Local Cache)
  // ----------------------------------------------------------------------------
  async saveAttempt(userId: string, attemptRecord: TestAttemptRecord): Promise<void> {
    if (!userId) return;

    // 1. Generate / Validate UUID for attemptRecord.id (Postgres public.test_attempts.id is type UUID)
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

    // Canonical test ID normalization (e.g. ptm-01 -> jee-mains-ptm-01, pta-04 -> jee-advanced-pta-04)
    const rawTestKey = String(attemptRecord.testId || attemptRecord.testCode || '').toLowerCase().trim();
    let canonicalTestId = attemptRecord.testId || '';
    const mPtm = rawTestKey.match(/ptm[-\s_]?0?(\d+)/);
    if (mPtm) {
      const num = String(parseInt(mPtm[1], 10)).padStart(2, '0');
      canonicalTestId = `jee-mains-ptm-${num}`;
    } else {
      const mPta = rawTestKey.match(/pta[-\s_]?0?(\d+)/);
      if (mPta) {
        const num = String(parseInt(mPta[1], 10)).padStart(2, '0');
        canonicalTestId = `jee-advanced-pta-${num}`;
      }
    }
    if (!canonicalTestId) canonicalTestId = attemptRecord.testId || 'jee-mains-ptm-01';

    // 1. Always update local storage cache immediately for zero latency
    try {
      const attempts = this.getAttempts(userId);
      // Avoid duplicate insert if id matches
      const existingIdx = attempts.findIndex((a) => a.id === attemptRecord.id);
      if (existingIdx !== -1) {
        attempts[existingIdx] = attemptRecord;
      } else {
        attempts.unshift(attemptRecord);
      }
      localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(attempts));
    } catch (e) {}

    // 2. Cloud sync to Supabase `test_attempts`
    if (isSupabaseConfigured && supabase) {
      try {
        const timeSec = attemptRecord.timeTakenSeconds || (attemptRecord.timeSpentTotal ? Math.round(attemptRecord.timeSpentTotal) : 0);
        const { error } = await supabase.from('test_attempts').insert({
          id: attemptUuid,
          user_id: userId,
          test_id: canonicalTestId,
          exam_type: attemptRecord.examType || (canonicalTestId.includes('mains') ? 'JEE Mains' : 'JEE Advanced'),
          code: attemptRecord.testCode || (canonicalTestId.includes('ptm') ? canonicalTestId.replace('jee-mains-', '').toUpperCase() : canonicalTestId.replace('jee-advanced-', '').toUpperCase()),
          obtained_marks: Number(attemptRecord.totalMarksScored ?? attemptRecord.obtainedMarks ?? 0),
          total_marks: Number(attemptRecord.totalMaxMarks ?? attemptRecord.totalMarks ?? 300),
          percentage: Number(attemptRecord.percentage ?? 0),
          accuracy: Number(attemptRecord.accuracy ?? 0),
          time_taken_seconds: timeSec,
          estimated_rank_label: attemptRecord.predictedAirDisplay || 'AIR Qualified',
          subject_breakdown: attemptRecord.subjectStats || {},
          responses: attemptRecord.responses || {},
          time_per_question: attemptRecord.timePerQuestion || {},
          mistake_tags: attemptRecord.mistakeTags || {},
          submitted_at: attemptRecord.completedAt || new Date().toISOString()
        });

        if (error) {
          console.error('[Supabase] Failed to sync test attempt to cloud:', error.message);
        } else {
          console.log('[Supabase] Successfully saved test attempt to cloud:', attemptUuid);
        }
      } catch (err) {
        console.warn('[Supabase] Cloud sync error for attempt:', err);
      }
    }
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

      const records: TestAttemptRecord[] = data.map((d: any) => ({
        id: d.id,
        testId: d.test_id,
        testCode: d.code,
        testTitle: `${d.exam_type} – ${d.code} Mock Test`,
        examType: d.exam_type,
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
    const reportItem: ErrorReportItem = {
      id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...report,
      issueType: report.issueType as ErrorIssueType,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    // 1. Cloud insert into Supabase `error_reports`
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('error_reports').insert({
          id: reportItem.id.startsWith('rep_') ? undefined : reportItem.id,
          user_id: report.userId || null,
          reporter_name: report.reporterName,
          reporter_email: report.reporterEmail,
          reporter_contact_number: report.reporterContactNumber || null,
          test_id: report.testId,
          exam_type: report.examType,
          test_code: report.testCode,
          question_id: report.questionId,
          question_number: report.questionNumber,
          issue_type: report.issueType,
          description: report.description,
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
            lockLeaderboardUntilEnd: d.lock_leaderboard_until_end ?? true,
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
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_test_leaderboard', { p_test_id: testId });
        if (!error && data) {
          const mapEntry = (e: any): LeaderboardEntry => ({
            rank: e.rank,
            displayName: e.display_name || 'JEE Aspirant',
            marks: Number(e.marks ?? 0),
            maxMarks: Number(e.max_marks ?? 300),
            percentage: Number(e.percentage ?? 0),
            percentile: Number(e.percentile ?? 0),
            accuracy: Number(e.accuracy ?? 0),
            timeTakenSeconds: Number(e.time_taken_seconds ?? 0),
            submittedAt: e.submitted_at,
            attemptedInLiveWindow: e.attempted_in_live_window,
            isCurrentUser: e.is_current_user
          });

          const top5 = Array.isArray(data.top_5) && data.top_5.length > 0
            ? data.top_5.map(mapEntry)
            : (data.entries || []).slice(0, 5).map(mapEntry);

          return {
            locked: data.locked || false,
            unlocksAt: data.unlocks_at || null,
            totalParticipants: data.total_participants || 0,
            averageMarks: data.average_marks || 0,
            highestMarks: data.highest_marks || 0,
            topper: data.topper ? mapEntry(data.topper) : (top5[0] || null),
            top5: top5,
            myStanding: data.my_standing ? mapEntry(data.my_standing) : null,
            entries: (data.entries || []).map(mapEntry),
            myAttemptSubmitted: data.my_attempt_submitted
          };
        } else if (error) {
          console.error('[Supabase] get_test_leaderboard rpc error:', error);
        }
      } catch (e) {
        console.warn('[Supabase] get_test_leaderboard rpc fallback:', e);
      }
    }

    return await this.calculateLocalTestLeaderboard(testId);
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

    // Filter by testId and pick 1st attempt per user strictly
    const userAttemptsMap: Record<string, any> = {};
    (all || [])
      .filter((a: any) => {
        const tNorm = norm(a.testId);
        const cNorm = norm(a.testCode || a.code);
        return tNorm === targetNorm || cNorm === targetNorm || targetNorm.endsWith(cNorm) || (cNorm && targetNorm.includes(cNorm));
      })
      .sort((a: any, b: any) => new Date(a.completedAt || a.submitted_at || a.submittedAt).getTime() - new Date(b.completedAt || b.submitted_at || b.submittedAt).getTime())
      .forEach((a: any) => {
        const uId = a.userId || a.user_id;
        if (uId && !userAttemptsMap[uId]) {
          userAttemptsMap[uId] = a;
        }
      });

    const firstAttempts = Object.values(userAttemptsMap);
    const totalParticipants = firstAttempts.length;

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
    firstAttempts.sort((a, b) => {
      const scoreA = Number(a.totalMarksScored ?? a.obtainedMarks ?? 0);
      const scoreB = Number(b.totalMarksScored ?? b.obtainedMarks ?? 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      const accA = Number(a.accuracy ?? 0);
      const accB = Number(b.accuracy ?? 0);
      if (accB !== accA) return accB - accA;
      return (a.timeTakenSeconds || a.time_taken_seconds || 0) - (b.timeTakenSeconds || b.time_taken_seconds || 0);
    });

    const highestMarks = Number(firstAttempts[0]?.totalMarksScored ?? firstAttempts[0]?.obtainedMarks ?? 0);
    const avgMarks = Math.round((firstAttempts.reduce((sum, a) => sum + Number(a.totalMarksScored ?? a.obtainedMarks ?? 0), 0) / totalParticipants) * 10) / 10;

    const entries: LeaderboardEntry[] = firstAttempts.map((a, index) => {
      const rank = index + 1;
      const myScore = Number(a.totalMarksScored ?? a.obtainedMarks ?? 0);
      const countBelowOrEqual = firstAttempts.filter((other) => Number(other.totalMarksScored ?? other.obtainedMarks ?? 0) <= myScore).length;
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
        isCurrentUser: currentUid === uId
      };
    });

    const topper = entries[0] || null;
    const myStanding = entries.find((e) => e.isCurrentUser) || null;
    const myAttemptSubmitted = !!firstAttempts.find((a) => (a.userId || a.user_id) === currentUid);

    return {
      locked: false,
      unlocksAt: null,
      totalParticipants,
      averageMarks: avgMarks,
      highestMarks,
      topper,
      top5: entries.slice(0, 5),
      myStanding,
      entries: entries.slice(0, 100),
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
        const { data, error } = await supabase
          .from('test_attempts')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              contact_number,
              auth_method
            )
          `)
          .order('submitted_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          data.forEach((d: any) => {
            seenIds.add(d.id);
            const rawEmail = d.profiles?.email || '';
            const isSynthetic = rawEmail.endsWith('@phone.nelovportal.local');
            const studentName = d.profiles?.full_name || 'Student Aspirant';
            const code = d.code || (d.test_id ? d.test_id.replace('jee-mains-', '').replace('jee-advanced-', '').toUpperCase() : 'PTM 01');

            allAttempts.push({
              id: d.id,
              userId: d.user_id,
              user_id: d.user_id,
              studentName: studentName,
              candidateName: studentName,
              userName: studentName,
              studentEmail: isSynthetic ? '' : rawEmail,
              email: isSynthetic ? '' : rawEmail,
              studentContact: d.profiles?.contact_number || '',
              contactNumber: d.profiles?.contact_number || '',
              authMethod: d.profiles?.auth_method || (d.profiles?.contact_number ? 'phone' : 'gmail'),
              testId: d.test_id,
              examType: d.exam_type,
              testCode: code,
              code: code,
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
        } else if (error) {
          console.warn('Error fetching all test attempts from Supabase:', error.message);
        }
      } catch (e) {
        console.warn('Exception fetching all test attempts from Supabase:', e);
      }
    }

    // Local fallback: scan localStorage keys for all user attempts not already in Supabase
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nelov_') && key.endsWith('_attempts')) {
          const uId = key.replace('nelov_', '').replace('_attempts', '');
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              list.forEach((item: any) => {
                if (!item.id || !seenIds.has(item.id)) {
                  if (item.id) seenIds.add(item.id);
                  allAttempts.push({
                    ...item,
                    userId: item.userId || uId,
                    user_id: item.userId || uId,
                    obtainedMarks: Number(item.totalMarksScored ?? item.obtainedMarks ?? 0),
                    totalMarksScored: Number(item.totalMarksScored ?? item.obtainedMarks ?? 0),
                    totalMarks: Number(item.totalMaxMarks ?? item.totalMarks ?? 300),
                    totalMaxMarks: Number(item.totalMaxMarks ?? item.totalMarks ?? 300),
                    submittedAt: item.completedAt || item.submittedAt || new Date().toISOString(),
                    completedAt: item.completedAt || item.submittedAt || new Date().toISOString()
                  });
                }
              });
            }
          }
        }
      }
    } catch (e) {}

    if (allAttempts.length === 0) {
      // Resilient fallback attempts for offline / pre-migration demo
      const demoAttempts = [
        {
          id: '00000000-0000-4000-a000-000000000001',
          userId: '1b60422e-834f-4e1d-aefd-52febe7b633d',
          user_id: '1b60422e-834f-4e1d-aefd-52febe7b633d',
          studentName: 'Harshada Karche',
          candidateName: 'Harshada Karche',
          userName: 'Harshada Karche',
          studentEmail: 'karcheharshada565@gmail.com',
          email: 'karcheharshada565@gmail.com',
          studentContact: '+91 98765 43210',
          contactNumber: '+91 98765 43210',
          testId: 'jee-mains-ptm-01',
          testCode: 'PTM 01',
          code: 'PTM 01',
          examType: 'JEE Mains',
          obtainedMarks: 268,
          totalMarksScored: 268,
          totalMarks: 300,
          totalMaxMarks: 300,
          percentage: 89.33,
          accuracy: 94.2,
          timeTakenSeconds: 9720,
          time_taken_seconds: 9720,
          estimatedRankLabel: 'AIR 140 - 280',
          predictedAirDisplay: 'AIR 140 - 280',
          attemptNumber: 1,
          attemptCount: 1,
          submittedAt: '2026-11-22T10:30:00.000Z',
          completedAt: '2026-11-22T10:30:00.000Z'
        },
        {
          id: '00000000-0000-4000-a000-000000000002',
          userId: '784d81d8-f381-44a4-8b78-32ae2c6eb9ba',
          user_id: '784d81d8-f381-44a4-8b78-32ae2c6eb9ba',
          studentName: 'Santoshi Janjire',
          candidateName: 'Santoshi Janjire',
          userName: 'Santoshi Janjire',
          studentEmail: 'santoshijanjire16@gmail.com',
          email: 'santoshijanjire16@gmail.com',
          studentContact: '+91 98123 45678',
          contactNumber: '+91 98123 45678',
          testId: 'jee-mains-ptm-01',
          testCode: 'PTM 01',
          code: 'PTM 01',
          examType: 'JEE Mains',
          obtainedMarks: 254,
          totalMarksScored: 254,
          totalMarks: 300,
          totalMaxMarks: 300,
          percentage: 84.67,
          accuracy: 91.5,
          timeTakenSeconds: 10100,
          time_taken_seconds: 10100,
          estimatedRankLabel: 'AIR 320 - 550',
          predictedAirDisplay: 'AIR 320 - 550',
          attemptNumber: 1,
          attemptCount: 1,
          submittedAt: '2026-11-22T11:15:00.000Z',
          completedAt: '2026-11-22T11:15:00.000Z'
        },
        {
          id: '00000000-0000-4000-a000-000000000003',
          userId: 'b33a3cd1-f022-45b8-981b-186df5946825',
          user_id: 'b33a3cd1-f022-45b8-981b-186df5946825',
          studentName: 'Kartiki Apparao Mali',
          candidateName: 'Kartiki Apparao Mali',
          userName: 'Kartiki Apparao Mali',
          studentEmail: 'kartikimali00@gmail.com',
          email: 'kartikimali00@gmail.com',
          studentContact: '+91 97654 32109',
          contactNumber: '+91 97654 32109',
          testId: 'jee-mains-ptm-01',
          testCode: 'PTM 01',
          code: 'PTM 01',
          examType: 'JEE Mains',
          obtainedMarks: 242,
          totalMarksScored: 242,
          totalMarks: 300,
          totalMaxMarks: 300,
          percentage: 80.67,
          accuracy: 88.0,
          timeTakenSeconds: 10450,
          time_taken_seconds: 10450,
          estimatedRankLabel: 'AIR 650 - 980',
          predictedAirDisplay: 'AIR 650 - 980',
          attemptNumber: 1,
          attemptCount: 1,
          submittedAt: '2026-11-22T12:00:00.000Z',
          completedAt: '2026-11-22T12:00:00.000Z'
        },
        {
          id: '00000000-0000-4000-a000-000000000004',
          userId: 'usr_demo_04',
          user_id: 'usr_demo_04',
          studentName: 'Aarav Patel',
          candidateName: 'Aarav Patel',
          userName: 'Aarav Patel',
          studentEmail: 'aarav.patel@gmail.com',
          email: 'aarav.patel@gmail.com',
          studentContact: '+91 99887 76655',
          contactNumber: '+91 99887 76655',
          testId: 'jee-mains-ptm-01',
          testCode: 'PTM 01',
          code: 'PTM 01',
          examType: 'JEE Mains',
          obtainedMarks: 230,
          totalMarksScored: 230,
          totalMarks: 300,
          totalMaxMarks: 300,
          percentage: 76.67,
          accuracy: 85.2,
          timeTakenSeconds: 10600,
          time_taken_seconds: 10600,
          estimatedRankLabel: 'AIR 1100 - 1600',
          predictedAirDisplay: 'AIR 1100 - 1600',
          attemptNumber: 1,
          attemptCount: 1,
          submittedAt: '2026-11-22T12:45:00.000Z',
          completedAt: '2026-11-22T12:45:00.000Z'
        },
        {
          id: '00000000-0000-4000-a000-000000000005',
          userId: 'usr_demo_05',
          user_id: 'usr_demo_05',
          studentName: 'Priya Verma',
          candidateName: 'Priya Verma',
          userName: 'Priya Verma',
          studentEmail: 'priya.verma@gmail.com',
          email: 'priya.verma@gmail.com',
          studentContact: '+91 98712 34567',
          contactNumber: '+91 98712 34567',
          testId: 'jee-mains-ptm-01',
          testCode: 'PTM 01',
          code: 'PTM 01',
          examType: 'JEE Mains',
          obtainedMarks: 218,
          totalMarksScored: 218,
          totalMarks: 300,
          totalMaxMarks: 300,
          percentage: 72.67,
          accuracy: 82.5,
          timeTakenSeconds: 10750,
          time_taken_seconds: 10750,
          estimatedRankLabel: 'AIR 1800 - 2400',
          predictedAirDisplay: 'AIR 1800 - 2400',
          attemptNumber: 1,
          attemptCount: 1,
          submittedAt: '2026-11-22T13:20:00.000Z',
          completedAt: '2026-11-22T13:20:00.000Z'
        }
      ];
      allAttempts.push(...demoAttempts);
    }

    return allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
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
