export type SubjectType = 'Physics' | 'Chemistry' | 'Mathematics';
export type ExamTargetType = 'JEE Mains' | 'JEE Advanced' | 'Both';
export type ResourceCategory = 'Formula Sheet' | 'Short Notes' | 'Reaction Mechanisms' | 'NCERT Trends' | 'High-Weightage Topics';

export interface StudyResource {
  id: string;
  title: string;
  subtitle: string;
  subject: SubjectType;
  examTarget: ExamTargetType;
  resourceType: ResourceCategory;
  readTime: string;
  badgeColor: string; // 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'indigo'
  topicsCovered: string[];
  content: string; // KaTeX & Markdown formatted
  isFree: true;
  downloadPdfUrl?: string;
  featured?: boolean;
}
