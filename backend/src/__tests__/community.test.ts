import supertest from 'supertest';

describe('Community Routes', () => {
  let app: any;
  let token: string;
  let exerciseId: string;
  let commentId: string;

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
      .send({ email: 'communitytest@ex.com', password: 'test1234', name: 'Community Tester' });
    token = res.body.token;

    // Get an exercise ID for testing
    const coursesRes = await supertest(app).get('/api/courses');
    const courseRes = await supertest(app)
      .get(`/api/courses/${coursesRes.body[0].id}`)
      .set('Authorization', `Bearer ${token}`);
    exerciseId = courseRes.body.exercises[0].id;
  });

  it('GET /api/community/exercise/:id returns empty comments', async () => {
    const res = await supertest(app)
      .get(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('comments');
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it('GET /api/community/exercise/:id without auth returns 401', async () => {
    const res = await supertest(app).get(`/api/community/exercise/${exerciseId}`);
    expect(res.status).toBe(401);
  });

  it('POST /api/community/exercise/:id creates a comment', async () => {
    const res = await supertest(app)
      .post(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Tolle Übung! Sehr hilfreich.' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('comment');
    expect(res.body.comment).toHaveProperty('content', 'Tolle Übung! Sehr hilfreich.');
    expect(res.body.comment).toHaveProperty('user_name', 'Community Tester');
    commentId = res.body.comment.id;
  });

  it('GET comments includes the newly created comment', async () => {
    const res = await supertest(app)
      .get(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.comments.length).toBeGreaterThanOrEqual(1);
    expect(res.body.comments[0].content).toBe('Tolle Übung! Sehr hilfreich.');
  });

  it('POST comment with empty content returns 400', async () => {
    const res = await supertest(app)
      .post(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '   ' });

    expect(res.status).toBe(400);
  });

  it('POST comment exceeding 2000 chars returns 400', async () => {
    const longText = 'A'.repeat(2001);
    const res = await supertest(app)
      .post(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: longText });

    expect(res.status).toBe(400);
  });

  it('POST reply to a comment (nested)', async () => {
    // First create a parent comment
    const parentRes = await supertest(app)
      .post(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Parent comment' });

    const parentId = parentRes.body.comment.id;

    // Then reply
    const replyRes = await supertest(app)
      .post(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'This is a reply', parent_id: parentId });

    expect(replyRes.status).toBe(201);
    expect(replyRes.body.comment.parent_id).toBe(parentId);
  });

  it('DELETE /api/community/:id deletes own comment', async () => {
    // Create a comment to delete
    const createRes = await supertest(app)
      .post(`/api/community/exercise/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Comment to delete' });

    const delRes = await supertest(app)
      .delete(`/api/community/${createRes.body.comment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body).toHaveProperty('deleted', true);
  });

  it('DELETE non-existent comment returns 404', async () => {
    const res = await supertest(app)
      .delete('/api/community/nonexistent-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
