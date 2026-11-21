// ==============================================================================
// Script: patch-legal-into-index.mjs
// Purpose: Seamlessly integrate Legal & Compliance layer into index.html
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

console.log('Original index.html length (LF):', html.length);

// ------------------------------------------------------------------------------
// 1. COMPONENTS TO INJECT BEFORE `function NelovMallickApp()`
// ------------------------------------------------------------------------------
const legalComponentsCode = `
    // ==============================================================================
    // LEGAL & COMPLIANCE COMPONENTS (TestonGo-Inspired Free Portal Edition)
    // Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
    // ==============================================================================

    function PlatformFooter({ onOpenAuth }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick",
        OWNER_TITLE: "Academic Director & Founder (IIT Delhi Alumnus)",
        CONTACT_EMAIL: "YOUR_CONTACT_EMAIL@gmail.com",
        POLICY_VERSION: "2026-11",
        LAST_UPDATED: "November 2026",
        PORTAL_NAME: "Nelov Mallick Free JEE Mains & Advanced Test Portal",
        PORTAL_URL: "https://nelovmallickiitd-web.vercel.app",
        YOUTUBE_URL: "https://www.youtube.com/channel/UCVyHQJik6Gz4QZJBvviY7Hg",
        YOUTUBE_LABEL: "2K+ Subscribers · YouTube Channel",
        INSTAGRAM_URL: "https://www.instagram.com/mallicknelov?avpt=dXMzNWZjMHpya3Rm",
        INSTAGRAM_LABEL: "2K+ Aspirants · Instagram Community",
        COPYRIGHT_NOTICE: "© 2026 Nelov Mallick. All rights reserved."
      };

      return (
        <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0c] text-slate-600 dark:text-zinc-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            
            {/* Main 5-Column Grid (TestonGo Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
              
              {/* Col 1 & 2: Brand, Mentor & Support */}
              <div className="space-y-4 lg:col-span-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    NM
                  </div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-zinc-50">
                    NelovMallick<span className="text-indigo-600 dark:text-indigo-400">IITD</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                  Official Computer-Based Test (CBT) portal for JEE Mains & JEE Advanced. Practice real examination interfaces, diagnostic analytics, KaTeX solutions, and chapter-wise study vaults. 100% free forever.
                </p>

                <div className="pt-1 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 block">
                    Mentored by:
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    {config.OWNER_NAME} ({config.OWNER_TITLE})
                  </p>
                  <a
                    href={"mailto:" + config.CONTACT_EMAIL}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-block pt-0.5"
                  >
                    {config.CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              {/* Col 3: Platform Tests */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
                  Mock Tests
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <a
                      href="#/tests/jee-advanced"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      JEE Advanced (PTA 01–10)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/tests/jee-mains"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      JEE Mains (PTM 01–10)
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenAuth && onOpenAuth('Live Test Series')}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      3-Attempt Mock Engine
                    </button>
                  </li>
                  <li>
                    <a
                      href="#/progress"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Rank Predictor & Scores
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 4: Vault & Lectures */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
                  Study Vaults
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <a
                      href="#/resources/physics"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Physics Vault (28 Chapters)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/resources/chemistry"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Chemistry Vault (29 Chapters)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/resources/mathematics"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Mathematics Vault (26 Chapters)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/lectures"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      YouTube Video Lectures
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/notebook"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Revision Notebook
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 5: Legal & Compliance Column (TestonGo Style) */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider text-xs">
                  Legal & Policies
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <a
                      href="#/privacy-policy"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>🔒</span> Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/terms"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>📜</span> Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/disclaimer"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>⚠️</span> Official Disclaimer
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/copyright"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>⚖️</span> Copyright & Takedown
                    </a>
                  </li>
                  <li>
                    <a
                      href="#/account"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-semibold text-slate-800 dark:text-zinc-300 pt-1"
                    >
                      <span>👤</span> Account & Privacy
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Subtle Divider (TestonGo Style) */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Copyright Bar */}
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 text-center sm:text-left space-y-0.5">
                <p className="font-semibold">
                  {config.COPYRIGHT_NOTICE} · Free Open Educational Platform
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  Curated by <strong>{config.OWNER_NAME} (IIT Delhi)</strong> · Zero Third-Party Advertising · 100% Free Forever
                </p>
              </div>

              {/* Social / Community Links */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={config.YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-bold text-xs hover:bg-red-100 dark:hover:bg-red-900/60 transition-all shadow-sm"
                  title="Subscribe on YouTube"
                >
                  <span>▶</span> {config.YOUTUBE_LABEL}
                </a>
                <a
                  href={config.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900/60 font-bold text-xs hover:bg-pink-100 dark:hover:bg-pink-900/60 transition-all shadow-sm"
                  title="Follow on Instagram"
                >
                  <span>📸</span> {config.INSTAGRAM_LABEL}
                </a>
              </div>

            </div>

          </div>
        </footer>
      );
    }

    function LegalPageLayout({ title, subtitle, badgeText = 'Official Policy', toc = [], children }) {
      const config = window.LEGAL_CONFIG || {
        POLICY_VERSION: "2026-11",
        LAST_UPDATED: "November 2026"
      };
      const [activeSection, setActiveSection] = useState(toc[0] ? toc[0].id : '');

      useEffect(() => {
        const handleScroll = () => {
          const scrollY = window.scrollY;
          for (let i = toc.length - 1; i >= 0; i--) {
            const item = toc[i];
            const el = document.getElementById(item.id);
            if (el && el.offsetTop - 140 <= scrollY) {
              setActiveSection(item.id);
              break;
            }
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
      }, [toc]);

      const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 100;
          window.scrollTo({ top, behavior: 'smooth' });
          setActiveSection(id);
        }
      };

      const handlePrint = () => {
        window.print();
      };

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-800 dark:text-zinc-200 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Navigation Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <nav className="flex items-center gap-2">
                <a href="#/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </a>
                <span>›</span>
                <span className="text-slate-800 dark:text-zinc-200">Legal & Compliance</span>
                <span>›</span>
                <span className="text-indigo-600 dark:text-indigo-400">{title}</span>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
                  title="Print or Save as PDF"
                >
                  <span>🖨️</span> Print / Save PDF
                </button>
                <a
                  href="#/"
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Back to Home
                </a>
              </div>
            </div>

            {/* Hero Header */}
            <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {badgeText}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                      Version {config.POLICY_VERSION}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ● Last Updated: {config.LAST_UPDATED}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                    {title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                <div className="shrink-0 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Sole Platform Mentor
                  </div>
                  <div className="font-bold text-slate-900 dark:text-zinc-100">
                    Nelov Mallick
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                    IIT Delhi Alumnus
                  </div>
                  <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span>✓</span> 100% Free Forever
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Column Grid: Sticky Table of Contents + Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sticky TOC Sidebar (TestonGo Inspired) */}
              <aside className="lg:col-span-4 sticky top-24 space-y-4">
                <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>📑</span> Contents
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {toc.length} Sections
                    </span>
                  </div>

                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                    {toc.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={"w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between " + (
                            isActive
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                          )}
                        >
                          <span className="truncate pr-2">{item.title}</span>
                          {isActive && <span className="text-[10px]">●</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Cross-Links */}
                <div className="bg-slate-100/80 dark:bg-zinc-900/40 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 text-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Related Legal Policies:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <a href="#/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 underline">Privacy Policy</a>
                    <a href="#/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 underline">Terms of Service</a>
                    <a href="#/disclaimer" className="hover:text-indigo-600 dark:hover:text-indigo-400 underline">Disclaimer</a>
                    <a href="#/copyright" className="hover:text-indigo-600 dark:hover:text-indigo-400 underline">Copyright</a>
                  </div>
                </div>
              </aside>

              {/* Main Content Body */}
              <div className="lg:col-span-8 bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-10 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
                {children}
              </div>

            </div>

          </div>
        </div>
      );
    }

    function PrivacyPolicyView({ setView }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick",
        GRIEVANCE_OFFICER: "Nelov Mallick",
        GRIEVANCE_EMAIL: "YOUR_CONTACT_EMAIL@gmail.com",
        JURISDICTION: "Kolkata, West Bengal, India"
      };

      const TOC = [
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
              Welcome to the free educational portal operated by <strong>{config.OWNER_NAME}</strong> (IIT Delhi alumnus). We are committed to safeguarding the digital privacy of every student, aspirant, and parent using our platform.
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
                <strong>Feedback & Error Reports:</strong> Feedback text, error descriptions, and reporter names submitted voluntarily through our question error reporting dialog.
              </li>
            </ul>
          </section>

          <section id="purpose-use" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              4. Lawful Purpose & Test Attempt Limits
            </h2>
            <p>We process personal data solely for specified, lawful educational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
              <li>Authenticating student identity and preventing duplicate test submissions.</li>
              <li>Enforcing our <strong>3-Attempt Fair-Use Cap</strong> per mock test paper (PTA 01–10 and PTM 01–10) so every student practices with real exam discipline.</li>
              <li>Calculating individual performance diagnostics, speed-versus-accuracy metrics, and historical JEE rank predictions.</li>
              <li>Sending important platform announcements or password recovery links.</li>
            </ul>
          </section>

          <section id="third-party" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              5. Third-Party Infrastructure & Google OAuth
            </h2>
            <p>To ensure high uptime, enterprise-grade encryption, and zero server crashes, we utilize reputable cloud infrastructure:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-zinc-300">
              <li>
                <strong>Supabase (PostgreSQL & Auth):</strong> Cloud database hosting encrypted student credentials and test logs with Row-Level Security (RLS) policies.
              </li>
              <li>
                <strong>Google Identity Services (OAuth 2.0):</strong> Optional 1-click Google Sign-In. We only access basic profile information (Full Name, verified Email Address, and Avatar URL). We never request or access Google Drive, Gmail messages, or contacts.
              </li>
              <li>
                <strong>Vercel:</strong> Global content delivery network (CDN) and web hosting.
              </li>
              <li>
                <strong>YouTube Player API:</strong> Embedded player for viewing free video masterclasses. YouTube may process view tokens in accordance with Google's Privacy Policy.
              </li>
            </ul>
          </section>

          <section id="under-18" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              6. Protection of Children & Under-18 Students
            </h2>
            <p>
              Given that many JEE aspirants are 15 to 18 years old, we uphold special safeguards under Section 9 of the DPDP Act, 2023:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-zinc-300">
              <li>Registration requires explicit confirmation that an under-18 student has obtained the permission of a parent or lawful guardian.</li>
              <li>We engage in <strong>zero behavioral monitoring, targeted advertising, profiling, or tracking</strong> of children.</li>
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
              <p className="font-bold text-slate-900 dark:text-zinc-100">{config.GRIEVANCE_OFFICER}</p>
              <p className="text-slate-500 dark:text-zinc-400">Academic Director & Founder (IIT Delhi Alumnus)</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold">
                Email: <a href={"mailto:" + config.GRIEVANCE_EMAIL} className="underline">{config.GRIEVANCE_EMAIL}</a>
              </p>
              <p className="text-slate-500 dark:text-zinc-400">Jurisdiction: {config.JURISDICTION}</p>
            </div>
          </section>
        </LegalPageLayout>
      );
    }

    function TermsOfServiceView({ setView }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick",
        JURISDICTION: "Kolkata, West Bengal, India",
        GOVERNING_LAW: "Republic of India",
        TEST_ATTEMPT_LIMIT: 3
      };

      const TOC = [
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
                <strong>100% Free Forever:</strong> This portal is an independent philanthropic open educational initiative founded and mentored by <strong>{config.OWNER_NAME}</strong> (IIT Delhi alumnus).
              </p>
              <p>
                There are <strong>no registration fees, no monthly subscriptions, no paywalls, and no paid premium tiers</strong>. All JEE Advanced mock papers (PTA 01–10), JEE Mains mock papers (PTM 01–10), chapter-wise vault notes, KaTeX step-by-step solutions, and video lectures are provided free of cost.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Because this platform is 100% free with zero financial transactions, no pricing schedules, payment processors, or refund policies exist or apply.
              </p>
            </div>
          </section>

          <section id="as-is-basis" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              3. Educational "As-Is" Basis
            </h2>
            <p>
              The Platform and all its contents—including CBT mock exams, answer keys, mathematical derivations, projected percentiles, and formula vaults—are provided strictly on an <strong>"as-is" and "as-available" basis</strong> for voluntary self-study and mock practice. We do not guarantee admission into any IIT, NIT, or engineering university.
            </p>
          </section>

          <section id="eligibility" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              4. Student Eligibility & Minor Consent
            </h2>
            <p>
              This Platform is designed for students preparing for engineering entrance examinations. If you are under 18 years of age, you represent that you have obtained the affirmative permission of your parent or lawful guardian to access this Platform, in compliance with Section 9 of the DPDP Act, 2023.
            </p>
          </section>

          <section id="attempt-cap" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              5. Strict 3-Attempt Mock Test Cap (Fair-Use Policy)
            </h2>
            <p>
              To maintain the academic rigor of full-syllabus JEE simulation, each student account is allocated a maximum of <strong>{config.TEST_ATTEMPT_LIMIT} attempts per paper</strong> (PTA 01–10 and PTM 01–10):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
              <li><strong>Attempt 1 (Diagnostic):</strong> Simulates actual exam pressure with strict countdown timers and full marking schemes (+4 / -1 / partial).</li>
              <li><strong>Attempt 2 (Improvement):</strong> Taken after reviewing mistake diagnosis tags and KaTeX solutions.</li>
              <li><strong>Attempt 3 (Mastery):</strong> Final benchmark before exam day.</li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Circumventing attempt limits by creating multiple automated or disposable accounts constitutes a violation of these Terms.
            </p>
          </section>

          <section id="prohibited-conduct" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              6. Prohibited Misuse & Scraping
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-zinc-300">
              <li>Scrape, crawl, harvest, or extract question banks, KaTeX solutions, or student directory records using automated bots or headless scripts.</li>
              <li>Attempt to reverse-engineer, decompile, or tamper with the CBT examination timer, score calculation engine, or Supabase backend RPCs.</li>
              <li>Resell, redistribute, or package free materials from this website for commercial coaching batches.</li>
              <li>Impersonate platform mentors or administrators.</li>
            </ul>
          </section>

          <section id="intellectual-property" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              7. Intellectual Property Rights
            </h2>
            <p>
              All original pedagogical explanations, video lectures, test interface code, and brand marks remain the exclusive intellectual property of <strong>{config.OWNER_NAME}</strong>. Public past-year examination problems are reproduced under lawful non-commercial fair dealing provisions.
            </p>
          </section>

          <section id="suspension-moderation" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              8. Suspension & Account Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that engage in platform abuse, denial-of-service attempts, or automated scraping. Students may terminate their account at any time via self-service deletion in their <strong>Account & Privacy</strong> settings.
            </p>
          </section>

          <section id="liability-limitation" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              9. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, <strong>{config.OWNER_NAME}</strong> and associated contributors shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the Platform, temporary server downtime, or third-party network interruptions.
            </p>
          </section>

          <section id="governing-law" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              10. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the <strong>{config.GOVERNING_LAW}</strong>. Any legal dispute arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>{config.JURISDICTION}</strong>.
            </p>
          </section>
        </LegalPageLayout>
      );
    }

    function DisclaimerView({ setView }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick"
      };

      const TOC = [
        { id: 'non-affiliation', title: '1. No Official Government or NTA Affiliation' },
        { id: 'rank-predictor', title: '2. Approximate Rank Predictor Notice' },
        { id: 'academic-accuracy', title: '3. Academic Content & KaTeX Corrections' },
        { id: 'error-reporting', title: '4. Error Reporting & Feedback Mechanism' },
        { id: 'third-party-media', title: '5. Embedded YouTube Video Content' },
        { id: 'student-discretion', title: '6. Student Discretion & Self-Study' }
      ];

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
                This portal is an independent educational initiative curated and mentored by <strong>{config.OWNER_NAME}</strong> (IIT Delhi alumnus).
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
              2. Approximate Rank Predictor Notice
            </h2>
            <p>
              All projected All India Ranks (AIR) and estimated percentiles shown in your scorecards are <strong>statistical approximations</strong> derived from historical piecewise normalization models and calibrated past-year JEE trends.
            </p>
            <p>
              They serve solely as a motivational study indicator and <strong>do not guarantee or predict actual ranks</strong> awarded in the official JEE examination, which depend on nationwide shift normalization and student cohort performance.
            </p>
          </section>

          <section id="academic-accuracy" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              3. Academic Content & KaTeX Corrections
            </h2>
            <p>
              Every problem, answer key, and mathematical derivation is thoroughly proofread and calibrated using KaTeX LaTeX typesetting. However, given the vast breadth of JEE Physics, Chemistry, and Mathematics questions, inadvertent typographical errors or ambiguous question interpretations may occasionally occur.
            </p>
          </section>

          <section id="error-reporting" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              4. Error Reporting & Feedback Mechanism
            </h2>
            <p>
              We encourage students to actively report discrepancies! Each question in our CBT exam review and Revision Notebook includes a <strong>"Report Error"</strong> button. Discrepancies are reviewed directly by Nelov Mallick and corrected within 24 to 48 hours for all platform users.
            </p>
          </section>

          <section id="third-party-media" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              5. Embedded YouTube Video Content
            </h2>
            <p>
              Video lectures are embedded through the standard YouTube Player API from the official educational channel. Video playback and recommendations are governed by YouTube's terms and community guidelines.
            </p>
          </section>

          <section id="student-discretion" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              6. Student Discretion & Self-Study
            </h2>
            <p>
              Students and parents are advised to use this platform as a supplementary mock test practice environment alongside NCERT textbooks and teacher classroom guidance.
            </p>
          </section>
        </LegalPageLayout>
      );
    }

    function CopyrightPolicyView({ setView }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick",
        CONTACT_EMAIL: "YOUR_CONTACT_EMAIL@gmail.com",
        TAKEDOWN_TIMEFRAME: "48–72 Hours"
      };

      const TOC = [
        { id: 'fair-dealing', title: '1. Fair Dealing & Educational Purpose' },
        { id: 'original-ip', title: '2. Original Content & Proprietary Rights' },
        { id: 'safe-harbor', title: '3. Safe Harbor & Copyright Compliance' },
        { id: 'takedown-notice', title: '4. Notice & Takedown Procedure (48–72h)' },
        { id: 'counter-notice', title: '5. Counter-Notification Procedure' },
        { id: 'infringer-policy', title: '6. Policy on Repeat Infringers' }
      ];

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
              The original step-by-step worked solutions, mathematical formatting, customized KaTeX proofs, video lecture explanations, examination CBT software architecture, and user interface designs are the intellectual property of <strong>{config.OWNER_NAME}</strong> (IIT Delhi alumnus).
            </p>
            <p>
              Unauthorized commercial reproduction, bulk harvesting, or bundling into paid courses without explicit written permission is strictly prohibited.
            </p>
          </section>

          <section id="safe-harbor" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              3. Safe Harbor & Copyright Compliance
            </h2>
            <p>
              We respect the intellectual property rights of all copyright holders. If you believe that any material appearing on this platform infringes upon your copyright, we provide a prompt and transparent takedown mechanism under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DMCA safe harbor principles.
            </p>
          </section>

          <section id="takedown-notice" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              4. Notice & Takedown Procedure ({config.TAKEDOWN_TIMEFRAME})
            </h2>
            <p>
              To file a formal infringement notification, please email our designated Grievance Officer with the following information:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs space-y-2">
              <p><strong>Required Information in Infringement Notice:</strong></p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-zinc-400">
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>The exact URL, test paper code (e.g. PTA 04), question ID, or lecture title on our portal.</li>
                <li>Your name, address, telephone number, and email address.</li>
                <li>A statement that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement made under penalty of perjury that the information in your notice is accurate and that you are authorized to act on behalf of the copyright owner.</li>
              </ol>
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 font-bold text-indigo-600 dark:text-indigo-400">
                Send Takedown Notices to: <a href={"mailto:" + config.CONTACT_EMAIL} className="underline">{config.CONTACT_EMAIL}</a>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Upon receipt of a valid notice, we will review and disable or remove access to the disputed material within <strong>48 to 72 hours</strong>.
            </p>
          </section>

          <section id="counter-notice" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              5. Counter-Notification Procedure
            </h2>
            <p>
              If a content contributor believes that removed material was misidentified or lawful fair dealing, they may submit a counter-notice explaining the factual and legal basis.
            </p>
          </section>

          <section id="infringer-policy" className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-2">
              6. Policy on Repeat Infringers
            </h2>
            <p>
              In accordance with international standards, we reserve the right to terminate access for users who repeatedly post unauthorized content.
            </p>
          </section>
        </LegalPageLayout>
      );
    }

    function AccountPrivacyView({ currentUser, setView, openAuth, onLogOut }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick",
        PORTAL_NAME: "Nelov Mallick Free JEE Mains & Advanced Test Portal",
        POLICY_VERSION: "2026-11"
      };

      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [confirmText, setConfirmText] = useState('');
      const [deleting, setDeleting] = useState(false);
      const [deleteError, setDeleteError] = useState('');
      const [exporting, setExporting] = useState(false);
      const [toastMessage, setToastMessage] = useState('');

      if (!currentUser) {
        return (
          <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-sm">
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                Please log in to manage your Account & Privacy settings.
              </p>
              <button
                type="button"
                onClick={() => openAuth && openAuth('login', '#/account', 'Sign in to manage your account and privacy.')}
                className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Log In Free
              </button>
            </div>
          </div>
        );
      }

      // Sanitize email: never expose synthetic internal phone emails
      const isSyntheticEmail = currentUser.email && (currentUser.email.endsWith('@phone.nelovportal.local') || currentUser.email.includes('.local') || currentUser.email.includes('.internal'));
      const cleanDisplayEmail = isSyntheticEmail ? null : currentUser.email;

      const handleDownloadMyData = async () => {
        setExporting(true);
        try {
          const uId = currentUser.id;
          let attempts = [];
          let bookmarks = [];
          let lectures = {};

          try {
            const attemptsRaw = localStorage.getItem("nelov_" + uId + "_attempts") || localStorage.getItem('nelov_test_attempts');
            if (attemptsRaw) attempts = JSON.parse(attemptsRaw);
          } catch (e) {}

          try {
            const bmRaw = localStorage.getItem("nelov_" + uId + "_bookmarks") || localStorage.getItem('nelov_bookmarks');
            if (bmRaw) bookmarks = JSON.parse(bmRaw);
          } catch (e) {}

          try {
            const lecRaw = localStorage.getItem("nelov_" + uId + "_lecture_progress");
            if (lecRaw) lectures = JSON.parse(lecRaw);
          } catch (e) {}

          const exportPayload = {
            platform: config.PORTAL_NAME,
            mentor: config.OWNER_NAME + " (IIT Delhi)",
            exportTimestamp: new Date().toISOString(),
            userProfile: {
              id: currentUser.id,
              fullName: currentUser.name,
              email: cleanDisplayEmail,
              contactNumber: currentUser.contactNumber || null,
              loginMethod: currentUser.authMethod || (cleanDisplayEmail ? 'email' : 'phone'),
              targetExam: currentUser.targetExam,
              role: currentUser.role,
              accountCreated: currentUser.createdAt,
              acceptedTermsAt: currentUser.acceptedTermsAt || 'Not Recorded',
              acceptedTermsVersion: currentUser.acceptedTermsVersion || config.POLICY_VERSION,
              parentalConsentConfirmed: Boolean(currentUser.parentalConsentConfirmed)
            },
            attemptHistory: attempts,
            revisionBookmarks: bookmarks,
            lectureProgress: lectures
          };

          const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
          const downloadAnchor = document.createElement('a');
          downloadAnchor.setAttribute('href', dataStr);
          downloadAnchor.setAttribute('download', "nelov_mallick_jee_student_data_" + (currentUser.name || 'student').toLowerCase().replace(/\\s+/g, '_') + "_" + Date.now() + ".json");
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();

          setToastMessage('Personal data exported successfully!');
          setTimeout(() => setToastMessage(''), 4000);
        } catch (err) {
          alert('Failed to export data: ' + (err?.message || 'Unknown error'));
        } finally {
          setExporting(false);
        }
      };

      const handleConfirmDelete = async () => {
        if (confirmText.trim() !== 'DELETE') {
          setDeleteError('Please type DELETE in capital letters to confirm.');
          return;
        }

        if (currentUser.role === 'admin') {
          setDeleteError('Admin accounts cannot be self-deleted.');
          return;
        }

        setDeleting(true);
        setDeleteError('');
        try {
          if (window.authService && window.authService.deleteMyAccount) {
            await window.authService.deleteMyAccount();
          } else {
            // Local fallback
            localStorage.clear();
            sessionStorage.clear();
          }
          alert('Your account and all associated test records, bookmarks, and personal data have been permanently erased.');
          window.location.hash = '#/';
          window.location.reload();
        } catch (err) {
          setDeleteError(err?.message || 'Failed to delete account. Please try again.');
          setDeleting(false);
        }
      };

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-800 dark:text-zinc-200 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            
            {/* Header Breadcrumb */}
            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <nav className="flex items-center gap-2">
                <a href="#/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </a>
                <span>›</span>
                <span className="text-slate-800 dark:text-zinc-200">Account & Privacy</span>
              </nav>

              <button
                onClick={() => { setView('home'); window.location.hash = '#/'; }}
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                ← Back to Portal
              </button>
            </div>

            {/* Hero Card */}
            <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                    {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'NM'}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50">
                      {currentUser.name}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Student Aspirant Account · Mentored by <strong>{config.OWNER_NAME} (IIT Delhi)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    100% Free Forever
                  </span>
                </div>
              </div>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-in fade-in">
                ✓ {toastMessage}
              </div>
            )}

            {/* Profile Overview & Consent Status */}
            <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                  <span>👤</span> Student Profile & Credentials
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Your registered details on the NelovMallickIITD CBT platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Registered Name</span>
                  <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{currentUser.name}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Email Address</span>
                  <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                    {cleanDisplayEmail || <span className="text-slate-400 italic">None (Phone Login Only)</span>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Contact Number</span>
                  <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                    {currentUser.contactNumber ? ("🇮🇳 +91 " + currentUser.contactNumber) : <span className="text-slate-400 italic">Not Provided</span>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Target Examination</span>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{currentUser.targetExam || 'JEE Advanced'}</p>
                </div>
              </div>

              {/* Consent Audit Card */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>📜</span> DPDP Act 2023 Consent Audit Trail
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Consent Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-zinc-400 block">Accepted Policy:</span>
                    <strong className="text-slate-800 dark:text-zinc-200">Version {currentUser.acceptedTermsVersion || config.POLICY_VERSION}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-zinc-400 block">Recorded At:</span>
                    <strong className="text-slate-800 dark:text-zinc-200">
                      {currentUser.acceptedTermsAt ? new Date(currentUser.acceptedTermsAt).toLocaleDateString() : 'Active Session'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-zinc-400 block">Parental Approval:</span>
                    <strong className="text-slate-800 dark:text-zinc-200">
                      {currentUser.parentalConsentConfirmed ? '✓ Confirmed (Under-18)' : 'Adult Aspirant (18+)'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Portability / Export */}
            <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                  <span>📥</span> Data Portability (Download My Data)
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Export a complete machine-readable JSON archive of your mock scores, mistakes, and bookmarks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Full Student Data Package (.json)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Includes test attempts (PTA/PTM), KaTeX response comparisons, Revision Notebook items, and video watch status.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadMyData}
                  disabled={exporting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{exporting ? 'Generating...' : '📥'}</span>
                  <span>{exporting ? 'Preparing Archive...' : 'Download My Data'}</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Permanent Account Deletion */}
            <div className="bg-white dark:bg-[#121318] rounded-3xl border border-rose-200 dark:border-rose-950 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-rose-100 dark:border-rose-950/60 pb-3">
                <h2 className="text-base font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <span>⚠️</span> Danger Zone · Self-Service Account Erasure
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Under Section 12 of the DPDP Act 2023, you have the right to permanently erase your account and all associated test data.
                </p>
              </div>

              {currentUser.role === 'admin' ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
                  🛡️ <strong>Admin Account Protected:</strong> Platform administrators cannot be self-deleted. Contact database root administrator for role transfers.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Deleting your account is <strong>permanent and irreversible</strong>. All your test attempts, question timers, projected JEE percentiles, Revision Notebook items, and video lecture progress will be purged from our servers immediately.
                  </p>

                  {!showDeleteModal ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Permanently Delete My Account
                    </button>
                  ) : (
                    <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-4 animate-in fade-in">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                          Are you absolutely certain?
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                          Please type <strong className="font-mono text-rose-600">DELETE</strong> in all capitals below to confirm permanent deletion:
                        </p>
                      </div>

                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE here..."
                        className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-zinc-900 text-xs font-mono font-bold text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />

                      {deleteError && (
                        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                          {deleteError}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={handleConfirmDelete}
                          disabled={confirmText.trim() !== 'DELETE' || deleting}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
                        >
                          {deleting ? 'Erasing Everything...' : 'I Understand, Delete My Account Now'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowDeleteModal(false); setConfirmText(''); setDeleteError(''); }}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      );
    }

    function StorageNoticeBanner() {
      const STORAGE_KEY = 'nelov_storage_notice_dismissed';
      const [visible, setVisible] = useState(false);

      useEffect(() => {
        try {
          const dismissed = localStorage.getItem(STORAGE_KEY);
          if (!dismissed) {
            setVisible(true);
          }
        } catch (e) {
          setVisible(false);
        }
      }, []);

      const handleDismiss = () => {
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch (e) {}
        setVisible(false);
      };

      if (!visible) return null;

      return (
        <aside
          aria-label="Privacy and storage notification"
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-white/95 dark:bg-[#121318]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 shadow-xl text-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
                🍪
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 text-xs">
                  Essential Storage Notice
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  This free portal uses only essential login cookies and browser storage to save your active exam timer and study progress—never advertising trackers.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800/80">
              <a
                href="#/privacy-policy"
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Learn more in Privacy Policy →
              </a>
              <button
                onClick={handleDismiss}
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-all shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </aside>
      );
    }

    function TermsAcceptanceModalDialog({ isOpen, currentUser, onAccepted, onClose }) {
      const config = window.LEGAL_CONFIG || {
        OWNER_NAME: "Nelov Mallick",
        POLICY_VERSION: "2026-11"
      };

      const [agreed, setAgreed] = useState(false);
      const [parentalConfirmed, setParentalConfirmed] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      if (!isOpen || !currentUser) return null;

      const handleConfirm = async () => {
        if (!agreed) {
          setError('You must check the agreement box to proceed.');
          return;
        }
        setError('');
        setLoading(true);
        try {
          if (window.authService && window.authService.acceptTerms) {
            await window.authService.acceptTerms(config.POLICY_VERSION);
          }
          if (onAccepted) onAccepted();
        } catch (err) {
          setError(err?.message || 'Failed to record consent. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#121318] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl shadow-sm">
                📜
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                Terms & Privacy Consent Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Welcome, <strong>{currentUser.name || 'Student Aspirant'}</strong>! Under India's DPDP Act, 2023, please review and accept our platform policies to access free CBT mock exams and study vaults.
              </p>
            </div>

            {/* Highlights */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs space-y-2 text-slate-700 dark:text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>100% Free Access:</strong> Zero fees, zero subscriptions, zero paid tiers forever.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Strict Non-Monetization:</strong> Your contact number and email are never sold or rented.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>3-Attempt Fair Use Cap:</strong> Mock tests have a diagnostic 3-attempt limit per student.</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-1 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <a
                    href="#/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                  >
                    Privacy Policy
                  </a>
                  , and confirm I have parent/guardian consent if I am under 18. <span className="text-rose-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-slate-500 dark:text-zinc-400 text-[11px]">
                <input
                  type="checkbox"
                  checked={parentalConfirmed}
                  onChange={(e) => setParentalConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="leading-relaxed">
                  I am under 18 and registering with my parent or lawful guardian's permission.
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleConfirm}
              disabled={!agreed || loading}
              type="button"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Recording Consent...' : 'Accept & Enter Portal →'}
            </button>

            <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500">
              Mentored by {config.OWNER_NAME} (IIT Delhi) · Policy Version {config.POLICY_VERSION}
            </p>
          </div>
        </div>
      );
    }
`;

// Inject before `// MAIN APP COMPONENT\n    function NelovMallickApp()`
const appTarget = '    // MAIN APP COMPONENT\n    function NelovMallickApp()';
if (!html.includes(appTarget)) {
  console.error('Target NelovMallickApp not found!');
  process.exit(1);
}

html = html.replace(appTarget, legalComponentsCode + '\n' + appTarget);
console.log('Injected Legal Components successfully.');

// ------------------------------------------------------------------------------
// 2. UPDATE AuthModalDialog WITH CLICKWRAP CONSENT
// ------------------------------------------------------------------------------
// Add state
const authStateTarget = 'const [loading, setLoading] = useState(false);';
const authStateRepl = `const [loading, setLoading] = useState(false);
      const [acceptedTerms, setAcceptedTerms] = useState(false);
      const [parentalConsent, setParentalConsent] = useState(false);`;

if (html.includes(authStateTarget)) {
  html = html.replace(authStateTarget, authStateRepl);
}

// Add validation check in handleSignUpSubmit
const signUpValidateTarget = `      const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setError('');`;
const signUpValidateRepl = `      const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!acceptedTerms) {
          setError('You must read and accept the Terms of Service and Privacy Policy to create a free account.');
          return;
        }`;

if (html.includes(signUpValidateTarget)) {
  html = html.replace(signUpValidateTarget, signUpValidateRepl);
}

// Update Email signup payload
const emailSignUpPayloadTarget = `            user = await window.authService.signUp({
              name: name.trim(),
              email: email.trim(),
              contactNumber: contactNumber.trim() || undefined,
              password,
              targetExam
            });`;
const emailSignUpPayloadRepl = `            user = await window.authService.signUp({
              name: name.trim(),
              email: email.trim(),
              contactNumber: contactNumber.trim() || undefined,
              password,
              targetExam,
              acceptedTermsAt: new Date().toISOString(),
              acceptedTermsVersion: (window.LEGAL_CONFIG && window.LEGAL_CONFIG.POLICY_VERSION) || '2026-11',
              parentalConsentConfirmed: parentalConsent
            });`;

if (html.includes(emailSignUpPayloadTarget)) {
  html = html.replace(emailSignUpPayloadTarget, emailSignUpPayloadRepl);
}

// Update Phone signup payload
const phoneSignUpPayloadTarget = `            user = await window.authService.signUp({
              name: name.trim(),
              contactNumber: contactNumber.trim(),
              password,
              targetExam
            });`;
const phoneSignUpPayloadRepl = `            user = await window.authService.signUp({
              name: name.trim(),
              contactNumber: contactNumber.trim(),
              password,
              targetExam,
              acceptedTermsAt: new Date().toISOString(),
              acceptedTermsVersion: (window.LEGAL_CONFIG && window.LEGAL_CONFIG.POLICY_VERSION) || '2026-11',
              parentalConsentConfirmed: parentalConsent
            });`;

if (html.includes(phoneSignUpPayloadTarget)) {
  html = html.replace(phoneSignUpPayloadTarget, phoneSignUpPayloadRepl);
}

// Add clickwrap checkboxes before submit button in Email Signup and Phone Signup forms
const consentCheckboxes = `
                {/* DPDP Act 2023 Clickwrap Consent Checkboxes */}
                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] leading-relaxed">
                      I agree to the{' '}
                      <a
                        href="#/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="#/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        Privacy Policy
                      </a>
                      , and confirm fair use under the 3-attempt limit. <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-500 dark:text-zinc-400 text-[10px]">
                    <input
                      type="checkbox"
                      checked={parentalConsent}
                      onChange={(e) => setParentalConsent(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="leading-relaxed">
                      I confirm I am 18+ or registering with parental/guardian permission.
                    </span>
                  </label>
                </div>
`;

const submitBtnTarget = `<button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating Free Account...' : 'Complete Free Registration →'}
                </button>`;

if (html.includes(submitBtnTarget)) {
  // First occurrence (Email signup)
  html = html.replace(submitBtnTarget, consentCheckboxes + '\n                ' + submitBtnTarget);
  // Second occurrence (Phone signup)
  if (html.includes(submitBtnTarget)) {
    html = html.replace(submitBtnTarget, consentCheckboxes + '\n                ' + submitBtnTarget);
  }
}
console.log('Updated AuthModalDialog with DPDP clickwrap checkboxes.');

// ------------------------------------------------------------------------------
// 3. UPDATE MainNavbar (Account & Privacy link in dropdown and mobile drawer)
// ------------------------------------------------------------------------------
// User dropdown: before log out divider
const dropdownDividerTarget = '<div className="border-t border-slate-100 dark:border-zinc-800/80 pt-1">';
const dropdownLinkRepl = `<button
                        type="button"
                        onClick={() => { setUserDropdownOpen(false); setView('account'); window.location.hash = '#/account'; }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 font-semibold text-left transition-colors"
                      >
                        <span>👤</span> Account & Privacy
                      </button>

                      <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-1">`;

if (html.includes(dropdownDividerTarget)) {
  html = html.replace(dropdownDividerTarget, dropdownLinkRepl);
}

// Mobile drawer: after Revision Notebook button
const mobileNotebookTarget = `                  ⭐ Revision Notebook
                </button>`;
const mobileDrawerRepl = `                  ⭐ Revision Notebook
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!currentUser) openAuth('login', '#/account', 'Sign in to access your Account & Privacy settings.');
                    else { setView('account'); window.location.hash = '#/account'; }
                  }}
                  className="text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  👤 Account & Privacy
                </button>`;

if (html.includes(mobileNotebookTarget)) {
  html = html.replace(mobileNotebookTarget, mobileDrawerRepl);
}
console.log('Updated MainNavbar with Account & Privacy navigation links.');

// ------------------------------------------------------------------------------
// 4. UPDATE AdminDashboardView (Consent / Terms column and CSV export)
// ------------------------------------------------------------------------------
const csvHeadersTarget = `const headers = ['Full Name', 'Gmail / Email', 'Contact Number', 'Login Method', 'Target Exam', 'Role', 'Joined Date', 'Tests Attempted', 'Avg Score %', 'Lectures Completed', 'Bookmarks'];`;
const csvHeadersRepl = `const headers = ['Full Name', 'Gmail / Email', 'Contact Number', 'Login Method', 'Target Exam', 'Role', 'Joined Date', 'Terms Accepted At', 'Terms Version', 'Parental Consent', 'Tests Attempted', 'Avg Score %', 'Lectures Completed', 'Bookmarks'];`;

if (html.includes(csvHeadersTarget)) {
  html = html.replace(csvHeadersTarget, csvHeadersRepl);
}

const csvRowsTarget = `            \`"\${s.role || 'student'}"\`,
            \`"\${s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}"\`,
            studentAttempts.length,`;

const csvRowsRepl = `            \`"\${s.role || 'student'}"\`,
            \`"\${s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}"\`,
            \`"\${s.accepted_terms_at || s.acceptedTermsAt || 'Pending'}"\`,
            \`"\${s.accepted_terms_version || s.acceptedTermsVersion || '2026-11'}"\`,
            \`"\${s.parental_consent_confirmed || s.parentalConsentConfirmed ? 'Yes' : 'No'}"\`,
            studentAttempts.length,`;

if (html.includes(csvRowsTarget)) {
  html = html.replace(csvRowsTarget, csvRowsRepl);
}

// Add Consent / Terms column in table header
const tableHeaderTarget = `<th className="p-4">Target Exam</th>`;
const tableHeaderRepl = `<th className="p-4">Target Exam</th>
                          <th className="p-4 text-center">Consent / Terms</th>`;

if (html.includes(tableHeaderTarget)) {
  html = html.replace(tableHeaderTarget, tableHeaderRepl);
}

// Add Consent / Terms column in table row
const tableRowTarget = `<td className="p-4">
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    {s.target_exam || 'JEE Advanced'}
                                  </span>
                                </td>`;

const tableRowRepl = `<td className="p-4">
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    {s.target_exam || 'JEE Advanced'}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  {s.accepted_terms_at || s.acceptedTermsAt ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" title={"Accepted: " + new Date(s.accepted_terms_at || s.acceptedTermsAt).toLocaleString()}>
                                      ✓ {s.accepted_terms_version || s.acceptedTermsVersion || '2026-11'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      ⏳ Pending
                                    </span>
                                  )}
                                </td>`;

if (html.includes(tableRowTarget)) {
  html = html.replace(tableRowTarget, tableRowRepl);
}
console.log('Updated AdminDashboardView with Consent / Terms column and export.');

// ------------------------------------------------------------------------------
// 5. UPDATE NelovMallickApp ROUTING AND VIEWS
// ------------------------------------------------------------------------------
// Add routing in handleHashRoute
const routeTarget = `      // Handle Hash Routing with Protected Route Interception
      const handleHashRoute = () => {
        const hash = window.location.hash.toLowerCase();
        const activeUser = window.authService?.getCurrentUser() || null;`;

const routeRepl = `      // Handle Hash Routing with Protected Route Interception
      const handleHashRoute = () => {
        const hash = window.location.hash.toLowerCase();
        const path = window.location.pathname.toLowerCase();
        const activeUser = window.authService?.getCurrentUser() || null;

        // Public Legal Routes (100% Free Public Access, No Login Required)
        if (hash === '#/privacy-policy' || hash === '#privacy-policy' || path === '/privacy-policy') {
          setView('privacy-policy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (hash === '#/terms' || hash === '#terms' || path === '/terms') {
          setView('terms');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (hash === '#/disclaimer' || hash === '#disclaimer' || path === '/disclaimer') {
          setView('disclaimer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (hash === '#/copyright' || hash === '#copyright' || path === '/copyright') {
          setView('copyright');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (hash === '#/account' || hash === '#account' || path === '/account') {
          if (!activeUser) {
            openAuth('login', '#/account', 'Sign in to access your Account & Privacy settings.');
            setView('home');
            return;
          }
          setView('account');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }`;

if (html.includes(routeTarget)) {
  html = html.replace(routeTarget, routeRepl);
}

// Add view renderers for privacy-policy, terms, disclaimer, copyright, account
const legalViewRenderers = `
      // -------------------------------------------------------------
      // RENDER: LEGAL PAGES & ACCOUNT PRIVACY (Public & Protected)
      // -------------------------------------------------------------
      if (view === 'privacy-policy') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <PrivacyPolicyView setView={setView} />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }

      if (view === 'terms') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <TermsOfServiceView setView={setView} />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }

      if (view === 'disclaimer') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <DisclaimerView setView={setView} />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }

      if (view === 'copyright') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <CopyrightPolicyView setView={setView} />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }

      if (view === 'account') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <AccountPrivacyView
              currentUser={currentUser}
              setView={setView}
              openAuth={openAuth}
              onLogOut={handleLogOut}
            />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }
`;

// Insert legalViewRenderers right before `// -------------------------------------------------------------\n      // RENDER: HOMEPAGE (Default View)`
const homepageRenderMarker = '      // -------------------------------------------------------------\n      // RENDER: HOMEPAGE (Default View)';
if (html.includes(homepageRenderMarker)) {
  html = html.replace(homepageRenderMarker, legalViewRenderers + '\n' + homepageRenderMarker);
} else {
  console.error('Homepage render marker not found!');
  process.exit(1);
}

// ------------------------------------------------------------------------------
// 6. REPLACE HOMEPAGE FOOTER WITH PlatformFooter & ADD StorageNotice + TermsModal
// ------------------------------------------------------------------------------
const oldFooterTarget = `          {/* FOOTER */}
          <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#08080a] py-12 text-xs text-slate-500 dark:text-zinc-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  NM
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                  NelovMallick<span className="text-indigo-600 dark:text-indigo-400">IITD</span>
                </span>
                <span className="text-slate-400">· 100% Free JEE CBT Platform</span>
              </div>

              <p className="text-center sm:text-right">
                Curated by <span className="font-bold text-slate-800 dark:text-zinc-200">Nelov Mallick (IIT Delhi)</span> · All papers are 100% free open educational resources.
              </p>
            </div>
          </footer>`;

const newFooterRepl = `          {/* TESTONGO-INSPIRED 5-COLUMN FOOTER WITH LEGAL COLUMN */}
          <PlatformFooter onOpenAuth={openAuth} />

          {/* ESSENTIAL STORAGE / COOKIE NOTICE BANNER */}
          <StorageNoticeBanner />

          {/* FIRST-TIME DPDP TERMS CONSENT MODAL */}
          <TermsAcceptanceModalDialog
            isOpen={Boolean(currentUser && !currentUser.acceptedTermsAt)}
            currentUser={currentUser}
            onAccepted={() => {
              const updated = window.authService?.getCurrentUser() || null;
              setCurrentUser(updated);
            }}
          />`;

if (html.includes(oldFooterTarget)) {
  html = html.replace(oldFooterTarget, newFooterRepl);
  console.log('Replaced homepage footer with TestonGo-inspired PlatformFooter.');
} else {
  console.warn('Old footer target not matched exactly. Looking for substring...');
  const shortTarget = '<footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#08080a] py-12 text-xs text-slate-500 dark:text-zinc-400">';
  const endTarget = '</footer>';
  const startIdx = html.indexOf(shortTarget);
  if (startIdx !== -1) {
    const endIdx = html.indexOf(endTarget, startIdx);
    if (endIdx !== -1) {
      html = html.substring(0, startIdx) + newFooterRepl + html.substring(endIdx + endTarget.length);
      console.log('Replaced footer using substring bounds.');
    }
  }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote updated index.html! New length:', html.length);
