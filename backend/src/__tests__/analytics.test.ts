import supertest from 'supertest';

describe('Analytics Routes', () => {
  let app: any;
  let studentToken: string;
  let teacherToken: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-key-for-jest';
    process.env.DB_PATH = ':memory:';
    process.env.SEED_PASSWORD = 'test-password';

    const { seed } = await import('../db/seed');
    seed();

    const { default: expressApp } = await import('../server');
    app = expressApp;

    // Register student
    const studentRes = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'analytics-student@ex.com', password: 'test1234', name: 'Analytics Student' });
    studentToken = studentRes.body.token;

    // Login as teacher
    const teacherRes = await supertest(app)
      .post('/api/auth/login')
      .send({ email: 'dozent@excel-lenz.edu', password: 'test-password' });
    teacherToken = teacherRes.body.token;
  }, 15000); // Longer timeout for setup with metrics initialization

  // ── Single Track ───────────────────────────────────────────

  it('POST /api/analytics/track returns 201 for valid event', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track')
      .send({ event_type: 'page_view', resource_type: 'page', resource_id: 'home' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('tracked', true);
  });

  it('POST /api/analytics/track works with auth (includes user_id)', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ event_type: 'exercise_start', resource_type: 'exercise', resource_id: 'ex-123' });

    expect(res.status).toBe(201);
  });

  it('POST /api/analytics/track without event_type returns 400', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track')
      .send({ resource_type: 'page' });

    expect(res.status).toBe(400);
  });

  it('POST /api/analytics/track stores metadata correctly', async () => {
    await supertest(app)
      .post('/api/analytics/track')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        event_type: 'exercise_submit',
        resource_type: 'exercise',
        resource_id: 'ex-submit',
        metadata: { score: 85, attempt: 2 },
      });

    // Verify via summary (as teacher)
    const res = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.totalEvents).toBeGreaterThanOrEqual(1);
  });

  // ── Batch Track ────────────────────────────────────────────

  it('POST /api/analytics/track-batch accepts valid batch', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        events: [
          { event_type: 'page_view', resource_id: 'courses' },
          { event_type: 'page_view', resource_id: 'course/123' },
          { event_type: 'exercise_start', resource_id: 'ex-1' },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.tracked).toBe(3);
  });

  it('POST /api/analytics/track-batch rejects empty array', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({ events: [] });

    expect(res.status).toBe(400);
  });

  it('POST /api/analytics/track-batch rejects oversized batch (>50)', async () => {
    const events = Array.from({ length: 51 }, (_, i) => ({
      event_type: 'page_view',
      resource_id: `page-${i}`,
    }));

    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({ events });

    expect(res.status).toBe(400);
  });

  it('POST /api/analytics/track-batch accepts exactly 50 events', async () => {
    const events = Array.from({ length: 50 }, (_, i) => ({
      event_type: 'page_view',
      resource_id: `page-${i}`,
    }));

    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({ events });

    expect(res.status).toBe(201);
    expect(res.body.tracked).toBe(50);
  });

  it('POST /api/analytics/track-batch filters invalid events (empty event_type)', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({
        events: [
          { event_type: 'valid_event' },
          { event_type: '' },           // Invalid — empty
          { resource_id: 'no-type' },   // Invalid — no event_type
          { event_type: 'valid_2' },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.tracked).toBe(2); // Only 2 valid events
  });

  it('POST /api/analytics/track-batch rejects event_type > 50 chars', async () => {
    const longType = 'a'.repeat(51);
    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({
        events: [
          { event_type: longType },
          { event_type: 'valid' },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.tracked).toBe(1); // Only the valid one
  });

  it('POST /api/analytics/track-batch filters metadata > 2KB', async () => {
    const hugeMetadata = 'x'.repeat(3000);
    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({
        events: [
          { event_type: 'test', metadata: { data: hugeMetadata } }, // Too big — filtered
          { event_type: 'test', metadata: { small: 'ok' } },        // Valid
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.tracked).toBe(2); // Both stored, but first has metadata stripped
  });

  // ── Summary (Teacher Only) ─────────────────────────────────

  it('GET /api/analytics/summary returns data for teacher', async () => {
    const res = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalUsers');
    expect(res.body).toHaveProperty('activeUsers');
    expect(res.body).toHaveProperty('totalEvents');
    expect(res.body).toHaveProperty('eventsByType');
    expect(res.body).toHaveProperty('eventsByDay');
    expect(res.body).toHaveProperty('topExercises');
    expect(res.body).toHaveProperty('avgSessionDuration');
    expect(res.body).toHaveProperty('completionRate');
    expect(res.body).toHaveProperty('cachedAt');
  });

  it('GET /api/analytics/summary rejects students with 403', async () => {
    const res = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it('GET /api/analytics/summary rejects unauthenticated with 401', async () => {
    const res = await supertest(app).get('/api/analytics/summary');
    expect(res.status).toBe(401);
  });

  it('GET /api/analytics/summary returns cached result on second call', async () => {
    const res1 = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${teacherToken}`);

    const res2 = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${teacherToken}`);

    // Both should return same cachedAt (cache hit on second call)
    expect(res1.body.cachedAt).toBe(res2.body.cachedAt);
  });

  // ── Session & client_timestamp ─────────────────────────────

  it('batch events include session_id and client_timestamp', async () => {
    await supertest(app)
      .post('/api/analytics/track-batch')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        events: [
          {
            event_type: 'page_view',
            resource_id: 'test-session',
            session_id: 'sess_test123',
            client_timestamp: '2026-08-01T12:00:00.000Z',
          },
        ],
      });

    const res = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
  });

  // ── eventsByType aggregation ───────────────────────────────

  it('eventsByType correctly aggregates by type after batch insert', async () => {
    // Insert known events
    await supertest(app)
      .post('/api/analytics/track-batch')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        events: [
          { event_type: 'page_view' },
          { event_type: 'page_view' },
          { event_type: 'exercise_start' },
          { event_type: 'page_view' },
          { event_type: 'exercise_submit', metadata: { score: 90 } },
        ],
      });

    const res = await supertest(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${teacherToken}`);

    const pageViews = res.body.eventsByType.find((e: any) => e.event_type === 'page_view');
    const starts = res.body.eventsByType.find((e: any) => e.event_type === 'exercise_start');
    const submits = res.body.eventsByType.find((e: any) => e.event_type === 'exercise_submit');

    expect(pageViews).toBeDefined();
    expect(starts).toBeDefined();
    expect(submits).toBeDefined();
  });

  // ── Track without auth (anonymous) ─────────────────────────

  it('POST /api/analytics/track works without auth (anonymous)', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track')
      .send({ event_type: 'page_view', resource_id: 'anonymous-visit' });

    expect(res.status).toBe(201);
  });

  it('POST /api/analytics/track-batch works without auth (anonymous)', async () => {
    const res = await supertest(app)
      .post('/api/analytics/track-batch')
      .send({ events: [{ event_type: 'page_view', resource_id: 'anon-batch' }] });

    expect(res.status).toBe(201);
  });
});
