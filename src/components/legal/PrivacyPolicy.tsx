// ==============================================================================
// NelovMallickIITD CBT Platform - Privacy Policy (DPDP Act 2023 & DPDP Rules 2025)
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React from 'react';
import { LegalPageLayout, TocItem } from './LegalPageLayout';
import { LEGAL_CONFIG } from '../../config/legal';

const TOC: TocItem[] = [
  { id: 'dpdp-commitment', title: '1. DPDP Act 2023 Commitment' },
  { id: 'non-monetization', title: '2. Strict Non-Monetization Pledge' },
  { id: 'data-collected', title: '3. Data Collected & Categories' },
  { id: 'purpose-use', title: '4. Lawful Purpose & Test Limits' },
  { id: 'third-party', title: '5. Third-Party Infrastructure' },
  { id: 'under-18', title: '6. Children & Under-18 Students' },
  { id: 'retention-erasure', title: '7. Data Retention & Erasure' },
  { id: 'student-rights', title: '8. Student Data Rights' },
  { id: 'cookies-storage', title: '9. Essential Cookies & Storage' },
  { id: 'grievance-contact', title: '10. Grievance Redressal Contact' }
];

export const PrivacyPolicy: React.FC = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Comprehensive data privacy disclosures aligned with India's Digital Personal Data Protection (DPDP) Act, 2023, DPDP Rules, 2025, and Google OAuth Verification Standards."
      badgeText="DPDP & Google OAuth Compliant"
      toc={TOC}
    >
      <section id="dpdp-commitment" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          1. DPDP Act 2023 Commitment
        </h2>
        <p>
          Welcome to the free educational portal operated by <strong>{LEGAL_CONFIG.OWNER_NAME}</strong> (IIT Delhi alumnus). We are committed to safeguarding the digital privacy of every student, aspirant, and parent using our platform.
        </p>
        <p>
          This Privacy Policy is drafted in strict adherence to India’s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, the <strong>DPDP Rules, 2025</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and <strong>Google API Services User Data Policy</strong> requirements.
        </p>
      </section>

      <section id="non-monetization" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          2. Strict Non-Monetization & Free Commitment
        </h2>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
          🛡️ <strong>Our Non-Monetization Promise:</strong> This portal is <strong>100% Free Forever</strong>. Student contact numbers, emails, test performance, and exam data are <strong>NEVER sold, rented, monetized, leased, or disclosed</strong> to any coaching institute, advertiser, telemarketer, or third-party behavioral profiling agency. Zero sponsored tracking pixels or ad networks are deployed on this website.
        </div>
      </section>

      <section id="data-collected" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          3. Data Collected & Categories
        </h2>
        <p>
          We practice data minimization under Section 6 of the DPDP Act, collecting only data strictly required to deliver authentic Computer-Based Test (CBT) mock exams, chapter-wise vault study materials, and personal progress analytics:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-zinc-300">
          <li>
            <strong>Identity & Credentials:</strong> Student Full Name, Gmail / Email Address, 10-Digit Mobile Number (when provided or required for non-Gmail registrations), Encrypted Password Hash, and Target Exam (JEE Mains, JEE Advanced, or Both).
          </li>
          <li>
            <strong>Test & CBT Performance Data:</strong> PTM and PTA test responses, option selections, numerical entries, question timestamps, question review flags, test scores, subject-wise percentiles, and mistake diagnosis tags.
          </li>
          <li>
            <strong>Study & Vault Progress:</strong> Revision Notebook bookmarks, personalized study notes, video lecture completion progress, and chapter exercise submissions.
          </li>
          <li>
            <strong>Feedback & Error Reports:</strong> Feedback text, error descriptions, and optional contact details submitted through the "Report Error" feature.
          </li>
          <li>
            <strong>Compliance Consent Records:</strong> Date and timestamp of Terms of Service acceptance, policy version agreed to ({LEGAL_CONFIG.POLICY_VERSION}), and parental/guardian consent verification flags.
          </li>
        </ul>
      </section>

      <section id="purpose-use" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          4. Lawful Purpose & Fair Use Test Limits
        </h2>
        <p>
          Your personal data is processed solely for the following specified, lawful educational purposes:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-slate-700 dark:text-zinc-300">
          <li><strong>Authentication & Profile Management:</strong> To log you into your personalized student account across devices and protect your exam attempts.</li>
          <li><strong>Enforcement of 3-Attempt Mock Test Cap:</strong> To maintain test integrity and simulate realistic examination conditions, each full-syllabus PTM and PTA test is capped at a strict maximum of <strong>{LEGAL_CONFIG.TEST_ATTEMPT_LIMIT} attempts</strong> per student account.</li>
          <li><strong>Academic Mistake Diagnosis & Progress Tracking:</strong> To calculate your accuracy rates, subject-wise marks distribution, and revision bookmarks.</li>
          <li><strong>Content Quality Control:</strong> To investigate and correct reported typos, formula discrepancies, or KaTeX rendering bugs flagged through error reports.</li>
        </ol>
      </section>

      <section id="third-party" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          5. Third-Party Infrastructure Disclosures
        </h2>
        <p>
          To maintain high availability and security, we rely on established, enterprise-grade cloud service providers operating under strict confidentiality and security terms:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">Supabase Inc.</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Provides encrypted PostgreSQL database hosting, Row-Level Security (RLS), and authentication token management.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">Vercel Inc.</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Provides global edge web application hosting, SSL/TLS certificate termination, and DDoS protection.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">Google LLC (Google Sign-In)</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Optional OAuth 2.0 authentication service allowing one-click sign-in without sharing your Google account password with our portal.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">YouTube LLC (Google)</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Embeds free educational video lectures through YouTube’s privacy-enhanced mode (<code>youtube-nocookie.com</code>).
            </p>
          </div>
        </div>
      </section>

      <section id="under-18" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          6. Children & Under-18 Students (DPDP Compliance)
        </h2>
        <p>
          Under the DPDP Act, 2023, individuals under 18 years of age are recognized as children. In accordance with Section 9 of the Act:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li>Students under the age of 18 must register and utilize this platform with the <strong>knowledge and consent of their parent or lawful guardian</strong>.</li>
          <li>We <strong>do not engage in targeted advertising, behavioral profiling, or tracking</strong> of children.</li>
          <li>We do not deploy any dark patterns or gaming elements designed to cause detrimental effects on a child’s well-being.</li>
        </ul>
      </section>

      <section id="retention-erasure" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          7. Data Retention & Permanent Self-Service Erasure
        </h2>
        <p>
          We retain your student records only for as long as your account remains active. We respect the Right to Erasure under Section 12 of the DPDP Act:
        </p>
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs leading-relaxed space-y-2">
          <p>
            <strong>Self-Service Account Deletion:</strong> Any student may permanently delete their account at any time by navigating to <strong>Navbar › Profile Dropdown › Account & Privacy › Delete My Account</strong>.
          </p>
          <p>
            Upon typing <code>DELETE</code> and confirming, our secure backend function (<code>delete_my_account</code>) immediately deletes your authentication record, cascading a permanent wipe of your profile, contact number, test attempts, Revision Notebook bookmarks, and video progress, while scrubbing personal identifiers from past error reports.
          </p>
        </div>
      </section>

      <section id="student-rights" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          8. Student Data Rights (DPDP Chapter III)
        </h2>
        <p>Every student user has the following rights under Indian law:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li><strong>Right to Access & Summary:</strong> View your active profile and complete attempt breakdown on your dashboard.</li>
          <li><strong>Right to Data Portability / Export:</strong> Download a full machine-readable copy of your personal data as a <code>.json</code> file at any time from your <strong>Account & Privacy</strong> page.</li>
          <li><strong>Right to Correction & Rectification:</strong> Update your full name or target exam preference directly in your profile settings.</li>
          <li><strong>Right to Grievance Redressal:</strong> Address unresolved data concerns directly to our Grievance Officer.</li>
        </ul>
      </section>

      <section id="cookies-storage" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          9. Essential Cookies & Local Storage Notice
        </h2>
        <p>
          This portal uses <strong>only essential session cookies and HTML5 browser local storage</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
          <li><strong>Auth Tokens:</strong> Securely preserves your login session across tab switches.</li>
          <li><strong>Live Exam Timers & Palette Responses:</strong> Saves your active question responses during a live CBT test to prevent data loss in case of intermittent network disconnects.</li>
          <li><strong>Theme & Storage Notice Dismissal:</strong> Remembers your light/dark mode preference and cookie notice dismissal.</li>
        </ul>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          We do not deploy third-party advertising cookies, cross-site trackers, or marketing beacons.
        </p>
      </section>

      <section id="grievance-contact" className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
          10. Grievance Redressal & Contact Officer
        </h2>
        <p>
          For any questions regarding this Privacy Policy, your rights under the DPDP Act 2023, or to request manual account assistance, please contact:
        </p>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-xs space-y-1 font-medium">
          <p className="font-bold text-slate-900 dark:text-zinc-100">{LEGAL_CONFIG.GRIEVANCE_OFFICER}</p>
          <p className="text-slate-500 dark:text-zinc-400">Academic Director & Founder (IIT Delhi Alumnus)</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold">
            Email: <a href={`mailto:${LEGAL_CONFIG.GRIEVANCE_EMAIL}`} className="underline">{LEGAL_CONFIG.GRIEVANCE_EMAIL}</a>
          </p>
          <p className="text-slate-500 dark:text-zinc-400">Jurisdiction: {LEGAL_CONFIG.JURISDICTION}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
};
