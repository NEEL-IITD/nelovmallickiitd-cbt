// ==============================================================================
// NelovMallickIITD · Vault Content Manager (Admin Upload System)
// Allows uploading Chapterwise Exercises (.json) & Theory Notes (.pdf)
// Validates schema, renders live KaTeX math preview, saves to Vault
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { physicsChaptersData } from '../../data/physicsChapters';
import { chemistryChaptersData } from '../../data/chemistryChapters';
import { mathsChaptersData } from '../../data/mathsChapters';
import { vaultService } from '../../services/vaultService';
import { VaultExercise, VaultValidationResult } from '../../types';
import { isSafePdfUrl, sanitizeUploadFilename, verifyPdfMagicBytes } from '../../utils/validationSchemas';

interface VaultContentManagerProps {
  onLaunchTest?: (exercise: VaultExercise) => void;
  onClose?: () => void;
  initialSubject?: 'physics' | 'chemistry' | 'mathematics';
  initialChapterCode?: string;
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
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          trust: false
        });
      } catch (err) {
        console.warn('KaTeX rendering error:', err);
      }
    }
  }, [text]);

  return <span ref={containerRef} className={className}>{text}</span>;
};

export const VaultContentManager: React.FC<VaultContentManagerProps> = ({
  onLaunchTest,
  onClose,
  initialSubject = 'physics',
  initialChapterCode = 'C8'
}) => {
  const [activeTab, setActiveTab] = useState<'upload-json' | 'upload-pdf' | 'inventory'>('upload-json');
  const [subject, setSubject] = useState<'physics' | 'chemistry' | 'mathematics'>(initialSubject);
  const [selectedChapterCode, setSelectedChapterCode] = useState<string>(initialChapterCode);
  const [exerciseId, setExerciseId] = useState<string>('ex-1');
  const [, setCustomTitle] = useState<string>('');

  // JSON Editor States
  const [jsonText, setJsonText] = useState<string>('');
  const [validationResult, setValidationResult] = useState<VaultValidationResult | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [saveErrorMsg, setSaveErrorMsg] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // PDF Uploader States
  const [pdfSubject, setPdfSubject] = useState<'physics' | 'chemistry' | 'mathematics'>(initialSubject);
  const [pdfChapterCode, setPdfChapterCode] = useState<string>(initialChapterCode);
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pdfFileSize, setPdfFileSize] = useState<number>(0);
  const [pdfSuccessMsg, setPdfSuccessMsg] = useState<string>('');
  const [pdfErrorMsg, setPdfErrorMsg] = useState<string>('');
  const [isPdfDragging, setIsPdfDragging] = useState<boolean>(false);

  // Inventory States
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'physics' | 'chemistry' | 'mathematics'>('all');
  const [inventorySearch, setInventorySearch] = useState<string>('');

  // Load Inventory
  const refreshInventory = () => {
    const exercises = vaultService.getAllExercises() || [];
    const theoryNotes = vaultService.getAllTheoryNotes() || [];
    const combined = [
      ...exercises.map((e) => ({ ...e, itemType: 'exercise' })),
      ...theoryNotes.map((t) => ({ ...t, itemType: 'theory' }))
    ];
    setInventoryList(combined);
  };

  useEffect(() => {
    refreshInventory();
  }, [activeTab]);

  // Chapter options based on selected subject
  const currentChapters = useMemo(() => {
    if (subject === 'chemistry') return chemistryChaptersData;
    if (subject === 'mathematics') return mathsChaptersData;
    return physicsChaptersData;
  }, [subject]);

  const currentPdfChapters = useMemo(() => {
    if (pdfSubject === 'chemistry') return chemistryChaptersData;
    if (pdfSubject === 'mathematics') return mathsChaptersData;
    return physicsChaptersData;
  }, [pdfSubject]);

  // Auto-set first chapter when subject changes if not found
  useEffect(() => {
    if (currentChapters.length > 0) {
      const match = currentChapters.find((c) => (c.code || c.id) === selectedChapterCode);
      if (!match) {
        setSelectedChapterCode(currentChapters[0].code || currentChapters[0].id);
      }
    }
  }, [subject, currentChapters]);

  useEffect(() => {
    if (currentPdfChapters.length > 0) {
      const match = currentPdfChapters.find((c) => (c.code || c.id) === pdfChapterCode);
      if (!match) {
        setPdfChapterCode(currentPdfChapters[0].code || currentPdfChapters[0].id);
      }
    }
  }, [pdfSubject, currentPdfChapters]);

  const handleLoadTemplate = () => {
    const tpl = vaultService.getSampleTemplate();
    tpl.subject = subject;
    tpl.chapterId = selectedChapterCode;
    tpl.exerciseId = exerciseId;
    const jsonStr = JSON.stringify(tpl, null, 2);
    setJsonText(jsonStr);
    handleValidateJson(jsonStr);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      handleValidateJson(formatted);
    } catch (e: any) {
      setSaveErrorMsg(`Cannot format: ${e.message}`);
    }
  };

  const handleValidateJson = (textToValidate?: string): VaultValidationResult => {
    const raw = textToValidate !== undefined ? textToValidate : jsonText;
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    const res = vaultService.validateExerciseJson(raw);
    setValidationResult(res);
    if (!res.isValid) {
      setSaveErrorMsg(`Validation failed with ${res.errors.length} issue(s)`);
    }
    return res;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processJsonFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processJsonFile(files[0]);
    }
  };

  const processJsonFile = (file: File) => {
    const safeName = sanitizeUploadFilename(file.name);
    if (!safeName.toLowerCase().endsWith('.json')) {
      setSaveErrorMsg('Please upload a valid .json file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSaveErrorMsg('JSON file exceeds maximum size limit of 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      try {
        const parsed = JSON.parse(text);
        if (parsed.subject) setSubject(parsed.subject.toLowerCase());
        if (parsed.chapterId) setSelectedChapterCode(parsed.chapterId);
        if (parsed.exerciseId) setExerciseId(parsed.exerciseId);
        if (parsed.title) setCustomTitle(parsed.title);
        handleValidateJson(text);
      } catch (err: any) {
        setSaveErrorMsg(`JSON parse error in ${safeName}: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveExercise = async () => {
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    const val = handleValidateJson();
    if (!val || !val.isValid || !val.data) {
      setSaveErrorMsg('Please fix the schema errors before deploying.');
      return;
    }

    const res = await vaultService.saveExercise(val.data);
    if (res.ok) {
      setSaveSuccessMsg(`✓ Exercise "${val.data.title}" successfully saved and deployed to Vault!`);
      refreshInventory();
    } else {
      setSaveErrorMsg(`Failed to save exercise: ${res.error}`);
    }
  };

  // PDF Handling
  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPdfDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processPdfFile(files[0]);
    }
  };

  const handlePdfFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processPdfFile(files[0]);
    }
  };

  const processPdfFile = async (file: File) => {
    const safeName = sanitizeUploadFilename(file.name);
    if (!safeName.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setPdfErrorMsg('Please upload a valid .pdf document');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPdfErrorMsg('PDF file exceeds maximum size limit of 15 MB.');
      return;
    }
    const hasMagic = await verifyPdfMagicBytes(file);
    if (!hasMagic) {
      setPdfErrorMsg('Invalid PDF signature (%PDF- header missing).');
      return;
    }
    setPdfFileName(safeName);
    setPdfFileSize(file.size);
    setPdfTitle(safeName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = String(event.target?.result || '');
      if (!isSafePdfUrl(resultUrl)) {
        setPdfErrorMsg('PDF payload failed safety validation.');
        return;
      }
      setPdfDataUrl(resultUrl);
      setPdfSuccessMsg(`Loaded "${safeName}" (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePdf = async () => {
    setPdfSuccessMsg('');
    setPdfErrorMsg('');
    if (!pdfDataUrl) {
      setPdfErrorMsg('Please select or drop a PDF file first.');
      return;
    }

    const chObj = currentPdfChapters.find((c: any) => (c.code || c.id) === pdfChapterCode) as any || {};
    const titleToSave = pdfTitle || `${chObj.name || pdfChapterCode} — Complete Theory Notes`;

    const res = await vaultService.saveTheoryNotes({
      subject: pdfSubject,
      chapterId: pdfChapterCode,
      chapterName: chObj.name || chObj.fullName || '',
      title: titleToSave,
      pdfUrl: pdfDataUrl,
      fileName: pdfFileName,
      fileSizeBytes: pdfFileSize
    });

    if (res.ok) {
      setPdfSuccessMsg(`✓ Theory notes PDF "${titleToSave}" successfully saved to Vault!`);
      refreshInventory();
    } else {
      setPdfErrorMsg(`Failed to save theory notes: ${res.error}`);
    }
  };

  const handleDeleteItem = async (item: any) => {
    if (!window.confirm(`Are you sure you want to remove "${item.title || item.fileName}" from the Vault?`)) return;
    if (item.itemType === 'exercise') {
      await vaultService.deleteExercise(item.subject, item.chapterId, item.exerciseId);
    } else {
      await vaultService.deleteTheoryNotes(item.subject, item.chapterId);
    }
    refreshInventory();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Sub tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload-json')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'upload-json'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
          >
            📤 Upload Exercise JSON
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload-pdf')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'upload-pdf'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
          >
            📄 Upload Theory PDF
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
          >
            📋 Vault Inventory ({inventoryList.length})
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* 1. EXERCISE JSON TAB */}
      {activeTab === 'upload-json' && (
        <div className="space-y-6">
          {/* Metadata selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-[#121318] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                Target Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-zinc-50"
              >
                <option value="physics">⚛️ Physics (28 Chapters)</option>
                <option value="chemistry">🧪 Chemistry (29 Chapters)</option>
                <option value="mathematics">📐 Mathematics (26 Chapters)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                Chapter
              </label>
              <select
                value={selectedChapterCode}
                onChange={(e) => setSelectedChapterCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-zinc-50"
              >
                {currentChapters.map((ch: any) => (
                  <option key={ch.id} value={ch.code || ch.id}>
                    {ch.code} — {ch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                Exercise Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. ex-1, c8-ex1, ex-2"
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-zinc-50"
              />
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 hover:border-indigo-400'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl shadow-sm">
                📤
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-200">
                  Drag & Drop Exercise JSON Here
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  or choose a <code className="font-mono text-indigo-600 dark:text-indigo-400">.json</code> file matching the JEE test schema
                </p>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-500/20 transition-all">
                  <span>Browse .json File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Raw JSON Editor & Quick Action Buttons */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Exercise JSON Specification (Schema Locked)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadTemplate}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                >
                  ⚡ Load Rotational Motion Template
                </button>
                <button
                  type="button"
                  onClick={handleFormatJson}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Format JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleValidateJson()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  Validate Schema
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              placeholder="Paste standardized exercise JSON here..."
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setSaveSuccessMsg('');
                setSaveErrorMsg('');
              }}
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          {/* Validation Feedback & Alerts */}
          {saveSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span>✓</span>
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {saveErrorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <span>✕</span>
              <span>{saveErrorMsg}</span>
            </div>
          )}

          {/* Schema Validation Summary Card */}
          {validationResult && validationResult.summary && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-zinc-50">
                    Schema Validated: {validationResult.summary.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {validationResult.summary.totalQuestions} Questions
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {validationResult.summary.totalMarks} Total Marks
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {validationResult.summary.durationMinutes} Minutes
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                  <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Single Choice</span>
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                    {validationResult.summary.singleCorrectCount}
                  </span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                  <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Multi-Correct</span>
                  <span className="font-black text-sm text-purple-600 dark:text-purple-400">
                    {validationResult.summary.multiCorrectCount}
                  </span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                  <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Numerical</span>
                  <span className="font-black text-sm text-teal-600 dark:text-teal-400">
                    {validationResult.summary.numericalCount}
                  </span>
                </div>
              </div>

              {/* Live KaTeX Questions Preview */}
              {validationResult.data && (
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-xs text-slate-700 dark:text-zinc-300 block">
                    Interactive Question Preview with LaTeX Math:
                  </span>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {validationResult.data.questions.map((q: any, idx: number) => (
                      <div
                        key={q.id || idx}
                        className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-indigo-600 dark:text-indigo-400">
                            Q#{q.number || idx + 1} ({q.type})
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Ans: {Array.isArray(q.correctAnswer) ? q.correctAnswer.map((a: number) => String.fromCharCode(65 + a)).join(', ') : (q.type === 'numerical' ? q.correctAnswer : String.fromCharCode(65 + q.correctAnswer))}
                          </span>
                        </div>
                        <div className="text-slate-800 dark:text-zinc-200 font-medium">
                          <MathSpan text={q.question} />
                        </div>
                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="p-2 rounded bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
                                <span className="font-bold text-indigo-600 mr-1.5">({String.fromCharCode(65 + oIdx)})</span>
                                <MathSpan text={opt} />
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-600 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-700">
                          <strong>Solution:</strong> <MathSpan text={q.solution} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveExercise}
              className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <span>⚡ Save & Deploy Exercise to Vault</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. THEORY PDF TAB */}
      {activeTab === 'upload-pdf' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-[#121318] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                Target Subject
              </label>
              <select
                value={pdfSubject}
                onChange={(e) => setPdfSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-zinc-50"
              >
                <option value="physics">⚛️ Physics (28 Chapters)</option>
                <option value="chemistry">🧪 Chemistry (29 Chapters)</option>
                <option value="mathematics">📐 Mathematics (26 Chapters)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                Target Chapter
              </label>
              <select
                value={pdfChapterCode}
                onChange={(e) => setPdfChapterCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-zinc-50"
              >
                {currentPdfChapters.map((ch: any) => (
                  <option key={ch.id} value={ch.code || ch.id}>
                    {ch.code} — {ch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop PDF Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsPdfDragging(true); }}
            onDragLeave={() => setIsPdfDragging(false)}
            onDrop={handlePdfDrop}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
              isPdfDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                : 'border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 hover:border-emerald-400'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-sm">
                📄
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-200">
                  Drag & Drop Theory PDF Document Here
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Upload complete theory notes or formula book in <code className="font-mono text-emerald-600 dark:text-emerald-400">.pdf</code> format
                </p>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/20 transition-all">
                  <span>Browse .pdf File</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {pdfSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span>✓</span>
              <span>{pdfSuccessMsg}</span>
            </div>
          )}

          {pdfErrorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <span>✕</span>
              <span>{pdfErrorMsg}</span>
            </div>
          )}

          {/* PDF Preview Frame if loaded */}
          {pdfDataUrl && (
            <div className="space-y-3 bg-white dark:bg-[#121318] p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700 dark:text-zinc-300">
                  PDF Preview: {pdfFileName} ({(pdfFileSize / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={() => { setPdfDataUrl(''); setPdfFileName(''); setPdfFileSize(0); }}
                  className="text-xs text-rose-500 hover:underline font-semibold"
                >
                  Clear File
                </button>
              </div>
              <iframe
                src={isSafePdfUrl(pdfDataUrl) ? pdfDataUrl : ''}
                title="PDF Preview"
                className="w-full h-96 rounded-xl border border-slate-200 dark:border-zinc-800"
              />
            </div>
          )}

          {/* Save PDF Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={!pdfDataUrl}
              onClick={handleSavePdf}
              className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-white transition-all flex items-center gap-2 ${
                pdfDataUrl
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span>📄 Save Theory PDF to Vault</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(['all', 'physics', 'chemistry', 'mathematics'] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setInventoryFilter(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    inventoryFilter === sub
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search vault inventory..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-zinc-50 w-full sm:w-64"
            />
          </div>

          {/* List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventoryList
              .filter((item) => {
                if (inventoryFilter !== 'all' && item.subject !== inventoryFilter) return false;
                if (inventorySearch) {
                  const s = inventorySearch.toLowerCase();
                  const t = (item.title || item.fileName || '').toLowerCase();
                  const c = (item.chapterId || '').toLowerCase();
                  return t.includes(s) || c.includes(s);
                }
                return true;
              })
              .map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#121318] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          item.itemType === 'exercise'
                            ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {item.itemType === 'exercise' ? '⚡ CBT Test (JSON)' : '📄 Theory Notes (PDF)'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        {item.subject} • {item.chapterId}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-zinc-50 line-clamp-1">
                      {item.title || item.fileName}
                    </h4>

                    <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-3">
                      {item.itemType === 'exercise' ? (
                        <>
                          <span>
                            Questions: <strong>{item.totalQuestions || item.questions?.length || 0}</strong>
                          </span>
                          <span>
                            Duration: <strong>{item.durationMinutes}m</strong>
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            Size: <strong>{((item.fileSizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB</strong>
                          </span>
                          <span>
                            Format: <strong>PDF</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      {item.itemType === 'exercise' && onLaunchTest && (
                        <button
                          type="button"
                          onClick={() => onLaunchTest(item)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                        >
                          ▶ Test Launch
                        </button>
                      )}
                      {item.itemType === 'theory' && (
                        <a
                          href={isSafePdfUrl(item.pdfUrl) ? item.pdfUrl : '#'}
                          download={item.fileName || 'theory.pdf'}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                        >
                          📥 Download PDF
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item)}
                      className="text-rose-600 hover:text-rose-700 p-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {inventoryList.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-zinc-400 text-xs">
              No custom exercises or theory documents uploaded yet. Use the tabs above to upload your first JSON or PDF!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
