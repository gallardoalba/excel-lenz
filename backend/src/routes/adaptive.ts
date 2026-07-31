import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { authMiddleware, AuthPayload } from '../middleware/auth';
import { sm2Update } from '../utils/spacedRepetition';

const router = Router();
router.use(authMiddleware);

// ── SM-2 Spaced Repetition Algorithm ──────────────────────

interface ReviewCard {
  exercise_id: string;
  exercise_title: string;
  course_title: string;
  ef: number;        // Easiness factor
  interval: number;   // Days until next review
  repetitions: number; // Times reviewed
  next_review: string; // ISO date
  last_score: number;
}

// Get exercises due for review
router.get('/review-due', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  // Get all completed exercises with scores
  const completed = db.prepare(`
    SELECT p.exercise_id, p.score, p.completed_at, e.title as exercise_title, c.title as course_title
    FROM progress p
    JOIN exercises e ON e.id = p.exercise_id
    JOIN courses c ON c.id = e.course_id
    WHERE p.user_id = ? AND p.completed = 1
    ORDER BY p.completed_at ASC
  `).all(userId) as any[];

  // Get existing review data
  const reviews = db.prepare(`
    SELECT * FROM spaced_repetition WHERE user_id = ?
  `).all(userId) as any[];

  const reviewMap = new Map(reviews.map(r => [r.exercise_id, r]));
  const dueCards: ReviewCard[] = [];

  for (const ex of completed) {
    const existing = reviewMap.get(ex.exercise_id);
    if (!existing) {
      // New: schedule for tomorrow
      const quality = ex.score >= 100 ? 5 : ex.score >= 80 ? 4 : ex.score >= 50 ? 3 : 2;
      const result = sm2Update(quality, { ef: 2.5, interval: 0, repetitions: 0 });
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + result.interval);

      db.prepare(`
        INSERT OR REPLACE INTO spaced_repetition (user_id, exercise_id, ef, interval_days, repetitions, next_review, last_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userId, ex.exercise_id, result.ef, result.interval, result.repetitions, nextReview.toISOString(), ex.score);

      if (nextReview.toISOString().split('T')[0] <= today) {
        dueCards.push({
          exercise_id: ex.exercise_id, exercise_title: ex.exercise_title,
          course_title: ex.course_title, ef: result.ef, interval: result.interval,
          repetitions: result.repetitions, next_review: nextReview.toISOString(), last_score: ex.score,
        });
      }
    } else {
      // Check if due
      if (existing.next_review && existing.next_review.split('T')[0] <= today) {
        dueCards.push({
          exercise_id: existing.exercise_id, exercise_title: ex.exercise_title,
          course_title: ex.course_title, ef: existing.ef, interval: existing.interval_days,
          repetitions: existing.repetitions, next_review: existing.next_review, last_score: existing.last_score,
        });
      }
    }
  }

  res.json({ dueCards, total: dueCards.length });
});

// Update review after completing exercise
router.post('/review-complete', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const { exercise_id, score } = req.body;
  if (!exercise_id) { res.status(400).json({ error: 'exercise_id required' }); return; }

  const db = getDb();
  const existing = db.prepare(
    'SELECT * FROM spaced_repetition WHERE user_id = ? AND exercise_id = ?'
  ).get(userId, exercise_id) as any;

  const quality = score >= 100 ? 5 : score >= 80 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : 1;
  const prev = existing
    ? { ef: existing.ef, interval: existing.interval_days, repetitions: existing.repetitions }
    : { ef: 2.5, interval: 0, repetitions: 0 };

  const result = sm2Update(quality, prev);
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + result.interval);

  db.prepare(`
    INSERT OR REPLACE INTO spaced_repetition (user_id, exercise_id, ef, interval_days, repetitions, next_review, last_score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, exercise_id, result.ef, result.interval, result.repetitions, nextReview.toISOString(), score);

  res.json({ interval: result.interval, nextReview: nextReview.toISOString(), repetitions: result.repetitions });
});

// Skill analytics
router.get('/skills', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();

  // Group exercises by course and compute skill levels
  const courses = db.prepare(`
    SELECT c.id, c.title, c.difficulty,
           COUNT(e.id) as total_exercises,
           COUNT(p.id) as completed_exercises,
           ROUND(AVG(p.score), 1) as avg_score
    FROM courses c
    LEFT JOIN exercises e ON e.course_id = c.id
    LEFT JOIN progress p ON p.exercise_id = e.id AND p.user_id = ? AND p.completed = 1
    GROUP BY c.id
  `).all(userId) as any[];

  const skills = courses.map(c => ({
    name: c.title,
    level: Math.round((c.avg_score || 0) / 20), // 0-5 scale
    score: c.avg_score || 0,
    completed: c.completed_exercises,
    total: c.total_exercises,
    difficulty: c.difficulty,
  }));

  // Find weakest skill for recommendation
  const weakest = [...skills].sort((a, b) => a.score - b.score)[0];

  res.json({ skills, weakest, totalSkills: skills.length });
});

export default router;
