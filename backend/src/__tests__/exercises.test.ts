import supertest from 'supertest';

describe('Exercise Routes', () => {
  let app: any;
  let token: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-key-for-jest';
    process.env.DB_PATH = ':memory:';
    process.env.SEED_PASSWORD = 'test-password';

    // Seed DB first, then import server
    const { seed } = await import('../db/seed');
    seed();

    const { default: expressApp } = await import('../server');
    app = expressApp;

    // Register user for authenticated requests
    const res = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'test@ex.com', password: 'test1234', name: 'Tester' });
    token = res.body.token;
  });

  it('GET /api/courses returns course list', async () => {
    const res = await supertest(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('exercise_count');
  });

  it('GET /api/exercises/:id returns exercise with template', async () => {
    // Get a valid exercise ID from courses endpoint
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;

    const res = await supertest(app).get(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('template_data');
    expect(res.body.template_data).toHaveProperty('taskCols');
    expect(res.body).toHaveProperty('instructions');
  });

  it('POST /api/exercises/:id/submit returns score and feedback', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;
    const exRes = await supertest(app).get(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${token}`);
    const template = exRes.body.template_data;

    // Submit the correct solution (use template_data.solution if available, or compute)
    const res = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: template.data.map((row: any[]) => row.map((cell: any) => cell === null ? '' : cell)) });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('correctCells');
    expect(res.body).toHaveProperty('totalCells');
  });

  it('POST submit with empty data returns 200 (score 0)', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;

    const res = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: [] });

    expect(res.status).toBe(200);
    expect(res.body.score).toBe(0);
  });

  it('POST submit without auth returns 401', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;

    const res = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .send({ data: [['test']] });

    expect(res.status).toBe(401);
  });

  // ── XP Re-submission Bug Fix Tests ──────────────────────

  it('XP is awarded on first submission (new exercise)', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    // Pick a different exercise to avoid conflicts
    const exercises = courseRes.body.exercises;
    const exerciseId = exercises.length > 1 ? exercises[1].id : exercises[0].id;
    const exRes = await supertest(app).get(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${token}`);
    const template = exRes.body.template_data;

    const res = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: template.data });

    expect(res.status).toBe(200);
    // First submission with correct answer should give XP > 0
    expect(res.body.xpGained).toBeGreaterThan(0);
  });

  it('Re-submission with improved score awards XP for improvement', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    // Use the first exercise (known to have matching template/solution)
    const exerciseId = courseRes.body.exercises[0].id;
    const exRes = await supertest(app).get(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${token}`);
    const template = exRes.body.template_data;

    // First submit: empty/wrong answer (score 0)
    const emptyData = template.data.map((row: any[]) => row.map(() => ''));
    const firstRes = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: emptyData });

    expect(firstRes.body.score).toBeLessThan(100);

    // Second submit: correct answer — should award XP for improvement
    const secondRes = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: template.data });

    expect(secondRes.status).toBe(200);
    // Improvement from low score → high score should give XP > 0
    expect(secondRes.body.xpGained).toBeGreaterThan(0);
  });

  it('Re-submission with same score does not award full XP', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app).get(`/api/courses/${courseId}`).set('Authorization', `Bearer ${token}`);
    const exercises = courseRes.body.exercises;
    const exerciseId = exercises.length > 3 ? exercises[3].id : exercises[0].id;
    const exRes = await supertest(app).get(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${token}`);
    const template = exRes.body.template_data;

    // Submit correct answer twice
    await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: template.data });

    const secondRes = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: template.data });

    // Second submission with same perfect score should give ≤ 10 XP (review bonus only)
    expect(secondRes.body.xpGained).toBeLessThanOrEqual(10);
  });

  // ── New Endpoints Tests ─────────────────────────────────

  it('GET /api/exercises/user/last-exercise returns last exercise', async () => {
    const res = await supertest(app)
      .get('/api/exercises/user/last-exercise')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // Should return either null or an object with id/title
    if (res.body !== null) {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
    }
  });

  it('GET /api/exercises/user/progress returns progress list', async () => {
    const res = await supertest(app)
      .get('/api/exercises/user/progress')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('exercise_title');
      expect(res.body[0]).toHaveProperty('course_title');
      expect(res.body[0]).toHaveProperty('score');
    }
  });

  it('GET /api/exercises/user/last-exercise without auth returns 401', async () => {
    const res = await supertest(app).get('/api/exercises/user/last-exercise');
    expect(res.status).toBe(401);
  });

  it('GET /api/exercises/user/progress without auth returns 401', async () => {
    const res = await supertest(app).get('/api/exercises/user/progress');
    expect(res.status).toBe(401);
  });

  it('GET /api/exercises/:id/mastery returns unlocked status', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseRes = await supertest(app).get(`/api/courses/${coursesRes.body[0].id}`).set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;

    const res = await supertest(app)
      .get(`/api/exercises/${exerciseId}/mastery`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('unlocked');
    expect(res.body).toHaveProperty('prerequisites');
    expect(res.body).toHaveProperty('missing');
  });

  it('POST submit with invalid (non-array) data returns 400', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseRes = await supertest(app).get(`/api/courses/${coursesRes.body[0].id}`).set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;

    const res = await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: 'not-an-array' });

    expect(res.status).toBe(400);
  });

  it('Non-existent exercise returns 404', async () => {
    const res = await supertest(app)
      .get('/api/exercises/nonexistent-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
