import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ptmMetadata = Array.from({ length: 20 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: `jee-mains-ptm-${num}`,
    examCategory: "jee-mains",
    examType: "JEE Mains",
    code: `PTM ${num}`,
    title: `JEE Mains 2027 Test Series — PTM ${num}`,
    subtitle: "Full Syllabus Comprehensive Mock Examination",
    status: "coming_soon",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 75,
    subjects: ["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"],
    description: "Standard NTA JEE Mains CBT pattern: 20 Single Correct MCQs (+4, -1) and 5 Numerical Value questions (+4, -1) per subject.",
    isLive: false,
    isFree: true
  };
});

// 1. Update public/data/testsIndex.js
const publicTestsIndexPath = path.join(rootDir, 'public', 'data', 'testsIndex.js');
let publicJs = fs.readFileSync(publicTestsIndexPath, 'utf8');

// Replace window.jeeMainsTests in public/data/testsIndex.js
const ptmJson = JSON.stringify(ptmMetadata, null, 2);
const mainsRegex = /window\.jeeMainsTests\s*=\s*\[[\s\S]*?\];/;
if (mainsRegex.test(publicJs)) {
  publicJs = publicJs.replace(mainsRegex, `window.jeeMainsTests = ${ptmJson};`);
  fs.writeFileSync(publicTestsIndexPath, publicJs, 'utf8');
  console.log('✅ Updated public/data/testsIndex.js with PTM 01-20');
} else {
  console.warn('⚠️ Could not match window.jeeMainsTests in public/data/testsIndex.js');
}

// 2. Update src/data/testsIndex.ts
const srcTestsIndexPath = path.join(rootDir, 'src', 'data', 'testsIndex.ts');
let srcTs = fs.readFileSync(srcTestsIndexPath, 'utf8');

// Replace export const jeeMainsTests: TestMetadata[] = [...] in src/data/testsIndex.ts
const srcMainsRegex = /export const jeeMainsTests:\s*TestMetadata\[\]\s*=\s*\[[\s\S]*?\];/;
if (srcMainsRegex.test(srcTs)) {
  srcTs = srcTs.replace(srcMainsRegex, `export const jeeMainsTests: TestMetadata[] = ${ptmJson};`);
  fs.writeFileSync(srcTestsIndexPath, srcTs, 'utf8');
  console.log('✅ Updated src/data/testsIndex.ts with PTM 01-20');
} else {
  console.warn('⚠️ Could not match export const jeeMainsTests in src/data/testsIndex.ts');
}
