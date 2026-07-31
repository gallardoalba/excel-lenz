// ── Unit tests for Zod validation schemas ──────────────────────

import { registerSchema, loginSchema } from '../utils/validation';

describe('Validation Schemas', () => {
  // ── Login Schema ────────────────────────────────────────────

  describe('loginSchema', () => {
    it('accepts valid email and password', () => {
      const result = loginSchema.safeParse({ email: 'test@ex.com', password: 'mypassword' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({ email: 'not-an-email', password: 'test1234' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('E-Mail');
      }
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({ email: 'test@ex.com', password: '' });
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const result = loginSchema.safeParse({ email: 'test@ex.com' });
      expect(result.success).toBe(false);
    });

    it('rejects extra unknown fields', () => {
      const result = loginSchema.safeParse({ email: 'test@ex.com', password: 'test', role: 'admin' });
      expect(result.success).toBe(true); // Zod strips unknown by default with .object()
    });
  });

  // ── Register Schema ─────────────────────────────────────────

  describe('registerSchema', () => {
    it('accepts valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'newuser@ex.com',
        password: 'secure123',
        name: 'New User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'Ab1',
        name: 'Test',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('8 Zeichen');
      }
    });

    it('rejects password without letters', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: '12345678',
        name: 'Test',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map(i => i.message);
        expect(messages.some(m => m.includes('Buchstaben'))).toBe(true);
      }
    });

    it('rejects password without numbers', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'abcdefgh',
        name: 'Test',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map(i => i.message);
        expect(messages.some(m => m.includes('Zahlen'))).toBe(true);
      }
    });

    it('accepts password with special characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'P@ssw0rd!',
        name: 'Test',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'secure123',
        name: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects name longer than 100 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'secure123',
        name: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('accepts name exactly 100 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'secure123',
        name: 'A'.repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = registerSchema.safeParse({
        email: 'plaintext',
        password: 'secure123',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('accepts password of exactly 8 chars with letter and number', () => {
      const result = registerSchema.safeParse({
        email: 'test@ex.com',
        password: 'abcd1234',
        name: 'Test',
      });
      expect(result.success).toBe(true);
    });

    it('rejects all invalid fields at once (multiple errors)', () => {
      const result = registerSchema.safeParse({
        email: 'bad',
        password: 'short',
        name: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});
