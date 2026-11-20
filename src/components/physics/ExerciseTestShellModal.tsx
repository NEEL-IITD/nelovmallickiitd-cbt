// ==============================================================================
// NelovMallickIITD · Reusable Physics Exercise CBT Test Shell Interface
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Reusable test-interface shell ready to load questions, timer, question palette,
// and score summary once Word (.docx) files are uploaded.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, X, ArrowLeft, ArrowRight, Bookmark, ShieldCheck, UploadCloud } from 'lucide-react';

interface ExerciseTestShellModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: any;
  exercise: any;
  subject?: 'physics' | 'chemistry' | 'mathematics';
  studentName?: string;
}

export const ExerciseTestShellModal: React.FC<ExerciseTestShellModalProps> = ({
  isOpen,
  onClose,
  chapter,
  exercise,
  studentName = 'Guest Student'
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number>(1);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([1]);
  const [timeLeft, setTimeLeft] = useState<number>((exercise.timeMinutes || 60) * 60);
  const [isTimerRunning] = useState<boolean>(true);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalQuestions = exercise.questionCount || 25;

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !isTimerRunning || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning, isSubmitted]);

  // Mark question visited
  useEffect(() => {
    if (!visitedQuestions.includes(selectedQuestion)) {
      setVisitedQuestions(prev => [...prev, selectedQuestion]);
    }
  }, [selectedQuestion, visitedQuestions]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    setResponses(prev => ({ ...prev, [selectedQuestion]: option }));
  };

  const handleClearResponse = () => {
    setResponses(prev => {
      const copy = { ...prev };
      delete copy[selectedQuestion];
      return copy;
    });
  };

  const handleMarkForReview = () => {
    if (markedForReview.includes(selectedQuestion)) {
      setMarkedForReview(prev => prev.filter(q => q !== selectedQuestion));
    } else {
      setMarkedForReview(prev => [...prev, selectedQuestion]);
    }
  };

  const handleSaveAndNext = () => {
    if (selectedQuestion < totalQuestions) {
      setSelectedQuestion(prev => prev + 1);
    }
  };

  // Determine button color in question palette
  const getQuestionPaletteStyle = (qNum: number) => {
    const isAnswered = !!responses[qNum];
    const isMarked = markedForReview.includes(qNum);
    const isCurrent = selectedQuestion === qNum;

    let baseClass = 'w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ';

    if (isCurrent) {
      baseClass += 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#11121a] ';
    }

    if (isAnswered && isMarked) {
      return baseClass + 'bg-purple-600 text-white relative after:content-[""] after:w-2 after:h-2 after:bg-emerald-400 after:rounded-full after:absolute after:top-0.5 after:right-0.5';
    }
    if (isMarked) {
      return baseClass + 'bg-purple-600 text-white';
    }
    if (isAnswered) {
      return baseClass + 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20';
    }
    if (visitedQuestions.includes(qNum)) {
      return baseClass + 'bg-rose-500 text-white';
    }
    return baseClass + 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700';
  };

  const answeredCount = Object.keys(responses).length;
  const markedCount = markedForReview.length;
  const notAnsweredCount = visitedQuestions.length - answeredCount;
  const notVisitedCount = totalQuestions - visitedQuestions.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex flex-col justify-between">
      
      {/* Top CBT Header */}
      <header className="bg-white dark:bg-[#11121a] border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between shadow-sm">
        
        {/* Left: Test Details */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            {chapter.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-zinc-50">
                {chapter.fullName} · <span className="text-indigo-600 dark:text-indigo-400">{exercise.title}</span>
              </h2>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {exercise.targetExam}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Candidate: <span className="font-semibold text-slate-700 dark:text-zinc-200">{studentName}</span> • Marking: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{exercise.markingScheme}</span>
            </p>
          </div>
        </div>

        {/* Right: Timer & Exit */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 leading-none">Time Left</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-zinc-50">
                {formatTimer(timeLeft)}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Exit Test Shell"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Main Body: Question Area & Question Palette */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-[#0c0d12]">
        
        {/* Left Side: Question Shell */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          
          <div className="max-w-4xl mx-auto w-full space-y-6">

            {/* Word .docx Placeholder Notice Banner */}
            <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-amber-500/10 border-2 border-dashed border-indigo-300 dark:border-indigo-800 flex items-start gap-3.5">
              <UploadCloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
              <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>⚡ CBT Test Shell Active (Ready for DOCX Upload)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Upload Pending
                  </span>
                </p>
                <p className="text-slate-600 dark:text-zinc-400">
                  This interactive test shell is fully wired with real-time timers, question palette tracking, and scoring. Once Nelov Mallick uploads the Word (<code className="font-mono text-indigo-600 dark:text-indigo-300">.docx</code>) question paper for <strong>{chapter.name} - {exercise.title}</strong>, authentic questions, KaTeX equations, and diagrams will render here automatically.
                </p>
              </div>
            </div>

            {/* Question Card Box */}
            <div className="bg-white dark:bg-[#12131a] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-7 shadow-sm space-y-6">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                <span className="font-black text-base sm:text-lg text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">
                    Q{selectedQuestion}
                  </span>
                  Question {selectedQuestion} of {totalQuestions}
                </span>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    +4.00 Marks
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    -1.00 Negative
                  </span>
                </div>
              </div>

              {/* Question Statement Preview */}
              <div className="space-y-4 text-sm sm:text-base text-slate-800 dark:text-zinc-200 leading-relaxed font-serif">
                <p className="font-medium">
                  [Sample Preview for Question #{selectedQuestion} in {chapter.name}]
                </p>
                <p className="bg-slate-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                  A particle of mass \(m\) undergoes motion in the chapter <strong>"{chapter.name}"</strong> under an applied force \(F(t)\). When the question bank is imported from DOCX, the complete problem statement, high-resolution SVG/PNG diagrams, and step-by-step test data will automatically load here.
                </p>
              </div>

              {/* 4 MCQ Radio Options Preview */}
              <div className="space-y-3 pt-2">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const isChecked = responses[selectedQuestion] === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-100 font-semibold shadow-sm'
                          : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400 dark:border-zinc-600'
                        }`}
                      >
                        {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 w-5">({opt})</span>
                      <span className="text-xs sm:text-sm">Option {opt} [Awaiting DOCX upload]</span>
                    </label>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Action Bar Bottom of Question Area */}
          <div className="max-w-4xl mx-auto w-full pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-zinc-800">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearResponse}
                disabled={!responses[selectedQuestion]}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Clear Response
              </button>

              <button
                type="button"
                onClick={handleMarkForReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  markedForReview.includes(selectedQuestion)
                    ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300'
                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {markedForReview.includes(selectedQuestion) ? 'Unmark Review' : 'Mark for Review'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedQuestion(prev => Math.max(1, prev - 1))}
                disabled={selectedQuestion === 1}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Prev
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                Save & Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Side: Question Palette Panel */}
        <aside className="w-full lg:w-80 xl:w-96 bg-white dark:bg-[#11121a] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-zinc-800 p-4 sm:p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Palette Status Legend */}
            <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Question Legend
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-600 shrink-0" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-rose-500 shrink-0" />
                  <span>Not Answered ({notAnsweredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-purple-600 shrink-0" />
                  <span>Review ({markedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-zinc-700 shrink-0" />
                  <span>Not Visited ({notVisitedCount})</span>
                </div>
              </div>
            </div>

            {/* Questions Grid 1 to N */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-700 dark:text-zinc-300">
                  Question Palette ({totalQuestions} Questions)
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto p-1">
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => (
                  <button
                    key={qNum}
                    type="button"
                    onClick={() => setSelectedQuestion(qNum)}
                    className={getQuestionPaletteStyle(qNum)}
                  >
                    {qNum}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Submit Test CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2.5">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Submit Exercise Test
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-zinc-400">
              {answeredCount} of {totalQuestions} questions answered
            </p>
          </div>

        </aside>

      </div>

      {/* Submit Test Confirmation / Result Preview Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12131a] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-black text-xl text-slate-900 dark:text-zinc-50">
                Submit Test Shell
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                {chapter.fullName} · {exercise.title}
              </p>
            </div>

            {/* Test Stats Preview */}
            <div className="grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-zinc-400">Total Questions:</span>
                <p className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">{totalQuestions}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-zinc-400">Answered:</span>
                <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{answeredCount}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-zinc-400">Marked for Review:</span>
                <p className="font-extrabold text-sm text-purple-600 dark:text-purple-400">{markedCount}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-zinc-400">Time Taken:</span>
                <p className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">
                  {formatTimer((exercise.timeMinutes || 60) * 60 - timeLeft)}
                </p>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 dark:text-zinc-400">
              When full questions are uploaded from Word (.docx), the CBT engine will generate your All India Rank (AIR), accuracy, and detailed mistake analysis report.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-colors"
              >
                Back to Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
              >
                Close & Return
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
