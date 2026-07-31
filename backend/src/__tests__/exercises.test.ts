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
});
