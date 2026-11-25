# Supabase Setup & Cloud Sync Guide
**Platform:** [NelovMallickIITD JEE CBT & Study Portal](https://github.com/NEEL-IITD/nelovmallickiitd-cbt)  
**Author & Mentor:** Nelov Mallick (IIT Delhi)  
**License:** 100% Free Forever · Zero Pricing

---

This guide explains how to connect **Supabase (PostgreSQL + Auth + Row Level Security)** so students can sign in with **Google OAuth** or **Email/Password** and automatically sync their daily goals, streaks, 24-hour timetable blocks, in-progress/completed test attempts, scores, mistake notebooks, and 83-chapter progress across phone and laptop.

> [!NOTE]
> If Supabase environment variables are not configured locally yet, the app automatically falls back to browser `localStorage` with a subtle non-blocking banner. Once a student signs in on a Supabase-connected deployment, guest `localStorage` data is automatically merged and synced to Postgres.

---

## Step 1: Run `supabase/schema.sql` in Supabase SQL Editor

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** → **+ New Query**.
3. Open [supabase/schema.sql](supabase/schema.sql) (or [supabase/migrations/2026_supabase_cloud_sync_and_auth.sql](supabase/migrations/2026_supabase_cloud_sync_and_auth.sql) if your base schema is already deployed), copy the SQL contents, and click **Run**.
4. Open **Table Editor** & **Authentication → Policies** to confirm Row Level Security (`RLS`) is enabled across:
   - `public.profiles` (auto-created on signup via `handle_new_user()` trigger; stores `role`, `target_exam`, `daily_question_goal`, `current_streak`, `avatar_url`)
   - `public.daily_plans` (`user_id, plan_date` unique; stores daily topics, 24h `timetable_blocks`, custom activities, `questions_solved_today`)
   - `public.test_attempts` (stores `in_progress` cross-device resume drafts + `completed` scorecards, percentiles, `question_timings`)
   - `public.question_notes_and_mistakes` (`user_id, question_id` unique; stores `is_mistake`, `is_revised`, `is_bookmarked`, `personal_note`)
   - `public.chapter_progress` (`user_id, subject, chapter_slug` unique; stores 83-chapter `theory_completed`, `exercises_completed`, milestones)

---

## Step 2: Enable Google OAuth, Email Auth & Redirect URLs

### A. Authentication Providers
1. Go to **Authentication** → **Providers**:
   - **Email:** Ensure **Email** is enabled. *(For smoother student onboarding, you can optionally toggle email confirmations according to your preference).*
   - **Google:** Toggle **Google** enabled and paste your OAuth **Client ID** and **Client Secret** from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
     - Add this Authorized Redirect URI in Google Cloud Console:
       ```
       https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
       ```

### B. URL Configuration (Critical for OAuth & Password Reset!)
1. Go to **Authentication** → **URL Configuration**:
   - **Site URL:** Set to your production URL (e.g. `https://your-domain.vercel.app`) or `http://localhost:3000` for local testing.
   - **Redirect URLs:** Add every allowed callback origin:
     ```
     http://localhost:3000
     http://localhost:3000/**
     https://your-domain.vercel.app
     https://your-domain.vercel.app/**
     ```

---

## Step 3: Add Environment Variables & Promote Admin Role

1. Copy your **Project URL** and **anon public key** from **Project Settings** → **API**.
2. Locally, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in:
   ```ini
   VITE_SUPABASE_URL=https://<YOUR-PROJECT-REF>.supabase.co
   VITE_SUPABASE_ANON_KEY=<YOUR-ANON-PUBLIC-KEY>
   ```
   *(If deploying on a Next.js-style host or sharing keys, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also supported).*
3. In **Vercel / Netlify** project settings → **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.
4. **Promote Your Admin Account (`role = 'admin'`):**
   - Sign up or log in on the site using `mallicknelov@gmail.com`.
   - Run in Supabase **SQL Editor**:
     ```sql
     UPDATE public.profiles
     SET role = 'admin'
     WHERE LOWER(email) = 'mallicknelov@gmail.com';
     ```
   - Refresh the site cleanly: Admin tools (`Upload JSON / Upload PDF` & `#/admin`) only unlock when `profiles.role === 'admin'` on your verified Supabase session.
