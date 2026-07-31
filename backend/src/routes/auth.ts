import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
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

  const id = uuid();
  const hash = await bcrypt.hash(password, 10);
  db.prepare(
    'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, hash, name, 'student');

  const token = generateToken({ userId: id, email, role: 'student' });
  logger.info('User registered', { userId: id, email });
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
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  res.json(user);
});

export default router;
