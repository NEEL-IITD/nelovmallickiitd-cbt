import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const migrationPath = path.join(rootDir, 'supabase', 'migrations', '2026_leaderboard_and_mock_windows.sql');
const schemaPath = path.join(rootDir, 'supabase', 'schema.sql');

const migrationSql = fs.readFileSync(migrationPath, 'utf8');
let schemaSql = fs.readFileSync(schemaPath, 'utf8');

const marker = '-- 13. Scheduled All-India Mock Windows & 1st-Attempt-Only Live Leaderboards';
const idx = schemaSql.indexOf(marker);
if (idx !== -1) {
  const adminElevationMarker = '-- 14. How to elevate your account to Admin';
  const idxAdmin = schemaSql.indexOf(adminElevationMarker);
  if (idxAdmin !== -1) {
    const newSection = `${marker}\n-- ==============================================================================\n\n${migrationSql}\n\n-- ==============================================================================\n`;
    schemaSql = schemaSql.slice(0, idx) + newSection + schemaSql.slice(idxAdmin);
    fs.writeFileSync(schemaPath, schemaSql, 'utf8');
    console.log('✅ Updated schema.sql with tagged migration SQL');
  }
}
