import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_REAL = fs.realpathSync(__dirname);
const PUBLIC_REAL = fs.existsSync(path.join(__dirname, 'public'))
  ? fs.realpathSync(path.join(__dirname, 'public'))
  : ROOT_REAL;

const PORT = Number(process.env.PORT) || 3000;

const ALLOWED_CORS_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://nelovmallickiitd-web.vercel.app',
]);

// Scheduled go-live locks for unreleased future tests (UTC/IST timestamps)
const SCHEDULED_TEST_LOCKS = [
  {
    pattern: /(?:^|\/)(?:ptm-?0?3\.(?:js|json))$/i,
    unlockAtMs: Date.parse('2026-11-29T09:00:00+05:30'),
    label: 'PTM 03 unlocks Sun, Nov 29, 2026 at 9:00 AM IST',
  },
];

// Sensitive paths/files that must NEVER be served by the web server
const BLOCKED_PATH_PATTERNS = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/\.vercel/i,
  /^\/supabase(?:\/|$)/i,
  /^\/scripts(?:\/|$)/i,
  /^\/node_modules(?:\/|$)/i,
  /^\/src(?:\/|$)/i,
  /^\/scratch(?:\/|$)/i,
  /^\/backups(?:\/|$)/i,
  /^\/server\.js$/i,
  /^\/package(?:-lock)?\.json$/i,
  /^\/tsconfig\.json$/i,
  /^\/vite\.config\.ts$/i,
  /^\/SUPABASE_SETUP\.md$/i,
  /^\/README\.md$/i,
  /\.(?:sql|py|mjs|cjs|ts|tsx|map|gz)$/i,
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

function buildSecurityHeaders(req, extraHeaders = {}) {
  const origin = req.headers.origin;
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...extraHeaders,
  };
  if (origin && ALLOWED_CORS_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, buildSecurityHeaders(req, { 'Content-Type': 'application/json; charset=utf-8' }));
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  let decodedPath = '/';
  try {
    decodedPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    res.writeHead(400, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
    return res.end('400 Bad Request');
  }

  if (decodedPath === '/' || decodedPath === '') {
    decodedPath = '/index.html';
  }

  // Normalize slashes cleanly and reject null bytes / hidden path traversal tricks
  const normalizedUrlPath = path.posix.normalize(decodedPath.replace(/\\/g, '/'));
  if (normalizedUrlPath.includes('\0') || normalizedUrlPath.includes('..')) {
    res.writeHead(403, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
    return res.end('403 Forbidden');
  }

  // Strictly block access to dotfiles, configs, SQL migrations, scripts, and backend files
  if (BLOCKED_PATH_PATTERNS.some((rx) => rx.test(normalizedUrlPath)) || /\/\./.test(normalizedUrlPath)) {
    res.writeHead(403, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
    return res.end('403 Forbidden');
  }

  // Gate future scheduled test papers & answer keys before go-live
  const matchedLock = SCHEDULED_TEST_LOCKS.find((item) => item.pattern.test(normalizedUrlPath));
  if (matchedLock && Date.now() < matchedLock.unlockAtMs) {
    res.writeHead(403, buildSecurityHeaders(req, { 'Content-Type': 'application/json; charset=utf-8' }));
    return res.end(JSON.stringify({ error: matchedLock.label, locked: true }));
  }

  const relPath = normalizedUrlPath.replace(/^\/+/, '');
  const candidatePublic = path.resolve(PUBLIC_REAL, relPath);
  const candidateRoot = path.resolve(ROOT_REAL, relPath);

  const isInsidePublic = candidatePublic === PUBLIC_REAL || candidatePublic.startsWith(PUBLIC_REAL + path.sep);
  const isInsideRoot = candidateRoot === ROOT_REAL || candidateRoot.startsWith(ROOT_REAL + path.sep);
  if (!isInsidePublic && !isInsideRoot) {
    res.writeHead(403, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
    return res.end('403 Forbidden');
  }

  let filePath = null;
  // Prefer files inside public/, or explicitly allowlisted top-level runtime assets (index.html, data/, assets/, images/)
  if (isInsidePublic && fs.existsSync(candidatePublic) && fs.statSync(candidatePublic).isFile()) {
    const realPublicFile = fs.realpathSync(candidatePublic);
    if (realPublicFile.startsWith(PUBLIC_REAL + path.sep)) {
      filePath = realPublicFile;
    }
  } else if (
    isInsideRoot &&
    /^(?:index\.html|(?:data|assets|images)\/)/i.test(relPath) &&
    fs.existsSync(candidateRoot) &&
    fs.statSync(candidateRoot).isFile()
  ) {
    const realRootFile = fs.realpathSync(candidateRoot);
    if (realRootFile.startsWith(ROOT_REAL + path.sep)) {
      filePath = realRootFile;
    }
  }

  if (!filePath) {
    // Fallback to index.html ONLY for non-asset SPA routes (prevent silent HTML fallback masking 404/locked .js/.json files)
    const reqExt = path.extname(normalizedUrlPath).toLowerCase();
    if (reqExt && reqExt !== '.html') {
      res.writeHead(404, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
      return res.end('404 Not Found');
    }

    const indexPath = path.join(ROOT_REAL, 'index.html');
    fs.readFile(indexPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
        return res.end('404 Not Found');
      }
      res.writeHead(200, buildSecurityHeaders(req, { 'Content-Type': 'text/html; charset=utf-8' }));
      res.end(content);
    });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (readErr, content) => {
    if (readErr) {
      res.writeHead(500, buildSecurityHeaders(req, { 'Content-Type': 'text/plain' }));
      return res.end('500 Server Error');
    }
    res.writeHead(200, buildSecurityHeaders(req, { 'Content-Type': contentType }));
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server successfully started at http://localhost:${PORT}`);
});
