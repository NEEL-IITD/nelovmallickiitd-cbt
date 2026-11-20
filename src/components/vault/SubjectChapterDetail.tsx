// ==============================================================================
// NelovMallickIITD · Level 3: Chapter Detail View (Theory + Online CBT Exercises)
// Reusable for Physics, Chemistry & Mathematics chapters
// Features dedicated 3D Theory box, individual 3D Exercise boxes,
// and 3 Sub-Topic Tabs for Maths C18 (Applications of Derivative)
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { SubjectIcon } from './SubjectIcon';
import { Tilt3DCard } from '../ui/Tilt3DCard';
import { TheoryPdfViewerModal } from './TheoryPdfViewerModal';
import { vaultService } from '../../services/vaultService';
import {
  ArrowLeft, BookOpen, Clock, FileText, CheckCircle2,
  Layers, Play, Sparkles
} from 'lucide-react';

interface SubjectChapterDetailProps {
  subject: 'physics' | 'chemistry' | 'mathematics';
  chapter: any;
  onBackToSubject: () => void;
  onNavigateHome?: () => void;
  onLaunchExercise: (exercise: any) => void;
}

const THEME_ACCENTS = {
  physics: {
    primary: '#2563EB',
    accentText: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    pedestalBg: 'from-blue-600 via-indigo-600 to-indigo-700',
    borderBottom: 'border-b-blue-600 dark:border-b-blue-500',
    tabActiveClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/25',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
  },
  chemistry: {
    primary: '#059669',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    pedestalBg: 'from-emerald-600 via-teal-600 to-teal-700',
    borderBottom: 'border-b-emerald-600 dark:border-b-emerald-500',
    tabActiveClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
  },
  mathematics: {
    primary: '#7C3AED',
    accentText: 'text-violet-600 dark:text-violet-400',
    badgeClass: 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    pedestalBg: 'from-violet-600 via-purple-600 to-fuchsia-600',
    borderBottom: 'border-b-violet-600 dark:border-b-violet-500',
    tabActiveClass: 'bg-violet-600 text-white shadow-md shadow-violet-500/25',
    btnClass: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20'
  }
};

export const SubjectChapterDetail: React.FC<SubjectChapterDetailProps> = ({
  subject,
  chapter,
  onBackToSubject,
  onNavigateHome,
  onLaunchExercise
}) => {
  const [activeSubTopicIndex, setActiveSubTopicIndex] = useState<number>(0);
  const [previewTheoryModal, setPreviewTheoryModal] = useState<boolean>(false);

  const theme = THEME_ACCENTS[subject];
  const subjectDisplayName = subject.charAt(0).toUpperCase() + subject.slice(1);

  // If chapter has subTopics (e.g. Maths C18 Applications of Derivative)
  const isMultiSubTopic = chapter.hasSubTopics && chapter.subTopics && chapter.subTopics.length > 0;
  const currentSubTopic = isMultiSubTopic ? chapter.subTopics[activeSubTopicIndex] : null;

  const currentTheory = isMultiSubTopic ? currentSubTopic.theory : chapter.theory;
  const currentExercises = isMultiSubTopic ? currentSubTopic.exercises : chapter.exercises;

  // Dynamic Theory Data from Vault
  const vaultTheory = useMemo(() => {
    return vaultService.getTheoryNotes(subject, chapter.code || chapter.id);
  }, [subject, chapter]);

  const hasVaultPdf = Boolean(vaultTheory && vaultTheory.pdfUrl);

  const handleExerciseClick = (exercise: any) => {
    const vaultEx = vaultService.getExercise(subject, chapter.code || chapter.id, exercise.id);
    if (vaultEx) {
      onLaunchExercise(vaultEx);
    } else {
      onLaunchExercise(exercise);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0e] text-slate-900 dark:text-zinc-50 pt-6 pb-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation Trail */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </button>
            <span>›</span>
            <button
              type="button"
              onClick={onBackToSubject}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {subjectDisplayName} Resources
            </button>
            <span>›</span>
            <span className={`font-extrabold ${theme.accentText}`}>
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
              type="button"
              onClick={onBackToSubject}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-slate-400 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {subjectDisplayName} Chapters</span>
            </button>
          </div>
        </div>

        {/* Chapter Header Card (3D Elevated) */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#121318] border-2 border-slate-200 dark:border-zinc-800 border-b-[6px] shadow-xl p-6 sm:p-9 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-5">
              {/* Icon Pedestal */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0
                  bg-gradient-to-tr ${theme.pedestalBg} text-white
                  border-2 border-white/30 dark:border-white/10
                  shadow-lg`}
              >
                <SubjectIcon name={chapter.iconName} className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${theme.badgeClass}`}>
                    {chapter.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    {chapter.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {chapter.badgeText}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                  {chapter.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                  {chapter.theory?.summary || 'Complete concept notes and timed examination mock tests.'}
                </p>
              </div>
            </div>

            {/* Academic Direction Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1 shrink-0 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Academic Mentor
              </span>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                Nelov Mallick (IIT Delhi)
              </div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Free Education
              </div>
            </div>

          </div>

          {/* MATHS C18 SPECIAL: 3 SUB-TOPIC TABS */}
          {isMultiSubTopic && (
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                <Layers className="w-4 h-4 text-violet-500" />
                <span>Select Sub-Topic:</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {chapter.subTopics.map((sub: any, idx: number) => {
                  const isActive = activeSubTopicIndex === idx;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveSubTopicIndex(idx)}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all border flex items-center justify-between ${
                        isActive
                          ? theme.tabActiveClass
                          : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                        {sub.exercises.length} Ex
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ==================================================================== */}
        {/* SECTION 1: THEORY PORTION                                            */}
        {/* ==================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${theme.accentText}`} />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                1. Theory Portion
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              Curated Concept Notes &amp; Derivations
            </span>
          </div>

          {/* 3D Theory Card (TestOnGo Style) */}
          <Tilt3DCard
            maxTilt={3}
            scale={1.01}
            perspective={1400}
            className="w-full"
          >
            <div
              className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#121318]
                border-2 border-slate-200 dark:border-zinc-800
                ${theme.borderBottom}
                shadow-lg hover:shadow-xl p-6 sm:p-8 transition-all space-y-6 text-left`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                      ${hasVaultPdf ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}
                      border border-slate-200 dark:border-zinc-700 shadow-sm`}
                  >
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {hasVaultPdf ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>PDF Ready ({((vaultTheory?.fileSizeBytes || 0) / (1024 * 1024)).toFixed(1)} MB)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          Theory Notes — Upload Pending
                        </span>
                      )}
                      {currentTheory.topics && (
                        <span className="text-[11px] font-bold text-slate-400">
                          {currentTheory.topics.length} Core Topics Mapped
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-zinc-50 mt-1">
                      {vaultTheory?.title || (isMultiSubTopic ? `${currentSubTopic.name} — Theory` : currentTheory.title)}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewTheoryModal(true)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors shrink-0 flex items-center gap-2 ${
                    hasVaultPdf
                      ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hasVaultPdf ? '📄 View Official Theory PDF' : '📄 Preview Theory Notes'}</span>
                </button>
              </div>

              {/* Topics Mapped List */}
              {currentTheory.topics && currentTheory.topics.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Syllabus Topics Covered in this Chapter:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentTheory.topics.map((topic: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span>Format: PDF / Word (.docx) Interactive Viewer</span>
                <span className="font-bold">
                  {hasVaultPdf ? `PDF Uploaded (${vaultTheory?.fileName})` : 'Awaiting Docx/PDF Upload'}
                </span>
              </div>
            </div>
          </Tilt3DCard>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 2: EXERCISES (ONLINE TEST FORMAT)                            */}
        {/* ==================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${theme.accentText}`} />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                2. Exercises (Online Test Format)
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              Attempt chapterwise tests in official JEE CBT format with timer, palette, and instant score summary.
            </span>
          </div>

          {/* Exercise 3D Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentExercises.map((exercise: any) => {
              const vaultEx = vaultService.getExercise(subject, chapter.code || chapter.id, exercise.id);
              const isTestReady = Boolean(vaultEx && vaultEx.questions && vaultEx.questions.length > 0);
              const qCount = isTestReady ? vaultEx!.questions.length : (exercise.questionCount || 25);
              const durationMin = isTestReady ? (vaultEx!.durationMinutes || exercise.timeMinutes || 60) : (exercise.timeMinutes || 60);

              return (
                <div key={exercise.id} className="w-full flex">
                  <Tilt3DCard
                    maxTilt={5}
                    scale={1.02}
                    perspective={1200}
                    className="group cursor-pointer w-full flex flex-col justify-between"
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    <div
                      className={`relative flex flex-col justify-between h-full overflow-hidden rounded-2xl bg-white dark:bg-[#121318]
                        border-2 border-slate-200/90 dark:border-zinc-800/90
                        ${theme.borderBottom}
                        shadow-md hover:shadow-xl p-6 transition-all duration-300 text-left`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="space-y-4" style={{ transform: 'translateZ(20px)' }}>
                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                          {isTestReady ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>⚡ Test Ready ({qCount} Qs)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              Ready for Upload
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                            {exercise.targetExam}
                          </span>
                        </div>

                        {/* Title */}
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {vaultEx?.title || exercise.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">
                            {exercise.description}
                          </p>
                        </div>

                        {/* Metadata Tag */}
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-zinc-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            {durationMin} Min
                          </span>
                          <span>•</span>
                          <span>{qCount} Questions</span>
                          <span>•</span>
                          <span>{isTestReady ? (qCount * 4) : exercise.marks} Marks</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-5 mt-4 border-t border-slate-100 dark:border-zinc-800" style={{ transform: 'translateZ(25px)' }}>
                        <div
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all ${
                            isTestReady
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                              : theme.btnClass
                          } group-hover:scale-[1.02]`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isTestReady ? `⚡ Launch Live Test (${qCount} Qs)` : 'Launch CBT Test Shell'}</span>
                        </div>
                      </div>

                    </div>
                  </Tilt3DCard>
                </div>
              );
            })}
          </div>
        </section>

        {/* Theory Modal (Embedded PDF Viewer or Upload Preview) */}
        <TheoryPdfViewerModal
          isOpen={previewTheoryModal}
          onClose={() => setPreviewTheoryModal(false)}
          chapter={chapter}
          subject={subject}
          onOpenAdminUpload={() => {
            setPreviewTheoryModal(false);
            window.location.hash = '#/admin';
          }}
        />

      </div>
    </div>
  );
};
