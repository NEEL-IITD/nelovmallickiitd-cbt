const puppeteer = require('C:/Users/dasri/.gemini/antigravity/scratch/nelovmallickiitd-web/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\dasri\\.gemini\\antigravity\\brain\\891ec41f-d0f8-46a7-adac-6aa0cddea39e\\chapter_vault_evidence';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function runQA() {
  console.log('Launching browser for Chapter Vaults QA...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('error') || text.includes('warning') || text.includes('[ChapterProgress]')) {
      console.log('Browser console:', text);
    }
  });

  const results = [];

  try {
    // --------------------------------------------------------------------------
    // Test 1: Physics Vault Overview & Weightage Glows
    // --------------------------------------------------------------------------
    console.log('Step 1: Navigating to Physics Vault (#/resources/physics)...');
    await page.goto('http://localhost:3000/#/resources/physics', { waitUntil: 'networkidle0', timeout: 30000 });
    await delay(2000);

    const initialScreenPath = path.join(EVIDENCE_DIR, '01_physics_vault_overview.png');
    await page.screenshot({ path: initialScreenPath, fullPage: false });
    console.log('Captured:', initialScreenPath);

    // Verify 28 chapters present
    const cardCount = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[class*="group cursor-pointer"]');
      return cards.length;
    });
    console.log(`Physics chapters rendered: ${cardCount}`);
    results.push({ test: 'Physics Chapter Count', expected: 28, actual: cardCount, pass: cardCount === 28 });

    // Verify Subject Overview Strip
    const overviewStats = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('*')).map(el => el.textContent || '');
      const hasSubjectMastery = texts.some(t => t.includes('Subject Mastery'));
      const hasChaptersStatus = texts.some(t => t.includes('Chapters Status'));
      const hasCBTDrills = texts.some(t => t.includes('CBT Drills Given'));
      return { hasSubjectMastery, hasChaptersStatus, hasCBTDrills };
    });
    console.log('Overview stats strip check:', overviewStats);
    results.push({
      test: 'Subject Overview Strip Rendered',
      pass: overviewStats.hasSubjectMastery && overviewStats.hasChaptersStatus && overviewStats.hasCBTDrills
    });

    // Verify Weightage Badges counts
    const weightageCounts = await page.evaluate(() => {
      const allText = document.body.innerText;
      const highMatches = (allText.match(/High Weightage/gi) || []).length;
      const midMatches = (allText.match(/Mid Weightage/gi) || []).length;
      const lowMatches = (allText.match(/Low Weightage/gi) || []).length;
      return { highMatches, midMatches, lowMatches };
    });
    console.log('Weightage badges check:', weightageCounts);
    results.push({
      test: 'Weightage Badges Present',
      pass: weightageCounts.highMatches >= 13 && weightageCounts.midMatches >= 14
    });

    // --------------------------------------------------------------------------
    // Test 2: Weightage Filter Pill Interaction
    // --------------------------------------------------------------------------
    console.log('Step 2: Testing High Weightage Filter Pill...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const highBtn = buttons.find(b => b.textContent && b.textContent.includes('High Weightage'));
      if (highBtn) highBtn.click();
    });
    await delay(1000);

    const highFilterScreenPath = path.join(EVIDENCE_DIR, '02_high_weightage_filtered.png');
    await page.screenshot({ path: highFilterScreenPath, fullPage: false });
    console.log('Captured:', highFilterScreenPath);

    const highFilterCount = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[class*="group cursor-pointer"]');
      return cards.length;
    });
    console.log(`Filtered High Weightage cards count: ${highFilterCount}`);
    results.push({ test: 'High Weightage Filter (13 chapters)', expected: 13, actual: highFilterCount, pass: highFilterCount === 13 });

    // Test Low Weightage Filter (should be 1: C3)
    console.log('Step 2b: Testing Low Weightage Filter Pill...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lowBtn = buttons.find(b => b.textContent && b.textContent.includes('Low Weightage'));
      if (lowBtn) lowBtn.click();
    });
    await delay(1000);

    const lowFilterCount = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[class*="group cursor-pointer"]');
      return cards.length;
    });
    console.log(`Filtered Low Weightage cards count: ${lowFilterCount}`);
    results.push({ test: 'Low Weightage Filter (1 chapter)', expected: 1, actual: lowFilterCount, pass: lowFilterCount === 1 });

    // Reset back to All
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const allBtn = buttons.find(b => b.textContent && b.textContent.includes('All ('));
      if (allBtn) allBtn.click();
    });
    await delay(1000);

    // --------------------------------------------------------------------------
    // Test 3: Interactive Mastery Checkbox Progress Updating
    // --------------------------------------------------------------------------
    console.log('Step 3: Testing Interactive 4-Milestone Checkboxes...');
    // Find the first chapter card (e.g. C1) and test clicking checkboxes
    const progressBefore = await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      return firstCard ? firstCard.innerText : '';
    });
    console.log('First card initially has 0% Done?', progressBefore.includes('0% Done'));

    // Click Theory Notes on the first card
    await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      if (firstCard) {
        const btns = Array.from(firstCard.querySelectorAll('button'));
        const notesBtn = btns.find(b => b.textContent && b.textContent.includes('Theory Notes'));
        if (notesBtn) notesBtn.click();
      }
    });
    await delay(500);

    // Click Formula Sheet
    await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      if (firstCard) {
        const btns = Array.from(firstCard.querySelectorAll('button'));
        const formBtn = btns.find(b => b.textContent && b.textContent.includes('Formula Sheet'));
        if (formBtn) formBtn.click();
      }
    });
    await delay(500);

    // Click PYQs
    await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      if (firstCard) {
        const btns = Array.from(firstCard.querySelectorAll('button'));
        const pyqBtn = btns.find(b => b.textContent && b.textContent.includes('PYQs Solved'));
        if (pyqBtn) pyqBtn.click();
      }
    });
    await delay(500);

    // Click Mock Practiced
    await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      if (firstCard) {
        const btns = Array.from(firstCard.querySelectorAll('button'));
        const mockBtn = btns.find(b => b.textContent && b.textContent.includes('Mock Practiced'));
        if (mockBtn) mockBtn.click();
      }
    });
    await delay(1000);

    const progressAfter100 = await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      return firstCard ? firstCard.innerText : '';
    });
    console.log('First card reached 100% Mastered?', progressAfter100.includes('100% Mastered'));

    const checkbox100ScreenPath = path.join(EVIDENCE_DIR, '03_checkbox_mastery_100_percent.png');
    await page.screenshot({ path: checkbox100ScreenPath, fullPage: false });
    console.log('Captured:', checkbox100ScreenPath);

    results.push({
      test: 'Interactive Checkboxes Reach 100% Mastered',
      pass: progressAfter100.includes('100% Mastered')
    });

    // Test Persistence on Page Reload
    console.log('Testing Persistence on page reload...');
    await page.reload({ waitUntil: 'networkidle0' });
    await delay(1500);

    const reloadedProgress = await page.evaluate(() => {
      const firstCard = document.querySelector('div[class*="group cursor-pointer"]');
      return firstCard ? firstCard.innerText : '';
    });
    console.log('Progress preserved after reload?', reloadedProgress.includes('100% Mastered'));
    results.push({
      test: 'Progress Persistence across Page Reloads',
      pass: reloadedProgress.includes('100% Mastered')
    });

    // --------------------------------------------------------------------------
    // Test 4: Chapter Detail View Mastery Dashboard
    // --------------------------------------------------------------------------
    console.log('Step 4: Navigating into Chapter Detail View (C8 Rotational Motion)...');
    await page.goto('http://localhost:3000/#/resources/physics/c8', { waitUntil: 'networkidle0', timeout: 30000 });
    await delay(2000);

    const chapterDetailScreenPath = path.join(EVIDENCE_DIR, '04_c8_chapter_detail_dashboard.png');
    await page.screenshot({ path: chapterDetailScreenPath, fullPage: false });
    console.log('Captured:', chapterDetailScreenPath);

    const detailDashboardCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasWeightageBadge = text.toLowerCase().includes('high weightage');
      const hasDashboard = text.includes('Chapter Mastery Dashboard');
      const hasCheckboxes = text.includes('1. Theory Notes') && text.includes('4. Mock Practiced');
      return { hasWeightageBadge, hasDashboard, hasCheckboxes };
    });
    console.log('C8 Detail Dashboard check:', detailDashboardCheck);
    results.push({
      test: 'C8 Detail View Mastery Dashboard Rendered',
      pass: detailDashboardCheck.hasWeightageBadge && detailDashboardCheck.hasDashboard && detailDashboardCheck.hasCheckboxes
    });

    // --------------------------------------------------------------------------
    // Test 5: Chemistry Vault (#/resources/chemistry)
    // --------------------------------------------------------------------------
    console.log('Step 5: Testing Chemistry Vault (#/resources/chemistry)...');
    await page.goto('http://localhost:3000/#/resources/chemistry', { waitUntil: 'networkidle0', timeout: 30000 });
    await delay(2000);

    const chemScreenPath = path.join(EVIDENCE_DIR, '05_chemistry_vault_overview.png');
    await page.screenshot({ path: chemScreenPath, fullPage: false });
    console.log('Captured:', chemScreenPath);

    const chemCount = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[class*="group cursor-pointer"]');
      return cards.length;
    });
    console.log(`Chemistry chapters rendered: ${chemCount}`);
    results.push({ test: 'Chemistry 29 Chapters Rendered', expected: 29, actual: chemCount, pass: chemCount === 29 });

    // --------------------------------------------------------------------------
    // Test 6: Mathematics Vault (#/resources/mathematics)
    // --------------------------------------------------------------------------
    console.log('Step 6: Testing Mathematics Vault (#/resources/mathematics)...');
    await page.goto('http://localhost:3000/#/resources/mathematics', { waitUntil: 'networkidle0', timeout: 30000 });
    await delay(2000);

    const mathScreenPath = path.join(EVIDENCE_DIR, '06_mathematics_vault_overview.png');
    await page.screenshot({ path: mathScreenPath, fullPage: false });
    console.log('Captured:', mathScreenPath);

    const mathCount = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[class*="group cursor-pointer"]');
      return cards.length;
    });
    console.log(`Mathematics chapters rendered: ${mathCount}`);
    results.push({ test: 'Mathematics 26 Chapters Rendered', expected: 26, actual: mathCount, pass: mathCount === 26 });

  } catch (err) {
    console.error('QA Test execution failed with error:', err);
    results.push({ test: 'QA Execution Error', pass: false, error: err.message });
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log('CHAPTER VAULTS QA SUMMARY:');
  console.log('======================================================');
  results.forEach(r => {
    const symbol = r.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} : ${r.test}${r.expected !== undefined ? ` (Expected: ${r.expected}, Actual: ${r.actual})` : ''}`);
  });
  console.log('======================================================\n');

  const allPassed = results.every(r => r.pass);
  process.exit(allPassed ? 0 : 1);
}

runQA();
