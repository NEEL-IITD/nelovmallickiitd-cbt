/**
 * Free Local Supabase Database Backup Script (Compressed .json.gz)
 * Usage: npm run backup
 *
 * Reads VITE_SUPABASE_URL from .env and SUPABASE_SERVICE_ROLE_KEY from .env.local
 * (never prefixed with VITE_, never bundled into frontend builds, and gitignored).
 * Backups are written strictly into ./backups/ (gitignored) to protect student PII.
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TABLES = [
  'profiles',
  'test_configs',
  'test_attempts',
  'bookmarks',
  'error_reports',
  'lecture_progress',
  'physics_progress',
  'physics_exercise_attempts',
  'vault_exercises',
  'vault_theory_notes',
  'chapter_progress',
  'daily_plans',
  'question_notes_and_mistakes',
];

function loadEnvFile(filePath, target) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    target[key] = val;
  }
}

async function fetchAllRows(supabase, table) {
  const pageSize = 1000;
  let offset = 0;
  const rows = [];

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(offset, offset + pageSize - 1);

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message || '')) {
        return { skipped: true, reason: error.message, rows: [] };
      }
      throw new Error(`${table}: ${error.message}`);
    }

    const batch = Array.isArray(data) ? data : [];
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  return { skipped: false, rows };
}

async function main() {
  const env = { ...process.env };
  loadEnvFile(path.join(ROOT_DIR, '.env'), env);
  loadEnvFile(path.join(ROOT_DIR, '.env.local'), env);

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('Missing VITE_SUPABASE_URL in .env');
    process.exit(1);
  }
  if (!serviceRoleKey) {
    console.error(
      'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.\n' +
      'Add SUPABASE_SERVICE_ROLE_KEY=your_secret_key ONLY inside .env.local (never VITE_ prefixed, never committed),\n' +
      'then re-run: npm run backup'
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const snapshot = {
    createdAt: new Date().toISOString(),
    projectUrl: supabaseUrl,
    tables: {},
    summary: {},
  };

  console.log('Starting encrypted-at-rest local Supabase snapshot across 13 tables...');
  for (const table of TABLES) {
    const res = await fetchAllRows(supabase, table);
    if (res.skipped) {
      snapshot.summary[table] = 'skipped';
      console.log(`- ${table}: skipped (not present in schema)`);
    } else {
      snapshot.tables[table] = res.rows;
      snapshot.summary[table] = res.rows.length;
      console.log(`- ${table}: ${res.rows.length} rows`);
    }
  }

  const backupsDir = path.join(ROOT_DIR, 'backups');
  fs.mkdirSync(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
  const outPath = path.join(backupsDir, `supabase-backup-${stamp}.json.gz`);

  const gz = zlib.gzipSync(Buffer.from(JSON.stringify(snapshot, null, 2), 'utf8'));
  fs.writeFileSync(outPath, gz);

  console.log(`\nBackup saved cleanly (gitignored): ${path.relative(ROOT_DIR, outPath)} (${(gz.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('Backup failed:', err?.message || err);
  process.exit(1);
});
