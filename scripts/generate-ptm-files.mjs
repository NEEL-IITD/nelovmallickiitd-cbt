import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dir = path.join(rootDir, 'src', 'data', 'jee-mains');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (let i = 1; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const file = path.join(dir, `ptm${num}.ts`);
  const content = `import { TestPaper } from '../testTypes';

export const jeeMainsPtm${num}Data: TestPaper = {
  id: "jee-mains-ptm-${num}",
  aliasId: "ptm-${num}",
  examCategory: "jee-mains",
  examType: "JEE Mains",
  code: "PTM ${num}",
  title: "JEE Mains 2027 Test Series — PTM ${num}",
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
`;
  fs.writeFileSync(file, content, 'utf8');
}

console.log('✅ Generated ptm01.ts to ptm20.ts in src/data/jee-mains/');
