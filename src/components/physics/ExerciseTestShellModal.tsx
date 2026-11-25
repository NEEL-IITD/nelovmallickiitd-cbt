// ==============================================================================
// NelovMallickIITD · Reusable Exercise CBT Test Shell & Real JSON Engine Interface
// Standardized JEE Exercise JSON Schema Support (single_correct, multi_correct, numerical)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock, CheckCircle2, X, ArrowLeft, ArrowRight, ShieldCheck,
  Zap, RotateCcw, Check, Sparkles, Hash
} from 'lucide-react';
import { vaultService } from '../../services/vaultService';
import { VaultQuestion } from '../../types';

interface ExerciseTestShellModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: any;
  exercise: any;
  subject?: 'physics' | 'chemistry' | 'mathematics';
  studentName?: string;
  onOpenAdminUpload?: () => void;
}

// Inline KaTeX helper component
const MathSpan: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).renderMathInElement) {
      try {
        (window as any).renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
      }
    }
  }, [text]);

  return <span ref={containerRef} className={className}>{text}</span>;
};

export const ExerciseTestShellModal: React.FC<ExerciseTestShellModalProps> = ({
  isOpen,
  onClose,
  chapter,
  exercise,
  subject = 'physics',
  studentName = 'Guest Aspirant',
  onOpenAdminUpload
}) => {
  if (!isOpen || !chapter || !exercise) return null;

  // 1. Query uploaded exercise JSON from vaultService
  const uploadedExercise = useMemo(() => {
    return vaultService.getExercise(subject, chapter.code || chapter.id, exercise.id);
  }, [subject, chapter, exercise]);

  const isRealJsonTest = !!(uploadedExercise && uploadedExercise.questions && uploadedExercise.questions.length > 0);
  const testData = isRealJsonTest ? uploadedExercise : exercise;
  const questionsList: VaultQuestion[] | null = isRealJsonTest ? uploadedExercise.questions : null;
  const totalQuestions = isRealJsonTest && questionsList ? questionsList.length : (exercise.questionCount || 25);
  const defaultDuration = (testData.durationMinutes || exercise.timeMinutes || 60) * 60;

  // States
  const [selectedQuestion, setSelectedQuestion] = useState<number>(1);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([1]);
  const [timeLeft, setTimeLeft] = useState<number>(defaultDuration);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [scoreSummary, setScoreSummary] = useState<any>(null);
  const [showVirtualKeypad, setShowVirtualKeypad] = useState<boolean>(false);

  // Timer
  useEffect(() => {
    if (!isOpen || testSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, testSubmitted]);

  // Track visited
  useEffect(() => {
    if (!visitedQuestions.includes(selectedQuestion)) {
      setVisitedQuestions(prev => [...prev, selectedQuestion]);
    }
  }, [selectedQuestion]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ: VaultQuestion | null = isRealJsonTest && questionsList ? questionsList[selectedQuestion - 1] : null;

  // Response handlers
  const handleSingleSelect = (optIndex: number) => {
    setResponses(prev => ({ ...prev, [selectedQuestion]: optIndex }));
  };

  const handleMultiSelect = (optIndex: number) => {
    setResponses(prev => {
      const currentList: number[] = Array.isArray(prev[selectedQuestion]) ? [...prev[selectedQuestion]] : [];
      const idx = currentList.indexOf(optIndex);
      if (idx !== -1) {
        currentList.splice(idx, 1);
      } else {
        currentList.push(optIndex);
        currentList.sort((a, b) => a - b);
      }
      return { ...prev, [selectedQuestion]: currentList };
    });
  };

  const handleNumericalChange = (val: string) => {
    setResponses(prev => ({ ...prev, [selectedQuestion]: val }));
  };

  const handleKeypadPress = (key: string) => {
    const currentVal = String(responses[selectedQuestion] !== undefined ? responses[selectedQuestion] : '');
    if (key === 'clear') {
      handleNumericalChange('');
    } else if (key === 'backspace') {
      handleNumericalChange(currentVal.slice(0, -1));
    } else if (key === '-') {
      if (!currentVal.startsWith('-')) {
        handleNumericalChange('-' + currentVal);
      } else {
        handleNumericalChange(currentVal.substring(1));
      }
    } else if (key === '.') {
      if (!currentVal.includes('.')) {
        handleNumericalChange(currentVal + '.');
      }
    } else {
      handleNumericalChange(currentVal + key);
    }
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

  // Scoring
  const handleSubmitTest = () => {
    setShowSubmitModal(false);
    const timeTaken = defaultDuration - timeLeft;
    let totalScore = 0;
    let totalMaxMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let partialCount = 0;
    let unattemptedCount = 0;

    const detailedReview: any[] = [];

    if (isRealJsonTest && questionsList) {
      questionsList.forEach((q, idx) => {
        const qNum = idx + 1;
        const resp = responses[qNum];
        const defMarking = testData.defaultMarking || { correct: 4, incorrect: -1, unattempted: 0 };
        const qCorrectMarks = q.marking?.correct || defMarking.correct || 4;
        const qIncorrectMarks = q.marking?.incorrect || defMarking.incorrect || -1;
        totalMaxMarks += qCorrectMarks;

        let status = 'unattempted';
        let marksAwarded = 0;

        const isAttempted = (val: any) => val !== undefined && val !== null && String(val).trim() !== '' && !(Array.isArray(val) && val.length === 0);

        if (!isAttempted(resp)) {
          status = 'unattempted';
          marksAwarded = 0;
          unattemptedCount++;
        } else if (q.type === 'single_correct') {
          const rawCorrect = (q as any).correctAnswer !== undefined ? (q as any).correctAnswer : (q as any).answer;
          let isMatch = false;
          if (typeof rawCorrect === 'number') {
            isMatch = Number(resp) === rawCorrect;
          } else if (typeof rawCorrect === 'string') {
            if (['A', 'B', 'C', 'D'].includes(rawCorrect.toUpperCase())) {
              const charIdx = rawCorrect.toUpperCase().charCodeAt(0) - 65;
              isMatch = Number(resp) === charIdx || String(resp).toUpperCase() === rawCorrect.toUpperCase();
            } else {
              isMatch = String(resp).trim().toLowerCase() === rawCorrect.trim().toLowerCase();
            }
          }
          if (isMatch) {
            status = 'correct';
            marksAwarded = qCorrectMarks;
            correctCount++;
          } else {
            status = 'incorrect';
            marksAwarded = qIncorrectMarks;
            incorrectCount++;
          }
        } else if (q.type === 'multi_correct') {
          const studentArr = Array.isArray(resp) ? resp.map(Number) : [Number(resp)];
          const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer.map(Number) : [Number(q.correctAnswer)];
          
          const hasWrong = studentArr.some(ans => !correctArr.includes(ans));
          const allRight = correctArr.every(ans => studentArr.includes(ans)) && studentArr.length === correctArr.length;

          if (hasWrong) {
            status = 'incorrect';
            marksAwarded = qIncorrectMarks;
            incorrectCount++;
          } else if (allRight) {
            status = 'correct';
            marksAwarded = qCorrectMarks;
            correctCount++;
          } else {
            status = 'partial';
            marksAwarded = Math.max(1, Math.min(studentArr.length, qCorrectMarks - 1));
            partialCount++;
          }
        } else if (q.type === 'numerical') {
          const numVal = parseFloat(String(resp).trim());
          const correctVal = Number(q.correctAnswer);
          const tolerance = q.tolerance !== undefined ? Number(q.tolerance) : 0.01;

          if (!isNaN(numVal) && Math.abs(numVal - correctVal) <= tolerance) {
            status = 'correct';
            marksAwarded = qCorrectMarks;
            correctCount++;
          } else {
            status = 'incorrect';
            marksAwarded = qIncorrectMarks;
            incorrectCount++;
          }
        }

        totalScore += marksAwarded;
        detailedReview.push({
          question: q,
          number: qNum,
          userResponse: resp,
          status,
          marksAwarded,
          maxMarks: qCorrectMarks
        });
      });
    } else {
      totalMaxMarks = totalQuestions * 4;
      const answered = Object.keys(responses).length;
      totalScore = answered * 4;
      correctCount = answered;
      unattemptedCount = totalQuestions - answered;
    }

    const percentage = totalMaxMarks > 0 ? Math.round((Math.max(0, totalScore) / totalMaxMarks) * 100) : 0;
    const accuracy = (correctCount + incorrectCount) > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

    const summaryData = {
      score: totalScore,
      totalMarks: totalMaxMarks,
      percentage,
      accuracy,
      correctCount,
      incorrectCount,
      partialCount,
      unattemptedCount,
      timeTaken,
      detailedReview
    };

    setScoreSummary(summaryData);
    setTestSubmitted(true);
  };

  const handleRetake = () => {
    setResponses({});
    setMarkedForReview([]);
    setVisitedQuestions([1]);
    setSelectedQuestion(1);
    setTimeLeft(defaultDuration);
    setTestSubmitted(false);
    setScoreSummary(null);
  };

  const isVaultAttempted = (val: any) => val !== undefined && val !== null && String(val).trim() !== '' && !(Array.isArray(val) && val.length === 0);

  const getQuestionPaletteStyle = (qNum: number) => {
    const resp = responses[qNum];
    const isAnswered = isVaultAttempted(resp);
    const isMarked = markedForReview.includes(qNum);
    const isCurrent = selectedQuestion === qNum;

    let baseClass = 'w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ';
    if (isCurrent) baseClass += 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#11121a] ';

    if (isAnswered && isMarked) {
      return baseClass + 'bg-purple-600 text-white relative after:content-[""] after:w-2 after:h-2 after:bg-emerald-400 after:rounded-full after:absolute after:top-0.5 after:right-0.5';
    }
    if (isMarked) return baseClass + 'bg-purple-600 text-white';
    if (isAnswered) return baseClass + 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20';
    if (visitedQuestions.includes(qNum)) return baseClass + 'bg-rose-500 text-white';
    return baseClass + 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700';
  };

  const answeredCount = Object.keys(responses).filter(k => {
    return isVaultAttempted(responses[Number(k)]);
  }).length;
  const markedCount = markedForReview.length;
  const notAnsweredCount = visitedQuestions.length - answeredCount;
  const notVisitedCount = totalQuestions - visitedQuestions.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex flex-col justify-between">
      
      {/* Top CBT Header */}
      <header className="bg-white dark:bg-[#11121a] border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            {chapter.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-zinc-50">
                {chapter.fullName || chapter.name} · <span className="text-indigo-600 dark:text-indigo-400">{testData.title || exercise.title}</span>
              </h2>
              {isRealJsonTest ? (
                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ⚡ JSON Test Engine Active
                </span>
              ) : (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  Awaiting JSON Upload
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Candidate: <span className="font-semibold text-slate-700 dark:text-zinc-200">{studentName}</span> • Marking: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{exercise.markingScheme || '+4, -1'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {!testSubmitted && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 leading-none">Time Left</span>
                <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-zinc-50">
                  {formatTimer(timeLeft)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Exit Test Shell"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      {testSubmitted && scoreSummary ? (
        /* SOLUTIONS & SCORECARD VIEW */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#0c0d12]">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Scorecard Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-indigo-200 border border-white/20">
                    CBT Test Result & Analysis
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    {testData.title || exercise.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-200">
                    {chapter.fullName || chapter.name} · Attempted by <strong>{studentName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15">
                  <div className="text-center">
                    <span className="text-[11px] uppercase font-bold text-indigo-200 block">Score</span>
                    <span className="text-3xl font-black text-emerald-400">
                      {scoreSummary.score}
                    </span>
                    <span className="text-xs text-indigo-200"> / {scoreSummary.totalMarks}</span>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div className="text-center">
                    <span className="text-[11px] uppercase font-bold text-indigo-200 block">Accuracy</span>
                    <span className="text-3xl font-black text-amber-300">
                      {scoreSummary.accuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Stats Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/15 text-xs">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-emerald-300 font-bold block text-base">✓ {scoreSummary.correctCount}</span>
                  <span className="text-indigo-200 text-[11px]">Correct Answers</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-rose-300 font-bold block text-base">✕ {scoreSummary.incorrectCount}</span>
                  <span className="text-indigo-200 text-[11px]">Incorrect Answers</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-amber-300 font-bold block text-base">⚖️ {scoreSummary.partialCount}</span>
                  <span className="text-indigo-200 text-[11px]">Partial Marks</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-slate-300 font-bold block text-base">⚪ {scoreSummary.unattemptedCount}</span>
                  <span className="text-indigo-200 text-[11px]">Unattempted</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-black text-lg text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <span>📖 Detailed Step-by-Step Solutions</span>
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Exercise</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
                >
                  Close & Return
                </button>
              </div>
            </div>

            {/* Questions Detailed Review List */}
            <div className="space-y-6">
              {scoreSummary.detailedReview.map((rev: any, rIdx: number) => {
                const q: VaultQuestion = rev.question;
                return (
                  <div
                    key={q.id || rIdx}
                    className="bg-white dark:bg-[#12172A] rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-7 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">
                          Q{rev.number}
                        </span>
                        <span className="text-xs uppercase font-bold text-slate-500 dark:text-zinc-400 tracking-wider">
                          {q.type === 'single_correct' ? 'Single Choice' : q.type === 'multi_correct' ? 'Multiple Choice' : 'Numerical'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {rev.status === 'correct' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            ✓ Correct (+{rev.marksAwarded}.00)
                          </span>
                        )}
                        {rev.status === 'partial' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            ⚖️ Partial (+{rev.marksAwarded}.00)
                          </span>
                        )}
                        {rev.status === 'incorrect' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                            ✕ Incorrect ({rev.marksAwarded}.00)
                          </span>
                        )}
                        {rev.status === 'unattempted' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                            ⚪ Unattempted (0.00)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Statement with KaTeX */}
                    <div className="text-sm sm:text-base text-slate-800 dark:text-zinc-200 font-medium leading-relaxed">
                      <MathSpan text={q.question} />
                    </div>

                    {/* Question Image if any */}
                    {q.image && (
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 max-w-md">
                        <img src={q.image} alt={`Question ${rev.number}`} className="rounded-lg max-h-64 object-contain mx-auto" />
                      </div>
                    )}

                    {/* Options Review for MCQ */}
                    {q.options && q.options.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt: string, oIdx: number) => {
                          const isCorrectOpt = Array.isArray(q.correctAnswer)
                            ? (q.correctAnswer as number[]).includes(oIdx)
                            : Number(q.correctAnswer) === oIdx;
                          const isChosen = Array.isArray(rev.userResponse)
                            ? (rev.userResponse as number[]).includes(oIdx)
                            : Number(rev.userResponse) === oIdx;

                          let optStyle = 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-700 dark:text-zinc-300';
                          if (isCorrectOpt && isChosen) {
                            optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isCorrectOpt) {
                            optStyle = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium';
                          } else if (isChosen) {
                            optStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 line-through';
                          }

                          return (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${optStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 w-5">
                                  ({String.fromCharCode(65 + oIdx)})
                                </span>
                                <MathSpan text={opt} />
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
                                {isCorrectOpt && <span className="text-emerald-600 dark:text-emerald-400">✓ Correct Answer</span>}
                                {isChosen && !isCorrectOpt && <span className="text-rose-600 dark:text-rose-400">Your Selection</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Numerical Review */}
                    {q.type === 'numerical' && (
                      <div className="bg-slate-50 dark:bg-zinc-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-zinc-400">Your Response:</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {rev.userResponse !== undefined && rev.userResponse !== '' ? rev.userResponse : 'Unattempted'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Correct Answer:</span>
                          <span className="font-mono">{String(q.correctAnswer)} (Tolerance: ±{q.tolerance || 0.01})</span>
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Solution */}
                    <div className="mt-3 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        <span>💡 Step-by-Step Solution:</span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed">
                        <MathSpan text={q.solution} />
                      </div>
                      {q.solutionImage && (
                        <div className="pt-2">
                          <img src={q.solutionImage} alt="Solution diagram" className="rounded-lg max-h-56 object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      ) : (
        /* ACTIVE TEST ENGINE VIEW */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-[#0c0d12]">
          
          {/* Question Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
            <div className="max-w-4xl mx-auto w-full space-y-6">

              {/* Status Header Notice */}
              {isRealJsonTest ? (
                <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-2 border-emerald-300 dark:border-emerald-800 flex items-start justify-between gap-3.5">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>JSON Test Paper Loaded Successfully</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          Verified JEE Standard
                        </span>
                      </p>
                      <p className="text-slate-600 dark:text-zinc-400">
                        Attempt questions using the palette on the right. Formulas render with KaTeX math. Click <strong>Submit Exercise Test</strong> to view your detailed score and full solutions.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-amber-500/10 border-2 border-dashed border-indigo-300 dark:border-indigo-800 flex items-start justify-between gap-3.5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">📤</span>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>⚡ CBT Test Shell Active (Ready for JSON Upload)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          Upload Pending
                        </span>
                      </p>
                      <p className="text-slate-600 dark:text-zinc-400">
                        This test shell is ready. Upload a standardized <code className="font-mono text-indigo-600 dark:text-indigo-300">.json</code> file for <strong>{chapter.name} - {exercise.title}</strong> via the Admin Panel or below to load authentic questions, KaTeX equations, and diagrams automatically.
                      </p>
                    </div>
                  </div>
                  {onOpenAdminUpload && (
                    <button
                      type="button"
                      onClick={onOpenAdminUpload}
                      className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                      Upload JSON Now
                    </button>
                  )}
                </div>
              )}

              {/* Question Card Box */}
              <div className="bg-white dark:bg-[#12172A] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-7 shadow-sm space-y-6">
                
                {/* Question Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                  <span className="font-black text-base sm:text-lg text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">
                      Q{selectedQuestion}
                    </span>
                    Question {selectedQuestion} of {totalQuestions}
                    {currentQ && (
                      <span className="ml-2 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                        {currentQ.type === 'single_correct' ? 'Single Choice' : currentQ.type === 'multi_correct' ? 'Multiple Choice' : 'Numerical'}
                      </span>
                    )}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      +{testData.defaultMarking?.correct || 4}.00 Marks
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {testData.defaultMarking?.incorrect || -1}.00 Negative
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-4 text-sm sm:text-base text-slate-800 dark:text-zinc-200 leading-relaxed font-serif">
                  {isRealJsonTest && currentQ ? (
                    <div>
                      <MathSpan text={currentQ.question} className="font-sans font-medium" />
                      {currentQ.image && (
                        <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 max-w-md">
                          <img src={currentQ.image} alt={`Question ${selectedQuestion}`} className="rounded-lg max-h-64 object-contain mx-auto" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">
                        [Sample Preview for Question #{selectedQuestion} in {chapter.name}]
                      </p>
                      <p className="bg-slate-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                        A particle of mass m undergoes motion in the chapter <strong>"{chapter.name}"</strong> under an applied force F(t). When the question bank is imported from JSON, the complete problem statement, high-resolution SVG/PNG diagrams, and step-by-step test data will automatically load here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Options / Input Form */}
                {isRealJsonTest && currentQ ? (
                  currentQ.type === 'single_correct' && currentQ.options ? (
                    /* Single Correct Radio Options */
                    <div className="space-y-3 pt-2">
                      {currentQ.options.map((opt: string, optIdx: number) => {
                        const isChecked = responses[selectedQuestion] === optIdx;
                        return (
                          <label
                            key={optIdx}
                            onClick={() => handleSingleSelect(optIdx)}
                            className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-500/10'
                                : 'bg-slate-50/50 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 hover:bg-slate-100/60 dark:hover:bg-zinc-800/60'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400 dark:border-zinc-600'
                            }`}>
                              {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 w-5">
                              ({String.fromCharCode(65 + optIdx)})
                            </span>
                            <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 flex-1">
                              <MathSpan text={opt} />
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : currentQ.type === 'multi_correct' && currentQ.options ? (
                    /* Multi Correct Checkbox Options */
                    <div className="space-y-3 pt-2">
                      <div className="px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-xs text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Multiple Correct Options: Select one or more options. Partial marks awarded for correct choices.</span>
                      </div>
                      {currentQ.options.map((opt: string, optIdx: number) => {
                        const currentArr = Array.isArray(responses[selectedQuestion]) ? responses[selectedQuestion] : [];
                        const isChecked = currentArr.includes(optIdx);
                        return (
                          <label
                            key={optIdx}
                            onClick={() => handleMultiSelect(optIdx)}
                            className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 dark:border-purple-500 shadow-sm shadow-purple-500/10'
                                : 'bg-slate-50/50 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 hover:bg-slate-100/60 dark:hover:bg-zinc-800/60'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-400 dark:border-zinc-600'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-purple-600 dark:text-purple-400 w-5">
                              ({String.fromCharCode(65 + optIdx)})
                            </span>
                            <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 flex-1">
                              <MathSpan text={opt} />
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    /* Numerical Input + Virtual Keypad */
                    <div className="space-y-4 pt-2">
                      <div className="px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span>Numerical Value: Enter a number using your keyboard or on-screen keypad. (Tolerance: ±{currentQ.tolerance || 0.01})</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                          <input
                            type="text"
                            placeholder="Enter numerical answer..."
                            value={responses[selectedQuestion] !== undefined ? responses[selectedQuestion] : ''}
                            onChange={(e) => handleNumericalChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowVirtualKeypad(prev => !prev)}
                          className="px-4 py-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <span>⌨️</span>
                          <span>{showVirtualKeypad ? 'Hide Keypad' : 'Show Virtual Keypad'}</span>
                        </button>
                      </div>

                      {/* Virtual Keypad Box */}
                      {showVirtualKeypad && (
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 max-w-xs space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 block text-center">
                            Virtual Numeric Keypad
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '-'].map(key => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleKeypadPress(key)}
                                className="py-2.5 rounded-lg font-mono font-bold text-sm bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 shadow-sm"
                              >
                                {key}
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleKeypadPress('backspace')}
                              className="py-2 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                            >
                              ⌫ Backspace
                            </button>
                            <button
                              type="button"
                              onClick={() => handleKeypadPress('clear')}
                              className="py-2 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  /* Placeholder MCQ Options */
                  <div className="space-y-3 pt-2">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const isChecked = responses[selectedQuestion] === opt;
                      return (
                        <label
                          key={opt}
                          onClick={() => handleSingleSelect(opt.charCodeAt(0) - 65)}
                          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-500/10'
                              : 'bg-slate-50/50 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 hover:bg-slate-100/60 dark:hover:bg-zinc-800/60'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400 dark:border-zinc-600'
                          }`}>
                            {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 w-5">({opt})</span>
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300">Option {opt} [Awaiting JSON upload]</span>
                        </label>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

            {/* Action Bar */}
            <div className="max-w-4xl mx-auto w-full pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={responses[selectedQuestion] === undefined}
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
                  ⭐ {markedForReview.includes(selectedQuestion) ? 'Unmark Review' : 'Mark for Review'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(prev => Math.max(1, prev - 1))}
                  disabled={selectedQuestion === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="px-5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <span>Save & Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Question Palette */}
          <aside className="w-full lg:w-80 xl:w-96 bg-white dark:bg-[#11121a] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-zinc-800 p-4 sm:p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-4">
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

              <div>
                <span className="font-bold text-xs text-slate-700 dark:text-zinc-300 block mb-2">
                  Question Palette ({totalQuestions} Questions)
                </span>
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

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Exercise Test</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 dark:text-zinc-400">
                {answeredCount} of {totalQuestions} questions answered
              </p>
            </div>
          </aside>

        </div>
      )}

      {/* Submit Summary Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12172A] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-black text-xl text-slate-900 dark:text-zinc-50">
                Submit Exercise Test
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                {chapter.fullName || chapter.name} · {testData.title || exercise.title}
              </p>
            </div>

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
                  {formatTimer(defaultDuration - timeLeft)}
                </p>
              </div>
            </div>

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
                onClick={handleSubmitTest}
                className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
