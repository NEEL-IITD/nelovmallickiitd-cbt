// ==============================================================================
// NelovMallickIITD CBT Platform - Official Disclaimer
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React from 'react';
import { LegalPageLayout, TocItem } from './LegalPageLayout';
import { LEGAL_CONFIG } from '../../config/legal';

const TOC: TocItem[] = [
  { id: 'non-affiliation', title: '1. No Official Government or NTA Affiliation' },
  { id: 'rank-predictor', title: '2. Approximate Rank Predictor Notice' },
  { id: 'academic-accuracy', title: '3. Academic Content & KaTeX Corrections' },
  { id: 'error-reporting', title: '4. Error Reporting & Feedback Mechanism' },
  { id: 'third-party-media', title: '5. Embedded YouTube Video Content' },
  { id: 'student-discretion', title: '6. Student Discretion & Self-Study' }
];

export const Disclaimer: React.FC = () => {
  return (
    <LegalPageLayout
      title="Official Disclaimer"
      subtitle="Important legal clarification regarding official examination bodies, score estimations, academic accuracy, and platform boundaries."
      badgeText="Important Legal Notice"
      toc={TOC}
    >
      <section id="non-affiliation" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          1. No Official Affiliation with NTA, IITs, or Government of India
        </h2>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs leading-relaxed space-y-2">
          <p>
            ⚠️ <strong>Prominent Notice of Non-Affiliation:</strong>
          </p>
          <p>
            This portal is an independent educational initiative curated and mentored by <strong>{LEGAL_CONFIG.OWNER_NAME}</strong> (IIT Delhi alumnus).
          </p>
          <p>
            This website is <strong>NOT affiliated with, associated with, authorized by, endorsed by, sponsored by, or in any way officially connected to</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The <strong>National Testing Agency (NTA)</strong></li>
            <li>The <strong>Indian Institutes of Technology (IITs)</strong> or the Joint Admission Board (JAB)</li>
            <li>The <strong>JEE Apex Board (JAB)</strong></li>
            <li>The <strong>Ministry of Education (MoE)</strong>, Government of India</li>
            <li>Any state or central government examination authority</li>
          </ul>
          <p className="pt-1">
            Official JEE information, application schedules, and bulletins must always be verified on the official government portals: <a href="https://jeemain.nta.nic.in" target="_blank" rel="noopener noreferrer" className="underline font-bold">jeemain.nta.nic.in</a> and <a href="https://jeeadv.ac.in" target="_blank" rel="noopener noreferrer" className="underline font-bold">jeeadv.ac.in</a>.
          </p>
        </div>
      </section>

      <section id="rank-predictor" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          2. Approximate Rank Predictor & Percentile Estimations
        </h2>
        <p>
          The All India Rank (AIR) and percentile figures provided in your test scorecard (such as "Estimated AIR: Top 500–1,500") are <strong>statistical approximations derived from historical percentile-vs-marks trends</strong> of past JEE examinations:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li>Actual JEE cutoffs and percentiles vary every year depending on overall paper difficulty, shift normalizations, candidate volume, and seat allocations.</li>
          <li>Our rank estimates are intended purely as a diagnostic benchmark for personal self-assessment and motivation, and must never be treated as an official prediction or guarantee of admission to any IIT, NIT, IIIT, or CFTI.</li>
        </ul>
      </section>

      <section id="academic-accuracy" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          3. Academic Content & KaTeX Corrections
        </h2>
        <p>
          Every test question, answer key, numerical tolerance range, and KaTeX mathematical proof on this portal is meticulously reviewed by Nelov Mallick (IIT Delhi).
        </p>
        <p>
          However, due to the volume and complexity of advanced STEM typography, occasional typographical errors, ambiguity in graphical interpretations, or discrepancies in numerical key bounds may inadvertently occur. We make continuous efforts to maintain zero defects.
        </p>
      </section>

      <section id="error-reporting" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          4. Error Reporting & Feedback Mechanism
        </h2>
        <p>
          If you encounter any mistake, formatting irregularity, or questionable solution during your practice, please use the <strong>"🚩 Report Error"</strong> button available directly on the CBT test interface or in your Revision Notebook.
        </p>
        <p>
          Our academic team reviews all student submissions and regularly updates answer keys and solution steps to maintain gold-standard academic rigor.
        </p>
      </section>

      <section id="third-party-media" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          5. Embedded YouTube Video Content
        </h2>
        <p>
          All video lectures embedded on this portal are hosted on YouTube and curated by {LEGAL_CONFIG.OWNER_NAME}. Content is embedded utilizing YouTube’s official embedded player under YouTube’s Terms of Service.
        </p>
        <p>
          We do not claim ownership of third-party advertisements or recommendation algorithms that YouTube may serve within its native video player interface.
        </p>
      </section>

      <section id="student-discretion" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          6. Student Discretion & Self-Study
        </h2>
        <p>
          This portal is intended as a supplementary self-study and practice tool to accompany your official NCERT textbooks, standard reference materials, and classroom instruction. Candidates should exercise personal judgment and consult verified reference texts for formal conceptual mastery.
        </p>
      </section>
    </LegalPageLayout>
  );
};
