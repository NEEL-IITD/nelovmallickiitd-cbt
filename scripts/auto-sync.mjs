import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deployAll } from './deploy-all.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function shouldIgnore(relPath) {
  const norm = relPath.replace(/\\/g, '/').toLowerCase();
  if (norm.startsWith('.git') || norm.includes('/.git/')) return true;
  if (norm.startsWith('node_modules') || norm.includes('/node_modules/')) return true;
  if (norm.startsWith('dist') || norm.includes('/dist/')) return true;
  if (norm.startsWith('.vercel') || norm.includes('/.vercel/')) return true;
  if (norm.startsWith('.system_generated') || norm.includes('/.system_generated/')) return true;
  if (norm.startsWith('browser_evidence') || norm.includes('/browser_evidence/')) return true;
  if (norm.endsWith('.log') || norm.endsWith('.lock') || norm.endsWith('.tmp') || norm.endsWith('package-lock.json')) return true;
  return false;
}

let debounceTimer = null;
let isDeploying = false;
let pendingChanges = new Set();

function triggerSync() {
  if (isDeploying) {
    console.log('⏳ Deployment already in progress. Queuing changes for next cycle...');
    return;
  }

  isDeploying = true;
  const changedFilesList = Array.from(pendingChanges);
  pendingChanges.clear();

  const summary = changedFilesList.slice(0, 3).map(f => path.basename(f)).join(', ') +
    (changedFilesList.length > 3 ? ` (+${changedFilesList.length - 3} more)` : '');

  const commitMsg = `auto-sync: update ${summary || 'portal assets'} [${new Date().toISOString().replace('T', ' ').substring(0, 19)}]`;

  deployAll(commitMsg)
    .catch(err => {
      console.error('❌ Auto-sync cycle error:', err.message);
    })
    .finally(() => {
      isDeploying = false;
      if (pendingChanges.size > 0) {
        console.log('🔄 Pending changes detected during last deploy. Scheduling next sync in 5s...');
        scheduleSync();
      }
    });
}

function scheduleSync() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerSync();
  }, 4000); // 4 second debounce
}

console.log('====================================================');
console.log('👀 ANTIGRAVITY AUTO-SYNC DAEMON STARTED');
console.log(`📁 Watching workspace: ${rootDir}`);
console.log('⚡ Any file modification will auto-push to GitHub & deploy to Vercel');
console.log('====================================================');

try {
  fs.watch(rootDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    if (shouldIgnore(filename)) return;

    console.log(`🔔 [${new Date().toLocaleTimeString()}] Workspace change detected: ${filename} (${eventType})`);
    pendingChanges.add(filename);
    scheduleSync();
  });
} catch (err) {
  console.error('Failed to initialize workspace watcher:', err.message);
}

// Keep process active
process.on('SIGINT', () => {
  console.log('\nStopping Antigravity Auto-Sync Daemon.');
  process.exit(0);
});
