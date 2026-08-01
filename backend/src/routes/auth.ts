import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from '../db/database';
import { generateToken, authMiddleware, AuthPayload } from '../middleware/auth';
import logger from '../utils/logger';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();

// ── Simple in-memory rate limiter for login (by IP + email) ──
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

router.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }
  const { email, password, name } = parsed.data;

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'Registrierung fehlgeschlagen. Überprüfe deine Eingaben.' });
    return;
  }

  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 10);
  db.prepare(
    'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, hash, name, 'student');

  const token = generateToken({ userId: id, email, role: 'student' });

  // Generate email verification token
  const verifyToken = crypto.randomBytes(24).toString('hex');
  const verifyExpires = new Date(Date.now() + 86400000).toISOString(); // 24 hours
  db.prepare(
    'INSERT INTO email_verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
  ).run(crypto.randomUUID(), id, verifyToken, verifyExpires);

  logger.info('User registered', { userId: id, email });
  console.log(`   📧 Email verification: http://localhost:5173/verify-email?token=${verifyToken}`);
  res.status(201).json({ token, user: { id, email, name, role: 'student' } });
});

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Ungültige Eingabe. E-Mail und Passwort sind erforderlich.' });
    return;
  }
  const { email, password } = parsed.data;

  // Rate limiting by IP and email
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip) || !checkRateLimit(`email:${email}`)) {
    res.status(429).json({ error: 'Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.' });
    return;
  }

  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, password_hash, name, role FROM users WHERE email = ?'
  ).get(email) as { id: string; email: string; password_hash: string; name: string; role: string } | undefined;

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    return;
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  logger.info('User logged in', { userId: user.id });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

router.get('/me', authMiddleware, (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, name, role, created_at FROM users WHERE id = ?'
  ).get(userId);

  if (!user) {
    res.status(404).json({ error: 'Benutzer nicht gefunden' });
    return;
  }
  res.json(user);
});

// ── Password Reset ──────────────────────────────────────────

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'E-Mail ist erforderlich' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined;

  // Always return success to prevent email enumeration
  if (!user) {
    res.json({ message: 'Falls ein Konto existiert, wurde eine E-Mail gesendet.' });
    return;
  }

  // Generate reset token (valid for 1 hour)
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000).toISOString();

  db.prepare(
    'INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
  ).run(crypto.randomUUID(), user.id, token, expiresAt);

  logger.info('Password reset requested', { userId: user.id });
  // In production: send email with link containing token
  // For now: log the reset link (would be sent via email)
  console.log(`   🔗 Password reset link: http://localhost:5173/reset-password/${token}`);

  res.json({ message: 'Falls ein Konto existiert, wurde eine E-Mail gesendet.' });
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400).json({ error: 'Token und neues Passwort sind erforderlich' });
    return;
  }

  // Validate password strength
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben und Buchstaben + Zahlen enthalten' });
    return;
  }

  const db = getDb();
  const resetToken = db.prepare(
    'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > datetime(\'now\')'
  ).get(token) as any;

  if (!resetToken) {
    res.status(400).json({ error: 'Link ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.' });
    return;
  }

  // Update password
  const hash = await bcrypt.hash(password, 10);
  db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(hash, resetToken.user_id);
  db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').run(resetToken.id);

  logger.info('Password reset completed', { userId: resetToken.user_id });
  res.json({ message: 'Passwort erfolgreich zurückgesetzt.' });
});

// ── Email Verification ──────────────────────────────────────

router.post('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: 'Token ist erforderlich' });
    return;
  }

  const db = getDb();
  const verifyToken = db.prepare(
    'SELECT * FROM email_verification_tokens WHERE token = ? AND expires_at > datetime(\'now\')'
  ).get(token) as any;

  if (!verifyToken) {
    res.status(400).json({ error: 'Link ungültig oder abgelaufen.' });
    return;
  }

  db.prepare('DELETE FROM email_verification_tokens WHERE user_id = ?').run(verifyToken.user_id);
  logger.info('Email verified', { userId: verifyToken.user_id });
  res.json({ verified: true, message: 'E-Mail erfolgreich bestätigt.' });
});

export default router;
