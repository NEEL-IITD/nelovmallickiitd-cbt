import { TestPaper } from '../testTypes';

export const jeeMainsPtm09Data: TestPaper = {
  id: "jee-mains-ptm-09",
  aliasId: "ptm-09",
  examCategory: "jee-mains",
  examType: "JEE Mains",
  code: "PTM 09",
  title: "JEE Mains 2027 Test Series — PTM 09",
  subtitle: "Full Syllabus Standard NTA Pattern CBT Mock Examination",
  status: "coming_soon",
  durationMinutes: 180,
  maxMarks: 300,
  totalQuestions: 75,
  sectionsSummary: [
    {
      subject: "Physics",
      sections: [
        { name: "Section A: Single Correct (20 Qs)", questionCount: 20, marking: "+4, -1" },
        { name: "Section B: Numerical Value (5 Qs)", questionCount: 5, marking: "+4, -1" }
      ]
    },
    {
      subject: "Chemistry",
      sections: [
        { name: "Section A: Single Correct (20 Qs)", questionCount: 20, marking: "+4, -1" },
        { name: "Section B: Numerical Value (5 Qs)", questionCount: 5, marking: "+4, -1" }
      ]
    },
    {
      subject: "Mathematics",
      sections: [
        { name: "Section A: Single Correct (20 Qs)", questionCount: 20, marking: "+4, -1" },
        { name: "Section B: Numerical Value (5 Qs)", questionCount: 5, marking: "+4, -1" }
      ]
    }
  ],
  questions: []
};
