// ==============================================================================
// NelovMallickIITD CBT Platform - Main App Component
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ExamType } from './types';
import { AuthProvider, useAuth, ProtectedRoute, AdminRoute } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Hero } from './components/Hero';
import { Founders } from './components/Founders';
import { Features } from './components/Features';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { VideoShowcase } from './components/VideoShowcase';
import { Resources } from './components/Resources';
import { FAQ } from './components/FAQ';
import { CTABanner } from './components/CTABanner';
import { Footer } from './components/Footer';
import { ExamModal } from './components/ExamModal';
import { AuthModal } from './components/AuthModal';
import { QuestionPaperModal } from './components/QuestionPaperModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MyProgress } from './components/MyProgress';
import { RevisionNotebook } from './components/RevisionNotebook';
import { ResourcesHub } from './components/ResourcesHub';
import { LecturesHub } from './components/LecturesHub';
import { LecturePlayer } from './components/LecturePlayer';
import { LecturesSection } from './components/LecturesSection';
import { LeaderboardHub } from './components/LeaderboardHub';
import { ScheduleView } from './components/ScheduleView';
import { DashboardView } from './components/DashboardView';
import { AuthPage } from './components/AuthPage';
import { StudyResourcesVaultShowcase } from './components/vault/StudyResourcesVaultShowcase';
import { SubjectResourcesHub } from './components/vault/SubjectResourcesHub';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { Disclaimer } from './components/legal/Disclaimer';
import { CopyrightPolicy } from './components/legal/CopyrightPolicy';
import { AccountPrivacy } from './components/legal/AccountPrivacy';
import { StorageNotice } from './components/legal/StorageNotice';
import { canonicalizeLeaderboardTestId } from './utils/validationSchemas';

export const AppContent: React.FC = () => {
  const { user, isCloudConnected, openAuthModal } = useAuth();

  // Global State
  const [exam, setExam] = useState<ExamType>('jee');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nelov_theme') !== 'light';
    } catch {
      return true;
    }
  });
  const [examModalOpen, setExamModalOpen] = useState<boolean>(false);
  const [questionPaperOpen, setQuestionPaperOpen] = useState<boolean>(false);
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/');
  const [dismissBanner, setDismissBanner] = useState<boolean>(false);

  const isDashboardRoute = currentHash.toLowerCase() === '#/dashboard' || currentHash.toLowerCase().startsWith('#/dashboard/');
  const lowHash = currentHash.toLowerCase();
  const isLoginRoute = lowHash === '#/login' || lowHash.startsWith('#/login?') || window.location.pathname.toLowerCase() === '/login';
  const isSignupRoute = lowHash === '#/signup' || lowHash.startsWith('#/signup?') || window.location.pathname.toLowerCase() === '/signup';

  // Sync dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Default /dashboard to Obsidian dark-mode-first unless manually toggled
  useEffect(() => {
    if (isDashboardRoute) {
      try {
        if (!localStorage.getItem('nelov_theme_user_set')) {
          setIsDark(true);
          localStorage.setItem('nelov_theme', 'dark');
        }
      } catch {}
    }
  }, [isDashboardRoute]);

  // Listen to hash changes for SPA routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('nelov_theme', next ? 'dark' : 'light');
        localStorage.setItem('nelov_theme_user_set', 'true');
      } catch {}
      return next;
    });
  };

  const handleNavigate = (hash: string) => {
    window.location.hash = hash;
    setCurrentHash(hash);
  };

  if (isLoginRoute || isSignupRoute) {
    const mode = lowHash.includes('recovery=1') ? 'recovery' : (isSignupRoute ? 'signup' : 'login');
    return (
      <AuthPage
        initialMode={mode}
        onSuccess={() => handleNavigate('#/dashboard')}
        onContinueGuest={() => handleNavigate('#/dashboard')}
      />
    );
  }

  if (isDashboardRoute) {
    return (
      <>
        <DashboardView
          currentHash={currentHash}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onNavigate={handleNavigate}
          onSelectTest={(testId) => {
            if (testId.startsWith('jee-mains-')) {
              handleNavigate(`#/test/jee-mains/${testId.replace('jee-mains-', '')}`);
            } else {
              handleNavigate(`#/test/jee-advanced/${testId.replace('jee-advanced-', '')}`);
            }
          }}
        />
        <AuthModal />
        <StorageNotice />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#080B14] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* Dev Mode Non-Intrusive Supabase Notice Banner */}
      {!isCloudConnected && !dismissBanner && (
        <aside aria-label="Dev mode notice" className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-indigo-500/10 border-b border-amber-500/20 px-4 py-2 text-xs flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚡ Dev Mode Notice:</span>
            <span>
              Supabase running in local zero-dependency offline mode. Copy <code>.env.example</code> to <code>.env</code> to connect Supabase Cloud & Google OAuth.
            </span>
          </div>
          <button
            onClick={() => setDismissBanner(true)}
            className="text-amber-700 dark:text-amber-300 hover:underline font-bold text-[11px] whitespace-nowrap"
          >
            Dismiss ✕
          </button>
        </aside>
      )}

      {/* Top Sticky Navigation */}
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onNavigate={handleNavigate}
      />

      {/* Live Now Announcement Strip (TestonGo Inspired) */}
      <AnnouncementBanner
        onNavigate={handleNavigate}
        onSelectTest={(testId) => {
          if (testId.includes('pta-04')) handleNavigate('#/test/jee-advanced/pta-04');
          else if (testId.includes('pta-05')) handleNavigate('#/test/jee-advanced/pta-05');
          else handleNavigate('#/test/jee-advanced/pta-06');
        }}
      />

      {/* Route-Based Content Rendering */}
      {currentHash === '#/admin' ? (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      ) : currentHash === '#/progress' ? (
        <ProtectedRoute redirectUrl="#/progress" fallbackMessage="Sign in or create a free account to track your test history and projected JEE rank.">
          <MyProgress />
        </ProtectedRoute>
      ) : currentHash === '#/notebook' ? (
        <ProtectedRoute redirectUrl="#/notebook" fallbackMessage="Sign in or create a free account to view your bookmarked questions and derivations.">
          <RevisionNotebook />
        </ProtectedRoute>
      ) : currentHash.startsWith('#/resources/physics') ? (
        <SubjectResourcesHub
          subject="physics"
          currentHash={currentHash}
          onNavigate={handleNavigate}
          user={user}
        />
      ) : currentHash.startsWith('#/resources/chemistry') ? (
        <SubjectResourcesHub
          subject="chemistry"
          currentHash={currentHash}
          onNavigate={handleNavigate}
          user={user}
        />
      ) : currentHash.startsWith('#/resources/mathematics') ? (
        <SubjectResourcesHub
          subject="mathematics"
          currentHash={currentHash}
          onNavigate={handleNavigate}
          user={user}
        />
      ) : currentHash === '#/resources' ? (
        <ResourcesHub
          onBackToHome={() => handleNavigate('#/')}
          onOpenAuth={(title) => openAuthModal('login', '#/resources', title)}
          user={user}
        />
      ) : currentHash.startsWith('#/lectures/') ? (
        (() => {
          const rawPath = currentHash.replace('#/lectures/', '');
          const [slugPart, queryPart] = rawPath.split('?');
          let lecIdx = 1;
          if (queryPart && queryPart.includes('lec=')) {
            const m = queryPart.match(/lec=(\d+)/);
            if (m) lecIdx = parseInt(m[1], 10);
          }
          return (
            <LecturePlayer
              chapterSlug={slugPart}
              initialLectureIndex={lecIdx}
              currentUser={user}
              onBackToHub={() => handleNavigate('#/lectures')}
              openAuth={(mode) => openAuthModal(mode, currentHash)}
            />
          );
        })()
      ) : currentHash === '#/lectures' ? (
        <LecturesHub
          currentUser={user}
          onSelectChapter={(slug) => handleNavigate(`#/lectures/${slug}`)}
          onBackToHome={() => handleNavigate('#/')}
          openAuth={(mode) => openAuthModal(mode, '#/lectures')}
        />
      ) : currentHash === '#/privacy-policy' || currentHash === '#privacy-policy' ? (
        <PrivacyPolicy />
      ) : currentHash === '#/terms' || currentHash === '#terms' ? (
        <TermsOfService />
      ) : currentHash === '#/disclaimer' || currentHash === '#disclaimer' ? (
        <Disclaimer />
      ) : currentHash === '#/copyright' || currentHash === '#copyright' ? (
        <CopyrightPolicy />
      ) : (
        currentHash.startsWith('#/leaderboard') ||
        currentHash.startsWith('#leaderboard') ||
        ((!currentHash || currentHash === '#' || currentHash === '#/') &&
          (window.location.pathname.toLowerCase() === '/leaderboard' || window.location.pathname.toLowerCase().startsWith('/leaderboard/')))
      ) ? (
        <LeaderboardHub
          initialTestId={canonicalizeLeaderboardTestId(
            (currentHash.startsWith('#/leaderboard') || currentHash.startsWith('#leaderboard')
              ? currentHash.split('/')[2]
              : window.location.pathname.split('/')[2]) || 'jee-advanced-pta-04'
          )}
          onNavigateHome={() => handleNavigate('#/')}
        />
      ) : currentHash === '#/schedule' || currentHash === '#schedule' ? (
        <ScheduleView
          onNavigate={handleNavigate}
          onSelectTest={(testId) => {
            if (testId.startsWith('jee-mains-')) {
              handleNavigate(`#/test/jee-mains/${testId.replace('jee-mains-', '')}`);
            } else {
              handleNavigate(`#/test/jee-advanced/${testId.replace('jee-advanced-', '')}`);
            }
          }}
        />
      ) : currentHash === '#/account' || currentHash === '#account' ? (
        <ProtectedRoute redirectUrl="#/account" fallbackMessage="Sign in or create a free account to manage your Account & Privacy settings.">
          <AccountPrivacy onBackToHome={() => handleNavigate('#/')} />
        </ProtectedRoute>
      ) : (
        <main>
          {/* 0. STUDY RESOURCES & FORMULA VAULT (Top-of-Homepage 3D Showcase) */}
          <StudyResourcesVaultShowcase
            onOpenSubject={(subject) => handleNavigate(`#/resources/${subject}`)}
          />

          {/* 1. Hero Section with Live CBT Mock Test */}
          <Hero
            exam={exam}
            onOpenQuestionPaper={() => setQuestionPaperOpen(true)}
          />

          {/* 2. Founders & Mentors Section */}
          <Founders />

          {/* 3. Features 12-Card Grid */}
          <Features exam={exam} />

          {/* 4. Comparison Table Matrix */}
          <ComparisonMatrix exam={exam} />

          {/* 5. Expert Testimonials & Mentors */}
          <Testimonials />

          {/* 6. Live Tests Section (PTA 04 & PTA 05 - 100% Free) */}
          <Pricing />

          {/* 7. Video Platform Walkthrough */}
          <VideoShowcase exam={exam} />

          {/* 8. Free Study Resources Grid */}
          <Resources exam={exam} />

          {/* 8.5. Video Lectures & Chapter Masterclasses */}
          <LecturesSection
            onSelectChapter={(slug) => handleNavigate(`#/lectures/${slug}`)}
            onBrowseAll={() => handleNavigate('#/lectures')}
          />

          {/* 9. Collapsible FAQ Section */}
          <FAQ exam={exam} />

          {/* 10. Pre-Footer Call to Action Banner */}
          <CTABanner exam={exam} />
        </main>
      )}

      {/* Footer */}
      <Footer exam={exam} />

      {/* Modals */}
      <ExamModal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        currentExam={exam}
        onSelectExam={(e) => setExam(e)}
      />

      <AuthModal />

      <QuestionPaperModal
        isOpen={questionPaperOpen}
        onClose={() => setQuestionPaperOpen(false)}
        exam={exam}
      />

      {/* Lightweight Essential Storage / Cookie Notice */}
      <StorageNotice />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
