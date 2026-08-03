// JWT_SECRET must be set BEFORE importing the auth module (it validates at load time)
process.env.JWT_SECRET = 'test-secret-key-for-jest';

import { authMiddleware, optionalAuth, generateToken, AuthPayload } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  // ── generateToken ───────────────────────────────────────────

  it('generateToken returns a JWT string', () => {
    const payload: AuthPayload = { userId: 'test-id', email: 'test@ex.com', role: 'student' };
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('generateToken tokens are different for different users', () => {
    const token1 = generateToken({ userId: 'id-1', email: 'a@ex.com', role: 'student' });
    const token2 = generateToken({ userId: 'id-2', email: 'b@ex.com', role: 'student' });
    expect(token1).not.toBe(token2);
  });

  // ── authMiddleware ──────────────────────────────────────────

  it('authMiddleware rejects requests without Authorization header', () => {
    const req = { headers: {}, path: '/test' } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authMiddleware rejects requests with Bearer prefix but no token', () => {
    const req = { headers: { authorization: 'Bearer ' }, path: '/test' } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authMiddleware rejects requests with invalid JWT', () => {
    const req = { headers: { authorization: 'Bearer invalid.jwt.token' }, path: '/test' } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authMiddleware rejects requests without Bearer prefix', () => {
    const token = generateToken({ userId: 'x', email: 'x@ex.com', role: 'student' });
    const req = { headers: { authorization: token }, path: '/test' } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authMiddleware sets req.user on valid token and calls next', () => {
    const token = generateToken({ userId: 'abc-123', email: 'valid@ex.com', role: 'teacher' });
    const req = { headers: { authorization: `Bearer ${token}` }, path: '/test' } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toBeDefined();
    expect((req as any).user.userId).toBe('abc-123');
    expect((req as any).user.email).toBe('valid@ex.com');
    expect((req as any).user.role).toBe('teacher');
  });

  // ── optionalAuth ────────────────────────────────────────────

  it('optionalAuth calls next without setting user when no token', () => {
    const req = { headers: {}, path: '/test' } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toBeUndefined();
  });

  it('optionalAuth sets req.user when valid token provided', () => {
    const token = generateToken({ userId: 'opt-1', email: 'opt@ex.com', role: 'student' });
    const req = { headers: { authorization: `Bearer ${token}` }, path: '/test' } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toBeDefined();
    expect((req as any).user.userId).toBe('opt-1');
  });

  it('optionalAuth calls next even with invalid token (no rejection)', () => {
    const req = { headers: { authorization: 'Bearer garbage' }, path: '/test' } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toBeUndefined();
  });
});
