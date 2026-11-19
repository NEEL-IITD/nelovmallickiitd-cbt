(function() {
  const USERS_KEY = 'nelov_users_store';
  const SESSION_KEY = 'nelov_active_session';

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

  window.authService = {
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

      const users = getStoredUsers();
      if (users.some(u => u.email === trimmedEmail)) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      const passwordHash = await hashPassword(password);
      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name: trimmedName,
        email: trimmedEmail,
        targetExam: targetExam || 'JEE Advanced',
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
        createdAt: user.createdAt
      };
      this.setActiveSession(cleanUser);
      return cleanUser;
    },

    getCurrentUser() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    setActiveSession(user) {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (e) {}
    },

    logOut() {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (e) {}
    },

    async resetPassword(email, newPassword) {
      const trimmedEmail = (email || '').trim().toLowerCase();
      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long.');
      }

      const users = getStoredUsers();
      const idx = users.findIndex(u => u.email === trimmedEmail);
      if (idx === -1) {
        throw new Error('No registered account found with this email.');
      }

      users[idx].passwordHash = await hashPassword(newPassword);
      saveStoredUsers(users);
      return true;
    }
  };

  // Student storage scoped per user ID
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

    saveAttempt(userId, attemptRecord) {
      if (!userId) return;
      try {
        const attempts = this.getAttempts(userId);
        attempts.unshift(attemptRecord);
        localStorage.setItem(`nelov_${userId}_attempts`, JSON.stringify(attempts));
      } catch (e) {}
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

    getBookmarks(userId) {
      if (!userId) return [];
      try {
        const raw = localStorage.getItem(`nelov_${userId}_bookmarks`);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    toggleBookmark(userId, item) {
      if (!userId) return false;
      try {
        const bookmarks = this.getBookmarks(userId);
        const idx = bookmarks.findIndex(b => b.id === item.id);
        if (idx !== -1) {
          bookmarks.splice(idx, 1);
          localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
          return false;
        } else {
          bookmarks.unshift({ ...item, userId, addedAt: new Date().toISOString() });
          localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
          return true;
        }
      } catch (e) {
        return false;
      }
    },

    isBookmarked(userId, bookmarkId) {
      if (!userId) return false;
      const bookmarks = this.getBookmarks(userId);
      return bookmarks.some(b => b.id === bookmarkId || b.uniqueKey === bookmarkId);
    },

    updateMistakeTag(userId, bookmarkId, tag) {
      if (!userId) return;
      try {
        const bookmarks = this.getBookmarks(userId);
        const target = bookmarks.find(b => b.id === bookmarkId || b.uniqueKey === bookmarkId);
        if (target) {
          target.mistakeTag = tag;
          localStorage.setItem(`nelov_${userId}_bookmarks`, JSON.stringify(bookmarks));
        }
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
          recentPredictedAir: 'Not Attempted Yet'
        };
      }
      const totalTests = attempts.length;
      const totalScorePct = attempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
      const averageScorePct = Math.round(totalScorePct / totalTests);
      const bestScorePct = Math.max(...attempts.map(a => a.percentage || 0));
      const totalQuestionsAttempted = attempts.reduce((acc, a) => acc + (a.attemptedCount || 0), 0);
      const totalCorrect = attempts.reduce((acc, a) => acc + (a.correctCount || 0) + (a.partialCount || 0), 0);
      const overallAccuracy = totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;
      const recentPredictedAir = attempts[0].predictedAirDisplay || 'N/A';
      return {
        totalTests,
        averageScorePct,
        bestScorePct,
        totalQuestionsAttempted,
        overallAccuracy,
        recentPredictedAir
      };
    }
  };
})();
