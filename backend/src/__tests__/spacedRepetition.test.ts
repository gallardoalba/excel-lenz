// ── Unit tests for SM-2 Spaced Repetition Algorithm ──────────────

import { sm2Update } from '../utils/spacedRepetition';

describe('SM-2 Spaced Repetition Algorithm', () => {
  const fresh = { ef: 2.5, interval: 0, repetitions: 0 };

  it('first review with quality 0 resets to interval 1, reps 0', () => {
    const result = sm2Update(0, fresh);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.ef).toBeLessThan(2.5); // EF should decrease
  });

  it('first review with quality 5 gives interval 1, reps 1', () => {
    const result = sm2Update(5, fresh);
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.ef).toBeGreaterThan(2.5); // EF should increase
  });

  it('second review with quality 5 gives interval 6', () => {
    const first = sm2Update(5, fresh);
    const second = sm2Update(5, first);
    expect(second.repetitions).toBe(2);
    expect(second.interval).toBe(6);
  });

  it('third review with quality 5 multiplies interval by EF', () => {
    const first = sm2Update(5, fresh);
    const second = sm2Update(5, first);
    const third = sm2Update(5, second);
    expect(third.repetitions).toBe(3);
    // interval = round(6 * second.ef), ef should be > 2.5
    expect(third.interval).toBeGreaterThanOrEqual(6 * second.ef - 1);
    expect(third.interval).toBeLessThanOrEqual(6 * second.ef + 1);
  });

  it('quality below 3 resets repetitions', () => {
    const progressed = { ef: 2.6, interval: 15, repetitions: 4 };
    const result = sm2Update(2, progressed);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });

  it('quality exactly 3 maintains repetitions', () => {
    const afterFirst = sm2Update(5, fresh); // reps=1, interval=1
    const result = sm2Update(3, afterFirst);
    expect(result.repetitions).toBe(2);
    expect(result.interval).toBe(6);
  });

  it('EF never goes below 1.3 (minimum cap)', () => {
    // Repeated quality 0 reviews to drive EF down
    let state = fresh;
    for (let i = 0; i < 20; i++) {
      state = sm2Update(0, state);
    }
    expect(state.ef).toBeGreaterThanOrEqual(1.3);
  });

  it('interval is capped at 365 days', () => {
    // Simulate many high-quality reviews to push interval up
    let state = fresh;
    for (let i = 0; i < 30; i++) {
      state = sm2Update(5, state);
    }
    expect(state.interval).toBeLessThanOrEqual(365);
  });

  it('quality 4 with first review gives interval 1', () => {
    const result = sm2Update(4, fresh);
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
  });

  it('quality 5 then 0: resets with decreased EF', () => {
    const first = sm2Update(5, fresh);
    const result = sm2Update(0, first);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.ef).toBeLessThan(first.ef);
  });
});
