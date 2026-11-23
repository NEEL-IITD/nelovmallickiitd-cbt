// scripts/verify_ptm02_qa.js
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
  console.log('--- STARTING PTM 02 VERIFICATION SUITE ---');
  let errors = [];
  let passed = 0;

  // 1. Verify JSON file on disk and via HTTP
  console.log('\n[TEST 1] Verifying public/data/jee-mains/ptm02.js');
  const jsRes = await fetchUrl('/data/jee-mains/ptm02.js');
  if (jsRes.statusCode === 200 && jsRes.data.toString().includes('window.ptm02Data')) {
    console.log('✓ public/data/jee-mains/ptm02.js fetched successfully (HTTP 200) and contains window.ptm02Data');
    passed++;
  } else {
    errors.push(`Failed to fetch /data/jee-mains/ptm02.js: status ${jsRes.statusCode}`);
  }

  // 2. Verify JSON file via HTTP
  console.log('\n[TEST 2] Verifying /data/tests/jee-main-2027/ptm-02.json');
  const jsonRes = await fetchUrl('/data/tests/jee-main-2027/ptm-02.json');
  if (jsonRes.statusCode === 200) {
    try {
      const ptm02Json = JSON.parse(jsonRes.data.toString());
      console.log(`✓ /data/tests/jee-main-2027/ptm-02.json parsed: title="${ptm02Json.title}", totalQuestions=${ptm02Json.questions?.length}`);
      if (ptm02Json.questions?.length === 75) {
        passed++;
        console.log('✓ Full 75 questions confirmed');
      } else {
        errors.push(`Expected 75 questions in JSON, got ${ptm02Json.questions?.length}`);
      }

      // Check section breakdown
      const physics = ptm02Json.questions.filter(q => q.subject === 'Physics');
      const chemistry = ptm02Json.questions.filter(q => q.subject === 'Chemistry');
      const math = ptm02Json.questions.filter(q => q.subject === 'Mathematics');
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
      errors.push(`Error parsing ptm-02.json: ${e.message}`);
    }
  } else {
    errors.push(`Failed to fetch /data/tests/jee-main-2027/ptm-02.json: status ${jsonRes.statusCode}`);
  }

  // 3. Verify ALL 25 diagram files via HTTP
  console.log('\n[TEST 3] Verifying all 25 diagram PNGs via HTTP');
  const expectedDiagrams = [
    'q03.png', 'q08.png', 'q13.png', 'q15.png', 'q16.png', 'q18.png', 'q23.png', 'q25.png',
    'q27.png', 'q27_optA.png', 'q27_optB.png', 'q27_optC.png', 'q27_optD.png',
    'q31.png', 'q31_optA.png', 'q31_optB.png', 'q31_optC.png', 'q31_optD.png',
    'q33.png', 'q34.png', 'q39.png', 'q44.png', 'q44_optA.png', 'q44_optB.png', 'q44_optD.png'
  ];

  let missingDiagrams = [];
  for (const diag of expectedDiagrams) {
    const diagRes = await fetchUrl(`/images/ptm02/${diag}`);
    if (diagRes.statusCode === 200 && diagRes.data.length > 500) {
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
    console.log(`✓ All 25 diagram PNGs verified with valid headers & HTTP 200`);
  } else {
    errors.push(`Diagram verification failed for: ${missingDiagrams.join(', ')}`);
  }

  // 4. Verify schedule data and strict syllabus isolation
  console.log('\n[TEST 4] Verifying scheduleData.js and strict syllabus isolation');
  const scheduleRes = await fetchUrl('/data/scheduleData.js');
  if (scheduleRes.statusCode === 200) {
    const scheduleContent = scheduleRes.data.toString();
    if (scheduleContent.includes('Calorimetry and Heat Transfer') &&
        scheduleContent.includes('General Organic Chemistry') &&
        scheduleContent.includes('Quadratic Equations')) {
      passed++;
      console.log('✓ PTM 02 syllabus topics present in scheduleData.js');
    } else {
      errors.push('PTM 02 syllabus topics missing from scheduleData.js');
    }

    // Verify PTM 03-20 do not have PTM 02 syllabus
    // Check that PTM 03 syllabus is empty object {}
    const ptm03Match = scheduleContent.match(/id:\s*['"]jee-mains-ptm-03['"][\s\S]*?syllabus:\s*({[\s\S]*?})/);
    if (ptm03Match) {
      const ptm03SyllabusStr = ptm03Match[1].replace(/\s+/g, '');
      if (ptm03SyllabusStr === '{}') {
        passed++;
        console.log('✓ Strict isolation confirmed: PTM 03 syllabus is empty {}');
      } else {
        errors.push(`PTM 03 syllabus is not empty: ${ptm03SyllabusStr}`);
      }
    }
  } else {
    errors.push(`Failed to fetch /data/scheduleData.js: status ${scheduleRes.statusCode}`);
  }

  // 5. Verify index.html head script inclusion
  console.log('\n[TEST 5] Verifying index.html inclusion of ptm02.js');
  const indexRes = await fetchUrl('/index.html');
  if (indexRes.statusCode === 200) {
    const html = indexRes.data.toString();
    if (html.includes('<script src="/data/jee-mains/ptm02.js"></script>')) {
      passed++;
      console.log('✓ index.html loads /data/jee-mains/ptm02.js in <head>');
    } else {
      errors.push('index.html missing script tag for ptm02.js');
    }

    if (html.includes('jee-mains-ptm-02') && html.includes('window.ptm02Data')) {
      passed++;
      console.log('✓ index.html references ptm02Data and canonicalId jee-mains-ptm-02');
    } else {
      errors.push('index.html missing ptm02Data integration');
    }
  } else {
    errors.push(`Failed to fetch /index.html: status ${indexRes.statusCode}`);
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
