import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deployAll } from './deploy-all.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const IGNORE_PATTERNS = [
  /[\\/]\.git([\\/]|$)/,
  /[\\/]node_modules([\\/]|$)/,
  /[\\/]dist([\\/]|$)/,
  /[\\/]\.vercel([\\/]|$)/,
  /[\\/]\.system_generated([\\/]|$)/,
  /[\\/]browser_evidence([\\/]|$)/,
  /[\\/]scratch([\\/]|$)/,
  /\.log$/,
  /\.lock$/,
  /\.tmp$/,
  /~$/,
  /package-lock\.json$/
];

function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(regex => regex.test(filePath));
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
  }, 5000); // 5 second debounce
}

console.log('====================================================');
console.log('👀 ANTIGRAVITY AUTO-SYNC DAEMON STARTED');
console.log(`📁 Watching workspace: ${rootDir}`);
console.log('⚡ Any file modification will auto-push to GitHub & deploy to Vercel');
console.log('====================================================');

try {
  fs.watch(rootDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const fullPath = path.join(rootDir, filename);

    if (shouldIgnore(fullPath)) return;

    console.log(`🔔 [${new Date().toLocaleTimeString()}] Workspace change detected: ${filename} (${eventType})`);
    pendingChanges.add(fullPath);
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
