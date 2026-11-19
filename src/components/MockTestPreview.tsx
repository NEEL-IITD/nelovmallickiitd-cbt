import React, { useState, useEffect } from 'react';
import { ExamType } from '../types';

interface MockTestPreviewProps {
  exam: ExamType;
  onOpenQuestionPaper?: () => void;
}

export const MockTestPreview: React.FC<MockTestPreviewProps> = ({
  exam,
  onOpenQuestionPaper,
}) => {
  // Interactive mock test state
  const [currentQIndex, setCurrentQIndex] = useState(13); // Q14 (0-indexed 13)
  const [selectedOption, setSelectedOption] = useState<number | null>(1); // Option B (1/3)
  const [secondsLeft, setSecondsLeft] = useState(6734); // 01:52:14
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set([5, 11, 13]));
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<number, number>>(
    new Map([
      [0, 1], [1, 2], [2, 0], [4, 3], [6, 1], [7, 2], [9, 0], [10, 3], [12, 1], [13, 1]
    ])
  );

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 10800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = [
    {
      subject: 'PHYSICS',
      marks: '+4 / -1',
      text: 'A uniform disc of mass M and radius R rolls without slipping on a horizontal surface. The ratio of its rotational kinetic energy to its total kinetic energy is:',
      options: ['1/2', '1/3', '2/5', '2/7'],
    },
    {
      subject: 'CHEMISTRY',
      marks: '+4 / -1',
      text: 'Which of the following coordination compounds exhibits optical isomerism and has the highest crystal field stabilization energy (CFSE)?',
      options: ['[Co(en)3]3+', '[Co(NH3)6]3+', '[Cr(H2O)6]3+', '[Ni(CN)4]2-'],
    },
    {
      subject: exam === 'jee' ? 'MATHEMATICS' : 'BIOLOGY',
      marks: '+4 / -1',
      text: exam === 'jee'
        ? 'Let f(x) = x³ - 3x + 2. The number of real roots of f(f(x)) = 0 is equal to:'
        : 'In C4 plants, the primary CO2 acceptor and the enzyme catalyzing the initial carboxylation reaction are located in:',
      options: exam === 'jee'
        ? ['3', '5', '7', '9']
        : ['PEP, PEP carboxylase in Mesophyll cells', 'RuBP, RuBisCO in Bundle Sheath cells', 'OAA, PEPcase in Bundle Sheath', 'Malic acid in Mesophyll cells'],
    }
  ];

  const currentQ = questions[currentQIndex % questions.length];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    const newAnswers = new Map(answeredQuestions);
    newAnswers.set(currentQIndex, idx);
    setAnsweredQuestions(newAnswers);
  };

  const handleNextQuestion = () => {
    const nextIdx = (currentQIndex + 1) % 20;
    setCurrentQIndex(nextIdx);
    setSelectedOption(answeredQuestions.get(nextIdx) ?? null);
  };

  const handleToggleFlag = () => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentQIndex)) {
      newFlags.delete(currentQIndex);
    } else {
      newFlags.add(currentQIndex);
    }
    setFlaggedQuestions(newFlags);
  };

  const handleClearResponse = () => {
    setSelectedOption(null);
    const newAnswers = new Map(answeredQuestions);
    newAnswers.delete(currentQIndex);
    setAnsweredQuestions(newAnswers);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white/95 dark:bg-[#121318]/95 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
      
      {/* Top Test Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/70 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-zinc-200 uppercase">
            {exam === 'jee' ? 'JEE MAIN 2027 CBT' : 'NEET UG 2027 CBT'}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">· Full Test 04</span>
        </div>

        {/* Ticking Timer Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTimer(secondsLeft)}</span>
        </div>
      </div>

      {/* Question Details Area */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Meta tags: Question number, Subject, Marks */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800/60">
              Q {currentQIndex + 1} / 75
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-semibold">
              {currentQ.subject}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
              {currentQ.marks}
            </span>
            {flaggedQuestions.has(currentQIndex) && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Marked for Review
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-zinc-100 leading-relaxed min-h-[56px]">
          {currentQ.text}
        </p>

        {/* Options List */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const letters = ['A', 'B', 'C', 'D'];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-white dark:bg-[#161720]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {letters[idx]}
                </span>
                <span className="font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Question Matrix Status & Interactive Palette */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
              Question Palette (20 Qs Preview)
            </span>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Review
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-zinc-700" /> Pending
              </span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: 20 }).map((_, i) => {
              const isCurrent = i === currentQIndex;
              const isAnswered = answeredQuestions.has(i);
              const isReview = flaggedQuestions.has(i);

              let bgClass = 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700';
              if (isAnswered && !isReview) {
                bgClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
              } else if (isReview) {
                bgClass = 'bg-purple-600 text-white border-purple-700 font-bold';
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCurrentQIndex(i);
                    setSelectedOption(answeredQuestions.get(i) ?? null);
                  }}
                  className={`h-7 rounded-lg text-[11px] font-mono flex items-center justify-center border transition-all ${bgClass} ${
                    isCurrent ? 'ring-2 ring-indigo-500 ring-offset-1 scale-105' : 'hover:scale-105'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                flaggedQuestions.has(currentQIndex)
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              🚩 {flaggedQuestions.has(currentQIndex) ? 'Unmark Review' : 'Mark for Review'}
            </button>
            <button
              type="button"
              onClick={handleClearResponse}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
          >
            Save & Next →
          </button>
        </div>
      </div>

      {/* Footer Info & Modal Link */}
      <div className="px-5 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/30 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Interactive Exam Simulator
        </span>
        <button
          onClick={onOpenQuestionPaper}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          View Full Question Paper
        </button>
      </div>

    </div>
  );
};
