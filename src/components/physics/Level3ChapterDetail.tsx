// ==============================================================================
// NelovMallickIITD · Level 3: Chapter Detail Page (Theory + CBT Exercises)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Displays:
// 1. Dedicated 3D Theory Box with "Theory Notes — Upload Pending" placeholder
// 2. Individual 3D boxes for every exercise in Online Test Format
// 3. Reusable test shell modal integration
// ==============================================================================

import React, { useState } from 'react';
import { PhysicsChapter, ChapterExercise } from '../../data/physicsChapters';
import { PhysicsCard3D } from './PhysicsCard3D';
import { PhysicsIcon } from './PhysicsIcon';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { ExerciseTestShellModal } from './ExerciseTestShellModal';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  UploadCloud,
  FileText,
  ChevronRight
} from 'lucide-react';

interface Level3ChapterDetailProps {
  chapter: PhysicsChapter;
  onBackToGrid: () => void;
  onNavigateHome: () => void;
  user?: any;
}

export const Level3ChapterDetail: React.FC<Level3ChapterDetailProps> = ({
  chapter,
  onBackToGrid,
  onNavigateHome,
  user
}) => {
  const [activeExerciseForTest, setActiveExerciseForTest] = useState<ChapterExercise | null>(null);
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#0a0a0c] py-8 sm:py-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div
        className="absolute top-20 right-1/4 w-[500px] h-[350px] blur-[120px] rounded-full pointer-events-none opacity-40 dark:opacity-30"
        style={{ background: chapter.colorTheme.glow }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={onBackToGrid}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Physics Resources
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              {chapter.fullName}
            </span>
          </nav>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBackToGrid}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 bg-white dark:bg-[#12131a] border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-500" />
            Back to 28 Chapters
          </button>
        </div>

        {/* Chapter Header Card (3D Elevated) */}
        <div
          className="rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200/90 dark:border-zinc-800/90 
            border-b-4 border-b-slate-300 dark:border-b-zinc-700
            shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            
            {/* 3D Icon Box */}
            <div
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0
                bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900
                border border-slate-200 dark:border-zinc-700 border-b-[3px] border-b-slate-300 dark:border-b-zinc-700
                shadow-md`}
            >
              <PhysicsIcon name={chapter.iconName} className={`w-9 h-9 ${chapter.colorTheme.accent}`} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wide uppercase bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {chapter.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {chapter.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {chapter.exercises.length} CBT {chapter.exercises.length === 1 ? 'Test' : 'Tests'} Ready
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                {chapter.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-2xl">
                {chapter.theory.summary}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-center sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">Academic Mentor</span>
            <p className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">Nelov Mallick (IIT Delhi)</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">100% Free Education</p>
          </div>
        </div>

        {/* SECTION 1: THEORY PORTION (Dedicated 3D Box) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-zinc-50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              1. Theory Portion
            </h2>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              Curated Concept Notes & Derivations
            </span>
          </div>

          {/* Standalone 3D Theory Box */}
          <Tilt3DCard
            maxTilt={4}
            scale={1.01}
            perspective={1200}
            className="group cursor-pointer"
            onClick={() => setShowTheoryModal(true)}
          >
            <div
              className="relative rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200/90 dark:border-zinc-800/90
                border-b-4 border-b-slate-300 dark:border-b-zinc-700
                hover:border-b-indigo-500 dark:hover:border-b-indigo-500
                shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)]
                hover:shadow-[0_20px_45px_-10px_rgba(99,102,241,0.22)]
                p-6 sm:p-8 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                <div className="flex items-start gap-5">
                  {/* Floating 3D Book Icon */}
                  <div
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center shrink-0
                      bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-indigo-500/20 text-indigo-600 dark:text-indigo-400
                      border border-indigo-200 dark:border-indigo-800 border-b-[3px] border-b-indigo-300 dark:border-b-indigo-900
                      shadow-inner group-hover:scale-105 transition-transform"
                  >
                    <BookOpen className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                        {chapter.theory.statusLabel}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        {chapter.theory.topics?.length || 4} Core Topics Mapped
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {chapter.theory.title}
                    </h3>

                    {/* Topics Pill List */}
                    {chapter.theory.topics && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {chapter.theory.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60"
                          >
                            <span className="w-1 h-1 rounded-full bg-indigo-500" />
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action CTA */}
                <div className="shrink-0 w-full lg:w-auto flex sm:flex-row lg:flex-col items-center gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTheoryModal(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Preview Theory Notes
                  </button>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                    Awaiting Docx/PDF Upload
                  </span>
                </div>

              </div>
            </div>
          </Tilt3DCard>
        </section>

        {/* SECTION 2: EXERCISES (ONLINE TEST FORMAT) */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                2. Exercises (Online Test Format)
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Attempt chapterwise tests in official JEE CBT format with timer, palette, and instant score summary.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {chapter.exercises.length} {chapter.exercises.length === 1 ? 'Exercise' : 'Exercises'} Total
            </span>
          </div>

          {/* Exercises 3D Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapter.exercises.map((exercise) => (
              <PhysicsCard3D
                key={exercise.id}
                iconName={chapter.iconName}
                badge={exercise.statusLabel}
                badgeColor="bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                category={exercise.targetExam}
                title={exercise.title}
                subtitle={exercise.description}
                metadata={`${exercise.questionCount || 25} Questions • ${exercise.timeMinutes || 60} Min`}
                accentColor={chapter.colorTheme.accent}
                glowColor={chapter.colorTheme.glow}
                actionText="Launch CBT Shell"
                onClick={() => setActiveExerciseForTest(exercise)}
              />
            ))}
          </div>
        </section>

      </div>

      {/* CBT Test Shell Modal */}
      {activeExerciseForTest && (
        <ExerciseTestShellModal
          isOpen={!!activeExerciseForTest}
          onClose={() => setActiveExerciseForTest(null)}
          chapter={chapter}
          exercise={activeExerciseForTest}
          studentName={user?.name || 'Guest Aspirant'}
        />
      )}

      {/* Theory Notes Placeholder Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12131a] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-zinc-50">
                    {chapter.fullName} · Theory
                  </h3>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Upload Pending (Word / PDF)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTheoryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                <p className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Theory Notes Pipeline Ready
                </p>
                <p>
                  Nelov Mallick will upload complete handwritten derivations, formula vaults, and NCERT-aligned problem notes for <strong>{chapter.name}</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 dark:text-zinc-200">
                  Included Subtopics:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-zinc-400 pl-1">
                  {chapter.theory.topics?.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowTheoryModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-colors"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
