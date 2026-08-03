import { getDb, initDb } from '../db/database';

describe('Seed Validation', () => {
  beforeAll(() => {
    process.env.DB_PATH = ':memory:';
  });

  beforeEach(() => {
    // Reset DB for each test
    initDb();
  });

  it('seed() does not crash with valid exercise data', () => {
    const { seed } = require('../db/seed');
    expect(() => seed()).not.toThrow();
  });

  it('seed() creates courses and exercises', () => {
    const { seed } = require('../db/seed');
    seed();
    const db = getDb();

    const courseCount = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as any).c;
    const exerciseCount = (db.prepare('SELECT COUNT(*) as c FROM exercises').get() as any).c;

    expect(courseCount).toBeGreaterThanOrEqual(1);
    expect(exerciseCount).toBeGreaterThanOrEqual(1);
  });

  it('seed() creates seed users (teacher + student)', () => {
    const { seed } = require('../db/seed');
    seed();
    const db = getDb();

    const teacher = db.prepare("SELECT * FROM users WHERE email = 'dozent@excel-lenz.edu'").get() as any;
    const student = db.prepare("SELECT * FROM users WHERE email = 'student@excel-lenz.edu'").get() as any;

    expect(teacher).toBeDefined();
    expect(teacher.role).toBe('teacher');
    expect(student).toBeDefined();
    expect(student.role).toBe('student');
  });

  it('seed() creates badges', () => {
    const { seed } = require('../db/seed');
    seed();
    const db = getDb();

    const badgeCount = (db.prepare('SELECT COUNT(*) as c FROM badges').get() as any).c;
    expect(badgeCount).toBeGreaterThanOrEqual(1);
  });

  it('seed() is idempotent — running twice does not duplicate data', () => {
    const { seed } = require('../db/seed');
    seed();
    const db = getDb();
    const firstCount = (db.prepare('SELECT COUNT(*) as c FROM exercises').get() as any).c;

    // Seed again
    seed();
    const secondCount = (db.prepare('SELECT COUNT(*) as c FROM exercises').get() as any).c;

    expect(secondCount).toBe(firstCount);
  });

  it('all seeded exercises have required fields', () => {
    const { seed } = require('../db/seed');
    seed();
    const db = getDb();

    const exercises = db.prepare('SELECT * FROM exercises').all() as any[];
    for (const ex of exercises) {
      expect(ex.title).toBeTruthy();
      expect(ex.description).toBeTruthy();
      expect(ex.instructions).toBeTruthy();
      expect(ex.template_data).toBeTruthy();

      // template_data should be valid JSON
      let template: any;
      expect(() => { template = JSON.parse(ex.template_data); }).not.toThrow();

      // solution_data should be valid JSON
      let solution: any;
      expect(() => { solution = JSON.parse(ex.solution_data); }).not.toThrow();

      const isQuiz = solution.type === 'quiz' || template.type === 'quiz';
      if (isQuiz) {
        // Quiz exercises come in two subtypes:
        //   a) question-based: has `questions` + `answers` arrays
        //   b) grid-based: has `data` + `taskCols` (spreadsheet-style quiz)
        if (Array.isArray(solution.answers)) {
          expect(solution.answers.length).toBeGreaterThan(0);
        }
        if (Array.isArray(template.questions)) {
          expect(template.questions.length).toBeGreaterThan(0);
        }
        // Grid-based quizzes have data/taskCols — validate the grid below
        if (template.data !== undefined) {
          expect(Array.isArray(template.data)).toBe(true);
        }
        // Pure question-based quizzes (no grid) are fully validated above
        if (Array.isArray(template.questions) && !Array.isArray(template.data)) continue;
      }

      // Spreadsheet exercises: template grid + solution grid
      expect(Array.isArray(template.data)).toBe(true);
      expect(template.data.length).toBeGreaterThan(0);
      expect(Array.isArray(solution.data)).toBe(true);
    }
  });

  it('all seeded exercises have order_index', () => {
    const { seed } = require('../db/seed');
    seed();
    const db = getDb();

    const exercises = db.prepare('SELECT * FROM exercises ORDER BY course_id, order_index').all() as any[];
    // Group by course and check ordering
    const courseOrders = new Map<string, number[]>();
    for (const ex of exercises) {
      if (!courseOrders.has(ex.course_id)) courseOrders.set(ex.course_id, []);
      courseOrders.get(ex.course_id)!.push(ex.order_index);
    }

    for (const [courseId, orders] of courseOrders) {
      expect(orders.length).toBeGreaterThan(0);
      // Orders should be non-negative
      for (const o of orders) {
        expect(o).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
