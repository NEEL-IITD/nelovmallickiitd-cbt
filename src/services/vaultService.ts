// ==============================================================================
// NelovMallickIITD · Vault Service (TypeScript Engine for Exercises & Theory Notes)
// Standardized JEE Exercise JSON Schema & PDF Document Management
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  VaultExercise,
  VaultTheoryNote,
  VaultValidationResult,
  VaultSubjectType
} from '../types';

const STORAGE_KEY_EXERCISES = 'nelov_vault_exercises';
const STORAGE_KEY_THEORY = 'nelov_vault_theory';
export const STORAGE_KEY_ATTEMPTS = 'nelov_vault_exercise_attempts';

// Seed data from Nelov Mallick: Physics C08 Rotational Motion - Exercise 1
export const SEED_ROTATIONAL_MOTION_EX1: VaultExercise = {
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

function normalizeStr(str: string): string {
  if (!str) return '';
  return String(str).toLowerCase().trim().replace(/[\s\-_]/g, '').replace(/([a-z])0+(\d+)/g, '$1$2');
}

function makeExerciseKey(subject: string, chapterId: string, exerciseId: string): string {
  return `${normalizeStr(subject)}_${normalizeStr(chapterId)}_${normalizeStr(exerciseId)}`;
}

function makeTheoryKey(subject: string, chapterId: string): string {
  return `${normalizeStr(subject)}_${normalizeStr(chapterId)}`;
}

class VaultService {
  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
      const exercisesMap = stored ? JSON.parse(stored) : {};

      const seedKey = makeExerciseKey(
        SEED_ROTATIONAL_MOTION_EX1.subject,
        SEED_ROTATIONAL_MOTION_EX1.chapterId,
        SEED_ROTATIONAL_MOTION_EX1.exerciseId
      );

      if (!exercisesMap[seedKey]) {
        exercisesMap[seedKey] = {
          ...SEED_ROTATIONAL_MOTION_EX1,
          totalQuestions: SEED_ROTATIONAL_MOTION_EX1.questions.length,
          totalMarks: SEED_ROTATIONAL_MOTION_EX1.questions.length * 4,
          updatedAt: new Date().toISOString()
        };
        // Add common lookup aliases
        const alias1 = makeExerciseKey('physics', 'C8', 'c8-ex1');
        const alias2 = makeExerciseKey('physics', 'c8', 'ex-1');
        exercisesMap[alias1] = exercisesMap[seedKey];
        exercisesMap[alias2] = exercisesMap[seedKey];

        localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(exercisesMap));
      }
    } catch (e) {
      console.warn('[VaultService] Seed initialization warning:', e);
    }
  }

  public validateExerciseJson(rawInput: any): VaultValidationResult {
    let data = rawInput;
    if (typeof rawInput === 'string') {
      try {
        data = JSON.parse(rawInput);
      } catch (err: any) {
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

    const errors: string[] = [];
    const validSubjects: VaultSubjectType[] = ['physics', 'chemistry', 'mathematics'];
    const subject = String(data.subject || '').toLowerCase() as VaultSubjectType;

    if (!subject || !validSubjects.includes(subject)) {
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
      data.questions.forEach((q: any, idx: number) => {
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
            errors.push(`Question #${qNum}: missing "correctAnswer" index`);
          }
        } else if (q.type === 'multi_correct') {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            errors.push(`Question #${qNum}: "options" array with at least 2 choices is required for multi_correct`);
          }
          if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) {
            errors.push(`Question #${qNum}: "correctAnswer" must be an array of option indices`);
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
    const singleCorrectCount = questions.filter((q: any) => q.type === 'single_correct').length;
    const multiCorrectCount = questions.filter((q: any) => q.type === 'multi_correct').length;
    const numericalCount = questions.filter((q: any) => q.type === 'numerical').length;
    const totalMarks = questions.reduce(
      (sum: number, q: any) => sum + (q.marking?.correct || defaultMarking.correct || 4),
      0
    );

    const summary = {
      totalQuestions: questions.length,
      singleCorrectCount,
      multiCorrectCount,
      numericalCount,
      totalMarks,
      durationMinutes,
      subject,
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
        subject,
        durationMinutes,
        defaultMarking,
        totalQuestions: questions.length,
        totalMarks,
        updatedAt: new Date().toISOString()
      } : null
    };
  }

  public async saveExercise(
    exerciseInput: any
  ): Promise<{ ok: boolean; key?: string; exercise?: VaultExercise; error?: string }> {
    const val = this.validateExerciseJson(exerciseInput);
    if (!val.isValid || !val.data) {
      return { ok: false, error: val.errors.join('; ') };
    }

    const exerciseData = val.data;
    const primaryKey = makeExerciseKey(exerciseData.subject, exerciseData.chapterId, exerciseData.exerciseId);

    // Save to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
      const map = stored ? JSON.parse(stored) : {};
      map[primaryKey] = exerciseData;

      // Also set aliases
      const altChapter = normalizeStr(exerciseData.chapterId);
      const altEx = normalizeStr(exerciseData.exerciseId);
      map[`${normalizeStr(exerciseData.subject)}_${altChapter}_${altEx}`] = exerciseData;

      localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(map));
    } catch (e) {
      console.warn('[VaultService] Failed to save exercise locally:', e);
    }

    // Cloud sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('vault_exercises').upsert(
          {
            id: primaryKey,
            subject: exerciseData.subject.toLowerCase(),
            chapter_id: exerciseData.chapterId,
            chapter_name: exerciseData.chapterName || exerciseData.title,
            exercise_id: exerciseData.exerciseId,
            title: exerciseData.title,
            duration_minutes: exerciseData.durationMinutes,
            default_marking: exerciseData.defaultMarking,
            questions: exerciseData.questions,
            total_questions: exerciseData.totalQuestions || exerciseData.questions.length,
            total_marks: exerciseData.totalMarks || exerciseData.questions.length * 4,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );
      } catch (err) {
        console.warn('[VaultService] Supabase cloud upsert warning:', err);
      }
    }

    return { ok: true, key: primaryKey, exercise: exerciseData };
  }

  public getExercise(subject: string, chapterId: string, exerciseId: string): VaultExercise | null {
    if (!subject || !chapterId || !exerciseId) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
      if (!stored) return null;
      const map = JSON.parse(stored);

      const directKey = makeExerciseKey(subject, chapterId, exerciseId);
      if (map[directKey]) return map[directKey];

      const normSubject = normalizeStr(subject);
      const normChapter = normalizeStr(chapterId);
      const normEx = normalizeStr(exerciseId);

      for (const item of Object.values(map) as any[]) {
        if (!item) continue;
        const sMatch = normalizeStr(item.subject) === normSubject;
        const cMatch =
          normalizeStr(item.chapterId) === normChapter ||
          normChapter.endsWith(normalizeStr(item.chapterId)) ||
          normalizeStr(item.chapterId).endsWith(normChapter);
        const eMatch =
          normalizeStr(item.exerciseId) === normEx ||
          normEx.endsWith(normalizeStr(item.exerciseId)) ||
          normalizeStr(item.exerciseId).endsWith(normEx);

        if (sMatch && cMatch && eMatch) {
          return item as VaultExercise;
        }
      }
    } catch (e) {
      console.warn('[VaultService] Error reading exercise:', e);
    }
    return null;
  }

  public getAllExercises(): VaultExercise[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
      if (!stored) return [];
      const map = JSON.parse(stored);
      const unique: VaultExercise[] = [];
      const seenIds = new Set<string>();

      Object.values(map).forEach((item: any) => {
        if (item && item.title) {
          const key = `${item.subject}_${item.chapterId}_${item.exerciseId}`;
          if (!seenIds.has(key)) {
            seenIds.add(key);
            unique.push(item as VaultExercise);
          }
        }
      });
      return unique;
    } catch (e) {
      return [];
    }
  }

  public deleteExercise(subject: string, chapterId: string, exerciseId: string): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
      if (!stored) return false;
      const map = JSON.parse(stored);
      const directKey = makeExerciseKey(subject, chapterId, exerciseId);
      delete map[directKey];

      const normSubject = normalizeStr(subject);
      const normChapter = normalizeStr(chapterId);
      const normEx = normalizeStr(exerciseId);

      for (const [k, item] of Object.entries(map) as any[]) {
        if (
          item &&
          normalizeStr(item.subject) === normSubject &&
          normalizeStr(item.chapterId) === normChapter &&
          normalizeStr(item.exerciseId) === normEx
        ) {
          delete map[k];
        }
      }

      localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(map));

      if (isSupabaseConfigured && supabase) {
        try {
          supabase
            .from('vault_exercises')
            .delete()
            .eq('id', directKey);
        } catch (e) {}
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // ----------------------------------------------------------------------------
  // Theory Notes
  // ----------------------------------------------------------------------------
  public async saveTheoryNotes(
    theoryInput: any
  ): Promise<{ ok: boolean; key?: string; theory?: VaultTheoryNote; error?: string }> {
    if (!theoryInput || !theoryInput.subject || !theoryInput.chapterId || !theoryInput.pdfUrl) {
      return { ok: false, error: 'subject, chapterId, and pdfUrl are required' };
    }

    const key = makeTheoryKey(theoryInput.subject, theoryInput.chapterId);
    const theoryRecord: VaultTheoryNote = {
      id: key,
      subject: theoryInput.subject.toLowerCase() as VaultSubjectType,
      chapterId: theoryInput.chapterId,
      chapterName: theoryInput.chapterName || '',
      title: theoryInput.title || `${theoryInput.chapterId} Theory Notes`,
      pdfUrl: theoryInput.pdfUrl,
      fileName: theoryInput.fileName || 'Theory_Notes.pdf',
      fileSizeBytes: theoryInput.fileSizeBytes || Math.round(theoryInput.pdfUrl.length * 0.75),
      updatedAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEORY);
      const map = stored ? JSON.parse(stored) : {};
      map[key] = theoryRecord;
      localStorage.setItem(STORAGE_KEY_THEORY, JSON.stringify(map));
    } catch (e) {
      console.warn('[VaultService] Failed to save theory notes locally:', e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('vault_theory_notes').upsert(
          {
            id: key,
            subject: theoryRecord.subject,
            chapter_id: theoryRecord.chapterId,
            chapter_name: theoryRecord.chapterName,
            title: theoryRecord.title,
            pdf_url: theoryRecord.pdfUrl,
            file_name: theoryRecord.fileName,
            file_size_bytes: Math.round(theoryRecord.fileSizeBytes),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );
      } catch (err) {
        console.warn('[VaultService] Supabase theory notes sync error:', err);
      }
    }

    return { ok: true, key, theory: theoryRecord };
  }

  public getTheoryNotes(subject: string, chapterId: string): VaultTheoryNote | null {
    if (!subject || !chapterId) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEORY);
      if (!stored) return null;
      const map = JSON.parse(stored);
      const key = makeTheoryKey(subject, chapterId);
      if (map[key]) return map[key] as VaultTheoryNote;

      const normSubject = normalizeStr(subject);
      const normChapter = normalizeStr(chapterId);

      for (const item of Object.values(map) as any[]) {
        if (
          item &&
          normalizeStr(item.subject) === normSubject &&
          (normalizeStr(item.chapterId) === normChapter ||
            normChapter.endsWith(normalizeStr(item.chapterId)) ||
            normalizeStr(item.chapterId).endsWith(normChapter))
        ) {
          return item as VaultTheoryNote;
        }
      }
    } catch (e) {
      console.warn('[VaultService] Error reading theory notes:', e);
    }
    return null;
  }

  public getAllTheoryNotes(): VaultTheoryNote[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEORY);
      if (!stored) return [];
      const map = JSON.parse(stored);
      return Object.values(map) as VaultTheoryNote[];
    } catch (e) {
      return [];
    }
  }

  public deleteTheoryNotes(subject: string, chapterId: string): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEORY);
      if (!stored) return false;
      const map = JSON.parse(stored);
      const key = makeTheoryKey(subject, chapterId);
      delete map[key];
      localStorage.setItem(STORAGE_KEY_THEORY, JSON.stringify(map));

      if (isSupabaseConfigured && supabase) {
        try {
          supabase
            .from('vault_theory_notes')
            .delete()
            .eq('id', key);
        } catch (e) {}
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public getSampleTemplate(): VaultExercise {
    return JSON.parse(JSON.stringify(SEED_ROTATIONAL_MOTION_EX1));
  }
}

export const vaultService = new VaultService();
