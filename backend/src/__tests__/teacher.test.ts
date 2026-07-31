import supertest from 'supertest';

describe('Teacher Routes', () => {
  let app: any;
  let teacherToken: string;
  let studentToken: string;
  let courseId: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-key-for-jest';
    process.env.DB_PATH = ':memory:';
    process.env.SEED_PASSWORD = 'test-password';

    const { seed } = await import('../db/seed');
    seed();

    const { default: expressApp } = await import('../server');
    app = expressApp;

    // Login as the seeded teacher
    const teacherRes = await supertest(app)
      .post('/api/auth/login')
      .send({ email: 'dozent@excel-lenz.edu', password: 'test-password' });
    teacherToken = teacherRes.body.token;

    // Register a student for testing
    const studentRes = await supertest(app)
      .post('/api/auth/register')
      .send({ email: 'student1@ex.com', password: 'test1234', name: 'Test Student' });
    studentToken = studentRes.body.token;

    // Get a course ID for testing
    const coursesRes = await supertest(app).get('/api/courses');
    courseId = coursesRes.body[0].id;
  });

  // ── Authorization ──────────────────────────────────────────

  it('Teacher routes reject students with 403', async () => {
    const res = await supertest(app)
      .get('/api/teacher/students')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

  it('Teacher routes reject unauthenticated with 401', async () => {
    const res = await supertest(app).get('/api/teacher/students');
    expect(res.status).toBe(401);
  });

  // ── COURSES CRUD ────────────────────────────────────────────

  it('POST /api/teacher/courses creates a new course', async () => {
    const res = await supertest(app)
      .post('/api/teacher/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Test Course', description: 'A test course', difficulty: 'intermediate' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'Test Course');
    expect(res.body).toHaveProperty('difficulty', 'intermediate');
  });

  it('POST /api/teacher/courses without title returns 400', async () => {
    const res = await supertest(app)
      .post('/api/teacher/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ description: 'Missing title' });

    expect(res.status).toBe(400);
  });

  it('PUT /api/teacher/courses/:id updates a course', async () => {
    // Create a course first
    const createRes = await supertest(app)
      .post('/api/teacher/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Update Test', description: 'To be updated', difficulty: 'beginner' });

    const res = await supertest(app)
      .put(`/api/teacher/courses/${createRes.body.id}`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Updated Title', difficulty: 'advanced' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('PUT /api/teacher/courses/:id non-existent returns 404', async () => {
    const res = await supertest(app)
      .put('/api/teacher/courses/nonexistent')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Nope' });

    expect(res.status).toBe(404);
  });

  it('DELETE /api/teacher/courses/:id deletes a course', async () => {
    const createRes = await supertest(app)
      .post('/api/teacher/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Delete Me', description: 'Temporary course' });

    const res = await supertest(app)
      .delete(`/api/teacher/courses/${createRes.body.id}`)
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  // ── EXERCISES CRUD ──────────────────────────────────────────

  it('POST /api/teacher/exercises creates a new exercise', async () => {
    const res = await supertest(app)
      .post('/api/teacher/exercises')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        course_id: courseId,
        title: 'Teacher Test Exercise',
        description: 'Created by teacher',
        template_data: { cols: 3, rows: 2, data: [['a', 'b', 'c']], taskCols: [0] },
        solution_data: { data: [['a', 'b', 'c']] },
        instructions: 'Do something',
        order_index: 999,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'Teacher Test Exercise');
    expect(res.body).toHaveProperty('course_id', courseId);
  });

  it('POST /api/teacher/exercises without course_id returns 400', async () => {
    const res = await supertest(app)
      .post('/api/teacher/exercises')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'No course' });

    expect(res.status).toBe(400);
  });

  it('POST /api/teacher/exercises with invalid course_id returns 404', async () => {
    const res = await supertest(app)
      .post('/api/teacher/exercises')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ course_id: 'nonexistent-course', title: 'Bad course' });

    expect(res.status).toBe(404);
  });

  it('PUT /api/teacher/exercises/:id updates an exercise', async () => {
    const createRes = await supertest(app)
      .post('/api/teacher/exercises')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ course_id: courseId, title: 'Update Ex', description: 'Old' });

    const res = await supertest(app)
      .put(`/api/teacher/exercises/${createRes.body.id}`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Updated Exercise', instructions: 'New instructions' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('DELETE /api/teacher/exercises/:id deletes an exercise', async () => {
    const createRes = await supertest(app)
      .post('/api/teacher/exercises')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ course_id: courseId, title: 'Delete Ex' });

    const res = await supertest(app)
      .delete(`/api/teacher/exercises/${createRes.body.id}`)
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  // ── STUDENT OVERVIEW ────────────────────────────────────────

  it('GET /api/teacher/students returns student list', async () => {
    const res = await supertest(app)
      .get('/api/teacher/students')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const student = res.body.find((s: any) => s.name === 'Test Student');
    expect(student).toBeDefined();
    expect(student).toHaveProperty('exercises_attempted');
    expect(student).toHaveProperty('avg_score');
    expect(student).toHaveProperty('exercises_completed');
  });

  it('GET /api/teacher/students/:id returns student detail', async () => {
    const studentsRes = await supertest(app)
      .get('/api/teacher/students')
      .set('Authorization', `Bearer ${teacherToken}`);

    const studentId = studentsRes.body.find((s: any) => s.name === 'Test Student').id;

    const res = await supertest(app)
      .get(`/api/teacher/students/${studentId}`)
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Student');
    expect(res.body).toHaveProperty('progress');
    expect(Array.isArray(res.body.progress)).toBe(true);
  });

  it('GET /api/teacher/students/:id with non-student id returns 404', async () => {
    const res = await supertest(app)
      .get('/api/teacher/students/nonexistent-id')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(404);
  });

  // ── ANALYTICS ───────────────────────────────────────────────

  it('GET /api/teacher/analytics returns exercise stats', async () => {
    const res = await supertest(app)
      .get('/api/teacher/analytics')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('course_title');
      expect(res.body[0]).toHaveProperty('avg_score');
    }
  });
});
