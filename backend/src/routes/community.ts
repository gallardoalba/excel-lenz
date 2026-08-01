import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { getDb } from '../db/database';
import { authMiddleware, AuthPayload } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// ── Get comments for an exercise ───────────────────────────

router.get('/exercise/:exerciseId', (req: Request, res: Response) => {
  const db = getDb();
  const comments = db.prepare(`
    SELECT c.id, c.user_id, c.content, c.created_at, c.parent_id,
           u.name as user_name, u.role as user_role
    FROM exercise_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.exercise_id = ?
    ORDER BY c.created_at ASC
  `).all(req.params.exerciseId);

  res.json({ comments });
});

// ── Add a comment ──────────────────────────────────────────

router.post('/exercise/:exerciseId', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const { content, parent_id } = req.body;
  if (!content || !content.trim()) {
    res.status(400).json({ error: 'Comment content required' });
    return;
  }
  if (content.length > 2000) {
    res.status(400).json({ error: 'Comment too long (max 2000 characters)' });
    return;
  }

  const db = getDb();
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO exercise_comments (id, exercise_id, user_id, content, parent_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, req.params.exerciseId, userId, content.trim(), parent_id || null);

  const comment = db.prepare(`
    SELECT c.*, u.name as user_name, u.role as user_role
    FROM exercise_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.id = ?
  `).get(id);

  res.status(201).json({ comment });
});

// ── Delete own comment ─────────────────────────────────────

router.delete('/:id', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();

  const comment = db.prepare('SELECT * FROM exercise_comments WHERE id = ?').get(req.params.id) as any;
  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }
  if (comment.user_id !== userId && (req.user as AuthPayload).role !== 'teacher') {
    res.status(403).json({ error: 'Not authorized' });
    return;
  }

  db.prepare('DELETE FROM exercise_comments WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

// ── Share progress (generate shareable stats) ─────────────

router.get('/share', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();

  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(userId) as any;
  const stats = db.prepare(`
    SELECT COUNT(DISTINCT exercise_id) as exercises,
           ROUND(AVG(score), 1) as avg_score,
           COUNT(DISTINCT course_id) as courses
    FROM progress p
    JOIN exercises e ON e.id = p.exercise_id
    WHERE p.user_id = ? AND p.completed = 1
  `).get(userId) as any;

  const badges = db.prepare(`
    SELECT b.name, b.icon FROM badges b
    JOIN user_badges ub ON ub.badge_id = b.id
    WHERE ub.user_id = ?
    ORDER BY ub.earned_at DESC
  `).all(userId) as any[];

  res.json({
    user_name: user?.name || 'Anonym',
    stats,
    badges: badges.slice(0, 6),
    shareText: `🎓 ${user?.name} hat ${stats?.exercises || 0} Excel-Übungen mit ${stats?.avg_score || 0}% gemeistert auf Excel-lenz! ${badges.map(b => b.icon).join(' ')}`,
  });
});

export default router;
