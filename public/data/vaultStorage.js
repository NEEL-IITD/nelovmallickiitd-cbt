// ==============================================================================
// NelovMallickIITD CBT Platform - Study Resources & Formula Vault Storage Engine
// Standardized JEE Exercise JSON Schema & Theory Notes PDF Upload Manager
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

(function() {
  'use strict';

  const STORAGE_KEY_EXERCISES = 'nelov_vault_exercises';
  const STORAGE_KEY_THEORY = 'nelov_vault_theory';
  const STORAGE_KEY_ATTEMPTS = 'nelov_vault_exercise_attempts';

  // Seed data from Nelov Mallick: Physics C08 Rotational Motion - Exercise 1
  const SEED_ROTATIONAL_MOTION_EX1 = {
    subject: 'physics',
    chapterId: 'C08',
    exerciseId: 'ex-1',
    title: 'Rotational Motion - Exercise 1',
    durationMinutes: 60,
    defaultMarking: { correct: 4, incorrect: -1, unattempted: 0 },
    questions: [
      {
        id: 'phy-c08-ex1-q1',
        number: 1,
        type: 'single_correct',
        question: 'A uniform rod of mass $M$ and length $L$ is pivoted at one end. Find its moment of inertia about the pivot.',
        image: null,
        options: [
          '$\\frac{1}{12}ML^2$',
          '$\\frac{1}{3}ML^2$',
          '$\\frac{1}{2}ML^2$',
          '$ML^2$'
        ],
        correctAnswer: 1,
        solution: 'By the parallel axis theorem, $I = I_{cm} + Md^2 = \\frac{1}{12}ML^2 + M\\left(\\frac{L}{2}\\right)^2 = \\frac{1}{12}ML^2 + \\frac{1}{4}ML^2 = \\frac{1}{3}ML^2$.',
        solutionImage: null
      },
      {
        id: 'phy-c08-ex1-q2',
        number: 2,
        type: 'multi_correct',
        question: 'Which of the following statements are true for pure rolling of a rigid circular body on a stationary horizontal surface?',
        image: null,
        options: [
          'Velocity of the point of contact is zero',
          '$v_{cm} = \\omega R$',
          'Friction is always zero',
          'Angular momentum is conserved about the contact point'
        ],
        correctAnswer: [0, 1, 3],
        solution: 'For pure rolling on a stationary surface: (A) The instantaneous velocity of the contact point is zero ($v_c = 0$). (B) $v_{cm} = \\omega R$. (D) Since torque of normal and gravity about the contact point vanishes and contact point is stationary, angular momentum is conserved about the contact point. Friction may be non-zero during acceleration, so (C) is false.'
      },
      {
        id: 'phy-c08-ex1-q3',
        number: 3,
        type: 'numerical',
        question: 'Calculate the angular acceleration (in $\\text{rad/s}^2$) if an external torque $\\tau = 12\\,\\text{N}\\cdot\\text{m}$ acts on a body having moment of inertia $I = 3\\,\\text{kg}\\cdot\\text{m}^2$.',
        image: null,
        correctAnswer: 4,
        tolerance: 0.01,
        solution: 'Using the rotational analogue of Newton’s second law: $\\tau = I \\alpha \\implies \\alpha = \\frac{\\tau}{I} = \\frac{12}{3} = 4\\,\\text{rad/s}^2$.'
      }
    ]
  };

  function normalizeStr(str) {
    if (!str) return '';
    return String(str).toLowerCase().trim().replace(/[\s\-_]/g, '').replace(/([a-z])0+(\d+)/g, '$1$2');
  }

  function makeExerciseKey(subject, chapterId, exerciseId) {
    return `${normalizeStr(subject)}_${normalizeStr(chapterId)}_${normalizeStr(exerciseId)}`;
  }

  function makeTheoryKey(subject, chapterId) {
    return `${normalizeStr(subject)}_${normalizeStr(chapterId)}`;
  }

  const vaultStorage = {
    // --------------------------------------------------------------------------
    // Initializer & Pre-seeding
    // --------------------------------------------------------------------------
    init() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
        let exercisesMap = stored ? JSON.parse(stored) : {};
        
        // 1. Ensure rotational motion exercise 1 is seeded if empty
        const seedKey = makeExerciseKey(SEED_ROTATIONAL_MOTION_EX1.subject, SEED_ROTATIONAL_MOTION_EX1.chapterId, SEED_ROTATIONAL_MOTION_EX1.exerciseId);
        if (!exercisesMap[seedKey]) {
          exercisesMap[seedKey] = {
            ...SEED_ROTATIONAL_MOTION_EX1,
            totalQuestions: SEED_ROTATIONAL_MOTION_EX1.questions.length,
            totalMarks: SEED_ROTATIONAL_MOTION_EX1.questions.length * 4,
            updatedAt: new Date().toISOString()
          };
          const aliasKey1 = makeExerciseKey('physics', 'C8', 'c8-ex1');
          const aliasKey2 = makeExerciseKey('physics', 'c8', 'ex-1');
          exercisesMap[aliasKey1] = exercisesMap[seedKey];
          exercisesMap[aliasKey2] = exercisesMap[seedKey];
        }

        // 2. Pre-seed Kinematics C4 Theory Notes
        const theoryStore = localStorage.getItem(STORAGE_KEY_THEORY);
        let theoryMap = theoryStore ? JSON.parse(theoryStore) : {};
        const c4TheoryKey = makeTheoryKey('physics', 'C4');
        if (!theoryMap[c4TheoryKey] || !theoryMap[c4TheoryKey].pdfUrl) {
          theoryMap[c4TheoryKey] = {
            subject: 'physics',
            chapterId: 'C4',
            chapterName: 'Kinematics',
            title: 'C4 - Kinematics Theory Notes (49 Pages)',
            pdfUrl: '/resources/physics/c04-kinematics/Kinematics_Theory_Clean.pdf',
            fileName: 'Kinematics_Theory_Clean.pdf',
            fileSizeBytes: 4594238,
            pageCount: 49,
            status: 'ready',
            updatedAt: new Date().toISOString()
          };
          theoryMap[makeTheoryKey('physics', 'C04')] = theoryMap[c4TheoryKey];
          theoryMap[makeTheoryKey('physics', 'c4')] = theoryMap[c4TheoryKey];
          localStorage.setItem(STORAGE_KEY_THEORY, JSON.stringify(theoryMap));
        }

        localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(exercisesMap));

        // 3. Asynchronously load Kinematics static JSON exercises into memory & storage
        window.builtInExercises = window.builtInExercises || {};
        const kinematicsFiles = [
          { file: '/data/physics/c04-kinematics/exercise-1.json', exId: 'c4-ex1', alias: 'ex-1' },
          { file: '/data/physics/c04-kinematics/exercise-2.json', exId: 'c4-ex2', alias: 'ex-2' },
          { file: '/data/physics/c04-kinematics/exercise-3.json', exId: 'c4-ex3', alias: 'ex-3' },
          { file: '/data/physics/c04-kinematics/exercise-4.json', exId: 'c4-ex4', alias: 'ex-4' },
          { file: '/data/physics/c04-kinematics/exercise-5.json', exId: 'c4-ex5', alias: 'ex-5' },
          { file: '/data/physics/c04-kinematics/short-answers.json', exId: 'c4-sa', alias: 'short-answers' }
        ];

        kinematicsFiles.forEach(async item => {
          try {
            const res = await fetch(item.file);
            if (res.ok) {
              const data = await res.json();
              window.builtInExercises[`physics_c4_${item.exId}`] = data;
              window.builtInExercises[`physics_c04_${item.alias}`] = data;
              window.builtInExercises[`physics_c4_${item.alias}`] = data;
              window.builtInExercises[`physics_c04_${item.exId}`] = data;
              
              const currentStored = localStorage.getItem(STORAGE_KEY_EXERCISES);
              const mapNow = currentStored ? JSON.parse(currentStored) : {};
              const k1 = makeExerciseKey('physics', 'C4', item.exId);
              const k2 = makeExerciseKey('physics', 'C04', item.alias);
              mapNow[k1] = {
                ...data,
                chapterId: 'C4',
                exerciseId: item.exId,
                totalQuestions: data.questions ? data.questions.length : (data.itemCount || 0),
                totalMarks: (data.questions ? data.questions.length : (data.itemCount || 0)) * (data.defaultMarking?.correct || 4),
                updatedAt: new Date().toISOString()
              };
              mapNow[k2] = mapNow[k1];
              localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(mapNow));
            }
          } catch (e) {
            // ignore network/file err in init
          }
        });
      } catch (e) {
        console.warn('[vaultStorage] Failed to initialize seed data:', e);
      }
    },

    // --------------------------------------------------------------------------
    // Schema Validation
    // --------------------------------------------------------------------------
    validateExerciseJson(rawInput) {
      let data = rawInput;
      if (typeof rawInput === 'string') {
        try {
          data = JSON.parse(rawInput);
        } catch (err) {
          return {
            isValid: false,
            errors: [`Invalid JSON Syntax: ${err.message}`],
            summary: null,
            data: null
          };
        }
      }

      if (!data || typeof data !== 'object') {
        return {
          isValid: false,
          errors: ['JSON root must be an object'],
          summary: null,
          data: null
        };
      }

      const errors = [];
      const validSubjects = ['physics', 'chemistry', 'mathematics'];
      if (!data.subject || !validSubjects.includes(String(data.subject).toLowerCase())) {
        errors.push(`"subject" must be one of: 'physics', 'chemistry', 'mathematics' (got "${data.subject}")`);
      }

      if (!data.chapterId || typeof data.chapterId !== 'string') {
        errors.push('"chapterId" is required (e.g. "C08", "Ch 3", "C18")');
      }

      if (!data.exerciseId || typeof data.exerciseId !== 'string') {
        errors.push('"exerciseId" is required (e.g. "ex-1", "c8-ex1")');
      }

      if (!data.title || typeof data.title !== 'string') {
        errors.push('"title" is required (e.g. "Rotational Motion - Exercise 1")');
      }

      const durationMinutes = Number(data.durationMinutes) || 60;
      const defaultMarking = data.defaultMarking || { correct: 4, incorrect: -1, unattempted: 0 };

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        errors.push('"questions" must be a non-empty array of question objects');
      } else {
        data.questions.forEach((q, idx) => {
          const qNum = q.number || idx + 1;
          if (!q.id) {
            errors.push(`Question #${qNum}: missing "id"`);
          }
          if (!q.type || !['single_correct', 'multi_correct', 'numerical', 'subjective', 'conceptual_flashcard'].includes(q.type)) {
            errors.push(`Question #${qNum}: "type" must be 'single_correct', 'multi_correct', 'numerical', 'subjective', or 'conceptual_flashcard'`);
          }
          if (!q.question || typeof q.question !== 'string') {
            errors.push(`Question #${qNum}: missing or empty "question" text`);
          }

          if (q.type === 'single_correct') {
            if (!Array.isArray(q.options) || q.options.length < 2) {
              errors.push(`Question #${qNum}: "options" array with at least 2 choices is required for single_correct`);
            }
            if (q.correctAnswer === undefined || q.correctAnswer === null) {
              errors.push(`Question #${qNum}: missing "correctAnswer" index (0-based)`);
            }
          } else if (q.type === 'multi_correct') {
            if (!Array.isArray(q.options) || q.options.length < 2) {
              errors.push(`Question #${qNum}: "options" array with at least 2 choices is required for multi_correct`);
            }
            if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) {
              errors.push(`Question #${qNum}: "correctAnswer" must be an array of correct option indices (e.g. [0, 1])`);
            }
          } else if (q.type === 'numerical') {
            if (q.correctAnswer === undefined || isNaN(Number(q.correctAnswer))) {
              errors.push(`Question #${qNum}: "correctAnswer" must be a numeric value`);
            }
          } else if (q.type === 'subjective') {
            if (q.correctAnswer === undefined || q.correctAnswer === null) {
              errors.push(`Question #${qNum}: "correctAnswer" must be provided for subjective problem`);
            }
          }

          if ((!q.solution || typeof q.solution !== 'string') && (!q.answer || typeof q.answer !== 'string')) {
            errors.push(`Question #${qNum}: "solution" or "answer" text is required`);
          }
        });
      }

      const questions = Array.isArray(data.questions) ? data.questions : [];
      const singleCorrectCount = questions.filter(q => q.type === 'single_correct').length;
      const multiCorrectCount = questions.filter(q => q.type === 'multi_correct').length;
      const numericalCount = questions.filter(q => q.type === 'numerical').length;
      const totalMarks = questions.reduce((sum, q) => sum + (q.marking?.correct || defaultMarking.correct || 4), 0);

      const summary = {
        totalQuestions: questions.length,
        singleCorrectCount,
        multiCorrectCount,
        numericalCount,
        totalMarks,
        durationMinutes,
        subject: data.subject,
        chapterId: data.chapterId,
        exerciseId: data.exerciseId,
        title: data.title
      };

      return {
        isValid: errors.length === 0,
        errors,
        summary,
        data: errors.length === 0 ? {
          ...data,
          durationMinutes,
          defaultMarking,
          totalQuestions: questions.length,
          totalMarks,
          updatedAt: new Date().toISOString()
        } : null
      };
    },

    // --------------------------------------------------------------------------
    // Exercises CRUD
    // --------------------------------------------------------------------------
    async saveExercise(exerciseInput) {
      const val = this.validateExerciseJson(exerciseInput);
      if (!val.isValid || !val.data) {
        return { ok: false, error: val.errors.join('; ') };
      }

      const exerciseData = val.data;
      const primaryKey = makeExerciseKey(exerciseData.subject, exerciseData.chapterId, exerciseData.exerciseId);

      // 1. Save to localStorage map
      try {
        const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
        const map = stored ? JSON.parse(stored) : {};
        map[primaryKey] = exerciseData;

        // Also add aliases for normalized variants so lookups never fail
        const altChapter = normalizeStr(exerciseData.chapterId);
        const altEx = normalizeStr(exerciseData.exerciseId);
        map[`${normalizeStr(exerciseData.subject)}_${altChapter}_${altEx}`] = exerciseData;

        localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(map));
      } catch (e) {
        console.warn('[vaultStorage] Failed to save exercise to local storage:', e);
      }

      // 2. Cloud sync to Supabase if connected
      if (window.supabaseClient && window.authService?.isCloudConnected && window.authService.isCloudConnected()) {
        try {
          await window.supabaseClient.from('vault_exercises').upsert({
            id: primaryKey,
            subject: exerciseData.subject.toLowerCase(),
            chapter_id: exerciseData.chapterId,
            chapter_name: exerciseData.chapterName || exerciseData.title,
            exercise_id: exerciseData.exerciseId,
            title: exerciseData.title,
            duration_minutes: exerciseData.durationMinutes,
            default_marking: exerciseData.defaultMarking,
            questions: exerciseData.questions,
            total_questions: exerciseData.totalQuestions,
            total_marks: exerciseData.totalMarks,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        } catch (err) {
          console.warn('[vaultStorage] Supabase cloud upsert warning:', err);
        }
      }

      return { ok: true, key: primaryKey, exercise: exerciseData };
    },

    getExercise(subject, chapterId, exerciseId) {
      if (!subject || !chapterId || !exerciseId) return null;
      try {
        const normSubject = normalizeStr(subject);
        const normChapter = normalizeStr(chapterId);
        const normEx = normalizeStr(exerciseId);

        // 1. Check in-memory builtInExercises first
        if (window.builtInExercises) {
          const directKey1 = `${normSubject}_${normChapter}_${normEx}`;
          if (window.builtInExercises[directKey1]) return window.builtInExercises[directKey1];
          for (const [k, v] of Object.entries(window.builtInExercises)) {
            const parts = k.split('_');
            if (parts.length >= 3 && parts[0] === normSubject &&
               (parts[1] === normChapter || normChapter.endsWith(parts[1]) || parts[1].endsWith(normChapter)) &&
               (parts[2] === normEx || normEx.endsWith(parts[2]) || parts[2].endsWith(normEx))) {
              return v;
            }
          }
        }

        const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
        if (stored) {
          const map = JSON.parse(stored);
          const directKey = makeExerciseKey(subject, chapterId, exerciseId);
          if (map[directKey]) return map[directKey];

          for (const [key, item] of Object.entries(map)) {
            if (!item) continue;
            const sMatch = normalizeStr(item.subject) === normSubject;
            const cMatch = normalizeStr(item.chapterId) === normChapter ||
                           normChapter.endsWith(normalizeStr(item.chapterId)) ||
                           normalizeStr(item.chapterId).endsWith(normChapter);
            const eMatch = normalizeStr(item.exerciseId) === normEx ||
                           normEx.endsWith(normalizeStr(item.exerciseId)) ||
                           normalizeStr(item.exerciseId).endsWith(normEx);

            if (sMatch && cMatch && eMatch) {
              return item;
            }
          }
        }
      } catch (e) {
        console.warn('[vaultStorage] Error reading exercise:', e);
      }
      return null;
    },

    getAllExercises() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
        if (!stored) return [];
        const map = JSON.parse(stored);
        const unique = [];
        const seenIds = new Set();
        Object.values(map).forEach(item => {
          if (item && item.title && !seenIds.has(item.id || `${item.subject}_${item.chapterId}_${item.exerciseId}`)) {
            seenIds.add(item.id || `${item.subject}_${item.chapterId}_${item.exerciseId}`);
            unique.push(item);
          }
        });
        return unique;
      } catch (e) {
        return [];
      }
    },

    deleteExercise(subject, chapterId, exerciseId) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
        if (!stored) return false;
        const map = JSON.parse(stored);
        const directKey = makeExerciseKey(subject, chapterId, exerciseId);
        delete map[directKey];

        // Also delete matching aliases
        const normSubject = normalizeStr(subject);
        const normChapter = normalizeStr(chapterId);
        const normEx = normalizeStr(exerciseId);
        for (const [k, item] of Object.entries(map)) {
          if (item && normalizeStr(item.subject) === normSubject &&
              normalizeStr(item.chapterId) === normChapter &&
              normalizeStr(item.exerciseId) === normEx) {
            delete map[k];
          }
        }
        localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(map));

        // Supabase deletion
        if (window.supabaseClient && window.authService?.isCloudConnected && window.authService.isCloudConnected()) {
          window.supabaseClient.from('vault_exercises').delete().eq('id', directKey).then(() => {}).catch(() => {});
        }
        return true;
      } catch (e) {
        return false;
      }
    },

    // --------------------------------------------------------------------------
    // Theory Notes CRUD
    // --------------------------------------------------------------------------
    async saveTheoryNotes(theoryInput) {
      if (!theoryInput || !theoryInput.subject || !theoryInput.chapterId || !theoryInput.pdfUrl) {
        return { ok: false, error: 'subject, chapterId, and pdfUrl are required' };
      }

      const key = makeTheoryKey(theoryInput.subject, theoryInput.chapterId);
      const theoryRecord = {
        id: key,
        subject: theoryInput.subject.toLowerCase(),
        chapterId: theoryInput.chapterId,
        chapterName: theoryInput.chapterName || '',
        title: theoryInput.title || `${theoryInput.chapterId} Theory Notes`,
        pdfUrl: theoryInput.pdfUrl,
        fileName: theoryInput.fileName || 'Theory_Notes.pdf',
        fileSizeBytes: theoryInput.fileSizeBytes || (theoryInput.pdfUrl.length * 0.75),
        updatedAt: new Date().toISOString()
      };

      try {
        const stored = localStorage.getItem(STORAGE_KEY_THEORY);
        const map = stored ? JSON.parse(stored) : {};
        map[key] = theoryRecord;
        localStorage.setItem(STORAGE_KEY_THEORY, JSON.stringify(map));
      } catch (e) {
        console.warn('[vaultStorage] Failed to save theory notes locally:', e);
      }

      // Supabase Cloud sync
      if (window.supabaseClient && window.authService?.isCloudConnected && window.authService.isCloudConnected()) {
        try {
          await window.supabaseClient.from('vault_theory_notes').upsert({
            id: key,
            subject: theoryRecord.subject,
            chapter_id: theoryRecord.chapterId,
            chapter_name: theoryRecord.chapterName,
            title: theoryRecord.title,
            pdf_url: theoryRecord.pdfUrl,
            file_name: theoryRecord.fileName,
            file_size_bytes: Math.round(theoryRecord.fileSizeBytes),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        } catch (err) {
          console.warn('[vaultStorage] Supabase theory notes sync error:', err);
        }
      }

      return { ok: true, key, theory: theoryRecord };
    },

    getTheoryNotes(subject, chapterId) {
      if (!subject || !chapterId) return null;
      try {
        const normSubject = normalizeStr(subject);
        const normChapter = normalizeStr(chapterId);

        // Built-in Kinematics C4 Theory Notes
        if (normSubject === 'physics' && (normChapter === 'c4' || normChapter === 'c04')) {
          return {
            id: makeTheoryKey('physics', 'C4'),
            subject: 'physics',
            chapterId: 'C4',
            chapterName: 'Kinematics',
            title: 'C4 - Kinematics Theory Notes (49 Pages)',
            pdfUrl: '/resources/physics/c04-kinematics/Kinematics_Theory_Clean.pdf',
            fileName: 'Kinematics_Theory_Clean.pdf',
            fileSizeBytes: 4594238,
            pageCount: 49,
            status: 'ready',
            updatedAt: new Date().toISOString()
          };
        }

        const stored = localStorage.getItem(STORAGE_KEY_THEORY);
        if (!stored) return null;
        const map = JSON.parse(stored);
        const key = makeTheoryKey(subject, chapterId);
        if (map[key]) return map[key];

        // Flexible search
        for (const item of Object.values(map)) {
          if (item && normalizeStr(item.subject) === normSubject &&
             (normalizeStr(item.chapterId) === normChapter ||
              normChapter.endsWith(normalizeStr(item.chapterId)) ||
              normalizeStr(item.chapterId).endsWith(normChapter))) {
            return item;
          }
        }
      } catch (e) {
        console.warn('[vaultStorage] Error reading theory notes:', e);
      }
      return null;
    },

    getAllTheoryNotes() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_THEORY);
        if (!stored) return [];
        const map = JSON.parse(stored);
        return Object.values(map);
      } catch (e) {
        return [];
      }
    },

    deleteTheoryNotes(subject, chapterId) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_THEORY);
        if (!stored) return false;
        const map = JSON.parse(stored);
        const key = makeTheoryKey(subject, chapterId);
        delete map[key];
        localStorage.setItem(STORAGE_KEY_THEORY, JSON.stringify(map));

        if (window.supabaseClient && window.authService?.isCloudConnected && window.authService.isCloudConnected()) {
          window.supabaseClient.from('vault_theory_notes').delete().eq('id', key).then(() => {}).catch(() => {});
        }
        return true;
      } catch (e) {
        return false;
      }
    },

    // --------------------------------------------------------------------------
    // Exercise Attempt Results & Analytics
    // --------------------------------------------------------------------------
    async saveExerciseAttempt(attempt) {
      if (!attempt) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({ ...attempt, submittedAt: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(list.slice(0, 100)));
      } catch (e) {}

      // Cloud sync
      if (window.supabaseClient && window.authService?.isCloudConnected && window.authService.isCloudConnected()) {
        try {
          await window.supabaseClient.from('physics_exercise_attempts').insert({
            chapter_code: attempt.chapterCode || 'C8',
            chapter_name: attempt.chapterName || '',
            exercise_id: attempt.exerciseId || '',
            exercise_title: attempt.exerciseTitle || '',
            target_exam: attempt.targetExam || 'Both',
            total_questions: attempt.totalQuestions || 0,
            answered_count: attempt.answeredCount || 0,
            obtained_marks: attempt.score || 0,
            total_marks: attempt.totalMarks || 0,
            percentage: attempt.percentage || 0,
            accuracy: attempt.accuracy || 0,
            time_spent_seconds: attempt.timeSpentSeconds || 0,
            responses: attempt.responses || {},
            submitted_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn('[vaultStorage] Failed to sync exercise attempt:', err);
        }
      }
    },

    getSampleTemplate() {
      return JSON.parse(JSON.stringify(SEED_ROTATIONAL_MOTION_EX1));
    }
  };

  // Initialize seed immediately
  vaultStorage.init();

  // Expose globally
  window.vaultStorage = vaultStorage;

  // CommonJS export if in node
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = vaultStorage;
  }
})();
