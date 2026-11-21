// ==============================================================================
// NelovMallickIITD CBT Platform - Copyright & Takedown Policy
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React from 'react';
import { LegalPageLayout, TocItem } from './LegalPageLayout';
import { LEGAL_CONFIG } from '../../config/legal';

const TOC: TocItem[] = [
  { id: 'fair-dealing', title: '1. Fair Dealing & Educational Purpose' },
  { id: 'original-ip', title: '2. Original Content & Proprietary Rights' },
  { id: 'safe-harbor', title: '3. Safe Harbor & Copyright Compliance' },
  { id: 'takedown-notice', title: '4. Notice & Takedown Procedure (48–72h)' },
  { id: 'counter-notice', title: '5. Counter-Notification Procedure' },
  { id: 'infringer-policy', title: '6. Policy on Repeat Infringers' }
];

export const CopyrightPolicy: React.FC = () => {
  return (
    <LegalPageLayout
      title="Copyright & Takedown Policy"
      subtitle="Formal intellectual property notice, non-commercial fair dealing declaration, and expedited 48–72 hour content removal workflow under the Indian Copyright Act and DMCA principles."
      badgeText="IP & Safe Harbor Policy"
      toc={TOC}
    >
      <section id="fair-dealing" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          1. Fair Dealing & Non-Commercial Educational Purpose
        </h2>
        <p>
          This portal operates strictly as a <strong>100% free open educational resource</strong> for Indian students preparing for national competitive examinations.
        </p>
        <p>
          In accordance with <strong>Section 52(1)(a) and Section 52(1)(i) of the Indian Copyright Act, 1957</strong>, the reproduction and dissemination of examination problems, conceptual illustrations, and reference materials solely for the purpose of private study, non-commercial research, criticism, review, and instruction by a teacher in the course of instruction constitutes lawful <strong>Fair Dealing</strong>.
        </p>
        <p>
          No admission fees, subscription fees, licensing fees, or advertising revenues are derived from the content on this website.
        </p>
      </section>

      <section id="original-ip" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          2. Original Content & Proprietary Rights
        </h2>
        <p>
          The original step-by-step worked solutions, mathematical formatting, customized KaTeX proofs, video lecture explanations, examination CBT software architecture, and user interface designs are the intellectual property of <strong>{LEGAL_CONFIG.OWNER_NAME}</strong> (IIT Delhi alumnus).
        </p>
        <p>
          Unauthorized commercial reproduction, bulk harvesting, scraping, or re-selling of our original explanations or test series in paid books, coaching apps, or third-party platforms is strictly prohibited.
        </p>
      </section>

      <section id="safe-harbor" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          3. Safe Harbor & Copyright Compliance Commitment
        </h2>
        <p>
          We deeply respect the intellectual property rights of all copyright holders, publishing houses, and academic institutions.
        </p>
        <p>
          If any rightful copyright owner believes that specific content hosted on or linked from this portal infringes their copyright, we maintain a prompt, expedited <strong>Notice and Takedown Procedure</strong> to investigate and remove or disable access to the contested material within <strong>{LEGAL_CONFIG.TAKEDOWN_TIMEFRAME}</strong>.
        </p>
      </section>

      <section id="takedown-notice" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          4. Notice & Takedown Procedure ({LEGAL_CONFIG.TAKEDOWN_TIMEFRAME})
        </h2>
        <p>
          To submit a formal copyright takedown request, please send an email to our designated contact at{' '}
          <a href={`mailto:${LEGAL_CONFIG.CONTACT_EMAIL}`} className="text-indigo-600 dark:text-indigo-400 font-bold underline">
            {LEGAL_CONFIG.CONTACT_EMAIL}
          </a>{' '}
          containing the following verified details:
        </p>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-2 text-xs">
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
            <li><strong>Identification of the Copyrighted Work:</strong> A description and proof of ownership of the copyrighted work claimed to have been infringed (e.g. book title, registration details, or original publication URL).</li>
            <li><strong>Specific Location on this Portal:</strong> The exact URL(s) and specific question number(s) or resource identifier(s) on our portal where the contested material appears.</li>
            <li><strong>Contact Information:</strong> Your full legal name, organization/publisher name, physical address, telephone number, and official email address.</li>
            <li><strong>Good Faith Statement:</strong> A statement that: <em>"I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."</em></li>
            <li><strong>Accuracy & Authority Statement:</strong> A statement that: <em>"The information in this notification is accurate, and under penalty of perjury, I am the copyright owner or authorized to act on behalf of the owner."</em></li>
            <li><strong>Physical or Electronic Signature:</strong> An electronic or physical signature of the authorized copyright holder.</li>
          </ol>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Upon receiving a valid notice, our team will immediately review the claim, temporarily restrict access, and permanently remove the contested material within {LEGAL_CONFIG.TAKEDOWN_TIMEFRAME}.
        </p>
      </section>

      <section id="counter-notice" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          5. Counter-Notification Procedure
        </h2>
        <p>
          If material was removed due to mistake or misidentification, the affected contributor may submit a written counter-notification providing appropriate evidence of fair dealing, public domain status, or authorization.
        </p>
      </section>

      <section id="infringer-policy" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          6. Policy on Repeat Infringers & Grievance Contact
        </h2>
        <p>
          We adhere to strict content integrity guidelines and will terminate platform access for any user found repeatedly submitting infringing materials.
        </p>
        <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
          Designated Copyright Agent: {LEGAL_CONFIG.OWNER_NAME} · Email:{' '}
          <a href={`mailto:${LEGAL_CONFIG.CONTACT_EMAIL}`} className="text-indigo-600 dark:text-indigo-400 underline">
            {LEGAL_CONFIG.CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </LegalPageLayout>
  );
};
