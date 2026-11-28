// ==============================================================================
// NelovMallickIITD CBT Platform - Authentication Service
// Supports Supabase Auth (Gmail OAuth, Email, & Name + Mandatory Contact Number)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, TargetExam, UserRole, AuthMethod } from '../types';
import { cloudSyncService } from './cloudSyncService';
import { checkClientRateLimit, isSafeImageUrl, sanitizeHashRedirect, validateStrongPassword } from '../utils/validationSchemas';
export type { User, TargetExam, UserRole, AuthMethod };

export interface StoredUser extends User {
  passwordHash: string;
}

export interface SignUpParams {
  name: string;
  email?: string;
  contactNumber?: string;
  password: string;
  targetExam?: TargetExam;
  authMethod?: AuthMethod;
  acceptedTermsAt?: string;
  acceptedTermsVersion?: string;
  parentalConsentConfirmed?: boolean;
}

export interface LogInParams {
  email?: string;
  contactNumber?: string;
  password: string;
}

const USERS_STORAGE_KEY = 'nelov_users_store';
const SESSION_STORAGE_KEY = 'nelov_active_session';
const REDIRECT_STORAGE_KEY = 'nelov_auth_redirect';

export const ADMIN_EMAILS = [
  'mallicknelov@gmail.com'
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(normalized);
}

export function isGmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith('@gmail.com');
}

export function cleanPhoneDigits(raw: string): string {
  let cleaned = (raw || '').replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

export function isValidIndianPhone(raw: string): boolean {
  const digits = cleanPhoneDigits(raw);
  return /^[6-9]\d{9}$/.test(digits);
}

export function formatIndianPhone(raw: string): string {
  const digits = cleanPhoneDigits(raw);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return raw ? raw.trim() : '';
}

export function getSyntheticPhoneEmail(phoneDigits: string): string {
  const digits = cleanPhoneDigits(phoneDigits);
  return `91${digits}@phone.nelovportal.local`;
}

async function legacySha256(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

/**
 * Hash password securely using Web Crypto PBKDF2-SHA256 (120,000 iterations + 16-byte random salt).
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const salt = new Uint8Array(16);
      window.crypto.getRandomValues(salt);
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
      );
      const derivedBits = await window.crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
        keyMaterial,
        256
      );
      const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
      const hashHex = Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, '0')).join('');
      return `pbkdf2$${saltHex}$${hashHex}`;
    } catch (e) {
      console.warn('Web Crypto PBKDF2 failed, trying SHA-256 fallback', e);
    }
  }
  return await legacySha256(password);
}

export async function verifyPasswordHash(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !password) return false;
  if (storedHash.startsWith('pbkdf2$') && typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const saltMatches = parts[1].match(/.{1,2}/g);
    if (!saltMatches) return false;
    const salt = new Uint8Array(saltMatches.map((h) => parseInt(h, 16)));
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derivedBits = await window.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
      keyMaterial,
      256
    );
    const computedHex = Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, '0')).join('');
    if (computedHex.length !== parts[2].length) return false;
    let diff = 0;
    for (let i = 0; i < computedHex.length; i++) {
      diff |= computedHex.charCodeAt(i) ^ parts[2].charCodeAt(i);
    }
    return diff === 0;
  }
  const sha = await legacySha256(password);
  return Boolean(sha && storedHash === sha);
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}
}

export const authService = {
  isCloudConnected(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  getAllUsers(): StoredUser[] {
    return getStoredUsers();
  },

  /**
   * Register a new student account (100% Free Forever)
   * Supports:
   * 1. Name + Contact Number (no Gmail required)
   * 2. Gmail / Google Login (contact number optional)
   * 3. Non-Gmail Email (contact number strictly mandatory)
   */
  async signUp({
    name,
    email,
    contactNumber,
    password,
    targetExam = 'JEE Advanced',
    acceptedTermsAt,
    acceptedTermsVersion,
    parentalConsentConfirmed
  }: SignUpParams): Promise<User> {
    const trimmedName = (name || '').trim().slice(0, 100);
    if (trimmedName.length < 2) {
      throw new Error('Please enter your full name (at least 2 characters).');
    }

    const passwordError = validateStrongPassword(password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    const trimmedEmail = (email || '').trim().toLowerCase();
    const hasEmail = Boolean(trimmedEmail);
    const hasContact = Boolean(contactNumber && contactNumber.trim());

    let formattedContact: string | null = null;
    let authMethod: AuthMethod = 'gmail';
    let authEmail: string;

    // Validate email format if provided
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    // Contact number validation if provided
    if (hasContact) {
      if (!isValidIndianPhone(contactNumber!)) {
        throw new Error('Please enter a valid 10-digit mobile number (e.g. 98765 43210).');
      }
      formattedContact = formatIndianPhone(contactNumber!);
    }

    // Determine Mode:
    if (!hasEmail) {
      if (!hasContact) {
        throw new Error('Please enter your email or 10-digit contact number.');
      }
      authMethod = 'phone';
      authEmail = getSyntheticPhoneEmail(contactNumber!);
    } else if (isGmail(trimmedEmail)) {
      authMethod = 'gmail';
      authEmail = trimmedEmail;
    } else {
      authMethod = hasContact ? 'email_with_phone' : 'email';
      authEmail = trimmedEmail;
    }

    const resolvedTargetExam: TargetExam = targetExam || 'JEE 2027';
    const compatAuthMethod = !hasEmail ? 'phone' : (hasContact && !isGmail(trimmedEmail) ? 'email_with_phone' : 'gmail');
    const compatTargetExam = resolvedTargetExam === 'JEE 2027' ? 'Both' : resolvedTargetExam;

    // 1. Supabase Cloud Sign Up
    if (this.isCloudConnected() && supabase) {
      if (formattedContact) {
        try {
          const { data: existingPhone } = await supabase
            .from('profiles')
            .select('id')
            .eq('contact_number', formattedContact)
            .maybeSingle();

          if (existingPhone) {
            throw new Error('This contact number is already registered. Please log in instead.');
          }
        } catch (err: any) {
          if (err.message && err.message.includes('already registered')) {
            throw err;
          }
        }
      }

      const termsTimestamp = acceptedTermsAt || new Date().toISOString();
      const termsVer = acceptedTermsVersion || '2026-11';
      const parentalBool = Boolean(parentalConsentConfirmed);

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
          data: {
            full_name: trimmedName,
            contact_number: formattedContact,
            auth_method: compatAuthMethod,
            target_exam: compatTargetExam,
            preferred_exam: resolvedTargetExam,
            accepted_terms_at: termsTimestamp,
            accepted_terms_version: termsVer,
            parental_consent_confirmed: parentalBool
          }
        }
      });

      if (error) {
        const msgLower = String(error.message || '').toLowerCase();
        if (msgLower.includes('already registered') || msgLower.includes('already exists') || msgLower.includes('already in use')) {
          if (authMethod === 'phone') {
            throw new Error('This contact number is already registered. Please log in instead.');
          } else {
            throw new Error('An account with this email already exists. Please log in (or use "Forgot Password?" / "Continue with Google" if you registered earlier).');
          }
        }
        if (error.status === 429 || msgLower.includes('rate limit') || msgLower.includes('too many')) {
          throw new Error('Too many signup attempts right now. Please wait a minute and try again.');
        }
        if (msgLower.includes('database error saving new user')) {
          throw new Error('Could not create your profile on server right now. Please try again in a moment.');
        }
        throw new Error(error.message || 'Signup failed. Please try again.');
      }

      if (!data.user) {
        throw new Error('Signup failed. Please try again.');
      }

      let verifiedRole: UserRole = 'student';
      try {
        if (data.session) {
          const { data: profRow } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();
          if (profRow?.role === 'admin') verifiedRole = 'admin';
        }
      } catch {}

      const user: User = {
        id: data.user.id,
        name: trimmedName,
        email: authMethod === 'phone' ? null : trimmedEmail,
        contactNumber: formattedContact,
        authMethod,
        targetExam: resolvedTargetExam,
        dailyQuestionGoal: 30,
        currentStreak: 0,
        avatarUrl: data.user.user_metadata?.avatar_url || null,
        needsEmailConfirmation: !data.session,
        role: verifiedRole,
        acceptedTermsAt: termsTimestamp,
        acceptedTermsVersion: termsVer,
        parentalConsentConfirmed: parentalBool,
        createdAt: data.user.created_at || new Date().toISOString()
      };

      if (data.session && typeof window !== 'undefined') {
        localStorage.removeItem('nelov_guest_mode');
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
        cloudSyncService.hydrateAndMigrateOnLogin(user).catch(() => {});
      }
      return user;
    }

    // 2. Local Fallback Mode
    const users = getStoredUsers();

    if (hasEmail && users.some((u) => u.email === trimmedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }
    if (formattedContact && users.some((u) => u.contactNumber === formattedContact)) {
      throw new Error('This contact number is already registered. Please log in instead.');
    }

    const passwordHash = await hashPassword(password);
    const role: UserRole = 'student';

    const newUser: StoredUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      email: authMethod === 'phone' ? null : trimmedEmail,
      contactNumber: formattedContact,
      authMethod,
      targetExam: resolvedTargetExam,
      dailyQuestionGoal: 30,
      currentStreak: 0,
      role,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    users.push(newUser);
    saveStoredUsers(users);

    const user: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      contactNumber: newUser.contactNumber,
      authMethod: newUser.authMethod,
      targetExam: newUser.targetExam,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Log into student account via Email OR Contact Number
   */
  async logIn({ email, contactNumber, password }: LogInParams): Promise<User> {
    if (!password) {
      throw new Error('Please enter your password / PIN.');
    }

    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedContact = (contactNumber || '').trim();

    if (!trimmedEmail && !trimmedContact) {
      throw new Error('Please enter your Email or 10-digit Contact Number.');
    }

    let authEmail: string;
    let isPhoneLogin = false;
    let formattedPhone: string | null = null;

    if (trimmedContact) {
      if (!isValidIndianPhone(trimmedContact)) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      authEmail = getSyntheticPhoneEmail(trimmedContact);
      isPhoneLogin = true;
      formattedPhone = formatIndianPhone(trimmedContact);
    } else {
      authEmail = trimmedEmail;
    }

    // 1. Supabase Cloud Auth
    if (this.isCloudConnected() && supabase) {
      if (!isPhoneLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) {
        throw new Error('Please enter a valid email address (or switch to Name + Contact tab to sign in with your phone number).');
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password
      });

      if (error) {
        const msgLower = String(error.message || '').toLowerCase();
        const codeLower = String((error as any).code || '').toLowerCase();
        if (isPhoneLogin) {
          throw new Error('Incorrect contact number or password/PIN. Check your digits and password, or register a free account.');
        }
        if (codeLower === 'email_not_confirmed' || msgLower.includes('email not confirmed')) {
          const unconfirmedErr: any = new Error(
            'Your email address is not confirmed yet. Check your inbox (and spam folder) for the confirmation link, or click "Resend Verification Email" below.'
          );
          unconfirmedErr.code = 'EMAIL_NOT_CONFIRMED';
          throw unconfirmedErr;
        }
        if (codeLower === 'invalid_credentials' || msgLower.includes('invalid login credentials') || msgLower.includes('invalid_credentials')) {
          const credErr: any = new Error(
            'Incorrect email or password. Tip: If you originally signed up with "Continue with Google", click "Continue with Google" above — or use "Forgot Password?" to create a portal password.'
          );
          credErr.code = 'INVALID_CREDENTIALS';
          throw credErr;
        }
        if (error.status === 429 || msgLower.includes('rate limit') || msgLower.includes('too many')) {
          throw new Error('Too many login attempts right now. Please wait a minute and try again.');
        }
        throw new Error(error.message || 'Incorrect email or password.');
      }

      if (!data.user) {
        throw new Error('Login failed. Please check your credentials.');
      }

      // Fetch profile row strictly from Supabase profiles.role
      let role: UserRole = 'student';
      let fullName = data.user.user_metadata?.full_name || (isPhoneLogin ? 'Student Aspirant' : authEmail.split('@')[0]);
      let targetExam: TargetExam = data.user.user_metadata?.target_exam || 'JEE 2027';
      let userContact: string | null = formattedPhone || data.user.user_metadata?.contact_number || null;
      let authMethod: AuthMethod = isPhoneLogin ? 'phone' : (isGmail(authEmail) ? 'gmail' : 'email');
      let displayEmail: string | null = isPhoneLogin ? null : authEmail;
      let avatarUrl: string | null = data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null;
      let dailyQuestionGoal = 30;
      let currentStreak = 0;
      let acceptedTermsAt: string | null = data.user.user_metadata?.accepted_terms_at || null;
      let acceptedTermsVersion: string | null = data.user.user_metadata?.accepted_terms_version || null;
      let parentalConsentConfirmed: boolean = Boolean(data.user.user_metadata?.parental_consent_confirmed);

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile) {
          role = profile.role === 'admin' ? 'admin' : 'student';
          if (profile.full_name) fullName = profile.full_name;
          if (profile.contact_number) userContact = profile.contact_number;
          if (profile.auth_method) authMethod = profile.auth_method as AuthMethod;
          if (profile.target_exam) {
            targetExam = (profile.target_exam === 'Both' && data.user.user_metadata?.preferred_exam)
              ? (data.user.user_metadata.preferred_exam as TargetExam)
              : (profile.target_exam as TargetExam);
          }
          if (profile.avatar_url) avatarUrl = profile.avatar_url;
          if (profile.daily_question_goal) dailyQuestionGoal = Number(profile.daily_question_goal) || 30;
          if (profile.current_streak !== undefined && profile.current_streak !== null) currentStreak = Number(profile.current_streak) || 0;
          if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
          if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
          if (profile.parental_consent_confirmed) parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
          if (profile.email && !profile.email.includes('@phone.nelovportal.local')) {
            displayEmail = profile.email;
          }
        } else if (data.user.user_metadata?.daily_question_goal) {
          dailyQuestionGoal = Number(data.user.user_metadata.daily_question_goal) || 30;
        }
      } catch (e) {
        console.warn('Could not fetch user profile details:', e);
      }

      const user: User = {
        id: data.user.id,
        name: fullName,
        email: displayEmail,
        contactNumber: userContact,
        authMethod,
        targetExam,
        avatarUrl,
        dailyQuestionGoal,
        currentStreak,
        role,
        acceptedTermsAt,
        acceptedTermsVersion,
        parentalConsentConfirmed,
        createdAt: data.user.created_at || new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.removeItem('nelov_guest_mode');
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
        cloudSyncService.hydrateAndMigrateOnLogin(user).catch(() => {});
      }
      return user;
    }

    // 2. Local Fallback Mode
    const rlLocal = checkClientRateLimit(`local_login_${isPhoneLogin ? formattedPhone : trimmedEmail}`, 5, 60 * 1000);
    if (!rlLocal.allowed) {
      throw new Error(`Too many login attempts. Please wait ${rlLocal.retryAfterSec}s before trying again.`);
    }
    const users = getStoredUsers();
    let userMatch: StoredUser | undefined;

    if (isPhoneLogin) {
      userMatch = users.find((u) => u.contactNumber === formattedPhone || cleanPhoneDigits(u.contactNumber || '') === cleanPhoneDigits(trimmedContact));
      if (!userMatch) {
        throw new Error('No registered account found with this contact number. Please sign up free.');
      }
    } else {
      userMatch = users.find((u) => u.email === trimmedEmail);
      if (!userMatch) {
        throw new Error('No registered account found with this email. Please sign up free.');
      }
    }

    const passwordValid = await verifyPasswordHash(password, userMatch.passwordHash);
    if (!passwordValid) {
      throw new Error('Incorrect password / PIN. Please try again.');
    }
    // Seamlessly upgrade legacy SHA-256 hash to salted PBKDF2-SHA256 on successful login
    if (!String(userMatch.passwordHash || '').startsWith('pbkdf2$')) {
      try {
        userMatch.passwordHash = await hashPassword(password);
        saveStoredUsers(users);
      } catch {}
    }

    const role: UserRole = (userMatch.role === 'admin' && isAdminEmail(userMatch.email)) ? 'admin' : 'student';

    const user: User = {
      id: userMatch.id,
      name: userMatch.name,
      email: userMatch.email,
      contactNumber: userMatch.contactNumber,
      authMethod: userMatch.authMethod,
      targetExam: userMatch.targetExam || 'JEE 2027',
      dailyQuestionGoal: userMatch.dailyQuestionGoal || 30,
      currentStreak: userMatch.currentStreak || 0,
      role,
      createdAt: userMatch.createdAt
    };

    if (typeof window !== 'undefined') {
      localStorage.removeItem('nelov_guest_mode');
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      cloudSyncService.migrateGuestLocalData(user.id);
    }
    return user;
  },

  /**
   * One-Click "Continue with Google" OAuth Login
   */
  async signInWithGoogle(redirectTo?: string): Promise<void> {
    const destination = sanitizeHashRedirect(redirectTo || window.location.hash || '#/');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(REDIRECT_STORAGE_KEY, destination);
    }

    if (this.isCloudConnected() && supabase) {
      const redirectUrl = window.location.origin + window.location.pathname;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) {
        throw new Error(error.message);
      }
    } else {
      // Local fallback mock Google Sign In
      const googleUser: User = {
        id: 'usr_google_' + Date.now().toString(36),
        name: 'Google Aspirant',
        email: 'aspirant@gmail.com',
        contactNumber: null,
        authMethod: 'google',
        targetExam: 'JEE Advanced',
        role: 'student',
        createdAt: new Date().toISOString()
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(googleUser));
        window.location.hash = destination;
      }
    }
  },

  /**
   * Get active logged-in user
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      // Ensure synthetic phone email is never exposed in cached session
      if (parsed.email && parsed.email.endsWith('@phone.nelovportal.local')) {
        parsed.email = null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  /**
   * Check if user has admin privileges
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') return false;
    if (this.isCloudConnected()) {
      return typeof user.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(user.id) && isAdminEmail(user.email);
    }
    return isAdminEmail(user.email);
  },

  /**
   * Log out active session
   */
  async logOut(): Promise<void> {
    if (this.isCloudConnected() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem('nelov_test_student_override');
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    }
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<void> {
    const rl = checkClientRateLimit('password_reset', 3, 5 * 60 * 1000);
    if (!rl.allowed) {
      throw new Error(`Please wait ${rl.retryAfterSec}s before requesting another reset email.`);
    }
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter your registered email address.');
    }

    if (this.isCloudConnected() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) {
        const msgLower = String(error.message || '').toLowerCase();
        if (error.status === 429 || msgLower.includes('rate limit') || msgLower.includes('too many')) {
          throw new Error('Too many reset emails requested. Please wait a few minutes and check your inbox/spam folder.');
        }
        throw new Error(error.message);
      }
      return;
    }

    throw new Error('Email password reset requires Supabase Cloud connection.');
  },

  async resendVerificationEmail(email: string): Promise<string> {
    const rl = checkClientRateLimit('resend_verification', 3, 5 * 60 * 1000);
    if (!rl.allowed) {
      throw new Error(`Please wait ${rl.retryAfterSec}s before requesting another verification email.`);
    }
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address first.');
    }
    if (!this.isCloudConnected() || !supabase) {
      throw new Error('Email verification requires Supabase Cloud connection.');
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: trimmedEmail,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
      }
    });
    if (error) {
      const msgLower = String(error.message || '').toLowerCase();
      if (error.status === 429 || msgLower.includes('rate limit') || msgLower.includes('too many')) {
        throw new Error('Please wait a minute before requesting another verification email.');
      }
      throw new Error(error.message || 'Could not resend verification email.');
    }
    return `Verification link resent to ${trimmedEmail}. Please check your inbox and spam folder.`;
  },

  async updatePassword(newPassword: string): Promise<void> {
    const pwErr = validateStrongPassword(newPassword);
    if (pwErr) {
      throw new Error(pwErr);
    }
    if (!this.isCloudConnected() || !supabase) {
      throw new Error('Updating password requires an active Supabase recovery session.');
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  },

  async updateProfile(updates: {
    name?: string;
    targetExam?: TargetExam;
    dailyQuestionGoal?: number;
    avatarUrl?: string | null;
  }): Promise<User> {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Sign in required to update profile settings.');
    const nextGoal = updates.dailyQuestionGoal !== undefined
      ? Math.max(1, Math.min(500, Math.round(Number(updates.dailyQuestionGoal) || 30)))
      : (current.dailyQuestionGoal || 30);
    const nextNameRaw = updates.name !== undefined ? String(updates.name || '').trim().slice(0, 100) : current.name;
    if (updates.name !== undefined && nextNameRaw.length < 2) {
      throw new Error('Display name must be at least 2 characters.');
    }
    const nextTargetExam = (updates.targetExam ? String(updates.targetExam).trim().slice(0, 50) : (current.targetExam || 'JEE 2027')) as TargetExam;
    const rawAvatar = updates.avatarUrl !== undefined ? updates.avatarUrl : (current.avatarUrl || null);
    let nextAvatar: string | null = null;
    if (rawAvatar) {
      const avStr = String(rawAvatar).trim();
      if (!isSafeImageUrl(avStr)) {
        throw new Error('Invalid or unsafe avatar URL.');
      }
      nextAvatar = avStr.slice(0, 200000);
    }

    const updatedUser: User = {
      ...current,
      name: nextNameRaw || current.name,
      targetExam: nextTargetExam,
      dailyQuestionGoal: nextGoal,
      avatarUrl: nextAvatar,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    if (this.isCloudConnected() && supabase && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(updatedUser.id)) {
      cloudSyncService.emitSyncStatus('saving', 'Updating profile');
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updatedUser.name,
            preferred_exam: updatedUser.targetExam,
            daily_question_goal: nextGoal,
          }
        });
      } catch {}
      const safeExam = updatedUser.targetExam === 'JEE 2027' ? 'Both' : updatedUser.targetExam;
      let { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.name,
          target_exam: updatedUser.targetExam,
          daily_question_goal: nextGoal,
          avatar_url: updatedUser.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);
      if (error && (error.code === '23514' || /target_exam|column|schema cache/i.test(error.message || ''))) {
        const retryRes = await supabase
          .from('profiles')
          .update({
            full_name: updatedUser.name,
            target_exam: safeExam
          })
          .eq('id', updatedUser.id);
        error = retryRes.error;
      }
      if (error) {
        cloudSyncService.emitSyncStatus('offline', error.message);
        throw new Error(error.message);
      }
      cloudSyncService.emitSyncStatus('saved', 'Profile updated');
    } else {
      const users = getStoredUsers();
      const idx = users.findIndex((u) => u.id === updatedUser.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: updatedUser.name, targetExam: updatedUser.targetExam, dailyQuestionGoal: nextGoal };
        saveStoredUsers(users);
      }
    }
    return updatedUser;
  },

  async continueAsGuest(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nelov_guest_mode', '1');
    }
    if (this.getCurrentUser()) {
      await this.logOut();
    }
  },

  /**
   * Set user role (admin utility in fallback mode)
   */
  setUserRole(userId: string, role: UserRole): void {
    const safeRole: UserRole = role === 'admin' ? 'student' : 'student';
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.role = isAdminEmail(currentUser.email) ? role : safeRole;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    }
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].role = isAdminEmail(users[idx].email) ? role : safeRole;
      saveStoredUsers(users);
    }
  },

  /**
   * Save legal terms consent timestamp (DPDP Act 2023) - Multi-Layer Resilient Persistence
   */
  async acceptTerms(version = '2026-11', parentalConsent = false): Promise<User | null> {
    const current = this.getCurrentUser();
    if (!current) return null;
    const now = new Date().toISOString();
    current.acceptedTermsAt = now;
    current.acceptedTermsVersion = version;
    current.parentalConsentConfirmed = parentalConsent;

    // 1. Immediate Local Storage & User Consent Cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`consent_v2026_11_${current.id}`, now);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(current));
      } catch (e) {
        console.warn('LocalStorage error in acceptTerms:', e);
      }
    }

    if (this.isCloudConnected() && supabase) {
      // 2. Step A: Supabase Auth user metadata update (always works without custom table migrations)
      try {
        await supabase.auth.updateUser({
          data: {
            accepted_terms_at: now,
            accepted_terms_version: version,
            parental_consent_confirmed: parentalConsent
          }
        });
      } catch (metaErr) {
        console.warn('[authService] Supabase updateUser consent notice:', metaErr);
      }

      // 3. Step B: Sync to public.profiles via resilient upsert
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: current.id,
            email: current.email,
            full_name: current.name || 'Student Aspirant',
            contact_number: current.contactNumber,
            auth_method: current.authMethod,
            target_exam: current.targetExam || 'JEE Advanced',
            role: current.role || 'student',
            accepted_terms_at: now,
            accepted_terms_version: version,
            parental_consent_confirmed: parentalConsent,
            last_login_at: now
          }, { onConflict: 'id' });
      } catch (e) {
        console.warn('[authService] Failed to upsert accepted_terms_at in public.profiles (non-fatal):', e);
      }
    }
    return current;
  },

  /**
   * Permanently delete user account and all personal test records (DPDP self-service erasure)
   */
  async deleteMyAccount(): Promise<{ success: boolean }> {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Authentication required.');
    if (current.role === 'admin') {
      throw new Error('Admin accounts cannot be self-deleted to prevent accidental management lockouts.');
    }

    if (this.isCloudConnected() && supabase) {
      const { error } = await supabase.rpc('delete_my_account');
      if (error) {
        throw new Error(error.message || 'Failed to delete account on server.');
      }
    }

    // Wipe local client storage keys for this user
    if (typeof window !== 'undefined') {
      try {
        const uId = current.id;
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.includes(uId) || k.startsWith(`nelov_${uId}_`))) {
            keysToDelete.push(k);
          }
        }
        keysToDelete.forEach(k => localStorage.removeItem(k));
        const localUsers = getStoredUsers().filter(u => u.id !== uId);
        saveStoredUsers(localUsers);
      } catch (e) {}
    }

    await this.logOut();
    return { success: true };
  }
};
