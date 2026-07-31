import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import { getDb } from '../db/database';
import { authMiddleware, AuthPayload } from '../middleware/auth';

const router = Router();

// Public endpoints (no auth required)
router.get('/pricing', (_req: Request, res: Response) => {
  res.json({ tiers: TIERS });
});

// Auth-required endpoints
router.use(authMiddleware);

// ── SUBSCRIPTIONS ───────────────────────────────────────────

const TIERS = {
  free: { name: 'Free', price: 0, maxCourses: 3, maxExercises: 10, features: ['Basis-Übungen', '3 Kurse', 'Dashboard'] },
  pro: { name: 'Pro', price: 999, maxCourses: 999, maxExercises: 999, features: ['Alle Kurse', 'Unbegrenzt Übungen', 'Zertifikate', 'Keine Werbung', 'API-Zugang'] },
  team: { name: 'Team', price: 1999, maxCourses: 999, maxExercises: 999, features: ['Alles aus Pro', 'Team-Dashboard', 'Admin-Panel', 'SSO (bald)', 'Prioritäts-Support'] },
};

router.get('/subscription', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();
  // Ensure user has subscription
  db.prepare('INSERT OR IGNORE INTO subscriptions (id, user_id, tier) VALUES (?, ?, ?)').run(uuid(), userId, 'free');
  const sub = db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId);
  const tierKey = ((sub as any)?.tier || 'free') as keyof typeof TIERS;
  res.json({ subscription: sub, tier: TIERS[tierKey] });
});

router.post('/subscribe', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const { tier } = req.body;
  if (!TIERS[tier as keyof typeof TIERS]) {
    res.status(400).json({ error: 'Ungültiger Tarif' });
    return;
  }

  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO subscriptions (id, user_id, tier, status, stripe_id) VALUES (?, ?, ?, ?, ?)')
    .run(uuid(), userId, tier, 'active', tier === 'free' ? null : `sub_sim_${Date.now()}`);

  auditLog(db, userId, 'subscribe', 'subscription', userId, { tier });
  res.json({ success: true, tier, checkoutUrl: tier === 'free' ? null : `/payment/success?tier=${tier}` });
});

// Stripe checkout session (simulated)
router.post('/create-checkout', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const { tier } = req.body;
  if (!TIERS[tier as keyof typeof TIERS] || tier === 'free') {
    res.status(400).json({ error: 'Ungültiger Tarif' });
    return;
  }
  // In production: stripe.checkout.sessions.create({...})
  res.json({
    checkoutUrl: `/payment/success?tier=${tier}`,
    sessionId: `cs_sim_${Date.now()}`,
  });
});

// SCORM/xAPI package export (stub)
router.get('/export/scorm/:courseId', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const course = getDb().prepare('SELECT * FROM courses WHERE id = ?').get(req.params.courseId) as any;
  if (!course) { res.status(404).json({ error: 'Kurs nicht gefunden' }); return; }

  const exercises = getDb().prepare(
    'SELECT * FROM exercises WHERE course_id = ? ORDER BY order_index'
  ).all(req.params.courseId);

  // Generate SCORM 1.2 manifest
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="excel-lenz_${course.id}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
  <organizations default="org1">
    <organization identifier="org1">
      <title>${course.title}</title>
      ${(exercises as any[]).map((ex: any, i: number) => `
      <item identifier="item_${i}" identifierref="res_${i}">
        <title>${ex.title}</title>
      </item>`).join('')}
    </organization>
  </organizations>
  <resources>
    ${(exercises as any[]).map((ex: any, i: number) => `
    <resource identifier="res_${i}" type="webcontent" href="exercise_${i}.html">
      <file href="exercise_${i}.html"/>
    </resource>`).join('')}
  </resources>
</manifest>`;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${course.title}_scorm.json"`);
  res.json({ manifest, exercises, format: 'SCORM 1.2' });
});

// ── API KEYS ────────────────────────────────────────────────

router.get('/api-keys', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const sub = getDb().prepare('SELECT tier FROM subscriptions WHERE user_id = ?').get(userId) as any;
  if (!sub || sub.tier === 'free') {
    res.status(403).json({ error: 'API-Zugang nur für Pro/Team' });
    return;
  }

  const keys = getDb().prepare(
    'SELECT id, name, last_used_at, created_at FROM api_keys WHERE user_id = ?'
  ).all(userId);
  res.json(keys);
});

router.post('/api-keys', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const { name } = req.body;
  if (!name) { res.status(400).json({ error: 'Name erforderlich' }); return; }

  const sub = getDb().prepare('SELECT tier FROM subscriptions WHERE user_id = ?').get(userId) as any;
  if (!sub || sub.tier === 'free') {
    res.status(403).json({ error: 'API-Zugang nur für Pro/Team' });
    return;
  }

  const apiKey = 'ex_' + crypto.randomBytes(24).toString('hex');
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  getDb().prepare(
    'INSERT INTO api_keys (id, user_id, name, key_hash) VALUES (?, ?, ?, ?)'
  ).run(uuid(), userId, name, keyHash);

  auditLog(getDb(), userId, 'api_key_created', 'api_key', userId, { name });
  res.status(201).json({ key: apiKey, name }); // Only time the full key is shown
});

router.delete('/api-keys/:id', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  getDb().prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?').run(req.params.id, userId);
  res.json({ success: true });
});

// ── AUDIT LOGS (teacher/admin only) ─────────────────────────

router.get('/audit-logs', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const user = getDb().prepare('SELECT role FROM users WHERE id = ?').get(userId) as any;
  if (user?.role !== 'teacher') {
    res.status(403).json({ error: 'Nur für Lehrer' });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 50;
  const logs = getDb().prepare(
    'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?'
  ).all(limit);
  res.json(logs);
});

// ── TEAM DASHBOARD ──────────────────────────────────────────

router.get('/team-stats', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const sub = getDb().prepare('SELECT tier FROM subscriptions WHERE user_id = ?').get(userId) as any;
  if (!sub || sub.tier === 'free') {
    res.status(403).json({ error: 'Team-Dashboard nur für Pro/Team' });
    return;
  }

  const db = getDb();
  const stats = {
    totalUsers: (db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('student') as any).c,
    totalExercises: (db.prepare('SELECT COUNT(*) as c FROM exercises').get() as any).c,
    totalSubmissions: (db.prepare('SELECT COUNT(*) as c FROM progress WHERE completed = 1').get() as any).c,
    avgScore: (db.prepare('SELECT ROUND(AVG(score),1) as a FROM progress WHERE score IS NOT NULL').get() as any).a || 0,
    activeToday: (db.prepare(
      "SELECT COUNT(DISTINCT user_id) as c FROM progress WHERE date(completed_at) = date('now')"
    ).get() as any).c,
  };
  res.json(stats);
});

// ── MIDDLEWARE: Feature gating ──────────────────────────────

export function requireTier(minTier: 'pro' | 'team') {
  return (req: Request, res: Response, next: Function) => {
    const userId = (req.user as AuthPayload)?.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const sub = getDb().prepare('SELECT tier FROM subscriptions WHERE user_id = ?').get(userId) as { tier: string } | undefined;
    const tierLevel: Record<string, number> = { free: 0, pro: 1, team: 2 };
    if ((tierLevel[sub?.tier || 'free'] || 0) < (tierLevel[minTier] || 0)) {
      res.status(403).json({ error: `Upgrade auf ${minTier.toUpperCase()} erforderlich` });
      return;
    }
    next();
  };
}

// ── AUDIT LOGGER ────────────────────────────────────────────

export function auditLog(db: any, userId: string, action: string, resource: string, resourceId?: string, metadata?: any) {
  try {
    db.prepare(
      'INSERT INTO audit_logs (id, user_id, action, resource, resource_id, metadata) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(uuid(), userId, action, resource, resourceId || null, metadata ? JSON.stringify(metadata) : null);
  } catch (err) {
    console.error('[AUDIT] Failed to write audit log:', err);
  }
}

export default router;
