import supertest from 'supertest';

describe('Course Routes', () => {
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

    // Register user
    const res = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'coursetest@ex.com', password: 'test1234', name: 'Course Tester' });
    token = res.body.token;
  });

  it('GET /api/courses returns all courses sorted by difficulty', async () => {
    const res = await supertest(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    // Should be sorted: beginner first
    expect(res.body[0].difficulty).toBe('beginner');
  });

  it('GET /api/courses returns exercise_count for each course', async () => {
    const res = await supertest(app).get('/api/courses');
    for (const course of res.body) {
      expect(course).toHaveProperty('exercise_count');
      expect(typeof course.exercise_count).toBe('number');
      expect(course.exercise_count).toBeGreaterThan(0);
    }
  });

  it('GET /api/courses returns a first_exercise_id pointing to a simulator exercise', async () => {
    const res = await supertest(app).get('/api/courses');
    expect(res.status).toBe(200);
    const course = res.body[0]; // Beginner course
    expect(course).toHaveProperty('first_exercise_id');
    expect(typeof course.first_exercise_id).toBe('string');

    // The referenced exercise must exist and be a spreadsheet/simulator (not a quiz)
    const ex = await supertest(app).get(`/api/exercises/${course.first_exercise_id}`);
    expect(ex.status).toBe(200);
    expect(ex.body.template_data.type).not.toBe('quiz');
    expect(Array.isArray(ex.body.template_data.data)).toBe(true);
    expect(Array.isArray(ex.body.template_data.taskCols)).toBe(true);
  });

  it('GET /api/courses/:id returns course with exercises', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;

    const res = await supertest(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('difficulty');
    expect(Array.isArray(res.body.exercises)).toBe(true);
    expect(res.body.exercises.length).toBeGreaterThan(0);
  });

  it('GET /api/courses/:id returns exercise details without template_data', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;

    const res = await supertest(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    const ex = res.body.exercises[0];
    expect(ex).toHaveProperty('id');
    expect(ex).toHaveProperty('title');
    expect(ex).toHaveProperty('description');
    expect(ex).toHaveProperty('order_index');
    // template_data should be stripped (not sent to client in course listing)
    expect(ex).not.toHaveProperty('template_data');
  });

  it('GET /api/courses/:id includes user progress when authenticated', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;

    const res = await supertest(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    const ex = res.body.exercises[0];
    expect(ex).toHaveProperty('user_score');
    expect(ex).toHaveProperty('completed');
    expect(ex.completed).toBe(0); // No submissions yet
  });

  it('GET /api/courses/:id with invalid ID returns 404', async () => {
    const res = await supertest(app).get('/api/courses/nonexistent-id');
    expect(res.status).toBe(404);
  });

  it('GET /api/courses/:id works without auth (guest)', async () => {
    const coursesRes = await supertest(app).get('/api/courses');
    const courseId = coursesRes.body[0].id;

    const res = await supertest(app).get(`/api/courses/${courseId}`);
    expect(res.status).toBe(200);
    // Exercises should not have user_score without auth
    const ex = res.body.exercises[0];
    expect(ex.user_score).toBeUndefined();
  });

  it('GET /api/courses includes user_progress when authenticated', async () => {
    const res = await supertest(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);

    const course = res.body[0];
    expect(course).toHaveProperty('user_progress');
    expect(course.user_progress).toHaveProperty('completed');
    expect(course.user_progress).toHaveProperty('total');
  });
});
