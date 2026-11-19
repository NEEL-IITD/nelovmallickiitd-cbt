import React, { useState, useEffect } from 'react';
import { ExamType } from './types';
import { AuthProvider } from './context/AuthContext';
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

export const AppContent: React.FC = () => {
  // Global State
  const [exam, setExam] = useState<ExamType>('jee');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [examModalOpen, setExamModalOpen] = useState<boolean>(false);
  const [questionPaperOpen, setQuestionPaperOpen] = useState<boolean>(false);

  // Sync dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* Top Sticky Navigation */}
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
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
