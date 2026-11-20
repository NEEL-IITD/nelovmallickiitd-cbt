import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const gitExe = 'C:\\Users\\dasri\\.gemini\\antigravity\\bin\\git\\cmd\\git.exe';

function run(cmd, desc) {
  console.log(`\n▶ [${new Date().toLocaleTimeString()}] ${desc}...`);
  try {
    const stdout = execSync(cmd, {
      cwd: rootDir,
      env: {
        ...process.env,
        PATH: `C:\\Users\\dasri\\.gemini\\antigravity\\bin\\nodejs;C:\\Users\\dasri\\.gemini\\antigravity\\bin\\git\\cmd;${process.env.PATH || ''}`
      },
      encoding: 'utf8',
      stdio: 'pipe'
    });
    if (stdout.trim()) console.log(stdout.trim());
    return { ok: true, stdout };
  } catch (err) {
    console.error(`❌ Error in ${desc}:`, err.message);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return { ok: false, error: err };
  }
}

export async function deployAll(customMessage) {
  console.log('====================================================');
  console.log('🚀 ANTIGRAVITY AUTO-SYNC & DEPLOY PIPELINE');
  console.log('====================================================');

  // 1. Check Git Status
  const statusRes = run(`"${gitExe}" status --porcelain`, 'Checking Git Working Tree');
  const hasChanges = statusRes.ok && statusRes.stdout.trim().length > 0;

  if (hasChanges) {
    console.log('📝 Detected workspace modifications:');
    console.log(statusRes.stdout.trim());

    // 2. Stage All Changes
    run(`"${gitExe}" add .`, 'Staging all workspace changes');

    // 3. Commit
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const commitMsg = customMessage || `auto-sync: update portal assets and components [${timestamp}]`;
    run(`"${gitExe}" commit -m "${commitMsg}"`, 'Creating Git Commit');

    // 4. Push to GitHub
    const pushRes = run(`"${gitExe}" push origin main`, 'Pushing to GitHub (origin/main)');
    if (!pushRes.ok) {
      console.warn('⚠️ Push warning, will continue to Vercel deployment');
    }
  } else {
    console.log('ℹ️ Git working tree clean. Proceeding to verify & deploy to Vercel.');
  }

  // 5. Build Verification
  const buildRes = run('npm run build', 'Running TypeScript & Vite Production Build');
  if (!buildRes.ok) {
    console.error('❌ Build failed. Aborting Vercel deployment to prevent breaking production.');
    process.exit(1);
  }

  // 6. Deploy directly to Vercel Production
  const vercelRes = run('npx vercel --prod --yes', 'Deploying to Vercel Production');
  if (vercelRes.ok) {
    console.log('\n====================================================');
    console.log('✅ AUTO-SYNC & DEPLOYMENT COMPLETE!');
    console.log('🔗 GitHub: https://github.com/NEEL-IITD/nelovmallickiitd-cbt');
    console.log('🌐 Vercel Live: https://nelovmallickiitd-web.vercel.app');
    console.log('====================================================');
  } else {
    console.error('❌ Vercel deployment encountered an error.');
    process.exit(1);
  }
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('deploy-all.mjs')) {
  const msg = process.argv.slice(2).join(' ') || null;
  deployAll(msg);
}
