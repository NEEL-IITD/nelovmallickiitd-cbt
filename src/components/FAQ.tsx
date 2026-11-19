import React, { useState } from 'react';
import { ExamType } from '../types';
import { faqsData } from '../data/siteData';

interface FAQProps {
  exam: ExamType;
}

export const FAQ: React.FC<FAQProps> = ({ exam }) => {
  const faqs = faqsData(exam);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
            Can’t find your answer here?{' '}
            <a
              href="mailto:support@nelovmallickiitd.com"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Email us directly
            </a>
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 border-t border-slate-100 dark:border-zinc-800/80 animate-in fade-in slide-in-from-top-1">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
