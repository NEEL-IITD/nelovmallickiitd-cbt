export type ExamCategory = 'jee-mains' | 'jee-advanced';
export type ExamType = 'JEE Mains' | 'JEE Advanced';
export type TestStatus = 'live' | 'coming_soon';
export type QuestionType = 'single_correct' | 'multiple_correct' | 'numerical' | 'integer' | 'matching_list' | 'comprehension';

export interface QuestionOption {
  id: string; // "A", "B", "C", "D"
  text: string;
  image?: string;
}

export interface MatchingListItem {
  label: string; // "P", "Q", "R", "S" or "1", "2", "3", "4"
  text: string;
  image?: string;
}

export interface MatchingList {
  listI: MatchingListItem[];
  listII: MatchingListItem[];
}

export interface QuestionMarking {
  positive: number;
  negative: number;
  partial?: boolean;
}

export interface Question {
  id: number;
  subject: 'Mathematics' | 'Physics' | 'Chemistry';
  section: string;
  sectionInstruction?: string;
  type: QuestionType;
  marking: QuestionMarking;
  question: string;
  images?: string[];
  options?: QuestionOption[];
  matchingList?: MatchingList;
  answer: string | number | string[];
  hasKey?: boolean;
  solution?: string;
  explanation?: string;
}

export interface SectionSummaryItem {
  name: string;
  questionCount: number;
  marking: string;
}

export interface SubjectSectionSummary {
  subject: 'Mathematics' | 'Physics' | 'Chemistry';
  sections: SectionSummaryItem[];
}

export interface TestPaper {
  id: string; // e.g. "jee-advanced-pta-04" or "pta-04"
  examCategory: ExamCategory;
  examType: ExamType;
  code: string; // "PTA 01" ... "PTA 10"
  title: string;
  subtitle: string;
  status: TestStatus;
  date?: string;
  durationMinutes: number;
  maxMarks: number;
  totalQuestions: number;
  sectionsSummary: SubjectSectionSummary[];
  questions: Question[];
}

export interface TestMetadata {
  id: string;
  examCategory: ExamCategory;
  examType: ExamType;
  code: string;
  title: string;
  subtitle: string;
  status: TestStatus;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  subjects: string[];
  description: string;
  isLive: boolean;
  isFree: boolean;
}
