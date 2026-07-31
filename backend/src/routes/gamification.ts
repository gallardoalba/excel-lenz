import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { authMiddleware, AuthPayload } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// XP per action
const XP_PER_EXERCISE = 50;
const XP_BONUS_PERFECT = 25; // bonus for 100% score
const XP_BONUS_STREAK_7 = 100; // 7-day streak bonus

// Get user gamification stats
router.get('/stats', (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();

  // Ensure user has XP row
  db.prepare('INSERT OR IGNORE INTO user_xp (user_id) VALUES (?)').run(userId);

  const xp = db.prepare('SELECT * FROM user_xp WHERE user_id = ?').get(userId);
  const badges = db.prepare(`
    SELECT b.*, ub.earned_at FROM user_badges ub
    JOIN badges b ON b.id = ub.badge_id
    WHERE ub.user_id = ?
    ORDER BY ub.earned_at DESC
  `).all(userId);

  const totalCompleted = (db.prepare(
    'SELECT COUNT(*) as c FROM progress WHERE user_id = ? AND completed = 1'
  ).get(userId) as any).c;

  res.json({ xp, badges, totalCompleted });
});

// Get leaderboard
router.get('/leaderboard', (_req: Request, res: Response) => {
  const db = getDb();
  const leaders = db.prepare(`
    SELECT u.name, ux.total_xp, ux.level, ux.streak_days
    FROM user_xp ux
    JOIN users u ON u.id = ux.user_id
    ORDER BY ux.total_xp DESC
    LIMIT 20
  `).all();
  res.json(leaders);
});

// Award XP (called internally after exercise submission)
// Returns the actual XP gained
export function awardXP(userId: string, score: number): number {
  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO user_xp (user_id) VALUES (?)').run(userId);

  let xp = XP_PER_EXERCISE;
  if (score >= 100) xp += XP_BONUS_PERFECT;

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const ux = db.prepare('SELECT * FROM user_xp WHERE user_id = ?').get(userId) as any;
  let streak = ux?.streak_days || 0;

  if (ux?.last_activity_date) {
    const lastDate = new Date(ux.last_activity_date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (ux.last_activity_date === today) {
      // Already active today, no streak change
    } else if (ux.last_activity_date === yesterday.toISOString().split('T')[0]) {
      streak += 1;
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  if (streak === 7) xp += XP_BONUS_STREAK_7;

  const newLevel = Math.floor(Math.sqrt((ux?.total_xp || 0) + xp) / 10) + 1;

  db.prepare(`
    UPDATE user_xp SET total_xp = total_xp + ?, level = ?, streak_days = ?, last_activity_date = ?
    WHERE user_id = ?
  `).run(xp, newLevel, streak, today, userId);

  // Check badges
  const totalCompleted = (db.prepare(
    'SELECT COUNT(*) as c FROM progress WHERE user_id = ? AND completed = 1'
  ).get(userId) as any).c;

  const badges = db.prepare('SELECT * FROM badges').all() as any[];
  for (const badge of badges) {
    const earned = db.prepare('SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ?').get(userId, badge.id);
    if (earned) continue;

    let award = false;
    switch (badge.criteria_type) {
      case 'exercises': award = totalCompleted >= badge.criteria_value; break;
      case 'streak': award = streak >= badge.criteria_value; break;
      case 'level': award = newLevel >= badge.criteria_value; break;
      case 'perfect': award = score >= 100 && totalCompleted >= badge.criteria_value; break;
    }

    if (award) {
      db.prepare('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(userId, badge.id);
    }
  }

  return xp;
}

export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 3;
  if (streak >= 7) return 2;
  return 1;
}

export default router;
