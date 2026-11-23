import React, { useMemo } from 'react';
import { vaultService } from '../../services/vaultService';
import { VaultTheoryNote } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface TheoryPdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: any;
  subject?: 'physics' | 'chemistry' | 'mathematics';
  onOpenAdminUpload?: (chapter: any) => void;
}

export const TheoryPdfViewerModal: React.FC<TheoryPdfViewerModalProps> = ({
  isOpen,
  onClose,
  chapter,
  subject = 'physics',
  onOpenAdminUpload
}) => {
  const { isAdmin } = useAuth();
  if (!isOpen || !chapter) return null;

  const theoryData: VaultTheoryNote | null = useMemo(() => {
    return vaultService.getTheoryNotes(subject, chapter.code || chapter.id);
  }, [subject, chapter]);

  const hasPdf = Boolean(theoryData && theoryData.pdfUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white dark:bg-[#12131a] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shadow-sm">
              📄
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <span>{theoryData?.title || (chapter.fullName || chapter.name) + ' — Theory Notes'}</span>
                {hasPdf && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    PDF Ready
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Official JEE Theory Book · Mentored by <strong>Nelov Mallick (IIT Delhi)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPdf && theoryData?.pdfUrl && (
              <a
                href={theoryData.pdfUrl}
                download={theoryData.fileName || 'Theory_Notes.pdf'}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                📥 Download PDF
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#0c0d12]">
          {hasPdf && theoryData?.pdfUrl ? (
            <div className="space-y-3">
              <iframe
                src={theoryData.pdfUrl}
                title="Theory Notes Document"
                className="w-full h-[65vh] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white shadow-inner"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  File: <strong>{theoryData.fileName}</strong> (
                  {((theoryData.fileSizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <a
                  href={theoryData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Open in New Tab ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-xl mx-auto py-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-sm">
                ⏳
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-slate-900 dark:text-zinc-50">
                  Theory Notes Upload Pending
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  High-yield concept summaries and formula sheets for <strong>{chapter.name}</strong> will be uploaded as PDF by Nelov Mallick. You can upload a PDF right now using the Admin Panel.
                </p>
              </div>

              {chapter.topics && chapter.topics.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left text-xs space-y-2 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-zinc-100">
                    📋 Mapped Core Concepts:
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400">
                    {chapter.topics.map((t: string, idx: number) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isAdmin && onOpenAdminUpload && (
                <button
                  type="button"
                  onClick={() => onOpenAdminUpload(chapter)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all"
                >
                  📄 Upload Theory PDF Now (Admin)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
