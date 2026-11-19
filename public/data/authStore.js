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
  const envUrl = (window.__ENV__ && window.__ENV__.VITE_SUPABASE_URL) || localStorage.getItem('VITE_SUPABASE_URL') || '';
  const envAnonKey = (window.__ENV__ && window.__ENV__.VITE_SUPABASE_ANON_KEY) || localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '';

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

  // ============================================================================
  // AUTH SERVICE
  // ============================================================================
  window.authService = {
    isCloudConnected() {
      return Boolean(isConfigured && supabaseClient);
    },

    getSupabaseClient() {
      return supabaseClient;
    },

    async signUp({ name, email, password, targetExam }) {
      const trimmedEmail = (email || '').trim().toLowerCase();
      const trimmedName = (name || '').trim();

      if (!trimmedName) throw new Error('Please enter your full name.');
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        throw new Error('Please provide a valid email address.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // 1. Supabase Cloud Auth
      if (this.isCloudConnected()) {
        const { data, error } = await supabaseClient.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedName,
              target_exam: targetExam || 'JEE Advanced'
            }
          }
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Registration failed. Please try again.');

        const cleanUser = {
          id: data.user.id,
          name: trimmedName,
          email: trimmedEmail,
          targetExam: targetExam || 'JEE Advanced',
          role: 'student',
          createdAt: data.user.created_at || new Date().toISOString()
        };
        this.setActiveSession(cleanUser);
        return cleanUser;
      }

      // 2. Local Fallback Mode
      const users = getStoredUsers();
      if (users.some(u => u.email === trimmedEmail)) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      const passwordHash = await hashPassword(password);
      // Auto-assign admin role to the first user or if email contains 'admin' or 'nelov' for easy test access
      const isFirst = users.length === 0;
      const isAdminEmail = trimmedEmail.includes('admin') || trimmedEmail.includes('nelov');
      const role = (isFirst || isAdminEmail) ? 'admin' : 'student';

      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name: trimmedName,
        email: trimmedEmail,
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
        targetExam: newUser.targetExam,
        role: newUser.role,
        createdAt: newUser.createdAt
      };
      this.setActiveSession(cleanUser);
      return cleanUser;
    },

    async logIn({ email, password }) {
      const trimmedEmail = (email || '').trim().toLowerCase();
      if (!trimmedEmail || !password) {
        throw new Error('Please provide both email and password.');
      }

      // 1. Supabase Cloud Auth
      if (this.isCloudConnected()) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: trimmedEmail,
          password
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Invalid email or password.');

        let role = 'student';
        let fullName = data.user.user_metadata?.full_name || trimmedEmail.split('@')[0];
        let targetExam = data.user.user_metadata?.target_exam || 'JEE Advanced';

        try {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('full_name, target_exam, role')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            if (profile.role === 'admin') role = 'admin';
            if (profile.full_name) fullName = profile.full_name;
            if (profile.target_exam) targetExam = profile.target_exam;
          }
        } catch (e) {}

        const cleanUser = {
          id: data.user.id,
          name: fullName,
          email: trimmedEmail,
          targetExam,
          role,
          createdAt: data.user.created_at || new Date().toISOString()
        };
        this.setActiveSession(cleanUser);
        return cleanUser;
      }

      // 2. Local Fallback Mode
      const users = getStoredUsers();
      const user = users.find(u => u.email === trimmedEmail);
      if (!user) {
        throw new Error('No account found with this email. Please sign up for free.');
      }

      const inputHash = await hashPassword(password);
      if (user.passwordHash !== inputHash) {
        throw new Error('Incorrect password. Please verify your credentials and try again.');
      }

      const cleanUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        targetExam: user.targetExam,
        role: user.role || 'student',
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
        name: u.name,
        email: u.email,
        targetExam: u.targetExam,
        role: u.role || 'student',
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
    }
  };

  // Listen for Supabase session changes if initialized
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && session.user) {
        const user = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          email: session.user.email,
          targetExam: session.user.user_metadata?.target_exam || 'JEE Advanced',
          role: 'student',
          createdAt: session.user.created_at
        };
        window.authService.setActiveSession(user);

        const saved = sessionStorage.getItem(REDIRECT_KEY);
        if (saved) {
          sessionStorage.removeItem(REDIRECT_KEY);
          window.location.hash = saved;
        }
      } else if (event === 'SIGNED_OUT') {
        window.authService.logOut();
      }
    });
  }
})();
