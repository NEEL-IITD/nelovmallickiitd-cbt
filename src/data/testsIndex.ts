import { TestMetadata, TestPaper } from './testTypes';
import { pta04Data } from './jee-advanced/pta04';
import { pta05Data } from './jee-advanced/pta05';
import { pta06Data } from './jee-advanced/pta06';

export const jeeMainsTests: TestMetadata[] = [
  {
    id: "jee-mains-pta-01",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 01",
    title: "JEE Mains Test Series — PTA 01",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-02",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 02",
    title: "JEE Mains Test Series — PTA 02",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Full-length JEE Mains CBT simulation curated by Nelov Mallick (IIT Delhi) to master speed and high accuracy.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-03",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 03",
    title: "JEE Mains Test Series — PTA 03",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Full-length JEE Mains CBT mock test designed to eliminate silly mistakes in numerical questions.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-04",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 04",
    title: "JEE Mains Test Series — PTA 04",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "High-yield JEE Mains test paper emphasizing mechanics, electrodynamics, organic chemistry, and calculus.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-05",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 05",
    title: "JEE Mains Test Series — PTA 05",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Benchmark test covering high-weightage chapters with authentic NTA computer interface.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-06",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 06",
    title: "JEE Mains Test Series — PTA 06",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Speed & accuracy conditioning test for JEE Mains aspirants aiming for 99+ percentile.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-07",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 07",
    title: "JEE Mains Test Series — PTA 07",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Advanced-difficulty JEE Mains paper balancing tricky calculations and conceptual questions.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-08",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 08",
    title: "JEE Mains Test Series — PTA 08",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Comprehensive exam simulation focusing on physical chemistry, algebra, and modern physics.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-09",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 09",
    title: "JEE Mains Test Series — PTA 09",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Full-length mock exam designed for final rank revision and timing calibration.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-mains-pta-10",
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: "PTA 10",
    title: "JEE Mains Test Series — PTA 10",
    subtitle: "Final Full Syllabus Grand Mock",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Final grand mock paper simulating the exact exam-day pressure and syllabus distribution.",
    isLive: false,
    isFree: true
  }
];

export const jeeAdvancedTests: TestMetadata[] = [
  {
    id: "jee-advanced-pta-01",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 01",
    title: "JEE Advanced Test Series — PTA 01",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "Rigorous multi-concept problem sets covering multi-correct MCQs, integers, and matching lists.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-advanced-pta-02",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 02",
    title: "JEE Advanced Test Series — PTA 02",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "High-level mock test emphasizing calculus, electromagnetism, and organic synthesis pathways.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-advanced-pta-03",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 03",
    title: "JEE Advanced Test Series — PTA 03",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "Intense multi-section examination focusing on error diagnostics and partial marking tactics.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-advanced-pta-04",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 04",
    title: "JEE Advanced Test Series — PTA 04",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "live",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 57,
    subjects: ["Mathematics (19 Qs)", "Physics (19 Qs)", "Chemistry (19 Qs)"],
    description: "Full-length JEE Advanced CBT simulation with Single Correct (+3, -1), Comprehension Numerical (+2, 0), Multiple Correct (+4, -2 with partial marking), and Non-Negative Integer (+4, 0).",
    isLive: true,
    isFree: true
  },
  {
    id: "jee-advanced-pta-05",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 05",
    title: "JEE Advanced Test Series — PTA 05 (Model-A)",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "live",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics (18 Qs)", "Physics (18 Qs)", "Chemistry (18 Qs)"],
    description: "Authentic NTA/IIT CBT simulation featuring Numerical Value (+3, 0), Multiple Correct (+4, -2 with partial marking), and Matching List Type (+3, -1) across all three subjects.",
    isLive: true,
    isFree: true
  },
  {
    id: "jee-advanced-pta-06",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 06",
    title: "JEE Advanced Test Series — PTA 06 (Model-A)",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "live",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 51,
    subjects: ["Mathematics (17 Qs)", "Physics (17 Qs)", "Chemistry (17 Qs)"],
    description: "Authentic JEE Advanced CBT simulation featuring Multiple Correct Choice (+4, -2 with partial marking), Single Correct (+3, -1), Non-Negative Integer (+4, 0), and Matching List (+3, -1).",
    isLive: true,
    isFree: true
  },
  {
    id: "jee-advanced-pta-07",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 07",
    title: "JEE Advanced Test Series — PTA 07",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "Rigorous paper challenging spatial reasoning, coordinate geometry, and physical chemistry.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-advanced-pta-08",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 08",
    title: "JEE Advanced Test Series — PTA 08",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "High-yield full test designed to calibrate exam temperament under strict negative marking.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-advanced-pta-09",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 09",
    title: "JEE Advanced Test Series — PTA 09",
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "Rank-booster test paper with intricate multi-concept questions and rigorous derivations.",
    isLive: false,
    isFree: true
  },
  {
    id: "jee-advanced-pta-10",
    examCategory: "jee-advanced",
    examType: "JEE Advanced",
    code: "PTA 10",
    title: "JEE Advanced Test Series — PTA 10",
    subtitle: "Final Full Syllabus Grand Mock",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    description: "The ultimate JEE Advanced simulator paper matching the latest IIT question setting trends.",
    isLive: false,
    isFree: true
  }
];

export const allTests: TestMetadata[] = [...jeeMainsTests, ...jeeAdvancedTests];

export const liveTests: TestMetadata[] = allTests.filter(t => t.status === 'live');

export function getTestById(id: string): TestMetadata | undefined {
  return allTests.find(t => t.id === id || t.code.toLowerCase().replace(' ', '') === id.toLowerCase().replace(' ', ''));
}

export function getLiveTestPaper(id: string): TestPaper | undefined {
  if (id === 'jee-advanced-pta-04' || id === 'pta-04' || id === 'pta04') {
    return pta04Data;
  }
  if (id === 'jee-advanced-pta-05' || id === 'pta-05' || id === 'pta05') {
    return pta05Data;
  }
  if (id === 'jee-advanced-pta-06' || id === 'pta-06' || id === 'pta06') {
    return pta06Data;
  }
  return undefined;
}
