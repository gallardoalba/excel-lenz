// ── SM-2 Spaced Repetition Algorithm ──────────────────────

/**
 * SM-2 algorithm for spaced repetition.
 * @param quality - User's self-assessed quality (0-5), where 0=worst, 5=best
 * @param prev - Previous review state { ef, interval, repetitions }
 * @returns Updated review state
 */
export function sm2Update(
  quality: number,
  prev: { ef: number; interval: number; repetitions: number }
): { ef: number; interval: number; repetitions: number } {
  let { ef, interval, repetitions } = prev;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * ef);
  }

  ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  // Cap interval at 365 days to prevent unbounded growth
  if (interval > 365) interval = 365;

  return { ef, interval, repetitions };
}
