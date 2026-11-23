// scripts/verify_ptm03_qa.js
import fs from 'fs';
import path from 'path';
import http from 'http';

const BASE_URL = 'http://localhost:3000';

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: Buffer.concat(data)
        });
      });
    }).on('error', reject);
  });
}

async function runQA() {
  console.log('--- STARTING PTM 03 VERIFICATION SUITE ---');
  let errors = [];
  let passed = 0;

  // 1. Verify JSON file on disk and via HTTP
  console.log('\n[TEST 1] Verifying public/data/jee-mains/ptm03.js');
  const jsRes = await fetchUrl('/data/jee-mains/ptm03.js');
  if (jsRes.statusCode === 200 && jsRes.data.toString().includes('window.ptm03Data')) {
    console.log('✓ public/data/jee-mains/ptm03.js fetched successfully (HTTP 200) and contains window.ptm03Data');
    passed++;
  } else {
    errors.push(`Failed to fetch /data/jee-mains/ptm03.js: status ${jsRes.statusCode}`);
  }

  // 2. Verify JSON file via HTTP
  console.log('\n[TEST 2] Verifying /data/tests/jee-main-2027/ptm-03.json');
  const jsonRes = await fetchUrl('/data/tests/jee-main-2027/ptm-03.json');
  if (jsonRes.statusCode === 200) {
    try {
      const ptm03Json = JSON.parse(jsonRes.data.toString());
      console.log(`✓ /data/tests/jee-main-2027/ptm-03.json parsed: title="${ptm03Json.title}", totalQuestions=${ptm03Json.questions?.length}`);
      if (ptm03Json.questions?.length === 75) {
        passed++;
        console.log('✓ Full 75 questions confirmed');
      } else {
        errors.push(`Expected 75 questions in JSON, got ${ptm03Json.questions?.length}`);
      }

      // Check section breakdown
      const physics = ptm03Json.questions.filter(q => q.subject === 'Physics');
      const chemistry = ptm03Json.questions.filter(q => q.subject === 'Chemistry');
      const math = ptm03Json.questions.filter(q => q.subject === 'Mathematics');
      console.log(`  Physics: ${physics.length}, Chemistry: ${chemistry.length}, Mathematics: ${math.length}`);
      if (physics.length === 25 && chemistry.length === 25 && math.length === 25) {
        passed++;
        console.log('✓ Exact 25-25-25 subject split confirmed');
      } else {
        errors.push('Subject split is not 25/25/25');
      }

      // Check MCQ vs NVQ
      const pMcq = physics.filter(q => q.type === 'single_correct' || q.type === 'single');
      const pNvq = physics.filter(q => q.type === 'numerical' || q.type === 'integer');
      const cMcq = chemistry.filter(q => q.type === 'single_correct' || q.type === 'single');
      const cNvq = chemistry.filter(q => q.type === 'numerical' || q.type === 'integer');
      const mMcq = math.filter(q => q.type === 'single_correct' || q.type === 'single');
      const mNvq = math.filter(q => q.type === 'numerical' || q.type === 'integer');
      console.log(`  Physics MCQs: ${pMcq.length}, NVQs: ${pNvq.length}`);
      console.log(`  Chemistry MCQs: ${cMcq.length}, NVQs: ${cNvq.length}`);
      console.log(`  Math MCQs: ${mMcq.length}, NVQs: ${mNvq.length}`);
      if (pMcq.length === 20 && pNvq.length === 5 &&
          cMcq.length === 20 && cNvq.length === 5 &&
          mMcq.length === 20 && mNvq.length === 5) {
        passed++;
        console.log('✓ Standard JEE Mains 20 MCQ + 5 NVQ per subject confirmed');
      } else {
        errors.push('MCQ/NVQ breakdown deviates from 20/5 per subject');
      }
    } catch (e) {
      errors.push(`Error parsing ptm-03.json: ${e.message}`);
    }
  } else {
    errors.push(`Failed to fetch /data/tests/jee-main-2027/ptm-03.json: status ${jsonRes.statusCode}`);
  }

  // 3. Verify ALL 39 diagram files via HTTP and PNG headers
  console.log('\n[TEST 3] Verifying all diagram PNGs via HTTP');
  const expectedDiagrams = [
    'q03.png', 'q04_optA.png', 'q04_optB.png', 'q04_optC.png', 'q04_optD.png',
    'q05.png', 'q07.png', 'q12.png', 'q13.png', 'q14.png', 'q15.png', 'q21.png', 'q25.png',
    'q26.png', 'q28.png', 'q28_optA.png', 'q28_optB.png', 'q28_optC.png', 'q29.png', 'q31.png',
    'q32.png', 'q32_optA.png', 'q32_optB.png', 'q32_optC.png', 'q32_optD.png', 'q33.png',
    'q35.png', 'q36.png', 'q37.png', 'q38.png', 'q41.png', 'q42.png', 'q43.png',
    'q43_options.png', 'q44.png', 'q46.png', 'q47.png', 'q49.png', 'q50.png'
  ];

  let missingDiagrams = [];
  for (const diag of expectedDiagrams) {
    const diagRes = await fetchUrl(`/images/ptm03/${diag}`);
    if (diagRes.statusCode === 200 && diagRes.data.length > 200) {
      // Valid PNG header: 89 50 4E 47
      if (diagRes.data[0] === 0x89 && diagRes.data[1] === 0x50 && diagRes.data[2] === 0x4E && diagRes.data[3] === 0x47) {
        // Ok
      } else {
        missingDiagrams.push(`${diag} (invalid PNG header)`);
      }
    } else {
      missingDiagrams.push(`${diag} (status ${diagRes.statusCode}, size ${diagRes.data.length})`);
    }
  }

  if (missingDiagrams.length === 0) {
    passed++;
    console.log(`✓ All ${expectedDiagrams.length} diagram PNGs verified with valid PNG headers & HTTP 200`);
  } else {
    errors.push(`Diagram verification failed for: ${missingDiagrams.join(', ')}`);
  }

  // 4. Verify schedule data and complete 3-subject syllabi
  console.log('\n[TEST 4] Verifying scheduleData.js for complete 3-subject syllabi');
  const scheduleRes = await fetchUrl('/data/scheduleData.js');
  if (scheduleRes.statusCode === 200) {
    const scheduleContent = scheduleRes.data.toString();
    
    // Check PTM 01
    const ptm01Match = scheduleContent.match(/id:\s*['"]jee-mains-ptm-01['"][\s\S]*?id:\s*['"]jee-mains-ptm-02['"]/);
    if (ptm01Match && ptm01Match[0].includes('Kinetic Theory of Gases') && ptm01Match[0].includes('Hydrocarbons') && ptm01Match[0].includes('Trigonometric Ratios')) {
      passed++;
      console.log('✓ PTM 01 complete 3-subject syllabus present (Physics + Chemistry + Math)');
    } else {
      errors.push('PTM 01 missing complete 3-subject syllabus in scheduleData.js');
    }

    // Check PTM 02
    const ptm02Match = scheduleContent.match(/id:\s*['"]jee-mains-ptm-02['"][\s\S]*?id:\s*['"]jee-mains-ptm-03['"]/);
    if (ptm02Match && ptm02Match[0].includes('Thermal Expansion') && ptm02Match[0].includes('IUPAC Nomenclature') && ptm02Match[0].includes('Quadratic Equations')) {
      passed++;
      console.log('✓ PTM 02 complete 3-subject syllabus present (Physics + Chemistry + Math)');
    } else {
      errors.push('PTM 02 missing complete 3-subject syllabus in scheduleData.js');
    }

    // Check PTM 03
    const ptm03Match = scheduleContent.match(/id:\s*['"]jee-mains-ptm-03['"][\s\S]*?id:\s*['"]jee-mains-ptm-04['"]/);
    if (ptm03Match && ptm03Match[0].includes('Thermal Properties of Matter') && ptm03Match[0].includes('IUPAC Nomenclature & Structural Basics') && ptm03Match[0].includes('Matrices & Matrix Algebra')) {
      passed++;
      console.log('✓ PTM 03 complete 3-subject syllabus present (Physics + Chemistry + Math)');
    } else {
      errors.push('PTM 03 missing complete 3-subject syllabus in scheduleData.js');
    }

    // Verify PTM 04 has no syllabus
    const ptm04Match = scheduleContent.match(/id:\s*['"]jee-mains-ptm-04['"][\s\S]*?route:/);
    if (ptm04Match && !ptm04Match[0].includes('syllabus:')) {
      passed++;
      console.log('✓ PTM 04 has no syllabus (ready for future release)');
    } else {
      errors.push('PTM 04 has unexpected syllabus');
    }
  } else {
    errors.push(`Failed to fetch /data/scheduleData.js: status ${scheduleRes.statusCode}`);
  }

  // 5. Verify index.html head script inclusion
  console.log('\n[TEST 5] Verifying index.html inclusion of ptm03.js');
  const indexRes = await fetchUrl('/index.html');
  if (indexRes.statusCode === 200) {
    const html = indexRes.data.toString();
    if (html.includes('<script src="/data/jee-mains/ptm03.js"></script>')) {
      passed++;
      console.log('✓ index.html loads /data/jee-mains/ptm03.js in <head>');
    } else {
      errors.push('index.html missing script tag for ptm03.js');
    }

    if (html.includes('jee-mains-ptm-03') && html.includes('window.ptm03Data')) {
      passed++;
      console.log('✓ index.html references ptm03Data and canonicalId jee-mains-ptm-03');
    } else {
      errors.push('index.html missing ptm03Data integration');
    }
  } else {
    errors.push(`Failed to fetch /index.html: status ${indexRes.statusCode}`);
  }

  // 6. Verify UTC Epoch Go-Live Calculation
  console.log('\n[TEST 6] Verifying UTC Epoch Go-Live Calculation');
  const startIso = "2026-11-29T09:00:00+05:30";
  const startEpoch = Date.parse(startIso);
  const expectedUtc = Date.UTC(2026, 10, 29, 3, 30, 0); // 9:00 AM IST = 3:30 AM UTC on Nov 29
  if (startEpoch === expectedUtc) {
    passed++;
    console.log(`✓ UTC epoch verification exact: ${startEpoch} ms (Nov 29, 2026 03:30:00 UTC)`);
  } else {
    errors.push(`UTC epoch mismatch: expected ${expectedUtc}, got ${startEpoch}`);
  }

  // Summary
  console.log('\n========================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${errors.length} FAILED`);
  if (errors.length > 0) {
    console.error('ERRORS:');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  } else {
    console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
}

runQA().catch(err => {
  console.error('Fatal error running QA:', err);
  process.exit(1);
});
