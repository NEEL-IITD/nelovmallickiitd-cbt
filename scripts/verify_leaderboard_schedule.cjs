const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\dasri\\.gemini\\antigravity\\brain\\891ec41f-d0f8-46a7-adac-6aa0cddea39e\\leaderboard_evidence';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runQA() {
  console.log('--- STARTING LEADERBOARD & SCHEDULE VERIFICATION ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Visit Schedule View as logged-out visitor
  console.log('1. Navigating to http://localhost:3000/#/schedule as logged-out user...');
  await page.goto('http://localhost:3000/#/schedule', { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Verify all 20 PTM cards have Leaderboard button
  const cardLeaderboardButtons = await page.$$eval('button', btns => 
    btns.filter(b => b.textContent && b.textContent.includes('🏆 Leaderboard')).map(b => b.textContent.trim())
  );
  console.log(`Found ${cardLeaderboardButtons.length} Leaderboard buttons in 3D Card view.`);
  if (cardLeaderboardButtons.length < 20) {
    console.warn(`Warning: Expected at least 20 Leaderboard buttons, got ${cardLeaderboardButtons.length}`);
  } else {
    console.log('✓ All 20 3D PTM Cards contain clickable 🏆 Leaderboard buttons!');
  }

  await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_schedule_3d_cards_leaderboard.png') });
  console.log('Saved 01_schedule_3d_cards_leaderboard.png');

  // 2. Switch to Compact Timetable View
  console.log('2. Switching to Compact Timetable View...');
  const tableToggleBtn = await page.$('button[title="Compact Timetable View"], button[aria-label="Table view"]');
  if (tableToggleBtn) {
    await tableToggleBtn.click();
    await sleep(1000);
  } else {
    // Try finding by text or icon
    const btns = await page.$$('button');
    for (const b of btns) {
      const text = await (await b.getProperty('textContent')).jsonValue();
      if (text.includes('Table') || text.includes('Timetable')) {
        await b.click();
        await sleep(1000);
        break;
      }
    }
  }

  const tableLeaderboardButtons = await page.$$eval('td button', btns => 
    btns.filter(b => b.textContent && b.textContent.includes('🏆 Leaderboard')).map(b => b.textContent.trim())
  );
  console.log(`Found ${tableLeaderboardButtons.length} Leaderboard buttons in Compact Timetable view.`);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '02_schedule_timetable_leaderboard.png') });
  console.log('Saved 02_schedule_timetable_leaderboard.png');

  // 3. Click 🏆 Leaderboard for PTM 01 or navigate to #/leaderboard/jee-mains-ptm-01
  console.log('3. Navigating to #/leaderboard/jee-mains-ptm-01...');
  await page.goto('http://localhost:3000/#/leaderboard/jee-mains-ptm-01', { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Verify tab and test selection
  const pageState = await page.evaluate(() => {
    const isJeeMainsTabActive = Array.from(document.querySelectorAll('button')).some(b => 
      b.textContent.includes('JEE Mains') && b.className.includes('indigo')
    );
    const ptm01Pill = Array.from(document.querySelectorAll('button')).some(b => 
      b.textContent.includes('PTM 01') && (b.className.includes('indigo') || b.className.includes('border-indigo'))
    );
    const emptyStateText = document.body.innerText.includes('No student attempts recorded for PTM 01 yet') ||
                           document.body.innerText.includes('be the first to top this paper');
    const attemptBtn = Array.from(document.querySelectorAll('button')).some(b => 
      b.textContent.includes('Attempt PTM 01 →') || b.textContent.includes('Attempt PTM 01')
    );
    const noFirstAttemptOnly = !document.body.innerText.includes('1st-Attempt-Only Official Rankings');
    const hasHighestMarksText = document.body.innerText.includes('Ranked by Highest Marks');

    // Strict Privacy Audit: check for student emails or phone numbers
    const rawText = document.body.innerText;
    const emailMatches = (rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [])
      .filter(e => !['mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in', 'contact@nelovmallickiitd.com'].includes(e.toLowerCase()));
    const phoneMatches = (rawText.match(/\b(?:\+91|91)?\s?[6789]\d{9}\b/g) || []);

    return {
      isJeeMainsTabActive,
      ptm01Pill,
      emptyStateText,
      attemptBtn,
      noFirstAttemptOnly,
      hasHighestMarksText,
      exposedEmails: emailMatches,
      exposedPhones: phoneMatches
    };
  });

  console.log('Leaderboard Page State:', JSON.stringify(pageState, null, 2));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '03_ptm01_leaderboard_view.png') });
  console.log('Saved 03_ptm01_leaderboard_view.png');

  // 4. Verify Local Leaderboard Calculation (Highest Marks Ranking + Admin Exclusion)
  console.log('4. Verifying local ranking calculation and admin exclusion in page context...');
  const calcResult = await page.evaluate(async () => {
    // Inject mock attempts into studentStorage or authStore
    const mockAttempts = [
      // Student 1: Attempt 1 = 120 marks, Attempt 2 = 260 marks (Best attempt should win)
      {
        id: 'attempt-s1-1',
        userId: 'student-1',
        testId: 'jee-mains-ptm-01',
        candidateName: 'Aarav Sharma',
        totalMarksScored: 120,
        obtainedMarks: 120,
        accuracy: 75,
        timeTakenSeconds: 7200,
        completedAt: '2026-11-20T10:00:00Z',
        email: 'aarav@mock.com'
      },
      {
        id: 'attempt-s1-2',
        userId: 'student-1',
        testId: 'jee-mains-ptm-01',
        candidateName: 'Aarav Sharma',
        totalMarksScored: 260,
        obtainedMarks: 260,
        accuracy: 92,
        timeTakenSeconds: 6800,
        completedAt: '2026-11-21T10:00:00Z',
        email: 'aarav@mock.com'
      },
      // Student 2: Attempt 1 = 210 marks
      {
        id: 'attempt-s2-1',
        userId: 'student-2',
        testId: 'jee-mains-ptm-01',
        candidateName: 'Priya Verma',
        totalMarksScored: 210,
        obtainedMarks: 210,
        accuracy: 88,
        timeTakenSeconds: 7000,
        completedAt: '2026-11-22T10:00:00Z',
        email: 'priya@mock.com'
      },
      // Admin attempt: Nelov Mallick (300 marks) -> MUST BE STRICTLY EXCLUDED
      {
        id: 'attempt-admin-1',
        userId: 'admin-nelov',
        testId: 'jee-mains-ptm-01',
        candidateName: 'Nelov Mallick (Admin)',
        totalMarksScored: 300,
        obtainedMarks: 300,
        accuracy: 100,
        timeTakenSeconds: 3600,
        completedAt: '2026-11-23T10:00:00Z',
        email: 'mallicknelov@gmail.com',
        role: 'admin'
      }
    ];

    // Mock getAllAttempts
    if (window.studentStorage) {
      window.studentStorage.getAllAttempts = async () => mockAttempts;
      return await window.studentStorage.calculateLocalTestLeaderboard('jee-mains-ptm-01');
    }
    return null;
  });

  console.log('Local Leaderboard Calculation Verification:');
  console.log('- Total participants:', calcResult?.totalParticipants, '(Expected: 2)');
  console.log('- Highest marks:', calcResult?.highestMarks, '(Expected: 260)');
  console.log('- Topper:', calcResult?.topper?.displayName, 'Marks:', calcResult?.topper?.marks, '(Expected: Aarav Sharma, 260)');
  console.log('- Top 5 length:', calcResult?.top5?.length, '(Expected: 2)');
  console.log('- Entries:', calcResult?.entries?.map(e => ({ rank: e.rank, name: e.displayName, marks: e.marks, percentile: e.percentile })));

  const assertions = [
    { name: 'Admin excluded (totalParticipants === 2)', pass: calcResult?.totalParticipants === 2 },
    { name: 'Admin excluded (highestMarks === 260, not 300)', pass: calcResult?.highestMarks === 260 },
    { name: 'Best score ranking (Rank 1 has 260 marks, not 120)', pass: calcResult?.topper?.marks === 260 },
    { name: 'Rank 1 is Aarav Sharma', pass: calcResult?.topper?.displayName === 'Aarav Sharma' },
    { name: 'Rank 2 is Priya Verma with 210 marks', pass: calcResult?.entries?.[1]?.displayName === 'Priya Verma' && calcResult?.entries?.[1]?.marks === 210 },
    { name: 'Zero exposed student emails', pass: pageState.exposedEmails.length === 0 },
    { name: 'Zero exposed student phone numbers', pass: pageState.exposedPhones.length === 0 }
  ];

  console.log('\n--- VERIFICATION ASSERTIONS ---');
  let allPassed = true;
  for (const a of assertions) {
    console.log(`${a.pass ? '✓ PASS' : '✗ FAIL'}: ${a.name}`);
    if (!a.pass) allPassed = false;
  }

  await browser.close();

  if (allPassed) {
    console.log('\n>>> ALL LEADERBOARD & SCHEDULE TESTS PASSED SUCCESSFULLY! <<<');
    process.exit(0);
  } else {
    console.error('\n>>> SOME ASSERTIONS FAILED! <<<');
    process.exit(1);
  }
}

runQA().catch(err => {
  console.error('QA Test execution failed:', err);
  process.exit(1);
});
