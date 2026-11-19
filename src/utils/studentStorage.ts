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
}

export interface BookmarkedQuestion {
  id: number;
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
  mistakeTag?: 'Calculation Error' | 'Conceptual Gap' | 'Misread Question' | 'Time Trap' | 'Need Revision';
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
  /**
   * Save in-progress CBT exam session, scoped strictly to user ID
   */
  saveSession(userId: string, testId: string, sessionData: any): void {
    if (!userId || !testId) return;
    try {
      localStorage.setItem(`nelov_${userId}_session_${testId}`, JSON.stringify(sessionData));
    } catch (e) {}
  },

  /**
   * Retrieve in-progress CBT exam session, scoped strictly to user ID
   */
  getSession(userId: string, testId: string): any | null {
    if (!userId || !testId) return null;
    try {
      const raw = localStorage.getItem(`nelov_${userId}_session_${testId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Clear in-progress CBT exam session upon submission
   */
  clearSession(userId: string, testId: string): void {
    if (!userId || !testId) return;
    try {
      localStorage.removeItem(`nelov_${userId}_session_${testId}`);
    } catch (e) {}
  },

  /**
   * Record a completed PTA exam attempt
   */
  saveAttempt(userId: string, attemptRecord: TestAttemptRecord): void {
    if (!userId) return;
    try {
      const attempts = this.getAttempts(userId);
      attempts.unshift(attemptRecord);
      localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(attempts));
    } catch (e) {}
  },

  /**
   * Get all past exam attempts for the student
   */
  getAttempts(userId: string): TestAttemptRecord[] {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`nelov_${userId}_attempts`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Get all bookmarked questions for the student's Revision Notebook
   */
  getBookmarks(userId: string): BookmarkedQuestion[] {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`nelov_${userId}_bookmarks`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Toggle a question bookmark in the Revision Notebook
   */
  toggleBookmark(userId: string, item: Omit<BookmarkedQuestion, 'addedAt'>): boolean {
    if (!userId) return false;
    try {
      const bookmarks = this.getBookmarks(userId);
      const idx = bookmarks.findIndex((b) => b.uniqueKey === item.uniqueKey);
      if (idx !== -1) {
        bookmarks.splice(idx, 1);
        localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
        return false;
      } else {
        bookmarks.unshift({
          ...item,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
        return true;
      }
    } catch (e) {
      return false;
    }
  },

  /**
   * Check if a question is already bookmarked
   */
  isBookmarked(userId: string, uniqueKey: string): boolean {
    if (!userId) return false;
    const bookmarks = this.getBookmarks(userId);
    return bookmarks.some((b) => b.uniqueKey === uniqueKey);
  },

  /**
   * Update mistake tag on a bookmarked question
   */
  updateMistakeTag(userId: string, uniqueKey: string, tag: BookmarkedQuestion['mistakeTag']): void {
    if (!userId) return;
    try {
      const bookmarks = this.getBookmarks(userId);
      const target = bookmarks.find((b) => b.uniqueKey === uniqueKey);
      if (target) {
        target.mistakeTag = tag;
        localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
      }
    } catch (e) {}
  },

  /**
   * Aggregate student performance KPIs for My Progress dashboard
   */
  getUserStats(userId: string): UserStats {
    const attempts = this.getAttempts(userId);
    if (attempts.length === 0) {
      return {
        totalTests: 0,
        averageScorePct: 0,
        bestScorePct: 0,
        totalQuestionsAttempted: 0,
        overallAccuracy: 0,
        recentPredictedAir: 'Not Attempted Yet',
      };
    }

    const totalTests = attempts.length;
    const totalScorePct = attempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
    const averageScorePct = Math.round(totalScorePct / totalTests);
    const bestScorePct = Math.max(...attempts.map((a) => a.percentage || 0));
    const totalQuestionsAttempted = attempts.reduce((acc, a) => acc + (a.attemptedCount || 0), 0);
    const totalCorrect = attempts.reduce((acc, a) => acc + (a.correctCount || 0) + (a.partialCount || 0), 0);
    const overallAccuracy =
      totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;
    const recentPredictedAir = attempts[0].predictedAirDisplay || 'N/A';

    return {
      totalTests,
      averageScorePct,
      bestScorePct,
      totalQuestionsAttempted,
      overallAccuracy,
      recentPredictedAir,
    };
  },
};
