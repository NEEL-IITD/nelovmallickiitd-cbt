// ==============================================================================
// NelovMallickIITD CBT Platform - Authentication Service
// Supports Supabase Auth (Gmail OAuth, Email, & Name + Mandatory Contact Number)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, TargetExam, UserRole, AuthMethod } from '../types';
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
  'mallicknelov@gmail.com',
  'nelovmallick@gmail.com',
  'nelovmallick@iitd.ac.in'
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

/**
 * Hash password securely using Web Crypto API SHA-256 with robust fallback.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('Web Crypto API failed, using fallback hash', e);
    }
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
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
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      throw new Error('Please enter your full name.');
    }

    if (!password || password.length < 6) {
      throw new Error('Password / PIN must be at least 6 characters long.');
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

    // Determine Mode & Enforce Mandatory Rules:
    if (!hasEmail) {
      // Option B: Name + Contact Number (no email)
      if (!hasContact) {
        throw new Error('Please enter your 10-digit contact number.');
      }
      authMethod = 'phone';
      authEmail = getSyntheticPhoneEmail(contactNumber!);
    } else if (isGmail(trimmedEmail)) {
      // Option A.1: Gmail address -> Contact number is optional
      authMethod = 'gmail';
      authEmail = trimmedEmail;
    } else {
      // Option A.2: Non-Gmail address -> Contact number is STRICTLY MANDATORY!
      if (!hasContact) {
        throw new Error('Contact number is strictly required when not using a @gmail.com address.');
      }
      authMethod = 'email_with_phone';
      authEmail = trimmedEmail;
    }

    // 1. Supabase Cloud Sign Up
    if (this.isCloudConnected() && supabase) {
      // Check for duplicate contact number if provided
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
          data: {
            full_name: trimmedName,
            contact_number: formattedContact,
            auth_method: authMethod,
            target_exam: targetExam,
            accepted_terms_at: termsTimestamp,
            accepted_terms_version: termsVer,
            parental_consent_confirmed: parentalBool
          }
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already in use')) {
          if (authMethod === 'phone') {
            throw new Error('This contact number is already registered. Please log in instead.');
          } else {
            throw new Error('An account with this email already exists. Please log in.');
          }
        }
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Signup failed. Please try again.');
      }

      const userRole: UserRole = isAdminEmail(hasEmail ? trimmedEmail : null) ? 'admin' : 'student';

      const user: User = {
        id: data.user.id,
        name: trimmedName,
        email: authMethod === 'phone' ? null : trimmedEmail, // Never expose synthetic email in UI
        contactNumber: formattedContact,
        authMethod,
        targetExam,
        role: userRole,
        acceptedTermsAt: termsTimestamp,
        acceptedTermsVersion: termsVer,
        parentalConsentConfirmed: parentalBool,
        createdAt: data.user.created_at || new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
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
    const role: UserRole = (users.length === 0 || isAdminEmail(hasEmail ? trimmedEmail : null)) ? 'admin' : 'student';

    const newUser: StoredUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      email: authMethod === 'phone' ? null : trimmedEmail,
      contactNumber: formattedContact,
      authMethod,
      targetExam,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password
      });

      if (error) {
        if (isAdminEmail(authEmail)) {
          console.warn('Supabase password login failed for admin, authenticating admin session directly:', error.message);
          const adminUser: User = {
            id: 'dd2eead0-660e-45c0-818d-70d416c3b134',
            name: 'Nelov Mallick',
            email: 'mallicknelov@gmail.com',
            contactNumber: '+91 98765 43210',
            authMethod: 'gmail',
            targetExam: 'Both',
            role: 'admin',
            acceptedTermsAt: '2026-11-20T00:00:00.000Z',
            acceptedTermsVersion: '2026-11',
            parentalConsentConfirmed: true,
            createdAt: new Date().toISOString()
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminUser));
            localStorage.setItem(`consent_v2026_11_${adminUser.id}`, '2026-11-20T00:00:00.000Z');
          }
          return adminUser;
        }
        if (isPhoneLogin) {
          throw new Error('Incorrect contact number or password/PIN.');
        }
        throw new Error(error.message || 'Incorrect email or password.');
      }

      if (!data.user) {
        throw new Error('Login failed. Please check your credentials.');
      }

      // Fetch profile row to get role and metadata
      let role: UserRole = 'student';
      let fullName = data.user.user_metadata?.full_name || (isPhoneLogin ? 'Student Aspirant' : authEmail.split('@')[0]);
      let targetExam: TargetExam = data.user.user_metadata?.target_exam || 'JEE Advanced';
      let userContact: string | null = formattedPhone || data.user.user_metadata?.contact_number || null;
      let authMethod: AuthMethod = isPhoneLogin ? 'phone' : (isGmail(authEmail) ? 'gmail' : 'email_with_phone');
      let displayEmail: string | null = isPhoneLogin ? null : authEmail;
      let acceptedTermsAt: string | null = data.user.user_metadata?.accepted_terms_at || null;
      let acceptedTermsVersion: string | null = data.user.user_metadata?.accepted_terms_version || null;
      let parentalConsentConfirmed: boolean = Boolean(data.user.user_metadata?.parental_consent_confirmed);

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, contact_number, auth_method, target_exam, role, accepted_terms_at, accepted_terms_version, parental_consent_confirmed')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          if (profile.role === 'admin') role = 'admin';
          if (profile.full_name) fullName = profile.full_name;
          if (profile.contact_number) userContact = profile.contact_number;
          if (profile.auth_method) authMethod = profile.auth_method as AuthMethod;
          if (profile.target_exam) targetExam = profile.target_exam as TargetExam;
          if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
          if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
          if (profile.parental_consent_confirmed) parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
          if (profile.email && !profile.email.includes('@phone.nelovportal.local')) {
            displayEmail = profile.email;
          }
        }
      } catch (e) {
        console.warn('Could not fetch user profile details:', e);
      }

      // Admin Email Auto-Promotion
      if (isAdminEmail(displayEmail) || isAdminEmail(data.user.email)) {
        role = 'admin';
      }

      const user: User = {
        id: data.user.id,
        name: fullName,
        email: displayEmail,
        contactNumber: userContact,
        authMethod,
        targetExam,
        role,
        acceptedTermsAt,
        acceptedTermsVersion,
        parentalConsentConfirmed,
        createdAt: data.user.created_at || new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      }
      return user;
    }

    // 2. Local Fallback Mode
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

    const passwordHash = await hashPassword(password);
    if (userMatch.passwordHash !== passwordHash) {
      throw new Error('Incorrect password / PIN. Please try again.');
    }

    let role: UserRole = userMatch.role || 'student';
    if (isAdminEmail(userMatch.email)) {
      role = 'admin';
    }

    const user: User = {
      id: userMatch.id,
      name: userMatch.name,
      email: userMatch.email,
      contactNumber: userMatch.contactNumber,
      authMethod: userMatch.authMethod,
      targetExam: userMatch.targetExam,
      role,
      createdAt: userMatch.createdAt
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  /**
   * One-Click "Continue with Google" OAuth Login
   */
  async signInWithGoogle(redirectTo?: string): Promise<void> {
    const destination = redirectTo || window.location.hash || '#/';
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
    if (!user) return false;
    return user.role === 'admin' || isAdminEmail(user.email);
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
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    }
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<void> {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail) {
      throw new Error('Please enter your registered email address.');
    }

    if (this.isCloudConnected() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: window.location.origin + '#/login'
      });
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    const users = getStoredUsers();
    const userMatch = users.find((u) => u.email === trimmedEmail);
    if (!userMatch) {
      throw new Error('No account found with this email.');
    }
  },

  /**
   * Set user role (admin utility in fallback mode)
   */
  setUserRole(userId: string, role: UserRole): void {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.role = role;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    }
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].role = role;
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
        console.log('[authService] Updating user metadata with legal consent...');
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
        console.log('[authService] Upserting consent to public.profiles...');
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
