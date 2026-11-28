import { next } from '@vercel/functions';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lyzmismtmtsvlqpzdruy.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NqVe4faHT7ccXhQoj8r6ng_KT4hmaSy';
const ADMIN_EMAIL = 'mallicknelov@gmail.com';

// Edge lock for upcoming scheduled mock test payloads before their official go-live time
const SCHEDULED_TEST_LOCKS = [
  {
    pattern: /(?:^|\/)(?:ptm-?0?3\.(?:js|json))$/i,
    unlockAtMs: Date.parse('2026-11-29T09:00:00+05:30'),
    label: 'PTM 03 unlocks Sun, Nov 29, 2026 at 9:00 AM IST',
  },
  {
    pattern: /(?:^|\/)(?:ptm-?0?4\.(?:js|json))$/i,
    unlockAtMs: Date.parse('2026-12-02T09:00:00+05:30'),
    label: 'PTM 04 unlocks Wed, Dec 2, 2026 at 9:00 AM IST',
  },
  {
    pattern: /(?:^|\/)(?:ptm-?0?5\.(?:js|json))$/i,
    unlockAtMs: Date.parse('2026-12-06T09:00:00+05:30'),
    label: 'PTM 05 unlocks Sun, Dec 6, 2026 at 9:00 AM IST',
  },
];

async function isAuthorizedAdminRequest(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.slice(7).trim();
    if (!token) return false;
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!resp.ok) return false;
    const user = await resp.json();
    return String(user?.email || '').trim().toLowerCase() === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const matchedLock = SCHEDULED_TEST_LOCKS.find((item) => item.pattern.test(url.pathname));
  if (matchedLock && Date.now() < matchedLock.unlockAtMs) {
    const allowedAdmin = await isAuthorizedAdminRequest(request);
    if (allowedAdmin) {
      return next();
    }
    return new Response(JSON.stringify({ error: matchedLock.label, locked: true }), {
      status: 403,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  }
  return next();
}

export const config = {
  matcher: ['/data/jee-mains/:path*', '/data/tests/:path*'],
};
