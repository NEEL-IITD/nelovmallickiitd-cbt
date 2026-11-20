import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Rename the state declaration in NelovMallickApp
const oldState = `      const [activePhysicsChapterSlug, setActivePhysicsChapterSlug] = useState('c1');
      const [activeSubject, setActiveSubject] = useState('physics');
      const [activeSubjectChapterSlug, setActiveSubjectChapterSlug] = useState('c1');`;

const newState = `      const [activePhysicsChapterSlug, setActivePhysicsChapterSlug] = useState('c1');
      const [activeVaultSubject, setActiveVaultSubject] = useState('physics');
      const [activeVaultChapterSlug, setActiveVaultChapterSlug] = useState('c1');`;

if (html.includes(oldState.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldState.replace(/\n/g, '\r\n'), newState.replace(/\n/g, '\r\n'));
  console.log('✓ Renamed vault state (CRLF)');
} else if (html.includes(oldState)) {
  html = html.replace(oldState, newState);
  console.log('✓ Renamed vault state (LF)');
} else {
  // Regex match
  html = html.replace(
    /const \[activePhysicsChapterSlug, setActivePhysicsChapterSlug\] = useState\('c1'\);\s*const \[activeSubject, setActiveSubject\] = useState\('physics'\);\s*const \[activeSubjectChapterSlug, setActiveSubjectChapterSlug\] = useState\('c1'\);/,
    `const [activePhysicsChapterSlug, setActivePhysicsChapterSlug] = useState('c1');\r\n      const [activeVaultSubject, setActiveVaultSubject] = useState('physics');\r\n      const [activeVaultChapterSlug, setActiveVaultChapterSlug] = useState('c1');`
  );
  console.log('✓ Renamed vault state (Regex)');
}

// 2. In MainNavbar definition:
html = html.replace(
  /activeSubject = 'physics',/,
  "activeVaultSubject = 'physics',"
);
html = html.replace(
  /activeSubject === 'physics'/g,
  "activeVaultSubject === 'physics'"
);
html = html.replace(
  /activeSubject === 'chemistry'/g,
  "activeVaultSubject === 'chemistry'"
);
html = html.replace(
  /activeSubject === 'mathematics'/g,
  "activeVaultSubject === 'mathematics'"
);
console.log('✓ Updated MainNavbar definition & conditions to activeVaultSubject');

// 3. Remove unintended activeSubject={activeSubject} on other MainNavbar calls
html = html.replace(/\s+activeSubject=\{activeSubject\}/g, '');
console.log('✓ Cleaned up activeSubject={activeSubject} on MainNavbar calls');

// 4. Update hash routing in NelovMallickApp
html = html.replace(/setActiveSubject\('physics'\);/g, "setActiveVaultSubject('physics');");
html = html.replace(/setActiveSubjectChapterSlug\(rawSlug \|\| 'c1'\);/g, "setActiveVaultChapterSlug(rawSlug || 'c1');");

html = html.replace(/setActiveSubject\('chemistry'\);/g, "setActiveVaultSubject('chemistry');");
html = html.replace(/setActiveSubjectChapterSlug\(rawSlug \|\| 'ch-1'\);/g, "setActiveVaultChapterSlug(rawSlug || 'ch-1');");

html = html.replace(/setActiveSubject\('mathematics'\);/g, "setActiveVaultSubject('mathematics');");
html = html.replace(/setActiveSubjectChapterSlug\(rawSlug \|\| 'c01'\);/g, "setActiveVaultChapterSlug(rawSlug || 'c01');");

console.log('✓ Updated hash routes to setActiveVaultSubject');

// 5. Update view routing in NelovMallickApp
html = html.replace(
  /const currentSub = view === 'chemistry-resources' \? 'chemistry' : \(view === 'mathematics-resources' \? 'mathematics' : \(view === 'physics-resources' \? 'physics' : activeSubject\)\);/,
  "const currentSub = view === 'chemistry-resources' ? 'chemistry' : (view === 'mathematics-resources' ? 'mathematics' : (view === 'physics-resources' ? 'physics' : activeVaultSubject));"
);

html = html.replace(
  /setActiveSubject\(currentSub\);\s*setActiveSubjectChapterSlug\(slug\);/g,
  "setActiveVaultSubject(currentSub);\r\n                setActiveVaultChapterSlug(slug);"
);

html = html.replace(
  /subject=\{activeSubject\}\s*chapterSlug=\{activeSubjectChapterSlug \|\| activePhysicsChapterSlug\}/,
  "subject={activeVaultSubject}\r\n              chapterSlug={activeVaultChapterSlug || activePhysicsChapterSlug}"
);

// 6. Homepage showcase onOpenSubject
html = html.replace(
  /onOpenSubject=\{\(sub\) => \{\s*setActiveSubject\(sub\);/g,
  "onOpenSubject={(sub) => {\r\n                setActiveVaultSubject(sub);"
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Updated index.html successfully!');
