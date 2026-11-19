export type ExamType = 'jee' | 'neet' | 'JEE Mains' | 'JEE Advanced';

export type TargetExam = 'JEE Mains' | 'JEE Advanced' | 'Both';
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  targetExam: TargetExam;
  role: UserRole;
  createdAt: string;
}

export interface TestConfigItem {
  testId: string;
  examType: 'JEE Mains' | 'JEE Advanced';
  code: string;
  title: string;
  status: 'live' | 'coming_soon';
  updatedAt?: string;
  readyQuestionsCount?: number;
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
