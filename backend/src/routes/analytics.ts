import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { getDb } from '../db/database';
import { authMiddleware, optionalAuth, AuthPayload } from '../middleware/auth';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

const router = Router();

// ── 5-minute cache for summary queries ──────────────────────
const summaryCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// ── Rate limit tracking endpoints ───────────────────────────
const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many tracking requests' },
});

// ── Track batch (transactional) ──────────────────────────────

router.post('/track-batch', trackLimiter, optionalAuth, (req: Request, res: Response) => {
  const { events } = req.body;

  if (!Array.isArray(events) || events.length === 0 || events.length > 50) {
    res.status(400).json({ error: 'events array required (max 50 per batch)' });
    return;
  }

  const userId = (req.user as AuthPayload)?.userId || null;
  const db = getDb();

  // Use a single transaction for all inserts — 50x faster than individual inserts
  const insert = db.prepare(`
    INSERT INTO analytics_events (id, user_id, event_type, resource_type, resource_id, metadata, session_id, client_timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const ev of events) {
      // Validate: event_type must be non-empty string, max 50 chars
      if (typeof ev.event_type !== 'string' || ev.event_type.length === 0 || ev.event_type.length > 50) continue;

      // Limit metadata to 2KB to prevent abuse
      let metadataStr: string | null = null;
      if (ev.metadata) {
        metadataStr = JSON.stringify(ev.metadata);
        if (metadataStr.length > 2048) metadataStr = null;
      }

      insert.run(
        crypto.randomUUID(), userId,
        ev.event_type,
        ev.resource_type || null,
        ev.resource_id || null,
        metadataStr,
        ev.session_id || null,
        ev.client_timestamp || null
      );
    }
  });

  let inserted = 0;
  try {
    tx();
    // Count actual valid inserts by querying rows with our session pattern
    // Simpler: count valid events from the input that passed validation
    inserted = events.filter(ev =>
      typeof ev.event_type === 'string' && ev.event_type.length > 0 && ev.event_type.length <= 50
    ).length;
    res.status(201).json({ tracked: inserted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store events' });
  }
});

// ── Legacy single-track endpoint (kept for compatibility) ────

router.post('/track', trackLimiter, optionalAuth, (req: Request, res: Response) => {
  const { event_type, resource_type, resource_id, metadata, session_id, client_timestamp } = req.body;
  if (!event_type) {
    res.status(400).json({ error: 'event_type is required' });
    return;
  }

  const userId = (req.user as AuthPayload)?.userId || null;
  const db = getDb();

  db.prepare(`
    INSERT INTO analytics_events (id, user_id, event_type, resource_type, resource_id, metadata, session_id, client_timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(), userId, event_type,
    resource_type || null, resource_id || null,
    metadata ? JSON.stringify(metadata) : null,
    session_id || null, client_timestamp || null
  );

  summaryCache.del('summary');
  res.status(201).json({ tracked: true });
});

// ── Aggregate analytics (teacher-only, cached 5 min) ────────

router.get('/summary', authMiddleware, (req: Request, res: Response) => {
  const user = req.user as AuthPayload;
  if (user.role !== 'teacher') {
    res.status(403).json({ error: 'Nur für Lehrer zugänglich' });
    return;
  }

  // Return cached result if available
  const cached = summaryCache.get('summary');
  if (cached) {
    res.json(cached);
    return;
  }

  const db = getDb();

  // Total unique users (all time)
  const totalUsers = (db.prepare(`
    SELECT COUNT(DISTINCT user_id) as c FROM analytics_events WHERE user_id IS NOT NULL
  `).get() as any).c;

  // Active users (last 7 days)
  const activeUsers = (db.prepare(`
    SELECT COUNT(DISTINCT user_id) as c FROM analytics_events
    WHERE user_id IS NOT NULL AND created_at > datetime('now', '-7 days')
  `).get() as any).c;

  // Total events
  const totalEvents = (db.prepare('SELECT COUNT(*) as c FROM analytics_events').get() as any).c;

  // Events per type
  const eventsByType = db.prepare(`
    SELECT event_type, COUNT(*) as count FROM analytics_events GROUP BY event_type ORDER BY count DESC
  `).all();

  // Events per day (last 30 days)
  const eventsByDay = db.prepare(`
    SELECT DATE(created_at) as day, COUNT(*) as count FROM analytics_events
    WHERE created_at > datetime('now', '-30 days') GROUP BY day ORDER BY day ASC
  `).all();

  // Top exercises by attempts
  const topExercises = db.prepare(`
    SELECT resource_id, e.title, COUNT(*) as attempts
    FROM analytics_events a LEFT JOIN exercises e ON e.id = a.resource_id
    WHERE a.event_type = 'exercise_submit' GROUP BY resource_id ORDER BY attempts DESC LIMIT 10
  `).all();

  // Average time per exercise
  const avgSessionDuration = db.prepare(`
    SELECT ROUND(AVG(CAST(json_extract(metadata, '$.duration_seconds') AS REAL)), 0) as avg_seconds
    FROM analytics_events WHERE event_type = 'exercise_complete' AND metadata IS NOT NULL
  `).get() as any;

  // Completion rate (score >= 80%)
  const completionStats = db.prepare(`
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'exercise_submit' THEN resource_id || '_' || user_id END) as attempts,
      COUNT(DISTINCT CASE WHEN event_type = 'exercise_submit'
        AND CAST(json_extract(metadata, '$.score') AS INTEGER) >= 80 THEN resource_id || '_' || user_id END) as passed
    FROM analytics_events WHERE event_type = 'exercise_submit'
  `).get() as any;

  const result = {
    totalUsers,
    activeUsers,
    totalEvents,
    eventsByType,
    eventsByDay,
    topExercises,
    avgSessionDuration: avgSessionDuration?.avg_seconds || null,
    completionRate: completionStats?.attempts > 0
      ? Math.round((completionStats.passed / completionStats.attempts) * 100)
      : null,
    cachedAt: new Date().toISOString(),
  };

  summaryCache.set('summary', result);
  res.json(result);
});

export default router;
