describe('Auth Routes', () => {
  let app: any;

  beforeAll(async () => {
    // Set required env for tests
    process.env.JWT_SECRET = 'test-secret-key-for-jest';
    process.env.DB_PATH = ':memory:';
    
    // Lazy import after env is set
    const { default: expressApp } = await import('../server');
    app = expressApp;
  });

  it('POST /api/auth/register with valid data returns 201', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'test1234', name: 'Test User' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('POST /api/auth/register with invalid email returns 400', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalid', password: 'test1234', name: 'Test' });
    
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register with weak password returns 400', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test2@example.com', password: '123', name: 'Test' });
    
    expect(res.status).toBe(400);
  });

  it('GET /api/health returns 200', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('POST /api/auth/login with valid credentials returns 200', async () => {
    const request = (await import('supertest')).default;
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'logintest@ex.com', password: 'test1234', name: 'LoginTester' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'logintest@ex.com', password: 'test1234' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'logintest@ex.com');
  });

  it('POST /api/auth/login with wrong password returns 401', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'logintest@ex.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login with non-existent email returns 401', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@ex.com', password: 'test1234' });

    expect(res.status).toBe(401);
  });

  it('POST /api/auth/register with duplicate email returns 409', async () => {
    const request = (await import('supertest')).default;
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'duplicate@ex.com', password: 'test1234', name: 'Dup' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'duplicate@ex.com', password: 'test5678', name: 'Dup2' });

    expect(res.status).toBe(409);
  });

  it('GET /api/auth/me returns user info', async () => {
    const request = (await import('supertest')).default;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'metest@ex.com', password: 'test1234', name: 'Me Tester' });
    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'metest@ex.com');
    expect(res.body).toHaveProperty('name', 'Me Tester');
    expect(res.body).toHaveProperty('role', 'student');
  });

  it('GET /api/auth/me with invalid token returns 401', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token-here');

    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me without token returns 401', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/register with short password (< 8 chars) returns 400', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'shortpw@ex.com', password: 'abc12', name: 'Short PW' });

    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register with password missing numbers returns 400', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nonumpw@ex.com', password: 'abcdefgh', name: 'NoNum' });

    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register with password missing letters returns 400', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'noletterpw@ex.com', password: '12345678', name: 'NoLetter' });

    expect(res.status).toBe(400);
  });
});
