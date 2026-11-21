// ==============================================================================
// NelovMallickIITD CBT Platform - Student Storage & Cloud Sync Engine
// Supabase Cloud Sync with instant Local Storage Fallback & Crash Protection
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ErrorReportItem, ErrorReportStatus, ErrorIssueType, MistakeTagType } from '../types';
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
        const { error } = await supabase.from('test_attempts').insert({
          id: attemptRecord.id,
          user_id: userId,
          test_id: attemptRecord.testId,
          exam_type: attemptRecord.examType,
          code: attemptRecord.testCode,
          obtained_marks: attemptRecord.totalMarksScored,
          total_marks: attemptRecord.totalMaxMarks,
          percentage: attemptRecord.percentage,
          accuracy: attemptRecord.accuracy,
          estimated_rank_label: attemptRecord.predictedAirDisplay || 'AIR Qualified',
          subject_breakdown: attemptRecord.subjectStats || {},
          responses: attemptRecord.responses || {},
          time_per_question: attemptRecord.timePerQuestion || {},
          mistake_tags: attemptRecord.mistakeTags || {},
          submitted_at: attemptRecord.completedAt || new Date().toISOString()
        });

        if (error) {
          console.warn('[Supabase] Failed to sync test attempt to cloud:', error.message);
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
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            studentName: d.profiles?.full_name || 'Student Aspirant',
            studentEmail: d.profiles?.email || null,
            studentContact: d.profiles?.contact_number || null,
            authMethod: d.profiles?.auth_method || 'gmail',
            testId: d.test_id,
            examType: d.exam_type,
            testCode: d.code,
            obtainedMarks: Number(d.obtained_marks),
            totalMarks: Number(d.total_marks),
            percentage: Number(d.percentage),
            accuracy: Number(d.accuracy),
            estimatedRankLabel: d.estimated_rank_label,
            subjectBreakdown: d.subject_breakdown,
            responses: d.responses,
            mistakeTags: d.mistake_tags,
            submittedAt: d.submitted_at
          }));
        }
      } catch (e) {
        console.warn('Error fetching all test attempts from Supabase:', e);
      }
    }

    // Local fallback: scan localStorage keys for all user attempts
    const allLocal: any[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nelov_') && key.endsWith('_attempts')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              allLocal.push(...list);
            }
          }
        }
      }
    } catch (e) {}
    return allLocal;
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
