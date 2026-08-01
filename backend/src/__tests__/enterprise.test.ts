import supertest from 'supertest';

describe('Enterprise Routes', () => {
  let app: any;
  let token: string;
  let courseId: string;

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
      .send({ email: 'enterprisetest@ex.com', password: 'test1234', name: 'Enterprise Tester' });
    token = res.body.token;

    const coursesRes = await supertest(app).get('/api/courses');
    courseId = coursesRes.body[0].id;
  });

  // ── Pricing (public) ────────────────────────────────────────

  it('GET /api/enterprise/pricing returns tiers without auth', async () => {
    const res = await supertest(app).get('/api/enterprise/pricing');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tiers');
    expect(res.body.tiers).toHaveProperty('free');
    expect(res.body.tiers).toHaveProperty('pro');
    expect(res.body.tiers).toHaveProperty('team');
    expect(res.body.tiers.free).toHaveProperty('price', 0);
    expect(res.body.tiers.pro).toHaveProperty('price', 999);
  });

  it('GET /api/enterprise/pricing has correct tier features', async () => {
    const res = await supertest(app).get('/api/enterprise/pricing');

    expect(res.body.tiers.free.features).toContain('Basis-Übungen');
    expect(res.body.tiers.pro.features).toContain('Zertifikate');
    expect(res.body.tiers.team.features).toContain('Admin-Panel');
  });

  // ── Subscription ────────────────────────────────────────────

  it('GET /api/enterprise/subscription returns free tier by default', async () => {
    const res = await supertest(app)
      .get('/api/enterprise/subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('subscription');
    expect(res.body).toHaveProperty('tier');
    expect(res.body.tier).toHaveProperty('name', 'Free');
  });

  it('POST /api/enterprise/subscribe upgrades to pro', async () => {
    const res = await supertest(app)
      .post('/api/enterprise/subscribe')
      .set('Authorization', `Bearer ${token}`)
      .send({ tier: 'pro' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('tier', 'pro');
  });

  it('GET subscription reflects upgrade', async () => {
    const res = await supertest(app)
      .get('/api/enterprise/subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.tier).toHaveProperty('name', 'Pro');
  });

  it('POST /api/enterprise/subscribe with invalid tier returns 400', async () => {
    const res = await supertest(app)
      .post('/api/enterprise/subscribe')
      .set('Authorization', `Bearer ${token}`)
      .send({ tier: 'nonexistent' });

    expect(res.status).toBe(400);
  });

  // ── Checkout ─────────────────────────────────────────────────

  it('POST /api/enterprise/create-checkout returns session', async () => {
    const res = await supertest(app)
      .post('/api/enterprise/create-checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ tier: 'team' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('checkoutUrl');
    expect(res.body).toHaveProperty('sessionId');
  });

  it('POST /api/enterprise/create-checkout with free tier returns 400', async () => {
    const res = await supertest(app)
      .post('/api/enterprise/create-checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ tier: 'free' });

    expect(res.status).toBe(400);
  });

  // ── SCORM Export ────────────────────────────────────────────

  it('GET /api/enterprise/export/scorm/:courseId returns SCORM package', async () => {
    const res = await supertest(app)
      .get(`/api/enterprise/export/scorm/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('manifest');
    expect(res.body).toHaveProperty('exercises');
    expect(res.body).toHaveProperty('format', 'SCORM 1.2');
  });

  it('GET /api/enterprise/export/scorm/:courseId non-existent returns 404', async () => {
    const res = await supertest(app)
      .get('/api/enterprise/export/scorm/nonexistent')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  // ── API Keys (Pro/Team only) ──────────────────────────────

  it('GET /api/enterprise/api-keys returns 403 for free tier', async () => {
    // Register a fresh user who is still on free tier
    const freeRes = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'free-tier-test@ex.com', password: 'test1234', name: 'FreeUser' });
    const freeToken = freeRes.body.token;

    const res = await supertest(app)
      .get('/api/enterprise/api-keys')
      .set('Authorization', `Bearer ${freeToken}`);

    expect(res.status).toBe(403);
  });

  it('POST /api/enterprise/api-keys returns 403 for free tier', async () => {
    const freeRes = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'free-tier2@ex.com', password: 'test1234', name: 'FreeUser2' });
    const freeToken = freeRes.body.token;

    const res = await supertest(app)
      .post('/api/enterprise/api-keys')
      .set('Authorization', `Bearer ${freeToken}`)
      .send({ name: 'My Key' });

    expect(res.status).toBe(403);
  });

  it('API keys work after upgrading to pro', async () => {
    // Token is already pro from previous subscription tests
    const createRes = await supertest(app)
      .post('/api/enterprise/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Key' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('key');
    expect(createRes.body.key).toMatch(/^ex_/);

    // List API keys
    const listRes = await supertest(app)
      .get('/api/enterprise/api-keys')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);
    expect(listRes.body[0]).toHaveProperty('name', 'Test Key');
  });

  it('POST /api/enterprise/api-keys without name returns 400', async () => {
    const res = await supertest(app)
      .post('/api/enterprise/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  // ── Auth required ────────────────────────────────────────────

  it('GET /api/enterprise/subscription without auth returns 401', async () => {
    const res = await supertest(app).get('/api/enterprise/subscription');
    expect(res.status).toBe(401);
  });
});
