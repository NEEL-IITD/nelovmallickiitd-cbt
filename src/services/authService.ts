// ==============================================================================
// NelovMallickIITD CBT Platform - Authentication Service
// Supports Supabase Auth (Email + Google OAuth) with seamless local fallback
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, TargetExam, UserRole } from '../types';

export interface StoredUser extends User {
  passwordHash: string;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  targetExam?: TargetExam;
}

export interface LogInParams {
  email: string;
  password: string;
}

const USERS_STORAGE_KEY = 'nelov_users_store';
const SESSION_STORAGE_KEY = 'nelov_active_session';
const REDIRECT_STORAGE_KEY = 'nelov_auth_redirect';

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

  /**
   * Register a new student account (100% Free Forever)
   */
  async signUp({ name, email, password, targetExam = 'JEE Advanced' }: SignUpParams): Promise<User> {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedName = (name || '').trim();

    if (!trimmedName) {
      throw new Error('Please enter your full name.');
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // 1. If Supabase Cloud is active, register through Supabase Auth
    if (this.isCloudConnected() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            target_exam: targetExam
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Signup failed. Please try again.');
      }

      const user: User = {
        id: data.user.id,
        name: trimmedName,
        email: trimmedEmail,
        targetExam,
        role: 'student',
        createdAt: data.user.created_at || new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      }
      return user;
    }

    // 2. Local Fallback Mode (Web Crypto SHA-256 in localStorage)
    const users = getStoredUsers();
    if (users.some((u) => u.email === trimmedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const passwordHash = await hashPassword(password);
    // Auto-promote first registered user or test admin if needed
    const role: UserRole = users.length === 0 ? 'admin' : 'student';

    const newUser: StoredUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      email: trimmedEmail,
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
   * Log into student account
   */
  async logIn({ email, password }: LogInParams): Promise<User> {
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedEmail) {
      throw new Error('Please enter your email.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    // 1. Supabase Cloud Auth
    if (this.isCloudConnected() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Login failed. Please check your credentials.');
      }

      // Fetch profile row to get role and metadata
      let role: UserRole = 'student';
      let fullName = data.user.user_metadata?.full_name || trimmedEmail.split('@')[0];
      let targetExam: TargetExam = data.user.user_metadata?.target_exam || 'JEE Advanced';

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, target_exam, role')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          if (profile.role === 'admin') role = 'admin';
          if (profile.full_name) fullName = profile.full_name;
          if (profile.target_exam) targetExam = profile.target_exam as TargetExam;
        }
      } catch (e) {
        console.warn('Could not fetch user profile details:', e);
      }

      const user: User = {
        id: data.user.id,
        name: fullName,
        email: trimmedEmail,
        targetExam,
        role,
        createdAt: data.user.created_at || new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      }
      return user;
    }

    // 2. Local Fallback Mode
    const users = getStoredUsers();
    const userMatch = users.find((u) => u.email === trimmedEmail);

    if (!userMatch) {
      throw new Error('No registered account found with this email. Please sign up free.');
    }

    const passwordHash = await hashPassword(password);
    if (userMatch.passwordHash !== passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    const user: User = {
      id: userMatch.id,
      name: userMatch.name,
      email: userMatch.email,
      targetExam: userMatch.targetExam,
      role: userMatch.role || 'student',
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
      // Local fallback mock Google Sign In for instant testing
      const googleUser: User = {
        id: 'usr_google_' + Date.now().toString(36),
        name: 'Google Aspirant',
        email: 'aspirant@gmail.com',
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
      return data ? JSON.parse(data) : null;
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
    return user !== null && user.role === 'admin';
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
  }
};
