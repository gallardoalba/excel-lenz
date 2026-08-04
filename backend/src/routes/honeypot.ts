import { Router, Request, Response } from 'express';

/**
 * Honeypot trap for AI scrapers / malicious bots that ignore robots.txt.
 *
 * The frontend places an invisible link (hidden via CSS, invisible to humans)
 * pointing to /api/honeypot. Genuine users and well-behaved bots (Googlebot)
 * never follow it. Scrapers that blindly crawl all links will trigger this,
 * and their IP gets banned for 24 hours.
 */

// In-memory ban list: Map<ip, unban_timestamp>
const bannedIPs = new Map<string, number>();

// Clean expired bans every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, until] of bannedIPs) {
    if (now >= until) bannedIPs.delete(ip);
  }
}, 600_000);

const router = Router();

// ── Middleware: check if IP is banned ──────────────────────
export function honeypotBanCheck(req: Request, res: Response, next: Function) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';

  const bannedUntil = bannedIPs.get(ip);
  if (bannedUntil && Date.now() < bannedUntil) {
    const remaining = Math.ceil((bannedUntil - Date.now()) / 1000 / 60);
    res.status(403).json({
      error: 'Access denied',
      reason: 'Automated scraping detected',
      retryAfterMinutes: remaining,
    });
    return;
  }
  next();
}

// ── Honeypot endpoint ──────────────────────────────────────
// Hit by bots that follow invisible links.
// Bans the source IP for 24 hours.

router.get('/honeypot', (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';

  const banDuration = 24 * 60 * 60 * 1000; // 24 hours
  const until = Date.now() + banDuration;

  bannedIPs.set(ip, until);

  const userAgent = req.headers['user-agent'] || '(none)';
  console.log(`[honeypot] Banned IP ${ip} for 24h — UA: ${userAgent.slice(0, 100)}`);

  // Return 418 "I'm a teapot" — humorous but semantically correct
  // for a request that shouldn't exist
  res.status(418).json({ message: "I'm a teapot" });
});

export default router;
