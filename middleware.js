import { next } from '@vercel/functions';

// Edge lock for upcoming scheduled mock test payloads before their official go-live time
const SCHEDULED_TEST_LOCKS = [
  {
    pattern: /(?:^|\/)(?:ptm-?0?3\.(?:js|json))$/i,
    unlockAtMs: Date.parse('2026-11-29T09:00:00+05:30'),
    label: 'PTM 03 unlocks Sun, Nov 29, 2026 at 9:00 AM IST',
  },
];

export default function middleware(request) {
  const url = new URL(request.url);
  const matchedLock = SCHEDULED_TEST_LOCKS.find((item) => item.pattern.test(url.pathname));
  if (matchedLock && Date.now() < matchedLock.unlockAtMs) {
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
