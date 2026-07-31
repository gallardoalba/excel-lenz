import supertest from 'supertest';

describe('Gamification Routes', () => {
  let app: any;
  let token: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-key-for-jest';
    process.env.DB_PATH = ':memory:';
    process.env.SEED_PASSWORD = 'test-password';

    const { seed } = await import('../db/seed');
    seed();

    const { default: expressApp } = await import('../server');
    app = expressApp;

    const res = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'gamitest@ex.com', password: 'test1234', name: 'Gami Tester' });
    token = res.body.token;
  });

  it('GET /api/gamification/stats returns stats for new user', async () => {
    const res = await supertest(app)
      .get('/api/gamification/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('xp');
    expect(res.body.xp).toHaveProperty('total_xp');
    expect(res.body.xp).toHaveProperty('level');
    expect(res.body.xp).toHaveProperty('streak_days');
    expect(res.body).toHaveProperty('badges');
    expect(Array.isArray(res.body.badges)).toBe(true);
    expect(res.body).toHaveProperty('totalCompleted');
  });

  it('GET /api/gamification/stats without auth returns 401', async () => {
    const res = await supertest(app).get('/api/gamification/stats');
    expect(res.status).toBe(401);
  });

  it('GET /api/gamification/leaderboard returns top users', async () => {
    const res = await supertest(app)
      .get('/api/gamification/leaderboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('total_xp');
      expect(res.body[0]).toHaveProperty('level');
    }
  });

  it('XP increases after completing an exercise', async () => {
    // Get initial stats
    const initial = await supertest(app)
      .get('/api/gamification/stats')
      .set('Authorization', `Bearer ${token}`);
    const initialXp = initial.body.xp.total_xp;

    // Submit an exercise
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;
    const courseRes = await supertest(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);
    const exerciseId = courseRes.body.exercises[0].id;
    const exRes = await supertest(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`);
    const template = exRes.body.template_data;

    await supertest(app)
      .post(`/api/exercises/${exerciseId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: template.data });

    // Get updated stats
    const updated = await supertest(app)
      .get('/api/gamification/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(updated.body.xp.total_xp).toBeGreaterThan(initialXp);
  });

  it('leaderboard includes the test user after XP gain', async () => {
    const res = await supertest(app)
      .get('/api/gamification/leaderboard')
      .set('Authorization', `Bearer ${token}`);

    const found = res.body.some((entry: any) => entry.name === 'Gami Tester');
    expect(found).toBe(true);
  });

  it('streak_days is at least 1 after first activity', async () => {
    const res = await supertest(app)
      .get('/api/gamification/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.xp.streak_days).toBeGreaterThanOrEqual(1);
  });
});
