// ==============================================================================
// NelovMallickIITD · Level 3: Chapter Detail Page (Theory + CBT Exercises)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Displays:
// 1. Dedicated 3D Theory Box with "Theory Notes — Upload Pending" placeholder
// 2. Individual 3D boxes for every exercise in Online Test Format
// 3. Reusable test shell modal integration
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { PhysicsChapter, ChapterExercise } from '../../data/physicsChapters';
import { PhysicsCard3D } from './PhysicsCard3D';
import { PhysicsIcon } from './PhysicsIcon';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { ExerciseTestShellModal } from './ExerciseTestShellModal';
import { TheoryPdfViewerModal } from '../vault/TheoryPdfViewerModal';
import { vaultService } from '../../services/vaultService';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  UploadCloud,
  FileText
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
  const [activeExerciseForTest, setActiveExerciseForTest] = useState<any | null>(null);
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  // Dynamic Theory from Vault
  const vaultTheory = useMemo(() => {
    return vaultService.getTheoryNotes('physics', chapter.code || chapter.id);
  }, [chapter]);

  const hasVaultPdf = Boolean(vaultTheory && vaultTheory.pdfUrl);

  const handleLaunchExercise = (exercise: ChapterExercise) => {
    const vaultEx = vaultService.getExercise('physics', chapter.code || chapter.id, exercise.id);
    if (vaultEx) {
      setActiveExerciseForTest(vaultEx);
    } else {
      setActiveExerciseForTest(exercise);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#080B14] py-8 sm:py-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div
        className="absolute top-20 right-1/4 w-[500px] h-[350px] blur-[120px] rounded-full pointer-events-none opacity-40 dark:opacity-30"
        style={{ background: chapter.colorTheme.glow }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Navigation Breadcrumb Trail */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <button
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </button>
            <span>›</span>
            <button
              onClick={onBackToGrid}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Physics Resources
            </button>
            <span>›</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
              {chapter.code} - {chapter.name}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
            >
              <span>⚡ Admin Upload</span>
            </a>
            <button
              onClick={onBackToGrid}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-slate-400 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to 28 Chapters</span>
            </button>
          </div>
        </div>

        {/* Chapter Header Banner */}
        <div className="rounded-3xl bg-white dark:bg-[#12172A] border border-slate-200/90 dark:border-zinc-800/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-md text-white"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)' }}
            >
              <PhysicsIcon name={chapter.iconName} className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {chapter.code}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                  {chapter.category}
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
              Curated Concept Notes &amp; Derivations
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
              className="relative rounded-3xl bg-white dark:bg-[#12172A] border border-slate-200/90 dark:border-zinc-800/90
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
                      {hasVaultPdf ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>PDF Ready ({((vaultTheory?.fileSizeBytes || 0) / (1024 * 1024)).toFixed(1)} MB)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                          {chapter.theory.statusLabel}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        {chapter.theory.topics?.length || 4} Core Topics Mapped
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {vaultTheory?.title || chapter.theory.title}
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
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm border transition-colors shadow-sm ${
                      hasVaultPdf
                        ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-emerald-500/20'
                        : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{hasVaultPdf ? 'View Official Theory PDF' : 'Preview Theory Notes'}</span>
                  </button>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                    {hasVaultPdf ? `PDF Uploaded (${vaultTheory?.fileName})` : 'Awaiting Docx/PDF Upload'}
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
            {chapter.exercises.map((exercise) => {
              const vaultEx = vaultService.getExercise('physics', chapter.code || chapter.id, exercise.id);
              const isTestReady = Boolean(vaultEx && vaultEx.questions && vaultEx.questions.length > 0);
              const qCount = isTestReady ? vaultEx!.questions.length : (exercise.questionCount || 25);
              const durationMin = isTestReady ? (vaultEx!.durationMinutes || exercise.timeMinutes || 60) : (exercise.timeMinutes || 60);

              return (
                <PhysicsCard3D
                  key={exercise.id}
                  iconName={chapter.iconName}
                  badge={isTestReady ? `⚡ Test Ready (${qCount} Qs)` : exercise.statusLabel}
                  badgeColor={
                    isTestReady
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }
                  category={exercise.targetExam}
                  title={vaultEx?.title || exercise.title}
                  subtitle={exercise.description}
                  metadata={`${qCount} Questions • ${durationMin} Min`}
                  accentColor={chapter.colorTheme.accent}
                  glowColor={chapter.colorTheme.glow}
                  actionText={isTestReady ? `⚡ Launch Live Test (${qCount} Qs)` : 'Launch CBT Shell'}
                  onClick={() => handleLaunchExercise(exercise)}
                />
              );
            })}
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
          subject="physics"
          studentName={user?.name || 'Guest Aspirant'}
        />
      )}

      {/* Theory Notes PDF Viewer / Placeholder Modal */}
      <TheoryPdfViewerModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
        chapter={chapter}
        subject="physics"
        onOpenAdminUpload={() => {
          setShowTheoryModal(false);
          window.location.hash = '#/admin';
        }}
      />
    </div>
  );
};
