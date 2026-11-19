// ==============================================================================
// NelovMallickIITD CBT Platform - Main App Component
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ExamType } from './types';
import { AuthProvider, useAuth, ProtectedRoute, AdminRoute } from './context/AuthContext';
import { Navbar } from './components/Navbar';
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

export const AppContent: React.FC = () => {
  const { user, isCloudConnected, openAuthModal } = useAuth();

  // Global State
  const [exam, setExam] = useState<ExamType>('jee');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [examModalOpen, setExamModalOpen] = useState<boolean>(false);
  const [questionPaperOpen, setQuestionPaperOpen] = useState<boolean>(false);
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/');
  const [dismissBanner, setDismissBanner] = useState<boolean>(false);

  // Sync dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Listen to hash changes for SPA routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleNavigate = (hash: string) => {
    window.location.hash = hash;
    setCurrentHash(hash);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
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
      ) : currentHash === '#/resources' ? (
        <ResourcesHub
          onBackToHome={() => handleNavigate('#/')}
          onOpenAuth={(title) => openAuthModal('login', '#/resources', title)}
          user={user}
        />
      ) : (
        <main>
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
