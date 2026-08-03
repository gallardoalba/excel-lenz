import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/database';
import { authMiddleware, AuthPayload } from '../middleware/auth';

const router = Router();

// Middleware: only teachers
function teacherOnly(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as AuthPayload;
  if (user?.role !== 'teacher') {
    res.status(403).json({ error: 'Nur für Lehrer zugänglich' });
    return;
  }
  next();
}

router.use(authMiddleware);
router.use(teacherOnly);

// ── COURSES CRUD ────────────────────────────────────────────

// Create course
router.post('/courses', (req: Request, res: Response) => {
  const { title, description, difficulty } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: 'Titel und Beschreibung erforderlich' });
    return;
  }
  const id = crypto.randomUUID();
  getDb().prepare(
    'INSERT INTO courses (id, title, description, difficulty) VALUES (?, ?, ?, ?)'
  ).run(id, title, description, difficulty || 'beginner');
  res.status(201).json({ id, title, description, difficulty });
});

// Update course
router.put('/courses/:id', (req: Request, res: Response) => {
  const { title, description, difficulty } = req.body;
  const existing = getDb().prepare('SELECT id FROM courses WHERE id = ?').get(req.params.id);
  if (!existing) { res.status(404).json({ error: 'Kurs nicht gefunden' }); return; }

  getDb().prepare(
    'UPDATE courses SET title = COALESCE(?, title), description = COALESCE(?, description), difficulty = COALESCE(?, difficulty) WHERE id = ?'
  ).run(title || null, description || null, difficulty || null, req.params.id);
  res.json({ success: true });
});

// Delete course
router.delete('/courses/:id', (req: Request, res: Response) => {
  getDb().prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── EXERCISES CRUD ──────────────────────────────────────────

// Create exercise
router.post('/exercises', (req: Request, res: Response) => {
  const { course_id, title, description, template_data, solution_data, instructions, order_index } = req.body;
  if (!course_id || !title) {
    res.status(400).json({ error: 'course_id und title erforderlich' });
    return;
  }

  const course = getDb().prepare('SELECT id FROM courses WHERE id = ?').get(course_id);
  if (!course) { res.status(404).json({ error: 'Kurs nicht gefunden' }); return; }

  const id = crypto.randomUUID();
  const order = order_index ?? (
    (getDb().prepare('SELECT MAX(order_index) as m FROM exercises WHERE course_id = ?').get(course_id) as any)?.m + 1 || 1
  );

  getDb().prepare(
    'INSERT INTO exercises (id, course_id, title, description, template_data, solution_data, instructions, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, course_id, title, description || '', JSON.stringify(template_data || {}), JSON.stringify(solution_data || {}), instructions || '', order);

  res.status(201).json({ id, course_id, title, order_index: order });
});

// Update exercise
router.put('/exercises/:id', (req: Request, res: Response) => {
  const { title, description, template_data, solution_data, instructions, order_index } = req.body;
  const ex = getDb().prepare('SELECT id FROM exercises WHERE id = ?').get(req.params.id);
  if (!ex) { res.status(404).json({ error: 'Übung nicht gefunden' }); return; }

  const updates: string[] = [];
  const params: any[] = [];

  if (title !== undefined) { updates.push('title = ?'); params.push(title); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (template_data !== undefined) { updates.push('template_data = ?'); params.push(JSON.stringify(template_data)); }
  if (solution_data !== undefined) { updates.push('solution_data = ?'); params.push(JSON.stringify(solution_data)); }
  if (instructions !== undefined) { updates.push('instructions = ?'); params.push(instructions); }
  if (order_index !== undefined) { updates.push('order_index = ?'); params.push(order_index); }

  if (updates.length > 0) {
    params.push(req.params.id);
    getDb().prepare(`UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }
  res.json({ success: true });
});

// Delete exercise
router.delete('/exercises/:id', (req: Request, res: Response) => {
  getDb().prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── STUDENT OVERVIEW ────────────────────────────────────────

// Get all students with progress (paginated)
router.get('/students', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  const total = (getDb().prepare(
    'SELECT COUNT(*) as count FROM users WHERE role = ?'
  ).get('student') as { count: number }).count;

  const students = getDb().prepare(`
    SELECT u.id, u.name, u.email, u.created_at,
           COUNT(p.id) as exercises_attempted,
           ROUND(AVG(p.score), 1) as avg_score,
           SUM(CASE WHEN p.completed = 1 THEN 1 ELSE 0 END) as exercises_completed
    FROM users u
    LEFT JOIN progress p ON p.user_id = u.id
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY u.name
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  res.json({ data: students, page, limit, total, totalPages: Math.ceil(total / limit) });
});

// Get single student detail with all exercise results
router.get('/students/:id', (req: Request, res: Response) => {
  const student = getDb().prepare(
    'SELECT id, name, email, created_at FROM users WHERE id = ? AND role = ?'
  ).get(req.params.id, 'student');

  if (!student) { res.status(404).json({ error: 'Student nicht gefunden' }); return; }

  const progress = getDb().prepare(`
    SELECT p.*, e.title as exercise_title, e.course_id, c.title as course_title
    FROM progress p
    JOIN exercises e ON e.id = p.exercise_id
    JOIN courses c ON c.id = e.course_id
    WHERE p.user_id = ?
    ORDER BY p.completed_at DESC
  `).all(req.params.id);

  res.json({ ...student as object, progress });
});

// ── CREATE STUDENT ─────────────────────────────────────────
router.post('/students', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, Email und Passwort sind erforderlich' });
    return;
  }
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'Ein Benutzer mit dieser Email existiert bereits' });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, hash, name, 'student');
  res.status(201).json({ id, name, email });
});

// ── DELETE STUDENT ─────────────────────────────────────────
router.delete('/students/:id', (req: Request, res: Response) => {
  const db = getDb();
  const student = db.prepare('SELECT id FROM users WHERE id = ? AND role = ?').get(req.params.id, 'student');
  if (!student) { res.status(404).json({ error: 'Student nicht gefunden' }); return; }
  // Delete all progress, then delete user
  db.prepare('DELETE FROM progress WHERE user_id = ?').run(req.params.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── ANALYTICS ───────────────────────────────────────────────

// Get aggregated analytics across all students (paginated)
router.get('/analytics', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
  const offset = (page - 1) * limit;

  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as count FROM exercises').get() as { count: number }).count;

  const stats = db.prepare(`
    SELECT e.id, e.title, c.title as course_title,
           COUNT(p.id) as attempts,
           ROUND(AVG(p.score), 1) as avg_score,
           ROUND(SUM(CASE WHEN p.score < 50 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(p.id), 0), 1) as fail_rate
    FROM exercises e
    JOIN courses c ON c.id = e.course_id
    LEFT JOIN progress p ON p.exercise_id = e.id
    GROUP BY e.id
    ORDER BY c.title, e.order_index
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  res.json({ data: stats, page, limit, total, totalPages: Math.ceil(total / limit) });
});

export default router;
