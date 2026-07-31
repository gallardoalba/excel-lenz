import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { getDb } from '../db/database';
import { authMiddleware, AuthPayload } from '../middleware/auth';

const router = Router();

// Middleware: only teachers
function teacherOnly(req: Request, res: Response, next: Function) {
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
  const id = uuid();
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

  const id = uuid();
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

// Get all students with progress
router.get('/students', (_req: Request, res: Response) => {
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
  `).all();
  res.json(students);
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

export default router;
