// ==============================================================================
// NelovMallickIITD CBT Platform - Unified Auth & Storage Engine (Browser Runtime)
// Supports Supabase Cloud Sync (Email + Google OAuth) & Robust Local Fallback
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

(function() {
  const USERS_KEY = 'nelov_users_store';
  const SESSION_KEY = 'nelov_active_session';
  const REDIRECT_KEY = 'nelov_auth_redirect';
  const ERROR_REPORTS_KEY = 'nelov_error_reports';
  const TEST_CONFIGS_OVERRIDE_KEY = 'nelov_test_configs_overrides';

  // Environment detection (supports VITE_ and NEXT_PUBLIC_ prefixes cleanly)
  const envUrl =
    (window.__ENV__ && (window.__ENV__.VITE_SUPABASE_URL || window.__ENV__.NEXT_PUBLIC_SUPABASE_URL)) ||
    localStorage.getItem('VITE_SUPABASE_URL') ||
    localStorage.getItem('NEXT_PUBLIC_SUPABASE_URL') ||
    'https://lyzmismtmtsvlqpzdruy.supabase.co';
  const envAnonKey =
    (window.__ENV__ && (window.__ENV__.VITE_SUPABASE_ANON_KEY || window.__ENV__.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
    localStorage.getItem('VITE_SUPABASE_ANON_KEY') ||
    localStorage.getItem('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    'sb_publishable_NqVe4faHT7ccXhQoj8r6ng_KT4hmaSy';

  const SYNC_STATUS_EVENT = 'nelov:sync-status';
  let syncStatusState = { status: 'saved', detail: '', timestamp: Date.now() };
  function emitSyncStatus(status, detail = '') {
    syncStatusState = { status, detail, timestamp: Date.now() };
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SYNC_STATUS_EVENT, {
          detail: syncStatusState
        }));
      }
    } catch (e) {}
  }

  const isConfigured = Boolean(
    envUrl &&
    envAnonKey &&
    !envUrl.includes('your-project') &&
    !envAnonKey.includes('your-anon-key')
  );

  let supabaseClient = null;
  if (isConfigured && window.supabase && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(envUrl, envAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'nelov_supabase_auth_token'
        }
      });
    } catch (e) {
      console.warn('Failed to initialize browser Supabase client:', e);
    }
  }

  function checkRateLimit(bucket, maxRequests, windowMs) {
    try {
      if (window.nelovSecurity?.checkRateLimit) {
        return window.nelovSecurity.checkRateLimit(bucket, maxRequests, windowMs);
      }
      const key = 'nelov_rl_' + bucket;
      const now = Date.now();
      const arr = JSON.parse(localStorage.getItem(key) || '[]').filter(ts => typeof ts === 'number' && (now - ts) < windowMs);
      if (arr.length >= maxRequests) {
        const oldest = Math.min(...arr);
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)) };
      }
      arr.push(now);
      localStorage.setItem(key, JSON.stringify(arr));
      return { allowed: true, retryAfterSec: 0 };
    } catch (e) {
      return { allowed: true, retryAfterSec: 0 };
    }
  }

  function sanitizeHashRedirect(raw) {
    const str = String(raw || '').trim();
    if (!str || !str.startsWith('#') || str.includes('javascript:') || str.includes('//')) {
      return '#/';
    }
    return str.slice(0, 200);
  }

  async function hashPassword(password) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Secure Web Crypto API is required for password hashing.');
    }
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await window.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
      keyMaterial,
      256
    );
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `pbkdf2$${saltHex}$${hashHex}`;
  }

  async function verifyPasswordHash(password, storedHash) {
    if (!storedHash || !window.crypto || !window.crypto.subtle) return false;
    if (String(storedHash).startsWith('pbkdf2$')) {
      const parts = String(storedHash).split('$');
      if (parts.length !== 3) return false;
      const saltHex = parts[1];
      const expectedHex = parts[2];
      const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
      const bits = await window.crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: saltBytes, iterations: 120000, hash: 'SHA-256' },
        keyMaterial,
        256
      );
      const actualHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
      return actualHex === expectedHex;
    }
    // Legacy SHA-256 migration support for previously registered offline accounts
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const legacyHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    return legacyHex === storedHash;
  }

  function getStoredUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }

  function isGmail(email) {
    if (!email) return false;
    return email.trim().toLowerCase().endsWith('@gmail.com');
  }

  function cleanPhoneDigits(raw) {
    let cleaned = (raw || '').replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length > 10) cleaned = cleaned.substring(2);
    else if (cleaned.startsWith('0') && cleaned.length === 11) cleaned = cleaned.substring(1);
    return cleaned;
  }

  function isValidIndianPhone(raw) {
    const digits = cleanPhoneDigits(raw);
    return /^[6-9]\d{9}$/.test(digits);
  }

  function formatIndianPhone(raw) {
    const digits = cleanPhoneDigits(raw);
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    return raw ? raw.trim() : '';
  }

  function getSyntheticPhoneEmail(phoneDigits) {
    const digits = cleanPhoneDigits(phoneDigits);
    return `91${digits}@phone.nelovportal.local`;
  }

  function isAdminEmail(email) {
    if (!email) return false;
    const norm = email.trim().toLowerCase();
    return norm === 'mallicknelov@gmail.com';
  }

  // ============================================================================
  // AUTH SERVICE
  // ============================================================================
  window.authService = {
    isGmail,
    cleanPhoneDigits,
    isValidIndianPhone,
    formatIndianPhone,
    getSyntheticPhoneEmail,
    isAdminEmail,

    isCloudConnected() {
      return Boolean(isConfigured && supabaseClient);
    },

    getSupabaseClient() {
      return supabaseClient;
    },

    async signUp({ name, email, contactNumber, password, targetExam, acceptedTermsAt, acceptedTermsVersion, parentalConsentConfirmed }) {
      const trimmedName = (name || '').trim().slice(0, 100);
      if (trimmedName.length < 2) throw new Error('Please enter your full name (at least 2 characters).');
      const pw = String(password || '');
      const trivialPasswords = ['password', '12345678', '123456789', '1234567890', '00000000', '11111111', 'qwertyui', 'qwerty123', 'abc12345'];
      if (pw.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      if (trivialPasswords.includes(pw.toLowerCase()) || (/^(.)\1+$/.test(pw)) || !(/[A-Za-z]/.test(pw) && /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw))) {
        throw new Error('Please choose a stronger password using at least 8 characters with letters and a number or symbol.');
      }

      const trimmedEmail = (email || '').trim().toLowerCase();
      const hasEmail = Boolean(trimmedEmail);
      const hasContact = Boolean(contactNumber && contactNumber.trim());

      let formattedContact = null;
      let authMethod = 'gmail';
      let authEmail = '';

      if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        throw new Error('Please provide a valid email address.');
      }

      if (hasContact) {
        if (!isValidIndianPhone(contactNumber)) {
          throw new Error('Please enter a valid 10-digit mobile number (e.g. 98765 43210).');
        }
        formattedContact = formatIndianPhone(contactNumber);
      }

      if (!hasEmail) {
        if (!hasContact) throw new Error('Please enter your email or 10-digit contact number.');
        authMethod = 'phone';
        authEmail = getSyntheticPhoneEmail(contactNumber);
      } else if (isGmail(trimmedEmail)) {
        authMethod = 'gmail';
        authEmail = trimmedEmail;
      } else {
        authMethod = hasContact ? 'email_with_phone' : 'email';
        authEmail = trimmedEmail;
      }

      const termsTimestamp = acceptedTermsAt || new Date().toISOString();
      const termsVer = acceptedTermsVersion || '2026-11';
      const parentalBool = Boolean(parentalConsentConfirmed);
      const resolvedTargetExam = targetExam || 'JEE 2027';
      // Backwards-compatible metadata for Postgres triggers before optional schema migration is executed
      const compatAuthMethod = !hasEmail ? 'phone' : (hasContact && !isGmail(trimmedEmail) ? 'email_with_phone' : 'gmail');
      const compatTargetExam = (resolvedTargetExam === 'JEE 2027') ? 'Both' : resolvedTargetExam;

      // 1. Supabase Cloud Auth
      if (this.isCloudConnected()) {
        const { data, error } = await supabaseClient.auth.signUp({
          email: authEmail,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : undefined,
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
          if (error.message.toLowerCase().includes('already registered')) {
            throw new Error(authMethod === 'phone' ? 'This contact number is already registered. Please log in.' : 'An account with this email already exists. Please log in.');
          }
          throw new Error(error.message);
        }
        if (!data.user) throw new Error('Registration failed. Please try again.');

        let verifiedRole = 'student';
        try {
          if (data.session) {
            const { data: profRow } = await supabaseClient
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .maybeSingle();
            if (profRow?.role === 'admin') verifiedRole = 'admin';
          }
        } catch (e) {}

        const cleanUser = {
          id: data.user.id,
          name: trimmedName,
          email: authMethod === 'phone' ? null : trimmedEmail,
          contactNumber: formattedContact,
          authMethod,
          targetExam: resolvedTargetExam,
          dailyQuestionGoal: 30,
          currentStreak: 0,
          avatarUrl: data.user.user_metadata?.avatar_url || null,
          role: verifiedRole,
          needsEmailConfirmation: !data.session,
          acceptedTermsAt: termsTimestamp,
          acceptedTermsVersion: termsVer,
          parentalConsentConfirmed: parentalBool,
          createdAt: data.user.created_at || new Date().toISOString()
        };
        if (data.session) {
          this.setActiveSession(cleanUser);
          if (window.cloudSyncEngine?.hydrateAndMigrateOnLogin) {
            window.cloudSyncEngine.hydrateAndMigrateOnLogin(cleanUser).catch(() => {});
          }
        }
        return cleanUser;
      }

      // 2. Local Fallback Mode (offline / missing Supabase keys)
      const users = getStoredUsers();
      if (hasEmail && users.some(u => u.email === trimmedEmail)) {
        throw new Error('An account with this email already exists. Please log in.');
      }
      if (formattedContact && users.some(u => u.contactNumber === formattedContact)) {
        throw new Error('This contact number is already registered. Please log in.');
      }

      const passwordHash = await hashPassword(password);
      // Security: Never auto-grant admin in client fallback signup
      const role = 'student';

      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
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

      const cleanUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        contactNumber: newUser.contactNumber,
        authMethod: newUser.authMethod,
        targetExam: newUser.targetExam,
        dailyQuestionGoal: newUser.dailyQuestionGoal,
        currentStreak: 0,
        role: newUser.role,
        createdAt: newUser.createdAt
      };
      this.setActiveSession(cleanUser);
      if (window.cloudSyncEngine?.migrateGuestLocalData) {
        window.cloudSyncEngine.migrateGuestLocalData(cleanUser.id);
      }
      return cleanUser;
    },

    async logIn({ email, contactNumber, password }) {
      if (!password) {
        throw new Error('Please enter your password / PIN.');
      }

      const trimmedEmail = (email || '').trim().toLowerCase();
      const trimmedContact = (contactNumber || '').trim();

      if (!trimmedEmail && !trimmedContact) {
        throw new Error('Please provide your Email or Contact Number.');
      }

      let authEmail = '';
      let isPhoneLogin = false;
      let formattedPhone = null;

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
      if (this.isCloudConnected()) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: authEmail,
          password
        });

        if (error) {
          throw new Error(isPhoneLogin ? 'Incorrect contact number or password/PIN.' : error.message);
        }
        if (!data.user) throw new Error('Invalid credentials.');

        let role = 'student';
        let fullName = data.user.user_metadata?.full_name || (isPhoneLogin ? 'Student Aspirant' : authEmail.split('@')[0]);
        let targetExam = data.user.user_metadata?.preferred_exam || data.user.user_metadata?.target_exam || 'JEE 2027';
        let userContact = formattedPhone || data.user.user_metadata?.contact_number || null;
        let authMethod = isPhoneLogin ? 'phone' : (isGmail(authEmail) ? 'gmail' : 'email');
        let displayEmail = isPhoneLogin ? null : authEmail;
        let avatarUrl = data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null;
        let localGoal = 30;
        try {
          const lp = JSON.parse(localStorage.getItem(`nelov_${data.user.id}_daily_planner_v1`) || 'null');
          if (lp?.dailyTarget) localGoal = Number(lp.dailyTarget);
        } catch (e) {}
        let dailyQuestionGoal = Number(data.user.user_metadata?.daily_question_goal || localGoal || 30);
        let currentStreak = 0;
        const localConsent = typeof window !== 'undefined' ? localStorage.getItem(`consent_v2026_11_${data.user.id}`) : null;
        let acceptedTermsAt = data.user.user_metadata?.accepted_terms_at || localConsent || new Date().toISOString();
        let acceptedTermsVersion = data.user.user_metadata?.accepted_terms_version || '2026-11';
        let parentalConsentConfirmed = Boolean(data.user.user_metadata?.parental_consent_confirmed);

        try {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile) {
            role = profile.role === 'admin' ? 'admin' : 'student';
            if (profile.full_name) fullName = profile.full_name;
            if (profile.contact_number) userContact = profile.contact_number;
            if (profile.auth_method) authMethod = profile.auth_method;
            if (profile.target_exam) {
              targetExam = (profile.target_exam === 'Both' && data.user.user_metadata?.preferred_exam)
                ? data.user.user_metadata.preferred_exam
                : profile.target_exam;
            }
            if (profile.avatar_url) avatarUrl = profile.avatar_url;
            if (profile.daily_question_goal) dailyQuestionGoal = Number(profile.daily_question_goal);
            if (profile.current_streak !== undefined && profile.current_streak !== null) currentStreak = Number(profile.current_streak) || 0;
            if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
            if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
            if (profile.parental_consent_confirmed) parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
            if (profile.email && !profile.email.includes('@phone.nelovportal.local')) {
              displayEmail = profile.email;
            }
          }

          if (typeof window !== 'undefined' && acceptedTermsAt) {
            try {
              localStorage.setItem(`consent_v2026_11_${data.user.id}`, acceptedTermsAt);
            } catch (e) {}
          }

          if (!profile) {
            const safeExam = targetExam === 'JEE 2027' ? 'Both' : targetExam;
            const safeMethod = (authMethod === 'email') ? 'gmail' : authMethod;
            await supabaseClient.from('profiles').upsert({
              id: data.user.id,
              full_name: fullName,
              email: displayEmail,
              contact_number: userContact,
              auth_method: safeMethod,
              target_exam: safeExam,
              role: 'student',
              accepted_terms_at: acceptedTermsAt,
              accepted_terms_version: acceptedTermsVersion,
              parental_consent_confirmed: parentalConsentConfirmed,
              last_login_at: new Date().toISOString()
            }, { onConflict: 'id', ignoreDuplicates: true });
          } else if (!profile.accepted_terms_at) {
            await supabaseClient.from('profiles').update({
              accepted_terms_at: acceptedTermsAt,
              accepted_terms_version: acceptedTermsVersion,
              last_login_at: new Date().toISOString()
            }).eq('id', data.user.id);
          }
        } catch (e) {
          console.warn('Profile sync notice:', e);
        }

        const cleanUser = {
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
        this.setActiveSession(cleanUser);
        if (window.cloudSyncEngine?.hydrateAndMigrateOnLogin) {
          window.cloudSyncEngine.hydrateAndMigrateOnLogin(cleanUser).catch(() => {});
        }
        return cleanUser;
      }

      // 2. Local Fallback Mode
      const users = getStoredUsers();
      let user = null;
      if (isPhoneLogin) {
        user = users.find(u => u.contactNumber === formattedPhone || cleanPhoneDigits(u.contactNumber || '') === cleanPhoneDigits(trimmedContact));
        if (!user) throw new Error('No registered account found with this contact number. Please sign up for free.');
      } else {
        user = users.find(u => u.email === trimmedEmail);
        if (!user) throw new Error('No account found with this email. Please sign up for free.');
      }

      const rlLogin = checkRateLimit('login_attempts', 12, 5 * 60 * 1000);
      if (!rlLogin.allowed) {
        throw new Error(`Too many login attempts. Please wait ${rlLogin.retryAfterSec}s before trying again.`);
      }

      const valid = await verifyPasswordHash(password, user.passwordHash);
      if (!valid) {
        throw new Error('Incorrect password / PIN. Please verify your credentials and try again.');
      }
      if (!String(user.passwordHash || '').startsWith('pbkdf2$')) {
        user.passwordHash = await hashPassword(password);
        saveStoredUsers(users);
      }

      // Security: Never auto-grant admin in offline/local mode
      const role = user.role === 'admin' ? 'admin' : 'student';

      const cleanUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        authMethod: user.authMethod,
        targetExam: user.targetExam || 'JEE 2027',
        dailyQuestionGoal: user.dailyQuestionGoal || 30,
        currentStreak: user.currentStreak || 0,
        avatarUrl: user.avatarUrl || null,
        role,
        createdAt: user.createdAt
      };
      this.setActiveSession(cleanUser);
      if (window.cloudSyncEngine?.migrateGuestLocalData) {
        window.cloudSyncEngine.migrateGuestLocalData(cleanUser.id);
      }
      return cleanUser;
    },

    async signInWithGoogle(redirectTo) {
      const destination = sanitizeHashRedirect(redirectTo || window.location.hash || '#/');
      sessionStorage.setItem(REDIRECT_KEY, destination);

      if (this.isCloudConnected()) {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl
          }
        });
        if (error) throw new Error(error.message);
      } else {
        // Offline local fallback mode
        const googleUser = {
          id: 'usr_g_' + Date.now().toString(36),
          name: 'Aspirant Google User',
          email: 'aspirant.google@example.com',
          targetExam: 'JEE Advanced',
          role: 'student',
          createdAt: new Date().toISOString()
        };
        this.setActiveSession(googleUser);
        window.location.hash = destination;
      }
    },

    async resetPassword(email) {
      const rlReset = checkRateLimit('password_reset', 3, 5 * 60 * 1000);
      if (!rlReset.allowed) {
        throw new Error(`Please wait ${rlReset.retryAfterSec}s before requesting another reset email.`);
      }
      const trimmedEmail = (email || '').trim().toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        throw new Error('Please enter a valid email address.');
      }

      if (this.isCloudConnected()) {
        const redirectTo = typeof window !== 'undefined'
          ? (window.location.origin + window.location.pathname + '#/login?recovery=1')
          : undefined;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo
        });
        if (error) throw new Error(error.message);
        return {
          sentEmail: true,
          message: `Password reset instructions sent to ${trimmedEmail}. Check your inbox (and spam folder).`
        };
      }

      throw new Error('Email password reset requires Supabase Cloud connection. Configure Supabase env vars or sign in locally.');
    },

    async updatePassword(newPassword) {
      const pw = String(newPassword || '');
      const trivialPasswords = ['password', '12345678', '123456789', '1234567890', '00000000', '11111111', 'qwertyui', 'qwerty123', 'abc12345'];
      if (pw.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      if (trivialPasswords.includes(pw.toLowerCase()) || (/^(.)\1+$/.test(pw)) || !(/[A-Za-z]/.test(pw) && /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw))) {
        throw new Error('Please choose a stronger password using at least 8 characters with letters and a number or symbol.');
      }
      if (!this.isCloudConnected() || !supabaseClient) {
        throw new Error('Password recovery update requires active Supabase session.');
      }
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      return { success: true };
    },

    async updateProfile(updates = {}) {
      const current = this.getCurrentUser();
      if (!current) throw new Error('Sign in required to update profile settings.');

      const nextNameRaw = updates.name !== undefined ? String(updates.name || '').trim().slice(0, 100) : current.name;
      if (updates.name !== undefined && nextNameRaw.length < 2) {
        throw new Error('Display name must be at least 2 characters.');
      }
      const nextName = nextNameRaw || current.name;
      const nextTargetExam = updates.targetExam !== undefined ? String(updates.targetExam || 'JEE 2027').trim().slice(0, 50) : (current.targetExam || 'JEE 2027');
      const nextGoal = updates.dailyQuestionGoal !== undefined
        ? Math.max(1, Math.min(500, Math.round(Number(updates.dailyQuestionGoal) || 30)))
        : (current.dailyQuestionGoal || 30);
      const rawAvatar = updates.avatarUrl !== undefined ? updates.avatarUrl : (current.avatarUrl || null);
      let nextAvatar = null;
      if (rawAvatar) {
        const avStr = String(rawAvatar).trim();
        const isSafeAv = /^https:\/\/[^\s]+$/i.test(avStr) || /^\/images\/[^\s]+$/.test(avStr) || /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(avStr);
        if (!isSafeAv) throw new Error('Invalid avatar URL format.');
        nextAvatar = avStr.slice(0, 200000);
      }

      const updatedUser = {
        ...current,
        name: nextName || current.name,
        targetExam: nextTargetExam,
        dailyQuestionGoal: nextGoal,
        avatarUrl: nextAvatar
      };
      this.setActiveSession(updatedUser);

      if (updates.dailyQuestionGoal !== undefined && window.dailyPlannerStore?.setDailyTarget) {
        window.dailyPlannerStore.setDailyTarget(nextGoal, updatedUser.id);
      }

      if (this.isCloudConnected() && supabaseClient && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(String(updatedUser.id || ''))) {
        emitSyncStatus('saving', 'Updating profile');
        try {
          try {
            await supabaseClient.auth.updateUser({
              data: {
                full_name: updatedUser.name,
                preferred_exam: updatedUser.targetExam,
                daily_question_goal: nextGoal
              }
            });
          } catch (e) {}
          const safeTargetExam = updatedUser.targetExam === 'JEE 2027' ? 'Both' : updatedUser.targetExam;
          let { error } = await supabaseClient
            .from('profiles')
            .update({
              full_name: updatedUser.name,
              target_exam: updatedUser.targetExam,
              daily_question_goal: nextGoal,
              avatar_url: nextAvatar,
              updated_at: new Date().toISOString()
            })
            .eq('id', updatedUser.id);
          if (error && (error.code === '23514' || error.status === 400 || /target_exam|column/i.test(error.message || ''))) {
            const fallbackRes = await supabaseClient
              .from('profiles')
              .update({
                full_name: updatedUser.name,
                target_exam: safeTargetExam
              })
              .eq('id', updatedUser.id);
            error = fallbackRes.error;
          }
          if (error) throw error;
          emitSyncStatus('saved', 'Profile saved');
        } catch (err) {
          emitSyncStatus('offline', err?.message || 'Profile sync deferred');
          throw new Error(err?.message || 'Could not update profile in Supabase.');
        }
      } else {
        // Local fallback sync
        const users = getStoredUsers();
        const idx = users.findIndex(u => u.id === updatedUser.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], name: updatedUser.name, targetExam: updatedUser.targetExam, dailyQuestionGoal: nextGoal };
          saveStoredUsers(users);
        }
        emitSyncStatus('saved', 'Saved locally');
      }
      return updatedUser;
    },

    async continueAsGuest() {
      try {
        localStorage.setItem('nelov_guest_mode', '1');
      } catch (e) {}
      if (this.getCurrentUser()) {
        await this.logOut();
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nelov_auth_changed', { detail: { user: null, guestMode: true } }));
      }
      return { guest: true };
    },

    isGuestMode() {
      try {
        return !this.getCurrentUser() && localStorage.getItem('nelov_guest_mode') === '1';
      } catch (e) {
        return false;
      }
    },

    getCurrentUser() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    isAdmin() {
      const user = this.getCurrentUser();
      if (!user || user.role !== 'admin') return false;
      if (this.isCloudConnected()) {
        return typeof user.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(user.id);
      }
      return true;
    },

    setUserRole(userId, role) {
      // Security: Only local fallback dev mode allows role mutation; cloud role is managed strictly by Postgres profiles.role
      if (this.isCloudConnected()) {
        console.warn('[Security] Role changes must be applied in Supabase public.profiles.');
        return;
      }
      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        current.role = role;
        this.setActiveSession(current);
      }
      const users = getStoredUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        users[idx].role = role;
        saveStoredUsers(users);
      }
    },

    getAllUsers() {
      return getStoredUsers().map(u => ({
        id: u.id,
        full_name: u.name,
        name: u.name,
        email: u.email,
        contact_number: u.contactNumber,
        contactNumber: u.contactNumber,
        auth_method: u.authMethod || (u.contactNumber ? 'phone' : 'gmail'),
        authMethod: u.authMethod || (u.contactNumber ? 'phone' : 'gmail'),
        target_exam: u.targetExam,
        targetExam: u.targetExam,
        role: u.role || 'student',
        created_at: u.createdAt,
        createdAt: u.createdAt
      }));
    },

    setActiveSession(user) {
      try {
        if (user) localStorage.removeItem('nelov_guest_mode');
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('nelov_auth_changed', { detail: { user } }));
      } catch (e) {}
    },

    async logOut(opts = {}) {
      if (!opts?.skipSupabaseSignOut && this.isCloudConnected()) {
        try {
          await supabaseClient.auth.signOut();
        } catch (e) {}
      }
      try {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('nelov_test_student_override');
        sessionStorage.removeItem(REDIRECT_KEY);
        window.dispatchEvent(new CustomEvent('nelov_auth_changed', { detail: { user: null } }));
      } catch (e) {}
    }
  };

  // ============================================================================
  // STUDENT STORAGE & CLOUD SYNC
  // ============================================================================
  window.studentStorage = {
    _draftTimers: {},
    _inFlightSubmissions: new Set(),

    _canonicalizeTestKey(testId, testCode) {
      const combined = `${testId || ''} ${testCode || ''}`.toLowerCase().trim();
      const isChapter =
        combined.includes('chapter') ||
        combined.includes('exercise') ||
        /^(physics|chemistry|mathematics|maths)[-_ ]/i.test(String(testId || '').trim());
      const mPtm = combined.match(/ptm[-\s_]?0*([0-9]+)/i);
      if (mPtm && !isChapter) {
        const num = String(parseInt(mPtm[1], 10)).padStart(2, '0');
        return { testId: `jee-mains-ptm-${num}`, code: `PTM ${num}`, examType: 'JEE Mains', testType: 'mock' };
      }
      const mPta = combined.match(/pta[-\s_]?0*([0-9]+)/i);
      if (mPta && !isChapter) {
        const num = String(parseInt(mPta[1], 10)).padStart(2, '0');
        return { testId: `jee-advanced-pta-${num}`, code: `PTA ${num}`, examType: 'JEE Advanced', testType: 'mock' };
      }
      const fallbackId = String(testId || testCode || 'chapter-exercise').trim().toLowerCase();
      return {
        testId: fallbackId,
        code: String(testCode || fallbackId).trim(),
        examType: combined.includes('mains') ? 'JEE Mains' : 'JEE Advanced',
        testType: isChapter ? 'chapter_exercise' : 'mock'
      };
    },

    saveSession(userId, testId, sessionData) {
      if (!userId || !testId) return;
      try {
        const stamped = {
          ...(sessionData || {}),
          testId,
          updatedAt: (sessionData && sessionData.updatedAt) || new Date().toISOString()
        };
        localStorage.setItem(`nelov_${userId}_session_${testId}`, JSON.stringify(stamped));
        this._scheduleSessionCloudSync(userId, testId, stamped);
      } catch (e) {}
    },

    _scheduleSessionCloudSync(userId, testId, stamped) {
      if (typeof window === 'undefined') return;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!window.authService?.isCloudConnected() || !supabaseClient || !uuidRegex.test(String(userId))) return;

      const key = `${userId}:${testId}`;
      if (this._draftTimers[key]) clearTimeout(this._draftTimers[key]);
      this._draftTimers[key] = setTimeout(async () => {
        try {
          emitSyncStatus('saving', 'Syncing CBT session');
          const { data: sessData } = await supabaseClient.auth.getSession();
          const authUid = sessData?.session?.user?.id;
          if (!authUid || !uuidRegex.test(authUid)) return;

          const canon = this._canonicalizeTestKey(testId, stamped.testCode);
          let draftId = stamped.cloudDraftId;
          if (!draftId || !uuidRegex.test(draftId)) {
            const { data: existingDraft } = await supabaseClient
              .from('test_attempts')
              .select('id')
              .eq('user_id', authUid)
              .eq('test_id', canon.testId)
              .eq('status', 'in_progress')
              .maybeSingle();
            draftId = existingDraft?.id || (typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : undefined);
            if (draftId) {
              stamped.cloudDraftId = draftId;
              try {
                localStorage.setItem(`nelov_${userId}_session_${testId}`, JSON.stringify(stamped));
              } catch (e) {}
            }
          }

          const draftPayload = {
            ...(draftId ? { id: draftId } : {}),
            user_id: authUid,
            test_id: canon.testId,
            exam_type: canon.examType,
            test_type: canon.testType,
            code: canon.code,
            status: 'in_progress',
            responses: stamped.responses || {},
            marked_for_review: stamped.markedForReview || stamped.reviewSet || [],
            time_remaining_seconds: stamped.timeLeftSeconds ?? stamped.timeRemainingSeconds ?? null,
            time_spent_seconds: stamped.timeSpentSeconds ?? 0,
            time_per_question: stamped.questionTimings || {},
            obtained_marks: 0,
            total_marks: stamped.totalMaxMarks || 300,
            percentage: 0,
            accuracy: 0,
            updated_at: new Date().toISOString()
          };

          const { error } = await supabaseClient
            .from('test_attempts')
            .upsert(draftPayload, { onConflict: 'id' });
          if (!error) emitSyncStatus('saved', 'Session synced');
        } catch (e) {}
      }, 1400);
    },

    getSession(userId, testId) {
      if (!userId || !testId) return null;
      try {
        const raw = localStorage.getItem(`nelov_${userId}_session_${testId}`);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    getLatestInProgressSession(userId) {
      if (!userId) return null;
      try {
        const prefix = `nelov_${userId}_session_`;
        let best = null;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k || !k.startsWith(prefix)) continue;
          const testId = k.slice(prefix.length);
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (!parsed) continue;
          const ts = parsed.updatedAt ? new Date(parsed.updatedAt).getTime() : 0;
          const ansCount = parsed.responses ? Object.keys(parsed.responses).length : 0;
          if (!best || ts > best.ts || (ts === best.ts && ansCount > best.ansCount)) {
            best = { testId, ts, ansCount, ...parsed };
          }
        }
        return best;
      } catch (e) {
        return null;
      }
    },

    clearSession(userId, testId) {
      if (!userId || !testId) return;
      try {
        localStorage.removeItem(`nelov_${userId}_session_${testId}`);
        const timerKey = `${userId}:${testId}`;
        if (this._draftTimers && this._draftTimers[timerKey]) {
          clearTimeout(this._draftTimers[timerKey]);
          delete this._draftTimers[timerKey];
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (window.authService?.isCloudConnected() && supabaseClient && uuidRegex.test(String(userId))) {
          const canon = this._canonicalizeTestKey(testId);
          supabaseClient
            .from('test_attempts')
            .delete()
            .match({ user_id: userId, test_id: canon.testId, status: 'in_progress' })
            .then(() => {})
            .catch(() => {});
        }
      } catch (e) {}
    },

    async saveAttempt(userId, attemptRecord) {
      if (!userId) return;

      // 1. Generate / Validate UUID for attemptRecord.id (Postgres public.test_attempts.id is type UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      let attemptUuid = attemptRecord.id;
      if (!attemptUuid || !uuidRegex.test(attemptUuid)) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          attemptUuid = crypto.randomUUID();
        } else {
          attemptUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        attemptRecord.id = attemptUuid;
      }

      // Canonical test ID normalization
      const canon = this._canonicalizeTestKey(
        attemptRecord.testId || attemptRecord.testCode,
        attemptRecord.testCode || attemptRecord.code
      );
      const canonicalTestId = canon.testId;
      const canonicalCode = canon.code;
      const resolvedTestType = attemptRecord.testType || canon.testType;

      // Prevent simultaneous double-submission for the same attempt / click+timeout race
      const flightKey = `${userId}:${canonicalTestId}:${attemptUuid}`;
      if (this._inFlightSubmissions.has(flightKey)) return;
      this._inFlightSubmissions.add(flightKey);
      try {

      // Resolve live authenticated Supabase user ID if available & ensure session freshness (prevents 401 on 3-hour tests)
      let effectiveUserId = userId;
      if (window.authService?.isCloudConnected() && supabaseClient) {
        try {
          const { data: sessData } = await supabaseClient.auth.getSession();
          const sess = sessData?.session;
          if (sess) {
            const expMs = sess.expires_at ? sess.expires_at * 1000 : 0;
            if (expMs > 0 && expMs < Date.now() + 120000) {
              const { data: refData } = await supabaseClient.auth.refreshSession();
              if (refData?.session?.user?.id && uuidRegex.test(refData.session.user.id)) {
                effectiveUserId = refData.session.user.id;
              }
            } else if (sess.user?.id && uuidRegex.test(sess.user.id)) {
              effectiveUserId = sess.user.id;
            }
          }
        } catch (e) {
          console.warn('[Supabase] Session verification notice:', e);
        }
      }

      // 1. Save to local storage cache immediately
      try {
        const attempts = this.getAttempts(userId);
        const idx = attempts.findIndex(a => a.id === attemptRecord.id);
        if (idx !== -1) {
          attempts[idx] = attemptRecord;
        } else {
          attempts.unshift(attemptRecord);
        }
        localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(attempts));
        if (effectiveUserId !== userId) {
          localStorage.setItem(`nelov_${effectiveUserId}_attempts`, JSON.stringify(attempts));
        }
      } catch (e) {}

      // 2. Cloud sync to Supabase public.test_attempts with profile pre-check and retry
      if (window.authService?.isCloudConnected() && supabaseClient && uuidRegex.test(effectiveUserId)) {
        // Pre-check / upsert student profile so foreign key constraint test_attempts_user_id_fkey is satisfied
        try {
          const profileName = attemptRecord.candidateName || attemptRecord.studentName || 'JEE Aspirant';
          const profileEmail = attemptRecord.email || attemptRecord.studentEmail || null;
          await supabaseClient.from('profiles').upsert({
            id: effectiveUserId,
            full_name: profileName,
            email: profileEmail,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id', ignoreDuplicates: true });
        } catch (pe) {
          console.warn('[Supabase] profile pre-check notice:', pe);
        }

        const timeSec = attemptRecord.timeTakenSeconds || (attemptRecord.timeSpentTotal ? Math.round(attemptRecord.timeSpentTotal) : 0);
        const obtainedMarksNum = Number(attemptRecord.totalMarksScored ?? attemptRecord.obtainedMarks ?? 0);
        const totalMarksNum = Number(attemptRecord.totalMaxMarks ?? attemptRecord.totalMarks ?? 300);
        const testTypeVal = canonicalTestId.includes('chapter') ? 'chapter_exercise' : 'mock';
        const payload = {
          id: attemptUuid,
          user_id: effectiveUserId,
          test_id: canonicalTestId,
          exam_type: attemptRecord.examType || (canonicalTestId.includes('mains') ? 'JEE Mains' : 'JEE Advanced'),
          test_type: testTypeVal,
          status: 'completed',
          code: canonicalCode,
          obtained_marks: obtainedMarksNum,
          total_marks: totalMarksNum,
          score: obtainedMarksNum,
          max_score: totalMarksNum,
          percentage: Number(attemptRecord.percentage ?? 0),
          accuracy: Number(attemptRecord.accuracy ?? 0),
          time_taken_seconds: timeSec,
          time_spent_seconds: timeSec,
          estimated_rank_label: attemptRecord.predictedAirDisplay || 'AIR Qualified',
          subject_breakdown: attemptRecord.subjectStats || attemptRecord.subjectBreakdown || {},
          responses: attemptRecord.responses || {},
          marked_for_review: attemptRecord.markedForReview || [],
          time_per_question: attemptRecord.questionTimings || attemptRecord.question_timings || attemptRecord.timePerQuestion || {},
          question_timings: attemptRecord.questionTimings || attemptRecord.question_timings || attemptRecord.timePerQuestion || {},
          mistake_tags: {
            ...(attemptRecord.mistakeTags || {}),
            submission_trigger: attemptRecord.submissionTrigger || 'manual'
          },
          submitted_at: attemptRecord.completedAt || attemptRecord.submittedAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        emitSyncStatus('saving', 'Saving test attempt');
        let savedCloud = false;
        for (let tryIdx = 0; tryIdx < 3; tryIdx++) {
          try {
            const { data, error } = await supabaseClient.from('test_attempts').upsert(payload, { onConflict: 'id' });
            if (error) {
              console.warn(`[Supabase] saveAttempt try ${tryIdx + 1} warning:`, error.message);
              // Fallback: If DB schema is missing additive columns yet, strip them and retry insert
              if (error.status === 400 || error.code === '42703' || /column|schema cache/i.test(error.message || '')) {
                ['question_timings', 'test_type', 'status', 'score', 'max_score', 'time_spent_seconds', 'marked_for_review', 'updated_at'].forEach((col) => {
                  if (col in payload && (error.message?.includes(col) || col !== 'status')) {
                    delete payload[col];
                  }
                });
              }
              // Handle 401 JWT expiration on long 3-hour tests by refreshing session and retrying
              if (error.status === 401 || error.message?.includes('JWT') || error.message?.includes('token') || error.message?.includes('expired') || error.message?.includes('auth')) {
                try {
                  const { data: refData } = await supabaseClient.auth.refreshSession();
                  if (refData?.session?.user?.id && uuidRegex.test(refData.session.user.id)) {
                    effectiveUserId = refData.session.user.id;
                    payload.user_id = effectiveUserId;
                  }
                } catch (re) {}
              }
            } else {
              savedCloud = true;
              emitSyncStatus('saved', 'Test attempt saved');
              // Clean up any leftover in_progress draft row for this test
              supabaseClient
                .from('test_attempts')
                .delete()
                .match({ user_id: effectiveUserId, test_id: canonicalTestId, status: 'in_progress' })
                .then(() => {})
                .catch(() => {});
              break;
            }
          } catch (err) {
            console.warn(`[Supabase] saveAttempt try ${tryIdx + 1} exception:`, err);
          }
          if (!savedCloud && tryIdx < 2) {
            await new Promise(r => setTimeout(r, 600));
          }
        }

        if (!savedCloud) {
          try {
            const qKey = 'nelov_pending_sync_attempts';
            const rawQ = localStorage.getItem(qKey);
            const q = rawQ ? JSON.parse(rawQ) : [];
            if (!q.some(item => item.id === attemptUuid)) {
              q.push({ ...attemptRecord, id: attemptUuid, userId: effectiveUserId, testId: canonicalTestId, testCode: canonicalCode });
              localStorage.setItem(qKey, JSON.stringify(q));
            }
          } catch (qe) {}
        }
      } else {
        try {
          const qKey = 'nelov_pending_sync_attempts';
          const rawQ = localStorage.getItem(qKey);
          const q = rawQ ? JSON.parse(rawQ) : [];
          if (!q.some(item => item.id === attemptUuid)) {
            q.push({ ...attemptRecord, id: attemptUuid, userId: effectiveUserId, testId: canonicalTestId, testCode: canonicalCode });
            localStorage.setItem(qKey, JSON.stringify(q));
          }
        } catch (qe) {}
      }

      // 3. Dispatch global event so all dashboards (Schedule, My Progress, Leaderboard) react instantly
      try {
        window.dispatchEvent(new CustomEvent('nelov_attempt_saved', {
          detail: {
            attemptRecord,
            userId: effectiveUserId,
            testId: canonicalTestId,
            code: canonicalCode
          }
        }));
      } catch (de) {}
      } finally {
        this._inFlightSubmissions.delete(flightKey);
      }
    },
    async syncLocalAttemptsToSupabase() {
      if (!window.authService?.isCloudConnected() || !supabaseClient) {
        return { synced: 0, pending: 0 };
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      let authUser = null;
      try {
        const { data: authData } = await supabaseClient.auth.getUser();
        authUser = authData?.user;
      } catch (e) {}

      if (!authUser || !authUser.id || !uuidRegex.test(authUser.id)) {
        return { synced: 0, pending: 0 };
      }

      // Collect local attempt candidates from pending sync and all student storage keys
      const candidates = [];
      const seenCandIds = new Set();
      try {
        const qRaw = localStorage.getItem('nelov_pending_sync_attempts');
        if (qRaw) {
          const list = JSON.parse(qRaw);
          if (Array.isArray(list)) {
            list.forEach(item => {
              if (item && !seenCandIds.has(item.id)) {
                if (item.id) seenCandIds.add(item.id);
                candidates.push(item);
              }
            });
          }
        }

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nelov_') && key.endsWith('_attempts')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                list.forEach(item => {
                  if (item && item.id && !seenCandIds.has(item.id)) {
                    seenCandIds.add(item.id);
                    candidates.push(item);
                  }
                });
              }
            }
          }
        }
      } catch (e) {}

      if (candidates.length === 0) return { synced: 0, pending: 0 };

      // Ensure profile row exists
      try {
        await supabaseClient.from('profiles').upsert({
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || 'JEE Aspirant',
          email: authUser.email || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id', ignoreDuplicates: true });
      } catch (pe) {}

      // Check existing attempts in Supabase for this user
      const existingIds = new Set();
      try {
        const { data: userAttempts } = await supabaseClient
          .from('test_attempts')
          .select('id')
          .eq('user_id', authUser.id);
        if (Array.isArray(userAttempts)) {
          userAttempts.forEach(a => existingIds.add(a.id));
        }
      } catch (e) {}

      let syncedCount = 0;
      for (const attempt of candidates) {
        let attId = attempt.id;
        if (!attId || !uuidRegex.test(attId)) {
          attId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
          attempt.id = attId;
        }

        if (existingIds.has(attId)) continue;

        const canonRecovery = this._canonicalizeTestKey(attempt.testId || attempt.testCode, attempt.testCode || attempt.code);
        const timeSec = attempt.timeTakenSeconds || (attempt.timeSpentTotal ? Math.round(attempt.timeSpentTotal) : 0);
        const payload = {
          id: attId,
          user_id: authUser.id,
          test_id: canonRecovery.testId,
          exam_type: attempt.examType || canonRecovery.examType,
          test_type: attempt.testType || canonRecovery.testType,
          status: 'completed',
          code: canonRecovery.code,
          obtained_marks: Number(attempt.totalMarksScored ?? attempt.obtainedMarks ?? 0),
          total_marks: Number(attempt.totalMaxMarks ?? attempt.totalMarks ?? 300),
          percentage: Number(attempt.percentage ?? 0),
          accuracy: Number(attempt.accuracy ?? 0),
          time_taken_seconds: timeSec,
          estimated_rank_label: attempt.predictedAirDisplay || 'AIR Qualified',
          subject_breakdown: attempt.subjectStats || attempt.subjectBreakdown || {},
          responses: attempt.responses || {},
          time_per_question: attempt.questionTimings || attempt.question_timings || attempt.timePerQuestion || {},
          question_timings: attempt.questionTimings || attempt.question_timings || attempt.timePerQuestion || {},
          mistake_tags: {
            ...(attempt.mistakeTags || {}),
            submission_trigger: attempt.submissionTrigger || 'manual',
            sync_recovery: true
          },
          submitted_at: attempt.completedAt || attempt.submittedAt || new Date().toISOString()
        };

        try {
          let { error } = await supabaseClient.from('test_attempts').upsert(payload, { onConflict: 'id' });
          if (error && (error.status === 400 || error.code === '42703' || /column|schema cache/i.test(error.message || ''))) {
            ['question_timings', 'test_type'].forEach(col => {
              if (col in payload && error.message?.includes(col)) delete payload[col];
            });
            const res2 = await supabaseClient.from('test_attempts').upsert(payload, { onConflict: 'id' });
            error = res2.error;
          }
          if (!error) {
            existingIds.add(attId);
            syncedCount++;
          }
        } catch (err) {}
      }

      // Clean up synced items from pending sync queue
      try {
        const qRaw = localStorage.getItem('nelov_pending_sync_attempts');
        if (qRaw) {
          const list = JSON.parse(qRaw);
          if (Array.isArray(list)) {
            const remaining = list.filter(item => !existingIds.has(item.id));
            if (remaining.length > 0) {
              localStorage.setItem('nelov_pending_sync_attempts', JSON.stringify(remaining));
            } else {
              localStorage.removeItem('nelov_pending_sync_attempts');
            }
          }
        }
      } catch (e) {}

      return { synced: syncedCount, existing: existingIds.size };
    },

    getAttempts(userId) {
      if (!userId) return [];
      try {
        const raw = localStorage.getItem(`nelov_${userId}_attempts`);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    async getAllAttempts() {
      // Paginated Supabase fetch strictly filtering completed submissions + profiles mapping
      const allAttempts = [];
      const seenIds = new Set();
      const cloudConfigured = !!(window.authService && window.authService.isCloudConnected() && supabaseClient);

      if (cloudConfigured) {
        try {
          const attemptsData = [];
          const PAGE_SIZE = 1000;
          let offset = 0;
          let attError = null;

          while (true) {
            const { data: pageRows, error: pageErr } = await supabaseClient
              .from('test_attempts')
              .select('*')
              .eq('status', 'completed')
              .not('submitted_at', 'is', null)
              .order('submitted_at', { ascending: false })
              .range(offset, offset + PAGE_SIZE - 1);

            if (pageErr) {
              attError = pageErr;
              break;
            }
            if (Array.isArray(pageRows) && pageRows.length > 0) {
              attemptsData.push(...pageRows);
            }
            if (!Array.isArray(pageRows) || pageRows.length < PAGE_SIZE) {
              break;
            }
            offset += PAGE_SIZE;
          }

          // Fallback if live DB is awaiting the `status` column migration (42703)
          if (attError && (attError.code === '42703' || String(attError.message || '').includes('status'))) {
            attError = null;
            offset = 0;
            attemptsData.length = 0;
            while (true) {
              const { data: pageRows, error: pageErr } = await supabaseClient
                .from('test_attempts')
                .select('*')
                .not('submitted_at', 'is', null)
                .order('submitted_at', { ascending: false })
                .range(offset, offset + PAGE_SIZE - 1);
              if (pageErr) {
                attError = pageErr;
                break;
              }
              if (Array.isArray(pageRows) && pageRows.length > 0) {
                attemptsData.push(...pageRows);
              }
              if (!Array.isArray(pageRows) || pageRows.length < PAGE_SIZE) {
                break;
              }
              offset += PAGE_SIZE;
            }
          }

          if (attError) {
            console.error('[Supabase] studentStorage.getAllAttempts error:', attError.message);
            this._lastAttemptsError = attError;
          } else {
            this._lastAttemptsError = null;
          }

          // Query 2: profiles lookup
          const { data: profilesData, error: profError } = await supabaseClient
            .from('profiles')
            .select('*');

          if (profError) {
            console.warn('[Supabase] studentStorage.getAllAttempts profiles warning:', profError.message);
            this._lastProfilesError = profError;
          } else {
            this._lastProfilesError = null;
          }

          const profilesMap = {};
          if (Array.isArray(profilesData)) {
            profilesData.forEach(p => {
              if (p.id) profilesMap[p.id] = p;
            });
          }

          attemptsData.forEach(d => {
            if (d.status === 'in_progress' || !d.submitted_at) return;
            if (seenIds.has(d.id)) return;
            seenIds.add(d.id);
            const p = profilesMap[d.user_id] || {};
            const rawEmail = p.email || '';
            const isSynthetic = rawEmail.endsWith('@phone.nelovportal.local');
            const studentName = p.full_name || p.name || 'JEE Aspirant';
            const isAdminAttempt = p.role === 'admin' || rawEmail.toLowerCase().trim() === 'mallicknelov@gmail.com';
            const canon = this._canonicalizeTestKey(d.test_id, d.code);
            const resolvedType = d.test_type || canon.testType;

            allAttempts.push({
              id: d.id,
              userId: d.user_id,
              user_id: d.user_id,
              studentName: studentName,
              candidateName: studentName,
              userName: studentName,
              studentEmail: isSynthetic ? '' : rawEmail,
              email: isSynthetic ? '' : rawEmail,
              studentContact: p.contact_number || '',
              contactNumber: p.contact_number || '',
              authMethod: p.auth_method || (p.contact_number ? 'phone' : 'gmail'),
              testId: canon.testId,
              rawTestId: d.test_id,
              testType: resolvedType,
              status: d.status || 'completed',
              isAdminAttempt,
              examType: d.exam_type || canon.examType,
              testCode: canon.code,
              code: canon.code,
              obtainedMarks: Number(d.obtained_marks ?? 0),
              totalMarksScored: Number(d.obtained_marks ?? 0),
              totalMarks: Number(d.total_marks ?? 300),
              totalMaxMarks: Number(d.total_marks ?? 300),
              percentage: Number(d.percentage ?? 0),
              accuracy: Number(d.accuracy ?? 0),
              timeTakenSeconds: Number(d.time_taken_seconds ?? 0),
              time_taken_seconds: Number(d.time_taken_seconds ?? 0),
              estimatedRankLabel: d.estimated_rank_label,
              predictedAirDisplay: d.estimated_rank_label,
              subjectStats: d.subject_breakdown || {},
              subjectBreakdown: d.subject_breakdown || {},
              responses: d.responses || {},
              mistakeTags: d.mistake_tags || {},
              submittedAt: d.submitted_at,
              completedAt: d.submitted_at
            });
          });

          return allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        } catch (e) {
          console.error('[Supabase] studentStorage.getAllAttempts exception:', e);
          this._lastAttemptsError = e;
          return [];
        }
      }

      // Offline-only localStorage read (only runs when Supabase cloud is NOT configured)
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && ((key.startsWith('nelov_') && key.endsWith('_attempts')) || key === 'nelov_pending_sync_attempts' || key === 'nelov_vault_exercise_attempts')) {
            const uId = key.replace('nelov_', '').replace('_attempts', '');
            const raw = localStorage.getItem(key);
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                list.forEach(item => {
                  if (!item || item.status === 'in_progress') return;
                  const rowId = item.id || `${uId}:${item.testId || item.exerciseId}:${item.completedAt || item.submittedAt}`;
                  if (seenIds.has(rowId)) return;
                  seenIds.add(rowId);
                  const canon = this._canonicalizeTestKey(item.testId || item.exerciseId, item.testCode || item.code || item.exerciseTitle);
                  allAttempts.push({
                    ...item,
                    id: rowId,
                    userId: item.userId || uId,
                    user_id: item.userId || uId,
                    testId: canon.testId,
                    testType: item.testType || (key === 'nelov_vault_exercise_attempts' ? 'chapter_exercise' : canon.testType),
                    testCode: canon.code,
                    code: canon.code,
                    obtainedMarks: Number(item.totalMarksScored ?? item.obtainedMarks ?? item.score ?? 0),
                    totalMarksScored: Number(item.totalMarksScored ?? item.obtainedMarks ?? item.score ?? 0),
                    totalMarks: Number(item.totalMaxMarks ?? item.totalMarks ?? 300),
                    totalMaxMarks: Number(item.totalMaxMarks ?? item.totalMarks ?? 300),
                    submittedAt: item.completedAt || item.submittedAt || new Date().toISOString(),
                    completedAt: item.completedAt || item.submittedAt || new Date().toISOString()
                  });
                });
              }
            }
          }
        }
      } catch (e) {}

      return allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    },

    async getAdminSubmissionStats(preloadedAttempts = null) {
      if (window.authService && window.authService.isCloudConnected() && supabaseClient) {
        try {
          const { data, error } = await supabaseClient.rpc('get_admin_submission_stats');
          if (!error && data && typeof data === 'object') {
            const rawByTest = Array.isArray(data.by_test) ? data.by_test : [];
            return {
              uniqueSubmissionsTotal: Number(data.unique_submissions_total ?? data.unique_students_total ?? 0),
              uniqueStudentsTotal: Number(data.unique_students_total ?? 0),
              completedTotal: Number(data.completed_total ?? 0),
              completedIncludingAdmin: Number(data.completed_including_admin ?? 0),
              adminPreviewCount: Number(data.admin_preview_count ?? 0),
              inProgressCount: Number(data.in_progress_count ?? 0),
              mockUniqueSubmissions: Number(data.mock_unique_submissions ?? 0),
              chapterUniqueSubmissions: Number(data.chapter_unique_submissions ?? 0),
              mockCompletedCount: Number(data.mock_completed_count ?? 0),
              chapterCompletedCount: Number(data.chapter_completed_count ?? 0),
              byTest: rawByTest.map(b => ({
                testId: b.test_id,
                code: b.code,
                testType: b.test_type === 'chapter_exercise' ? 'chapter_exercise' : 'mock',
                completedCount: Number(b.completed_count ?? 0),
                uniqueStudents: Number(b.unique_students ?? 0),
                inProgressCount: Number(b.in_progress_count ?? 0),
                adminPreviewCount: Number(b.admin_preview_count ?? 0),
                lastSubmittedAt: b.last_submitted_at || null
              })),
              fromRpc: true,
              error: null
            };
          }
          if (error) {
            console.warn('[Supabase] get_admin_submission_stats rpc notice:', error.message);
          }
        } catch (e) {
          console.warn('[Supabase] get_admin_submission_stats exception:', e);
        }
      }

      // Fallback aggregation from exact count + deduplicated (user_id, test_id) pairs
      let exactCompletedCount = null;
      let exactInProgressCount = 0;
      if (window.authService && window.authService.isCloudConnected() && supabaseClient) {
        try {
          const res = await supabaseClient
            .from('test_attempts')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'completed')
            .not('submitted_at', 'is', null);
          if (!res.error && typeof res.count === 'number') exactCompletedCount = res.count;
          const ipRes = await supabaseClient
            .from('test_attempts')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'in_progress');
          if (!ipRes.error && typeof ipRes.count === 'number') exactInProgressCount = ipRes.count;
        } catch (e) {}
      }

      const rows = Array.isArray(preloadedAttempts) ? preloadedAttempts : await this.getAllAttempts();
      const studentRows = rows.filter(a => !a.isAdminAttempt && a.status !== 'in_progress' && a.submittedAt);
      const adminRows = rows.filter(a => a.isAdminAttempt && a.status !== 'in_progress' && a.submittedAt);
      const byTestMap = {};
      const allUniqueStudents = new Set();
      const uniqueSubmissionPairs = new Set();
      const mockUniquePairs = new Set();
      const chapterUniquePairs = new Set();

      studentRows.forEach(a => {
        const canon = this._canonicalizeTestKey(a.testId, a.testCode || a.code);
        const tType = a.testType || canon.testType;
        const uid = String(a.userId || a.user_id || a.studentEmail || a.id);
        if (uid) {
          allUniqueStudents.add(uid);
          const pairKey = `${uid}::${canon.testId}`;
          uniqueSubmissionPairs.add(pairKey);
          if (tType === 'chapter_exercise') {
            chapterUniquePairs.add(pairKey);
          } else {
            mockUniquePairs.add(pairKey);
          }
        }
        if (!byTestMap[canon.testId]) {
          byTestMap[canon.testId] = {
            testId: canon.testId,
            code: canon.code,
            testType: tType,
            completedCount: 0,
            uniqueUsers: new Set(),
            inProgressCount: 0,
            adminPreviewCount: 0,
            lastSubmittedAt: null
          };
        }
        const entry = byTestMap[canon.testId];
        entry.completedCount += 1;
        if (uid) entry.uniqueUsers.add(uid);
        if (a.submittedAt && (!entry.lastSubmittedAt || new Date(a.submittedAt) > new Date(entry.lastSubmittedAt))) {
          entry.lastSubmittedAt = a.submittedAt;
        }
      });

      const byTest = Object.values(byTestMap).map(e => ({
        testId: e.testId,
        code: e.code,
        testType: e.testType,
        completedCount: e.completedCount,
        uniqueStudents: e.uniqueUsers.size,
        inProgressCount: e.inProgressCount,
        adminPreviewCount: e.adminPreviewCount,
        lastSubmittedAt: e.lastSubmittedAt
      }));

      const completedTotal = exactCompletedCount !== null ? Math.max(0, exactCompletedCount - adminRows.length) : studentRows.length;
      const mockCompletedCount = studentRows.filter(r => (r.testType || 'mock') === 'mock').length;
      const chapterCompletedCount = studentRows.filter(r => r.testType === 'chapter_exercise').length;

      return {
        uniqueSubmissionsTotal: uniqueSubmissionPairs.size,
        uniqueStudentsTotal: allUniqueStudents.size,
        completedTotal,
        completedIncludingAdmin: exactCompletedCount !== null ? exactCompletedCount : (studentRows.length + adminRows.length),
        adminPreviewCount: adminRows.length,
        inProgressCount: exactInProgressCount,
        mockUniqueSubmissions: mockUniquePairs.size,
        chapterUniqueSubmissions: chapterUniquePairs.size,
        mockCompletedCount,
        chapterCompletedCount,
        byTest,
        fromRpc: false,
        error: this._lastAttemptsError?.message || null
      };
    },

    async fetchAttemptsFromCloud(userId) {
      if (!userId) return [];
      if (!window.authService.isCloudConnected()) {
        return this.getAttempts(userId);
      }
      try {
        const { data, error } = await supabaseClient
          .from('test_attempts')
          .select('*')
          .eq('user_id', userId)
          .order('submitted_at', { ascending: false });

        if (!error && data) {
          const completedRows = data.filter(d => d.status !== 'in_progress');
          const records = completedRows.map(d => ({
            id: d.id,
            testId: d.test_id,
            testCode: d.code,
            testTitle: `${d.exam_type} – ${d.code} Mock Test`,
            examType: d.exam_type,
            totalMarksScored: Number(d.obtained_marks),
            totalMaxMarks: Number(d.total_marks),
            percentage: Number(d.percentage),
            accuracy: Number(d.accuracy),
            predictedAirDisplay: d.estimated_rank_label,
            completedAt: d.submitted_at,
            subjectStats: d.subject_breakdown,
            responses: d.responses,
            timePerQuestion: d.time_per_question,
            mistakeTags: d.mistake_tags
          }));
          localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(records));
          return records;
        }
      } catch (e) {}
      return this.getAttempts(userId);
    },

    getBookmarks(userId) {
      if (!userId) return [];
      try {
        const raw = localStorage.getItem(`nelov_${userId}_bookmarks`);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    isBookmarked(userId, keyOrId) {
      if (!userId || !keyOrId) return false;
      try {
        const bookmarks = this.getBookmarks(userId);
        const strKey = String(keyOrId);
        return bookmarks.some(b => 
          b.uniqueKey === strKey || 
          String(b.id) === strKey || 
          (b.uniqueKey && b.uniqueKey.endsWith(`_${strKey}`))
        );
      } catch (e) {
        return false;
      }
    },

    async toggleBookmark(userId, question) {
      if (!userId || !question) return false;
      const testId = question.testId || 'jee-advanced-pta-04';
      const uniqueKey = question.uniqueKey || `${testId}_${question.id}`;
      const bookmarks = this.getBookmarks(userId);
      const idx = bookmarks.findIndex(b => b.uniqueKey === uniqueKey);

      let isNowBookmarked = false;
      if (idx !== -1) {
        bookmarks.splice(idx, 1);
        isNowBookmarked = false;

        if (window.authService.isCloudConnected()) {
          emitSyncStatus('saving', 'Updating bookmark');
          try {
            await supabaseClient
              .from('bookmarks')
              .delete()
              .match({ user_id: userId, test_id: testId, question_id: String(question.id) });
          } catch (e) {}
          try {
            await supabaseClient
              .from('question_notes_and_mistakes')
              .update({
                is_bookmarked: false,
                updated_at: new Date().toISOString()
              })
              .match({ user_id: userId, question_id: String(uniqueKey) });
            emitSyncStatus('saved', 'Saved');
          } catch (e) {}
        }
      } else {
        const newBookmark = {
          id: question.id,
          uniqueKey,
          testId,
          testCode: question.testCode || 'PTA 04',
          subject: question.subject || 'General',
          section: question.section || '',
          type: question.type || 'Single Correct',
          question: question.question || '',
          images: question.images || [],
          options: question.options || [],
          answer: question.answer,
          explanation: question.explanation || '',
          solution: question.solution || question.explanation || '',
          addedAt: new Date().toISOString(),
          mistakeTag: question.mistakeTag,
          personalNote: question.personalNote
        };
        bookmarks.unshift(newBookmark);
        isNowBookmarked = true;

        if (window.authService.isCloudConnected()) {
          emitSyncStatus('saving', 'Saving bookmark');
          try {
            await supabaseClient.from('bookmarks').upsert({
              user_id: userId,
              test_id: testId,
              question_id: String(question.id),
              exam_type: question.examType || 'JEE Advanced',
              subject: question.subject || 'General',
              question_type: question.type || 'Single Correct',
              mistake_tag: question.mistakeTag || null,
              personal_note: question.personalNote || null,
              created_at: new Date().toISOString()
            });
          } catch (e) {}
          try {
            await supabaseClient.from('question_notes_and_mistakes').upsert({
              user_id: userId,
              question_id: String(uniqueKey),
              test_id: testId,
              subject: question.subject || 'General',
              chapter_id: question.chapterId || question.chapter_id || null,
              question_data: {
                id: question.id,
                uniqueKey,
                testId,
                testCode: question.testCode || 'PTA 04',
                subject: question.subject || 'General',
                section: question.section || '',
                type: question.type || 'Single Correct',
                question: question.question || '',
                images: question.images || [],
                options: question.options || [],
                answer: question.answer,
                explanation: question.explanation || '',
                solution: question.solution || question.explanation || ''
              },
              is_bookmarked: true,
              is_mistake: Boolean(question.mistakeTag || question.isMistake),
              personal_note: question.personalNote || '',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,question_id' });
            emitSyncStatus('saved', 'Saved');
          } catch (e) {}
        }
      }

      try {
        localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
      } catch (e) {}
      return isNowBookmarked;
    },

    async updateMistakeTag(userId, uniqueKey, tag, personalNote) {
      if (!userId || !uniqueKey) return;
      const bookmarks = this.getBookmarks(userId);
      const item = bookmarks.find(b => b.uniqueKey === uniqueKey);
      if (item) {
        item.mistakeTag = tag;
        if (personalNote !== undefined) item.personalNote = personalNote;
        try {
          localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
        } catch (e) {}

        if (window.authService.isCloudConnected()) {
          emitSyncStatus('saving', 'Saving note');
          try {
            await supabaseClient
              .from('bookmarks')
              .update({
                mistake_tag: tag,
                personal_note: personalNote || item.personalNote
              })
              .match({ user_id: userId, test_id: item.testId, question_id: String(item.id) });
          } catch (e) {}
          try {
            await supabaseClient.from('question_notes_and_mistakes').upsert({
              user_id: userId,
              question_id: String(uniqueKey),
              test_id: item.testId || null,
              subject: item.subject || 'General',
              question_data: {
                id: item.id,
                uniqueKey,
                testId: item.testId,
                testCode: item.testCode,
                subject: item.subject,
                question: item.question,
                options: item.options,
                answer: item.answer,
                solution: item.solution || item.explanation,
                mistakeTag: tag
              },
              is_bookmarked: true,
              is_mistake: Boolean(tag),
              personal_note: personalNote !== undefined ? personalNote : (item.personalNote || ''),
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,question_id' });
            emitSyncStatus('saved', 'Saved');
          } catch (e) {}
        }
      }
    },

    // --------------------------------------------------------------------------
    // ERROR REPORTS WORKFLOW
    // --------------------------------------------------------------------------
    async submitErrorReport(report) {
      const rl = checkRateLimit('error_report', 5, 15 * 60 * 1000);
      if (!rl.allowed) {
        throw new Error(`Too many submissions. Please wait ${rl.retryAfterSec}s before submitting again.`);
      }
      const cleanDesc = String(report.description || '').trim();
      if (cleanDesc.length < 5 || cleanDesc.length > 2000) {
        throw new Error('Description must be between 5 and 2000 characters.');
      }
      const allowedTypes = ['typo', 'broken_equation', 'wrong_answer_key', 'missing_diagram', 'other'];
      const cleanType = allowedTypes.includes(report.issueType) ? report.issueType : 'other';
      const item = {
        id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        userId: report.userId || null,
        reporterName: String(report.reporterName || 'Anonymous Aspirant').trim().slice(0, 120),
        reporterEmail: String(report.reporterEmail || '').trim().slice(0, 160),
        testId: String(report.testId || '').trim().slice(0, 80),
        examType: String(report.examType || '').trim().slice(0, 60),
        testCode: String(report.testCode || '').trim().slice(0, 40),
        questionId: String(report.questionId || '').slice(0, 64),
        questionNumber: Number(report.questionNumber || 1),
        issueType: cleanType,
        description: cleanDesc,
        status: 'open',
        adminNote: '',
        createdAt: new Date().toISOString()
      };

      if (window.authService.isCloudConnected()) {
        try {
          await supabaseClient.from('error_reports').insert({
            user_id: item.userId,
            reporter_name: item.reporterName,
            reporter_email: item.reporterEmail,
            test_id: item.testId,
            exam_type: item.examType,
            test_code: item.testCode,
            question_id: item.questionId,
            question_number: item.questionNumber,
            issue_type: item.issueType,
            description: item.description,
            status: 'open',
            created_at: item.createdAt
          });
        } catch (e) {
          console.warn('Failed to insert error report in cloud:', e);
        }
      }

      try {
        const raw = localStorage.getItem(ERROR_REPORTS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(item);
        localStorage.setItem(ERROR_REPORTS_KEY, JSON.stringify(list));
      } catch (e) {}

      return item;
    },

    async getAllErrorReports() {
      if (window.authService.isCloudConnected()) {
        try {
          const { data, error } = await supabaseClient
            .from('error_reports')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            return data.map(d => ({
              id: d.id,
              userId: d.user_id,
              reporterName: d.reporter_name,
              reporterEmail: d.reporter_email,
              testId: d.test_id,
              examType: d.exam_type,
              testCode: d.test_code,
              questionId: d.question_id,
              questionNumber: d.question_number,
              issueType: d.issue_type,
              description: d.description,
              status: d.status,
              adminNote: d.admin_note,
              createdAt: d.created_at
            }));
          }
        } catch (e) {}
      }

      try {
        const raw = localStorage.getItem(ERROR_REPORTS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    async updateErrorReportStatus(reportId, status, adminNote) {
      if (window.authService.isCloudConnected()) {
        try {
          await supabaseClient
            .from('error_reports')
            .update({
              status,
              admin_note: adminNote
            })
            .eq('id', reportId);
        } catch (e) {}
      }

      try {
        const raw = localStorage.getItem(ERROR_REPORTS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const item = list.find(r => r.id === reportId);
        if (item) {
          item.status = status;
          if (adminNote !== undefined) item.adminNote = adminNote;
          localStorage.setItem(ERROR_REPORTS_KEY, JSON.stringify(list));
        }
      } catch (e) {}
    },

    // --------------------------------------------------------------------------
    // DYNAMIC TEST CONFIGS
    // --------------------------------------------------------------------------
    async getTestConfigs() {
      const defaults = {
        'jee-advanced-pta-04': 'live',
        'jee-advanced-pta-05': 'live'
      };

      if (window.authService.isCloudConnected()) {
        try {
          const { data, error } = await supabaseClient.from('test_configs').select('test_id, status');
          if (!error && data) {
            const map = {};
            data.forEach(r => { map[r.test_id] = r.status; });
            // Ensure tests with verified digitized papers are always 'live'
            map['jee-mains-ptm-01'] = 'live';
            map['jee-advanced-pta-04'] = 'live';
            map['jee-advanced-pta-05'] = 'live';
            map['jee-advanced-pta-06'] = 'live';
            return map;
          }
        } catch (e) {}
      }

      try {
        const local = localStorage.getItem(TEST_CONFIGS_OVERRIDE_KEY);
        if (local) {
          return { ...defaults, ...JSON.parse(local) };
        }
      } catch (e) {}

      return defaults;
    },

    async updateTestConfigStatus(testId, status) {
      if (window.authService.isCloudConnected()) {
        try {
          await supabaseClient
            .from('test_configs')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('test_id', testId);
        } catch (e) {}
      }

      try {
        const local = localStorage.getItem(TEST_CONFIGS_OVERRIDE_KEY);
        const cur = local ? JSON.parse(local) : {};
        cur[testId] = status;
        localStorage.setItem(TEST_CONFIGS_OVERRIDE_KEY, JSON.stringify(cur));
        window.dispatchEvent(new CustomEvent('nelov_test_configs_changed', { detail: { testId, status } }));
      } catch (e) {}
    },

    async getTestConfigsDetails() {
      if (window.authService.isCloudConnected()) {
        try {
          const { data, error } = await supabaseClient.from('test_configs').select('*');
          if (!error && data) {
            return data.map(d => ({
              testId: d.test_id,
              examType: d.exam_type,
              code: d.code,
              title: d.title,
              status: d.status,
              isScheduledWindow: d.is_scheduled_window || false,
              startsAt: d.starts_at || null,
              endsAt: d.ends_at || null,
              windowLabel: d.window_label || null,
              lockLeaderboardUntilEnd: d.lock_leaderboard_until_end ?? true,
              allowPracticeAfterEnd: d.allow_practice_after_end ?? true,
              updatedAt: d.updated_at
            }));
          }
        } catch (e) {}
      }
      return [];
    },

    async updateTestSchedule(testId, scheduleData) {
      if (window.authService.isCloudConnected()) {
        try {
          const { error } = await supabaseClient
            .from('test_configs')
            .update({
              ...scheduleData,
              updated_at: new Date().toISOString()
            })
            .eq('test_id', testId);
          if (error) console.error('[Supabase] updateTestSchedule error:', error);
        } catch (e) {
          console.error('[Supabase] updateTestSchedule error:', e);
        }
      }

      try {
        const local = localStorage.getItem('nelov_test_schedules') || '{}';
        const parsed = JSON.parse(local);
        parsed[testId] = scheduleData;
        localStorage.setItem('nelov_test_schedules', JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent('nelov_test_configs_changed', { detail: { testId, scheduleData } }));
        return true;
      } catch (e) {
        return false;
      }
    },

    async getTestLeaderboard(testId) {
      const canonicalId = (() => {
        const s = String(testId || '').trim().toLowerCase();
        const mPtm = s.match(/ptm[-_\s]?0*(\d+)/i);
        if (mPtm) return `jee-mains-ptm-${String(parseInt(mPtm[1], 10)).padStart(2, '0')}`;
        const mPta = s.match(/pta[-_\s]?0*(\d+)/i);
        if (mPta) return `jee-advanced-pta-${String(parseInt(mPta[1], 10)).padStart(2, '0')}`;
        return s || 'jee-advanced-pta-04';
      })();

      if (window.authService.isCloudConnected() && supabaseClient) {
        try {
          const { data, error } = await supabaseClient.rpc('get_test_leaderboard', { p_test_id: canonicalId });
          if (!error && data) {
            const mapEntry = e => ({
              rank: e.rank,
              displayName: e.display_name || e.student_name || e.displayName || 'JEE Aspirant',
              marks: Number(e.marks ?? e.score ?? e.obtained_marks ?? 0),
              maxMarks: Number(e.max_marks ?? e.total_marks ?? e.maxMarks ?? 300),
              percentage: Number(e.percentage ?? 0),
              percentile: Number(e.percentile ?? 0),
              accuracy: Number(e.accuracy ?? 0),
              timeTakenSeconds: Number(e.time_taken_seconds ?? e.timeTakenSeconds ?? 0),
              submittedAt: e.submitted_at || e.submittedAt,
              attemptedInLiveWindow: Boolean(e.attempted_in_live_window),
              isCurrentUser: Boolean(e.is_current_user)
            });

            const rawTop5 = Array.isArray(data.top_5) ? data.top_5 : [];
            const rawAll = Array.isArray(data.all_entries) ? data.all_entries : [];
            const rawEntries = Array.isArray(data.entries) && data.entries.length > 0
              ? data.entries
              : (rawTop5.length > 0 ? rawTop5 : rawAll);

            const top5 = (rawTop5.length > 0 ? rawTop5 : rawEntries.slice(0, 5)).map(mapEntry);
            const allEntries = rawAll.map(mapEntry);
            const entries = rawEntries.map(mapEntry);

            return {
              locked: false,
              unlocksAt: null,
              totalParticipants: Number(data.total_participants || 0),
              averageMarks: Number(data.average_marks ?? data.avg_marks ?? 0),
              highestMarks: Number(data.highest_marks ?? 0),
              topper: data.topper ? mapEntry(data.topper) : (top5[0] || null),
              top5,
              allEntries,
              myStanding: data.my_standing ? mapEntry(data.my_standing) : null,
              entries,
              myAttemptSubmitted: Boolean(data.my_attempt_submitted),
              error: null
            };
          }
          console.error('[Supabase] get_test_leaderboard rpc error:', error);
          return {
            locked: false,
            unlocksAt: null,
            totalParticipants: 0,
            averageMarks: 0,
            highestMarks: 0,
            topper: null,
            top5: [],
            allEntries: [],
            myStanding: null,
            entries: [],
            myAttemptSubmitted: false,
            error: error?.message || 'Unable to load leaderboard from server.'
          };
        } catch (e) {
          console.warn('[Supabase] get_test_leaderboard rpc error:', e);
          return {
            locked: false,
            unlocksAt: null,
            totalParticipants: 0,
            averageMarks: 0,
            highestMarks: 0,
            topper: null,
            top5: [],
            allEntries: [],
            myStanding: null,
            entries: [],
            myAttemptSubmitted: false,
            error: e?.message || 'Network error while loading leaderboard.'
          };
        }
      }

      return await this.calculateLocalTestLeaderboard(canonicalId);
    },

    async calculateLocalTestLeaderboard(testId) {
      let all = [];
      try {
        all = (this.getAllAttempts ? await this.getAllAttempts() : []) || [];
      } catch (e) {
        all = [];
      }
      if (!Array.isArray(all)) all = [];

      const currentUser = window.authService?.getCurrentUser ? window.authService.getCurrentUser() : null;
      const currentUid = currentUser?.id;

      const isAdminUser = a => {
        const email = (a.userEmail || a.email || a.profiles?.email || a.candidateEmail || '').toLowerCase().trim();
        const role = (a.role || a.profiles?.role || '').toLowerCase().trim();
        return email === 'mallicknelov@gmail.com' || role === 'admin';
      };

      const isCurrentAdmin =
        (currentUser?.email || '').toLowerCase().trim() === 'mallicknelov@gmail.com' ||
        currentUser?.role === 'admin';

      const norm = id => (id || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetNorm = norm(testId);

      // Filter by testId, exclude Admin attempts, and pick BEST attempt per user (highest marks)
      const userBestAttemptsMap = {};
      all
        .filter(a => {
          if (isAdminUser(a)) return false;
          const tNorm = norm(a.testId);
          const cNorm = norm(a.testCode || a.code);
          return tNorm === targetNorm || cNorm === targetNorm || targetNorm.endsWith(cNorm) || (cNorm && targetNorm.includes(cNorm));
        })
        .forEach(a => {
          const uId = a.userId || a.user_id;
          if (!uId) return;
          const currentBest = userBestAttemptsMap[uId];
          if (!currentBest) {
            userBestAttemptsMap[uId] = a;
          } else {
            const scoreCurrent = Number(a.totalMarksScored ?? a.obtained_marks ?? a.obtainedMarks ?? 0);
            const scoreBest = Number(currentBest.totalMarksScored ?? currentBest.obtained_marks ?? currentBest.obtainedMarks ?? 0);
            if (scoreCurrent > scoreBest) {
              userBestAttemptsMap[uId] = a;
            } else if (scoreCurrent === scoreBest) {
              const accCurrent = Number(a.accuracy ?? 0);
              const accBest = Number(currentBest.accuracy ?? 0);
              if (accCurrent > accBest) {
                userBestAttemptsMap[uId] = a;
              } else if (accCurrent === accBest) {
                const timeCurrent = Number(a.timeTakenSeconds || a.time_taken_seconds || 999999);
                const timeBest = Number(currentBest.timeTakenSeconds || currentBest.time_taken_seconds || 999999);
                if (timeCurrent < timeBest) {
                  userBestAttemptsMap[uId] = a;
                }
              }
            }
          }
        });

      const bestAttempts = Object.values(userBestAttemptsMap);
      const totalParticipants = bestAttempts.length;

      if (totalParticipants === 0) {
        return {
          locked: false,
          unlocksAt: null,
          totalParticipants: 0,
          averageMarks: 0,
          highestMarks: 0,
          topper: null,
          top5: [],
          myStanding: null,
          entries: [],
          myAttemptSubmitted: false
        };
      }

      bestAttempts.sort((a, b) => {
        const scoreA = Number(a.totalMarksScored ?? a.obtained_marks ?? a.obtainedMarks ?? 0);
        const scoreB = Number(b.totalMarksScored ?? b.obtained_marks ?? b.obtainedMarks ?? 0);
        if (scoreB !== scoreA) return scoreB - scoreA;
        const accA = Number(a.accuracy ?? 0);
        const accB = Number(b.accuracy ?? 0);
        if (accB !== accA) return accB - accA;
        return (a.timeTakenSeconds || a.time_taken_seconds || 0) - (b.timeTakenSeconds || b.time_taken_seconds || 0);
      });

      const highestMarks = Number(bestAttempts[0]?.totalMarksScored ?? bestAttempts[0]?.obtained_marks ?? bestAttempts[0]?.obtainedMarks ?? 0);
      const avgMarks = Math.round((bestAttempts.reduce((sum, a) => sum + Number(a.totalMarksScored ?? a.obtained_marks ?? a.obtainedMarks ?? 0), 0) / totalParticipants) * 10) / 10;

      const entries = bestAttempts.map((a, index) => {
        const rank = index + 1;
        const myScore = Number(a.totalMarksScored ?? a.obtained_marks ?? a.obtainedMarks ?? 0);
        const countBelowOrEqual = bestAttempts.filter(other => Number(other.totalMarksScored ?? other.obtained_marks ?? other.obtainedMarks ?? 0) <= myScore).length;
        const percentile = Math.round((countBelowOrEqual / totalParticipants) * 10000) / 100;
        const uId = a.userId || a.user_id;

        return {
          rank,
          displayName: a.candidateName || a.studentName || a.profiles?.full_name || 'JEE Aspirant',
          marks: myScore,
          maxMarks: Number(a.totalMaxMarks ?? a.total_marks ?? a.totalMarks ?? 300),
          percentage: Number(a.percentage ?? 0),
          percentile,
          accuracy: Number(a.accuracy ?? 0),
          timeTakenSeconds: a.timeTakenSeconds || a.time_taken_seconds || 0,
          submittedAt: a.completedAt || a.submitted_at || a.submittedAt,
          attemptedInLiveWindow: !!(a.attemptedInLiveWindow || a.attempted_in_live_window),
          isCurrentUser: !isCurrentAdmin && currentUid === uId
        };
      });

      const topper = entries[0] || null;
      const myStanding = isCurrentAdmin ? null : (entries.find(e => e.isCurrentUser) || null);
      const myAttemptSubmitted = isCurrentAdmin ? false : !!bestAttempts.find(a => (a.userId || a.user_id) === currentUid);

      return {
        locked: false,
        unlocksAt: null,
        totalParticipants,
        averageMarks: avgMarks,
        highestMarks,
        topper,
        top5: entries.slice(0, 5),
        myStanding,
        entries: entries.slice(0, 100),
        myAttemptSubmitted
      };
    },

    async getTestToppersSummary() {
      if (window.authService.isCloudConnected()) {
        try {
          const { data, error } = await supabaseClient.rpc('get_test_toppers_summary');
          if (!error && Array.isArray(data)) {
            return data.map(d => ({
              testId: d.test_id,
              code: d.code,
              title: d.title,
              examType: d.exam_type,
              isScheduledWindow: d.is_scheduled_window || false,
              startsAt: d.starts_at || null,
              endsAt: d.ends_at || null,
              windowLabel: d.window_label || null,
              isLocked: d.is_locked || false,
              totalParticipants: d.total_participants || 0,
              topperName: d.topper_name || null,
              topperMarks: d.topper_marks || null,
              maxMarks: d.max_marks || null,
              topperPercentile: d.topper_percentile || null
            }));
          }
        } catch (e) {
          console.warn('[Supabase] get_test_toppers_summary fallback:', e);
        }
      }
      return [];
    },

    async getOverallLeaderboard() {
      if (window.authService.isCloudConnected()) {
        try {
          const { data, error } = await supabaseClient.rpc('get_overall_leaderboard');
          if (!error && Array.isArray(data)) {
            return data.map(d => ({
              rank: d.rank,
              displayName: d.display_name,
              testsAttempted: d.tests_attempted,
              avgPercentile: d.avg_percentile,
              avgMarksPercent: d.avg_marks_percent,
              totalMarksScored: d.total_marks_scored,
              totalMaxMarks: d.total_max_marks,
              isCurrentUser: d.is_current_user
            }));
          }
        } catch (e) {
          console.warn('[Supabase] get_overall_leaderboard fallback:', e);
        }
      }
      return [];
    },

    getUserStats(userId) {
      const attempts = this.getAttempts(userId);
      if (attempts.length === 0) {
        return {
          totalTests: 0,
          averageScorePct: 0,
          bestScorePct: 0,
          totalQuestionsAttempted: 0,
          overallAccuracy: 0,
          recentPredictedAir: 'Not Available'
        };
      }

      const totalPct = attempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
      const bestPct = Math.max(...attempts.map(a => a.percentage || 0));
      const totalAttemptedQuestions = attempts.reduce((acc, a) => acc + (a.attemptedCount || 0), 0);
      const avgAccuracy = Math.round(attempts.reduce((acc, a) => acc + (a.accuracy || 0), 0) / attempts.length);

      return {
        totalTests: attempts.length,
        averageScorePct: Math.round(totalPct / attempts.length),
        bestScorePct: Math.round(bestPct),
        totalQuestionsAttempted: totalAttemptedQuestions,
        overallAccuracy: avgAccuracy,
        recentPredictedAir: attempts[0]?.predictedAirDisplay || 'Qualified'
      };
    },

    async saveLectureProgress(userId, chapterSlug, videoId, lectureNumber, completed, personalNote) {
      const updatedAt = new Date().toISOString();
      if (window.authService && window.authService.isCloudConnected() && supabaseClient && userId) {
        try {
          await supabaseClient.from('lecture_progress').upsert({
            user_id: userId,
            chapter_slug: chapterSlug,
            video_id: videoId,
            lecture_number: lectureNumber,
            completed: !!completed,
            personal_note: personalNote || null,
            updated_at: updatedAt
          }, { onConflict: 'user_id,video_id' });
        } catch (e) {
          console.warn('[Supabase] Failed to sync lecture progress:', e);
        }
      }

      try {
        const key = `nelov_${userId}_lecture_progress`;
        const raw = localStorage.getItem(key);
        const current = raw ? JSON.parse(raw) : {};
        current[videoId] = {
          userId,
          chapterSlug,
          videoId,
          lectureNumber,
          completed: !!completed,
          personalNote: personalNote !== undefined ? personalNote : (current[videoId]?.personalNote || ''),
          updatedAt
        };
        localStorage.setItem(key, JSON.stringify(current));
      } catch (e) {}
    },

    getLectureProgress(userId) {
      if (!userId) return {};
      try {
        const raw = localStorage.getItem(`nelov_${userId}_lecture_progress`);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    },

    getTotalLecturesCompleted(userId) {
      const progress = this.getLectureProgress(userId);
      return Object.values(progress).filter(p => p && p.completed).length;
    },

    getTestAttemptsCount(userId, testId) {
      const attempts = this.getAttempts(userId);
      return attempts.filter(a => a.testId === testId).length;
    },

    canAttemptTest(userId, testId) {
      return this.getTestAttemptsCount(userId, testId) < 3;
    },

    async getProfilesWithStatus() {
      if (window.authService && window.authService.isCloudConnected() && supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) {
            console.error('[Supabase] getAllProfiles error:', error);
            return { data: [], error };
          }
          return { data: data || [], error: null };
        } catch (e) {
          console.error('[Supabase] getAllProfiles exception:', e);
          return { data: [], error: e };
        }
      }
      return {
        data: (window.authService && window.authService.getAllUsers) ? window.authService.getAllUsers() : [],
        error: null
      };
    },

    async getAllProfiles() {
      const res = await this.getProfilesWithStatus();
      if (res.data && res.data.length > 0) return res.data;
      return (window.authService && window.authService.getAllUsers) ? window.authService.getAllUsers() : [];
    },

    async getAllBookmarks() {
      if (window.authService && window.authService.isCloudConnected() && supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('bookmarks').select('*');
          if (!error && data) return data;
        } catch (e) {}
      }
      const allLocal = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nelov_') && key.endsWith('_bookmarks')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) allLocal.push(...list);
            }
          }
        }
      } catch (e) {}
      return allLocal;
    },

    async getAllLectureProgress() {
      if (window.authService && window.authService.isCloudConnected() && supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('lecture_progress').select('*');
          if (!error && data) return data;
        } catch (e) {}
      }
      const allLocal = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nelov_') && key.endsWith('_lecture_progress')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const obj = JSON.parse(raw);
              if (obj && typeof obj === 'object') Object.values(obj).forEach(v => allLocal.push(v));
            }
          }
        }
      } catch (e) {}
      return allLocal;
    },

    async loadCloudLectureProgress(userId) {
      if (!userId || !window.authService || !window.authService.isCloudConnected() || !supabaseClient) return;
      try {
        const { data, error } = await supabaseClient
          .from('lecture_progress')
          .select('*')
          .eq('user_id', userId);
        if (!error && data && data.length > 0) {
          const local = this.getLectureProgress(userId);
          data.forEach(row => {
            local[row.video_id] = {
              userId,
              chapterSlug: row.chapter_slug,
              videoId: row.video_id,
              lectureNumber: row.lecture_number,
              completed: row.completed,
              personalNote: row.personal_note || '',
              updatedAt: row.updated_at
            };
          });
          localStorage.setItem(`nelov_${userId}_lecture_progress`, JSON.stringify(local));
        }
      } catch (e) {}
    },

    async acceptTerms(version = '2026-11', parentalConsent = false) {
      const current = this.getCurrentUser();
      if (!current) return null;
      const now = new Date().toISOString();
      current.acceptedTermsAt = now;
      current.acceptedTermsVersion = version;
      current.parentalConsentConfirmed = parentalConsent;

      // 1. Immediate Local Storage & User Consent Cache
      try {
        localStorage.setItem(`consent_v2026_11_${current.id}`, now);
      } catch (e) {}
      this.setActiveSession(current);

      if (this.isCloudConnected() && supabaseClient) {
        // Step A: Supabase Auth metadata
        try {
          // Save consent to Supabase Auth metadata
          await supabaseClient.auth.updateUser({
            data: {
              accepted_terms_at: now,
              accepted_terms_version: version,
              parental_consent_confirmed: parentalConsent
            }
          });
        } catch (e) {
          console.warn('[authStore] Supabase updateUser notice:', e);
        }

        // Step B: Resilient upsert to public.profiles
        try {
          // Upsert consent to public.profiles
          await supabaseClient
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
          console.warn('[authStore] Error saving terms consent to Supabase (non-fatal):', e);
        }
      }
      return current;
    },

    async deleteMyAccount() {
      const current = this.getCurrentUser();
      if (!current) throw new Error('Authentication required.');
      if (current.role === 'admin') {
        throw new Error('Admin accounts cannot be self-deleted to prevent accidental management lockouts.');
      }

      if (this.isCloudConnected() && supabaseClient) {
        const { error } = await supabaseClient.rpc('delete_my_account');
        if (error) {
          throw new Error(error.message || 'Failed to delete account on server.');
        }
      }

      // Scrub local client storage keys for this user
      try {
        const uId = current.id;
        const keysToDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.includes(uId) || k.startsWith(`nelov_${uId}_`))) {
            keysToDelete.push(k);
          }
        }
        keysToDelete.forEach(k => localStorage.removeItem(k));
        const localUsers = getStoredUsers().filter(u => u.id !== uId);
        setStoredUsers(localUsers);
      } catch (e) {}

      await this.logOut();
      return { success: true };
    }
  };

  // Listen for Supabase session changes if initialized
  if (supabaseClient) {
    const processSession = async (session) => {
      if (!session || !session.user) return;
      const isPhone = Boolean(session.user.email && session.user.email.endsWith('@phone.nelovportal.local'));
      let role = 'student';
      let fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || (isPhone ? 'Student Aspirant' : (session.user.email ? session.user.email.split('@')[0] : 'Student Aspirant'));
      let contactNumber = session.user.user_metadata?.contact_number || null;
      let authMethod = isPhone ? 'phone' : (session.user.app_metadata?.provider === 'google' ? 'google' : (isGmail(session.user.email) ? 'gmail' : 'email'));
      let displayEmail = isPhone ? null : session.user.email;
      let targetExam = session.user.user_metadata?.preferred_exam || session.user.user_metadata?.target_exam || 'JEE 2027';
      let avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null;
      let localGoal = 30;
      try {
        const lp = JSON.parse(localStorage.getItem(`nelov_${session.user.id}_daily_planner_v1`) || 'null');
        if (lp?.dailyTarget) localGoal = Number(lp.dailyTarget);
      } catch (e) {}
      let dailyQuestionGoal = Number(session.user.user_metadata?.daily_question_goal || localGoal || 30);
      let currentStreak = 0;
      const localConsent = typeof window !== 'undefined' ? localStorage.getItem(`consent_v2026_11_${session.user.id}`) : null;
      let acceptedTermsAt = session.user.user_metadata?.accepted_terms_at || localConsent || new Date().toISOString();
      let acceptedTermsVersion = session.user.user_metadata?.accepted_terms_version || '2026-11';
      let parentalConsentConfirmed = Boolean(session.user.user_metadata?.parental_consent_confirmed);

      try {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (profile) {
          role = profile.role === 'admin' ? 'admin' : 'student';
          if (profile.full_name) fullName = profile.full_name;
          if (profile.contact_number) contactNumber = profile.contact_number;
          if (profile.auth_method) authMethod = profile.auth_method;
          if (profile.target_exam) {
            targetExam = (profile.target_exam === 'Both' && session.user.user_metadata?.preferred_exam)
              ? session.user.user_metadata.preferred_exam
              : profile.target_exam;
          }
          if (profile.avatar_url) avatarUrl = profile.avatar_url;
          if (profile.daily_question_goal) dailyQuestionGoal = Number(profile.daily_question_goal);
          if (profile.current_streak !== undefined && profile.current_streak !== null) currentStreak = Number(profile.current_streak) || 0;
          if (profile.email && !profile.email.includes('@phone.nelovportal.local')) displayEmail = profile.email;
          if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
          if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
          if (profile.parental_consent_confirmed !== null && profile.parental_consent_confirmed !== undefined) {
            parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
          }
        }

        if (acceptedTermsAt && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`consent_v2026_11_${session.user.id}`, acceptedTermsAt);
          } catch (e) {}
        }

        if (!profile) {
          const safeExam = targetExam === 'JEE 2027' ? 'Both' : targetExam;
          const safeMethod = (authMethod === 'email') ? 'gmail' : authMethod;
          await supabaseClient.from('profiles').upsert({
            id: session.user.id,
            full_name: fullName,
            email: displayEmail,
            contact_number: contactNumber,
            auth_method: safeMethod,
            target_exam: safeExam,
            role: 'student',
            accepted_terms_at: acceptedTermsAt,
            accepted_terms_version: acceptedTermsVersion,
            parental_consent_confirmed: parentalConsentConfirmed,
            last_login_at: new Date().toISOString()
          }, { onConflict: 'id', ignoreDuplicates: true });
        } else if (!profile.accepted_terms_at) {
          await supabaseClient.from('profiles').update({
            accepted_terms_at: acceptedTermsAt,
            accepted_terms_version: acceptedTermsVersion,
            last_login_at: new Date().toISOString()
          }).eq('id', session.user.id);
        }
      } catch (e) {
        console.warn('Profile sync notice on login:', e);
      }

      const user = {
        id: session.user.id,
        name: fullName,
        email: displayEmail,
        contactNumber,
        authMethod,
        targetExam,
        avatarUrl,
        dailyQuestionGoal,
        currentStreak,
        role,
        acceptedTermsAt,
        acceptedTermsVersion,
        parentalConsentConfirmed,
        createdAt: session.user.created_at
      };
      window.authService.setActiveSession(user);
      if (window.cloudSyncEngine?.hydrateAndMigrateOnLogin) {
        window.cloudSyncEngine.hydrateAndMigrateOnLogin(user).catch(err => {
          console.warn('[Sync] Cloud hydration notice on login:', err);
        });
      } else if (window.studentStorage?.syncLocalAttemptsToSupabase) {
        window.studentStorage.syncLocalAttemptsToSupabase().catch(err => {
          console.warn('[Sync] Auto-recovery sync notice on login:', err);
        });
      }

      const saved = sessionStorage.getItem(REDIRECT_KEY);
      if (saved) {
        sessionStorage.removeItem(REDIRECT_KEY);
        window.location.hash = saved;
      }
    };

    // Immediately check session on init
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) processSession(session);
    }).catch(err => console.warn('getSession init error:', err));

    // Handle all auth state events
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (session) await processSession(session);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('nelov_password_recovery', { detail: { session } }));
          if (!String(window.location.hash || '').includes('recovery=1')) {
            window.location.hash = '#/login?recovery=1';
          }
        }
        return;
      }
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session) {
        await processSession(session);
      } else if (event === 'SIGNED_OUT') {
        window.authService.logOut({ skipSupabaseSignOut: true });
      }
    });
  }

  
  // ============================================================================
  // CHAPTERWISE PROGRESS & MASTERY STORE (0-100% Checklist + Test Count Engine)
  // Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
  // ============================================================================
  const CHAPTER_PROGRESS_KEY = 'nelov_chapter_progress';
  const CHAPTER_PROGRESS_EVENT = 'nelov:chapter-progress-updated';

  window.chapterProgressStore = {
    getAllProgress(userId) {
      try {
        const uId = userId || (window.authService?.getCurrentUser()?.id) || 'guest';
        const raw = localStorage.getItem('nelov_' + uId + '_chapter_progress');
        const guestRaw = localStorage.getItem(CHAPTER_PROGRESS_KEY);
        let store = {};
        if (guestRaw) {
          try { Object.assign(store, JSON.parse(guestRaw)); } catch (e) {}
        }
        if (raw && raw !== guestRaw) {
          try { Object.assign(store, JSON.parse(raw)); } catch (e) {}
        }
        return store;
      } catch (e) {
        return {};
      }
    },

    getChapterProgress(subject, chapterSlug, chapterCode, exercises, userId) {
      const all = this.getAllProgress(userId);
      const subNorm = (subject || '').toLowerCase().trim();
      const slugNorm = (chapterSlug || '').toLowerCase().trim();
      const key = subNorm + ':' + slugNorm;
      const existing = all[key] || all[slugNorm] || null;

      const testsCount = this.getChapterTestsCount(subject, chapterSlug, chapterCode, exercises, userId);

      let checklist = {
        notes: false,
        formula: false,
        pyqs: false,
        tests: false
      };

      if (existing && existing.checklist) {
        checklist = {
          notes: Boolean(existing.checklist.notes),
          formula: Boolean(existing.checklist.formula),
          pyqs: Boolean(existing.checklist.pyqs),
          tests: Boolean(existing.checklist.tests)
        };
      }

      // Auto-mark tests if student has attempted at least one test
      if (testsCount > 0 && !checklist.tests) {
        checklist.tests = true;
      }

      const checkedCount = [checklist.notes, checklist.formula, checklist.pyqs, checklist.tests].filter(Boolean).length;
      const progressPercent = Math.round((checkedCount / 4) * 100);

      return {
        checklist,
        progressPercent,
        testsGivenCount: testsCount
      };
    },

    getChapterTestsCount(subject, chapterSlug, chapterCode, exercises, userId) {
      try {
        const uId = userId || (window.authService?.getCurrentUser()?.id) || 'guest';
        let attempts = [];
        if (window.studentStorage?.getAttempts) {
          attempts = window.studentStorage.getAttempts(uId) || [];
        } else {
          const raw = localStorage.getItem('nelov_' + uId + '_attempts') || localStorage.getItem('nelov_guest_attempts');
          if (raw) attempts = JSON.parse(raw);
        }

        const rawVault = localStorage.getItem('nelov_vault_exercise_attempts');
        if (rawVault) {
          try {
            const parsed = JSON.parse(rawVault);
            if (Array.isArray(parsed)) attempts = attempts.concat(parsed);
          } catch (e) {}
        }

        if (!Array.isArray(attempts) || attempts.length === 0) return 0;

        const normSlug = (chapterSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const normCode = (chapterCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const exerciseIds = new Set((exercises || []).map(e => String(e.id || '').toLowerCase()));

        let count = 0;
        const countedKeys = new Set();

        for (const att of attempts) {
          if (!att) continue;
          const dedupeKey = att.id || (att.testId + '_' + (att.completedAt || '') + '_' + (att.percentage || ''));
          if (countedKeys.has(dedupeKey)) continue;

          const tId = String(att.testId || att.testCode || '').toLowerCase();
          const attSlug = String(att.chapterSlug || att.chapterId || '').toLowerCase().replace(/[^a-z0-9]/g, '');

          let matches = false;
          if (exerciseIds.has(tId)) {
            matches = true;
          } else if (normSlug && (attSlug === normSlug || tId.startsWith(normSlug + '-') || tId.startsWith(normSlug + '_') || tId.includes(normSlug))) {
            matches = true;
          } else if (normCode && (attSlug === normCode || tId.startsWith(normCode + '-') || tId.startsWith(normCode + '_') || tId.includes(normCode))) {
            matches = true;
          }

          if (matches) {
            count++;
            countedKeys.add(dedupeKey);
          }
        }
        return count;
      } catch (e) {
        return 0;
      }
    },

    setMilestone(subject, chapterSlug, milestone, value, userId) {
      const all = this.getAllProgress(userId);
      const subNorm = (subject || '').toLowerCase().trim();
      const slugNorm = (chapterSlug || '').toLowerCase().trim();
      const key = subNorm + ':' + slugNorm;
      const existing = all[key] || {
        subject: subNorm,
        chapterSlug: slugNorm,
        checklist: { notes: false, formula: false, pyqs: false, tests: false },
        progressPercent: 0,
        updatedAt: new Date().toISOString()
      };

      const newChecklist = {
        ...existing.checklist,
        [milestone]: Boolean(value)
      };

      const checkedCount = [newChecklist.notes, newChecklist.formula, newChecklist.pyqs, newChecklist.tests].filter(Boolean).length;
      const progressPercent = Math.round((checkedCount / 4) * 100);

      const updated = {
        subject: subNorm,
        chapterSlug: slugNorm,
        checklist: newChecklist,
        progressPercent,
        updatedAt: new Date().toISOString()
      };

      all[key] = updated;

      try {
        const uId = userId || (window.authService?.getCurrentUser()?.id) || 'guest';
        localStorage.setItem('nelov_' + uId + '_chapter_progress', JSON.stringify(all));
        localStorage.setItem(CHAPTER_PROGRESS_KEY, JSON.stringify(all));
      } catch (e) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(CHAPTER_PROGRESS_EVENT, { detail: updated }));
      }

      this.syncChapterToSupabase(updated, userId);
      return updated;
    },

    async syncChapterToSupabase(data, userId) {
      if (!isConfigured || !supabaseClient) return;
      try {
        const uId = userId || (window.authService?.getCurrentUser()?.id);
        if (!uId || uId === 'guest') return;
        const { data: sessData } = await supabaseClient.auth.getSession();
        if (!sessData?.session?.user) return;

        emitSyncStatus('saving', 'Saving chapter progress');
        const subLower = data.subject.toLowerCase();
        const slugLower = data.chapterSlug.toLowerCase();
        const chk = data.checklist || {};
        const payload = {
          user_id: uId,
          subject: subLower,
          chapter_slug: slugLower,
          chapter_id: `${subLower}:${slugLower}`,
          checklist: chk,
          theory_completed: Boolean(chk.notes || chk.formula),
          exercises_completed: Boolean(chk.pyqs || chk.tests),
          progress_percent: data.progressPercent,
          updated_at: data.updatedAt || new Date().toISOString()
        };

        let { error } = await supabaseClient
          .from('chapter_progress')
          .upsert(payload, { onConflict: 'user_id,subject,chapter_slug' });

        if (error && (error.status === 400 || error.code === '42703' || /column|schema cache/i.test(error.message || ''))) {
          delete payload.chapter_id;
          delete payload.theory_completed;
          delete payload.exercises_completed;
          const retryRes = await supabaseClient
            .from('chapter_progress')
            .upsert(payload, { onConflict: 'user_id,subject,chapter_slug' });
          error = retryRes.error;
        }

        if (error) {
          console.warn('[ChapterProgress] Supabase sync warning:', error.message);
        } else {
          emitSyncStatus('saved', 'Saved');
        }
      } catch (e) {
        console.warn('[ChapterProgress] Supabase sync exception:', e);
      }
    },

    async fetchProgressFromSupabase(userId) {
      if (!isConfigured || !supabaseClient) return this.getAllProgress(userId);
      try {
        const uId = userId || (window.authService?.getCurrentUser()?.id);
        if (!uId || uId === 'guest') return this.getAllProgress(userId);
        const { data: sessData } = await supabaseClient.auth.getSession();
        if (!sessData?.session?.user) return this.getAllProgress(userId);

        const { data, error } = await supabaseClient
          .from('chapter_progress')
          .select('*')
          .eq('user_id', uId);

        if (error || !data) return this.getAllProgress(userId);

        const all = this.getAllProgress(userId);
        data.forEach(row => {
          const key = (row.subject || '').toLowerCase() + ':' + (row.chapter_slug || '').toLowerCase();
          all[key] = {
            subject: row.subject,
            chapterSlug: row.chapter_slug,
            checklist: row.checklist || { notes: false, formula: false, pyqs: false, tests: false },
            progressPercent: row.progress_percent || 0,
            updatedAt: row.updated_at || new Date().toISOString()
          };
        });

        localStorage.setItem('nelov_' + uId + '_chapter_progress', JSON.stringify(all));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(CHAPTER_PROGRESS_EVENT, { detail: all }));
        }
        return all;
      } catch (e) {
        return this.getAllProgress(userId);
      }
    }
  };

  window.chapterProgressService = window.chapterProgressStore;

  // ============================================================================
  // DAILY GOAL, STREAK & 24-HOUR STUDY PLANNER STORE
  // Keyed by YYYY-MM-DD local date, persisted in localStorage + optional cloud
  // ============================================================================
  const DAILY_PLANNER_EVENT = 'nelov:daily-planner-updated';
  const DAILY_PLANNER_DEFAULT_ACTIVITIES = [
    { id: 'sleep', label: 'Sleep', color: '#6366F1', isStudy: false },
    { id: 'school', label: 'School', color: '#10B981', isStudy: false },
    { id: 'coaching', label: 'Coaching', color: '#F59E0B', isStudy: false },
    { id: 'self-study', label: 'Self study', color: '#3B82F6', isStudy: true },
    { id: 'revision', label: 'Revision', color: '#14B8A6', isStudy: true },
    { id: 'test', label: 'Test', color: '#F43F5E', isStudy: true },
    { id: 'break', label: 'Break', color: '#EC4899', isStudy: false },
    { id: 'misc', label: 'Misc', color: '#64748B', isStudy: false }
  ];
  const DAILY_PLANNER_STAGES = ['No stage', 'Theory', 'Practice', 'Revision', 'PYQs', 'Completed'];

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function parseDateKeyLocal(dateKey) {
    const parts = String(dateKey || '').split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
    }
    return new Date();
  }

  function toLocalDateKey(d) {
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) {
      const now = new Date();
      return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    }
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
  }

  function buildAllSlotKeys() {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      slots.push(`${pad2(h)}:00`);
      slots.push(`${pad2(h)}:30`);
    }
    return slots;
  }

  window.dailyPlannerStore = {
    EVENT_NAME: DAILY_PLANNER_EVENT,
    DEFAULT_ACTIVITIES: DAILY_PLANNER_DEFAULT_ACTIVITIES,
    STAGES: DAILY_PLANNER_STAGES,
    ALL_SLOT_KEYS: buildAllSlotKeys(),

    getLocalDateKey(d) {
      return toLocalDateKey(d || new Date());
    },

    shiftDateKey(dateKey, deltaDays) {
      const dt = parseDateKeyLocal(dateKey);
      dt.setDate(dt.getDate() + deltaDays);
      return toLocalDateKey(dt);
    },

    getWeekDates(anchorDateKey) {
      const dt = parseDateKeyLocal(anchorDateKey);
      const dayOfWeek = dt.getDay(); // 0 = Sun ... 6 = Sat
      const sunday = new Date(dt);
      sunday.setDate(dt.getDate() - dayOfWeek);
      const days = [];
      const weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      for (let i = 0; i < 7; i++) {
        const cur = new Date(sunday);
        cur.setDate(sunday.getDate() + i);
        const key = toLocalDateKey(cur);
        days.push({
          dateKey: key,
          weekday: weekdayLabels[i],
          dayNum: cur.getDate()
        });
      }
      return days;
    },

    formatDisplayDate(dateKey) {
      const dt = parseDateKeyLocal(dateKey);
      const title = dt.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      const todayKey = toLocalDateKey(new Date());
      const yestKey = this.shiftDateKey(todayKey, -1);
      const tomKey = this.shiftDateKey(todayKey, 1);
      let relative = String(dt.getFullYear());
      if (dateKey === todayKey) relative = 'Today';
      else if (dateKey === yestKey) relative = 'Yesterday';
      else if (dateKey === tomKey) relative = 'Tomorrow';
      return { title, relative };
    },

    _resolveUserId(userId) {
      return userId || (window.authService?.getCurrentUser()?.id) || 'guest';
    },

    getStore(userId) {
      const uId = this._resolveUserId(userId);
      const base = {
        dailyTarget: 30,
        customActivities: [],
        days: {}
      };
      try {
        const userRaw = localStorage.getItem(`nelov_${uId}_daily_planner_v1`);
        const guestRaw = localStorage.getItem('nelov_daily_planner_v1');
        if (guestRaw && uId === 'guest') {
          return { ...base, ...JSON.parse(guestRaw) };
        }
        if (userRaw) {
          return { ...base, ...JSON.parse(userRaw) };
        }
        if (guestRaw) {
          return { ...base, ...JSON.parse(guestRaw) };
        }
      } catch (e) {}
      return base;
    },

    _cloudSyncTimer: null,
    _dirtyDateKeys: new Set(),

    saveStore(store, userId, changedDateKey) {
      const uId = this._resolveUserId(userId);
      try {
        localStorage.setItem(`nelov_${uId}_daily_planner_v1`, JSON.stringify(store));
        if (uId === 'guest') {
          localStorage.setItem('nelov_daily_planner_v1', JSON.stringify(store));
        }
      } catch (e) {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(DAILY_PLANNER_EVENT, { detail: store }));
      }
      if (changedDateKey) this._dirtyDateKeys.add(changedDateKey);
      this.syncCloudIfAuthenticated(store, uId, changedDateKey);
      return store;
    },

    async syncCloudIfAuthenticated(store, userId, changedDateKey) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!isConfigured || !supabaseClient || !userId || userId === 'guest' || !uuidRegex.test(String(userId))) {
        emitSyncStatus('saved', 'Saved locally');
        return;
      }

      emitSyncStatus('saving', 'Syncing study plan');
      if (this._cloudSyncTimer) clearTimeout(this._cloudSyncTimer);
      this._cloudSyncTimer = setTimeout(async () => {
        try {
          const { data: sessData } = await supabaseClient.auth.getSession();
          const authUid = sessData?.session?.user?.id;
          if (!authUid || !uuidRegex.test(authUid)) return;

          const latestStore = this.getStore(authUid);
          const keysToSync = this._dirtyDateKeys.size > 0
            ? Array.from(this._dirtyDateKeys)
            : (changedDateKey ? [changedDateKey] : [toLocalDateKey(new Date())]);
          this._dirtyDateKeys.clear();

          const customActs = latestStore.customActivities || [];
          const upserts = keysToSync.map((dKey) => {
            const dPlan = (latestStore.days && latestStore.days[dKey]) || {};
            return {
              user_id: authUid,
              plan_date: dKey,
              topics: Array.isArray(dPlan.topics) ? dPlan.topics : [],
              timetable_blocks: dPlan.slots && typeof dPlan.slots === 'object' ? dPlan.slots : {},
              custom_activities: customActs,
              questions_solved_today: Number(dPlan.manualSolvedCount || 0),
              updated_at: dPlan.updatedAt || new Date().toISOString()
            };
          });

          let usedMetadataFallback = false;
          if (upserts.length > 0 && !this._dailyPlansMissing) {
            const { error: dpErr } = await supabaseClient
              .from('daily_plans')
              .upsert(upserts, { onConflict: 'user_id,plan_date' });
            if (dpErr) {
              if (dpErr.status === 404 || dpErr.code === '42P01' || /daily_plans|schema cache|not find/i.test(dpErr.message || '')) {
                this._dailyPlansMissing = true;
                usedMetadataFallback = true;
              }
            }
          } else if (this._dailyPlansMissing) {
            usedMetadataFallback = true;
          }

          const todayKey = toLocalDateKey(new Date());
          const computedStreak = this.getStreak(todayKey, authUid);
          if (!this._profileGoalColMissing) {
            const { error: pErr } = await supabaseClient.from('profiles').update({
              daily_question_goal: Number(latestStore.dailyTarget || 30),
              current_streak: computedStreak,
              last_active_date: todayKey,
              updated_at: new Date().toISOString()
            }).eq('id', authUid);
            if (pErr && (pErr.status === 400 || pErr.code === '42703' || /column|schema cache/i.test(pErr.message || ''))) {
              this._profileGoalColMissing = true;
              usedMetadataFallback = true;
            }
          } else {
            usedMetadataFallback = true;
          }

          if (usedMetadataFallback) {
            await supabaseClient.auth.updateUser({
              data: {
                nelov_daily_planner_v1: latestStore,
                daily_question_goal: Number(latestStore.dailyTarget || 30)
              }
            });
          }

          const curUser = window.authService?.getCurrentUser?.();
          if (curUser && curUser.id === authUid) {
            if (curUser.dailyQuestionGoal !== latestStore.dailyTarget || curUser.currentStreak !== computedStreak) {
              curUser.dailyQuestionGoal = latestStore.dailyTarget;
              curUser.currentStreak = computedStreak;
              try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(curUser));
              } catch (e) {}
            }
          }

          emitSyncStatus('saved', 'Saved to cloud');
        } catch (e) {
          emitSyncStatus('offline', e?.message || 'Cloud sync queued');
        }
      }, 650);
    },

    getAllActivities(userId) {
      const st = this.getStore(userId);
      return [...DAILY_PLANNER_DEFAULT_ACTIVITIES, ...(st.customActivities || [])];
    },

    addCustomActivity(label, color, isStudy, userId) {
      const clean = String(label || '').trim();
      if (!clean) return null;
      const st = this.getStore(userId);
      const id = 'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5);
      const act = { id, label: clean, color: color || '#8B5CF6', isStudy: Boolean(isStudy) };
      st.customActivities = [...(st.customActivities || []), act];
      this.saveStore(st, userId);
      return act;
    },

    getDayPlan(dateKey, userId) {
      const st = this.getStore(userId);
      const d = (st.days && st.days[dateKey]) || {};
      return {
        topics: Array.isArray(d.topics) ? d.topics : [],
        slots: d.slots && typeof d.slots === 'object' ? d.slots : {},
        manualSolvedCount: Number(d.manualSolvedCount || 0)
      };
    },

    _mutateDay(dateKey, mutator, userId) {
      const st = this.getStore(userId);
      if (!st.days) st.days = {};
      const current = this.getDayPlan(dateKey, userId);
      const updated = mutator({
        topics: [...current.topics],
        slots: { ...current.slots },
        manualSolvedCount: current.manualSolvedCount
      });
      st.days[dateKey] = {
        ...updated,
        updatedAt: new Date().toISOString()
      };
      this.saveStore(st, userId, dateKey);
      return st.days[dateKey];
    },

    setDailyTarget(target, userId) {
      const num = Math.max(1, Math.min(500, Math.round(Number(target) || 30)));
      const st = this.getStore(userId);
      st.dailyTarget = num;
      this.saveStore(st, userId, toLocalDateKey(new Date()));
      return num;
    },

    adjustManualSolved(dateKey, delta, userId) {
      return this._mutateDay(dateKey, (day) => ({
        ...day,
        manualSolvedCount: Math.max(0, (day.manualSolvedCount || 0) + Number(delta || 0))
      }), userId);
    },

    addTopic(dateKey, text, stage = 'No stage', userId) {
      const clean = String(text || '').trim().slice(0, 200);
      if (!clean) return null;
      const item = {
        id: 'top_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5),
        text: clean,
        stage: stage || 'No stage',
        done: stage === 'Completed',
        createdAt: new Date().toISOString()
      };
      this._mutateDay(dateKey, (day) => ({
        ...day,
        topics: [...day.topics, item]
      }), userId);
      return item;
    },

    toggleTopic(dateKey, topicId, userId) {
      return this._mutateDay(dateKey, (day) => ({
        ...day,
        topics: day.topics.map((t) =>
          t.id === topicId
            ? { ...t, done: !t.done, stage: !t.done && t.stage === 'No stage' ? 'Completed' : (t.done && t.stage === 'Completed' ? 'No stage' : t.stage) }
            : t
        )
      }), userId);
    },

    updateTopicStage(dateKey, topicId, stage, userId) {
      return this._mutateDay(dateKey, (day) => ({
        ...day,
        topics: day.topics.map((t) =>
          t.id === topicId ? { ...t, stage, done: stage === 'Completed' ? true : t.done } : t
        )
      }), userId);
    },

    deleteTopic(dateKey, topicId, userId) {
      return this._mutateDay(dateKey, (day) => ({
        ...day,
        topics: day.topics.filter((t) => t.id !== topicId)
      }), userId);
    },

    paintSlots(dateKey, slotKeys, activityIdOrNull, userId) {
      return this._mutateDay(dateKey, (day) => {
        const nextSlots = { ...day.slots };
        (slotKeys || []).forEach((sk) => {
          if (!activityIdOrNull || activityIdOrNull === 'erase') {
            delete nextSlots[sk];
          } else {
            nextSlots[sk] = activityIdOrNull;
          }
        });
        return { ...day, slots: nextSlots };
      }, userId);
    },

    copyDayPlan(fromDateKey, toDateKey, userId) {
      if (!fromDateKey || !toDateKey || fromDateKey === toDateKey) return null;
      const src = this.getDayPlan(fromDateKey, userId);
      return this._mutateDay(toDateKey, (day) => ({
        ...day,
        slots: { ...src.slots },
        topics: [
          ...day.topics,
          ...src.topics.map((t) => ({
            ...t,
            id: 'top_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5),
            done: false
          }))
        ]
      }), userId);
    },

    clearDayPlan(dateKey, userId) {
      return this._mutateDay(dateKey, () => ({
        topics: [],
        slots: {},
        manualSolvedCount: 0
      }), userId);
    },

    getBacklog(currentDateKey, userId) {
      const st = this.getStore(userId);
      const items = [];
      const keys = Object.keys(st.days || {}).sort((a, b) => (a < b ? 1 : -1));
      keys.forEach((dKey) => {
        if (dKey >= currentDateKey) return;
        const dPlan = st.days[dKey];
        (dPlan?.topics || []).forEach((t) => {
          if (!t.done) {
            items.push({ ...t, dateKey: dKey });
          }
        });
      });
      return items;
    },

    moveBacklogToDate(fromDateKey, topicId, targetDateKey, userId) {
      if (!fromDateKey || !topicId || !targetDateKey) return;
      const st = this.getStore(userId);
      const srcTopics = st.days?.[fromDateKey]?.topics || [];
      const found = srcTopics.find((t) => t.id === topicId);
      if (!found) return;
      this.deleteTopic(fromDateKey, topicId, userId);
      this.addTopic(targetDateKey, found.text, found.stage, userId);
    },

    getSavedDateKeys(userId) {
      const st = this.getStore(userId);
      return Object.keys(st.days || {})
        .filter((k) => {
          const d = st.days[k];
          return (d?.topics?.length > 0) || (d?.slots && Object.keys(d.slots).length > 0);
        })
        .sort((a, b) => (a < b ? 1 : -1));
    },

    getQuestionsSolvedOnDate(dateKey, userId) {
      const uId = this._resolveUserId(userId);
      const plan = this.getDayPlan(dateKey, uId);
      let solvedFromAttempts = 0;
      if (uId !== 'guest' && window.studentStorage?.getAttempts) {
        const attempts = window.studentStorage.getAttempts(uId) || [];
        attempts.forEach((a) => {
          const dt = a.completedAt || a.date;
          if (!dt) return;
          if (toLocalDateKey(new Date(dt)) === dateKey) {
            const cnt = Number(a.attemptedCount ?? (a.responses ? Object.keys(a.responses).length : 0));
            solvedFromAttempts += isNaN(cnt) ? 0 : cnt;
          }
        });
      }
      return solvedFromAttempts + (plan.manualSolvedCount || 0);
    },

    computeBreakdown(slots, userId) {
      const activities = this.getAllActivities(userId);
      const actMap = {};
      activities.forEach((a) => { actMap[a.id] = a; });

      const countsById = {};
      let totalHalfHours = 0;
      let studyHalfHours = 0;

      Object.values(slots || {}).forEach((actId) => {
        if (!actId || !actMap[actId]) return;
        totalHalfHours += 1;
        countsById[actId] = (countsById[actId] || 0) + 1;
        if (actMap[actId].isStudy) {
          studyHalfHours += 1;
        }
      });

      const studyHours = studyHalfHours * 0.5;
      const plannedHours = Math.min(24, totalHalfHours * 0.5);
      const freeHours = Math.max(0, 24 - plannedHours);

      const segments = Object.keys(countsById).map((id) => ({
        id,
        label: actMap[id].label,
        color: actMap[id].color,
        hours: countsById[id] * 0.5,
        pct: Math.round((countsById[id] * 0.5 / 24) * 1000) / 10
      }));

      return { studyHours, plannedHours, freeHours, segments };
    },

    getStreak(todayKey, userId) {
      const st = this.getStore(userId);
      const target = st.dailyTarget || 30;
      const isDayActive = (dKey) => {
        const solved = this.getQuestionsSolvedOnDate(dKey, userId);
        const dayPlan = this.getDayPlan(dKey, userId);
        const completedTopic = (dayPlan.topics || []).some((t) => t.done);
        const plannedStudy = this.computeBreakdown(dayPlan.slots, userId).studyHours > 0;
        return solved >= target || completedTopic || plannedStudy;
      };

      let streak = 0;
      let cursor = todayKey;
      if (isDayActive(cursor)) {
        streak++;
        cursor = this.shiftDateKey(cursor, -1);
        while (isDayActive(cursor) && streak < 365) {
          streak++;
          cursor = this.shiftDateKey(cursor, -1);
        }
      } else {
        // Allow active streak up to yesterday to keep showing until today is done
        cursor = this.shiftDateKey(cursor, -1);
        while (isDayActive(cursor) && streak < 365) {
          streak++;
          cursor = this.shiftDateKey(cursor, -1);
        }
      }
      return streak;
    }
  };

  // ============================================================================
  // CLOUD SYNC ENGINE & FIRST-LOGIN GUEST MIGRATION
  // ============================================================================
  window.cloudSyncEngine = {
    SYNC_EVENT: SYNC_STATUS_EVENT,

    getSyncStatus() {
      return { ...syncStatusState };
    },

    subscribeSyncStatus(listener) {
      if (typeof window === 'undefined' || typeof listener !== 'function') return () => {};
      const handler = (e) => listener(e.detail || syncStatusState);
      window.addEventListener(SYNC_STATUS_EVENT, handler);
      return () => window.removeEventListener(SYNC_STATUS_EVENT, handler);
    },

    migrateGuestLocalData(userId) {
      if (!userId || userId === 'guest') return false;
      const migratedFlagKey = `nelov_guest_migrated_${userId}`;
      let changedAny = false;

      // 1. Merge Guest Daily Planner (topics, timetable slots, customActivities, manualSolvedCount, dailyTarget)
      try {
        const guestRaw = localStorage.getItem('nelov_guest_daily_planner_v1') || localStorage.getItem('nelov_daily_planner_v1');
        if (guestRaw) {
          const guestPlan = JSON.parse(guestRaw);
          const userPlanKey = `nelov_${userId}_daily_planner_v1`;
          const existingRaw = localStorage.getItem(userPlanKey);
          const userPlan = existingRaw
            ? JSON.parse(existingRaw)
            : { dailyTarget: 30, customActivities: [], days: {} };

          if (guestPlan && typeof guestPlan === 'object') {
            if (!existingRaw && guestPlan.dailyTarget) {
              userPlan.dailyTarget = guestPlan.dailyTarget;
            }
            const existingActIds = new Set((userPlan.customActivities || []).map(a => a.id));
            (guestPlan.customActivities || []).forEach(a => {
              if (a && !existingActIds.has(a.id)) {
                userPlan.customActivities = [...(userPlan.customActivities || []), a];
                existingActIds.add(a.id);
                changedAny = true;
              }
            });
            const guestDays = guestPlan.days || {};
            Object.keys(guestDays).forEach(dKey => {
              const gDay = guestDays[dKey] || {};
              const uDay = userPlan.days?.[dKey];
              if (!uDay) {
                if (!userPlan.days) userPlan.days = {};
                userPlan.days[dKey] = gDay;
                changedAny = true;
              } else {
                const seenTopIds = new Set((uDay.topics || []).map(t => t.id));
                const seenTopText = new Set((uDay.topics || []).map(t => String(t.text || '').trim().toLowerCase()));
                const mergedTopics = [...(uDay.topics || [])];
                (gDay.topics || []).forEach(t => {
                  const txt = String(t.text || '').trim().toLowerCase();
                  if (!seenTopIds.has(t.id) && !seenTopText.has(txt)) {
                    mergedTopics.push(t);
                    changedAny = true;
                  }
                });
                const mergedSlots = { ...(gDay.slots || {}), ...(uDay.slots || {}) };
                const mergedManual = Math.max(Number(uDay.manualSolvedCount || 0), Number(gDay.manualSolvedCount || 0));
                if (Object.keys(mergedSlots).length !== Object.keys(uDay.slots || {}).length || mergedManual > Number(uDay.manualSolvedCount || 0)) {
                  changedAny = true;
                }
                userPlan.days[dKey] = {
                  ...uDay,
                  topics: mergedTopics,
                  slots: mergedSlots,
                  manualSolvedCount: mergedManual,
                  updatedAt: uDay.updatedAt || gDay.updatedAt || new Date().toISOString()
                };
              }
            });
            localStorage.setItem(userPlanKey, JSON.stringify(userPlan));
            localStorage.removeItem('nelov_guest_daily_planner_v1');
            localStorage.removeItem('nelov_daily_planner_v1');
          }
        }
      } catch (e) {}

      // 2. Merge Guest Chapter Progress
      try {
        const guestCpRaw = localStorage.getItem('nelov_guest_chapter_progress');
        if (guestCpRaw) {
          const guestCp = JSON.parse(guestCpRaw);
          const userCpKey = `nelov_${userId}_chapter_progress`;
          const userCp = JSON.parse(localStorage.getItem(userCpKey) || '{}');
          Object.keys(guestCp || {}).forEach(k => {
            if (!userCp[k] || (guestCp[k].progressPercent || 0) > (userCp[k].progressPercent || 0)) {
              userCp[k] = guestCp[k];
              changedAny = true;
            }
          });
          localStorage.setItem(userCpKey, JSON.stringify(userCp));
          localStorage.removeItem('nelov_guest_chapter_progress');
        }
      } catch (e) {}

      // 3. Merge Guest Bookmarks & Mistakes
      try {
        const gBmRaw = localStorage.getItem('nelov_guest_bookmarks');
        if (gBmRaw) {
          const gBm = JSON.parse(gBmRaw);
          const uBmKey = `nelov_${userId}_bookmarks`;
          const uBm = JSON.parse(localStorage.getItem(uBmKey) || '[]');
          const seen = new Set(uBm.map(b => b.uniqueKey));
          (gBm || []).forEach(b => {
            if (b && !seen.has(b.uniqueKey)) {
              uBm.push(b);
              seen.add(b.uniqueKey);
              changedAny = true;
            }
          });
          localStorage.setItem(uBmKey, JSON.stringify(uBm));
          localStorage.removeItem('nelov_guest_bookmarks');
        }
      } catch (e) {}

      // 4. Merge Guest Test Attempts & In-Progress Sessions
      try {
        const gAttRaw = localStorage.getItem('nelov_guest_attempts');
        if (gAttRaw) {
          const gAtt = JSON.parse(gAttRaw);
          const uAttKey = `nelov_${userId}_attempts`;
          const uAtt = JSON.parse(localStorage.getItem(uAttKey) || '[]');
          const seenAtt = new Set(uAtt.map(a => a.id));
          (gAtt || []).forEach(a => {
            if (a && !seenAtt.has(a.id)) {
              uAtt.push({ ...a, userId });
              seenAtt.add(a.id);
              changedAny = true;
            }
          });
          localStorage.setItem(uAttKey, JSON.stringify(uAtt));
          localStorage.removeItem('nelov_guest_attempts');
        }

        const sessionKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('nelov_guest_session_')) sessionKeys.push(k);
        }
        sessionKeys.forEach(k => {
          const testId = k.slice('nelov_guest_session_'.length);
          const targetKey = `nelov_${userId}_session_${testId}`;
          if (!localStorage.getItem(targetKey)) {
            localStorage.setItem(targetKey, localStorage.getItem(k));
            changedAny = true;
          }
          localStorage.removeItem(k);
        });
      } catch (e) {}

      try {
        localStorage.setItem(migratedFlagKey, new Date().toISOString());
      } catch (e) {}

      if (changedAny && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(DAILY_PLANNER_EVENT, { detail: window.dailyPlannerStore?.getStore?.(userId) }));
        window.dispatchEvent(new CustomEvent(CHAPTER_PROGRESS_EVENT, { detail: window.chapterProgressStore?.getAllProgress?.(userId) }));
      }
      return changedAny;
    },

    async syncQuestionNoteOrMistake(userId, entry) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!userId || !entry || !entry.questionId) return;
      const bookmarks = window.studentStorage.getBookmarks(userId);
      const uKey = entry.uniqueKey || `${entry.testId || 'general'}_${entry.questionId}`;
      let item = bookmarks.find(b => b.uniqueKey === uKey || String(b.id) === String(entry.questionId));
      if (!item) {
        item = {
          id: entry.questionId,
          uniqueKey: uKey,
          testId: entry.testId || 'general',
          testCode: entry.testCode || '',
          subject: entry.subject || 'General',
          chapterId: entry.chapterId || null,
          question: entry.question || entry.questionData?.question || '',
          options: entry.options || entry.questionData?.options || [],
          answer: entry.answer ?? entry.questionData?.answer,
          solution: entry.solution || entry.questionData?.solution || '',
          isMistake: Boolean(entry.isMistake),
          isRevised: Boolean(entry.isRevised),
          isBookmarked: entry.isBookmarked !== false,
          personalNote: entry.personalNote || '',
          mistakeTag: entry.mistakeTag || (entry.isMistake ? 'Mistake' : null),
          addedAt: new Date().toISOString()
        };
        bookmarks.unshift(item);
      } else {
        if (entry.isMistake !== undefined) item.isMistake = Boolean(entry.isMistake);
        if (entry.isRevised !== undefined) item.isRevised = Boolean(entry.isRevised);
        if (entry.isBookmarked !== undefined) item.isBookmarked = Boolean(entry.isBookmarked);
        if (entry.personalNote !== undefined) item.personalNote = entry.personalNote;
        if (entry.mistakeTag !== undefined) item.mistakeTag = entry.mistakeTag;
      }
      try {
        localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
      } catch (e) {}

      if (window.authService?.isCloudConnected() && supabaseClient && uuidRegex.test(String(userId))) {
        emitSyncStatus('saving', 'Syncing mistake notebook');
        try {
          const { error } = await supabaseClient.from('question_notes_and_mistakes').upsert({
            user_id: userId,
            question_id: String(uKey),
            test_id: item.testId || null,
            subject: item.subject || 'General',
            chapter_id: item.chapterId || null,
            question_data: entry.questionData || {
              id: item.id,
              uniqueKey: item.uniqueKey,
              testId: item.testId,
              testCode: item.testCode,
              subject: item.subject,
              question: item.question,
              options: item.options,
              answer: item.answer,
              solution: item.solution,
              mistakeTag: item.mistakeTag
            },
            is_mistake: Boolean(item.isMistake),
            is_revised: Boolean(item.isRevised),
            is_bookmarked: Boolean(item.isBookmarked),
            personal_note: item.personalNote || '',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,question_id' });
          if (!error) emitSyncStatus('saved', 'Saved');
        } catch (e) {}
      }
    },

    async hydrateFromCloud(user) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!user || !user.id || !uuidRegex.test(String(user.id)) || !isConfigured || !supabaseClient) return;

      emitSyncStatus('saving', 'Syncing workspace');
      const uId = user.id;

      // 1. Hydrate daily_plans + user_metadata fallback
      try {
        const localPlan = window.dailyPlannerStore.getStore(uId);
        let planChanged = false;
        let metaGoal = null;
        try {
          const { data: userRes } = await supabaseClient.auth.getUser();
          const uMeta = userRes?.user?.user_metadata || {};
          if (uMeta.daily_question_goal) metaGoal = Number(uMeta.daily_question_goal);
          if (uMeta.nelov_daily_planner_v1 && typeof uMeta.nelov_daily_planner_v1 === 'object') {
            const mp = uMeta.nelov_daily_planner_v1;
            if (mp.dailyTarget && (!localPlan.dailyTarget || localPlan.dailyTarget === 30)) {
              localPlan.dailyTarget = Number(mp.dailyTarget);
              planChanged = true;
            }
            Object.keys(mp.days || {}).forEach(dKey => {
              const gDay = mp.days[dKey] || {};
              const lDay = localPlan.days?.[dKey];
              const gTs = gDay.updatedAt ? new Date(gDay.updatedAt).getTime() : 0;
              const lTs = lDay?.updatedAt ? new Date(lDay.updatedAt).getTime() : 0;
              if (!lDay || gTs > lTs) {
                if (!localPlan.days) localPlan.days = {};
                localPlan.days[dKey] = gDay;
                planChanged = true;
              }
            });
          }
        } catch (e) {}

        const explicitGoal = metaGoal || (user.dailyQuestionGoal && user.dailyQuestionGoal !== 30 ? Number(user.dailyQuestionGoal) : null);
        if (explicitGoal && explicitGoal !== localPlan.dailyTarget) {
          localPlan.dailyTarget = explicitGoal;
          planChanged = true;
        }

        if (!window.dailyPlannerStore._dailyPlansMissing) {
          const { data: planRows, error: dpErr } = await supabaseClient
            .from('daily_plans')
            .select('plan_date, topics, timetable_blocks, custom_activities, questions_solved_today, updated_at')
            .eq('user_id', uId)
            .order('plan_date', { ascending: false })
            .limit(90);

          if (dpErr && (dpErr.status === 404 || dpErr.code === '42P01' || /daily_plans|schema cache/i.test(dpErr.message || ''))) {
            window.dailyPlannerStore._dailyPlansMissing = true;
          } else if (Array.isArray(planRows) && planRows.length > 0) {
            const actMap = new Map((localPlan.customActivities || []).map(a => [a.id, a]));
            planRows.forEach(row => {
              (row.custom_activities || []).forEach(a => {
                if (a && a.id && !actMap.has(a.id)) {
                  actMap.set(a.id, a);
                  planChanged = true;
                }
              });
              const dKey = String(row.plan_date || '').slice(0, 10);
              if (!dKey) return;
              const localDay = localPlan.days?.[dKey];
              const cloudTs = row.updated_at ? new Date(row.updated_at).getTime() : 0;
              const localTs = localDay?.updatedAt ? new Date(localDay.updatedAt).getTime() : 0;
              if (!localDay || cloudTs >= localTs) {
                if (!localPlan.days) localPlan.days = {};
                localPlan.days[dKey] = {
                  topics: Array.isArray(row.topics) ? row.topics : [],
                  slots: row.timetable_blocks && typeof row.timetable_blocks === 'object' ? row.timetable_blocks : {},
                  manualSolvedCount: Number(row.questions_solved_today || 0),
                  updatedAt: row.updated_at || new Date().toISOString()
                };
                planChanged = true;
              }
            });
            localPlan.customActivities = Array.from(actMap.values());
          }
        }
        if (planChanged) {
          localStorage.setItem(`nelov_${uId}_daily_planner_v1`, JSON.stringify(localPlan));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(DAILY_PLANNER_EVENT, { detail: localPlan }));
          }
        }
      } catch (e) {}

      // 2. Hydrate question_notes_and_mistakes into local bookmarks & mistakes cache
      try {
        if (!this._notesTableMissing) {
          const { data: noteRows, error: noteErr } = await supabaseClient
            .from('question_notes_and_mistakes')
            .select('*')
            .eq('user_id', uId)
            .order('updated_at', { ascending: false });

          if (noteErr && (noteErr.status === 404 || noteErr.code === '42P01' || /question_notes_and_mistakes|schema cache/i.test(noteErr.message || ''))) {
            this._notesTableMissing = true;
          } else if (Array.isArray(noteRows) && noteRows.length > 0) {
            const localBms = window.studentStorage.getBookmarks(uId);
            const bmMap = new Map(localBms.map(b => [b.uniqueKey, b]));
            noteRows.forEach(row => {
              const qd = row.question_data || {};
              const uKey = String(row.question_id);
              const existing = bmMap.get(uKey) || {};
              bmMap.set(uKey, {
                ...existing,
                id: qd.id || existing.id || uKey,
                uniqueKey: uKey,
                testId: row.test_id || qd.testId || existing.testId || 'general',
                testCode: qd.testCode || existing.testCode || '',
                subject: row.subject || qd.subject || existing.subject || 'General',
                chapterId: row.chapter_id || existing.chapterId || null,
                question: qd.question || existing.question || '',
                images: qd.images || existing.images || [],
                options: qd.options || existing.options || [],
                answer: qd.answer ?? existing.answer,
                explanation: qd.explanation || existing.explanation || '',
                solution: qd.solution || qd.explanation || existing.solution || '',
                isMistake: Boolean(row.is_mistake),
                isRevised: Boolean(row.is_revised),
                isBookmarked: row.is_bookmarked !== false,
                personalNote: row.personal_note || existing.personalNote || '',
                mistakeTag: qd.mistakeTag || existing.mistakeTag || (row.is_mistake ? 'Mistake' : null),
                updatedAt: row.updated_at || existing.updatedAt
              });
            });
            localStorage.setItem(`nelov_${uId}_bookmarks`, JSON.stringify(Array.from(bmMap.values())));
          }
        }
      } catch (e) {}

      // 3. Hydrate test_attempts (completed history + in_progress CBT resume drafts)
      try {
        const { data: attemptRows } = await supabaseClient
          .from('test_attempts')
          .select('*')
          .eq('user_id', uId)
          .order('submitted_at', { ascending: false });

        if (Array.isArray(attemptRows)) {
          const inProgress = attemptRows.filter(r => r.status === 'in_progress');
          inProgress.forEach(draft => {
            if (!draft.test_id) return;
            const sessKey = `nelov_${uId}_session_${draft.test_id}`;
            const localRaw = localStorage.getItem(sessKey);
            const localObj = localRaw ? JSON.parse(localRaw) : null;
            const cloudTs = draft.updated_at ? new Date(draft.updated_at).getTime() : 0;
            const localTs = localObj?.updatedAt ? new Date(localObj.updatedAt).getTime() : 0;
            if (!localObj || cloudTs > localTs) {
              localStorage.setItem(sessKey, JSON.stringify({
                cloudDraftId: draft.id,
                testId: draft.test_id,
                testCode: draft.code,
                responses: draft.responses || {},
                markedForReview: draft.marked_for_review || [],
                timeLeftSeconds: draft.time_remaining_seconds,
                timeRemainingSeconds: draft.time_remaining_seconds,
                timeSpentSeconds: draft.time_spent_seconds || 0,
                questionTimings: draft.time_per_question || {},
                updatedAt: draft.updated_at || new Date().toISOString()
              }));
            }
          });
          await window.studentStorage.fetchAttemptsFromCloud(uId);
        }
      } catch (e) {}

      // 4. Hydrate chapter_progress
      try {
        await window.chapterProgressStore.fetchProgressFromSupabase(uId);
      } catch (e) {}

      emitSyncStatus('saved', 'All data synced');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nelov_cloud_hydrated', { detail: { userId: uId } }));
      }
    },

    async hydrateAndMigrateOnLogin(user) {
      if (!user || !user.id) return;
      const hadGuestChanges = this.migrateGuestLocalData(user.id);
      if (hadGuestChanges) {
        // Push migrated guest data up cleanly before pulling cloud records
        const planStore = window.dailyPlannerStore?.getStore?.(user.id);
        if (planStore && planStore.days) {
          Object.keys(planStore.days).forEach(dKey => {
            window.dailyPlannerStore?._dirtyDateKeys?.add(dKey);
          });
          await window.dailyPlannerStore?.syncCloudIfAuthenticated?.(planStore, user.id);
        }
        const cpAll = window.chapterProgressStore?.getAllProgress?.(user.id) || {};
        for (const k of Object.keys(cpAll)) {
          await window.chapterProgressStore?.syncChapterToSupabase?.(cpAll[k], user.id);
        }
        const localAtts = window.studentStorage?.getAttempts?.(user.id) || [];
        if (localAtts.length > 0) {
          try {
            const qKey = 'nelov_pending_sync_attempts';
            const existingQ = JSON.parse(localStorage.getItem(qKey) || '[]');
            const seenQ = new Set(existingQ.map(i => i.id));
            localAtts.forEach(a => { if (!seenQ.has(a.id)) existingQ.push({ ...a, userId: user.id }); });
            localStorage.setItem(qKey, JSON.stringify(existingQ));
          } catch (e) {}
        }
        const localBms = window.studentStorage?.getBookmarks?.(user.id) || [];
        for (const bm of localBms.slice(0, 50)) {
          await this.syncQuestionNoteOrMistake(user.id, {
            questionId: bm.id,
            uniqueKey: bm.uniqueKey,
            testId: bm.testId,
            testCode: bm.testCode,
            subject: bm.subject,
            chapterId: bm.chapterId,
            questionData: bm,
            isBookmarked: bm.isBookmarked !== false,
            isMistake: Boolean(bm.isMistake || bm.mistakeTag),
            personalNote: bm.personalNote || '',
            mistakeTag: bm.mistakeTag
          });
        }
      }
      if (window.studentStorage?.syncLocalAttemptsToSupabase) {
        await window.studentStorage.syncLocalAttemptsToSupabase().catch(() => {});
      }
      await this.hydrateFromCloud(user);
    }
  };

  // Alias adminService to studentStorage for full backward and cross-module compatibility
  window.adminService = window.studentStorage;
})();
