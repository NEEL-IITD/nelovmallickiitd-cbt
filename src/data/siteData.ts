export interface LiveTestInfo {
  id: string;
  code: string;
  title: string;
  tag: string;
  exam: string;
  date: string;
  durationMinutes: number;
  maxMarks: number;
  totalQuestions: number;
  subjects: string[];
  description: string;
  isLive: boolean;
  isFree: boolean;
}

export const liveTestsList: LiveTestInfo[] = [
  {
    id: "pta-04",
    code: "PTA 04",
    title: "JEE Advanced 2026 Test Series — PTA-04",
    tag: "LIVE NOW · 100% FREE",
    exam: "JEE Advanced",
    date: "23-08-2026",
    durationMinutes: 180,
    maxMarks: 180,
    totalQuestions: 57,
    subjects: ["Mathematics (19 Qs)", "Physics (19 Qs)", "Chemistry (19 Qs)"],
    description: "Full-length JEE Advanced CBT simulation with Single Correct (+3, -1), Comprehension Numerical (+2, 0), Multiple Correct (+4, -2 with partial marking), and Non-Negative Integer (+4, 0).",
    isLive: true,
    isFree: true
  },
  {
    id: "pta-05",
    code: "PTA 05",
    title: "JEE Advanced 2026 Test Series — PTA-05 (Model-A)",
    tag: "LIVE NOW · 100% FREE",
    exam: "JEE Advanced",
    date: "30-08-2026",
    durationMinutes: 180,
    maxMarks: 180,
    totalQuestions: 54,
    subjects: ["Mathematics (18 Qs)", "Physics (18 Qs)", "Chemistry (18 Qs)"],
    description: "Authentic NTA/IIT CBT simulation featuring Numerical Value (+3, 0), Multiple Correct (+4, -2 with partial marking), and Matching List Type (+3, -1) across all three subjects.",
    isLive: true,
    isFree: true
  }
];

export interface FounderProfile {
  name: string;
  college: string;
  role: string;
  avatar: string;
  bio: string;
  highlights: string[];
  socials: {
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

export const founderData: FounderProfile = {
  name: "Nelov Mallick",
  college: "IIT Delhi",
  role: "Founder & Academic Director · 8+ yrs Mentoring JEE Aspirants",
  avatar: "/images/nelov-mallick.png",
  bio: "IIT Delhi alumnus dedicated to democratizing top-tier competitive exam preparation. Has guided thousands of students to double-digit and triple-digit JEE Advanced ranks through scientific problem-solving frameworks, real exam simulators, and error diagnostic analytics.",
  highlights: [
    "Mentored 10,000+ JEE Aspirants",
    "Pioneered AI-Driven CBT Error Diagnosis",
    "100% Free Advanced Test Series Initiative"
  ],
  socials: {
    instagram: "850K+ Aspirants",
    youtube: "650K+ Subscribers",
    linkedin: "Nelov Mallick (IIT Delhi)"
  }
};

export const featuresData = [
  {
    id: 1,
    title: "Exact JEE Advanced CBT Interface",
    description: "Authentic exam-hall screen layout, real section switching, countdown timer, question status palette, and virtual numeric keypad.",
    icon: "Monitor",
    badge: "100% Authentic"
  },
  {
    id: 2,
    title: "Free Live Test Series (PTA 04 & PTA 05)",
    description: "Direct access to high-yield JEE Advanced papers without any payment, subscription, or paywall.",
    icon: "FileCheck",
    badge: "Free for All"
  },
  {
    id: 3,
    title: "Instant Scoring & Partial Marking",
    description: "Exact JEE Advanced marking scheme computation: single correct, multiple correct with partial marks (+1, +2, +3, -2), numerical, and matching lists.",
    icon: "Brain",
    badge: "Instant Evaluation"
  },
  {
    id: 4,
    title: "Detailed Question-by-Question Solutions",
    description: "Step-by-step mathematical derivations, chemical mechanisms, and physics free-body diagrams for every question.",
    icon: "BookOpen"
  },
  {
    id: 5,
    title: "Diagnostic Mistake Analyzer",
    description: "Analyze accuracy, time spent per question, unattempted questions, and negative marks to optimize exam temperament.",
    icon: "LineChart"
  },
  {
    id: 6,
    title: "KaTeX Mathematical Fidelity",
    description: "High-resolution LaTeX rendering of complex matrix equations, calculus integrals, and chemical structures.",
    icon: "Sparkles"
  }
];

export const studentResults = [
  {
    id: 1,
    rank: "AIR 48",
    exam: "JEE Advanced",
    quote: "Attempting the PTA papers in this authentic CBT interface helped me master time allocation across Physics, Chemistry, and Math. The partial marking simulation mirrors the actual exam day perfectly."
  },
  {
    id: 2,
    rank: "AIR 112",
    exam: "JEE Advanced",
    quote: "Nelov Mallick's question selections in PTA-04 and PTA-05 reflect the real toughness and tricky multi-correct patterns of JEE Advanced. The instant analysis after submission was invaluable."
  },
  {
    id: 3,
    rank: "AIR 234",
    exam: "JEE Advanced",
    quote: "Zero paywalls, zero distractions. Just genuine, high-standard mock tests with an exact NTA computer interface. A must-attempt platform for every serious IIT aspirant."
  }
];

export const faqsData = [
  {
    question: "Are PTA-04 and PTA-05 completely free to attempt?",
    answer: "Yes, 100% free. There are no fees, hidden charges, paywalls, or premium tiers. Anyone can open the test and attempt it right away."
  },
  {
    question: "Do I need to sign up or enter payment details to start?",
    answer: "No. You can start immediately as a guest aspirant without entering passwords, phone numbers, or credit card details. You can optionally enter your name for your personalized scorecard."
  },
  {
    question: "Does the test interface support partial marking for Multiple Correct questions?",
    answer: "Yes. Our evaluation engine strictly follows the official JEE Advanced partial marking rules: +4 if all correct options are selected, +3/+2/+1 for partially correct selections without any incorrect option, 0 if unattempted, and -2 if any incorrect option is selected."
  },
  {
    question: "What happens if I accidentally refresh my browser during the test?",
    answer: "Your test progress (timer, selected responses, question visit status, and review flags) is automatically backed up in real time in your local browser storage. Refreshing the page safely resumes your session without losing answers."
  },
  {
    question: "What question formats are covered in PTA-04 and PTA-05?",
    answer: "Both papers cover all modern JEE Advanced question formats: Single Correct MCQs, Multiple Correct Choice with partial marking, Paragraph/Comprehension Numerical Value, Non-Negative Integers with virtual numeric keypad, and Matching List Types."
  },
  {
    question: "Can I review solutions and my score report after submitting?",
    answer: "Yes. Immediately upon submitting, you receive a full diagnostic scorecard showing total marks, subject-wise scores, accuracy percentage, time spent, and a complete question-by-question review with correct answers and step-by-step explanations."
  }
];
