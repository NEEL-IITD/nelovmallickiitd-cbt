import { z } from 'zod';

// ==============================================================================
// Input Validation (Zod), XSS Sanitization, SSRF URL Hygiene & Rate Limiting
// ==============================================================================

const BLOCKED_PRIVATE_HOSTS = /^(?:localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|\[::1\])/i;

/**
 * Escapes all raw HTML while preserving only safe inline chemistry sub/sup/bold tags
 * used across PTM syllabi and math explanations. Blocks <script>, event handlers, etc.
 */
export function sanitizeRichMathHtml(rawText: string): string {
  if (!rawText) return '';
  let escaped = String(rawText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Re-enable strictly parameterless inline chemistry tags (<sub>, <sup>, <b>)
  escaped = escaped
    .replace(/&lt;sub&gt;/gi, '<sub>')
    .replace(/&lt;\/sub&gt;/gi, '</sub>')
    .replace(/&lt;sup&gt;/gi, '<sup>')
    .replace(/&lt;\/sup&gt;/gi, '</sup>')
    .replace(/&lt;b&gt;/gi, '<b>')
    .replace(/&lt;\/b&gt;/gi, '</b>');

  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-zinc-100">$1</strong>')
    .replace(/\n\n/g, '<div class="h-2.5"></div>')
    .replace(/\n/g, '<br/>');
}

export function isSafePdfUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('..')) {
    return true;
  }
  if (/^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return false;
    if (BLOCKED_PRIVATE_HOSTS.test(parsed.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

export function isSafeImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/images/') && !trimmed.includes('..')) {
    return true;
  }
  if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return false;
    if (BLOCKED_PRIVATE_HOSTS.test(parsed.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUploadFilename(name: string): string {
  const base = String(name || 'document.pdf').replace(/[/\\]/g, '_').replace(/\.\.+/g, '.');
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
  return cleaned || 'upload.pdf';
}

export async function verifyPdfMagicBytes(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 8);
    const buf = new Uint8Array(await slice.arrayBuffer());
    // Must start with ASCII "%PDF-"
    return buf.length >= 5 &&
      buf[0] === 0x25 &&
      buf[1] === 0x50 &&
      buf[2] === 0x44 &&
      buf[3] === 0x46 &&
      buf[4] === 0x2d;
  } catch {
    return false;
  }
}

export const dailyGoalSchema = z.number().int().min(1).max(500);
export const topicSchema = z.string().trim().min(1, 'Topic cannot be empty').max(200, 'Topic is too long (max 200 chars)');
export const personalNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subject: z.string().trim().min(1).max(60),
  body: z.string().trim().min(1).max(4000),
});
export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  targetExam: z.enum(['JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both']),
  dailyQuestionGoal: dailyGoalSchema,
});
export const errorReportSchema = z.object({
  testId: z.string().trim().min(1).max(80),
  issueType: z.string().trim().min(1).max(120),
  description: z.string().trim().min(5, 'Please provide at least 5 characters').max(2000, 'Maximum 2000 characters allowed'),
});

const TRIVIAL_PASSWORDS = new Set([
  'password', '12345678', '123456789', '1234567890',
  '00000000', '11111111', 'qwertyui', 'qwerty123', 'abc12345'
]);

export function validateStrongPassword(password: string): string | null {
  const pw = String(password || '');
  if (pw.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (
    TRIVIAL_PASSWORDS.has(pw.toLowerCase()) ||
    /^(.)\1+$/.test(pw) ||
    !(/[A-Za-z]/.test(pw) && /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw))
  ) {
    return 'Please choose a stronger password using at least 8 characters with letters and a number or symbol.';
  }
  return null;
}

export function sanitizeHashRedirect(rawHash: string | undefined | null): string {
  const raw = String(rawHash || '').trim();
  if (!raw || !raw.startsWith('#/') || /[\r\n<>"'`\\]/.test(raw) || raw.toLowerCase().includes('javascript:')) {
    return '#/';
  }
  return raw;
}

export function canonicalizeLeaderboardTestId(rawId: string | undefined | null): string {
  const s = String(rawId || '').trim().toLowerCase();
  if (!s) return 'jee-advanced-pta-04';
  const mPtm = s.match(/^(?:jee-mains-)?ptm[-_\s]?0*(\d+)$/i) || s.match(/ptm[-_\s]?0*(\d+)/i);
  if (mPtm) {
    return `jee-mains-ptm-${String(parseInt(mPtm[1], 10)).padStart(2, '0')}`;
  }
  const mPta = s.match(/^(?:jee-advanced-)?pta[-_\s]?0*(\d+)$/i) || s.match(/pta[-_\s]?0*(\d+)/i);
  if (mPta) {
    return `jee-advanced-pta-${String(parseInt(mPta[1], 10)).padStart(2, '0')}`;
  }
  return s;
}
export const vaultQuestionSchema = z.object({
  id: z.union([z.string().min(1).max(64), z.number()]),
  type: z.enum(['single_correct', 'multi_correct', 'numerical', 'subjective', 'conceptual_flashcard']),
  question: z.string().trim().min(1).max(10000),
  options: z.array(z.string().max(4000)).optional(),
  correctAnswer: z.any().optional(),
  solution: z.string().max(15000).optional(),
  answer: z.string().max(15000).optional(),
  images: z.array(z.string().refine(isSafeImageUrl, 'Unsafe image URL')).optional(),
});
export const vaultExerciseSchema = z.object({
  subject: z.enum(['physics', 'chemistry', 'mathematics']),
  chapterId: z.string().trim().min(1).max(64),
  exerciseId: z.string().trim().min(1).max(64),
  title: z.string().trim().min(1).max(200),
  durationMinutes: z.number().min(1).max(300).optional(),
  questions: z.array(vaultQuestionSchema).min(1).max(300),
});

export function checkClientRateLimit(bucketKey: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  if (typeof window === 'undefined') return { allowed: true, retryAfterSec: 0 };
  const storageKey = `nelov_rl_${bucketKey}`;
  const now = Date.now();
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: number[] = raw ? JSON.parse(raw) : [];
    const active = parsed.filter((ts) => typeof ts === 'number' && now - ts < windowMs);
    if (active.length >= maxRequests) {
      const oldest = Math.min(...active);
      const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
      return { allowed: false, retryAfterSec };
    }
    active.push(now);
    localStorage.setItem(storageKey, JSON.stringify(active));
    return { allowed: true, retryAfterSec: 0 };
  } catch {
    return { allowed: true, retryAfterSec: 0 };
  }
}
