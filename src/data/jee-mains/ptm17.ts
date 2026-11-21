import { TestPaper } from '../testTypes';

export const jeeMainsPtm17Data: TestPaper = {
  id: "jee-mains-ptm-17",
  aliasId: "ptm-17",
  examCategory: "jee-mains",
  examType: "JEE Mains",
  code: "PTM 17",
  title: "JEE Mains 2027 Test Series — PTM 17",
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
