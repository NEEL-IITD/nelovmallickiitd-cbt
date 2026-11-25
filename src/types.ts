export type ExamType = 'jee' | 'neet' | 'JEE Mains' | 'JEE Advanced';

export type TargetExam = 'JEE 2027' | 'JEE Mains' | 'JEE Advanced' | 'Both';
export type UserRole = 'student' | 'admin';
export type AuthMethod = 'google' | 'gmail' | 'email' | 'phone' | 'email_with_phone';

export interface User {
  id: string;
  name: string;
  email?: string | null;
  contactNumber?: string | null;
  authMethod?: AuthMethod;
  targetExam: TargetExam;
  avatarUrl?: string | null;
  dailyQuestionGoal?: number;
  currentStreak?: number;
  needsEmailConfirmation?: boolean;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
  acceptedTermsAt?: string | null;
  acceptedTermsVersion?: string | null;
  parentalConsentConfirmed?: boolean;
}

export interface TestConfigItem {
  testId: string;
  examType: 'JEE Mains' | 'JEE Advanced';
  code: string;
  title: string;
  status: 'live' | 'coming_soon';
  isScheduledWindow?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  windowLabel?: string | null;
  lockLeaderboardUntilEnd?: boolean;
  allowPracticeAfterEnd?: boolean;
  updatedAt?: string;
  readyQuestionsCount?: number;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  percentile: number;
  accuracy: number;
  timeTakenSeconds: number;
  submittedAt: string;
  attemptedInLiveWindow?: boolean;
  isCurrentUser?: boolean;
}

export interface LeaderboardResult {
  locked: boolean;
  unlocksAt: string | null;
  totalParticipants: number;
  averageMarks: number;
  highestMarks: number;
  topper: LeaderboardEntry | null;
  top5?: LeaderboardEntry[];
  myStanding: LeaderboardEntry | null;
  entries: LeaderboardEntry[];
  myAttemptSubmitted?: boolean;
  error?: string | null;
}

export interface TopperSummaryItem {
  testId: string;
  code: string;
  title: string;
  examType: string;
  isScheduledWindow: boolean;
  startsAt: string | null;
  endsAt: string | null;
  windowLabel: string | null;
  isLocked: boolean;
  totalParticipants: number;
  topperName: string | null;
  topperMarks: number | null;
  maxMarks: number | null;
  topperPercentile: number | null;
}

export interface OverallLeaderboardEntry {
  rank: number;
  displayName: string;
  testsAttempted: number;
  avgPercentile: number;
  avgMarksPercent: number;
  totalMarksScored: number;
  totalMaxMarks: number;
  isCurrentUser: boolean;
}

export type MistakeTagType =
  | 'Calculation Error'
  | 'Conceptual Gap'
  | 'Misread Question'
  | 'Time Trap'
  | 'Need Revision';

export interface BookmarkItem {
  id: string;
  userId: string;
  testId: string;
  questionId: string;
  examType?: string;
  subject?: string;
  questionType?: string;
  mistakeTag?: MistakeTagType | string;
  personalNote?: string;
  createdAt?: string;
  questionData?: any;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  examType: string;
  code: string;
  candidateName?: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  estimatedRankLabel?: string;
  subjectBreakdown: Record<string, any>;
  responses: Record<string, any>;
  timePerQuestion?: Record<string, number>;
  mistakeTags?: Record<string, string>;
  submittedAt: string;
}

export type ErrorIssueType =
  | 'typo'
  | 'broken_equation'
  | 'wrong_answer_key'
  | 'missing_diagram'
  | 'other';

export type ErrorReportStatus = 'open' | 'in_review' | 'resolved' | 'dismissed';

export interface ErrorReportItem {
  id: string;
  userId?: string;
  reporterName: string;
  reporterEmail: string;
  reporterContactNumber?: string;
  testId: string;
  examType: string;
  testCode: string;
  questionId: string;
  questionNumber: number;
  issueType: ErrorIssueType;
  description: string;
  status: ErrorReportStatus;
  adminNote?: string;
  createdAt: string;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface ComparisonRow {
  feature: string;
  otherCreators: boolean;
  otherCoaching: boolean;
  ourPlatform: boolean;
  note?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  socials: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  featured?: boolean;
}

export interface FounderItem {
  name: string;
  college: string;
  role: string;
  avatar: string;
  bio: string;
  socials: {
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

export interface ResourceItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  actionText: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ==============================================================================
// Vault Exercises & Theory Notes Types (JEE CBT JSON Schema)
// ==============================================================================

export type VaultSubjectType = 'physics' | 'chemistry' | 'mathematics';
export type VaultQuestionType = 'single_correct' | 'multi_correct' | 'numerical';

export interface VaultQuestion {
  id: string;
  number: number;
  type: VaultQuestionType;
  question: string;
  image?: string | null;
  options?: string[];
  correctAnswer: number | number[];
  tolerance?: number;
  solution: string;
  solutionImage?: string | null;
  marking?: {
    correct: number;
    incorrect: number;
    unattempted: number;
  };
}

export interface VaultExercise {
  subject: VaultSubjectType;
  chapterId: string;
  chapterName?: string;
  exerciseId: string;
  title: string;
  durationMinutes: number;
  defaultMarking: {
    correct: number;
    incorrect: number;
    unattempted: number;
  };
  questions: VaultQuestion[];
  totalQuestions?: number;
  totalMarks?: number;
  updatedAt?: string;
}

export interface VaultTheoryNote {
  id: string;
  subject: VaultSubjectType;
  chapterId: string;
  chapterName?: string;
  title: string;
  pdfUrl: string;
  fileName: string;
  fileSizeBytes: number;
  updatedAt?: string;
}

export interface VaultValidationResult {
  isValid: boolean;
  errors: string[];
  summary: {
    totalQuestions: number;
    singleCorrectCount: number;
    multiCorrectCount: number;
    numericalCount: number;
    totalMarks: number;
    durationMinutes: number;
    subject: string;
    chapterId: string;
    exerciseId: string;
    title: string;
  } | null;
  data: VaultExercise | null;
}

