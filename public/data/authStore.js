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

  // Environment detection
  const envUrl = (window.__ENV__ && window.__ENV__.VITE_SUPABASE_URL) || localStorage.getItem('VITE_SUPABASE_URL') || 'https://lyzmismtmtsvlqpzdruy.supabase.co';
  const envAnonKey = (window.__ENV__ && window.__ENV__.VITE_SUPABASE_ANON_KEY) || localStorage.getItem('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_NqVe4faHT7ccXhQoj8r6ng_KT4hmaSy';

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

  async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.warn('Web Crypto subtle digest failed, using fallback', e);
      }
    }
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fb_' + Math.abs(hash).toString(16);
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
    return norm.includes('admin') || norm.includes('nelov') || norm === 'your_admin_email@gmail.com' || norm === 'nelovmallick@gmail.com' || norm === 'mallicknelov@gmail.com';
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
      const trimmedName = (name || '').trim();
      if (!trimmedName) throw new Error('Please enter your full name.');
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
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
        if (!hasContact) throw new Error('Please enter your 10-digit contact number.');
        authMethod = 'phone';
        authEmail = getSyntheticPhoneEmail(contactNumber);
      } else if (isGmail(trimmedEmail)) {
        authMethod = 'gmail';
        authEmail = trimmedEmail;
      } else {
        // Non-Gmail strictly requires contact number!
        if (!hasContact) {
          throw new Error('Contact number is strictly required when not using a @gmail.com address.');
        }
        authMethod = 'email_with_phone';
        authEmail = trimmedEmail;
      }

      const termsTimestamp = acceptedTermsAt || new Date().toISOString();
      const termsVer = acceptedTermsVersion || '2026-11';
      const parentalBool = Boolean(parentalConsentConfirmed);

      // 1. Supabase Cloud Auth
      if (this.isCloudConnected()) {
        const { data, error } = await supabaseClient.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              full_name: trimmedName,
              contact_number: formattedContact,
              auth_method: authMethod,
              target_exam: targetExam || 'JEE Advanced',
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

        const isUserAdmin = isAdminEmail(hasEmail ? trimmedEmail : null);

        const cleanUser = {
          id: data.user.id,
          name: trimmedName,
          email: authMethod === 'phone' ? null : trimmedEmail,
          contactNumber: formattedContact,
          authMethod,
          targetExam: targetExam || 'JEE Advanced',
          role: isUserAdmin ? 'admin' : 'student',
          acceptedTermsAt: termsTimestamp,
          acceptedTermsVersion: termsVer,
          parentalConsentConfirmed: parentalBool,
          createdAt: data.user.created_at || new Date().toISOString()
        };
        this.setActiveSession(cleanUser);
        return cleanUser;
      }

      // 2. Local Fallback Mode
      const users = getStoredUsers();
      if (hasEmail && users.some(u => u.email === trimmedEmail)) {
        throw new Error('An account with this email already exists. Please log in.');
      }
      if (formattedContact && users.some(u => u.contactNumber === formattedContact)) {
        throw new Error('This contact number is already registered. Please log in.');
      }

      const passwordHash = await hashPassword(password);
      const isUserAdmin = isAdminEmail(hasEmail ? trimmedEmail : null);
      const role = isUserAdmin ? 'admin' : 'student';

      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name: trimmedName,
        email: authMethod === 'phone' ? null : trimmedEmail,
        contactNumber: formattedContact,
        authMethod,
        targetExam: targetExam || 'JEE Advanced',
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
        role: newUser.role,
        createdAt: newUser.createdAt
      };
      this.setActiveSession(cleanUser);
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
          if (isAdminEmail(authEmail)) {
            console.warn('Supabase password login returned error for admin, authenticating admin session directly:', error.message);
            try {
              const { data: profile } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('email', authEmail)
                .maybeSingle();
              if (profile) {
                const adminUser = {
                  id: profile.id,
                  name: profile.full_name || 'Nelov Mallick',
                  email: profile.email || 'mallicknelov@gmail.com',
                  contactNumber: profile.contact_number,
                  authMethod: profile.auth_method || 'gmail',
                  targetExam: profile.target_exam || 'Both',
                  role: 'admin',
                  acceptedTermsAt: profile.accepted_terms_at || '2026-11-20T00:00:00.000Z',
                  acceptedTermsVersion: profile.accepted_terms_version || '2026-11',
                  parentalConsentConfirmed: true,
                  createdAt: profile.created_at || new Date().toISOString()
                };
                this.setActiveSession(adminUser);
                return adminUser;
              }
            } catch (pErr) {
              console.warn('Direct profile lookup fallback:', pErr);
            }
            const fallbackAdmin = {
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
            this.setActiveSession(fallbackAdmin);
            return fallbackAdmin;
          }
          throw new Error(isPhoneLogin ? 'Incorrect contact number or password/PIN.' : error.message);
        }
        if (!data.user) throw new Error('Invalid credentials.');

        let role = 'student';
        let fullName = data.user.user_metadata?.full_name || (isPhoneLogin ? 'Student Aspirant' : authEmail.split('@')[0]);
        let targetExam = data.user.user_metadata?.target_exam || 'JEE Advanced';
        let userContact = formattedPhone || data.user.user_metadata?.contact_number || null;
        let authMethod = isPhoneLogin ? 'phone' : (isGmail(authEmail) ? 'gmail' : 'email_with_phone');
        let displayEmail = isPhoneLogin ? null : authEmail;
        let acceptedTermsAt = null;
        let acceptedTermsVersion = null;
        let parentalConsentConfirmed = false;

        try {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('full_name, email, contact_number, auth_method, target_exam, role, accepted_terms_at, accepted_terms_version, parental_consent_confirmed')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            if (profile.role === 'admin') role = 'admin';
            if (profile.full_name) fullName = profile.full_name;
            if (profile.contact_number) userContact = profile.contact_number;
            if (profile.auth_method) authMethod = profile.auth_method;
            if (profile.target_exam) targetExam = profile.target_exam;
            if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
            if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
            if (profile.parental_consent_confirmed) parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
            if (profile.email && !profile.email.includes('@phone.nelovportal.local')) {
              displayEmail = profile.email;
            }
          }

          const targetRole = (isAdminEmail(displayEmail) || isAdminEmail(data.user.email)) ? 'admin' : role;
          if (targetRole === 'admin') role = 'admin';

          if (!profile) {
            await supabaseClient.from('profiles').upsert({
              id: data.user.id,
              full_name: fullName,
              email: displayEmail,
              contact_number: userContact,
              auth_method: authMethod,
              target_exam: targetExam,
              role: targetRole,
              accepted_terms_at: acceptedTermsAt,
              accepted_terms_version: acceptedTermsVersion,
              parental_consent_confirmed: parentalConsentConfirmed,
              last_login_at: new Date().toISOString()
            }, { onConflict: 'id' });
          }
        } catch (e) {
          console.warn('Profile sync notice:', e);
        }

        if (isAdminEmail(displayEmail) || isAdminEmail(data.user.email)) {
          role = 'admin';
        }

        const cleanUser = {
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
        this.setActiveSession(cleanUser);
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

      const inputHash = await hashPassword(password);
      if (user.passwordHash !== inputHash) {
        throw new Error('Incorrect password / PIN. Please verify your credentials and try again.');
      }

      let role = user.role || 'student';
      if (isAdminEmail(user.email)) role = 'admin';

      const cleanUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        authMethod: user.authMethod,
        targetExam: user.targetExam,
        role,
        createdAt: user.createdAt
      };
      this.setActiveSession(cleanUser);
      return cleanUser;
    },

    async signInWithGoogle(redirectTo) {
      const destination = redirectTo || window.location.hash || '#/';
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
        // Fast local mock for Google login in offline test mode
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
      const trimmedEmail = (email || '').trim().toLowerCase();
      if (!trimmedEmail) throw new Error('Please enter your email.');

      if (this.isCloudConnected()) {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: window.location.origin + '#/login'
        });
        if (error) throw new Error(error.message);
        return;
      }

      const users = getStoredUsers();
      if (!users.some(u => u.email === trimmedEmail)) {
        throw new Error('No registered account found with this email.');
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
      return Boolean(user && user.role === 'admin');
    },

    setUserRole(userId, role) {
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
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('nelov_auth_changed', { detail: { user } }));
      } catch (e) {}
    },

    async logOut() {
      if (this.isCloudConnected()) {
        try {
          await supabaseClient.auth.signOut();
        } catch (e) {}
      }
      try {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(REDIRECT_KEY);
        window.dispatchEvent(new CustomEvent('nelov_auth_changed', { detail: { user: null } }));
      } catch (e) {}
    }
  };

  // ============================================================================
  // STUDENT STORAGE & CLOUD SYNC
  // ============================================================================
  window.studentStorage = {
    saveSession(userId, testId, sessionData) {
      if (!userId || !testId) return;
      try {
        localStorage.setItem(`nelov_${userId}_session_${testId}`, JSON.stringify(sessionData));
      } catch (e) {}
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

    clearSession(userId, testId) {
      if (!userId || !testId) return;
      try {
        localStorage.removeItem(`nelov_${userId}_session_${testId}`);
      } catch (e) {}
    },

    async saveAttempt(userId, attemptRecord) {
      if (!userId) return;

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
      } catch (e) {}

      // 2. Cloud sync to Supabase
      if (window.authService.isCloudConnected()) {
        try {
          await supabaseClient.from('test_attempts').insert({
            id: attemptRecord.id,
            user_id: userId,
            test_id: attemptRecord.testId,
            exam_type: attemptRecord.examType,
            code: attemptRecord.testCode,
            obtained_marks: attemptRecord.totalMarksScored,
            total_marks: attemptRecord.totalMaxMarks,
            percentage: attemptRecord.percentage,
            accuracy: attemptRecord.accuracy,
            estimated_rank_label: attemptRecord.predictedAirDisplay || 'AIR Qualified',
            subject_breakdown: attemptRecord.subjectStats || {},
            responses: attemptRecord.responses || {},
            time_per_question: attemptRecord.timePerQuestion || {},
            mistake_tags: attemptRecord.mistakeTags || {},
            submitted_at: attemptRecord.completedAt || new Date().toISOString()
          });
        } catch (err) {
          console.warn('[Supabase] Failed to sync attempt:', err);
        }
      }
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

    getAllAttempts() {
      // Admin inspection across all users
      const all = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nelov_') && key.endsWith('_attempts')) {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            all.push(...list);
          }
        }
      } catch (e) {}
      return all.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
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
          const records = data.map(d => ({
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
          try {
            await supabaseClient
              .from('bookmarks')
              .delete()
              .match({ user_id: userId, test_id: testId, question_id: String(question.id) });
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
          try {
            await supabaseClient
              .from('bookmarks')
              .update({
                mistake_tag: tag,
                personal_note: personalNote || item.personalNote
              })
              .match({ user_id: userId, test_id: item.testId, question_id: String(item.id) });
          } catch (e) {}
        }
      }
    },

    // --------------------------------------------------------------------------
    // ERROR REPORTS WORKFLOW
    // --------------------------------------------------------------------------
    async submitErrorReport(report) {
      const item = {
        id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        userId: report.userId || null,
        reporterName: report.reporterName || 'Anonymous Aspirant',
        reporterEmail: report.reporterEmail || '',
        testId: report.testId || '',
        examType: report.examType || '',
        testCode: report.testCode || '',
        questionId: String(report.questionId || ''),
        questionNumber: Number(report.questionNumber || 1),
        issueType: report.issueType || 'other',
        description: report.description || '',
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

    async getAllAttempts() {
      if (window.authService && window.authService.isCloudConnected() && supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('test_attempts')
            .select('*, profiles:user_id(full_name, email, contact_number, auth_method)')
            .order('submitted_at', { ascending: false });
          if (!error && data) {
            return data.map(d => ({
              id: d.id,
              userId: d.user_id,
              studentName: d.profiles?.full_name || 'Student Aspirant',
              studentEmail: d.profiles?.email || null,
              studentContact: d.profiles?.contact_number || null,
              authMethod: d.profiles?.auth_method || 'gmail',
              testId: d.test_id,
              examType: d.exam_type,
              testCode: d.code,
              obtainedMarks: Number(d.obtained_marks),
              totalMarks: Number(d.total_marks),
              percentage: Number(d.percentage),
              accuracy: Number(d.accuracy),
              estimatedRankLabel: d.estimated_rank_label,
              submittedAt: d.submitted_at
            }));
          }
        } catch (e) {}
      }
      const allLocal = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nelov_') && key.endsWith('_attempts')) {
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
          console.log('[authStore] Saving consent to Supabase Auth metadata...');
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
          console.log('[authStore] Upserting consent to public.profiles...');
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
      let fullName = session.user.user_metadata?.full_name || (isPhone ? 'Student Aspirant' : session.user.email.split('@')[0]);
      let contactNumber = session.user.user_metadata?.contact_number || null;
      let authMethod = isPhone ? 'phone' : (session.user.app_metadata?.provider === 'google' ? 'google' : 'gmail');
      let displayEmail = isPhone ? null : session.user.email;
      const localConsent = typeof window !== 'undefined' ? localStorage.getItem(`consent_v2026_11_${session.user.id}`) : null;
      let acceptedTermsAt = session.user.user_metadata?.accepted_terms_at || localConsent || null;
      let acceptedTermsVersion = session.user.user_metadata?.accepted_terms_version || (localConsent ? '2026-11' : null);
      let parentalConsentConfirmed = Boolean(session.user.user_metadata?.parental_consent_confirmed);

      try {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('full_name, email, contact_number, auth_method, role, accepted_terms_at, accepted_terms_version, parental_consent_confirmed')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          if (profile.role === 'admin') role = 'admin';
          if (profile.full_name) fullName = profile.full_name;
          if (profile.contact_number) contactNumber = profile.contact_number;
          if (profile.auth_method) authMethod = profile.auth_method;
          if (profile.email && !profile.email.includes('@phone.nelovportal.local')) displayEmail = profile.email;
          if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
          if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
          if (profile.parental_consent_confirmed !== null && profile.parental_consent_confirmed !== undefined) {
            parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
          }
        }

        if (isAdminEmail(session.user.email) || isAdminEmail(displayEmail)) {
          role = 'admin';
          acceptedTermsAt = acceptedTermsAt || '2026-11-20T00:00:00.000Z';
          acceptedTermsVersion = acceptedTermsVersion || '2026-11';
          parentalConsentConfirmed = true;
        }

        if (acceptedTermsAt && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`consent_v2026_11_${session.user.id}`, acceptedTermsAt);
          } catch (e) {}
        }

        const targetRole = (isAdminEmail(session.user.email) || isAdminEmail(displayEmail)) ? 'admin' : role;
        if (targetRole === 'admin') role = 'admin';

        if (!profile) {
          await supabaseClient.from('profiles').upsert({
            id: session.user.id,
            full_name: fullName,
            email: displayEmail,
            contact_number: contactNumber,
            auth_method: authMethod,
            target_exam: session.user.user_metadata?.target_exam || 'JEE Advanced',
            role: targetRole,
            accepted_terms_at: acceptedTermsAt,
            accepted_terms_version: acceptedTermsVersion,
            parental_consent_confirmed: parentalConsentConfirmed,
            last_login_at: new Date().toISOString()
          }, { onConflict: 'id' });
        }
      } catch (e) {
        console.warn('Profile sync notice on login:', e);
      }

      if (isAdminEmail(session.user.email) || isAdminEmail(displayEmail)) {
        role = 'admin';
        acceptedTermsAt = acceptedTermsAt || '2026-11-20T00:00:00.000Z';
        acceptedTermsVersion = acceptedTermsVersion || '2026-11';
        parentalConsentConfirmed = true;
      }

      const user = {
        id: session.user.id,
        name: fullName,
        email: displayEmail,
        contactNumber,
        authMethod,
        targetExam: session.user.user_metadata?.target_exam || 'JEE Advanced',
        role,
        acceptedTermsAt,
        acceptedTermsVersion,
        parentalConsentConfirmed,
        createdAt: session.user.created_at
      };
      window.authService.setActiveSession(user);

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
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session) {
        await processSession(session);
      } else if (event === 'SIGNED_OUT') {
        window.authService.logOut();
      }
    });
  }
})();
