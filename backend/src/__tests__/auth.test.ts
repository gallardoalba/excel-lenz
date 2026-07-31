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
});
