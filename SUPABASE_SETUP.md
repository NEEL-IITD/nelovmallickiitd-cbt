# Supabase Setup & Production Deployment Guide
**Platform:** [NelovMallickIITD CBT Platform](https://github.com/NEEL-IITD/nelovmallickiitd-cbt)  
**Author & Mentor:** Nelov Mallick (IIT Delhi)  
**License:** 100% Free Forever · Zero Pricing

---

This guide walks you through connecting your **Supabase (Free Tier)** database, configuring one-click **"Continue with Google"** authentication, and granting your personal account **Admin Access** to the `/admin` dashboard.

> [!NOTE]
> The platform is designed with an automatic local fallback mode. If Supabase keys are not set yet, the platform runs offline seamlessly via Web Crypto SHA-256 and client-side storage so that you and students can always test and practice without downtime.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Choose an organization, enter a project name (e.g., `nelovmallickiitd-cbt`), and set a secure database password.
4. Select your preferred region (e.g. `South Asia (Mumbai)` or closest to your users) and choose the **Free Tier**.
5. Wait 1–2 minutes for the database to provision.

---

## Step 2: Run the Database Schema

1. In your Supabase dashboard, open the **SQL Editor** from the left navigation.
2. Click **+ New Query**.
3. Open `supabase/schema.sql` from this repository, copy its entire contents, and paste them into the SQL Editor.
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).
5. You should see `Success. No rows returned`.
6. Open **Table Editor** to verify the following tables were created:
   - `profiles` (with automatic `handle_new_user()` trigger on signup)
   - `test_configs` (pre-seeded with PTA 01 to PTA 10 for JEE Mains and JEE Advanced)
   - `test_attempts` (scores, detailed responses, mistake tags)
   - `bookmarks` (personal Revision Notebook)
   - `error_reports` (student error submissions)

---

## Step 3: Configure Google OAuth ("Continue with Google")

To enable one-click Google Login:

### A. Create Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `NelovMallickIITD-CBT`).
3. Navigate to **APIs & Services** > **OAuth consent screen**:
   - Choose **External** and click **Create**.
   - App name: `NelovMallickIITD CBT`
   - User support email: your email.
   - Developer contact email: your email.
   - Click **Save and Continue** through Scopes and Test Users.
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Supabase Web Client`.
   - Under **Authorized redirect URIs**, add your Supabase Auth callback URL:
     ```
     https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
     ```
     *(You can copy this exact URL from Supabase Dashboard > Authentication > Providers > Google)*.
   - Click **Create**.
   - Copy the generated **Client ID** and **Client Secret**.

### B. Enable Google in Supabase
1. In the Supabase Dashboard, go to **Authentication** > **Providers**.
2. Click **Google** and toggle it **Enabled**.
3. Paste your **Client ID** and **Client Secret**.
4. Click **Save**.

---

## Step 4: Add Environment Variables

1. In the Supabase Dashboard, go to **Project Settings** (gear icon) > **API**.
2. Copy the **Project URL** and the **`anon` `public` key**.
3. In the project root, create a file named `.env` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Paste your values into `.env`:
   ```ini
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. When deploying to **Vercel**, **Netlify**, or **Cloudflare Pages**, add these two variables in the hosting dashboard under **Environment Variables**.

---

## Step 5: Promote Your Account to Admin (`/admin`)

The private **Admin Dashboard** (`/admin`) is strictly protected and checks `profile.role === 'admin'`. No passwords or secret keys are hardcoded in the frontend.

To elevate your account to Admin:
1. First, sign up on the platform with your email (via Email/Password or "Continue with Google").
2. In Supabase Dashboard, go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```
3. Refresh the platform. You will now see:
   - An **"Admin Panel"** link in your user profile dropdown in the top navbar.
   - Full access to `http://localhost:3000/#/admin` (or `https://your-site.com/#/admin`).
   - Powers to toggle tests between **Live Now** and **Coming Soon**, review error reports, view student attempt logs, and inspect platform KPIs.

---

## Step 6: Verify Everything Works

1. Start the platform:
   ```bash
   node server.js
   ```
2. Open `http://localhost:3000`.
3. Try clicking **"Continue with Google"** on the Sign In modal.
4. Attempt a test, bookmark a question, submit an error report, and check the `/admin` portal.
