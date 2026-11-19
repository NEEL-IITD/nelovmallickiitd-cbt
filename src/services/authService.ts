export type TargetExam = 'JEE Mains' | 'JEE Advanced' | 'Both';

export interface User {
  id: string;
  name: string;
  email: string;
  targetExam: TargetExam;
  createdAt: string;
}

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
  /**
   * Register a new student (100% Free, no payment or tier required)
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

    const users = getStoredUsers();
    if (users.some((u) => u.email === trimmedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      email: trimmedEmail,
      targetExam,
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const cleanUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      targetExam: newUser.targetExam,
      createdAt: newUser.createdAt,
    };

    this.setActiveSession(cleanUser);
    return cleanUser;
  },

  /**
   * Log in an existing student
   */
  async logIn({ email, password }: LogInParams): Promise<User> {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail || !password) {
      throw new Error('Please provide both email and password.');
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email === trimmedEmail);
    if (!user) {
      throw new Error('No account found with this email. Please sign up for free.');
    }

    const inputHash = await hashPassword(password);
    if (user.passwordHash !== inputHash) {
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }

    const cleanUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      targetExam: user.targetExam,
      createdAt: user.createdAt,
    };

    this.setActiveSession(cleanUser);
    return cleanUser;
  },

  /**
   * Get active logged in user from persistent session
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if student is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  /**
   * Set active student session
   */
  setActiveSession(user: User): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {}
  },

  /**
   * Log out active student and clear session
   */
  logOut(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
  },

  /**
   * Reset password for an account
   */
  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email === trimmedEmail);
    if (idx === -1) {
      throw new Error('No registered account found with this email.');
    }

    users[idx].passwordHash = await hashPassword(newPassword);
    saveStoredUsers(users);
    return true;
  },
};
