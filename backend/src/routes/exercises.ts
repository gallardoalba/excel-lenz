import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { authMiddleware, optionalAuth, AuthPayload } from '../middleware/auth';
import { sm2Update } from '../utils/spacedRepetition';
import { awardXP } from './gamification';
import { goalSeek } from '../utils/goalSeek';
import crypto from 'node:crypto';

const router = Router();

// Shared answer comparison — used for both scoring and feedback
function isCorrectAnswer(userVal: any, solVal: any): boolean {
  // Normalize null/undefined to empty string for consistent comparison
  const u = userVal ?? '';
  const s = solVal ?? '';
  const userNum = u !== '' ? Number(u) : null;
  const solNum = s !== '' ? Number(s) : null;

  if (userNum !== null && solNum !== null && !isNaN(userNum) && !isNaN(solNum)) {
    return Math.abs(userNum - solNum) < 0.01;
  }
  return String(u).trim().toLowerCase() === String(s).trim().toLowerCase();
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
  // Fetch all completed exercise template_data and parse JSON properly
  const completedExercises = db.prepare(`
    SELECT e.template_data, p.score FROM progress p
    JOIN exercises e ON e.id = p.exercise_id
    WHERE p.user_id = ? AND p.completed = 1 AND p.score >= 80
  `).all(userId) as any[];

  const missing: string[] = [];
  for (const prereq of prerequisites) {
    const mastered = completedExercises.some(row => {
      try {
        const tmpl = JSON.parse(row.template_data || '{}');
        const tags: string[] = tmpl.prerequisites || [];
        return tags.includes(prereq);
      } catch { return false; }
    });
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
  const { data, type, answers, formats } = req.body;

  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id) as any;
  if (!exercise) {
    res.status(404).json({ error: 'Übung nicht gefunden' });
    return;
  }

  // ── Quiz scoring ─────────────────────────────────────────
  let score = 0;
  let correctCells = 0;
  let totalCells = 0;
  const details: { row: number; col: number; expected: any; got: any }[] = [];
  const solution = JSON.parse(exercise.solution_data || '{}');

  if (type === 'quiz' && answers && solution.type === 'quiz') {
    const userAnswers: number[][] = answers;
    const correctAnswers: number[][] = solution.answers || [];
    for (let i = 0; i < correctAnswers.length; i++) {
      const ua = userAnswers[i] || [];
      const ca = correctAnswers[i] || [];
      if (ua.length === ca.length && ua.every((x: number) => ca.includes(x)) && ca.every((x: number) => ua.includes(x))) {
        correctCells++;
      }
    }
    totalCells = correctAnswers.length;
    score = totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
  } else {
    // ── Spreadsheet scoring ──────────────────────────────────
    if (!Array.isArray(data)) {
      res.status(400).json({ error: 'Ungültiges Datenformat' });
      return;
    }
    const taskCols: number[] = JSON.parse(exercise.template_data || '{}').taskCols || [];

    if (solution.data && data) {
      totalCells = solution.data.length * taskCols.length;

      for (const taskCol of taskCols) {
        for (let row = 0; row < solution.data.length; row++) {
          const userVal = data[row]?.[taskCol];
          const solVal = solution.data[row]?.[taskCol];

          if (isCorrectAnswer(userVal, solVal)) {
            correctCells++;
          } else {
            details.push({ row, col: taskCol, expected: solVal, got: userVal ?? null });
          }
        }
      }
      score = totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
    }

    // ── Format scoring (optional, additive) ─────────────────
    const templateData = JSON.parse(exercise.template_data || '{}');
    const formatSolution: Record<string, Record<string, unknown>> = templateData.formatSolution || {};
    const userFormats: Record<string, Record<string, unknown>> = formats || {};
    const formatKeys = Object.keys(formatSolution);

    if (formatKeys.length > 0) {
      let formatCorrect = 0;
      for (const key of formatKeys) {
        const expected = formatSolution[key];
        const actual = userFormats[key] || {};
        let match = true;
        for (const field of Object.keys(expected)) {
          if (actual[field] !== expected[field]) {
            match = false;
            break;
          }
        }
        if (match) formatCorrect++;
      }
      // Blend value score and format score (70% values, 30% formatting when both present)
      if (totalCells > 0) {
        const valueScore = correctCells / totalCells;
        const formatScore = formatCorrect / formatKeys.length;
        score = Math.round((valueScore * 0.7 + formatScore * 0.3) * 100);
        correctCells = Math.round(valueScore * totalCells + formatScore * formatKeys.length);
        totalCells = totalCells + formatKeys.length;
      } else {
        // Pure format scoring (no value cells to check)
        correctCells = formatCorrect;
        totalCells = formatKeys.length;
        score = totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
      }
    }
  }

  // ── Persist progress (query prevScore BEFORE update!) ───
  const prevProgress = db.prepare(
    'SELECT id, score FROM progress WHERE user_id = ? AND exercise_id = ?'
  ).get(userId, req.params.id) as { id: string; score: number } | undefined;

  if (prevProgress) {
    db.prepare(
      `UPDATE progress SET submitted_data = ?, score = ?, completed = 1, completed_at = datetime('now')
       WHERE user_id = ? AND exercise_id = ?`
    ).run(JSON.stringify(data), score, userId, req.params.id);
  } else {
    db.prepare(
      `INSERT INTO progress (id, user_id, exercise_id, submitted_data, score, completed, completed_at)
       VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`
    ).run(crypto.randomUUID(), userId, req.params.id, JSON.stringify(data), score);
  }

  // ── XP award based on previous best score ───────────────
  let xpGained = 0;
  try {
    const prevScore = prevProgress?.score ?? null;
    if (prevScore === 100 && score === 100) {
      xpGained = 10; // Small review bonus, no more farming
    } else if (prevScore == null || score > prevScore) {
      xpGained = awardXP(userId, score);
    } else {
      xpGained = 0; // No improvement, no XP
    }
  } catch { xpGained = 0; }

  // ── Update spaced repetition (SM-2) ─────────────────────
  const quality = score >= 100 ? 5 : score >= 80 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : score > 0 ? 1 : 0;
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

  res.json({ score, completed: true, details, xpGained, correctCells, totalCells });
});

// Get last exercise the user was working on (for "Weitermachen" button)
router.get('/user/last-exercise', authMiddleware, (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();
  const last = db.prepare(`
    SELECT e.id, e.title FROM progress p
    JOIN exercises e ON e.id = p.exercise_id
    WHERE p.user_id = ?
    ORDER BY p.completed_at DESC
    LIMIT 1
  `).get(userId) as { id: string; title: string } | undefined;
  res.json(last || null);
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

// ── Goal Seek endpoint ─────────────────────────────────────
// POST /api/exercises/goal-seek
// Body: { data, formulaRow, formulaCol, inputRow, inputCol, targetValue }
router.post('/goal-seek', authMiddleware, async (req: Request, res: Response) => {
  const { data, formulaRow, formulaCol, inputRow, inputCol, targetValue } = req.body;

  if (!Array.isArray(data)) {
    res.status(400).json({ error: 'data must be a 2D array' });
    return;
  }

  try {
    // Create a lightweight HyperFormula instance for this calculation
    const { HyperFormula } = await import('hyperformula');
    // @ts-ignore - i18n path not in TS declarations
    const deDE = require('hyperformula/i18n/languages/deDE').default;
    try { HyperFormula.registerLanguage('deDE', deDE); } catch { /* already registered */ }
    const hf = HyperFormula.buildEmpty({
      licenseKey: 'gpl-v3',
      language: 'deDE',
      functionArgSeparator: ';',
      decimalSeparator: ',',
    });
    hf.addSheet('Sheet1');
    // Set cell contents via API (buildFromArray doesn't handle formulas with DE locale)
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < (data[r]?.length || 0); c++) {
        const val = data[r][c];
        if (val !== null && val !== undefined && val !== '') {
          hf.setCellContents({ sheet: 0, col: c, row: r }, [[val]]);
        }
      }
    }

    const result = goalSeek({
      data,
      hf,
      formulaRow: Number(formulaRow),
      formulaCol: Number(formulaCol),
      inputRow: Number(inputRow),
      inputCol: Number(inputCol),
      targetValue: Number(targetValue),
    });

    res.json(result);
  } catch (err: any) {
    res.status(422).json({ error: err.message || 'Goal Seek failed' });
  }
});
