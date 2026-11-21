// ==============================================================================
// NelovMallickIITD CBT Platform - Terms of Service
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React from 'react';
import { LegalPageLayout, TocItem } from './LegalPageLayout';
import { LEGAL_CONFIG } from '../../config/legal';

const TOC: TocItem[] = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'free-service', title: '2. 100% Free Educational Access' },
  { id: 'as-is-basis', title: '3. Educational "As-Is" Basis' },
  { id: 'eligibility', title: '4. Student Eligibility & Minors' },
  { id: 'attempt-cap', title: '5. Strict 3-Attempt Mock Test Cap' },
  { id: 'prohibited-conduct', title: '6. Prohibited Misuse & Scraping' },
  { id: 'intellectual-property', title: '7. Intellectual Property Rights' },
  { id: 'suspension-moderation', title: '8. Suspension & Account Termination' },
  { id: 'liability-limitation', title: '9. Limitation of Liability' },
  { id: 'governing-law', title: '10. Governing Law & Jurisdiction' }
];

export const TermsOfService: React.FC = () => {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Standard educational terms governing use of the free Computer-Based Test (CBT) platform, study vaults, and video lectures mentored by Nelov Mallick (IIT Delhi)."
      badgeText="Platform Terms & Fair Use"
      toc={TOC}
    >
      <section id="acceptance" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          1. Acceptance of Terms
        </h2>
        <p>
          By creating an account, accessing test papers, viewing video lectures, or utilizing any portion of this portal (the "Platform"), you agree to be bound by these Terms of Service ("Terms") and our <a href="#/privacy-policy" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Privacy Policy</a>. If you do not agree to these terms, please do not use the Platform.
        </p>
      </section>

      <section id="free-service" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          2. 100% Free Educational Access (Zero Fees / No Refunds Applicable)
        </h2>
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 text-xs leading-relaxed space-y-2">
          <p>
            <strong>100% Free Forever:</strong> This portal is an independent philanthropic open educational initiative founded and mentored by <strong>{LEGAL_CONFIG.OWNER_NAME}</strong> (IIT Delhi alumnus).
          </p>
          <p>
            There are <strong>no registration fees, no monthly subscriptions, no paywalls, and no paid premium tiers</strong> anywhere on this website. Because no monetary consideration or payments are ever requested or accepted from students, <strong>no Refund Policy is applicable</strong>.
          </p>
        </div>
      </section>

      <section id="as-is-basis" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          3. Educational "As-Is" Service & No Result Guarantee
        </h2>
        <p>
          The Platform, including all CBT mock test papers (PTA 01–10, PTM 01–10), chapter vault exercises, formulas, and video lectures, is provided strictly on an <strong>"AS-IS" and "AS-AVAILABLE" basis</strong> for self-study and practice:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li>We do not guarantee 100% uninterrupted platform uptime or zero latency during high-traffic mock testing windows.</li>
          <li>We do not make any representation or guarantee that practicing on this portal will result in qualification, selection, or any specific rank or percentile in the official JEE Mains or JEE Advanced examinations.</li>
          <li>Official examination outcomes depend solely on the candidate’s individual dedication, exam day temperament, and performance.</li>
        </ul>
      </section>

      <section id="eligibility" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          4. Student Eligibility & Minor Registration
        </h2>
        <p>
          The Platform is intended for students preparing for engineering entrance examinations (JEE Mains and JEE Advanced).
        </p>
        <p>
          If you are under 18 years of age, you confirm that you have obtained the permission of your parent or lawful guardian to register for and use this Platform. Parents or guardians may review or delete their ward's data at any time by contacting us.
        </p>
      </section>

      <section id="attempt-cap" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          5. Strict 3-Attempt Mock Test Cap & Fair Play
        </h2>
        <p>
          To preserve authentic test psychology and prevent answer memorization, each full-syllabus examination paper (PTA and PTM) is limited to a strict cap of <strong>{LEGAL_CONFIG.TEST_ATTEMPT_LIMIT} attempts</strong> per student account:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li>Attempt 1 reflects your diagnostic benchmark.</li>
          <li>Attempt 2 and Attempt 3 allow revision and mistake correction.</li>
          <li>Creating multiple or fake accounts using disposable numbers/emails to circumvent the attempt cap violates fair use and will lead to automatic account disqualification.</li>
        </ul>
      </section>

      <section id="prohibited-conduct" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          6. Prohibited Conduct & Anti-Scraping Rules
        </h2>
        <p>You agree NOT to engage in any of the following prohibited activities:</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li><strong>Automated Scraping:</strong> Using bots, crawlers, spiders, or scripts to bulk-download test questions, answer keys, solutions, or vault documents.</li>
          <li><strong>Commercial Exploitation:</strong> Reselling, bundling, republishing, or redistributing questions, solutions, or lectures for commercial gain or within paid coaching courses without written consent.</li>
          <li><strong>Identity Fraud:</strong> Registering with an unauthorized phone number, synthetic identity, or another student’s credentials.</li>
          <li><strong>Abuse of Reporting Tools:</strong> Submitting spam, offensive comments, or fraudulent tickets via the "Report Error" feature.</li>
        </ol>
      </section>

      <section id="intellectual-property" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          7. Intellectual Property Rights
        </h2>
        <p>
          All original educational content—including step-by-step worked explanations, graphical diagrams, video lectures, KaTeX problem formats, software source code, website design, and the <strong>NelovMallickIITD</strong> brand—is the proprietary intellectual property of <strong>{LEGAL_CONFIG.OWNER_NAME}</strong>.
        </p>
        <p>
          Students are granted a personal, non-exclusive, non-transferable, revocable license to view and practice the content solely for their individual educational preparation.
        </p>
      </section>

      <section id="suspension-moderation" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          8. Account Suspension & Content Moderation
        </h2>
        <p>
          We reserve the right to suspend, restrict, or terminate any account found engaging in multi-account abuse, automated scraping, harassment, or security probing, without prior notice.
        </p>
      </section>

      <section id="liability-limitation" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          9. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by Indian law, {LEGAL_CONFIG.OWNER_NAME} and platform contributors shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use or inability to use this free service, including but not limited to technical interruptions, loss of test data, or examination performance outcomes.
        </p>
      </section>

      <section id="governing-law" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          10. Governing Law & Dispute Resolution
        </h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the <strong>Republic of India</strong>. Any legal dispute, controversy, or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>{LEGAL_CONFIG.JURISDICTION}</strong>.
        </p>
      </section>
    </LegalPageLayout>
  );
};
