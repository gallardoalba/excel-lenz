import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { authMiddleware, optionalAuth, AuthPayload } from '../middleware/auth';
import { sm2Update } from '../utils/spacedRepetition';
import { awardXP } from './gamification';
import { v4 as uuid } from 'uuid';

const router = Router();

// Shared answer comparison — used for both scoring and feedback
function isCorrectAnswer(userVal: any, solVal: any): boolean {
  const userNum = userVal !== null && userVal !== undefined && userVal !== '' ? Number(userVal) : null;
  const solNum = solVal !== null && solVal !== undefined && solVal !== '' ? Number(solVal) : null;

  if (userNum !== null && solNum !== null && !isNaN(userNum) && !isNaN(solNum)) {
    return Math.abs(userNum - solNum) < 0.01;
  }
  // String comparison: trim + case-insensitive
  return String(userVal ?? '').trim().toLowerCase() === String(solVal ?? '').trim().toLowerCase();
}

// ── Mastery check: can user access this exercise? ──────────

router.get('/:id/mastery', authMiddleware, (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();

  const exercise = db.prepare('SELECT template_data FROM exercises WHERE id = ?').get(req.params.id) as any;
  if (!exercise) { res.status(404).json({ error: 'Not found' }); return; }

  let prerequisites: string[] = [];
  try { prerequisites = JSON.parse(exercise.template_data || '{}').prerequisites || []; } catch {}

  if (prerequisites.length === 0) {
    res.json({ unlocked: true, prerequisites: [], missing: [] });
    return;
  }

  // Check which prerequisite skills the user has mastered (≥80% on any exercise with that skill tag)
  const missing: string[] = [];
  for (const prereq of prerequisites) {
    const mastered = db.prepare(`
      SELECT 1 FROM progress p
      JOIN exercises e ON e.id = p.exercise_id
      WHERE p.user_id = ? AND p.completed = 1 AND p.score >= 80
      AND e.template_data LIKE ?
      LIMIT 1
    `).get(userId, `%${prereq}%`);
    if (!mastered) missing.push(prereq);
  }

  res.json({ unlocked: missing.length === 0, prerequisites, missing });
});

// Get exercise detail (guest access allowed)
router.get('/:id', optionalAuth, (req: Request, res: Response) => {
  const db = getDb();
  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id) as any;
  if (!exercise) {
    res.status(404).json({ error: 'Übung nicht gefunden' });
    return;
  }

  const userId = (req.user as AuthPayload)?.userId;
  let progress = null;
  if (userId) {
    progress = db.prepare(
      'SELECT * FROM progress WHERE user_id = ? AND exercise_id = ?'
    ).get(userId, req.params.id);
  }

  // Parse JSON fields
  let templateData: any = {};
  try { templateData = JSON.parse(exercise.template_data || '{}'); } catch { /* keep default */ }
  const result = {
    ...exercise,
    template_data: templateData,
    instructions: exercise.instructions,
  };

  // Only send solution to teachers or after completion
  if (req.user && (req.user as AuthPayload).role === 'teacher') {
    (result as any).solution_data = JSON.parse(exercise.solution_data || '{}');
  }

  (result as any).progress = progress || null;
  res.json(result);
});

// Submit exercise solution
router.post('/:id/submit', authMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const { userId } = req.user as AuthPayload;
  const { data } = req.body;

  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id) as any;
  if (!exercise) {
    res.status(404).json({ error: 'Übung nicht gefunden' });
    return;
  }

  // Calculate score by comparing with solution (handle both numbers and strings)
  const solution = JSON.parse(exercise.solution_data || '{}');
  let score = 0;

  // Validate input structure
  if (!Array.isArray(data)) {
    res.status(400).json({ error: 'Ungültiges Datenformat' });
    return;
  }

  if (solution.data && data) {
    const taskCols = JSON.parse(exercise.template_data || '{}').taskCols || [];
    const totalCells = solution.data.length * taskCols.length;
    let correctCells = 0;

    for (const taskCol of taskCols) {
      for (let row = 0; row < solution.data.length; row++) {
        const userVal = data[row]?.[taskCol];
        const solVal = solution.data[row]?.[taskCol];

        if (isCorrectAnswer(userVal, solVal)) correctCells++;
      }
    }
    score = totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
  }

  const existing = db.prepare(
    'SELECT id FROM progress WHERE user_id = ? AND exercise_id = ?'
  ).get(userId, req.params.id);

  if (existing) {
    db.prepare(
      `UPDATE progress SET submitted_data = ?, score = ?, completed = 1, completed_at = datetime('now')
       WHERE user_id = ? AND exercise_id = ?`
    ).run(JSON.stringify(data), score, userId, req.params.id);
  } else {
    db.prepare(
      `INSERT INTO progress (id, user_id, exercise_id, submitted_data, score, completed, completed_at)
       VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`
    ).run(uuid(), userId, req.params.id, JSON.stringify(data), score);
  }

  // Award gamification XP — return actual XP gained
  let xpGained = 0;
  try { xpGained = awardXP(userId, score); } catch { xpGained = 50; }

  // Update spaced repetition (SM-2 algorithm)
  const quality = score >= 100 ? 5 : score >= 80 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : 1;
  const existingSr = db.prepare(
    'SELECT * FROM spaced_repetition WHERE user_id = ? AND exercise_id = ?'
  ).get(userId, req.params.id) as any;
  const prevSr = existingSr
    ? { ef: existingSr.ef, interval: existingSr.interval_days, repetitions: existingSr.repetitions }
    : { ef: 2.5, interval: 0, repetitions: 0 };
  const srResult = sm2Update(quality, prevSr);
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + srResult.interval);
  db.prepare(`
    INSERT OR REPLACE INTO spaced_repetition (user_id, exercise_id, ef, interval_days, repetitions, next_review, last_score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, req.params.id, srResult.ef, srResult.interval, srResult.repetitions, nextReview.toISOString(), score);

  // Build cell-level feedback (use same comparison as scoring)
  const details: { row: number; col: number; expected: any; got: any }[] = [];
  if (solution.data && data && score < 100) {
    const taskCols = JSON.parse(exercise.template_data || '{}').taskCols || [];
    for (const taskCol of taskCols) {
      for (let row = 0; row < solution.data.length; row++) {
        const userVal = data[row]?.[taskCol];
        const solVal = solution.data[row]?.[taskCol];
        if (!isCorrectAnswer(userVal, solVal)) {
          details.push({ row, col: taskCol, expected: solVal, got: userVal ?? null });
        }
      }
    }
  }

  // Calculate correct/total for frontend display
  let correctCells = 0;
  let totalCells = 0;
  if (solution.data) {
    const taskCols = JSON.parse(exercise.template_data || '{}').taskCols || [];
    totalCells = solution.data.length * taskCols.length;
    for (const taskCol of taskCols) {
      for (let row = 0; row < solution.data.length; row++) {
        if (isCorrectAnswer(data[row]?.[taskCol], solution.data[row]?.[taskCol])) correctCells++;
      }
    }
  }

  res.json({ score, completed: true, details, xpGained, correctCells, totalCells });
});

// Get user progress across all exercises
router.get('/user/progress', authMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const { userId } = req.user as AuthPayload;
  const progress = db.prepare(
    `SELECT p.*, e.title as exercise_title, e.course_id, c.title as course_title
     FROM progress p
     JOIN exercises e ON e.id = p.exercise_id
     JOIN courses c ON c.id = e.course_id
     WHERE p.user_id = ?
     ORDER BY p.completed_at DESC`
  ).all(userId);
  res.json(progress);
});

// Get last unfinished exercise (for "Continue where you left off")
router.get('/user/last-exercise', authMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const { userId } = req.user as AuthPayload;

  // First: find exercises the user started but didn't complete
  const started = db.prepare(`
    SELECT e.id, e.title, e.course_id, c.title as course_title, p.score
    FROM progress p
    JOIN exercises e ON e.id = p.exercise_id
    JOIN courses c ON c.id = e.course_id
    WHERE p.user_id = ? AND p.completed = 0
    ORDER BY p.created_at DESC LIMIT 1
  `).get(userId);

  if (started) { res.json(started); return; }

  // Second: find incomplete exercises in the user's active courses
  const next = db.prepare(`
    SELECT e.id, e.title, e.course_id, c.title as course_title
    FROM exercises e
    JOIN courses c ON c.id = e.course_id
    WHERE e.id NOT IN (
      SELECT exercise_id FROM progress WHERE user_id = ? AND completed = 1
    )
    ORDER BY e.order_index LIMIT 1
  `).get(userId);

  if (next) { res.json(next); return; }

  // Third: suggest repeating the first exercise
  const review = db.prepare(`
    SELECT e.id, e.title, e.course_id, c.title as course_title
    FROM exercises e
    JOIN courses c ON c.id = e.course_id
    ORDER BY e.order_index LIMIT 1
  `).get();

  res.json(review || null);
});

export default router;
