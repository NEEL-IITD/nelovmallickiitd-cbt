# NelovMallickIITD · Authentic JEE Advanced CBT Examination Platform

Official JEE Advanced test preparation platform curated by **Nelov Mallick (IIT Delhi)**. Provides an authentic Computer-Based Test (CBT) examination environment, high-yield full-syllabus mock papers (**PTA-04** and **PTA-05**), official partial marking simulation, KaTeX mathematical formula rendering, and instant diagnostic performance analytics.

**100% Free Open Educational Initiative · Zero Paywalls · Zero Registration Gate**

---

## 🚀 Key Features

- **Full-Length JEE Advanced Mock Papers**:
  - **PTA-04**: 57 Questions | 180 Marks | 180 Minutes (Mathematics, Physics, Chemistry)
    - *Section I*: Single Correct Option ($+3, -1$)
    - *Section II*: Paragraph / Numerical Comprehension ($+2, 0$)
    - *Section III*: Multiple Correct Choice ($+4, -2$ with partial marking)
    - *Section IV*: Non-Negative Integer ($+4, 0$)
  - **PTA-05 (Model-A)**: 54 Questions | 180 Marks | 180 Minutes (Mathematics, Physics, Chemistry)
    - *Section I*: Numerical Value ($+3, 0$)
    - *Section II*: Multiple Correct Choice ($+4, -2$ with partial marking)
    - *Section III*: Matching List Type ($+3, -1$) with side-by-side List-I and List-II
  - **PTA-06 (Comprehensive Model)**: 54 Questions | 180 Marks | 180 Minutes (Full Syllabus)
    - Real CBT timed exam with deep diagnostic scorecard and solutions
- **YouTube Video Lecture Hub**:
  - High-yield concept breakdowns & solution walkthroughs
  - In-player notepad, timestamps, and playback controls
- **Study Resources Hub**:
  - High-yield formula sheets, chapter revision notebooks, and problem sets
- **Authentication & Cloud Synchronization**:
  - Supabase Cloud PostgreSQL backend
  - Google OAuth 2.0 ("Continue with Google") One-Click Sign-In
  - Email/Password authentication
  - Dual-mode resilient offline fallback (Web Crypto SHA-256 + LocalStorage)
- **Admin Dashboard**:
  - Live student enrollments, exam attempt records, score distributions, and CSV data export
- **Official JEE Advanced CBT Interface**:
  - **3-Hour Live Countdown Timer**: Starts at `03:00:00` with visual color changes and automatic submission upon completion.
  - **Subject Navigation**: Seamless switching between Mathematics, Physics, and Chemistry tabs with real-time answered counters.
  - **5-State Question Palette**:
    - ⚪ *Not Visited*
    - 🔴 *Not Answered*
    - 🟢 *Answered*
    - 🟣 *Marked for Review*
    - 🟣🟢 *Answered & Marked for Review* (evaluated)
  - **Controls**: *Save & Next*, *Clear Response*, *Mark for Review & Next*, and *Submit Test*.
  - **Interactive On-Screen Virtual Numeric Keypad**: For integer and decimal questions with keyboard synchronization.
  - **Session Auto-Save (`localStorage`)**: Automatic persistence ensures refreshing or reconnecting resumes the exact test session.
- **Official Partial Marking Scoring Engine**:
  - $+4$ for all correct options selected without any incorrect option.
  - $+3, +2, +1$ for partial correct selections without any incorrect option.
  - $-2$ penalty if any incorrect option is selected.
  - $0$ for unattempted questions.
- **Instant Post-Test Diagnostic Scorecard**:
  - Total score (/180) and overall accuracy percentage.
  - Subject-wise scores (Mathematics, Physics, Chemistry).
  - Question-by-question review with filters (*All*, *Correct*, *Partial*, *Incorrect*, *Unattempted*).
  - Step-by-step solutions with mathematical derivations rendered with KaTeX.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, KaTeX (CDN math rendering), Lucide Icons
- **Backend / Static Server**: Node.js HTTP static server (`server.js`)
- **Data Models**: Structured TypeScript & JavaScript schemas for questions, options, diagrams, marking rules, and solutions.

---

## 🏁 Quick Start

### 1. Run with Node.js
```bash
# Start the local development server
node server.js
```
The application will be live at `http://localhost:3000`.

### 2. Run with Vite (Alternative)
```bash
npm install
npm run dev
```

---

## 📁 Repository Structure

```
nelovmallickiitd-web/
├── index.html              # Standalone high-fidelity CBT application & platform
├── server.js               # Node.js HTTP server with MIME type handling
├── assets/                 # Extracted question paper diagrams & figures
│   ├── pta04/              # PTA-04 circuit diagrams and graphs
│   └── pta05/              # PTA-05 reaction mechanisms and figures
├── public/                 # Static assets and test data
│   ├── assets/             # Mirrored asset directory
│   └── data/               # Browser-ready test paper datasets (pta04.js, pta05.js)
├── src/                    # Modular React TypeScript source
│   ├── components/         # Reusable UI components
│   ├── data/               # Paper schemas & solutions (pta04.ts, pta05.ts)
│   ├── App.tsx             # Root application
│   └── main.tsx            # Entry point
└── package.json            # Project dependencies and scripts
```

---

## 🌐 Production Architecture & Permanent Reliability

| Layer | Service / Technology | Reliability Guarantee |
|---|---|---|
| **Global CDN & Hosting** | Vercel Edge Network | 24/7 uptime, automated SSL, permanent free tier with zero trial expiry |
| **Authentication** | Google OAuth 2.0 & Supabase Auth | Permanent Google Client Credentials + Cloud Session Token Management |
| **Database & Analytics** | Supabase Managed PostgreSQL | Real-time RLS protected data storage with automatic failover |
| **Offline Resilience** | Browser Web Crypto & LocalStorage | Automatic local fallback so no student is ever blocked if offline |

---

## 📜 Mentorship & Attribution

Curated and directed by **Nelov Mallick (IIT Delhi)**.  
Dedicated to democratizing premier competitive exam preparation for all students across the country.
