import { TestMetadata, TestPaper } from './testTypes';
import { pta04Data } from './jee-advanced/pta04';
import { pta05Data } from './jee-advanced/pta05';
import { pta06Data } from './jee-advanced/pta06';
import { jeeMainsPtm01Data } from './jee-mains/ptm01';
import { jeeMainsPtm02Data } from './jee-mains/ptm02';
import { jeeMainsPtm03Data } from './jee-mains/ptm03';
import { jeeMainsPtm04Data } from './jee-mains/ptm04';
import { jeeMainsPtm05Data } from './jee-mains/ptm05';

export const jeeMainsTests: TestMetadata[] = [
  {
    "id": "jee-mains-ptm-01",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 01",
    "title": "JEE Mains 2027 Test Series — PTM 01",
    "subtitle": "Part Test 03 Syllabus (KTG, Thermodynamics, Hydrocarbons, GOC, Trigonometry)",
    "status": "live",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject. KTG, Thermodynamics, Hydrocarbons, GOC, Trigonometric Functions & Equations.",
    "isLive": true,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-02",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 02",
    "title": "JEE Mains 2027 Test Series — PTM 02",
    "subtitle": "Thermal Physics & Heat Transfer, GOC & Isomerism, Quadratic Equations & Sequences",
    "status": "live",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject. Thermal Properties & Conduction, GOC & Isomerism, Quadratic Equations & Progressions.",
    "isLive": true,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-03",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 03",
    "title": "JEE Mains 2027 Test Series — PTM 03",
    "subtitle": "Thermal Properties of Matter, Heat Transfer, IUPAC, GOC & Isomerism",
    "status": "live",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject. Thermal Properties of Matter, Heat Conduction, GOC, Isomerism, Matrices & Determinants.",
    "isLive": true,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-04",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 04",
    "title": "JEE Mains 2027 Test Series — PTM 04",
    "subtitle": "Electrostatics, Capacitors & Current Electricity, Alcohols, Phenols, Ethers & Stereochemistry, Permutations, Combinations & Counting",
    "status": "live",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject. Current Electricity, Capacitors & RC Networks, Alcohols/Phenols/Ethers & Stereochemistry, Permutations, Combinations & Matrix Counting.",
    "isLive": true,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-05",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 05",
    "title": "JEE Mains 2027 Test Series — PTM 05",
    "subtitle": "Moving Charges & Magnetism, Magnetism & Matter, Aldehydes, Ketones & Carboxylic Acids, Probability & Bayes' Theorem",
    "status": "live",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject. Moving Charges & Magnetism, Magnetism & Matter, Aldehydes/Ketones/Carboxylic Acids, Probability & Bayes' Theorem.",
    "isLive": true,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-06",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 06",
    "title": "JEE Mains 2027 Test Series — PTM 06",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-07",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 07",
    "title": "JEE Mains 2027 Test Series — PTM 07",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-08",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 08",
    "title": "JEE Mains 2027 Test Series — PTM 08",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-09",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 09",
    "title": "JEE Mains 2027 Test Series — PTM 09",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-10",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 10",
    "title": "JEE Mains 2027 Test Series — PTM 10",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-11",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 11",
    "title": "JEE Mains 2027 Test Series — PTM 11",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-12",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 12",
    "title": "JEE Mains 2027 Test Series — PTM 12",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-13",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 13",
    "title": "JEE Mains 2027 Test Series — PTM 13",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-14",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 14",
    "title": "JEE Mains 2027 Test Series — PTM 14",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-15",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 15",
    "title": "JEE Mains 2027 Test Series — PTM 15",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-16",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 16",
    "title": "JEE Mains 2027 Test Series — PTM 16",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-17",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 17",
    "title": "JEE Mains 2027 Test Series — PTM 17",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-18",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 18",
    "title": "JEE Mains 2027 Test Series — PTM 18",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-19",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 19",
    "title": "JEE Mains 2027 Test Series — PTM 19",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
  },
  {
    "id": "jee-mains-ptm-20",
    "examCategory": "jee-mains",
    "examType": "JEE Mains",
    "code": "PTM 20",
    "title": "JEE Mains 2027 Test Series — PTM 20",
    "subtitle": "Full Syllabus Comprehensive Mock Examination",
    "status": "coming_soon",
    "durationMinutes": 180,
    "totalMarks": 300,
    "totalQuestions": 75,
    "subjects": [
      "Physics (25 Qs)",
      "Chemistry (25 Qs)",
      "Mathematics (25 Qs)"
    ],
    "description": "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    "isLive": false,
    "isFree": true
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
  if (id === 'jee-mains-ptm-01' || id === 'ptm-01' || id === 'ptm01') {
    return jeeMainsPtm01Data;
  }
  if (id === 'jee-mains-ptm-02' || id === 'ptm-02' || id === 'ptm02') {
    return jeeMainsPtm02Data;
  }
  if (id === 'jee-mains-ptm-03' || id === 'ptm-03' || id === 'ptm03') {
    return jeeMainsPtm03Data;
  }
  if (id === 'jee-mains-ptm-04' || id === 'ptm-04' || id === 'ptm04') {
    return jeeMainsPtm04Data;
  }
  if (id === 'jee-mains-ptm-05' || id === 'ptm-05' || id === 'ptm05') {
    return jeeMainsPtm05Data;
  }
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
